# watch-agents.ps1 - live feed of the agent-loop (director + figma-navigator + component-builder)
# with token usage per call, per agent and per component session.
# Read-only and free: it only tails the transcripts `claude -p` writes; no API calls.
# Usage: powershell -ExecutionPolicy Bypass -File watch-agents.ps1 [-All] [-SummaryEvery 30]
#   -All           also show interactive sessions (by default only `claude -p --agent` loop sessions:
#                  director, component-builder, ...; each loop step is its own session)
#   -SummaryEvery  seconds between token summary tables (printed only when something changed)
#   -Once          replay every recent loop session, print the recap (per agent, per component,
#                  per session) and exit. -Replay N sets how many sessions to read (default 500).
#   -Budget        your own token budget per 5-hour window; shows what is left. The real plan
#                  limit is only known to Anthropic's servers, so this is an estimate you set.
param(
  [string]$Dir = "$env:USERPROFILE\.claude\projects\E--Girhub-ecormce-webstie",
  [int]$Backlog = 15,        # lines to replay from the active file on start
  [int]$SummaryEvery = 30,
  [int]$ContextLimit = 200000,
  [int]$BigResult = 5000,    # flag tool results larger than this many characters
  [long]$Budget = 0,
  [int]$SummaryRows = 8,     # agent sessions listed in the token summary         # tokens per 5-hour window (0 = only show usage)
  [int]$Replay = 0,          # sessions replayed at start (0 = $SummaryRows, or 500 with -Once)
  [switch]$Once,
  [switch]$All
)
if ($Replay -le 0) { $Replay = if ($Once) { 500 } else { $SummaryRows } }

$pos = @{}        # file -> bytes read
$labels = @{}     # file -> agent label
$stats = @{}      # file -> per-agent token stats
$pending = @{}    # tool_use id -> tool name, to name big results
$sessionOk = @{}  # session id -> is a loop session (`claude -p --agent <name>`)
$sessionAgent = @{} # session id -> agent name of that session
$current = $null  # session id shown in the summary
$dirty = $false
$lastSummary = Get-Date
$colors = @{ 'director' = 'Cyan'; 'figma-navigator' = 'Magenta'; 'component-builder' = 'Green' }
$root = Split-Path $Dir -Parent  # all projects: the usage limit is per account
$winPos = @{}     # file -> bytes scanned for the 5-hour window
$winSeen = New-Object 'System.Collections.Generic.HashSet[string]'
$winEntries = New-Object 'System.Collections.Generic.List[object]'
$lastWindow = [DateTime]::MinValue
$window = $null
$full = [string][char]0x2588
$empty = [string][char]0x2591

function Get-Session($file) {
  $parent = Split-Path $file -Parent
  if ((Split-Path $parent -Leaf) -eq 'subagents') { return Split-Path (Split-Path $parent -Parent) -Leaf }
  return [IO.Path]::GetFileNameWithoutExtension($file)
}

# Loop sessions write an `agent-setting` line with "director" near the top of their transcript.
function Test-Session($session) {
  if ($All) { return $true }
  if ($sessionOk.ContainsKey($session)) { return $sessionOk[$session] }
  $top = Join-Path $Dir "$session.jsonl"
  $ok = $false
  if (Test-Path $top) {
    $head = Get-Content $top -TotalCount 30 -Encoding UTF8 -ErrorAction SilentlyContinue
    $hit = $head | Where-Object { $_ -match '"agentSetting":"([a-z-]+)"' } | Select-Object -First 1
    if ($hit -and $hit -match '"agentSetting":"([a-z-]+)"') { $ok = $true; $sessionAgent[$session] = $Matches[1] }
    $sessionOk[$session] = $ok
  }
  return $ok
}

function Get-Label($file) {
  if ($labels.ContainsKey($file)) { return $labels[$file] }
  $label = 'chat'
  $session = Get-Session $file
  if ($sessionAgent.ContainsKey($session)) { $label = $sessionAgent[$session] }
  $meta = $file -replace '\.jsonl$', '.meta.json'
  if (Test-Path $meta) {
    try { $label = (Get-Content $meta -Raw | ConvertFrom-Json).agentType } catch {}
  }
  $labels[$file] = $label
  return $label
}

# The loop prompts say "Build <Name> (slug <slug>)" / "Review <Name> (slug <slug>, ...)".
function Get-Component($file) {
  $top = Join-Path $Dir ((Get-Session $file) + '.jsonl')
  if (-not (Test-Path $top)) { return '-' }
  $head = Get-Content $top -TotalCount 12 -Encoding UTF8 -ErrorAction SilentlyContinue
  foreach ($l in $head) { if ($l -match 'slug ([a-z0-9-]+)') { return $Matches[1] } }
  return '-'
}

function Get-Stats($file) {
  if (-not $stats.ContainsKey($file)) {
    $stats[$file] = [pscustomobject]@{
      Label = (Get-Label $file); Session = (Get-Session $file); Model = ''; Component = (Get-Component $file)
      Calls = 0; First = 0; Ctx = 0; Peak = 0; Total = 0; Out = 0; Images = 0
      Seen = New-Object 'System.Collections.Generic.HashSet[string]'; Start = (Get-Date)
    }
  }
  return $stats[$file]
}

function Format-K($n) {
  if ($n -ge 1000000) { return '{0:N2}M' -f ($n / 1000000) }
  return '{0:N1}k' -f ($n / 1000)
}

function Get-Bar($ctx, $width = 20) {
  $fill = [Math]::Min($width, [Math]::Round($width * $ctx / $ContextLimit))
  return ($full * $fill) + ($empty * ($width - $fill))
}

function Get-BarColor($ctx) {
  if ($ctx -gt 100000) { return 'Red' }
  if ($ctx -gt 60000) { return 'Yellow' }
  return 'Green'
}

function Show-Line($file, $line) {
  try { $j = $line | ConvertFrom-Json } catch { return }
  $label = Get-Label $file
  $color = $colors[$label]; if (-not $color) { $color = 'White' }
  $t = Get-Date -Format 'HH:mm:ss'

  if ($j.type -eq 'user' -and $j.message.content -is [array]) {
    foreach ($c in $j.message.content) {
      if ($c.type -ne 'tool_result') { continue }
      $size = 0; $img = 0
      if ($c.content -is [array]) {
        foreach ($p in $c.content) { if ($p.type -eq 'image') { $img++ } elseif ($p.text) { $size += $p.text.Length } }
      } elseif ($c.content) { $size = ([string]$c.content).Length }
      $s = Get-Stats $file
      $s.Images += $img
      $name = $pending[$c.tool_use_id]
      if ($size -gt $BigResult) {
        Write-Host ("{0} [{1}]   ! big result {2} chars from {3} (~{4} tokens, re-sent every later call)" -f $t, $label, $size, $name, (Format-K ($size / 4))) -ForegroundColor Yellow
      }
      if ($img) { Write-Host "$t [$label]   + $img image(s) from $name (~1.5k tokens each)" -ForegroundColor DarkYellow }
    }
    return
  }
  if ($j.type -ne 'assistant') { return }

  # Parallel tool calls repeat the same message id with the same usage: count it once.
  $u = $j.message.usage
  if ($u) {
    $s = Get-Stats $file
    $id = [string]$j.message.id
    if ($s.Seen.Add($id)) {
      $ctx = [int]$u.input_tokens + [int]$u.cache_read_input_tokens + [int]$u.cache_creation_input_tokens
      $s.Calls++; $s.Ctx = $ctx; $s.Out += [int]$u.output_tokens
      if (-not $s.First) { $s.First = $ctx }
      if ($ctx -gt $s.Peak) { $s.Peak = $ctx }
      $s.Total += $ctx + [int]$u.output_tokens
      $s.Model = ([string]$j.message.model) -replace '^claude-', ''
      $script:dirty = $true
      $script:current = $s.Session
      Write-Host ("{0} [{1}] call {2,-3} ctx {3,7} " -f $t, $label, $s.Calls, (Format-K $ctx)) -NoNewline -ForegroundColor DarkGray
      Write-Host (Get-Bar $ctx) -NoNewline -ForegroundColor (Get-BarColor $ctx)
      Write-Host ("  total {0}" -f (Format-K $s.Total)) -ForegroundColor DarkGray
    }
  }

  foreach ($c in $j.message.content) {
    if ($c.type -eq 'text' -and $c.text.Trim()) {
      $txt = ($c.text -replace '\s+', ' ').Trim()
      if ($txt.Length -gt 220) { $txt = $txt.Substring(0, 220) + '...' }
      Write-Host "$t [$label] $txt" -ForegroundColor $color
    }
    elseif ($c.type -eq 'tool_use') {
      $pending[$c.id] = $c.name -replace '^mcp__TalkToFigma__', 'figma:'
      $i = $c.input
      $detail = @($i.description, $i.command, $i.file_path, $i.pattern, $i.nodeId) | Where-Object { $_ } | Select-Object -First 1
      if ($detail) { $detail = ($detail -replace '\s+', ' ') } else { $detail = '' }
      if ($detail.Length -gt 160) { $detail = $detail.Substring(0, 160) + '...' }
      Write-Host "$t [$label]   > $($c.name) $detail" -ForegroundColor DarkGray
    }
  }
}

function Show-Summary {
  # Each loop step (builder, director review) is its own session: show the latest ones.
  $rows = $stats.Values | Sort-Object Start | Select-Object -Last $SummaryRows
  if (-not $rows) { return }
  $sum = ($rows | Measure-Object -Property Total -Sum).Sum
  Write-Host ''
  Write-Host ("=== tokens, last {0} agent sessions ===" -f ($rows | Measure-Object).Count) -ForegroundColor Yellow
  Write-Host ("{0,-20} {1,-11} {2,5} {3,7} {4,7}  {5,-20} {6,8} {7,4}" -f 'agent', 'model', 'calls', 'start', 'peak', 'context now', 'total', 'img') -ForegroundColor DarkGray
  foreach ($r in $rows) {
    $color = $colors[$r.Label]; if (-not $color) { $color = 'White' }
    Write-Host ("{0,-20} {1,-11} {2,5} {3,7} {4,7}  " -f $r.Label, $r.Model, $r.Calls, (Format-K $r.First), (Format-K $r.Peak)) -NoNewline -ForegroundColor $color
    Write-Host (Get-Bar $r.Ctx) -NoNewline -ForegroundColor (Get-BarColor $r.Ctx)
    Write-Host (" {0,8} {1,4}" -f (Format-K $r.Total), $r.Images) -ForegroundColor $color
  }
  # Share of the session per agent, as one bar.
  foreach ($r in $rows) {
    $n = [Math]::Max(1, [Math]::Round(40 * $r.Total / [Math]::Max(1, $sum)))
    Write-Host ($full * $n) -NoNewline -ForegroundColor $(if ($colors[$r.Label]) { $colors[$r.Label] } else { 'White' })
  }
  Write-Host ("  total {0}" -f (Format-K $sum)) -ForegroundColor Yellow
  Show-Rollups
  Show-Window
  Write-Host ''
}

# Totals over every session seen so far: per agent type and per component.
function Show-Rollups {
  $all = $stats.Values
  if (-not $all) { return }
  Write-Host ''
  Write-Host '--- per agent (all sessions seen) ---' -ForegroundColor Yellow
  Write-Host ('{0,-20} {1,8} {2,6} {3,9} {4,9} {5,9}' -f 'agent', 'sessions', 'calls', 'out', 'total', 'avg/sess') -ForegroundColor DarkGray
  foreach ($g in ($all | Group-Object Label | Sort-Object { ($_.Group | Measure-Object Total -Sum).Sum } -Descending)) {
    $tot = ($g.Group | Measure-Object Total -Sum).Sum
    $color = $colors[$g.Name]; if (-not $color) { $color = 'White' }
    Write-Host ('{0,-20} {1,8} {2,6} {3,9} {4,9} {5,9}' -f $g.Name, $g.Count, ($g.Group | Measure-Object Calls -Sum).Sum,
      (Format-K ($g.Group | Measure-Object Out -Sum).Sum), (Format-K $tot), (Format-K ($tot / $g.Count))) -ForegroundColor $color
  }
  Write-Host ('{0,-20} {1,8} {2,6} {3,9} {4,9}' -f 'ALL', ($all | Measure-Object).Count, ($all | Measure-Object Calls -Sum).Sum,
    (Format-K ($all | Measure-Object Out -Sum).Sum), (Format-K ($all | Measure-Object Total -Sum).Sum)) -ForegroundColor Yellow
  Write-Host '--- per component (builder + director) ---' -ForegroundColor Yellow
  Write-Host ('{0,-26} {1,8} {2,9} {3,9} {4,9}' -f 'component', 'sessions', 'builder', 'director', 'total') -ForegroundColor DarkGray
  foreach ($g in ($all | Where-Object { $_.Component -ne '-' } | Group-Object Component |
      Sort-Object { ($_.Group | Measure-Object Total -Sum).Sum } -Descending | Select-Object -First 15)) {
    $b = ($g.Group | Where-Object Label -eq 'component-builder' | Measure-Object Total -Sum).Sum
    $d = ($g.Group | Where-Object Label -eq 'director' | Measure-Object Total -Sum).Sum
    Write-Host ('{0,-26} {1,8} {2,9} {3,9} {4,9}' -f $g.Name, $g.Count, (Format-K $b), (Format-K $d), (Format-K ($g.Group | Measure-Object Total -Sum).Sum))
  }
  Write-Host 'total = context re-read on every call + output, so it is far above billed new tokens.' -ForegroundColor DarkGray
}

# Usage in the current 5-hour window across every project. A window starts at the
# hour of the first message after the previous window ended and lasts 5 hours.
function Update-Window {
  $since = (Get-Date).AddHours(-10)
  Get-ChildItem $root -Recurse -Filter *.jsonl -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -gt $since } | ForEach-Object {
      $file = $_.FullName
      $start = 0; if ($winPos.ContainsKey($file)) { $start = $winPos[$file] }
      if ($_.Length -le $start) { return }
      $fs = [IO.File]::Open($file, 'Open', 'Read', 'ReadWrite')
      try {
        $fs.Position = $start
        $buf = New-Object byte[] ($fs.Length - $start)
        $read = $fs.Read($buf, 0, $buf.Length)
      } finally { $fs.Close() }
      $last = [Array]::LastIndexOf($buf, [byte]10, $read - 1)
      if ($last -lt 0) { return }
      $winPos[$file] = $start + $last + 1
      foreach ($line in ([Text.Encoding]::UTF8.GetString($buf, 0, $last + 1) -split "`n")) {
        if ($line -notmatch '"type":"assistant"' -or $line -notmatch '"usage"') { continue }
        if ($line -notmatch '"id":"(msg_[^"]+)"') { continue }
        if (-not $winSeen.Add($Matches[1])) { continue }
        if ($line -notmatch '"timestamp":"([^"]+)"') { continue }
        $time = [DateTimeOffset]::Parse($Matches[1]).LocalDateTime
        $n = @{}
        foreach ($k in 'input_tokens', 'cache_creation_input_tokens', 'cache_read_input_tokens', 'output_tokens') {
          $n[$k] = 0; if ($line -match ('"' + $k + '":(\d+)')) { $n[$k] = [long]$Matches[1] }
        }
        $model = ''; if ($line -match '"model":"claude-([a-z]+)') { $model = $Matches[1] }
        $winEntries.Add([pscustomobject]@{
          Time = $time; Model = $model
          New = $n['input_tokens'] + $n['cache_creation_input_tokens'] + $n['output_tokens']
          Cached = $n['cache_read_input_tokens']
        })
      }
    }

  $blockStart = $null; $blockEnd = $null
  foreach ($e in ($winEntries | Sort-Object Time)) {
    if (-not $blockEnd -or $e.Time -ge $blockEnd) {
      $blockStart = $e.Time.Date.AddHours($e.Time.Hour); $blockEnd = $blockStart.AddHours(5)
    }
  }
  if (-not $blockEnd -or (Get-Date) -ge $blockEnd) { $script:window = $null; return }
  $in = $winEntries | Where-Object { $_.Time -ge $blockStart }
  $models = $in | Group-Object Model | ForEach-Object {
    "$($_.Name) $(Format-K (($_.Group | Measure-Object New -Sum).Sum + ($_.Group | Measure-Object Cached -Sum).Sum))"
  }
  $script:window = [pscustomobject]@{
    Start = $blockStart; End = $blockEnd
    New = [long](($in | Measure-Object New -Sum).Sum)
    Cached = [long](($in | Measure-Object Cached -Sum).Sum)
    Models = ($models -join ', ')
  }
}

function Show-Window {
  if (-not $window) { Write-Host "5h window: no usage yet (new window starts with the next message)" -ForegroundColor DarkGray; return }
  $total = $window.New + $window.Cached
  $left = $window.End - (Get-Date)
  Write-Host ("5h window {0:HH:mm}-{1:HH:mm}, resets in {2}h{3:00}m | used {4} (new {5}, cache reads {6}) | {7}" -f `
    $window.Start, $window.End, [int][Math]::Floor($left.TotalHours), $left.Minutes, (Format-K $total), (Format-K $window.New), (Format-K $window.Cached), $window.Models) -ForegroundColor Yellow
  if ($Budget -gt 0) {
    $rest = [Math]::Max(0, $Budget - $total)
    $pct = [Math]::Round(100 * $rest / $Budget)
    $fill = [Math]::Round(30 * ($Budget - $rest) / $Budget)
    $color = if ($pct -lt 15) { 'Red' } elseif ($pct -lt 40) { 'Yellow' } else { 'Green' }
    Write-Host 'budget    ' -NoNewline -ForegroundColor Yellow
    Write-Host (($full * $fill) + ($empty * (30 - $fill))) -NoNewline -ForegroundColor $color
    Write-Host (" {0} left of {1} ({2}%)" -f (Format-K $rest), (Format-K $Budget), $pct) -ForegroundColor $color
  }
}

function Update-Title {
  $rows = $stats.Values | Sort-Object Start | Select-Object -Last $SummaryRows
  $sum = ($rows | Measure-Object -Property Total -Sum).Sum
  $live = $rows | Sort-Object { $_.Seen.Count } -Descending | Select-Object -First 1
  $win = ''
  if ($window) {
    $used = $window.New + $window.Cached
    $win = " | 5h $(Format-K $used)"
    if ($Budget -gt 0) { $win += " ($([Math]::Round(100 * [Math]::Max(0, $Budget - $used) / $Budget))% left)" }
    $win += " resets $('{0:HH:mm}' -f $window.End)"
  }
  try { $Host.UI.RawUI.WindowTitle = "agents $(Format-K $sum) | $(($rows | Measure-Object).Count) agents | ctx $(Format-K $live.Ctx)$win" } catch {}
}

function Read-New($file) {
  $item = Get-Item $file -ErrorAction SilentlyContinue
  if (-not $item) { return }
  $start = 0; if ($pos.ContainsKey($file)) { $start = $pos[$file] }
  if ($item.Length -le $start) { return }
  $fs = [IO.File]::Open($file, 'Open', 'Read', 'ReadWrite')
  try {
    $fs.Position = $start
    $buf = New-Object byte[] ($fs.Length - $start)
    $read = $fs.Read($buf, 0, $buf.Length)
  } finally { $fs.Close() }
  # Only consume complete lines; keep a partial trailing line for next poll.
  $last = [Array]::LastIndexOf($buf, [byte]10, $read - 1)
  if ($last -lt 0) { return }
  $pos[$file] = $start + $last + 1
  $text = [Text.Encoding]::UTF8.GetString($buf, 0, $last + 1)
  foreach ($line in ($text -split "`n")) { if ($line.Trim()) { Show-Line $file $line } }
}

# Start at the end of existing files, but replay the newest loop session so the
# token summary has its numbers (only the last $Backlog lines are printed).
$existing = Get-ChildItem $Dir -Recurse -Filter *.jsonl -ErrorAction SilentlyContinue
foreach ($f in $existing) { $pos[$f.FullName] = $f.Length }
$recent = $existing | Where-Object { Test-Session (Get-Session $_.FullName) } |
  Sort-Object LastWriteTime -Descending | Select-Object -First $Replay
$newest = $recent | Select-Object -First 1
if ($newest) {
  $files = $recent | Sort-Object LastWriteTime
  foreach ($f in $files) {
    $lines = Get-Content $f.FullName -Encoding UTF8
    $quiet = if ($f.FullName -eq $newest.FullName) { [Math]::Max(0, $lines.Count - $Backlog) } else { $lines.Count }
    for ($k = 0; $k -lt $lines.Count; $k++) {
      if ($k -lt $quiet) {
        # Count tokens without printing.
        $null = & { Show-Line $f.FullName $lines[$k] } 6>$null
      } else { Show-Line $f.FullName $lines[$k] }
    }
  }
  Update-Window
  Show-Summary; Update-Title
  $dirty = $false
}
if ($Once) { return }
Write-Host "--- watching $Dir (Ctrl+C to stop) ---" -ForegroundColor Yellow

while ($true) {
  $cutoff = (Get-Date).AddMinutes(-10)
  Get-ChildItem $Dir -Recurse -Filter *.jsonl -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -gt $cutoff -and (Test-Session (Get-Session $_.FullName)) } |
    ForEach-Object { Read-New $_.FullName }
  if (((Get-Date) - $lastWindow).TotalSeconds -ge 60) {
    Update-Window; $lastWindow = Get-Date; Update-Title
  }
  if ($dirty) { Update-Title }
  if ($dirty -and ((Get-Date) - $lastSummary).TotalSeconds -ge $SummaryEvery) {
    Show-Summary
    $dirty = $false
    $lastSummary = Get-Date
  }
  Start-Sleep -Milliseconds 1500
}

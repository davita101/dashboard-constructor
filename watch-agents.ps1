# watch-agents.ps1 - live feed of the agent-loop (director + figma-navigator + component-builder)
# with token usage per call, per agent and per component session.
# Read-only and free: it only tails the transcripts `claude -p` writes; no API calls.
# Usage: powershell -ExecutionPolicy Bypass -File watch-agents.ps1 [-All] [-SummaryEvery 30]
#   -All           also show interactive sessions (by default only `--agent director` loop sessions)
#   -SummaryEvery  seconds between token summary tables (printed only when something changed)
param(
  [string]$Dir = "$env:USERPROFILE\.claude\projects\E--Girhub-ecormce-webstie",
  [int]$Backlog = 15,        # lines to replay from the active file on start
  [int]$SummaryEvery = 30,
  [int]$ContextLimit = 200000,
  [int]$BigResult = 5000,    # flag tool results larger than this many characters
  [switch]$All
)

$pos = @{}        # file -> bytes read
$labels = @{}     # file -> agent label
$stats = @{}      # file -> per-agent token stats
$pending = @{}    # tool_use id -> tool name, to name big results
$sessionOk = @{}  # session id -> is a director loop session
$current = $null  # session id shown in the summary
$dirty = $false
$lastSummary = Get-Date
$colors = @{ 'director' = 'Cyan'; 'figma-navigator' = 'Magenta'; 'component-builder' = 'Green' }
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
    $ok = [bool]($head | Where-Object { $_ -match '"agentSetting":"director"' })
    $sessionOk[$session] = $ok
  }
  return $ok
}

function Get-Label($file) {
  if ($labels.ContainsKey($file)) { return $labels[$file] }
  $label = 'director'
  $meta = $file -replace '\.jsonl$', '.meta.json'
  if (Test-Path $meta) {
    try { $label = (Get-Content $meta -Raw | ConvertFrom-Json).agentType } catch {}
  }
  $labels[$file] = $label
  return $label
}

function Get-Stats($file) {
  if (-not $stats.ContainsKey($file)) {
    $stats[$file] = [pscustomobject]@{
      Label = (Get-Label $file); Session = (Get-Session $file); Model = ''
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
  if (-not $current) { return }
  $rows = $stats.Values | Where-Object { $_.Session -eq $current } | Sort-Object Start
  if (-not $rows) { return }
  $sum = ($rows | Measure-Object -Property Total -Sum).Sum
  Write-Host ''
  Write-Host ("=== tokens, session {0} ===" -f $current.Substring(0, 8)) -ForegroundColor Yellow
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
  Write-Host ("  session total {0}" -f (Format-K $sum)) -ForegroundColor Yellow
  Write-Host ''
}

function Update-Title {
  if (-not $current) { return }
  $rows = $stats.Values | Where-Object { $_.Session -eq $current }
  $sum = ($rows | Measure-Object -Property Total -Sum).Sum
  $live = $rows | Sort-Object { $_.Seen.Count } -Descending | Select-Object -First 1
  try { $Host.UI.RawUI.WindowTitle = "agents $(Format-K $sum) | $(($rows | Measure-Object).Count) agents | ctx $(Format-K $live.Ctx)" } catch {}
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
$newest = $existing | Where-Object { Test-Session (Get-Session $_.FullName) } |
  Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($newest) {
  $session = Get-Session $newest.FullName
  $files = $existing | Where-Object { (Get-Session $_.FullName) -eq $session } | Sort-Object LastWriteTime
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
  Show-Summary; Update-Title
  $dirty = $false
}
Write-Host "--- watching $Dir (Ctrl+C to stop) ---" -ForegroundColor Yellow

while ($true) {
  $cutoff = (Get-Date).AddMinutes(-10)
  Get-ChildItem $Dir -Recurse -Filter *.jsonl -ErrorAction SilentlyContinue |
    Where-Object { $_.LastWriteTime -gt $cutoff -and (Test-Session (Get-Session $_.FullName)) } |
    ForEach-Object { Read-New $_.FullName }
  if ($dirty) { Update-Title }
  if ($dirty -and ((Get-Date) - $lastSummary).TotalSeconds -ge $SummaryEvery) {
    Show-Summary
    $dirty = $false
    $lastSummary = Get-Date
  }
  Start-Sleep -Milliseconds 1500
}

# Builds the Figma components in design/agent-queue.md one by one.
# Per component: pick the next row, read the whole Figma page with `pnpm figma:spec`
# (a script, no LLM), then run component-builder and director as separate
# `claude -p` sessions (each its own process, so no background-subagent time limit).
# Rejections go back to the builder with design/handoff/<slug>/review.md, up to 3 attempts.
# Run: powershell -ExecutionPolicy Bypass -File scripts/agent-loop.ps1 [-Max 100]
# -Max counts components; usage-limit waits don't count.
# Needs the TalkToFigma socket server with the /figma-channel endpoint
# (E:\Girhub\cursor-talk-to-figma-mcp\src\socket.ts) and `pnpm dev` for screenshots.

param([int]$Max = 100)

$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
New-Item -ItemType Directory -Force "design/agent-logs" | Out-Null
$queue = Join-Path $root "design/agent-queue.md"
$utf8 = New-Object Text.UTF8Encoding $false

# The TalkToFigma channel changes whenever the plugin restarts. Ask the socket
# server which channel the plugin is in and store it in the queue's `Channel:`
# line. Waits while no plugin is connected.
function Sync-Channel {
  while ($true) {
    try {
      $channel = (Invoke-WebRequest -UseBasicParsing -TimeoutSec 5 "http://127.0.0.1:3055/figma-channel").Content.Trim()
    } catch {
      $channel = ""
    }
    if ($channel) { break }
    Write-Host "No Figma plugin on the socket server. Start TalkToFigma in Figma; checking again in 30s."
    Start-Sleep -Seconds 30
  }
  $lines = [IO.File]::ReadAllLines($queue)
  $current = ($lines[0] -replace '^Channel:\s*', '').Trim()
  if ($channel -ne $current) {
    $lines[0] = "Channel: $channel"
    [IO.File]::WriteAllLines($queue, $lines, $utf8)
    Write-Host "Channel changed: $current -> $channel"
  }
  return $channel
}

# Windows toast (falls back to a message box) so the user sees it away from the terminal.
function Send-Notification($title, $text) {
  try {
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
    [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null
    $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
    $xml.LoadXml("<toast><visual><binding template='ToastGeneric'><text>$([Security.SecurityElement]::Escape($title))</text><text>$([Security.SecurityElement]::Escape($text))</text></binding></visual></toast>")
    $appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show([Windows.UI.Notifications.ToastNotification]::new($xml))
  } catch {
    msg.exe * "$title`n$text" 2>$null
  }
  [Console]::Beep(880, 400)
}

# Queue rows: | # | Component | Figma node | Status | Notes |
function Get-Rows {
  foreach ($line in [IO.File]::ReadAllLines($queue)) {
    if ($line -match '^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([a-z-]+)\s*\|\s*([^|]*?)\s*\|\s*$') {
      [pscustomobject]@{ Num = $Matches[1]; Name = $Matches[2]; Node = $Matches[3]; Status = $Matches[4]; Notes = $Matches[5] }
    }
  }
}

function Set-Row($num, $status, $notes = $null) {
  $lines = [IO.File]::ReadAllLines($queue)
  for ($k = 0; $k -lt $lines.Count; $k++) {
    if ($lines[$k] -match "^\|\s*$num\s*\|") {
      $cells = $lines[$k].Split('|')
      $cells[4] = " $status "
      if ($null -ne $notes) { $cells[5] = " $($notes -replace '\|', '/') " }
      $lines[$k] = $cells -join '|'
    }
  }
  [IO.File]::WriteAllLines($queue, $lines, $utf8)
}

function Get-Slug($name) {
  return (($name.ToLower() -replace '[^a-z0-9]+', '-') -replace '^-|-$', '')
}

# Runs one claude session; waits out usage limits and retries the same step.
function Invoke-Claude($agent, $prompt, $label) {
  while ($true) {
    $log = "design/agent-logs/{0:yyyyMMdd-HHmmss}-{1}.log" -f (Get-Date), $label
    Write-Host "  $label ($agent) -> $log"
    $out = claude -p --agent $agent --permission-mode auto $prompt 2>&1 | Out-String
    $out | Out-File -FilePath $log -Encoding utf8
    if ($out -match "hit your .*limit") {
      Write-Host "  Usage limit hit. Waiting 15 min."
      Start-Sleep -Seconds 900
      continue
    }
    Write-Host ("  " + (($out.Trim() -split "`n" | Select-Object -Last 2) -join "`n  "))
    return $out
  }
}

$i = 0
while ($i -lt $Max) {
  $channel = Sync-Channel

  # Pick the next todo row; rows already built are marked done unless they say REBUILD.
  $row = $null
  foreach ($r in (Get-Rows | Where-Object { $_.Status -eq 'todo' })) {
    $slug = Get-Slug $r.Name
    if ((Test-Path "src/app/design-system/$slug") -and $r.Notes -notmatch '^REBUILD') {
      Set-Row $r.Num 'done' "already built; $($r.Notes)"
      continue
    }
    $row = $r; break
  }
  if (-not $row) { Write-Host "Queue empty. Done."; Send-Notification "Agent loop done" "Queue is empty."; break }
  $slug = Get-Slug $row.Name
  $i++
  Write-Host "[$i] $($row.Name) (row $($row.Num), page $($row.Node), slug $slug)"
  Set-Row $row.Num 'in-progress'

  # Figma: the whole page, by script. Two failures (with a new channel check between) stop the loop.
  $spec = pnpm -s figma:spec $row.Node $slug 2>&1 | Out-String
  if ($LASTEXITCODE -ne 0) {
    Write-Host "  figma:spec failed: $($spec.Trim())"
    $newChannel = Sync-Channel
    if ($newChannel -eq $channel) { Write-Host "  Retrying in 2 min."; Start-Sleep -Seconds 120 }
    $spec = pnpm -s figma:spec $row.Node $slug 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
      Set-Row $row.Num 'todo'
      $msg = "Figma failed twice on $($row.Name) (page $($row.Node)): $($spec.Trim()). Loop stopped. Open the page in Figma or restart the TalkToFigma plugin, then start the loop again."
      Write-Host $msg
      Send-Notification "Agent loop stopped" $msg
      break
    }
  }
  Write-Host "  $($spec.Trim())"

  # Reuse hints for the builder (graphify CLI, no LLM).
  $ctx = graphify query "$($row.Name): which ui primitives, cva variants, icons and design-system pages already exist that this should reuse" --budget 800 2>&1 | Out-String
  [IO.File]::WriteAllText((Join-Path $root "design/handoff/$slug/graph-context.md"), $ctx, $utf8)
  Remove-Item "design/handoff/$slug/review.md" -ErrorAction SilentlyContinue

  $result = ''
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    $build = "Build $($row.Name) (slug $slug) from design/handoff/$slug/figma.md and its img/ images. Queue notes: $($row.Notes)"
    if ($attempt -gt 1) { $build = "Fix pass $attempt for $($row.Name) (slug $slug): apply exactly what design/handoff/$slug/review.md lists. Figma data: design/handoff/$slug/figma.md and img/." }
    Invoke-Claude 'component-builder' $build "$slug-build$attempt" | Out-Null

    $review = Invoke-Claude 'director' "Review $($row.Name) (slug $slug, queue row $($row.Num), attempt $attempt of 3)." "$slug-review$attempt"
    if ($review -match 'APPROVED') { $result = 'done'; break }
    if ($review -match 'BLOCKED') { $result = 'blocked'; break }
    if ($review -notmatch 'REJECTED') { $result = 'unclear'; break }
  }

  if ($result -eq 'done') {
    graphify update . 2>&1 | Out-Null
    Write-Host "  done"
  } else {
    $msg = "$($row.Name): $result after review. See design/agent-logs and design/handoff/$slug/review.md."
    Write-Host "  $msg"
    if ($result -eq 'unclear') { Send-Notification "Agent loop stopped" $msg; break }
  }
}

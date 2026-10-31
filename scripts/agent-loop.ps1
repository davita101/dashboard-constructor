# Runs the director agent once per component, each in a fresh Claude Code session,
# until the queue is empty or Figma fails on the plugin's own channel.
# Run: powershell -ExecutionPolicy Bypass -File scripts/agent-loop.ps1 [-Max 100]
# -Max counts sessions that ran; usage-limit waits don't count.
# Needs the TalkToFigma socket server with the /figma-channel endpoint
# (E:\Girhub\cursor-talk-to-figma-mcp\src\socket.ts).

param([int]$Max = 100)

$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
New-Item -ItemType Directory -Force "design/agent-logs" | Out-Null

# The TalkToFigma channel changes whenever the plugin restarts. Ask the socket
# server which channel the plugin is in and store it in the queue's `Channel:`
# line, which figma-navigator joins. Waits while no plugin is connected.
$queue = Join-Path $root "design/agent-queue.md"
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
    [IO.File]::WriteAllLines($queue, $lines, (New-Object Text.UTF8Encoding $false))
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

$i = 0
$down = 0
while ($i -lt $Max) {
  $channel = Sync-Channel
  $log = "design/agent-logs/{0:yyyyMMdd-HHmmss}.log" -f (Get-Date)
  Write-Host "[$($i + 1)] session started (channel $channel) -> $log"

  $out = claude -p --agent director --permission-mode auto "Run one session: build exactly one component, then stop." 2>&1 | Out-String
  $out | Out-File -FilePath $log -Encoding utf8
  Write-Host ($out.Trim() -split "`n" | Select-Object -Last 3)

  if ($out -match "hit your .*limit") {
    Write-Host "Usage limit hit. Waiting 15 min."
    Start-Sleep -Seconds 900
    continue
  }
  $i++
  if ($out -match "QUEUE EMPTY") { Write-Host "Queue empty. Done."; break }
  if ($out -match "FIGMA DOWN") {
    # A new plugin channel means it reconnected: retry. On the same channel the
    # plugin sometimes fails once ("Error executing command"): retry after a
    # pause, and stop only when it keeps failing.
    if ((Sync-Channel) -ne $channel) { Write-Host "Plugin reconnected. Retrying."; $down = 0; continue }
    $down++
    if ($down -ge 2) {
      $msg = "Figma failed twice on channel $channel. Loop stopped. Open the page in Figma (or restart the TalkToFigma plugin), then start the loop again."
      Write-Host $msg
      Send-Notification "Agent loop stopped" $msg
      break
    }
    Write-Host "Figma down on channel $channel ($down/2). Retrying in 2 min."
    Start-Sleep -Seconds 120
    continue
  }
  $down = 0
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Session failed (exit $LASTEXITCODE). Retrying in 60s."
    Start-Sleep -Seconds 60
  }
}

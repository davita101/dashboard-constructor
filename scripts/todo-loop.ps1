# Finishes design/backend/TODO.md unattended with two agents, each a fresh `claude -p` session:
#   todo-director PLAN      -> picks the next item, writes design/todo-loop/task.md
#   todo-builder            -> does it, writes design/todo-loop/report.md
#   todo-director REVIEW n  -> APPROVED (ticks TODO, commits, pushes) / REJECTED (review.md, builder fixes) / BLOCKED
# Up to 3 build attempts per item; a blocked item is skipped, the loop goes on.
# Usage limits: waits until the reset time Claude prints (or 15 min) and retries the same step. Other API errors: 2 min.
# Run: powershell -ExecutionPolicy Bypass -File scripts/todo-loop.ps1 [-Max 50]
# Stop: Ctrl+C. Progress: design/todo-loop/log.md, sessions: design/agent-logs/.

param([int]$Max = 50)

$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
New-Item -ItemType Directory -Force "design/agent-logs", "design/todo-loop" | Out-Null

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
}

# Seconds until the reset time in a limit message ("resets 3pm", "resets at 15:30"), else 15 min.
function Get-LimitWait($text) {
  if ($text -match 'resets(?: at)?\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?') {
    $h = [int]$Matches[1]; $m = if ($Matches[2]) { [int]$Matches[2] } else { 0 }
    if ($Matches[3] -eq 'pm' -and $h -lt 12) { $h += 12 }
    if ($Matches[3] -eq 'am' -and $h -eq 12) { $h = 0 }
    $reset = (Get-Date).Date.AddHours($h).AddMinutes($m)
    if ($reset -le (Get-Date)) { $reset = $reset.AddDays(1) }
    return [int]([Math]::Min(6 * 3600, ($reset - (Get-Date)).TotalSeconds + 120))
  }
  return 900
}

# One claude session. Retries the same step after usage limits and transient API errors; returns the output.
function Invoke-Claude($agent, $prompt, $label) {
  while ($true) {
    $log = "design/agent-logs/{0:yyyyMMdd-HHmmss}-todo-{1}.log" -f (Get-Date), $label
    Write-Host ("[{0:HH:mm}] {1} ({2}) -> {3}" -f (Get-Date), $label, $agent, $log)
    $out = claude -p --agent $agent --permission-mode auto $prompt 2>&1 | Out-String
    $out | Out-File -FilePath $log -Encoding utf8
    # Limit / error messages are short; a long answer that merely mentions "limit" is real work.
    if ($out.Length -lt 1500 -and $out -match "(hit your .*limit|usage limit|limit reached|rate.?limit|429)") {
      $wait = Get-LimitWait $out
      Write-Host ("  Usage limit. Waiting until {0:HH:mm} ({1} min), then retrying." -f (Get-Date).AddSeconds($wait), [int]($wait / 60))
      Start-Sleep -Seconds $wait
      continue
    }
    if ($out -match "(API Error|overloaded|ECONNRESET|ETIMEDOUT|socket hang up|5\d\d )" -and $out.Length -lt 2000) {
      Write-Host "  API error. Retrying in 2 min."
      Start-Sleep -Seconds 120
      continue
    }
    Write-Host ("  " + (($out.Trim() -split "`n" | Select-Object -Last 1) -join ""))
    return $out
  }
}

function Last-Word($out) { return (($out.Trim() -split "`n" | Select-Object -Last 1).Trim()) }

$i = 0
$unclear = 0
while ($i -lt $Max) {
  $i++
  Write-Host "=== Item $i ==="
  $plan = Invoke-Claude 'todo-director' 'PLAN' "plan$i"
  $word = Last-Word $plan
  if ($word -match 'ALL DONE') { Send-Notification "TODO loop done" "Nothing left that is not blocked. See design/todo-loop/log.md."; Write-Host "All done."; break }
  if ($word -notmatch 'TASK READY') {
    $unclear++
    Write-Host "  Planner gave no task ($word)."
    if ($unclear -ge 3) { Send-Notification "TODO loop stopped" "Director failed to plan 3 times. See design/agent-logs."; break }
    Start-Sleep -Seconds 60
    continue
  }
  $unclear = 0

  for ($attempt = 1; $attempt -le 3; $attempt++) {
    $build = if ($attempt -eq 1) { "Do the task in design/todo-loop/task.md." } else { "Fix pass $attempt`: apply design/todo-loop/review.md to the task in design/todo-loop/task.md." }
    $built = Invoke-Claude 'todo-builder' $build "build$i-$attempt"
    $review = Invoke-Claude 'todo-director' "REVIEW $attempt" "review$i-$attempt"
    $verdict = Last-Word $review
    if ($verdict -match 'APPROVED') { Write-Host "  APPROVED"; break }
    if ($verdict -match 'BLOCKED') { Write-Host "  BLOCKED, moving on"; break }
    if ($attempt -eq 3) { Write-Host "  Still not approved after 3 attempts ($verdict); director decides next PLAN." }
  }
}
Write-Host "Loop ended after $i item(s)."

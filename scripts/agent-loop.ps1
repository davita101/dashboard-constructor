# Runs the director agent once per component, each in a fresh Claude Code session,
# until the queue is empty or Figma disconnects.
# Run: powershell -ExecutionPolicy Bypass -File scripts/agent-loop.ps1 [-Max 100]
# -Max counts sessions that ran; usage-limit waits don't count.

param([int]$Max = 100)

$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
New-Item -ItemType Directory -Force "design/agent-logs" | Out-Null

$i = 0
while ($i -lt $Max) {
  $log = "design/agent-logs/{0:yyyyMMdd-HHmmss}.log" -f (Get-Date)
  Write-Host "[$($i + 1)] session started -> $log"

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
  if ($out -match "FIGMA DOWN") { Write-Host "Figma disconnected. Stopping."; break }
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Session failed (exit $LASTEXITCODE). Retrying in 60s."
    Start-Sleep -Seconds 60
  }
}

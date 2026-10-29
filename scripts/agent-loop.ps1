# Runs the director agent once per component, each in a fresh Claude Code session,
# until the queue is empty or Figma disconnects.
# Run: powershell -ExecutionPolicy Bypass -File scripts/agent-loop.ps1 [-Max 100]

param([int]$Max = 100)

$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
New-Item -ItemType Directory -Force "design/agent-logs" | Out-Null

for ($i = 1; $i -le $Max; $i++) {
  $log = "design/agent-logs/{0:yyyyMMdd-HHmmss}.log" -f (Get-Date)
  Write-Host "[$i] session started -> $log"

  $out = claude -p --agent director --permission-mode auto "Run one session: build exactly one component, then stop." 2>&1 | Tee-Object -FilePath $log | Out-String

  if ($out -match "QUEUE EMPTY") { Write-Host "Queue empty. Done."; break }
  if ($out -match "FIGMA DOWN") { Write-Host "Figma disconnected. Stopping."; break }
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Session failed (exit $LASTEXITCODE). Retrying in 60s."
    Start-Sleep -Seconds 60
  }
}

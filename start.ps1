# Start NasaNeoHub - Backend + Frontend
# Usage: .\start.ps1

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $rootDir "backend"
$frontendDir = Join-Path $rootDir "frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NasaNeoHub - Starting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "[1/2] Starting Backend (FastAPI)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    python -m uvicorn app.main:app --reload --port 8000
} -ArgumentList $backendDir

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[2/2] Starting Frontend (Next.js)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npx next dev
} -ArgumentList $frontendDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Services Starting..." -ForegroundColor Green
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Run .\stop.ps1 to stop all services." -ForegroundColor Gray

# Keep script running and show job output
while ($true) {
    $backendOutput = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
    $frontendOutput = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue

    if ($backendOutput) { Write-Host "[Backend] $backendOutput" -ForegroundColor DarkGray }
    if ($frontendOutput) { Write-Host "[Frontend] $frontendOutput" -ForegroundColor DarkGray }

    $backendState = (Get-Job -Id $backendJob.Id -ErrorAction SilentlyContinue).State
    $frontendState = (Get-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue).State

    if ($backendState -eq "Failed") {
        Write-Host "[ERROR] Backend job failed!" -ForegroundColor Red
        $backendError = Receive-Job -Job $backendJob
        Write-Host $backendError -ForegroundColor Red
        break
    }
    if ($frontendState -eq "Failed") {
        Write-Host "[ERROR] Frontend job failed!" -ForegroundColor Red
        $frontendError = Receive-Job -Job $frontendJob
        Write-Host $frontendError -ForegroundColor Red
        break
    }

    Start-Sleep -Seconds 1
}

# Cleanup if we exit
Write-Host "Stopping services..." -ForegroundColor Yellow
Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
Write-Host "Done." -ForegroundColor Green

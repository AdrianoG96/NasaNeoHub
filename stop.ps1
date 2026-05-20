# Stop NasaNeoHub - Backend + Frontend
# Usage: .\stop.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NasaNeoHub - Stopping Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find and kill uvicorn (backend) processes
$backendProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -match "uvicorn"
}
if ($backendProcesses) {
    Write-Host "[Backend] Stopping uvicorn..." -ForegroundColor Yellow
    $backendProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "[Backend] Stopped." -ForegroundColor Green
} else {
    Write-Host "[Backend] No running uvicorn process found." -ForegroundColor Gray
}

# Find and kill Next.js (frontend) processes
$frontendProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -match "next"
}
if ($frontendProcesses) {
    Write-Host "[Frontend] Stopping Next.js..." -ForegroundColor Yellow
    $frontendProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "[Frontend] Stopped." -ForegroundColor Green
} else {
    Write-Host "[Frontend] No running Next.js process found." -ForegroundColor Gray
}

# Also kill any processes listening on ports 8000 and 3000
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    $port8000 | ForEach-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "[Port 8000] Killing process $($proc.Name) (PID: $($proc.Id))..." -ForegroundColor Yellow
            $proc | Stop-Process -Force -ErrorAction SilentlyContinue
        }
    }
}

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $port3000 | ForEach-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "[Port 3000] Killing process $($proc.Name) (PID: $($proc.Id))..." -ForegroundColor Yellow
            $proc | Stop-Process -Force -ErrorAction SilentlyContinue
        }
    }
}

# Stop any background jobs
Get-Job -ErrorAction SilentlyContinue | Stop-Job -ErrorAction SilentlyContinue
Get-Job -ErrorAction SilentlyContinue | Remove-Job -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  All services stopped." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

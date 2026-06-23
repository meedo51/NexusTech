# check-port.ps1 - Verify port 7788 availability and NexusTech services

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  NexusTech Port Check - Port 7788" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$port = 7788
$connections = netstat -ano | Select-String ":$port\s"

if ($connections) {
    Write-Host "Port $port is in use by:" -ForegroundColor Yellow
    $connections | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "Port $port is available" -ForegroundColor Green
}

Write-Host ""
Write-Host "Testing endpoints..." -ForegroundColor Cyan

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:7788/" -UseBasicParsing -TimeoutSec 5
    Write-Host "  Frontend: http://localhost:7788/         OK ($($frontend.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "  Frontend: http://localhost:7788/         FAIL" -ForegroundColor Red
}

try {
    $health = Invoke-WebRequest -Uri "http://localhost:7788/api/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "  API Health: http://localhost:7788/api/health  OK ($($health.StatusCode))" -ForegroundColor Green
    Write-Host "  Response: $($health.Content)" -ForegroundColor Gray
} catch {
    Write-Host "  API Health: http://localhost:7788/api/health  FAIL" -ForegroundColor Red
}

try {
    $mongo = docker ps --filter "name=nexus-mongo" --format "{{.Status}}" 2>$null
    if ($mongo) {
        Write-Host "  MongoDB (port 27018):  OK - $mongo" -ForegroundColor Green
    } else {
        Write-Host "  MongoDB (port 27018):  NOT RUNNING" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  MongoDB: Docker not available" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Application: http://localhost:7788" -ForegroundColor White
Write-Host "  Admin Panel: http://localhost:7788/admin" -ForegroundColor White
Write-Host "  API:         http://localhost:7788/api" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Cyan

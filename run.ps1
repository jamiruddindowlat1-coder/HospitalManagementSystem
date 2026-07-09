# ============================================================
# Hospital Management System - Smart Launcher
# ============================================================

# Configuration
$backendPath = "D:\HospitalManagementSystem\HospitalManagement.API"
$frontendPath = "D:\HospitalManagementSystem\hospital-frontend"
$backendPort = 5151
$frontendPort = 5173
$backendUrl = "http://localhost:$backendPort"
$frontendUrl = "http://localhost:$frontendPort"
$swaggerUrl = "$backendUrl/swagger/index.html"

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Hospital Management System - Smart Launcher          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to kill process on port
function Kill-PortProcess {
    param([int]$Port)
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
               Select-Object -ExpandProperty OwningProcess | 
               Get-Unique
    if ($process) {
        Write-Host "[!] Stopping existing process on port $Port (PID: $process)..." -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

# Kill existing processes
Write-Host "[*] Clearing ports..." -ForegroundColor Yellow
Kill-PortProcess -Port $backendPort
Kill-PortProcess -Port $frontendPort

Start-Sleep -Seconds 2

# Check if .NET runtime is available
Write-Host "[*] Checking .NET environment..." -ForegroundColor Cyan
$dotnetVersion = dotnet --version 2>$null
if (-not $dotnetVersion) {
    Write-Host "[ERROR] .NET SDK not found! Please install .NET SDK first." -ForegroundColor Red
    exit 1
}
Write-Host "[✓] .NET version: $dotnetVersion" -ForegroundColor Green

# Check if Node/npm is available
Write-Host "[*] Checking Node.js environment..." -ForegroundColor Cyan
$npmVersion = npm --version 2>$null
if (-not $npmVersion) {
    Write-Host "[ERROR] Node.js/npm not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}
Write-Host "[✓] npm version: $npmVersion" -ForegroundColor Green

Write-Host ""

# Start Backend
Write-Host "[+] Starting Backend API (Port $backendPort)..." -ForegroundColor Green
$backendArgs = "/k cd /d `"$backendPath`" && dotnet run"
Start-Process -FilePath "cmd.exe" -ArgumentList $backendArgs -WindowStyle Normal | Out-Null

Start-Sleep -Seconds 4

# Start Frontend
Write-Host "[+] Starting Frontend (Port $frontendPort)..." -ForegroundColor Green
$frontendArgs = "/k cd /d `"$frontendPath`" && npm run dev"
Start-Process -FilePath "cmd.exe" -ArgumentList $frontendArgs -WindowStyle Normal | Out-Null

Start-Sleep -Seconds 3

# Open URLs in browser
Write-Host "[+] Opening Swagger UI in browser..." -ForegroundColor Green
Start-Process "$swaggerUrl"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓ All services started successfully!                 ║" -ForegroundColor Green
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  Backend:   $backendUrl" -ForegroundColor Cyan
Write-Host "║  Frontend:  $frontendUrl" -ForegroundColor Cyan
Write-Host "║  Swagger:   $swaggerUrl" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Green
Write-Host "║  Do NOT close the terminal windows                     ║" -ForegroundColor Yellow
Write-Host "║  Press Ctrl+C to stop services                         ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

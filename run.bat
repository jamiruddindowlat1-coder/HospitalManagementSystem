@echo off
REM ============================================================
REM Hospital Management System - One-Click Launcher
REM ============================================================

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  Hospital Management System - Starting Services        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Kill any process using port 5151 (backend) and 5173 (frontend)
echo [*] Clearing ports 5151 and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5151') do taskkill /PID %%a /F 2>nul
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /PID %%a /F 2>nul
timeout /t 2 /nobreak

REM Start Backend in a new window
echo [+] Starting Backend API (Port 5151)...
start "Hospital Management - Backend" cmd /k "cd /d D:\HospitalManagementSystem\HospitalManagement.API && dotnet run"
timeout /t 3 /nobreak

REM Start Frontend in a new window
echo [+] Starting Frontend (Port 5173)...
start "Hospital Management - Frontend" cmd /k "cd /d D:\HospitalManagementSystem\hospital-frontend && npm run dev"
timeout /t 5 /nobreak

REM Open Swagger in default browser
echo [+] Opening Swagger UI in browser...
start "" "http://localhost:5151/swagger/index.html"

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║  ✓ All services started successfully!                  ║
echo ║                                                          ║
echo ║  API Endpoints:                                         ║
echo ║  ├─ Backend:      http://localhost:5151/api/patients  ║
echo ║  ├─ Swagger UI:   http://localhost:5151/swagger       ║
echo ║  └─ Frontend:     http://localhost:5173               ║
echo ║                                                          ║
echo ║  NOTE: Do NOT close any terminal windows!             ║
echo ║  Press Ctrl+C in any window to stop that service      ║
echo ║                                                          ║
echo ║  Swagger is opening in your browser now...            ║
echo ╚════════════════════════════════════════════════════════╝
echo.
pause

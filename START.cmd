@echo off
REM ============================================================
REM Hospital Management System - One-Click Launcher
REM ============================================================
setlocal enabledelayedexpansion

echo.
echo ====================================================
echo  Hospital Management System - Starting Services
echo ====================================================
echo.

REM Check if ports are in use and kill processes
echo [*] Checking for existing processes...
netstat -ano 2>nul | findstr ":5151" >nul
if not errorlevel 1 (
    echo [!] Clearing port 5151...
    for /f "tokens=5" %%A in ('netstat -ano 2^>nul ^| findstr ":5151"') do (
        taskkill /PID %%A /F 2>nul
    )
)

netstat -ano 2>nul | findstr ":5173" >nul
if not errorlevel 1 (
    echo [!] Clearing port 5173...
    for /f "tokens=5" %%A in ('netstat -ano 2^>nul ^| findstr ":5173"') do (
        taskkill /PID %%A /F 2>nul
    )
)

timeout /t 1 /nobreak >nul

REM Start Backend
echo [+] Starting Backend API (Port 5151)...
start "Hospital Management - Backend" cmd /k "cd /d D:\HospitalManagementSystem\HospitalManagement.API && set JWT_SECRET_KEY=SuperSecretJwtKeyForHospitalApp12345! && dotnet run"

REM Wait for backend to actually be ready (checks port up to ~30 sec)
echo [*] Waiting for backend to become ready...
set /a BACKEND_TRIES=0
:waitbackend
timeout /t 1 /nobreak >nul
set /a BACKEND_TRIES+=1
netstat -ano | findstr ":5151" | findstr "LISTENING" >nul
if errorlevel 1 (
    if !BACKEND_TRIES! GEQ 30 (
        echo [!] Backend did not start within 30 seconds. Continuing anyway...
        goto backendready
    )
    goto waitbackend
)
echo [+] Backend is up!

:backendready

REM Start Frontend
echo [+] Starting Frontend (Port 5173/5174)...
start "Hospital Management - Frontend" cmd /k "cd /d D:\HospitalManagementSystem\hospital-frontend && npm run dev"

REM Wait for frontend to actually be ready (checks port up to ~30 sec)
echo [*] Waiting for frontend to become ready...
set /a FRONTEND_TRIES=0
:waitfrontend
timeout /t 1 /nobreak >nul
set /a FRONTEND_TRIES+=1
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul
if errorlevel 1 (
    if !FRONTEND_TRIES! GEQ 30 (
        echo [!] Frontend did not start within 30 seconds. Continuing anyway...
        goto frontendready
    )
    goto waitfrontend
)
echo [+] Frontend is up!

:frontendready

REM Open Swagger AND Frontend together in browser
echo [+] Opening Swagger UI and Frontend in browser...
start "" "http://localhost:5151/swagger/index.html"
timeout /t 1 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo ====================================================
echo  All services started successfully!
echo ====================================================
echo.
echo  Backend:      http://localhost:5151
echo  Frontend:     http://localhost:5173 (or 5174)
echo  Swagger:      http://localhost:5151/swagger
echo.
echo  DO NOT close these terminal windows!
echo  Press Ctrl+C to stop any service.
echo.
pause

@echo off
setlocal enabledelayedexpansion
echo.
echo ====================================================
echo  Hospital Management System - Starting Services
echo ====================================================
echo.
echo [*] Checking for existing processes...
netstat -ano 2>nul | findstr ":5151" >nul
if not errorlevel 1 (
    for /f "tokens=5" %%A in ('netstat -ano 2^>nul ^| findstr ":5151"') do (
        taskkill /PID %%A /F 2>nul
    )
)
netstat -ano 2>nul | findstr ":5173" >nul
if not errorlevel 1 (
    for /f "tokens=5" %%A in ('netstat -ano 2^>nul ^| findstr ":5173"') do (
        taskkill /PID %%A /F 2>nul
    )
)
timeout /t 1 /nobreak >nul
echo [+] Starting Backend...
start "HMS Backend" cmd /k "cd /d D:\My Projects\HospitalManagementSystem\HospitalManagement.API && set JWT_SECRET_KEY=SuperSecretJwtKeyForHospitalApp12345! && dotnet run"
set /a TRIES=0
:waitbackend
timeout /t 1 /nobreak >nul
set /a TRIES+=1
netstat -ano | findstr ":5151" | findstr "LISTENING" >nul
if errorlevel 1 (
    if !TRIES! GEQ 30 goto backendready
    goto waitbackend
)
echo [+] Backend is up!
:backendready
echo [+] Starting Frontend...
start "HMS Frontend" cmd /k "cd /d D:\My Projects\HospitalManagementSystem\hospital-frontend && npm run dev"
set /a TRIES=0
:waitfrontend
timeout /t 1 /nobreak >nul
set /a TRIES+=1
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul
if errorlevel 1 (
    if !TRIES! GEQ 30 goto frontendready
    goto waitfrontend
)
echo [+] Frontend is up!
:frontendready
start "" "http://localhost:5151/swagger/index.html"
timeout /t 1 /nobreak >nul
start "" "http://localhost:5173"
echo.
echo  Backend:  http://localhost:5151
echo  Frontend: http://localhost:5173
echo  Swagger:  http://localhost:5151/swagger
echo.
pause
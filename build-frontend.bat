@echo off
setlocal
title PrimeNova — Frontend Build (single-server)
cd /d "%~dp0"

REM ─────────────────────────────────────────────────────────────
REM  React frontend ko build karo aur backend ke static folder me
REM  copy karo, taaki Spring Boot (single server :8080) usse serve
REM  kar sake. Iske baad run-backend.bat chalao.
REM ─────────────────────────────────────────────────────────────

echo [1/2] Building frontend (Vite + TypeScript)...
call npm run build
if errorlevel 1 (
    echo.
    echo BUILD FAILED — frontend compile error.
    exit /b 1
)

echo.
echo [2/2] Copying dist ^> backend\src\main\resources\static ...
if exist "backend\src\main\resources\static" (
    rmdir /s /q "backend\src\main\resources\static"
)
xcopy /e /i /q "dist" "backend\src\main\resources\static" >nul
if errorlevel 1 (
    echo.
    echo COPY FAILED.
    exit /b 1
)

echo.
echo Done. Frontend ab backend ke saath bundle hai.
echo Run backend\run-backend.bat — sab kuch http://localhost:8080 par milega.
endlocal

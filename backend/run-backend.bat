@echo off
setlocal
title PrimeNova — Single Server (:8080)
cd /d "%~dp0"

REM ─────────────────────────────────────────────────────────────
REM  Load .env (project root) into the process environment.
REM  Java/JVM picks up these as env vars — no Spring config change
REM  needed. findstr drops comment (#) lines; for /f splits each
REM  remaining line on the first "=". No delayed expansion, so
REM  values containing "!" or "&" survive intact.
REM ─────────────────────────────────────────────────────────────
set "ENV_FILE=..\.env"
if exist "%ENV_FILE%" (
    echo Loading environment from .env ...
    for /f "usebackq tokens=1,* delims==" %%a in (`findstr /v /b "#" "%ENV_FILE%"`) do (
        if not "%%a"=="" set "%%a=%%b"
    )
) else (
    echo WARNING: .env not found at "%ENV_FILE%" — using application.yml defaults
)

REM ─────────────────────────────────────────────────────────────
REM  Single-server mode: frontend build nahi hai toh pehle build
REM  karo (build-frontend.bat), warna Spring Boot kuch serve nahi
REM  karega. mvn spring-boot:run static files ko src/main/resources
REM  se direct serve karta hai — har baar fresh.
REM ─────────────────────────────────────────────────────────────
if not exist "src\main\resources\static\index.html" (
    echo.
    echo Frontend build nahi mila — abhi build kar rahe hain...
    cd .. 
    call build-frontend.bat
    if errorlevel 1 exit /b 1
    cd backend
)

echo.
echo Starting PrimeNova — frontend + backend ek hi server pe :8080 ...
echo URL: http://localhost:8080
echo.

REM spring-boot:run = dev ke liye fast & always-fresh static.
REM Production jar ke liye: mvn package -DskipTests && java -jar target\studio-0.0.1-SNAPSHOT.jar
call mvn spring-boot:run
endlocal

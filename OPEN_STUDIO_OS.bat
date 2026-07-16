@echo off
TITLE DP INSIDE StudioOS - Executive Portal Launcher
COLOR 0B
ECHO ===============================================================================
ECHO   🎬 DP INSIDE STUDIO OS - ONE-CLICK LAUNCHER (`EASY MODE`)
ECHO ===============================================================================
ECHO.
ECHO Starting StudioOS local server and opening your web browser...
ECHO.

cd /d "%~dp0"
start "StudioOS Server" /MIN cmd /c "npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173

ECHO ===============================================================================
ECHO   ✅ StudioOS is running live in your web browser!
ECHO   You can close this window at any time.
ECHO ===============================================================================
exit

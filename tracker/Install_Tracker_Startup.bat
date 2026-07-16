@echo off
TITLE DP INSIDE StudioOS - Automatic PC Startup Installer
COLOR 0B
ECHO ===============================================================================
ECHO   DP INSIDE STUDIO OS - ONE-CLICK AUTOMATIC STARTUP INSTALLER
ECHO ===============================================================================
ECHO.
ECHO Installing DP Inside Workstation Tracker to boot automatically on Windows startup...
ECHO.

powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0Install_Tracker_Startup.ps1"

ECHO.
ECHO ===============================================================================
ECHO   INSTALLATION COMPLETE! Your PC will now track hours silently on every boot.
ECHO ===============================================================================
PAUSE

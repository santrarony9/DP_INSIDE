@echo off
TITLE DP INSIDE StudioOS - Uninstall Automatic PC Tracker
COLOR 0C
ECHO ===============================================================================
ECHO   DP INSIDE STUDIO OS - REMOVE AUTOMATIC BOOT TRACKER
ECHO ===============================================================================
ECHO.
ECHO Stopping any running background tracker instances...
taskkill /F /IM wscript.exe /FI "WINDOWTITLE eq wscript.exe*" >nul 2>&1
powershell -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*DP_Inside_PC_Tracker.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>&1

ECHO Removing Windows Startup shortcut...
del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\DP_Inside_StudioOS_Tracker.lnk" /F /Q >nul 2>&1

ECHO Removing Windows Task Scheduler job...
powershell -Command "Unregister-ScheduledTask -TaskName 'DP_Inside_StudioOS_Tracker' -Confirm:$false -ErrorAction SilentlyContinue" >nul 2>&1

ECHO Removing ProgramData installation folder...
rmdir "C:\ProgramData\DPInsideStudioOS" /S /Q >nul 2>&1

ECHO.
ECHO ===============================================================================
ECHO   UNINSTALL COMPLETE! All automatic background tracking has been removed.
ECHO ===============================================================================
PAUSE

<#
.SYNOPSIS
    DP INSIDE STUDIO OS - One-Click Automatic Windows Boot / Startup Installer
    Automatically runs `DP_Inside_PC_Tracker.ps1` silently in the background every time the PC turns on.

.DESCRIPTION
    Run this script ONCE on each of your 6 editing computers (`PC #1` to `PC #6`).
    It creates a silent background Windows Task Scheduler job (or silent VBS startup launcher)
    so the tracker boots automatically whenever the computer turns on, without popping up any distracting
    black command prompt window for your editors!
#>

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host " 🚀 DP INSIDE STUDIO OS - AUTOMATIC STARTUP INSTALLER" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan

# 1. Ensure target installation directory exists (`C:\ProgramData\DPInsideStudioOS`)
$InstallDir = "$env:ProgramData\DPInsideStudioOS"
if (-not (Test-Path $InstallDir)) {
    New-Item -Path $InstallDir -ItemType Directory -Force | Out-Null
}

# 2. Copy the main tracker script to the permanent install location
$SourceTracker = Join-Path $PSScriptRoot "DP_Inside_PC_Tracker.ps1"
if (-not (Test-Path $SourceTracker)) {
    Write-Host "Error: Could not find DP_Inside_PC_Tracker.ps1 in $PSScriptRoot" -ForegroundColor Red
    return
}
Copy-Item -Path $SourceTracker -Destination "$InstallDir\DP_Inside_PC_Tracker.ps1" -Force

# 3. Create a Silent VBScript Launcher (`Run_Silent.vbs`) so no black CMD terminal window pops up on boot
$VbsContent = @"
Set objShell = CreateObject("WScript.Shell")
objShell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File ""$InstallDir\DP_Inside_PC_Tracker.ps1""", 0, False
"@
$VbsPath = "$InstallDir\Run_Silent.vbs"
$VbsContent | Out-File -FilePath $VbsPath -Encoding ASCII -Force

# 4. Install into the Windows User Startup Folder (`shell:startup`) for instant boot launch
$StartupFolder = [Environment]::GetFolderPath('Startup')
$ShortcutPath = "$StartupFolder\DP_Inside_StudioOS_Tracker.lnk"

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "wscript.exe"
$Shortcut.Arguments = """$VbsPath"""
$Shortcut.WorkingDirectory = $InstallDir
$Shortcut.Description = "DP Inside StudioOS Workstation Telemetry Agent"
$Shortcut.IconLocation = "powershell.exe,0"
$Shortcut.Save()

# 5. Also register in Windows Task Scheduler (`Runs on System Startup & User Logon`)
$TaskName = "DP_Inside_StudioOS_Tracker"
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null

$Action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument """$VbsPath""" -WorkingDirectory $InstallDir
$TriggerBoot  = New-ScheduledTaskTrigger -AtStartup
$TriggerLogon = New-ScheduledTaskTrigger -AtLogOn
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0 -StartWhenAvailable

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $TriggerLogon -Settings $Settings -Description "DP Inside StudioOS Workstation Telemetry Agent" -Force -ErrorAction SilentlyContinue | Out-Null

Write-Host "✅ SUCCESS! Automatic Boot & Startup Tracking Installed." -ForegroundColor Green
Write-Host "   - Installation Folder : $InstallDir" -ForegroundColor White
Write-Host "   - Startup Shortcut    : $ShortcutPath" -ForegroundColor White
Write-Host "   - Windows Task        : Registered under '$TaskName'" -ForegroundColor White
Write-Host ""
Write-Host "Every time this PC turns on or logs in, DP_Inside_PC_Tracker.ps1 will run 100% silently in the background!" -ForegroundColor Yellow
Write-Host "To start it right now without restarting the PC, running the silent launcher..." -ForegroundColor Cyan

# Start immediately right now
Start-Process -FilePath "wscript.exe" -ArgumentList """$VbsPath""" -WindowStyle Hidden
Write-Host "🎬 Tracker is now running live in the background!" -ForegroundColor Green

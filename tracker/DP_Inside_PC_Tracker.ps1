<#
.SYNOPSIS
    DP INSIDE STUDIO OS - Windows Workstation PC Live Tracker Agent (v2.0)
    100% Free, DPDPA 2023 & IT Act 2000 Compliant Workstation Application & Project Monitor.

.DESCRIPTION
    This script runs in the background on your 6 editing workstation PCs (`PC #1` to `PC #6`).
    It monitors active editing software (Adobe Premiere Pro, DaVinci Resolve, After Effects, Photoshop),
    extracts the exact project file name (.prproj / .drp) from the active window title, measures idle time,
    and synchronizes live telemetry with your StudioOS Web Dashboard (Vercel / Local network).

    NO PAID LICENSES REQUIRED ($0 / ₹0 Monthly Cost).

.CONFIGURATION
    Edit the settings directly below before running on each PC seat.
#>

# ==============================================================================
# WORKSTATION PC CONFIGURATION (EDIT FOR EACH PC SEAT)
# ==============================================================================
$WorkstationID   = "usr-3"                              # e.g., usr-1 (Saurav), usr-2 (Aditya), usr-3 (Piyali), usr-4 (Rohan), usr-5 (Sneha), usr-6 (Vikram)
$WorkstationName = "Workstation PC #3 (Piyali • Editor)"  # Display Name on Dashboard
$AssignedStaff   = "Piyali Sarkar"                      # Editor Full Name
$SyncIntervalSec = 60                                   # Sync telemetry every 60 seconds
$LocalStorageRoot = "D:\Workstation_Storage"            # Local Raw & Edit Storage Path

# Target StudioOS API / Webhook Endpoint (Your Vercel Premium URL or Local Dev Server)
$StudioOS_Webhook_URL = "http://localhost:5173/api/workstation-sync"

# Optional: Local Network Shared JSON Output (If saving directly to a shared drive / local app folder)
$LocalJsonOutputPath  = "..\src\data\workstation_live_status.json"

# ==============================================================================
# TRACKER ENGINE & APPLICATION LOGIC
# ==============================================================================
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host " DP INSIDE STUDIO OS - WORKSTATION PC TRACKER AGENT (v2.0)" -ForegroundColor Yellow
Write-Host "    Workstation Seat: $WorkstationName ($WorkstationID)" -ForegroundColor White
Write-Host "    Assigned Editor : $AssignedStaff" -ForegroundColor White
Write-Host "    Sync Interval   : Every $SyncIntervalSec Seconds" -ForegroundColor Gray
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "Status: Live monitoring started. Press [Ctrl + C] to stop." -ForegroundColor Green
Write-Host ""

# C-Style struct definition for checking exact Windows Idle / Last Keyboard & Mouse Input
$code = @'
using System;
using System.Runtime.InteropServices;

namespace DPInsideTracker {
    public struct LASTINPUTINFO {
        public uint cbSize;
        public uint dwTime;
    }

    public class UserInputMonitor {
        [DllImport("user32.dll")]
        public static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);

        public static uint GetIdleSeconds() {
            LASTINPUTINFO lastInput = new LASTINPUTINFO();
            lastInput.cbSize = (uint)Marshal.SizeOf(lastInput);
            GetLastInputInfo(ref lastInput);
            return ((uint)Environment.TickCount - lastInput.dwTime) / 1000;
        }
    }
}
'@
Add-Type -TypeDefinition $code -Language CSharp

# Tracked cumulative seconds per application in this session
$SessionAppSeconds = @{
    PremierePro  = 0
    AfterEffects = 0
    DaVinci      = 0
    Photoshop    = 0
    ChromeDrive  = 0
    IdleBreak    = 0
}

while ($true) {
    try {
        $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $IdleSeconds = [DPInsideTracker.UserInputMonitor]::GetIdleSeconds()

        # Check all running processes with active main window titles
        $Processes = Get-Process | Where-Object { $_.MainWindowTitle -ne "" }
        
        $ActiveProcessName = "Desktop / Idle"
        $ActiveWindowTitle = "No Active Application Focused"
        $DetectedProjectTag = ""
        $CurrentStatus = "online"

        if ($IdleSeconds -gt 300) {
            # More than 5 minutes idle (no keyboard/mouse input)
            $CurrentStatus = "idle"
            $ActiveProcessName = "Idle / Break"
            $ActiveWindowTitle = "Workstation Idle ($([Math::Round($IdleSeconds/60, 1)]) mins)"
            $SessionAppSeconds["IdleBreak"] += $SyncIntervalSec
        } else {
            # Find dominant production software running right now
            $PrProcess = $Processes | Where-Object { $_.ProcessName -like "*Adobe Premiere Pro*" -or $_.MainWindowTitle -like "*Premiere Pro*" } | Select-Object -First 1
            $AeProcess = $Processes | Where-Object { $_.ProcessName -like "*AfterFX*" -or $_.MainWindowTitle -like "*After Effects*" } | Select-Object -First 1
            $DvProcess = $Processes | Where-Object { $_.ProcessName -like "*Resolve*" -or $_.MainWindowTitle -like "*DaVinci*" } | Select-Object -First 1
            $PsProcess = $Processes | Where-Object { $_.ProcessName -like "*Photoshop*" } | Select-Object -First 1
            $ChProcess = $Processes | Where-Object { $_.ProcessName -like "*chrome*" -or $_.ProcessName -like "*msedge*" } | Select-Object -First 1

            if ($PrProcess) {
                $ActiveProcessName = "Adobe Premiere Pro"
                $ActiveWindowTitle = $PrProcess.MainWindowTitle
                $CurrentStatus = "active-editing"
                $SessionAppSeconds["PremierePro"] += $SyncIntervalSec

                # Extract .prproj project file name from window title (e.g., "Diandra_Wedding_Cut.prproj")
                if ($ActiveWindowTitle -match "([a-zA-Z0-9_\-\s]+\.prproj)") {
                    $DetectedProjectTag = $Matches[1]
                } else {
                    $DetectedProjectTag = $ActiveWindowTitle.Split('-')[0].Trim()
                }
            } elseif ($DvProcess) {
                $ActiveProcessName = "DaVinci Resolve"
                $ActiveWindowTitle = $DvProcess.MainWindowTitle
                $CurrentStatus = "active-editing"
                $SessionAppSeconds["DaVinci"] += $SyncIntervalSec
                $DetectedProjectTag = $ActiveWindowTitle.Split('-')[0].Trim()
            } elseif ($AeProcess) {
                $ActiveProcessName = "Adobe After Effects"
                $ActiveWindowTitle = $AeProcess.MainWindowTitle
                $CurrentStatus = "active-editing"
                $SessionAppSeconds["AfterEffects"] += $SyncIntervalSec
                if ($ActiveWindowTitle -match "([a-zA-Z0-9_\-\s]+\.aep)") {
                    $DetectedProjectTag = $Matches[1]
                } else {
                    $DetectedProjectTag = $ActiveWindowTitle.Split('-')[0].Trim()
                }
            } elseif ($PsProcess) {
                $ActiveProcessName = "Adobe Photoshop"
                $ActiveWindowTitle = $PsProcess.MainWindowTitle
                $CurrentStatus = "active-editing"
                $SessionAppSeconds["Photoshop"] += $SyncIntervalSec
                $DetectedProjectTag = $ActiveWindowTitle.Split('-')[0].Trim()
            } elseif ($ChProcess) {
                $ActiveProcessName = "Google Chrome / Cloud Drive"
                $ActiveWindowTitle = $ChProcess.MainWindowTitle
                $CurrentStatus = "online"
                $SessionAppSeconds["ChromeDrive"] += $SyncIntervalSec
                $DetectedProjectTag = "Cloud Drive / CRM Review"
            }
        }

        # Check local storage health (`D:\` drive if available, else `C:\`)
        $DriveLetter = $LocalStorageRoot.Substring(0, 1) + ":"
        $DriveInfo = Get-PSDrive -Name $LocalStorageRoot.Substring(0, 1) -ErrorAction SilentlyContinue
        if (-not $DriveInfo) { $DriveInfo = Get-PSDrive -Name "C" }
        $FreeGB  = [Math::Round($DriveInfo.Free / 1GB, 1)]
        $UsedGB  = [Math::Round($DriveInfo.Used / 1GB, 1)]
        $TotalGB = [Math::Round(($DriveInfo.Used + $DriveInfo.Free) / 1GB, 1)]

        # Construct Live Workstation Telemetry Payload
        $Payload = @{
            workstationId      = $WorkstationID
            workstationName    = $WorkstationName
            assignedStaff      = $AssignedStaff
            lastSyncTimestamp  = $Timestamp
            status             = $CurrentStatus
            activeProcessName  = $ActiveProcessName
            activeWindowTitle  = $ActiveWindowTitle
            detectedProjectTag = $DetectedProjectTag
            idleSeconds        = $IdleSeconds
            storageHealth      = @{
                driveLetter = $DriveLetter
                usedGB      = $UsedGB
                freeGB      = $FreeGB
                totalGB     = $TotalGB
            }
            sessionHours       = @{
                premierePro  = [Math::Round($SessionAppSeconds["PremierePro"] / 3600, 2)]
                afterEffects = [Math::Round($SessionAppSeconds["AfterEffects"] / 3600, 2)]
                daVinci      = [Math::Round($SessionAppSeconds["DaVinci"] / 3600, 2)]
                photoshop    = [Math::Round($SessionAppSeconds["Photoshop"] / 3600, 2)]
                chromeDrive  = [Math::Round($SessionAppSeconds["ChromeDrive"] / 3600, 2)]
                idleBreak    = [Math::Round($SessionAppSeconds["IdleBreak"] / 3600, 2)]
            }
        }

        $JsonPayload = $Payload | ConvertTo-Json -Depth 5

        # Display Live Status on Console
        $Color = if ($CurrentStatus -eq "active-editing") { "Yellow" } elseif ($CurrentStatus -eq "idle") { "DarkGray" } else { "Cyan" }
        Write-Host "[$Timestamp] Syncing ($WorkstationID)... Status: [$CurrentStatus.ToUpper()] | Process: $ActiveProcessName | Project Tag: $(if ($DetectedProjectTag) { $DetectedProjectTag } else { 'None' })" -ForegroundColor $Color

        # 1. Option A: Post Telemetry to StudioOS API / Webhook endpoint
        try {
            Invoke-RestMethod -Uri $StudioOS_Webhook_URL -Method Post -Body $JsonPayload -ContentType "application/json" -TimeoutSec 3 -ErrorAction SilentlyContinue | Out-Null
        } catch {
            # If server is unreachable/offline, silently ignore and proceed
        }

        # 2. Option B: Save local JSON sync file (`workstation_live_status.json`) for local network access
        if (Test-Path -Path (Split-Path $LocalJsonOutputPath -Parent) -ErrorAction SilentlyContinue) {
            $JsonPayload | Out-File -FilePath $LocalJsonOutputPath -Encoding UTF8 -Force -ErrorAction SilentlyContinue
        }

    } catch {
        Write-Host "Error in tracker loop: $($_.Exception.Message)" -ForegroundColor Red
    }

    Start-Sleep -Seconds $SyncIntervalSec
}

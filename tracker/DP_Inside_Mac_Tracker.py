#!/usr/bin/env python3
"""
DP INSIDE STUDIO OS - macOS Apple Silicon / Intel Workstation Tracker Agent (v2.0)
100% Free, DPDPA 2023 & IT Act 2000 Compliant Workstation Monitor for Mac.

Monitors active editing software (Premiere Pro, DaVinci Resolve, Final Cut Pro, After Effects, Photoshop),
extracts active project window titles (.prproj, .drp, .fcpxml), measures idle time via ioreg,
and synchronizes telemetry with StudioOS ($0 / ₹0 Monthly Cost).
"""

import sys
import time
import json
import urllib.request
import urllib.error
import subprocess
import os
from datetime import datetime

# ==============================================================================
# WORKSTATION CONFIGURATION (CONFIGURED AUTOMATICALLY BY ADMIN MODAL OR EDIT)
# ==============================================================================
WORKSTATION_ID   = "usr-3"                              # e.g., usr-1 (Saurav), usr-2 (Aditya), usr-3 (Piyali)
WORKSTATION_NAME = "Workstation Mac #3 (Piyali • Editor)"  # Display Title on Dashboard
ASSIGNED_STAFF   = "Piyali Sarkar"                      # Editor Full Name
SYNC_INTERVAL_SEC = 60                                  # Sync telemetry every 60 seconds
STUDIOOS_WEBHOOK_URL = "http://localhost:5173/api/workstation-sync"
LOCAL_JSON_OUTPUT_PATH = "../src/data/workstation_live_status.json"

# Tracked session seconds per app
session_app_seconds = {
    "premierePro": 0,
    "afterEffects": 0,
    "daVinci": 0,
    "photoshop": 0,
    "chromeDrive": 0,
    "idleBreak": 0
}

def get_macos_idle_seconds():
    try:
        output = subprocess.check_output(
            ["ioreg", "-c", "IOHIDSystem"], universal_newlines=True
        )
        for line in output.splitlines():
            if "HIDIdleTime" in line:
                # Value is in nanoseconds, convert to seconds
                parts = line.split("=")
                if len(parts) > 1:
                    idle_ns = int(parts[1].strip())
                    return int(idle_ns / 1_000_000_000)
    except Exception:
        pass
    return 0

def get_active_mac_window():
    """Uses AppleScript (osascript) to get the frontmost app name and active window title."""
    script = '''
    tell application "System Events"
        set frontApp to name of first application process whose frontmost is true
        set windowTitle to ""
        try
            tell process frontApp
                set windowTitle to name of front window
            end tell
        end try
        return frontApp & "|||" & windowTitle
    end tell
    '''
    try:
        res = subprocess.check_output(["osascript", "-e", script], universal_newlines=True).strip()
        if "|||" in res:
            app_name, win_title = res.split("|||", 1)
            return app_name.strip(), win_title.strip()
    except Exception:
        pass
    return "Desktop / Finder", "Workstation Idle / Finder"

def get_mac_storage_health():
    """Checks root filesystem storage health."""
    try:
        st = os.statvfs("/")
        free_bytes = st.f_bavail * st.f_frsize
        total_bytes = st.f_blocks * st.f_frsize
        used_bytes = (st.f_blocks - st.f_bfree) * st.f_frsize
        return {
            "driveLetter": "Macintosh HD (/)",
            "usedGB": round(used_bytes / (1024**3), 1),
            "freeGB": round(free_bytes / (1024**3), 1),
            "totalGB": round(total_bytes / (1024**3), 1)
        }
    except Exception:
        return {"driveLetter": "Macintosh HD", "usedGB": 0, "freeGB": 0, "totalGB": 0}

def main():
    print("====================================================================")
    print(" 🍎 DP INSIDE STUDIO OS - macOS WORKSTATION TRACKER AGENT (v2.0)")
    print(f"    Workstation Seat: {WORKSTATION_NAME} ({WORKSTATION_ID})")
    print(f"    Assigned Editor : {ASSIGNED_STAFF}")
    print(f"    Sync Interval   : Every {SYNC_INTERVAL_SEC} Seconds")
    print("====================================================================")
    print("Status: Live macOS monitoring started. Press [Ctrl + C] to stop.\n")

    while True:
        try:
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            idle_sec = get_macos_idle_seconds()
            app_name, win_title = get_active_mac_window()

            status = "online"
            detected_tag = ""
            process_name = app_name

            if idle_sec > 300:
                status = "idle"
                process_name = "Idle / Break"
                win_title = f"Mac Workstation Idle ({round(idle_sec/60, 1)} mins)"
                session_app_seconds["idleBreak"] += SYNC_INTERVAL_SEC
            else:
                lower_app = app_name.lower()
                if "premiere" in lower_app:
                    process_name = "Adobe Premiere Pro"
                    status = "active-editing"
                    session_app_seconds["premierePro"] += SYNC_INTERVAL_SEC
                    if ".prproj" in win_title:
                        detected_tag = win_title.split(".prproj")[0] + ".prproj"
                    else:
                        detected_tag = win_title.split("-")[0].strip()
                elif "resolve" in lower_app or "davinci" in lower_app:
                    process_name = "DaVinci Resolve"
                    status = "active-editing"
                    session_app_seconds["daVinci"] += SYNC_INTERVAL_SEC
                    detected_tag = win_title.split("-")[0].strip()
                elif "final cut" in lower_app:
                    process_name = "Apple Final Cut Pro"
                    status = "active-editing"
                    session_app_seconds["premierePro"] += SYNC_INTERVAL_SEC # Count FCP toward edit hours
                    detected_tag = win_title.split("-")[0].strip()
                elif "after effects" in lower_app:
                    process_name = "Adobe After Effects"
                    status = "active-editing"
                    session_app_seconds["afterEffects"] += SYNC_INTERVAL_SEC
                    if ".aep" in win_title:
                        detected_tag = win_title.split(".aep")[0] + ".aep"
                    else:
                        detected_tag = win_title.split("-")[0].strip()
                elif "photoshop" in lower_app:
                    process_name = "Adobe Photoshop"
                    status = "active-editing"
                    session_app_seconds["photoshop"] += SYNC_INTERVAL_SEC
                    detected_tag = win_title.split("-")[0].strip()
                elif "chrome" in lower_app or "safari" in lower_app:
                    process_name = f"{app_name} (Cloud Drive / CRM)"
                    status = "online"
                    session_app_seconds["chromeDrive"] += SYNC_INTERVAL_SEC
                    detected_tag = "Cloud Vault / Review"

            storage = get_mac_storage_health()

            payload = {
                "workstationId": WORKSTATION_ID,
                "workstationName": WORKSTATION_NAME,
                "assignedStaff": ASSIGNED_STAFF,
                "lastSyncTimestamp": now_str,
                "status": status,
                "activeProcessName": process_name,
                "activeWindowTitle": win_title,
                "detectedProjectTag": detected_tag,
                "idleSeconds": idle_sec,
                "storageHealth": storage,
                "sessionHours": {
                    "premierePro": round(session_app_seconds["premierePro"] / 3600, 2),
                    "afterEffects": round(session_app_seconds["afterEffects"] / 3600, 2),
                    "daVinci": round(session_app_seconds["daVinci"] / 3600, 2),
                    "photoshop": round(session_app_seconds["photoshop"] / 3600, 2),
                    "chromeDrive": round(session_app_seconds["chromeDrive"] / 3600, 2),
                    "idleBreak": round(session_app_seconds["idleBreak"] / 3600, 2)
                }
            }

            json_data = json.dumps(payload, indent=2)
            print(f"[{now_str}] Syncing Mac ({WORKSTATION_ID})... Status: [{status.upper()}] | Process: {process_name} | Project Tag: {detected_tag or 'None'}")

            # 1. Post to Webhook/API
            try:
                req = urllib.request.Request(
                    STUDIOOS_WEBHOOK_URL,
                    data=json_data.encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                urllib.request.urlopen(req, timeout=3)
            except Exception:
                pass

            # 2. Save local sync file if directory exists
            try:
                local_dir = os.path.dirname(LOCAL_JSON_OUTPUT_PATH)
                if os.path.exists(local_dir):
                    with open(LOCAL_JSON_OUTPUT_PATH, "w", encoding="utf-8") as f:
                        f.write(json_data)
            except Exception:
                pass

        except Exception as e:
            print(f"Error in Mac tracker loop: {e}")

        time.sleep(SYNC_INTERVAL_SEC)

if __name__ == "__main__":
    main()

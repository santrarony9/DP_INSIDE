# 🎬 DP Inside StudioOS - Windows PC Workstation Tracker (`Part 2`)

This folder contains the **100% Free, Zero-SaaS-Cost Windows Workstation PC Tracker Agent (`DP_Inside_PC_Tracker.ps1`)** and **Automatic Boot / Startup Installers** specifically engineered for DP Inside StudioOS.

---

## ⚡ One-Click Automatic Boot Setup (`Runs Automatically Whenever PC Turns On!`)

We have built a **1-Click Automatic Boot Installer (`Install_Tracker_Startup.bat`)** that ensures your editors don't have to remember to start any script manually each morning:

### How to Install on Each of Your 6 PC Seats (`Takes 15 Seconds per PC`):
1. Open `DP_Inside_PC_Tracker.ps1` in Notepad and verify the `WorkstationID` (`usr-1` for Saurav, `usr-2` for Aditya, `usr-3` for Piyali, `usr-4` for Rohan, `usr-5` for Sneha, `usr-6` for Vikram).
2. **Double-Click `Install_Tracker_Startup.bat`!**
3. **Done!** That double-click automatically:
   - Copies the tracking engine to `C:\ProgramData\DPInsideStudioOS\`.
   - Creates a **Silent VBScript Background Launcher (`Run_Silent.vbs`)** so **NO black command prompt terminal window popped up** on the editor's screen.
   - Registers a **Windows Task Scheduler Job & Startup Shortcut (`DP_Inside_StudioOS_Tracker`)** so that every single time the PC boots up or logs in, it launches 100% silently in the background and starts syncing hours to your dashboard!

---

## 🛑 How to Stop or Uninstall the Automatic Boot Tracker
If you ever reassign a PC or want to stop background tracking on a computer:
* **Double-Click `Uninstall_Tracker_Startup.bat`!**
* It cleanly kills the background process, removes the startup shortcuts, unregisters the scheduled task, and deletes the `C:\ProgramData\` files in 1 second.

---

## 🛠️ What `DP_Inside_PC_Tracker.ps1` Monitors ($0 Cost / DPDPA Compliant)
Instead of paying ₹700 to ₹1,200/month per PC (`₹6,000+/month total`) for commercial spy software (`Time Doctor, Hubstaff`), this native Windows system script monitors:
1. **Active Focused Application:** Detects if the editor is actively running `Adobe Premiere Pro.exe`, `DaVinci Resolve.exe`, `AfterFX.exe`, or `Photoshop.exe`.
2. **Project File Title Extraction:** Automatically reads the project file name (.prproj / .drp / .aep) right from the top window bar (`e.g. Diandra_Wedding_Cut.prproj`).
3. **Exact Keyboard/Mouse Idle Detection:** Tracks if the workstation sits idle (`no mouse/keyboard movement for > 5 minutes`) so you differentiate active editing from lunch breaks.
4. **Local D:\ Drive Storage Health:** Measures exact free vs. used GB on local workstation scratch drives.
5. **Direct Telemetry Sync:** Posts live status directly to your StudioOS Web Dashboard over HTTP or saves to `src/data/workstation_live_status.json` every 60 seconds!

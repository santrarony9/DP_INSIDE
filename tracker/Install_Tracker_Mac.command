#!/bin/bash
# ===============================================================================
#   DP INSIDE STUDIO OS - macOS Apple Silicon / Intel 1-Click Startup Installer
# ===============================================================================

echo "==============================================================================="
echo " 🍎 DP INSIDE STUDIO OS - macOS AUTOMATIC BOOT TRACKER INSTALLER"
echo "==============================================================================="

# 1. Target Directory
INSTALL_DIR="$HOME/Library/Application Support/DPInsideStudioOS"
mkdir -p "$INSTALL_DIR"

# 2. Copy Python script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cp -f "$SCRIPT_DIR/DP_Inside_Mac_Tracker.py" "$INSTALL_DIR/DP_Inside_Mac_Tracker.py"
chmod +x "$INSTALL_DIR/DP_Inside_Mac_Tracker.py"

# 3. Create macOS LaunchAgent plist so it runs on system boot & login silently
PLIST_PATH="$HOME/Library/LaunchAgents/com.dpinside.studioos.tracker.plist"
mkdir -p "$HOME/Library/LaunchAgents"

cat << EOF > "$PLIST_PATH"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.dpinside.studioos.tracker</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>$INSTALL_DIR/DP_Inside_Mac_Tracker.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$INSTALL_DIR/tracker_stdout.log</string>
    <key>StandardErrorPath</key>
    <string>$INSTALL_DIR/tracker_stderr.log</string>
</dict>
</plist>
EOF

# 4. Load the LaunchAgent right now
launchctl unload "$PLIST_PATH" 2>/dev/null
launchctl load -w "$PLIST_PATH"

echo ""
echo "✅ SUCCESS! macOS Boot Tracker installed & launched silently in the background."
echo "   - Installation Folder : $INSTALL_DIR"
echo "   - macOS LaunchAgent   : $PLIST_PATH"
echo ""
echo "Every time this Mac logs in or restarts, DP_Inside_Mac_Tracker.py will start automatically!"

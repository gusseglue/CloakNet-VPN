# WireGuard Integration

This directory contains configuration for WireGuard integration with CloakNet VPN.

## Automatic Installation

When you install CloakNet VPN on Windows, WireGuard will be **automatically downloaded and installed** if it's not already present on your system.

The installer:
1. Checks if WireGuard is already installed
2. If not found, downloads the official WireGuard installer from https://download.wireguard.com/
3. Installs WireGuard silently in the background
4. Continues with CloakNet VPN installation

**No manual steps required!**

## How It Works

### Windows
- The NSIS installer downloads `wireguard-installer.exe` from the official WireGuard website
- Installs silently using `/S` flag
- If automatic installation fails, user is prompted to install manually

### macOS
- WireGuard tools should be installed via Homebrew: `brew install wireguard-tools`
- The app will guide users if WireGuard is not found

### Linux
- WireGuard tools should be installed via package manager:
  - Debian/Ubuntu: `sudo apt install wireguard-tools`
  - Fedora: `sudo dnf install wireguard-tools`
- The app will guide users if WireGuard is not found

## For Developers

The installer script is located at `installer/installer.nsh` and uses:
- NSIS INetC plugin for downloading files
- Silent installation of the official WireGuard installer

No WireGuard binaries need to be bundled with the build - everything is downloaded at install time.


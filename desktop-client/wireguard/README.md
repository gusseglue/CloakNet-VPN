# WireGuard Binaries

This directory contains WireGuard binaries that are bundled with the CloakNet VPN installer.

## Required files for Windows builds:

### For Windows Installer (MSI for silent install)
- `wireguard-amd64.msi` - WireGuard installer for 64-bit Windows

Download from: https://download.wireguard.com/windows-client/

### For runtime (bundled with app)
- `wg.exe` - WireGuard CLI tool
- `wireguard.exe` - WireGuard tunnel service

These can be extracted from the MSI installer or downloaded separately.

## How to obtain WireGuard binaries

### Option 1: Download MSI directly
1. Go to https://download.wireguard.com/windows-client/
2. Download the latest `wireguard-amd64-X.X.X.msi`
3. Rename it to `wireguard-amd64.msi` and place in this directory

### Option 2: Extract from official installer
1. Install WireGuard from https://www.wireguard.com/install/
2. Copy `wg.exe` and `wireguard.exe` from `C:\Program Files\WireGuard\`

## Build Process

During the Windows build, the installer will:
1. Check if WireGuard is already installed on the user's system
2. If not installed, automatically install it using the bundled MSI
3. This ensures a seamless installation experience for users

## macOS and Linux

On macOS and Linux, WireGuard tools are installed automatically via the app:
- The app will prompt for administrator privileges to install WireGuard
- Uses system package managers (brew on macOS, apt/dnf on Linux)

Users no longer need to manually install WireGuard - the installer handles everything.


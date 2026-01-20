# WireGuard Binaries

This directory should contain WireGuard binaries for Windows.

## Required files for Windows builds:

- `wg.exe` - WireGuard CLI tool
- `wireguard.exe` - WireGuard tunnel service

Download from: https://www.wireguard.com/install/

## macOS and Linux

On macOS and Linux, WireGuard tools should be installed system-wide:

**macOS:**
```bash
brew install wireguard-tools
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt install wireguard-tools
```

**Linux (Fedora):**
```bash
sudo dnf install wireguard-tools
```

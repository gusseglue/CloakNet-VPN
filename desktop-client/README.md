# CloakNet VPN Desktop Client

Electron-based desktop VPN client for CloakNet VPN service.

## Features

- Activation key login
- WireGuard VPN tunnel integration
- System tray with connection status
- Auto-reconnect on startup
- Cross-platform (Windows, macOS, Linux)

## Prerequisites

### Windows
- Download WireGuard from https://www.wireguard.com/install/
- The `wg.exe` and `wireguard.exe` tools will be bundled with the app

### macOS
```bash
brew install wireguard-tools
```

### Linux
```bash
sudo apt install wireguard-tools  # Debian/Ubuntu
sudo dnf install wireguard-tools  # Fedora
```

## Development

### Install dependencies
```bash
npm install
```

### Run in development
```bash
npm start
```

### Build for distribution

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Configuration

Set the API URL environment variable:
```bash
export CLOAKNET_API_URL=https://your-server.com
```

Or modify the default in `src/main.js`.

## Architecture

```
desktop-client/
├── src/
│   ├── main.js       # Main Electron process
│   ├── preload.js    # Preload script for IPC
│   └── index.html    # UI
├── assets/           # App icons
├── wireguard/        # WireGuard binaries (Windows)
└── package.json      # Dependencies and build config
```

## How It Works

1. User enters activation key
2. Key is validated against the backend API (`/api/vpn/validate`)
3. If valid, WireGuard keys are generated locally
4. WireGuard configuration is created with server details
5. VPN tunnel is established using `wg-quick`

## Security

- Activation keys are stored encrypted using electron-store
- WireGuard private keys never leave the device
- All traffic is encrypted with WireGuard's modern cryptography

## License

Proprietary - All rights reserved

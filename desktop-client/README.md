# CloakNet VPN Desktop Client

Electron-based desktop VPN client for CloakNet VPN service.

## Features

- Activation key login
- WireGuard VPN tunnel integration
- System tray with connection status
- Auto-reconnect on startup
- Cross-platform (Windows, macOS, Linux)
- **Automatic WireGuard installation** - No manual setup required!

## Installation

Simply download and run the installer for your platform. The installer will:
1. Install CloakNet VPN
2. Automatically install WireGuard if not already present
3. Create desktop and start menu shortcuts

That's it! Just enter your activation key and connect.

## Development

### Prerequisites

Before building, ensure you have the WireGuard binaries in the `wireguard/` folder.
See `wireguard/README.md` for details.

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
├── assets/           # App icons and installer assets
├── installer/        # NSIS installer customization scripts
├── wireguard/        # WireGuard binaries (Windows)
└── package.json      # Dependencies and build config
```

## How It Works

1. User installs the app (WireGuard is installed automatically)
2. User enters activation key
3. Key is validated against the backend API (`/api/vpn/validate`)
4. If valid, WireGuard keys are generated locally
5. WireGuard configuration is created with server details
6. VPN tunnel is established using WireGuard

## Security

- Activation keys are stored encrypted using electron-store
- WireGuard private keys never leave the device
- All traffic is encrypted with WireGuard's modern cryptography

## License

Proprietary - All rights reserved

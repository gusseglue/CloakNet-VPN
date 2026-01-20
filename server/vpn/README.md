# CloakNet VPN Server

WireGuard-based VPN server setup for CloakNet.

## Requirements

- Linux server (Ubuntu 20.04+ / Debian 11+ / CentOS 8+ recommended)
- Root access
- Public IP address
- Port 51820/UDP open

## Quick Setup

```bash
# Make scripts executable
chmod +x setup.sh
chmod +x scripts/peer-manager.sh

# Run setup (as root)
sudo ./setup.sh
```

## Configuration

The setup script will:
1. Install WireGuard
2. Generate server keys
3. Configure the network interface
4. Enable IP forwarding
5. Configure firewall rules
6. Start the VPN service

## Environment Variables

You can customize the setup:

```bash
export WG_PORT=51820           # WireGuard port
export SERVER_PUBLIC_IP=x.x.x.x  # Override auto-detected public IP
sudo -E ./setup.sh
```

## Peer Management

After setup, use the peer manager script:

```bash
# Add a new peer
sudo ./scripts/peer-manager.sh add user123

# List all peers
sudo ./scripts/peer-manager.sh list

# Show peer config
sudo ./scripts/peer-manager.sh show user123

# Remove a peer
sudo ./scripts/peer-manager.sh remove user123
```

## Integration with Web App

After running setup, add these to your `.env`:

```bash
WG_SERVER_PUBLIC_KEY=<from setup output>
VPN_SERVER_HOST=<your server IP>
VPN_SERVER_PORT=51820
```

The server info is also saved to `/etc/wireguard/server-info.json`.

## File Structure

```
/etc/wireguard/
├── wg0.conf              # Main WireGuard config
├── server-info.json      # Server info for web app
├── keys/
│   ├── server_private.key
│   └── server_public.key
└── peers/
    ├── user1.conf
    ├── user2.conf
    └── ...
```

## Monitoring

```bash
# Show WireGuard status
sudo wg show

# Show connected peers
sudo wg show wg0 peers

# View logs
sudo journalctl -u wg-quick@wg0
```

## Troubleshooting

### Port not accessible
```bash
# Check if WireGuard is listening
sudo ss -ulnp | grep 51820

# Check firewall
sudo ufw status
sudo firewall-cmd --list-all
```

### Peers can't connect
```bash
# Check IP forwarding
cat /proc/sys/net/ipv4/ip_forward  # Should be 1

# Check NAT rules
sudo iptables -t nat -L POSTROUTING
```

### Service not starting
```bash
# Check service status
sudo systemctl status wg-quick@wg0

# View logs
sudo journalctl -xe -u wg-quick@wg0
```

## Security Notes

- Keep `server_private.key` secure
- Regularly rotate peer keys for compromised accounts
- Consider implementing fail2ban for the SSH service
- Use strong activation keys

## License

Proprietary - All rights reserved

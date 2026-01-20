#!/bin/bash
# CloakNet VPN Server Setup Script
# This script sets up WireGuard VPN server on the same machine as the website

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}CloakNet VPN Server Setup${NC}"
echo -e "${GREEN}================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Please run as root (sudo)${NC}"
  exit 1
fi

# Configuration
WG_INTERFACE="wg0"
WG_PORT="${WG_PORT:-51820}"
WG_NETWORK="10.0.0.0/24"
WG_SERVER_IP="10.0.0.1"
SERVER_PUBLIC_IP="${SERVER_PUBLIC_IP:-$(curl -s ifconfig.me)}"
CONFIG_DIR="/etc/wireguard"
KEYS_DIR="${CONFIG_DIR}/keys"

echo -e "${YELLOW}Configuration:${NC}"
echo "  Interface: ${WG_INTERFACE}"
echo "  Port: ${WG_PORT}"
echo "  Network: ${WG_NETWORK}"
echo "  Server IP: ${WG_SERVER_IP}"
echo "  Public IP: ${SERVER_PUBLIC_IP}"

# Install WireGuard
echo -e "\n${YELLOW}Installing WireGuard...${NC}"
if command -v apt-get &> /dev/null; then
  apt-get update
  apt-get install -y wireguard wireguard-tools qrencode
elif command -v dnf &> /dev/null; then
  dnf install -y wireguard-tools qrencode
elif command -v yum &> /dev/null; then
  yum install -y epel-release elrepo-release
  yum install -y kmod-wireguard wireguard-tools qrencode
else
  echo -e "${RED}Unsupported package manager. Please install WireGuard manually.${NC}"
  exit 1
fi

# Create directories
mkdir -p ${CONFIG_DIR}
mkdir -p ${KEYS_DIR}
chmod 700 ${CONFIG_DIR}
chmod 700 ${KEYS_DIR}

# Generate server keys if they don't exist
if [ ! -f "${KEYS_DIR}/server_private.key" ]; then
  echo -e "\n${YELLOW}Generating server keys...${NC}"
  wg genkey | tee ${KEYS_DIR}/server_private.key | wg pubkey > ${KEYS_DIR}/server_public.key
  chmod 600 ${KEYS_DIR}/server_private.key
  echo -e "${GREEN}Server keys generated${NC}"
else
  echo -e "${YELLOW}Server keys already exist, skipping...${NC}"
fi

SERVER_PRIVATE_KEY=$(cat ${KEYS_DIR}/server_private.key)
SERVER_PUBLIC_KEY=$(cat ${KEYS_DIR}/server_public.key)

echo -e "\n${GREEN}Server Public Key: ${SERVER_PUBLIC_KEY}${NC}"

# Detect network interface
DEFAULT_INTERFACE=$(ip route | grep default | awk '{print $5}' | head -1)
echo -e "${YELLOW}Detected default interface: ${DEFAULT_INTERFACE}${NC}"

# Create server configuration
echo -e "\n${YELLOW}Creating WireGuard configuration...${NC}"

cat > ${CONFIG_DIR}/${WG_INTERFACE}.conf << EOF
[Interface]
Address = ${WG_SERVER_IP}/24
ListenPort = ${WG_PORT}
PrivateKey = ${SERVER_PRIVATE_KEY}
SaveConfig = true

# NAT configuration
PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostUp = iptables -A FORWARD -o %i -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o ${DEFAULT_INTERFACE} -j MASQUERADE

PostDown = iptables -D FORWARD -i %i -j ACCEPT
PostDown = iptables -D FORWARD -o %i -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o ${DEFAULT_INTERFACE} -j MASQUERADE

# Peers will be added dynamically by the provisioning service
EOF

chmod 600 ${CONFIG_DIR}/${WG_INTERFACE}.conf

# Enable IP forwarding
echo -e "\n${YELLOW}Enabling IP forwarding...${NC}"
echo "net.ipv4.ip_forward = 1" > /etc/sysctl.d/99-wireguard.conf
sysctl -p /etc/sysctl.d/99-wireguard.conf

# Configure firewall
echo -e "\n${YELLOW}Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
  ufw allow ${WG_PORT}/udp
  ufw reload
elif command -v firewall-cmd &> /dev/null; then
  firewall-cmd --permanent --add-port=${WG_PORT}/udp
  firewall-cmd --reload
else
  echo -e "${YELLOW}No firewall detected. Please manually open port ${WG_PORT}/udp${NC}"
fi

# Start WireGuard
echo -e "\n${YELLOW}Starting WireGuard...${NC}"
systemctl enable wg-quick@${WG_INTERFACE}
systemctl start wg-quick@${WG_INTERFACE}

# Verify
echo -e "\n${YELLOW}Verifying setup...${NC}"
wg show ${WG_INTERFACE}

# Save configuration for the web app
echo -e "\n${YELLOW}Saving configuration for web app...${NC}"
cat > ${CONFIG_DIR}/server-info.json << EOF
{
  "interface": "${WG_INTERFACE}",
  "publicKey": "${SERVER_PUBLIC_KEY}",
  "endpoint": "${SERVER_PUBLIC_IP}:${WG_PORT}",
  "allowedIPs": "${WG_NETWORK}",
  "dns": "1.1.1.1, 8.8.8.8"
}
EOF

chmod 644 ${CONFIG_DIR}/server-info.json

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "Server Public Key: ${GREEN}${SERVER_PUBLIC_KEY}${NC}"
echo -e "Endpoint: ${GREEN}${SERVER_PUBLIC_IP}:${WG_PORT}${NC}"
echo ""
echo -e "Add this to your .env file:"
echo -e "${YELLOW}WG_SERVER_PUBLIC_KEY=${SERVER_PUBLIC_KEY}${NC}"
echo -e "${YELLOW}VPN_SERVER_HOST=${SERVER_PUBLIC_IP}${NC}"
echo -e "${YELLOW}VPN_SERVER_PORT=${WG_PORT}${NC}"
echo ""
echo -e "Configuration saved to: ${CONFIG_DIR}/server-info.json"

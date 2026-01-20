#!/bin/bash
# Peer Management Script for CloakNet VPN
# Manages WireGuard peers (add, remove, list)

set -e

CONFIG_DIR="/etc/wireguard"
WG_INTERFACE="wg0"
PEERS_DIR="${CONFIG_DIR}/peers"

# Create peers directory if it doesn't exist
mkdir -p ${PEERS_DIR}

# Check if WireGuard is installed
if ! command -v wg &> /dev/null; then
  echo -e "${RED}Error: WireGuard is not installed. Run setup.sh first.${NC}"
  exit 1
fi

# Check if WireGuard interface exists (for list command)
check_interface() {
  if ! wg show ${WG_INTERFACE} &> /dev/null; then
    echo -e "${RED}Error: WireGuard interface ${WG_INTERFACE} is not running.${NC}"
    echo -e "${YELLOW}Try: sudo systemctl start wg-quick@${WG_INTERFACE}${NC}"
    exit 1
  fi
}

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get next available IP
get_next_ip() {
  local last_octet=2  # Start from .2 (server is .1)
  
  while [ $last_octet -lt 255 ]; do
    local ip="10.0.0.${last_octet}"
    local exists=false
    
    # Check if IP is already assigned
    for peer_file in ${PEERS_DIR}/*.conf 2>/dev/null; do
      if [ -f "$peer_file" ] && grep -q "Address = ${ip}" "$peer_file"; then
        exists=true
        break
      fi
    done
    
    if [ "$exists" = false ]; then
      echo "${ip}"
      return 0
    fi
    
    last_octet=$((last_octet + 1))
  done
  
  echo ""
  return 1
}

# Add a new peer
add_peer() {
  local peer_id="$1"
  
  if [ -z "$peer_id" ]; then
    echo -e "${RED}Error: Peer ID required${NC}"
    echo "Usage: $0 add <peer_id>"
    exit 1
  fi
  
  check_interface
  
  local peer_file="${PEERS_DIR}/${peer_id}.conf"
  
  if [ -f "$peer_file" ]; then
    echo -e "${YELLOW}Peer ${peer_id} already exists${NC}"
    cat "$peer_file"
    exit 0
  fi
  
  # Generate keys
  local private_key=$(wg genkey)
  local public_key=$(echo "$private_key" | wg pubkey)
  
  # Get next IP
  local peer_ip=$(get_next_ip)
  if [ -z "$peer_ip" ]; then
    echo -e "${RED}Error: No available IP addresses${NC}"
    exit 1
  fi
  
  # Get server info
  if [ ! -f "${CONFIG_DIR}/keys/server_public.key" ]; then
    echo -e "${RED}Error: Server public key not found. Run setup.sh first.${NC}"
    exit 1
  fi
  
  if [ ! -f "${CONFIG_DIR}/server-info.json" ]; then
    echo -e "${RED}Error: Server info not found. Run setup.sh first.${NC}"
    exit 1
  fi
  
  local server_public_key=$(cat ${CONFIG_DIR}/keys/server_public.key)
  # More compatible JSON parsing
  local server_endpoint=$(sed -n 's/.*"endpoint"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' ${CONFIG_DIR}/server-info.json)
  
  # Create peer config
  cat > "$peer_file" << EOF
# CloakNet VPN - Peer: ${peer_id}
# Generated: $(date)

[Interface]
PrivateKey = ${private_key}
Address = ${peer_ip}/32
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = ${server_public_key}
AllowedIPs = 0.0.0.0/0
Endpoint = ${server_endpoint}
PersistentKeepalive = 25
EOF

  chmod 600 "$peer_file"
  
  # Add peer to server config
  wg set ${WG_INTERFACE} peer ${public_key} allowed-ips ${peer_ip}/32
  
  # Save config
  wg-quick save ${WG_INTERFACE}
  
  echo -e "${GREEN}Peer ${peer_id} added successfully${NC}"
  echo ""
  echo "Peer Public Key: ${public_key}"
  echo "Peer IP: ${peer_ip}"
  echo ""
  echo "Client configuration saved to: ${peer_file}"
  
  # Output as JSON for API integration
  cat << EOF
{
  "peerId": "${peer_id}",
  "publicKey": "${public_key}",
  "privateKey": "${private_key}",
  "address": "${peer_ip}/32",
  "endpoint": "${server_endpoint}",
  "serverPublicKey": "${server_public_key}",
  "dns": "1.1.1.1, 8.8.8.8"
}
EOF
}

# Remove a peer
remove_peer() {
  local peer_id="$1"
  
  if [ -z "$peer_id" ]; then
    echo -e "${RED}Error: Peer ID required${NC}"
    echo "Usage: $0 remove <peer_id>"
    exit 1
  fi
  
  check_interface
  
  local peer_file="${PEERS_DIR}/${peer_id}.conf"
  
  if [ ! -f "$peer_file" ]; then
    echo -e "${YELLOW}Peer ${peer_id} not found${NC}"
    exit 0
  fi
  
  # Get public key from private key in config
  local private_key=$(grep "PrivateKey" "$peer_file" | cut -d'=' -f2 | tr -d ' ')
  local public_key=$(echo "$private_key" | wg pubkey)
  
  # Remove from server
  wg set ${WG_INTERFACE} peer ${public_key} remove
  
  # Save config
  wg-quick save ${WG_INTERFACE}
  
  # Remove peer file
  rm -f "$peer_file"
  
  echo -e "${GREEN}Peer ${peer_id} removed successfully${NC}"
}

# List all peers
list_peers() {
  check_interface
  
  echo -e "${GREEN}Active Peers:${NC}"
  echo ""
  
  wg show ${WG_INTERFACE} peers | while read public_key; do
    local allowed_ips=$(wg show ${WG_INTERFACE} allowed-ips | grep "$public_key" | awk '{print $2}')
    local latest_handshake=$(wg show ${WG_INTERFACE} latest-handshakes | grep "$public_key" | awk '{print $2}')
    local transfer=$(wg show ${WG_INTERFACE} transfer | grep "$public_key" | awk '{print "RX: "$2" TX: "$3}')
    
    # Find peer ID from files
    local peer_id="unknown"
    for peer_file in ${PEERS_DIR}/*.conf 2>/dev/null; do
      if [ -f "$peer_file" ]; then
        local file_private=$(grep "PrivateKey" "$peer_file" | cut -d'=' -f2 | tr -d ' ')
        local file_public=$(echo "$file_private" | wg pubkey 2>/dev/null)
        if [ "$file_public" = "$public_key" ]; then
          peer_id=$(basename "$peer_file" .conf)
          break
        fi
      fi
    done
    
    echo "  Peer: ${peer_id}"
    echo "    Public Key: ${public_key}"
    echo "    Allowed IPs: ${allowed_ips}"
    if [ -n "$latest_handshake" ] && [ "$latest_handshake" != "0" ]; then
      echo "    Last Handshake: $(date -d @${latest_handshake} 2>/dev/null || echo ${latest_handshake})"
    fi
    if [ -n "$transfer" ]; then
      echo "    Transfer: ${transfer}"
    fi
    echo ""
  done
}

# Show peer config (for client)
show_peer() {
  local peer_id="$1"
  
  if [ -z "$peer_id" ]; then
    echo -e "${RED}Error: Peer ID required${NC}"
    echo "Usage: $0 show <peer_id>"
    exit 1
  fi
  
  local peer_file="${PEERS_DIR}/${peer_id}.conf"
  
  if [ ! -f "$peer_file" ]; then
    echo -e "${RED}Peer ${peer_id} not found${NC}"
    exit 1
  fi
  
  cat "$peer_file"
}

# Main
case "$1" in
  add)
    add_peer "$2"
    ;;
  remove)
    remove_peer "$2"
    ;;
  list)
    list_peers
    ;;
  show)
    show_peer "$2"
    ;;
  *)
    echo "CloakNet VPN Peer Management"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  add <peer_id>     Add a new peer"
    echo "  remove <peer_id>  Remove a peer"
    echo "  list              List all peers"
    echo "  show <peer_id>    Show peer configuration"
    exit 1
    ;;
esac

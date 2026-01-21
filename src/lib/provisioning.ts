import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';
import prisma from './prisma';

const execAsync = promisify(exec);

/**
 * VPN Provisioning Service
 * 
 * This service acts as the bridge between the backend and VPN server.
 * It handles generation, validation, and revocation of activation keys.
 * 
 * In production, this would communicate with the actual VPN server (WireGuard/OpenVPN)
 * via internal API calls on localhost.
 */

/**
 * Generate a secure, unique activation key
 * Format: CLOAK-XXXX-XXXX-XXXX-XXXX (uppercase alphanumeric)
 */
function generateActivationKey(): string {
  const segments: string[] = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars like 0/O, 1/I/L
  
  for (let i = 0; i < 4; i++) {
    let segment = '';
    for (let j = 0; j < 4; j++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      segment += chars[randomIndex];
    }
    segments.push(segment);
  }
  
  return `CLOAK-${segments.join('-')}`;
}

/**
 * Create a new activation key for a user
 * Called when a subscription becomes active
 */
export async function createKey(userId: string): Promise<string | null> {
  try {
    // Generate a unique key
    let key = generateActivationKey();
    let attempts = 0;
    const maxAttempts = 5;
    
    // Ensure uniqueness (very unlikely to collide, but be safe)
    while (attempts < maxAttempts) {
      const existingCount = await prisma.activationKey.count({
        where: { key },
      });
      
      if (existingCount === 0) break;
      
      key = generateActivationKey();
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      console.error('Failed to generate unique activation key after max attempts');
      return null;
    }
    
    // Upsert the activation key for the user
    await prisma.activationKey.upsert({
      where: { userId },
      update: {
        key,
        issuedAt: new Date(),
        revokedAt: null, // Clear any previous revocation
      },
      create: {
        userId,
        key,
        issuedAt: new Date(),
      },
    });
    
    console.log(`Activation key created for user ${userId}`);
    return key;
  } catch (error) {
    console.error('Error creating activation key:', error);
    return null;
  }
}

/**
 * Validate an activation key
 * Called by VPN server or desktop client to verify access
 */
export async function validateKey(key: string): Promise<{
  valid: boolean;
  userId?: string;
  reason?: string;
}> {
  try {
    if (!key || typeof key !== 'string') {
      return { valid: false, reason: 'Invalid key format' };
    }
    
    // Normalize key format
    const normalizedKey = key.trim().toUpperCase();
    
    // Find the activation key
    const activationKey = await prisma.activationKey.findFirst({
      where: { key: normalizedKey },
      include: {
        user: {
          include: {
            subscription: true,
          },
        },
      },
    });
    
    if (!activationKey) {
      return { valid: false, reason: 'Key not found' };
    }
    
    // Check if key has been revoked
    if (activationKey.revokedAt) {
      return { valid: false, reason: 'Key has been revoked' };
    }
    
    // Check if user has active subscription
    const subscription = activationKey.user.subscription;
    if (!subscription) {
      return { valid: false, reason: 'No subscription found' };
    }
    
    const now = new Date();
    const isActive = 
      subscription.status === 'active' ||
      (subscription.status === 'canceled' && 
       subscription.currentPeriodEnd && 
       now < subscription.currentPeriodEnd);
    
    if (!isActive) {
      return { valid: false, reason: 'Subscription not active' };
    }
    
    return {
      valid: true,
      userId: activationKey.userId,
    };
  } catch (error) {
    console.error('Error validating activation key:', error);
    return { valid: false, reason: 'Validation error' };
  }
}

/**
 * Revoke an activation key
 * Called when subscription expires or is manually revoked
 */
export async function revokeKey(key: string): Promise<boolean> {
  try {
    if (!key || typeof key !== 'string') {
      return false;
    }
    
    const normalizedKey = key.trim().toUpperCase();
    
    const activationKey = await prisma.activationKey.findFirst({
      where: { key: normalizedKey },
    });
    
    if (!activationKey) {
      return false;
    }
    
    await prisma.activationKey.update({
      where: { id: activationKey.id },
      data: { revokedAt: new Date() },
    });
    
    console.log(`Activation key revoked: ${normalizedKey}`);
    return true;
  } catch (error) {
    console.error('Error revoking activation key:', error);
    return false;
  }
}

/**
 * Revoke activation key for a specific user
 * Called when subscription expires
 */
export async function revokeKeyByUserId(userId: string): Promise<boolean> {
  try {
    const activationKey = await prisma.activationKey.findUnique({
      where: { userId },
    });
    
    // No activation key record exists for this user
    if (!activationKey) {
      return false;
    }
    
    // Key is null or already inactive - nothing to revoke, but not an error
    if (!activationKey.key) {
      return false;
    }
    
    await prisma.activationKey.update({
      where: { userId },
      data: { revokedAt: new Date() },
    });
    
    console.log(`Activation key revoked for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error revoking activation key by user ID:', error);
    return false;
  }
}

/**
 * Get VPN connection configuration for a validated key
 * Returns WireGuard configuration for the desktop client
 */
export function getVpnConfig(_userId: string): {
  server: string;
  port: number;
  protocol: string;
  location: string;
  serverPublicKey: string;
} {
  // WireGuard server configuration
  // The server public key MUST be generated during VPN server setup
  const serverPublicKey = process.env.WG_SERVER_PUBLIC_KEY;
  
  if (!serverPublicKey) {
    console.error('WG_SERVER_PUBLIC_KEY environment variable is not set!');
  }
  
  return {
    server: process.env.VPN_SERVER_HOST || 'vpn.cloaknet.dk',
    port: parseInt(process.env.VPN_SERVER_PORT || '51820', 10),
    protocol: process.env.VPN_PROTOCOL || 'wireguard',
    location: 'Germany',
    serverPublicKey: serverPublicKey || '',
  };
}

/**
 * Generate a consistent client IP based on user ID
 * Uses hash to ensure same user always gets same IP
 */
function generateClientIPFromUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Use last octet between 2-254 (1 is server, 255 is broadcast)
  const lastOctet = (Math.abs(hash) % 253) + 2;
  return `10.0.0.${lastOctet}`;
}

/**
 * Validate and sanitize WireGuard interface name
 * Only allows alphanumeric characters and hyphens
 */
function sanitizeInterfaceName(name: string): string | null {
  if (!name || typeof name !== 'string') return null;
  // WireGuard interfaces are typically like wg0, wg1, wg-vpn, etc.
  const interfaceRegex = /^[a-zA-Z0-9-]{1,15}$/;
  if (!interfaceRegex.test(name)) return null;
  return name;
}

/**
 * Validate IP address format (10.0.0.X)
 */
function isValidClientIP(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return false;
  const ipRegex = /^10\.0\.0\.(25[0-4]|2[0-4][0-9]|1[0-9]{2}|[2-9][0-9]|[2-9])$/;
  return ipRegex.test(ip);
}

/**
 * Register a client peer on the WireGuard server
 * Called when a client connects with their public key
 * Automatically adds the peer to the WireGuard server
 */
export async function registerClientPeer(
  userId: string,
  clientPublicKey: string
): Promise<{
  success: boolean;
  clientIP?: string;
  error?: string;
}> {
  try {
    // Validate public key format - WireGuard keys are exactly 44 characters (32 bytes base64 with padding)
    if (!clientPublicKey || clientPublicKey.length !== 44) {
      return { success: false, error: 'Invalid public key format' };
    }
    
    // Strict base64 validation for WireGuard public keys
    const base64Regex = /^[A-Za-z0-9+/]{43}=$/;
    if (!base64Regex.test(clientPublicKey)) {
      return { success: false, error: 'Invalid public key format' };
    }

    // Generate consistent client IP for this user
    const clientIP = generateClientIPFromUserId(userId);
    
    // Validate the generated IP
    if (!isValidClientIP(clientIP)) {
      console.error('Generated invalid client IP:', clientIP);
      return { success: false, error: 'Failed to generate valid IP address' };
    }
    
    // Store the client's public key in the database
    await prisma.activationKey.update({
      where: { userId },
      data: { 
        clientPublicKey,
        clientIP,
        lastConnected: new Date(),
      },
    });

    // Get and validate WireGuard interface name from env (default: wg0)
    const wgInterfaceRaw = process.env.WG_INTERFACE || 'wg0';
    const wgInterface = sanitizeInterfaceName(wgInterfaceRaw);
    
    if (!wgInterface) {
      console.error('Invalid WireGuard interface name:', wgInterfaceRaw);
      return { success: true, clientIP }; // Still return success since peer is saved in DB
    }
    
    // Automatically add the peer to WireGuard server
    try {
      // First, try to remove any existing peer with this public key (in case of reconnection)
      // Using execFile would be safer, but wg command needs shell for proper parsing
      await execAsync(`wg set ${wgInterface} peer ${clientPublicKey} remove`).catch(() => {
        // Ignore error if peer doesn't exist
      });
      
      // Add the peer to WireGuard
      await execAsync(`wg set ${wgInterface} peer ${clientPublicKey} allowed-ips ${clientIP}/32`);
      
      console.log(`✅ WireGuard peer added automatically:`);
      console.log(`   User: ${userId}`);
      console.log(`   PublicKey: ${clientPublicKey.substring(0, 8)}...`);
      console.log(`   AllowedIPs: ${clientIP}/32`);
      
    } catch (wgError) {
      // Log a generic error message without exposing system details
      console.error('⚠️ Could not automatically add WireGuard peer. The wg command may not be available or the server may not have sufficient permissions.');
      console.log('');
      console.log('Manual configuration required - add this to your WireGuard server:');
      console.log(`[Peer]`);
      console.log(`PublicKey = ${clientPublicKey}`);
      console.log(`AllowedIPs = ${clientIP}/32`);
    }

    return {
      success: true,
      clientIP,
    };
  } catch (error) {
    console.error('Error registering client peer');
    return { success: false, error: 'Failed to register peer' };
  }
}

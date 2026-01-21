import crypto from 'crypto';
import prisma from './prisma';

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

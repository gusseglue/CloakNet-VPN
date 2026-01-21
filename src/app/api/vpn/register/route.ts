import { NextResponse } from 'next/server';
import { validateKey, registerClientPeer } from '@/lib/provisioning';

/**
 * API endpoint for desktop VPN client to register their WireGuard public key
 * 
 * The desktop client sends:
 * - Activation key (for authentication)
 * - Client's WireGuard public key
 * 
 * The server:
 * - Validates the activation key
 * - Stores/updates the client's public key
 * - Adds the client as a peer on the WireGuard server
 * - Returns the assigned client IP
 */
export async function POST(req: Request) {
  try {
    const { key, clientPublicKey } = await req.json();

    if (!key) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Activation key is required' 
        },
        { status: 400 }
      );
    }

    if (!clientPublicKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Client public key is required' 
        },
        { status: 400 }
      );
    }

    // Validate the activation key first
    const validation = await validateKey(key);

    if (!validation.valid || !validation.userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.reason || 'Invalid activation key' 
        },
        { status: 401 }
      );
    }

    // Register the client peer on the WireGuard server
    const result = await registerClientPeer(validation.userId, clientPublicKey);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to register peer' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      clientIP: result.clientIP,
    });
  } catch (error) {
    console.error('Peer registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An error occurred during peer registration' 
      },
      { status: 500 }
    );
  }
}

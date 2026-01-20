import { NextResponse } from 'next/server';
import { validateKey, getVpnConfig } from '@/lib/provisioning';

/**
 * API endpoint for desktop VPN client to validate activation keys
 * 
 * The desktop client sends the activation key and receives:
 * - Validation status
 * - VPN connection configuration (if valid)
 * 
 * This endpoint is public but rate-limited in production.
 */
export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Activation key is required' 
        },
        { status: 400 }
      );
    }

    // Validate the activation key
    const result = await validateKey(key);

    if (!result.valid) {
      return NextResponse.json(
        { 
          valid: false, 
          error: result.reason || 'Invalid activation key' 
        },
        { status: 401 }
      );
    }

    // Key is valid - return VPN configuration
    const vpnConfig = getVpnConfig(result.userId!);

    return NextResponse.json({
      valid: true,
      config: vpnConfig,
    });
  } catch (error) {
    console.error('Key validation error:', error);
    return NextResponse.json(
      { 
        valid: false, 
        error: 'An error occurred during validation' 
      },
      { status: 500 }
    );
  }
}

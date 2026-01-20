# CloakNet VPN

A professional VPN service platform with subscription management, user authentication, Stripe payment integration, and VPN provisioning service.

## Architecture Overview

CloakNet is designed as a unified system that runs on a single server with the following logical components:

- **Web Frontend**: Next.js application serving the public website and user dashboard
- **Backend API**: Handles authentication, subscription management, and VPN provisioning
- **Database**: SQLite (development) / PostgreSQL (production) for user and subscription data
- **VPN Provisioning Service**: Internal service that manages activation keys and VPN peer configuration
- **VPN Server**: WireGuard-based VPN server (Germany location)

All components run on the same machine but are logically separated and communicate via internal API calls.

### Activation Key System

An Activation Key is a unique identifier that:
- Represents one active VPN access
- Is tied to one CloakNet account
- Remains valid as long as the subscription is active
- Can be revoked centrally at any time

**Lifecycle:**
1. Subscription becomes active via Stripe payment
2. Backend calls provisioning service to generate an Activation Key
3. Key is stored in the database and displayed in the user's dashboard
4. Desktop client uses the key to establish VPN connection
5. When subscription expires, the key is automatically revoked

## Features

### Phase 1 (Current) - Website & Account System

- **Public Pages**
  - Landing page with value proposition
  - Pricing page with weekly/monthly plans
  - FAQ page
  - Terms of Service
  - Privacy Policy

- **Account System**
  - User registration & login
  - Session management with NextAuth.js
  - Password hashing with bcrypt

- **Dashboard**
  - Subscription status display (Active/Canceled/Past Due/Expired)
  - Renewal/end date information
  - Activation Key field (placeholder for Phase 2)
  - Manage Subscription button (Stripe Customer Portal)
  - Download Client buttons (placeholder)

- **Stripe Integration**
  - Weekly & Monthly subscription options
  - Secure checkout sessions
  - Webhook handling for subscription events
  - Customer Portal for subscription management

### Future Phases

- **Phase 2**: VPN server infrastructure & key provisioning ✅ (Backend complete)
- **Phase 3**: Desktop client applications (Windows, macOS)

### VPN Provisioning Service

The internal provisioning service provides the following functions:

- `createKey(userId)`: Generate a new activation key for a user
- `validateKey(key)`: Validate if a key is active and has a valid subscription
- `revokeKey(key)`: Deactivate/revoke an activation key
- `revokeKeyByUserId(userId)`: Revoke key for a specific user
- `getVpnConfig(userId)`: Get VPN connection configuration

### Desktop Client API

Endpoint for desktop VPN client to validate activation keys:

```
POST /api/vpn/validate
Content-Type: application/json

{
  "key": "CLOAK-XXXX-XXXX-XXXX-XXXX"
}

Response (valid):
{
  "valid": true,
  "config": {
    "server": "vpn.cloaknet.de",
    "port": 51820,
    "protocol": "wireguard",
    "location": "Germany"
  }
}

Response (invalid):
{
  "valid": false,
  "error": "Key has been revoked"
}
```

## Tech Stack

- **Frontend**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Database**: Prisma ORM with SQLite (development)
- **Payments**: Stripe

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/cloaknet-vpn.git
   cd cloaknet-vpn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Create two subscription products:
   - Weekly subscription ($4.99/week)
   - Monthly subscription ($14.99/month)
4. Copy the price IDs to your `.env` file
5. Set up a webhook endpoint pointing to `/api/stripe/webhook`
6. Add the webhook secret to your `.env` file

### Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  subscription  Subscription?
  activationKey ActivationKey?
}

model Subscription {
  id                    String   @id @default(cuid())
  userId                String   @unique
  stripeCustomerId      String?
  stripeSubscriptionId  String?
  status                String   @default("inactive")
  currentPeriodEnd      DateTime?
  cancelAtPeriodEnd     Boolean  @default(false)
  // ...
}

model ActivationKey {
  id        String    @id @default(cuid())
  userId    String    @unique
  key       String?
  issuedAt  DateTime?
  revokedAt DateTime?
  // ...
}
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (public)/
│   │   ├── faq/
│   │   ├── pricing/
│   │   ├── privacy/
│   │   └── terms/
│   ├── api/
│   │   ├── auth/
│   │   ├── stripe/
│   │   └── vpn/
│   │       └── validate/    # Desktop client key validation endpoint
│   ├── dashboard/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── Providers.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── provisioning.ts     # VPN provisioning service
│   └── stripe.ts
└── types/
    └── next-auth.d.ts
```

## License

Proprietary - All rights reserved

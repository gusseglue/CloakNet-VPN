# CloakNet VPN

A professional VPN service platform with subscription management, user authentication, and Stripe payment integration.

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

- **Phase 2**: VPN server infrastructure & key provisioning
- **Phase 3**: Desktop client applications (Windows, macOS)

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
│   │   └── stripe/
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
│   └── stripe.ts
└── types/
    └── next-auth.d.ts
```

## License

Proprietary - All rights reserved

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      activationKey: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  // Determine subscription status display
  let statusDisplay: 'active' | 'canceled' | 'past_due' | 'expired' | 'inactive' = 'inactive';
  let hasActiveAccess = false;

  if (user.subscription) {
    const now = new Date();
    const periodEnd = user.subscription.currentPeriodEnd;

    switch (user.subscription.status) {
      case 'active':
        if (user.subscription.cancelAtPeriodEnd) {
          statusDisplay = 'canceled';
          hasActiveAccess = periodEnd ? now < periodEnd : false;
        } else {
          statusDisplay = 'active';
          hasActiveAccess = true;
        }
        break;
      case 'canceled':
        statusDisplay = 'canceled';
        hasActiveAccess = periodEnd ? now < periodEnd : false;
        break;
      case 'past_due':
        statusDisplay = 'past_due';
        hasActiveAccess = true; // Usually still has access during grace period
        break;
      case 'expired':
        statusDisplay = 'expired';
        hasActiveAccess = false;
        break;
      default:
        statusDisplay = 'inactive';
        hasActiveAccess = false;
    }
  }

  // Get activation key if active access
  const activationKey = hasActiveAccess ? user.activationKey?.key ?? null : null;

  return (
    <DashboardClient
      email={user.email}
      statusDisplay={statusDisplay}
      hasActiveAccess={hasActiveAccess}
      currentPeriodEnd={user.subscription?.currentPeriodEnd?.toISOString() || null}
      cancelAtPeriodEnd={user.subscription?.cancelAtPeriodEnd || false}
      activationKey={activationKey}
      hasStripeCustomer={!!user.subscription?.stripeCustomerId}
    />
  );
}

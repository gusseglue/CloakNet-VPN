import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { createKey, revokeKeyByUserId } from '@/lib/provisioning';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (userId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await prisma.subscription.update({
            where: { userId },
            data: {
              stripeSubscriptionId: subscriptionId,
              status: 'active',
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: false,
            },
          });

          // Generate activation key via provisioning service
          const activationKey = await createKey(userId);
          if (!activationKey) {
            console.error(`Failed to create activation key for user ${userId}`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const dbSubscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (dbSubscription) {
          let status = subscription.status;
          if (status === 'active' && subscription.cancel_at_period_end) {
            status = 'canceled';
          }

          await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              status,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const dbSubscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (dbSubscription) {
          await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: {
              status: 'expired',
              stripeSubscriptionId: null,
            },
          });

          // Revoke activation key via provisioning service
          await revokeKeyByUserId(dbSubscription.userId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const dbSubscription = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (dbSubscription) {
          await prisma.subscription.update({
            where: { id: dbSubscription.id },
            data: { status: 'past_due' },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set. Stripe functionality will not work.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-09-30.acacia',
  typescript: true,
});

export const STRIPE_PRICES = {
  weekly: process.env.STRIPE_WEEKLY_PRICE_ID || 'price_weekly_placeholder',
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
};

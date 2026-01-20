'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';

function PricingContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  const canceled = searchParams.get('canceled');

  const handleCheckout = async (priceType: 'weekly' | 'monthly') => {
    if (!session) {
      router.push('/register');
      return;
    }

    setLoading(priceType);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Fejl ved oprettelse af betaling');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Der opstod en fejl');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Enkle, gennemsigtige <span className="text-emerald-500">priser</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Vælg det abonnement, der passer til dig. Ingen skjulte gebyrer, ingen komplicerede niveauer.
          Bare sikker, pålidelig VPN-adgang.
        </p>
      </div>

      {canceled && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-amber-500/10 border border-amber-500/50 rounded-lg text-center">
          <p className="text-amber-400">
            Betalingen blev annulleret. Du er velkommen til at prøve igen, når du er klar.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Weekly Plan */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-2">Ugentlig</h2>
          <p className="text-slate-400 mb-6">Perfekt til kortvarige behov</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">10 kr</span>
            <span className="text-slate-400">/uge</span>
          </div>
          <ul className="space-y-3 mb-8">
            <PricingFeature>Fuld VPN-adgang</PricingFeature>
            <PricingFeature>AES-256 kryptering</PricingFeature>
            <PricingFeature>IP-maskering</PricingFeature>
            <PricingFeature>Ubegrænset båndbredde</PricingFeature>
            <PricingFeature>24/7 adgang</PricingFeature>
          </ul>
          <button
            onClick={() => handleCheckout('weekly')}
            disabled={loading !== null}
            className="w-full py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'weekly' ? 'Behandler...' : 'Abonner ugentligt'}
          </button>
        </div>

        {/* Monthly Plan */}
        <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/50 border border-emerald-500/50 rounded-2xl p-8 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">
            Bedste værdi
          </div>
          <h2 className="text-2xl font-bold mb-2">Månedlig</h2>
          <p className="text-slate-400 mb-6">Spar mere med månedlig betaling</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">40 kr</span>
            <span className="text-slate-400">/måned</span>
          </div>
          <ul className="space-y-3 mb-8">
            <PricingFeature>Fuld VPN-adgang</PricingFeature>
            <PricingFeature>AES-256 kryptering</PricingFeature>
            <PricingFeature>IP-maskering</PricingFeature>
            <PricingFeature>Ubegrænset båndbredde</PricingFeature>
            <PricingFeature>24/7 adgang</PricingFeature>
          </ul>
          <button
            onClick={() => handleCheckout('monthly')}
            disabled={loading !== null}
            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'monthly' ? 'Behandler...' : 'Abonner månedligt'}
          </button>
        </div>
      </div>

      {!session && (
        <p className="text-center mt-8 text-slate-400">
          Har du allerede en konto?{' '}
          <Link href="/login" className="text-emerald-500 hover:text-emerald-400">
            Log ind
          </Link>{' '}
          for at administrere dit abonnement.
        </p>
      )}

      <div className="mt-16 max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold text-center mb-8">
          Alle abonnementer inkluderer:
        </h3>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-slate-300">Sikker kryptering</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-slate-300">Automatisk fornyelse</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-300">Opsig når som helst</p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-slate-500">
          Ved at abonnere accepterer du vores{' '}
          <Link href="/terms" className="text-emerald-500 hover:text-emerald-400">
            Servicevilkår
          </Link>{' '}
          og{' '}
          <Link href="/privacy" className="text-emerald-500 hover:text-emerald-400">
            Privatlivspolitik
          </Link>
          . Alle betalinger behandles sikkert via Stripe.
        </p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-slate-400">Indlæser priser...</p>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}

function PricingFeature({
  children,
  highlight = false,
}: {
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <svg
        className={`w-5 h-5 ${highlight ? 'text-emerald-400' : 'text-emerald-500'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      <span className={highlight ? 'text-emerald-400 font-medium' : 'text-slate-300'}>
        {children}
      </span>
    </li>
  );
}

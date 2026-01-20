'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface DashboardClientProps {
  email: string;
  statusDisplay: 'active' | 'canceled' | 'past_due' | 'expired' | 'inactive';
  hasActiveAccess: boolean;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  activationKey: string | null;
  hasStripeCustomer: boolean;
}

function DashboardContent({
  email,
  statusDisplay,
  hasActiveAccess,
  currentPeriodEnd,
  cancelAtPeriodEnd,
  activationKey,
  hasStripeCustomer,
}: DashboardClientProps) {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [portalLoading, setPortalLoading] = useState(false);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Kunne ikke åbne abonnementsadministration');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Der opstod en fejl');
    } finally {
      setPortalLoading(false);
    }
  };

  const getStatusBadge = () => {
    const badges = {
      active: {
        text: 'Aktiv',
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50',
      },
      canceled: {
        text: 'Opsagt',
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/50',
      },
      past_due: {
        text: 'Forfalden',
        className: 'bg-red-500/10 text-red-400 border-red-500/50',
      },
      expired: {
        text: 'Udløbet',
        className: 'bg-slate-500/10 text-slate-400 border-slate-500/50',
      },
      inactive: {
        text: 'Inaktiv',
        className: 'bg-slate-500/10 text-slate-400 border-slate-500/50',
      },
    };

    const badge = badges[statusDisplay];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Kontrolpanel</h1>

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
          <p className="text-emerald-400 text-center">
            🎉 Betaling gennemført! Dit abonnement er nu aktivt.
          </p>
        </div>
      )}

      <div className="grid gap-6">
        {/* Account Info Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Kontooplysninger</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Email</span>
              <span className="text-white">{email}</span>
            </div>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Abonnementsstatus</h2>
            {getStatusBadge()}
          </div>

          <div className="space-y-4">
            {statusDisplay === 'active' && currentPeriodEnd && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Næste fornyelse</span>
                <span className="text-white">{formatDate(currentPeriodEnd)}</span>
              </div>
            )}

            {statusDisplay === 'canceled' && currentPeriodEnd && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Adgang indtil</span>
                <span className="text-amber-400">{formatDate(currentPeriodEnd)}</span>
              </div>
            )}

            {cancelAtPeriodEnd && hasActiveAccess && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-amber-400 text-sm">
                  Dit abonnement er blevet opsagt og vil ikke blive fornyet. Du har stadig
                  adgang indtil slutningen af din aktuelle faktureringsperiode.
                </p>
              </div>
            )}

            {statusDisplay === 'past_due' && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">
                  Din betaling er forfalden. Opdater venligst din betalingsmetode for at undgå
                  serviceafbrydelse.
                </p>
              </div>
            )}

            {(statusDisplay === 'inactive' || statusDisplay === 'expired') && (
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-slate-400 text-sm mb-3">
                  Du har ikke et aktivt abonnement.
                </p>
                <Link
                  href="/pricing"
                  className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  Se abonnementer
                </Link>
              </div>
            )}

            {hasStripeCustomer && (
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="w-full mt-4 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {portalLoading ? 'Indlæser...' : 'Administrer abonnement'}
              </button>
            )}
          </div>
        </div>

        {/* Activation Key Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Aktiveringsnøgle</h2>
          
          {hasActiveAccess ? (
            <div className="space-y-4">
              {activationKey ? (
                <div className="p-4 bg-slate-900 border border-slate-600 rounded-lg font-mono text-emerald-400 break-all">
                  {activationKey}
                </div>
              ) : (
                <div className="p-4 bg-slate-900 border border-slate-600 rounded-lg text-slate-400 text-center">
                  <p className="mb-2">Din aktiveringsnøgle vil snart være tilgængelig.</p>
                  <p className="text-sm text-slate-500">
                    Nøgler udstedes, når VPN-klienten udgives.
                  </p>
                </div>
              )}
              <p className="text-sm text-slate-500">
                Brug denne nøgle til at aktivere din CloakNet-klient. Hold den fortrolig.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center">
              <p className="text-slate-400 mb-1">Ikke tilgængelig</p>
              <p className="text-sm text-slate-500">
                Et aktivt abonnement er påkrævet for at modtage en aktiveringsnøgle.
              </p>
            </div>
          )}
        </div>

        {/* Download Client Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Download klient</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              disabled
              className="flex-1 py-3 px-6 bg-slate-700 text-slate-400 rounded-lg font-medium cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Windows (Kommer snart)
              </span>
            </button>
            <button
              disabled
              className="flex-1 py-3 px-6 bg-slate-700 text-slate-400 rounded-lg font-medium cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                macOS (Kommer snart)
              </span>
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Desktop-klienter er i øjeblikket under udvikling og vil snart være tilgængelige.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient(props: DashboardClientProps) {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-slate-400">Indlæser kontrolpanel...</p>
      </div>
    }>
      <DashboardContent {...props} />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Ugyldig email eller adgangskode');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Der opstod en fejl. Prøv venligst igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Velkommen tilbage</h1>
          <p className="text-slate-400 text-center mb-8">
            Log ind for at få adgang til dit CloakNet kontrolpanel
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email-adresse
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="dig@eksempel.dk"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Adgangskode
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logger ind...' : 'Log ind'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Har du ikke en konto?{' '}
              <Link
                href="/register"
                className="text-emerald-500 hover:text-emerald-400 font-medium"
              >
                Opret konto
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

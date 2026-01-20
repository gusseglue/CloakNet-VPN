'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white">
            <span className="text-emerald-500">Cloak</span>Net
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/pricing"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-slate-300 hover:text-white transition-colors"
            >
              FAQ
            </Link>

            {status === 'loading' ? (
              <div className="w-20 h-10 bg-slate-800 animate-pulse rounded-lg" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link
              href={session ? '/dashboard' : '/login'}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              {session ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

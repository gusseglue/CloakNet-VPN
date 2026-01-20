import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white">
              <span className="text-emerald-500">Cloak</span>Net
            </Link>
            <p className="mt-4 text-slate-400 max-w-md">
              Sikker, hurtig og pålidelig VPN-tjeneste. Beskyt dit privatliv og
              omgå netværksrestriktioner med stærk kryptering.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Produkt</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Priser
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Kontrolpanel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Juridisk</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Servicevilkår
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privatlivspolitik
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800">
          <p className="text-slate-400 text-sm text-center">
            © {new Date().getFullYear()} CloakNet. Alle rettigheder forbeholdes.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-slate-950 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Beskyt dit privatliv med
              <span className="block text-emerald-500">Sikker Kryptering</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
              CloakNet VPN giver hurtig, pålidelig og sikker internetadgang. 
              Omgå netværksrestriktioner og beskyt din online identitet med 
              avanceret tunneling-teknologi.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-lg transition-colors"
              >
                Kom i gang
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-lg transition-colors"
              >
                Se priser
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Hvorfor vælge <span className="text-emerald-500">CloakNet</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="AES-256 Kryptering"
              description="Stærk kryptering beskytter dine data mod hackere, internetudbydere og overvågning. Din trafik er helt ulæselig for alle andre."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            <FeatureCard
              title="IP-maskering"
              description="Skjul din rigtige IP-adresse og surf anonymt. Få adgang til geo-begrænset indhold og omgå netværksfirewalls nemt."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <FeatureCard
              title="Hurtig Tunneling"
              description="Avancerede tunneling-protokoller sikrer minimal hastighedstab. Stream, spil og surf uden afbrydelser eller buffering."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Perfekt til enhver <span className="text-emerald-500">situation</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <UseCaseCard
              title="Elever og studerende"
              description="Omgå skolens netværksrestriktioner og få adgang til de ressourcer, du har brug for til research og læring. Fjern blokering af indhold, der er blokeret af overivrige filtre."
            />
            <UseCaseCard
              title="Gamere"
              description="Reducer latency, undgå IP-bans og få adgang til spilservere over hele verden. Spil spil, der kan være begrænset på dit netværk uden afbrydelser."
            />
            <UseCaseCard
              title="Privatlivsbevidste"
              description="Hold dine browservaner private fra internetudbydere, arbejdsgivere og dataindsamlere. Din online aktivitet er din egen sag."
            />
            <UseCaseCard
              title="Rejsende"
              description="Få adgang til dit yndlingsindhold fra hvor som helst i verden. Hold forbindelsen til hjemlige tjenester, mens du er i udlandet."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-900/30 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Klar til at tage kontrol over dit privatliv?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Slut dig til tusindvis af brugere, der stoler på CloakNet for deres online sikkerhed.
            Start med vores fleksible ugentlige eller månedlige abonnementer.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Se prisplaner
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-emerald-500/50 transition-colors">
      <div className="w-14 h-14 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function UseCaseCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8">
      <h3 className="text-xl font-semibold text-emerald-400 mb-3">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

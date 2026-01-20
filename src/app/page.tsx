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
              Secure Your Privacy with
              <span className="block text-emerald-500">Military-Grade Encryption</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
              CloakNet VPN provides fast, reliable, and secure internet access. 
              Bypass network restrictions and protect your online identity with 
              state-of-the-art tunneling technology.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-lg transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-lg transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Choose <span className="text-emerald-500">CloakNet</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="AES-256 Encryption"
              description="Military-grade encryption protects your data from hackers, ISPs, and surveillance. Your traffic is completely unreadable to anyone."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            <FeatureCard
              title="IP Masking"
              description="Hide your real IP address and browse anonymously. Access geo-restricted content and bypass network firewalls with ease."
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <FeatureCard
              title="High-Speed Tunneling"
              description="Advanced tunneling protocols ensure minimal speed loss. Stream, game, and browse without interruption or buffering."
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
            Perfect For Every <span className="text-emerald-500">Situation</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <UseCaseCard
              title="Students & Schools"
              description="Bypass school network restrictions and access the resources you need for research and learning. Unblock educational content blocked by overzealous filters."
            />
            <UseCaseCard
              title="Gamers"
              description="Reduce latency, avoid IP bans, and access game servers worldwide. Play games that may be restricted on your network without interruption."
            />
            <UseCaseCard
              title="Privacy Enthusiasts"
              description="Keep your browsing habits private from ISPs, employers, and data collectors. Your online activity is your business."
            />
            <UseCaseCard
              title="Travelers"
              description="Access your favorite content from anywhere in the world. Stay connected to home services while abroad."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-900/30 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Take Control of Your Privacy?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join thousands of users who trust CloakNet for their online security.
            Start with our flexible weekly or monthly plans.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            View Pricing Plans
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

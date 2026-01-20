export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Privacy <span className="text-emerald-500">Policy</span>
      </h1>
      <p className="text-center text-slate-400 mb-12">
        Last updated: January 2026
      </p>

      <div className="prose prose-invert prose-slate max-w-none space-y-8">
        <Section title="1. Introduction">
          <p>
            CloakNet (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy and is committed to
            protecting your personal data. This Privacy Policy explains how we collect,
            use, and protect your information when you use our VPN services.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>
            <strong className="text-white">2.1 Account Information:</strong> When you create an account, we
            collect your email address and encrypted password. This information is
            necessary to provide and manage your subscription.
          </p>
          <p className="mt-4">
            <strong className="text-white">2.2 Payment Information:</strong> Payment processing is handled by
            Stripe, our payment processor. We do not store your full credit card number.
            We receive limited information from Stripe necessary to manage your
            subscription, such as payment status and billing dates.
          </p>
          <p className="mt-4">
            <strong className="text-white">2.3 Service Data:</strong> To provide and improve our Service, we may
            collect:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-slate-400">
            <li>Connection timestamps (when you connect/disconnect)</li>
            <li>Bandwidth usage statistics (aggregate, non-personally identifiable)</li>
            <li>Technical information about your connection</li>
          </ul>
        </Section>

        <Section title="3. Information We Do NOT Collect">
          <p className="text-emerald-400 font-semibold">
            CloakNet is committed to your privacy. We do NOT:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Log your browsing activity or visited websites</li>
            <li>Monitor or record the content of your internet traffic</li>
            <li>Store your original IP address after disconnection</li>
            <li>Sell your personal information to third parties</li>
            <li>Share your data with advertisers</li>
          </ul>
        </Section>

        <Section title="4. How We Use Your Information">
          <p>We use your information to:</p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Provide and maintain the Service</li>
            <li>Process your subscription and payments</li>
            <li>Send important account-related communications</li>
            <li>Respond to your support requests</li>
            <li>Detect and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </Section>

        <Section title="5. Data Security">
          <p>
            We implement appropriate security measures to protect your personal
            information, including:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Encryption of data in transit and at rest</li>
            <li>Secure password hashing</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the Internet is 100% secure. While
            we strive to protect your information, we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your account information for as long as your account is active or
            as needed to provide services. If you close your account, we may retain
            certain information as required by law or for legitimate business purposes.
          </p>
        </Section>

        <Section title="7. Third-Party Services">
          <p>
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>
              <strong className="text-white">Stripe:</strong> For payment processing.
              Their privacy policy can be found at stripe.com/privacy.
            </li>
          </ul>
          <p className="mt-4">
            These services have their own privacy policies governing their use of your
            information.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p>
            Depending on your jurisdiction, you may have certain rights regarding your
            personal data, including:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Access to your personal data</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your data</li>
            <li>Objection to processing</li>
            <li>Data portability</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us using the information below.
          </p>
        </Section>

        <Section title="9. Legal Disclosure">
          <p>
            We may disclose your information if required by law, court order, or
            government request. We will notify you of such requests if legally
            permitted.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>
            Our Service is not intended for children under 13 years of age. We do not
            knowingly collect personal information from children under 13. If we learn
            we have collected such information, we will take steps to delete it.
          </p>
        </Section>

        <Section title="11. International Users">
          <p>
            Our services may be accessed from various countries. By using our Service,
            you consent to the transfer of your information to countries that may have
            different data protection laws than your country of residence.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of
            significant changes by posting a notice on our website or sending you an
            email. Your continued use of the Service after changes constitutes
            acceptance of the updated policy.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>
            If you have questions about this Privacy Policy or our privacy practices,
            please contact us at{' '}
            <span className="text-emerald-500">privacy@cloaknet.example.com</span>.
          </p>
        </Section>

        <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
          <p className="text-slate-400">
            By using CloakNet, you acknowledge that you have read and understood this
            Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="text-slate-400 leading-relaxed">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Terms of <span className="text-emerald-500">Service</span>
      </h1>
      <p className="text-center text-slate-400 mb-12">
        Last updated: January 2026
      </p>

      <div className="prose prose-invert prose-slate max-w-none space-y-8">
        <Section title="1. Agreement to Terms">
          <p>
            By accessing or using CloakNet VPN services (&quot;Service&quot;), you agree to be bound
            by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do
            not use the Service. CloakNet reserves the right to modify these Terms at any
            time without prior notice.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            CloakNet provides virtual private network (VPN) services that encrypt your
            internet connection and mask your IP address. The Service includes access to
            VPN servers, client applications, and related features as determined by your
            subscription level.
          </p>
        </Section>

        <Section title="3. Payments and Billing">
          <p>
            <strong className="text-white">3.1 Subscription Plans:</strong> CloakNet offers weekly and monthly
            subscription plans. By subscribing, you authorize CloakNet to charge your
            payment method on a recurring basis according to your chosen billing cycle.
          </p>
          <p className="mt-4">
            <strong className="text-white">3.2 Non-Refundable Payments:</strong>{' '}
            <span className="text-amber-400">
              ALL PAYMENTS ARE FINAL AND NON-REFUNDABLE.
            </span>{' '}
            Once a payment is processed, no refunds will be issued for any reason,
            including but not limited to dissatisfaction with the Service, technical
            issues, or early cancellation.
          </p>
          <p className="mt-4">
            <strong className="text-white">3.3 Automatic Renewal:</strong> Subscriptions automatically renew at
            the end of each billing period unless canceled. You are responsible for
            canceling your subscription before the renewal date to avoid being charged.
          </p>
          <p className="mt-4">
            <strong className="text-white">3.4 Cancellation:</strong> You may cancel your subscription at any
            time through your account dashboard. Upon cancellation, your access to the
            Service will continue until the end of the current billing period. No
            partial refunds will be provided.
          </p>
        </Section>

        <Section title="4. Acceptable Use">
          <p>
            You agree not to use the Service for any illegal activities, including but
            not limited to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Unauthorized access to computer systems or networks</li>
            <li>Distribution of malware or malicious content</li>
            <li>Copyright infringement or piracy</li>
            <li>Harassment, threats, or defamation</li>
            <li>Fraud or identity theft</li>
            <li>Activities that violate applicable laws or regulations</li>
          </ul>
        </Section>

        <Section title="5. No Guarantees">
          <p className="text-amber-400 font-semibold">
            CLOAKNET MAKES NO GUARANTEES REGARDING:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Access to specific websites, services, games, or content</li>
            <li>Connection speeds or bandwidth</li>
            <li>Service uptime or availability</li>
            <li>Ability to bypass specific network restrictions</li>
            <li>Compatibility with all networks, devices, or applications</li>
          </ul>
          <p className="mt-4">
            The effectiveness of VPN services may vary depending on your location,
            network conditions, and other factors beyond our control.
          </p>
        </Section>

        <Section title="6. Service Suspension and Termination">
          <p className="text-amber-400">
            CloakNet reserves the right to suspend, restrict, or terminate your access
            to the Service at any time, without prior notice, for any reason or no
            reason at all.
          </p>
          <p className="mt-4">
            Reasons for suspension or termination may include, but are not limited to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Violation of these Terms</li>
            <li>Suspected fraudulent activity</li>
            <li>Payment disputes or chargebacks</li>
            <li>Actions that may harm CloakNet or other users</li>
            <li>Legal requirements or law enforcement requests</li>
          </ul>
          <p className="mt-4 text-slate-400">
            No refunds will be provided in the event of suspension or termination.
          </p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p className="text-amber-400 font-semibold">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF
            ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            <span className="text-amber-400 font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLOAKNET SHALL NOT BE LIABLE FOR:
            </span>
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Any direct, indirect, incidental, special, or consequential damages</li>
            <li>Loss of data, profits, or business opportunities</li>
            <li>Service interruptions or failures</li>
            <li>Actions of third parties</li>
            <li>Your use or inability to use the Service</li>
            <li>Any consequences arising from your use of the Service</li>
          </ul>
        </Section>

        <Section title="9. User Responsibility">
          <p>
            You acknowledge that:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Use of the Service is entirely at your own risk</li>
            <li>You are responsible for complying with all applicable laws and regulations</li>
            <li>You are responsible for securing your account credentials and Activation Key</li>
            <li>CloakNet is not responsible for any consequences of your use of the Service</li>
          </ul>
        </Section>

        <Section title="10. Privacy">
          <p>
            Your use of the Service is also governed by our{' '}
            <a href="/privacy" className="text-emerald-500 hover:text-emerald-400">
              Privacy Policy
            </a>
            , which is incorporated into these Terms by reference.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with applicable
            laws, without regard to conflict of law principles. Any disputes arising
            from these Terms shall be resolved through binding arbitration.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            For questions about these Terms, please contact us at{' '}
            <span className="text-emerald-500">legal@cloaknet.example.com</span>.
          </p>
        </Section>

        <div className="mt-12 p-6 bg-amber-500/10 border border-amber-500/50 rounded-xl">
          <p className="text-amber-400 font-semibold text-center">
            BY USING CLOAKNET, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND
            AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
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

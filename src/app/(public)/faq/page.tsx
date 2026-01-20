export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Frequently Asked <span className="text-emerald-500">Questions</span>
        </h1>
        <p className="text-lg text-slate-400">
          Everything you need to know about CloakNet VPN
        </p>
      </div>

      <div className="space-y-6">
        <FAQItem
          question="What is a VPN and how does it work?"
          answer="A VPN (Virtual Private Network) creates a secure, encrypted tunnel between your device and the internet. When you connect to CloakNet, your internet traffic is routed through our servers, masking your real IP address and encrypting all data. This means your ISP, network administrators, and potential hackers cannot see what you're doing online."
        />

        <FAQItem
          question="Is CloakNet safe to use?"
          answer="CloakNet uses AES-256 encryption, the same standard used by governments and military organizations worldwide. This encryption is virtually unbreakable with current technology. Your data is protected from the moment it leaves your device until it reaches its destination."
        />

        <FAQItem
          question="Can I use CloakNet at school or work?"
          answer="CloakNet can help you access content that may be restricted on certain networks. Our tunneling technology is designed to work in most network environments. However, please ensure your use complies with your institution's acceptable use policies."
        />

        <FAQItem
          question="Will CloakNet slow down my internet?"
          answer="Our advanced tunneling protocols are optimized for speed. While there's always some overhead with encryption, most users experience minimal speed reduction. CloakNet is designed to maintain high performance for streaming, gaming, and browsing."
        />

        <FAQItem
          question="What's the difference between weekly and monthly plans?"
          answer="Both plans offer the same full access to CloakNet VPN. The weekly plan is great for short-term needs, while the monthly plan saves you about 25% compared to paying weekly. You can cancel either subscription at any time, and your access continues until the end of the current billing period."
        />

        <FAQItem
          question="How does IP masking protect my privacy?"
          answer="When you connect to CloakNet, websites and services see our server's IP address instead of yours. This prevents websites from tracking your location, stops advertisers from building profiles on you, and helps protect your identity online."
        />

        <FAQItem
          question="Can I cancel my subscription?"
          answer="Yes, you can cancel your subscription at any time from your dashboard. When you cancel, your access remains active until the end of your current billing period. After that, your subscription will not renew, and access will end. No refunds are provided for partial periods."
        />

        <FAQItem
          question="What devices can I use CloakNet on?"
          answer="CloakNet is currently developing a desktop client that will support Windows and macOS. Mobile apps are planned for future releases. Your subscription includes access across all supported platforms."
        />

        <FAQItem
          question="Is there a free trial?"
          answer="We currently do not offer a free trial. However, our weekly plan lets you try CloakNet at a low commitment level. We believe our service quality speaks for itself."
        />

        <FAQItem
          question="How do I get my Activation Key?"
          answer="After subscribing, you can find your Activation Key in your account dashboard. This key is used to authenticate your CloakNet client application. Keep it secure and do not share it with others."
        />
      </div>

      <div className="mt-16 p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-slate-400 mb-6">
          Our support team is here to help you get started with CloakNet.
        </p>
        <p className="text-emerald-500">
          Contact us at support@cloaknet.example.com
        </p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-emerald-400 mb-3">{question}</h3>
      <p className="text-slate-400 leading-relaxed">{answer}</p>
    </div>
  );
}

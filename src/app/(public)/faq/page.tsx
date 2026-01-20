export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Ofte stillede <span className="text-emerald-500">spørgsmål</span>
        </h1>
        <p className="text-lg text-slate-400">
          Alt hvad du behøver at vide om CloakNet VPN
        </p>
      </div>

      <div className="space-y-6">
        <FAQItem
          question="Hvad er en VPN, og hvordan virker det?"
          answer="En VPN (Virtual Private Network) skaber en sikker, krypteret tunnel mellem din enhed og internettet. Når du forbinder til CloakNet, bliver din internettrafik dirigeret gennem vores servere, hvilket skjuler din rigtige IP-adresse og krypterer alle data. Det betyder, at din internetudbyder, netværksadministratorer og potentielle hackere ikke kan se, hvad du laver online."
        />

        <FAQItem
          question="Er CloakNet sikkert at bruge?"
          answer="CloakNet bruger AES-256 kryptering, den samme standard som bruges af regeringer og organisationer verden over. Denne kryptering er praktisk talt umulig at bryde med nuværende teknologi. Dine data er beskyttet fra det øjeblik, de forlader din enhed, til de når deres destination."
        />

        <FAQItem
          question="Kan jeg bruge CloakNet i skolen eller på arbejde?"
          answer="CloakNet kan hjælpe dig med at få adgang til indhold, der kan være begrænset på visse netværk. Vores tunneling-teknologi er designet til at fungere i de fleste netværksmiljøer. Vær dog opmærksom på at din brug overholder din institutions accepterede brugsregler."
        />

        <FAQItem
          question="Vil CloakNet gøre mit internet langsommere?"
          answer="Vores avancerede tunneling-protokoller er optimeret til hastighed. Selvom der altid er noget overhead med kryptering, oplever de fleste brugere minimal hastighedsreduktion. CloakNet er designet til at opretholde høj ydeevne til streaming, gaming og browsing."
        />

        <FAQItem
          question="Hvad er forskellen mellem ugentlige og månedlige abonnementer?"
          answer="Begge abonnementer giver samme fulde adgang til CloakNet VPN. Det ugentlige abonnement er godt til kortvarige behov, mens det månedlige abonnement sparer dig penge. Du kan opsige begge abonnementer når som helst, og din adgang fortsætter indtil slutningen af den aktuelle faktureringsperiode."
        />

        <FAQItem
          question="Hvordan beskytter IP-maskering mit privatliv?"
          answer="Når du forbinder til CloakNet, ser hjemmesider og tjenester vores servers IP-adresse i stedet for din. Dette forhindrer hjemmesider i at spore din placering, stopper annoncører fra at opbygge profiler om dig, og hjælper med at beskytte din identitet online."
        />

        <FAQItem
          question="Kan jeg opsige mit abonnement?"
          answer="Ja, du kan opsige dit abonnement når som helst fra dit kontrolpanel. Når du opsiger, forbliver din adgang aktiv indtil slutningen af din aktuelle faktureringsperiode. Derefter fornyes dit abonnement ikke, og adgangen ophører. Der gives ingen refusion for delvise perioder."
        />

        <FAQItem
          question="Hvilke enheder kan jeg bruge CloakNet på?"
          answer="CloakNet udvikler i øjeblikket en desktop-klient, der vil understøtte Windows og macOS. Mobilapps er planlagt til fremtidige udgivelser. Dit abonnement inkluderer adgang på alle understøttede platforme."
        />

        <FAQItem
          question="Er der en gratis prøveperiode?"
          answer="Vi tilbyder i øjeblikket ikke en gratis prøveperiode. Dog lader vores ugentlige abonnement dig prøve CloakNet til en lav pris. Vi mener, at vores servicekvalitet taler for sig selv."
        />

        <FAQItem
          question="Hvordan får jeg min aktiveringsnøgle?"
          answer="Efter tilmelding kan du finde din aktiveringsnøgle i dit kontrolpanel. Denne nøgle bruges til at autentificere din CloakNet-klientapplikation. Hold den sikker og del den ikke med andre."
        />
      </div>

      <div className="mt-16 p-8 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-4">Har du stadig spørgsmål?</h2>
        <p className="text-slate-400 mb-6">
          Vores supportteam er her for at hjælpe dig i gang med CloakNet.
        </p>
        <p className="text-emerald-500">
          Kontakt os på support@cloaknet.example.com
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

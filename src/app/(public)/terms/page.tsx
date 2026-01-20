export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Service<span className="text-emerald-500">vilkår</span>
      </h1>
      <p className="text-center text-slate-400 mb-12">
        Sidst opdateret: Januar 2026
      </p>

      <div className="prose prose-invert prose-slate max-w-none space-y-8">
        <Section title="1. Accept af vilkår">
          <p>
            Ved at tilgå eller bruge CloakNet VPN-tjenester (&quot;Tjenesten&quot;) accepterer du at være
            bundet af disse Servicevilkår (&quot;Vilkår&quot;). Hvis du ikke accepterer disse Vilkår, må
            du ikke bruge Tjenesten. CloakNet forbeholder sig ret til at ændre disse Vilkår til
            enhver tid uden forudgående varsel.
          </p>
        </Section>

        <Section title="2. Beskrivelse af tjenesten">
          <p>
            CloakNet leverer virtual private network (VPN) tjenester, der krypterer din
            internetforbindelse og maskerer din IP-adresse. Tjenesten inkluderer adgang til
            VPN-servere, klientapplikationer og relaterede funktioner som bestemt af dit
            abonnementsniveau.
          </p>
        </Section>

        <Section title="3. Betaling og fakturering">
          <p>
            <strong className="text-white">3.1 Abonnementer:</strong> CloakNet tilbyder ugentlige og månedlige
            abonnementer. Ved at abonnere autoriserer du CloakNet til at opkræve din
            betalingsmetode på tilbagevendende basis i henhold til din valgte faktureringscyklus.
          </p>
          <p className="mt-4">
            <strong className="text-white">3.2 Ikke-refunderbare betalinger:</strong>{' '}
            <span className="text-amber-400">
              ALLE BETALINGER ER ENDELIGE OG KAN IKKE REFUNDERES.
            </span>{' '}
            Når en betaling er behandlet, udstedes der ingen refusion af nogen årsag,
            herunder men ikke begrænset til utilfredshed med Tjenesten, tekniske
            problemer eller tidlig opsigelse.
          </p>
          <p className="mt-4">
            <strong className="text-white">3.3 Automatisk fornyelse:</strong> Abonnementer fornyes automatisk ved
            slutningen af hver faktureringsperiode, medmindre de opsiges. Du er ansvarlig for
            at opsige dit abonnement før fornyelsesdatoen for at undgå at blive opkrævet.
          </p>
          <p className="mt-4">
            <strong className="text-white">3.4 Opsigelse:</strong> Du kan opsige dit abonnement når som helst
            gennem dit kontrolpanel. Ved opsigelse fortsætter din adgang til
            Tjenesten indtil slutningen af den aktuelle faktureringsperiode. Der gives ingen
            delvis refusion.
          </p>
        </Section>

        <Section title="4. Acceptabel brug">
          <p>
            Du accepterer ikke at bruge Tjenesten til ulovlige aktiviteter, herunder men
            ikke begrænset til:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Uautoriseret adgang til computersystemer eller netværk</li>
            <li>Distribution af malware eller ondsindet indhold</li>
            <li>Krænkelse af ophavsret eller piratkopiering</li>
            <li>Chikane, trusler eller ærekrænkelse</li>
            <li>Svindel eller identitetstyveri</li>
            <li>Aktiviteter, der overtræder gældende love eller regler</li>
          </ul>
        </Section>

        <Section title="5. Ingen garantier">
          <p className="text-amber-400 font-semibold">
            CLOAKNET GIVER INGEN GARANTIER VEDRØRENDE:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Adgang til specifikke hjemmesider, tjenester, spil eller indhold</li>
            <li>Forbindelseshastigheder eller båndbredde</li>
            <li>Tjenestens oppetid eller tilgængelighed</li>
            <li>Evne til at omgå specifikke netværksrestriktioner</li>
            <li>Kompatibilitet med alle netværk, enheder eller applikationer</li>
          </ul>
          <p className="mt-4">
            Effektiviteten af VPN-tjenester kan variere afhængigt af din placering,
            netværksforhold og andre faktorer uden for vores kontrol.
          </p>
        </Section>

        <Section title="6. Suspension og opsigelse af tjeneste">
          <p className="text-amber-400">
            CloakNet forbeholder sig ret til at suspendere, begrænse eller opsige din adgang
            til Tjenesten til enhver tid, uden forudgående varsel, af enhver grund eller
            uden grund overhovedet.
          </p>
          <p className="mt-4">
            Årsager til suspension eller opsigelse kan omfatte, men er ikke begrænset til:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Overtrædelse af disse Vilkår</li>
            <li>Mistænkt svigagtig aktivitet</li>
            <li>Betalingstvister eller tilbageførsler</li>
            <li>Handlinger, der kan skade CloakNet eller andre brugere</li>
            <li>Juridiske krav eller anmodninger fra retshåndhævelse</li>
          </ul>
          <p className="mt-4 text-slate-400">
            Der gives ingen refusion i tilfælde af suspension eller opsigelse.
          </p>
        </Section>

        <Section title="7. Ansvarsfraskrivelse">
          <p className="text-amber-400 font-semibold">
            TJENESTEN LEVERES &quot;SOM DEN ER&quot; OG &quot;SOM TILGÆNGELIG&quot; UDEN GARANTIER AF
            NOGEN ART, UDTRYKKELIGE ELLER UNDERFORSTÅEDE, HERUNDER MEN IKKE BEGRÆNSET TIL GARANTIER FOR
            SALGBARHED, EGNETHED TIL ET BESTEMT FORMÅL OG IKKE-KRÆNKELSE.
          </p>
        </Section>

        <Section title="8. Ansvarsbegrænsning">
          <p>
            <span className="text-amber-400 font-semibold">
              I DET MAKSIMALE OMFANG TILLADT AF LOVEN SKAL CLOAKNET IKKE VÆRE ANSVARLIG FOR:
            </span>
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Direkte, indirekte, tilfældige, særlige eller følgeskader</li>
            <li>Tab af data, fortjeneste eller forretningsmuligheder</li>
            <li>Serviceafbrydelser eller fejl</li>
            <li>Tredjeparters handlinger</li>
            <li>Din brug eller manglende evne til at bruge Tjenesten</li>
            <li>Eventuelle konsekvenser af din brug af Tjenesten</li>
          </ul>
        </Section>

        <Section title="9. Brugeransvar">
          <p>
            Du anerkender at:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Brug af Tjenesten er helt på egen risiko</li>
            <li>Du er ansvarlig for at overholde alle gældende love og regler</li>
            <li>Du er ansvarlig for at sikre dine kontooplysninger og aktiveringsnøgle</li>
            <li>CloakNet er ikke ansvarlig for eventuelle konsekvenser af din brug af Tjenesten</li>
          </ul>
        </Section>

        <Section title="10. Privatliv">
          <p>
            Din brug af Tjenesten er også underlagt vores{' '}
            <a href="/privacy" className="text-emerald-500 hover:text-emerald-400">
              Privatlivspolitik
            </a>
            , som er inkorporeret i disse Vilkår ved reference.
          </p>
        </Section>

        <Section title="11. Gældende lov">
          <p>
            Disse Vilkår skal fortolkes i overensstemmelse med gældende
            love, uden hensyn til principper om lovkonflikter. Eventuelle tvister, der opstår
            fra disse Vilkår, skal løses gennem bindende voldgift.
          </p>
        </Section>

        <Section title="12. Kontakt">
          <p>
            For spørgsmål om disse Vilkår, kontakt os venligst på{' '}
            <span className="text-emerald-500">legal@cloaknet.example.com</span>.
          </p>
        </Section>

        <div className="mt-12 p-6 bg-amber-500/10 border border-amber-500/50 rounded-xl">
          <p className="text-amber-400 font-semibold text-center">
            VED AT BRUGE CLOAKNET ANERKENDER DU, AT DU HAR LÆST, FORSTÅET OG
            ACCEPTERER AT VÆRE BUNDET AF DISSE SERVICEVILKÅR.
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

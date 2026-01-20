export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Privatlivs<span className="text-emerald-500">politik</span>
      </h1>
      <p className="text-center text-slate-400 mb-12">
        Sidst opdateret: Januar 2026
      </p>

      <div className="prose prose-invert prose-slate max-w-none space-y-8">
        <Section title="1. Introduktion">
          <p>
            CloakNet (&quot;vi&quot;, &quot;os&quot; eller &quot;vores&quot;) respekterer dit privatliv og er forpligtet til
            at beskytte dine personlige data. Denne Privatlivspolitik forklarer, hvordan vi indsamler,
            bruger og beskytter dine oplysninger, når du bruger vores VPN-tjenester.
          </p>
        </Section>

        <Section title="2. Oplysninger vi indsamler">
          <p>
            <strong className="text-white">2.1 Kontooplysninger:</strong> Når du opretter en konto, indsamler vi
            din e-mailadresse og krypterede adgangskode. Disse oplysninger er
            nødvendige for at levere og administrere dit abonnement.
          </p>
          <p className="mt-4">
            <strong className="text-white">2.2 Betalingsoplysninger:</strong> Betalingsbehandling håndteres af
            Stripe, vores betalingsudbyder. Vi gemmer ikke dit fulde kreditkortnummer.
            Vi modtager begrænset information fra Stripe, der er nødvendig for at administrere dit
            abonnement, såsom betalingsstatus og faktureringsdatoer.
          </p>
          <p className="mt-4">
            <strong className="text-white">2.3 Servicedata:</strong> For at levere og forbedre vores Tjeneste kan vi
            indsamle:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-slate-400">
            <li>Forbindelsestidsstempler (hvornår du forbinder/afbryder)</li>
            <li>Båndbreddeforbrugsstatistik (aggregeret, ikke-personligt identificerbar)</li>
            <li>Teknisk information om din forbindelse</li>
          </ul>
        </Section>

        <Section title="3. Oplysninger vi IKKE indsamler">
          <p className="text-emerald-400 font-semibold">
            CloakNet er forpligtet til dit privatliv. Vi:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Logger IKKE din browseraktivitet eller besøgte hjemmesider</li>
            <li>Overvåger eller registrerer IKKE indholdet af din internettrafik</li>
            <li>Gemmer IKKE din originale IP-adresse efter afbrydelse</li>
            <li>Sælger IKKE dine personlige oplysninger til tredjeparter</li>
            <li>Deler IKKE dine data med annoncører</li>
          </ul>
        </Section>

        <Section title="4. Hvordan vi bruger dine oplysninger">
          <p>Vi bruger dine oplysninger til at:</p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Levere og vedligeholde Tjenesten</li>
            <li>Behandle dit abonnement og betalinger</li>
            <li>Sende vigtig kontorelateret kommunikation</li>
            <li>Besvare dine supportanmodninger</li>
            <li>Opdage og forhindre svindel eller misbrug</li>
            <li>Overholde juridiske forpligtelser</li>
          </ul>
        </Section>

        <Section title="5. Datasikkerhed">
          <p>
            Vi implementerer passende sikkerhedsforanstaltninger for at beskytte dine personlige
            oplysninger, herunder:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Kryptering af data under transit og i hvile</li>
            <li>Sikker adgangskode-hashing</li>
            <li>Regelmæssige sikkerhedsvurderinger</li>
            <li>Adgangskontrol og autentificering</li>
          </ul>
          <p className="mt-4">
            Ingen metode til transmission over internettet er dog 100% sikker. Selvom
            vi bestræber os på at beskytte dine oplysninger, kan vi ikke garantere absolut sikkerhed.
          </p>
        </Section>

        <Section title="6. Dataopbevaring">
          <p>
            Vi opbevarer dine kontooplysninger, så længe din konto er aktiv, eller
            efter behov for at levere tjenester. Hvis du lukker din konto, kan vi beholde
            visse oplysninger som krævet ved lov eller til legitime forretningsformål.
          </p>
        </Section>

        <Section title="7. Tredjepartstjenester">
          <p>
            Vi bruger følgende tredjepartstjenester:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>
              <strong className="text-white">Stripe:</strong> Til betalingsbehandling.
              Deres privatlivspolitik kan findes på stripe.com/privacy.
            </li>
          </ul>
          <p className="mt-4">
            Disse tjenester har deres egne privatlivspolitikker, der regulerer deres brug af dine
            oplysninger.
          </p>
        </Section>

        <Section title="8. Dine rettigheder">
          <p>
            Afhængigt af din jurisdiktion kan du have visse rettigheder vedrørende dine
            personlige data, herunder:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-slate-400">
            <li>Adgang til dine personlige data</li>
            <li>Rettelse af unøjagtige data</li>
            <li>Sletning af dine data</li>
            <li>Indsigelse mod behandling</li>
            <li>Dataportabilitet</li>
          </ul>
          <p className="mt-4">
            For at udøve disse rettigheder, kontakt os venligst ved hjælp af oplysningerne nedenfor.
          </p>
        </Section>

        <Section title="9. Juridisk videregivelse">
          <p>
            Vi kan videregive dine oplysninger, hvis det kræves ved lov, retskendelse eller
            regeringsanmodning. Vi vil underrette dig om sådanne anmodninger, hvis det er juridisk
            tilladt.
          </p>
        </Section>

        <Section title="10. Børns privatliv">
          <p>
            Vores Tjeneste er ikke beregnet til børn under 13 år. Vi indsamler ikke
            bevidst personlige oplysninger fra børn under 13. Hvis vi erfarer,
            at vi har indsamlet sådanne oplysninger, vil vi tage skridt til at slette dem.
          </p>
        </Section>

        <Section title="11. Internationale brugere">
          <p>
            Vores tjenester kan tilgås fra forskellige lande. Ved at bruge vores Tjeneste
            samtykker du til overførsel af dine oplysninger til lande, der kan have
            andre databeskyttelseslove end dit bopælsland.
          </p>
        </Section>

        <Section title="12. Ændringer til denne politik">
          <p>
            Vi kan opdatere denne Privatlivspolitik fra tid til anden. Vi vil underrette dig om
            væsentlige ændringer ved at offentliggøre en meddelelse på vores hjemmeside eller sende dig en
            e-mail. Din fortsatte brug af Tjenesten efter ændringer udgør
            accept af den opdaterede politik.
          </p>
        </Section>

        <Section title="13. Kontakt os">
          <p>
            Hvis du har spørgsmål om denne Privatlivspolitik eller vores privatlivspraksis,
            kontakt os venligst på{' '}
            <span className="text-emerald-500">privacy@cloaknet.example.com</span>.
          </p>
        </Section>

        <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
          <p className="text-slate-400">
            Ved at bruge CloakNet anerkender du, at du har læst og forstået denne
            Privatlivspolitik.
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

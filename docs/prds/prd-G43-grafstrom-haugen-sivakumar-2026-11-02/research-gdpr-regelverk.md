# Research: GDPR, personopplysningsloven og ekomloven § 3-15 for dueNext

*Dato: 2026-11-02. Grunnlag for PRD-en til dueNext (IBE160, gruppe G43).*

> **Forbehold:** Dette er studentresearch og **ikke juridisk rådgivning**. Teksten skiller mellom
> **[Kilde]**: det kilden sier, **[Tolkning]**: vår vurdering, og **[Usikkert]**: punkter vi ikke
> har klart å bekrefte i primærkilder, eller der kildene spriker. Vilkårene til Anthropic endres ofte og
> må sjekkes på nytt før lansering.

## 0. Kort om produktet (forutsetninger)

- Det er ingen innlogging. Oppgaver og notater lagres bare i nettleseren (localStorage/IndexedDB).
- Next.js-serveren mottar oppgavetekst og notater og sender dem til Claude API (Anthropic). Svaret
  inneholder forslag til etikett, prioritet og sammendrag, og serveren sender det videre til nettleseren.
- Gruppen lagrer ingen brukerdata selv. Fullførte oppgaver arkiveres i 7 dager.
- Hvis API-nøkkelen mangler, brukes en regelbasert reserveløsning som kjører lokalt. Da sendes ingenting til tredjepart.

Personopplysningsloven (lov 15. juni 2018 nr. 38) gjør GDPR til norsk lov (§ 1). Derfor viser vi under
direkte til GDPR-artiklene.

---

## 1. Roller: Er gruppen behandlingsansvarlig? Hva er Anthropic?

**[Kilde]** GDPR gjelder ikke behandling som en fysisk person gjør som ledd i rent personlige
aktiviteter eller familieaktiviteter (art. 2 nr. 2 bokstav c). Fortalepunkt 18 sier likevel at forordningen
*gjelder for behandlingsansvarlige eller databehandlere som stiller til rådighet midlene* til slik
behandling.

**[Kilde]** Behandlingsansvarlig er den som alene eller sammen med andre bestemmer formålet med og
midlene for behandlingen (art. 4 nr. 7). EDPB Guidelines 07/2020 understreker at det er den faktiske
innflytelsen som teller, ikke hvem som har tilgang til dataene. Man kan altså være behandlingsansvarlig
uten selv å ha tilgang til dataene.

**[Tolkning]**
- **Lokal lagring i nettleseren:** Studenten bruker appen som en personlig huskeliste. Lagringen hos
  studenten faller derfor trolig under unntaket for husholdningsaktivitet. Gruppen behandler ikke disse
  dataene, fordi de aldri forlater maskinen.
- **KI-kallet:** Når teksten går via *gruppens* server til Anthropic, er det gruppen som har bestemt
  formålet (klassifisering og sammendrag) og midlene (Claude API, modell, prompt, server). Gruppen er da
  **behandlingsansvarlig** for overføringen, behandlingen på serveren og videresendingen til Anthropic.
  Det gjelder selv om ingenting lagres varig. Også å overføre og behandle data midlertidig er
  «behandling» etter art. 4 nr. 2.
- **Anthropic** opptrer som **databehandler** for gruppen (se under). Hostingleverandøren av
  Next.js-serveren (f.eks. Vercel) er også databehandler, og den ser IP-adresser og eventuelle logger.
- **[Usikkert]** Et studentprosjekt uten juridisk person kan gjøre det uklart *hvem* som er
  behandlingsansvarlig. I praksis er det gruppemedlemmene, eller den som eier API-kontoen. Hvis appen
  bare demonstreres i undervisningen, er risikoen liten. Blir den gjort offentlig tilgjengelig, gjelder
  pliktene fullt ut.

**[Kilde] Anthropic som databehandler:** Anthropics Data Processing Addendum (DPA, datert
24. feb. 2025) sier at «Anthropic is Customer's processor» og at kunden er behandlingsansvarlig. DPA-en
er en del av Commercial Terms, som gjelder for bruk av API-et. For kunder i EØS er avtaleparten
**Anthropic Ireland, Limited**. Commercial Terms sier også: «Anthropic may not train models on Customer
Content from Services». API-data brukes altså ikke til trening.

**[Kilde]** Ifølge Commercial Terms er tjenestene «not for consumer use». **[Tolkning]** Det betyr at
API-kunden (gruppen) ikke er en forbruker. Det hindrer ikke gruppen i å lage en app for sluttbrukere,
men gruppen bærer ansvaret overfor brukerne og må følge Anthropics bruksregler (Usage Policy).

## 2. Behandlingsgrunnlag (art. 6) og særlige kategorier (art. 9)

**[Kilde]** Art. 6 nr. 1 krever et grunnlag for behandlingen, f.eks. samtykke (a), avtale (b) eller
berettiget interesse (f). Art. 9 forbyr behandling av særlige kategorier som helse, religion, politisk
oppfatning, seksuell orientering og fagforeningsmedlemskap, med mindre et unntak i art. 9 nr. 2 gjelder.
Det mest aktuelle unntaket her er **uttrykkelig samtykke** (art. 9 nr. 2 bokstav a).

**[Kilde]** EU-domstolen tolker art. 9 vidt. Også opplysninger som *indirekte* kan avsløre en særlig
kategori, er omfattet (C-184/20 *OT*, 2022).

**[Tolkning]**
- Fritekst som «Legetime psykolog tirsdag», «Hente medisin» eller «Tilrettelagt eksamen pga. ADHD»
  inneholder helseopplysninger. Gruppen kan ikke styre hva brukeren skriver, så risikoen for art. 9-data
  er **reell og påregnelig**.
- **Anbefalt grunnlag:** KI-funksjonen er valgfri, siden appen virker med den regelbaserte
  reserveløsningen. Det gjør **samtykke** til det mest robuste grunnlaget: aktiv opt-in før første
  KI-kall, frivillig, informert og mulig å trekke tilbake (art. 7). Samtykket bør formuleres slik at det
  også dekker *uttrykkelig* samtykke etter art. 9 nr. 2 a. Det kan gjøres med en egen tekst som sier at
  notater kan inneholde f.eks. helseopplysninger, og at de da sendes til Anthropic.
- Avtale (b) er svakt uten konto og vilkår. Berettiget interesse (f) dekker ikke art. 9-data.
- **[Usikkert]** Om et samtykke via en avkrysning lokalt i nettleseren er tilstrekkelig
  *dokumentert* (art. 7 nr. 1) når gruppen ikke lagrer noe. Én løsning er å lagre samtykket med
  tidsstempel og tekstversjon lokalt, og å dokumentere designet i prosjektet.
- **Mindreårige:** Etter personopplysningsloven § 5 er aldersgrensen for samtykke til
  informasjonssamfunnstjenester **13 år** i Norge. Målgruppen er studenter, så dette er lite relevant,
  men det bør nevnes i personvernerklæringen.

## 3. Informasjonsplikt (art. 13), dataminimering (art. 5) og innebygd personvern (art. 25)

**[Kilde] Art. 13** krever at brukeren *når opplysningene samles inn* får vite:
- hvem som er behandlingsansvarlig og hvordan de kan kontaktes
- formål og behandlingsgrunnlag
- mottakere (her Anthropic og hostingleverandøren)
- overføring til tredjeland og hvilket overføringsgrunnlag som brukes
- lagringstid
- rettighetene brukeren har, retten til å trekke tilbake samtykke og retten til å klage til Datatilsynet

Art. 12 krever at informasjonen er kortfattet, lett tilgjengelig og skrevet i et klart og enkelt språk.

**[Kilde] Art. 5 nr. 1:** Behandlingen skal være lovlig og åpen. Opplysningene skal bare brukes til
angitte formål (formålsbegrensning). De skal være adekvate, relevante og begrenset til det som er
nødvendig (**dataminimering**, bokstav c). De skal ikke lagres lenger enn nødvendig (**lagringsbegrensning**,
bokstav e).

**[Kilde] Art. 25 og EDPB Guidelines 4/2019:** Den behandlingsansvarlige skal bygge inn personvern fra
starten (by design). Standardinnstillingene skal sørge for at bare nødvendige data behandles (by default).
Det gjelder mengde, omfang, lagringstid og tilgjengelighet. EDPB trekker frem pseudonymisering,
minimering og brukerkontroll som virkemidler. Ansvaret gjelder også små aktører, men tiltakene skal stå
i forhold til risikoen.

**[Kilde] EDPB-rapporten «AI Privacy Risks & Mitigations – Large Language Models»** (april 2025):
- Rapporten er skrevet av en ekstern ekspert (Isabel Barberá) i EDPBs Support Pool of Experts. Den er
  **ikke** EDPBs offisielle standpunkt.
- Den beskriver risiko når brukerinput sendes til en LLM fra en tredjepart via API. Eksempler er
  sensitive opplysninger i prompts, lagring og logging hos leverandøren, overføring til tredjeland og
  manglende åpenhet.
- Foreslåtte tiltak er blant annet filtrering eller maskering av personopplysninger før sending,
  minimering av konteksten, avtaler om lagringstid, tydelig informasjon til brukeren og
  brukerkontroll/opt-out.
- **[Usikkert]** Vi har ikke lest hele PDF-en. Punktene bygger på EDPBs prosjektside og omtaler av
  rapporten.

**[Tolkning] Konsekvenser for dueNext:**
- Send bare feltene som trengs for forslaget, f.eks. tittel og eventuelt notat. Brukeren bør kunne
  velge at notater ikke sendes. Send aldri andre oppgaver, historikk eller metadata.
- KI bør være **av som standard** (by default) og slås på aktivt. Alternativt kan appen spørre hver gang.
- En enkel lokal filtrering av f.eks. 11-sifrede personnumre, e-postadresser og telefonnumre før sending
  er et rimelig tiltak. Navn er vanskelig å fjerne pålitelig med regler, så appen bør i stedet varsle
  brukeren.
- Serveren skal ikke logge forespørselsinnhold. Det må dokumenteres at prompt og svar ikke lagres.

## 4. Overføring til tredjeland (kapittel V)

**[Kilde]**
- Overføring til USA krever et grunnlag i kapittel V. Det kan være en **adekvansbeslutning** (art. 45)
  eller **standard personvernbestemmelser (SCC)** (art. 46 nr. 2 bokstav c).
- Kommisjonens beslutning (EU) 2023/1795 om **EU-US Data Privacy Framework (DPF)** gjelder for
  amerikanske selskaper som er selvsertifisert og står på DPF-listen. Den gjelder også i Norge gjennom
  EØS-avtalen.
- EU-rettens underrett (General Court) avviste søksmålet i **T-553/23 *Latombe***
  3. september 2025, og DPF står derfor foreløpig ved lag. Saken er anket til EU-domstolen
  (**[Usikkert]** saksnr. C-703/25 P, bekreftet bare i én kilde). DPF kan altså falle, slik
  Privacy Shield gjorde (Schrems II).
- **Anthropics DPA** bygger inn **SCC modul 2** (behandlingsansvarlig til databehandler) og **modul 3**
  (databehandler til databehandler), i tillegg til tilleggsavtaler for Storbritannia og Sveits.
  Underleverandører står på anthropic.com/subprocessors, og kunden kan protestere innen 15 dager.

**[Usikkert]** Vi har **ikke** klart å bekrefte i en primærkilde at Anthropic er DPF-sertifisert. Det
står bare i sekundærkilder, og søket på dataprivacyframework.gov ga ikke noe resultat via verktøyet vårt.
**[Tolkning]** SCC-ene i DPA-en er uansett et selvstendig overføringsgrunnlag. Ved bruk av SCC
forventes det at den behandlingsansvarlige gjør en overføringsvurdering (TIA). For en liten app holder
det trolig å vise til DPF-vurderingen av amerikansk rett. Datatilsynet har uttalt at Kommisjonens
vurdering kan legges til grunn, men vi kjenner det bare fra en advokatomtale og har ikke funnet
Datatilsynets egen tekst.

**Datalokasjon (residency):** Claude API har innstillinger for datalokasjon (se kildelisten).
**[Usikkert]** Om det finnes en EU-only-prosessering som er relevant for gruppens konto, må sjekkes.
Inntil videre bør vi regne med at dataene behandles i USA.

## 5. Lokal lagring i nettleseren: krever det samtykke etter ekomloven § 3-15?

**[Kilde] Lovteksten:** Ekomloven (lov 13. desember 2024 nr. 76, i kraft 1. januar 2025) § 3-15 forbyr
å lagre opplysninger, eller skaffe seg tilgang til opplysninger, i brukerens kommunikasjonsutstyr uten
informasjon og samtykke etter GDPR-standard. Det finnes to unntak:
1. Lagring utelukkende for å overføre kommunikasjon i et elektronisk kommunikasjonsnett.
2. Lagring som er **strengt nødvendig for å levere en informasjonssamfunnstjeneste etter brukerens
   uttrykkelige forespørsel**.

**[Kilde] Datatilsynet og Nkom:**
- Bestemmelsen er **teknologinøytral**. Den gjelder cookies og andre teknologier som lagrer eller henter
  ut opplysninger fra utstyret, **uavhengig av om det er personopplysninger**.
- Unntaket for strengt nødvendig lagring gjelder bare når lagringen «er en forutsetning for å kunne
  levere tjenesten».
- Nkom avgjør om en løsning omfattes og om unntakene gjelder. Datatilsynet vurderer informasjon og
  samtykke.
- EDPB Guidelines 2/2023 (v2.0, 7. okt. 2024) bekrefter at ePrivacy art. 5 nr. 3 også gjelder
  «lignende teknologier», og dermed også localStorage/IndexedDB.

**[Kilde] WP29 Opinion 04/2012 (WP194):**
- En cookie er bare unntatt hvis *alle* formålene den har, er unntatt hver for seg.
- Analyse og annonsering er ikke unntatt.
- Er man i tvil, bør man be om samtykke.
- **[Usikkert]** Vi har ikke lest PDF-en selv. Etter vår forståelse regnes «user-input»-lagring som
  unntatt, f.eks. skjemadata eller en handlekurv som brukeren selv har lagt inn. Det samme gjelder
  lagring av brukerens egne valg når brukeren uttrykkelig har bedt om at de skal huskes. Dette må
  kontrolleres mot originalteksten.

**[Tolkning]**
- Å lagre oppgavene brukeren selv skriver inn og ber appen ta vare på, er **selve tjenesten** brukeren
  har bedt om. Uten lagring finnes ingen huskeliste. Dette ligner handlekurven og «user-input» i WP194.
  Vi mener derfor at denne lagringen sannsynligvis er **strengt nødvendig** og ikke krever samtykke.
- Det samme gjelder lagring av brukerens eget samtykke- eller KI-valg og et tema-/språkvalg som
  brukeren aktivt setter.
- **Ikke unntatt:** analyseverktøy (f.eks. Google Analytics, Vercel Analytics med identifikatorer),
  tredjepartsskript, fingeravtrykk eller unike ID-er for statistikk. Slike ting krever samtykkebanner,
  eller at vi lar være å bruke dem. Anbefalingen er å **ikke ta dem med**.
- Informasjon om lagringen bør uansett stå i personvernerklæringen, fordi art. 13 og åpenhet gjelder
  uavhengig av dette.
- **[Usikkert]** Nkom har ikke gitt konkrete eksempler for localStorage i en ren klientapp. Tolkningen
  er derfor vår egen.

## 6. Brukerens rettigheter i en app uten konto

**[Kilde]**
- Retten til innsyn (art. 15), sletting (art. 17), dataportabilitet (art. 20, gjelder ved samtykke eller
  avtale og automatisert behandling) og tilbaketrekking av samtykke (art. 7 nr. 3).
- Art. 11: Hvis den behandlingsansvarlige ikke kan identifisere den registrerte, plikter den ikke å
  skaffe ekstra opplysninger bare for å oppfylle rettighetene. Dette må likevel forklares for brukeren.

**[Tolkning]**
- Gruppen har ingen data og kan ikke identifisere brukeren. Rettighetene oppfylles derfor best
  **i appen selv**:
  - innsyn: alt vises i UI-et
  - portabilitet: eksport til JSON/CSV
  - sletting: knappen «Slett alle data» tømmer localStorage og IndexedDB
  - tilbaketrekking: KI kan skrus av
- **Anthropic:** Tekst som allerede er sendt, ligger hos Anthropic i inntil standard lagringstid (se 7).
  Gruppen kan ikke slette enkeltforespørsler der. Det må stå ærlig i personvernerklæringen.
- Personvernerklæringen bør ha en kontaktadresse for spørsmål og vise til klageretten til Datatilsynet.

## 7. Lagringstid, arkivering (7 dager) og sletting

**[Kilde] Anthropic:**
- I Privacy Center («How long do you store my organization's data?») står det at API-input og -output
  slettes automatisk «within 30 days of receipt or generation». Unntak er lengre lagring som kunden selv
  styrer (f.eks. Files API), særavtaler, lovkrav og brudd på Usage Policy. Ved brudd lagres data i
  **inntil 2 år**, og klassifiseringsscorer i inntil 7 år.
- Zero Data Retention (ZDR) finnes bare etter særavtale.
- **Merk:** API-dokumentasjonen sier at visse «Covered Models» (Claude Fable 5/5.1, Mythos 5/5.1)
  *krever* 30 dagers lagring og ikke kan brukes med ZDR.

**[Usikkert]** Flere sekundærkilder hevder at standardlagringen for API ble satt ned til 7 dager
14./15. september 2025. Anthropics egen artikkel sier fortsatt 30 dager. Vi legger **30 dager** til
grunn, fordi det er primærkilden og det er det strengeste anslaget for personvernet.

**[Tolkning] dueNext:**
- **Arkiv i 7 dager:** Det er et rimelig og forklarbart formål (angre eller se nylig fullførte oppgaver).
  Sletting etter 7 dager oppfyller lagringsbegrensningen i art. 5 nr. 1 bokstav e godt. Slettingen må
  skje automatisk og lokalt, f.eks. ved oppstart og med jevne mellomrom.
- **Aktive oppgaver** lagres til brukeren sletter dem. Det er greit, fordi det er brukerens egne data
  og under brukerens kontroll.
- **KI-svar** (etikett, prioritet, sammendrag) lagres lokalt sammen med oppgaven og slettes sammen med
  den.
- **Serveren** skal ikke lagre noe. Logger bør bare inneholde teknisk metadata uten innhold og ha kort
  lagringstid. Husk at også hostingleverandørens standardlogger kan inneholde IP-adresser.
- Personvernerklæringen må oppgi alle lagringstidene: lokalt (til brukeren sletter, arkiv 7 dager),
  server (ingen lagring av innhold) og Anthropic (inntil 30 dager, lenger ved misbruk).

## 8. Andre momenter

- **DPIA (art. 35):** **[Usikkert]** Kravet slår trolig ikke inn for et lite studentprosjekt. Ny
  teknologi (LLM) kombinert med mulige særlige kategorier gjør likevel en enkel risikovurdering
  anbefalt. Datatilsynet har en liste over behandlinger som krever DPIA, og den bør sjekkes.
- **Protokoll (art. 30):** Små virksomheter er unntatt hvis behandlingen er sporadisk og ikke omfatter
  art. 9-data. En kort behandlingsoversikt er uansett god praksis.
- **Sikkerhet (art. 32):** API-nøkkelen skal bare ligge på serveren og aldri i klienten. Bruk HTTPS.
  Ha grenser for antall og størrelse på forespørsler. Ikke bruk tredjepartsskript.
- **KI-forordningen (AI Act):** Den er utenfor dette dokumentet. Det kan bli aktuelt med en
  åpenhetsplikt om at innholdet er KI-generert. Det er uansett god praksis å merke KI-forslag.

---

## 9. Kravforslag til PRD-en (testbare)

### Funksjonelle krav

| ID | Krav | Akseptansekriterium (test) | Hjemmel |
|---|---|---|---|
| FR-P1 | **KI er av som standard (opt-in).** | Ved ny installasjon/tom lagring sendes ingen forespørsel til `/api/...` før brukeren aktivt har slått på KI. Kan verifiseres i nettverksloggen. | Art. 25 nr. 2, art. 6/7 |
| FR-P2 | **Samtykkedialog før første KI-kall** som forteller hva som sendes (felt), til hvem (Anthropic, USA), lagringstid hos Anthropic (inntil 30 dager) og at data ikke brukes til trening. Dialogen advarer mot helse- og andre sensitive opplysninger. | Dialogen vises før første kall. «Avslå» er like enkelt som «Godta». Valget lagres lokalt med tidsstempel og tekstversjon. | Art. 7, 9(2)(a), 12–13 |
| FR-P3 | **Forhåndsvisning av det som sendes**: brukeren kan se nøyaktig hvilken tekst som sendes, enten før hver sending eller via en innstilling. | Visningen tilsvarer byte for byte forespørselskroppen (kan testes med en enhetstest). | Art. 5(1)(a), 13 |
| FR-P4 | **KI kan skrus av når som helst** i innstillinger. Da brukes den regelbaserte reserveløsningen. | Etter at KI er skrudd av, går ingen nettverkskall til KI-endepunktet, og oppgaver får fortsatt lokale forslag. | Art. 7(3), 25 |
| FR-P5 | **Velg per oppgave/notat om det skal sendes** (f.eks. «Ikke send notater» eller «Privat oppgave»). | En oppgave merket privat sendes aldri. Notater sendes ikke når innstillingen er av. | Art. 5(1)(c) |
| FR-P6 | **Lokal maskering før sending** av personnummer (11 siffer), e-post og telefonnummer. Maskerte felt vises i forhåndsvisningen. | En testtekst med `01019912345`, `ola@x.no` og `+47 912 34 567` sendes som `[PERSONNR]`, `[EPOST]` og `[TLF]`. | Art. 5(1)(c), 25 |
| FR-P7 | **«Slett alle data»** tømmer localStorage, IndexedDB og samtykkevalg etter én bekreftelse. | Etter sletting finnes ingen nøkler eller databaser fra appen (verifiseres i DevTools), og appen starter som ny. | Art. 17 |
| FR-P8 | **Eksport av alle data** til JSON (og gjerne CSV), samt import. | Eksportfilen inneholder alle oppgaver, arkiv og innstillinger. Import gjenoppretter samme tilstand. | Art. 20, 15 |
| FR-P9 | **Automatisk sletting av arkiv etter 7 dager.** | En oppgave fullført for mer enn 7×24 timer siden er borte etter neste oppstart. Testes med falsk klokke. | Art. 5(1)(e) |
| FR-P10 | **Personvernerklæring på norsk** er tilgjengelig fra alle sider med maks ett klikk. Den dekker alle punktene i art. 13 (behandlingsansvarlig/kontakt, formål, grunnlag, Anthropic som mottaker, USA/SCC/DPF, lagringstider, rettigheter, klage til Datatilsynet, lokal lagring). | Sjekkliste mot art. 13 nr. 1–2 er gjennomgått. | Art. 12–13, ekoml. § 3-15 |
| FR-P11 | **KI-forslag merkes** som KI-generert og kan alltid overstyres av brukeren. | Etikett, prioritet og sammendrag fra KI har synlig merking og kan redigeres. | Åpenhet, art. 5(1)(a) |

### Ikke-funksjonelle krav

| ID | Krav | Test |
|---|---|---|
| NFR-P1 | **Serveren lagrer eller logger ikke innholdet** i oppgaver og notater (verken body, prompt eller svar). | Kodegjennomgang og en test som sjekker at loggutskrift ikke inneholder input-tekst. |
| NFR-P2 | **Ingen analyse-, sporings- eller tredjepartsskript** og ingen cookies/lokal lagring utover det som er strengt nødvendig. Da trengs ikke samtykkebanner etter ekoml. § 3-15. | Lighthouse/DevTools: ingen tredjepartsdomener og ingen andre lagringsnøkler enn de som er dokumentert. |
| NFR-P3 | **Bare minimum sendes til KI**: kun tittel og eventuelt notat for én oppgave. Ingen ID-er, historikk, IP eller brukeragent i prompten. | Test av funksjonen som bygger prompten. |
| NFR-P4 | **API-nøkkelen ligger bare på serveren** (miljøvariabel). Den finnes ikke i klientbundelen. | Søk i build-output etter `sk-ant`. |
| NFR-P5 | **Begrensning av input**: maks lengde per forespørsel og rate limiting. | Forespørsel over grensen gir 413/400. |
| NFR-P6 | **Leverandørvilkår dokumentert**: DPA (SCC) er akseptert via Commercial Terms, en modell som ikke krever ekstra lagring er valgt, og vilkårene er sjekket på nytt før lansering. | Punkt på sjekklisten før release. |
| NFR-P7 | **Appen virker fullt ut uten KI** (reserveløsning). Brukeren kan da nekte samtykke uten å miste kjernefunksjonen, slik at samtykket er frivillig. | E2E-test med KI av eller uten nøkkel. |

---

## Kildeliste

**Lovtekst**
- GDPR, forordning (EU) 2016/679 (EUR-Lex): https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Personopplysningsloven (Lovdata): https://lovdata.no/dokument/NL/lov/2018-06-15-38
- Ekomloven 2024, § 3-15 (Lovdata): https://lovdata.no/dokument/NL/lov/2024-12-13-76/KAPITTEL_3
- Kommisjonens gjennomføringsbeslutning (EU) 2023/1795 (DPF): https://eur-lex.europa.eu/eli/dec_impl/2023/1795/oj

**Datatilsynet og Nkom**
- Datatilsynet, «Samtykke til bruk av informasjonskapsler og andre sporingsteknologier»: https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/bruk-av-informasjonskapsler-og-andre-sporingsteknologier/
- Datatilsynet, «Nye cookie-regler fra 1. januar»: https://www.datatilsynet.no/aktuelt/aktuelle-nyheter-2024/nye-cookie-regler-fra-1.-januar/
- Nkom, «Informasjonskapsler/cookies»: https://nkom.no/internett/informasjonskapsler-cookies

**EDPB og WP29**
- EDPB Guidelines 4/2019 om art. 25: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-42019-article-25-data-protection-design-and_en
- EDPB Guidelines 07/2020 om behandlingsansvarlig og databehandler: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-072020-concepts-controller-and-processor-gdpr_en
- EDPB Guidelines 2/2023 om teknisk omfang av ePrivacy art. 5(3), v2.0: https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf
- EDPB SPE-rapport «AI Privacy Risks & Mitigations – Large Language Models» (april 2025): https://www.edpb.europa.eu/our-work-tools/our-documents/support-pool-experts-projects/ai-privacy-risks-mitigations-large_en
- WP29 Opinion 04/2012 om unntak fra samtykke til cookies (WP194): https://Datenschutz.Hessen.de/sites/datenschutz.hessen.de/files/2022-11/wp_194.pdf (sammendrag: https://fpf.org/blog/cookie-consent-exemption-article-29-wp-opinion/)

**Anthropic**
- Commercial Terms: https://www.anthropic.com/legal/commercial-terms
- Data Processing Addendum: https://www.anthropic.com/legal/data-processing-addendum
- Underleverandører: https://www.anthropic.com/subprocessors
- «How long do you store my organization's data?»: https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data
- API and data retention (ZDR, Covered Models): https://platform.claude.com/docs/en/manage-claude/api-and-data-retention
- Data residency: https://platform.claude.com/docs/en/manage-claude/data-residency

**Rettspraksis og sekundærkilder (om DPF og Latombe)**
- Lewis Silkin om T-553/23 *Latombe*: https://www.lewissilkin.com/insights/2025/09/03/transatlantic-trouble-not-this-time-latombes-challenge-to-eu-us-data-transfers-fails
- EU Law Analysis om dommen: https://eulawanalysis.blogspot.com/2025/10/the-general-court-of-european-union.html
- Schjødt om praktiske følger av DPF (Datatilsynets syn): https://schjodt.com/news/practical-consequences-of-the-eu-u-s-data-privacy-framework
- DPF-listen (for å sjekke Anthropics status manuelt): https://www.dataprivacyframework.gov/list
- EU-domstolen C-184/20 *OT* (bred tolkning av art. 9): https://curia.europa.eu/juris/liste.jsf?num=C-184/20

## Åpne punkter / må verifiseres

1. Er Anthropic aktivt DPF-sertifisert? Sjekk manuelt på dataprivacyframework.gov.
2. Er standardlagringen for API 30 eller 7 dager? Primærkilden sier 30, sekundærkildene sier 7.
3. Hva sier WP194 nøyaktig om «user-input» og lagring av brukerens egne valg? Les originalen.
4. Hvilken modell skal brukes? Covered Models krever 30 dagers lagring.
5. Hvem i gruppen er formelt behandlingsansvarlig og kontaktpunkt, og hvem eier API-kontoen?
6. Hostingleverandørens logger og DPA (f.eks. Vercel).

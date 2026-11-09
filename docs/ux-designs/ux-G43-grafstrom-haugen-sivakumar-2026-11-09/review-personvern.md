# Personvern-tekst – gjennomgang

Gjennomgått: `EXPERIENCE.md`, `DESIGN.md`, `.memlog.md`, `reconcile-skisse-design.md` og `imports/Skisse-design.jpg.jpeg`, sjekket mot `prd.md` (F2, F3, F6, FR-15, FR-35–FR-43) og research-notatene `research-gdpr-regelverk.md`, `research-gdpr-forskning.md`, `research-anthropic-dpf.md` og `research-anthropic-lagringstid.md`. Dato: 2026-11-09.

*Dette er ikke juridisk rådgivning. Gjennomgangen peker på risiko og forslag.*

## Samlet vurdering

**Retningen er god, men teksten er ikke klar ennå.** Gruppas valg er gjennomtenkt og står åpent i spinen: hendelser med tittel sendes til KI, «🔒 Ikke send til KI» gjelder også hendelser, og fornavnet lagres lokalt uten konto eller telefon. Opt-in og like store Ja/Nei uten forhåndsvalg er også riktig beskrevet. Hovedproblemet er at utvidelsen ikke er ført helt gjennom i tekstene og kontrollene. Det gjelder fem ting:

1. Det finnes ingen ferdig samtykketekst. Beskrivelsen i Flyt 3 nevner ikke frist, tidspunkter for økter, lagring i inntil 2 år, SCC eller uttrykkelig samtykke til helseopplysninger. Hendelsestitler som «Legetime» eller «Psykolog» gjør art. 9-risikoen *større* enn i PRD-en.
2. FR-37-påminnelsen gjelder bare oppgaveteksten. Den gjelder ikke hendelser, selv om det er der helsetitlene oftest står.
3. «🔒 Ikke send til KI» på en hendelse er feil navngitt, fordi tidspunktet fortsatt sendes.
4. På mobil ligger personvernerklæringen ikke tydelig ett klikk unna (FR-41).
5. Skissens løfter («Navn, telefon og e-post sendes aldri», «slettes innen 30 dager», «regelbaserte forslag når KI er av») er ikke uttrykkelig forkastet. «Hva som sendes» i Personvern og data har ingen fastsatt tekst.

Alt kan rettes med tekst og små presiseringer. Ingen av gruppas valg må endres.

**Antall funn:** 1 kritisk, 5 høy, 8 middels og 5 lav.

## Funn

### Kritisk

- **[kritisk] KI-samtykket dekker ikke det som faktisk sendes, og ber ikke uttrykkelig om samtykke til helseopplysninger i hendelser** (EXPERIENCE → Flyt 3 steg 2, State Patterns «Første oppstart», KI-planlegging punkt 2). Flyt 3 sier «oppgavetekst, notater og hendelser». Følgende mangler:
  - at **frist**, **hendelsenes tittel, dato og klokkeslett**, «opptatt»-tider og tidspunkter for økter sendes
  - at Anthropic kan lagre flaggede samtaler i **inntil 2 år** (FR-41, research-anthropic-lagringstid). Dette kan stå i erklæringen, men samtykket bør si «normalt» og lenke til den.
  - avtalepart (Anthropic Ireland) og overføringsgrunnlag (**SCC**, ikke DPF)
  - en **uttrykkelig** art. 9-formulering (research-gdpr-regelverk §2). Hendelsestitler som «Legetime», «Psykolog» eller «Fysio» er helseopplysninger, og gjentakende hendelser avslører mønstre. Risikoen er større enn PRD-en forutsatte, fordi studenten ikke tenker på kalenderen som «tekst til KI».
  - at «🔒 Ikke send til KI» finnes, og at appen virker fullt ut med «Nei» (frivillighet, NFR-P7)
  - en lenke til hele personvernerklæringen

  Siden det ikke finnes noen ferdig tekst, kan hvem som helst skrive den under implementeringen.
  *Fiks:* Ta inn teksten under «Foreslått tekst for KI-samtykke» ordrett i EXPERIENCE (Flyt 3) som fastsatt tekst, og oppdater FR-35 i PRD-en.

### Høy

- **[høy] Personvernerklæringen er ikke synlig ett klikk unna på mobil** (EXPERIENCE IA «Personvernerklæring – Lenke på alle skjermer» mot Navigasjon og DESIGN Layout for mobil). Mobiloppsettet har logo, lupe og ⚙ øverst og Oppgaver/Kalender/Arkiv nederst. Det er ikke sagt hvor lenken står. Via ⚙ → Personvern og data → erklæring blir det to–tre klikk. Avvikstabellen (#11) sier «FR-41 er fortsatt oppfylt», men det er ikke vist.
  *Fiks:* Bestem en fast plassering, for eksempel lenken «Personvern» nederst i ⚙-menyen *som første nivå*. Det er bedre med en liten tekstlenke «Personvern» i bunnen av hver side, under lista eller over bunnmenyen, og i toppen av skjema og detalj. Lenken bør også stå i samtykkedialogen og i Personvern og data. Skriv inn i EXPERIENCE: «Lenken *Personvernerklæring* er synlig uten å åpne menyer på alle skjermer, også mobil.»

- **[høy] FR-37-påminnelsen mangler for hendelser og notater** (EXPERIENCE Component Patterns «KI-påminnelse»). Påminnelsen står bare «under oppgavetekst» og sier «Teksten sendes …». I Flyt 2 legger Sara inn «Legetime» uten å få vite at tittelen sendes. Det står bare i en kommentar i spinen, ikke i UI-et.
  *Fiks:* Bruk tre varianter når KI er på:
  - Oppgave: «Teksten og notatene sendes til KI (Claude) for å lage forslag.» Uten «og notatene» når FR-39 er på.
  - Hendelse: «Tittel og tid brukes av KI (Claude) når den planlegger økter. Slå på 🔒 hvis tittelen er privat – da sendes bare at du er opptatt.»
  - Når 🔒 er på, byttes påminnelsen ut med: «Sendes ikke til KI.» (oppgave) eller «KI ser bare at du er opptatt.» (hendelse).

- **[høy] «🔒 Ikke send til KI» lover for mye på hendelser** (EXPERIENCE Component Patterns, DESIGN Components «Bryteren»). På en hendelse sendes fortsatt dato og klokkeslett som «opptatt». Etiketten sier noe annet enn det som skjer.
  *Fiks:* Behold samme bryter og ikon, men bruk en egen tekst for hendelser: **«🔒 Skjul tittel for KI»** med hjelpeteksten «KI får bare vite at du er opptatt kl. 14–15, ikke hva du skal.» Kan ikke etiketten endres, må hjelpeteksten stå rett under bryteren.

- **[høy] Skissens personverntekster lover mer enn det som bygges, og de er ikke forkastet** (reconcile-skisse-design «Kvalitative ideer» #4, skissens Personvern og data, EXPERIENCE IA «hva sendes, lagring»). Skissen sier tre ting som ikke stemmer:
  - «✕ Navn, telefon og e-post sendes aldri». FR-42 er bare et *Bør*, og selv da gjelder det pseudonymisering med feilrate. Reconcile flagger dette, men memloggen har ingen beslutning.
  - «Det Anthropic mottar, slettes hos dem innen 30 dager». Teksten er absolutt, men flaggede samtaler kan lagres i inntil 2 år.
  - «Slår du den av, får du regelbaserte forslag i stedet». Det stemmer ikke med FR-19. Med KI av får studenten ingen forslag, og reserveløsningen gjelder bare når KI er på, men utilgjengelig.

  *Fiks:* Skriv en fastsatt tekst for «Hva sendes til KI» og «Lagring» i EXPERIENCE (se forslaget under), og noter beslutningen i memloggen. Fram til FR-42 er bygget skal det stå: «Skriv ikke navn, telefonnummer eller helseopplysninger – appen fjerner dem ikke automatisk.» Når FR-42 er bygget: «Appen prøver å bytte ut telefonnumre og e-post med plassholdere før sending, men kan ikke garantere at alt blir fanget.»

- **[høy] Data for «Foreslå ny tid» og økter er ikke beskrevet, og forholdet til 🔒 og KI av er udefinert** (EXPERIENCE Component Patterns «Kollisjonsmerke», KI-planlegging punkt 5). Det står ikke hva som sendes når studenten trykker «Foreslå ny tid»: oppgavetekst, notater, frist, alle hendelser og andre økter? Det står heller ikke at knappen må skjules (1) når KI er av, (2) på økter til en oppgave med 🔒, og (3) for manuelle økter når KI er av. Ellers bryter en 🔒-oppgave FR-38 i det øyeblikket det oppstår en kollisjon.
  *Fiks:* Legg til i Component Patterns: «*Foreslå ny tid* vises bare når KI er på og oppgaven ikke er merket 🔒. Ellers vises bare *Endre tid*. Til KI sendes det samme som ved øktforslag: oppgavetekst, notater (om tillatt), frist, hendelser i perioden (🔒-hendelser som «opptatt») og tidspunktene for andre godtatte økter som «opptatt».» Nevn «Foreslå ny tid» i samtykket og i erklæringen.

### Middels

- **[middels] Hendelsestitler sendes som standard, og det finnes ingen global innstilling** (EXPERIENCE IA «Personvern og data», KI-planlegging). Art. 25 nr. 2 (personvern som standard) og motmålet i PRD-en peker mot minst mulig data. Gruppas valg om å sende titler godtas, men studenten bør ha en samlet bryter, slik FR-39 har for notater.
  *Fiks:* Legg til i Personvern og data: «**Send hendelsestitler til KI** (på/av). Av: KI ser bare når du er opptatt, ikke hva du skal.» Vurder om standarden skal være *av*. Det er gruppas avveining.

- **[middels] At fornavnet aldri sendes til KI, står bare i memloggen** (`.memlog.md`: «Sendes aldri til KI», EXPERIENCE IA «Profil»). Spinen sier ikke noe om det. Det må være en uttrykkelig regel for arkitekturen (ikke i prompt eller systemprompt, for eksempel for et personlig sammendrag) og stå i teksten til brukeren.
  *Fiks:* I EXPERIENCE Profil: «Fornavnet lagres bare i nettleseren, brukes i hilsenen og sendes aldri til KI eller serveren.» Samme setning hører hjemme i Personvern og data og i erklæringen. Steg 1 i Flyt 3 kan få hjelpeteksten «Bare for hilsenen. Lagres på denne enheten.»

- **[middels] Hvordan godtatte økter og 🔒-oppgaver brukes som «opptatt», er udefinert** (KI-planlegging punkt 2). Når en ny oppgave planlegges, må KI kjenne til økter som allerede er godtatt. Slike økter heter «Økt 1/3 – <oppgavetekst>», og det er uklart om teksten sendes med. For en 🔒-oppgave ville det bryte FR-38.
  *Fiks:* «Andre godtatte økter sendes bare som opptatt-tid, uten oppgavetekst.»

- **[middels] Omfanget av «Slett alle data» er ikke oppdatert, og den ærlige setningen om Anthropic mangler i UI-et** (EXPERIENCE IA «Personvern og data», FR-40). FR-40 sier «oppgaver og innstillinger». Nå finnes også hendelser, økter, fornavn, tema, prosjekter og samtykkevalg.
  *Fiks:* Dialogtekst: «**Slette alle data?** Alle oppgaver, hendelser, økter, navnet ditt og innstillingene slettes fra denne nettleseren, og appen starter på nytt. Det kan ikke angres. Tekst som allerede er sendt til KI, kan ikke slettes herfra – Anthropic sletter den normalt innen 30 dager.» Knapper: *Avbryt* / *Slett alt* (varselfarge).

- **[middels] Eksport og import mangler personverntekst og regler** (EXPERIENCE IA, State Patterns «Import feiler»). Eksportfila inneholder fornavn og eventuelle helsetitler i klartekst. Det står ikke om import erstatter eller fletter data, og ikke om importerte oppgaver sendes til KI automatisk.
  *Fiks:* Eksport: «Fila inneholder alt du har skrevet, også navnet ditt og hendelsene. Lagre den et trygt sted.» Import: «Importen erstatter alle data i appen. Fortsette?» Legg også til regelen at importerte oppgaver ikke sender noe til KI før studenten endrer teksten eller ber om forslag. Merk at FR-43 er *Bør*. Om den ikke bygges, må knappene fjernes fra spinen.

- **[middels] Samtykket mangler tilbaketrekking, lenke og frivillighet** (Flyt 3 steg 2–3). Teksten «Valget kan endres i Innstillinger» står bare i flyten, ikke i dialogen. Art. 7 nr. 3 krever at studenten får vite om retten til å trekke samtykket *før* hen samtykker.
  *Fiks:* Ta det med i dialogteksten (se forslaget) sammen med «Les hele personvernerklæringen».

- **[middels] Hvor mye som sendes, er ikke avgrenset (dataminimering)** (KI-planlegging punkt 2: «hendelser … i perioden fram til fristen»). Har en oppgave frist om fire måneder, sendes alle hendelser i fire måneder. FR-13 sender dem på nytt hver gang teksten endres.
  *Fiks:* Begrens perioden, for eksempel til maks 14 dager fram, eller til fristen hvis den er tidligere. Skriv det i spinen og i erklæringen: «KI får bare hendelser for de nærmeste 14 dagene.» Selve tallet bestemmes i arkitekturen.

- **[middels] Opplysninger om andre personer i hendelsestitler** (Flyt 1–2). Titler som «Middag med Ola» eller «Kjøre mamma til sykehus» er tredjepersons opplysninger, også helse. Samtykket fra studenten dekker ikke dem.
  *Fiks:* Advarselen i samtykket og hendelsespåminnelsen bør si: «Unngå navn på andre og helseopplysninger – bruk 🔒 eller en nøytral tittel som «Avtale».»

### Lav

- **[lav] Låsikonet vises bare på oppgavekort** (DESIGN Components «Bryteren»). Hendelsesrader, kalenderceller og hendelsesdetalj viser ikke om hendelsen er 🔒.
  *Fiks:* Bruk samme lille låsikon på hendelsesrad og hendelsesdetalj, med skjermlesertekst «Skjult for KI».

- **[lav] «Helt tom app» sier at KI hjelper selv om studenten har sagt nei** (State Patterns: «… KI hjelper deg å sortere»).
  *Fiks:* Bruk en variant uten KI: «Hei, Ida 👋 Skriv inn det første du må huske.»

- **[lav] Påminnelsen er unøyaktig** (Component Patterns «KI-påminnelse»). «Teksten sendes til KI (Claude) for å lage forslag» nevner ikke notatene. Se fiks under høy-funnet om FR-37.

- **[lav] Erklæringen bør nevne mer** (FR-41). Formålet er nå også *planlegging av økter*, ikke bare sortering. Ingen automatiske avgjørelser tas (studenten godtar alt, art. 22 er ikke relevant), reserveløsningen sender ingenting, aldersgrensen er 13 år (pol. § 5), og fornavn, tema og samtykkevalg lagres lokalt (ekomloven § 3-15, strengt nødvendig).
  *Fiks:* Legg punktene inn i FR-41-lista.

- **[lav] Dokumentasjon av samtykket** (research-gdpr-regelverk §2, [Usikkert]). Lagre samtykket lokalt med dato og versjon av teksten. Vis da samtykket på nytt hvis innholdet endres, for eksempel hvis titler kommer til senere.
  *Fiks:* «Godkjent 9.11.2026 (tekst v2)» vises i Personvern og data.

## Foreslått tekst for KI-samtykke (førstegangsoppsett)

Tonen er saklig, uten emoji (Voice and Tone). *Ja* og *Nei* er like store og står side om side, og ingen er forhåndsvalgt. Lenken åpner erklæringen uten at oppsettet mistes.

> **Vil du bruke KI?**
>
> dueNext kan bruke KI-tjenesten Claude til å foreslå etikett, prioritet og sammendrag, og til å foreslå når du kan jobbe med en oppgave.
>
> **Dette sendes når KI er på:**
> - teksten og notatene på oppgavene dine, og fristen
> - tittel, dato og klokkeslett på hendelsene i kalenderen din (for eksempel «Jobbvakt tor 16–22»), slik at øktene legges utenom dem
>
> Navnet ditt sendes aldri.
>
> **Hvem får det:** Anthropic, selskapet bak Claude. Avtalen er med Anthropic Ireland, men dataene behandles i USA. Overføringen er sikret med EUs standardavtaler (SCC).
>
> **Hvor lenge:** Anthropic bruker ikke dataene til å trene KI-modeller. De slettes normalt innen 30 dager, men kan lagres i inntil 2 år hvis en forespørsel flagges for brudd på bruksreglene. Det som er sendt, kan ikke slettes fra appen.
>
> **Vær forsiktig:** Skriv helst ikke helseopplysninger eller navn på andre, heller ikke i hendelser som «Legetime». Velger du *Ja*, samtykker du også til at slike opplysninger sendes hvis du likevel skriver dem. Med **🔒 Ikke send til KI** holder du en oppgave helt utenfor. På en hendelse sendes da bare at du er opptatt.
>
> Appen virker fullt ut uten KI. Da fyller du ut feltene og legger inn økter selv. Du kan ombestemme deg når som helst i Innstillinger → Personvern og data.
>
> [Les hele personvernerklæringen]
>
> **[ Nei, uten KI ]**  **[ Ja, bruk KI ]**

Hvis «Send hendelsestitler til KI» blir en egen innstilling, endres punkt 2 til «dato og klokkeslett på hendelsene, og titlene hvis du tillater det».

**Fastsatt tekst for Personvern og data → «Hva sendes til KI»:**

> ✓ Oppgavetekst, notater (kan slås av) og frist
> ✓ Tittel og tid på hendelser. Hendelser med 🔒 sendes bare som «opptatt».
> ✓ Tidspunkter for andre økter, som «opptatt»
> ✕ Oppgaver merket 🔒
> ✕ Fornavnet ditt
> Appen fjerner ikke navn eller helseopplysninger automatisk. Unngå å skrive dem.
>
> **Lagring:** Alt ligger bare i denne nettleseren. Det som sendes til Anthropic, slettes normalt innen 30 dager, men kan lagres i inntil 2 år hvis det flagges for brudd på bruksreglene.

## Mangler i «Avvik fra PRD»

Tabellen i EXPERIENCE har med FR-15, FR-35, FR-37, FR-41 og FR-38 (rad 3–4) og F6 (rad 8 og 11). Dette mangler eller er for upresist:

| Mangler | Berørt i PRD | Hvorfor |
|---|---|---|
| FR-15 må liste **alle felt** som sendes: tekst, notater, frist, hendelsenes tittel og tid, «opptatt»-tider, tidspunkter for andre økter og hvilken periode som sendes | FR-15, motmål | Rad 3 sier bare «hendelser (tid og tittel)» |
| **«Foreslå ny tid»** som eget KI-kall med egen dataoppramsing, og at knappen skjules ved KI av eller 🔒 | F2, FR-38 | Rad 2 nevner funksjonen, men ikke dataene |
| FR-38 får **ulik betydning for oppgave og hendelse** (tidspunktet sendes fortsatt) og trenger en egen etikett | FR-38 | Rad 4 sier bare «gjelder også hendelser» |
| Mulig ny innstilling **«Send hendelsestitler til KI»** (som FR-39) | FR-39 / ny FR | Personvern som standard |
| **FR-35 krever uttrykkelig art. 9-samtykke** som også gjelder hendelser, og lenke til erklæringen | FR-35 | Helsetitler i hendelser |
| **FR-40** må omfatte hendelser, økter, fornavn, tema, prosjekter og samtykkevalg | FR-40 | Ikke nevnt |
| **FR-43** (eksport/import) må omfatte hendelser, økter og fornavn, med advarsel, og importregelen (erstatter, ingen automatiske KI-kall) | FR-43 | Ikke nevnt |
| **FR-42** bør også gjelde hendelsestitler, og skissens løfte «sendes aldri» må forkastes formelt | FR-42 | Reconcile #4 er ikke avgjort |
| **FR-19 og F3:** Med KI av eller utilgjengelig blir det ingen øktforslag og ingen «Foreslå ny tid», bare manuelle økter | F3, FR-19 | Ikke nevnt |
| **FR-41:** formålet planlegging, fornavn lokalt, hendelser, at reserveløsningen ikke sender noe, aldersgrense 13 år og plasseringen av lenken på mobil | FR-41 | Rad 11 påstår at FR-41 er oppfylt, men plasseringen er ikke vist |
| **NFR-3:** Serveren logger heller ikke hendelser og økter | NFR-3 | Nye datatyper |
| **Å-6 (TIA)** og eventuell vurdering av **DPIA** må ta hensyn til mer data med mulig art. 9-innhold | Åpne spørsmål | Risikoen har økt |
| **Fornavnet sendes aldri til KI** som uttrykkelig krav, ikke bare i memloggen | F6 (rad 8) | Rad 8 nevner bare «Profil» |

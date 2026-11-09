# Valideringsrapport – dueNext

- **DESIGN.md:** `./DESIGN.md`
- **EXPERIENCE.md:** `./EXPERIENCE.md`
- **Kjørt:** 2026-11-09T21:18

## Samlet vurdering
Spinene er godt skrevet og har riktig form. Kjernen (oppgavekort, smartlister, KI-forslagsboks, temaer, glød, lys/mørk) er tydelig nok til å bygges, og kontrastpåstandene i Colors stemmer når de regnes ut. De to nye funksjonene som ikke finnes i PRD-en, **hendelser** og **KI-økter**, er bare beskrevet for «gladveien». Livssyklus, gjentakelse, nattevakter over midnatt og kalenderens egen oppførsel mangler, så en arkitekt eller story-utvikler må gjette på datamodell og regler. I tillegg er det ett PRD-avvik som ikke er listet (FR-26-filtre), et par AA-brudd som motsier målet om WCAG 2.1 AA, og flere komponenter som bare har visuell spesifikasjon eller bare oppførsel. Paret er **ikke klart som kontrakt** før de høye funnene er lukket. Ingen funn er kritiske.

Personverngjennomgangen endrer bildet. Den fant ett kritisk funn: KI-samtykket dekker ikke alt som faktisk sendes, blant annet hendelsestitler som kan være helseopplysninger. Den fant også fem høye funn om tekst og kontroller. Ingen av gruppas valg må reverseres. Alt kan løses med fastsatt tekst og presiseringer.

## Vurdering per kategori
- Flytdekning – tynn
- Tokenkomplett – tilstrekkelig
- Komponentdekning – tynn
- Tilstandsdekning – tilstrekkelig
- Visuell referansedekning – tilstrekkelig
- Overflødig og overspesifisert – sterk
- Arvedisiplin – tilstrekkelig
- Formtilpasning – sterk

## Funn etter alvorlighet

### Kritisk (1)

**[Personvern-tekst]** – KI-samtykket dekker ikke det som faktisk sendes, og ber ikke uttrykkelig om samtykke til helseopplysninger i hendelser (§ EXPERIENCE → Flyt 3 steg 2, State Patterns «Første oppstart», KI-planlegging punkt 2)
(EXPERIENCE → Flyt 3 steg 2, State Patterns «Første oppstart», KI-planlegging punkt 2). Flyt 3 sier «oppgavetekst, notater og hendelser». Følgende mangler: - at **frist**, **hendelsenes tittel, dato og klokkeslett**, «opptatt»-tider og tidspunkter for økter sendes - at Anthropic kan lagre flaggede samtaler i **inntil 2 år** (FR-41, research-anthropic-lagringstid). Dette kan stå i erklæringen, men samtykket bør si «normalt» og lenke til den. - avtalepart (Anthropic Ireland) og overføringsgrunnlag (**SCC**, ikke DPF) - en **uttrykkelig** art. 9-formulering (research-gdpr-regelverk §2). Hendelsestitler som «Legetime», «Psykolog» eller «Fysio» er helseopplysninger, og gjentakende hendelser avslører mønstre. Risikoen er større enn PRD-en forutsatte, fordi studenten ikke tenker på kalenderen som «tekst til KI». - at «🔒 Ikke send til KI» finnes, og at appen virker fullt ut med «Nei» (frivillighet, NFR-P7) - en lenke til hele personvernerklæringen Siden det ikke finnes noen ferdig tekst, kan hvem som helst skrive den under implementeringen.
Fiks: Ta inn teksten under «Foreslått tekst for KI-samtykke» ordrett i EXPERIENCE (Flyt 3) som fastsatt tekst, og oppdater FR-35 i PRD-en.

### Høy (14)

**[Flytdekning]** – F5 (Arkiv: fullføre, angre via snackbar, gjenopprette, slette nå, 7-dagersregel) har ingen Key Flow (§ EXPERIENCE, Key Flows)
Reglene finnes bare spredt i State Patterns og Interaction Primitives (EXPERIENCE, Key Flows).
Fiks: Legg til «Flyt 5 – Ida huker av og angrer» med avhuking → snackbar → Arkiv → Gjenopprett, og som avvik at 5 sekunder er gått og angring skjer fra Arkiv.

**[Flytdekning]** – F4 søk har et ferdig scenario i PRD-en (FR-28, «statistikk»), men ingen flyt (§ EXPERIENCE, Key Flows)
Filter og sortering mangler også flyt (EXPERIENCE, Key Flows).
Fiks: Legg til en kort søkeflyt med navngitt person, der klimaks er at treffet viser *Fullført* og frist, og avviksveien er «Fant ingenting …».

**[Tokenkomplett]** – Snackbar: «Angre» i pastell på *lys pille i mørk modus* gir bare ca (§ DESIGN linje 254)
1,3–1,8:1, som er et klart AA-brudd. Pillens farger er heller ikke tokens (DESIGN linje 254).
Fiks: Legg til tokenene `snackbar-bg` og `snackbar-bg-dark`, og bruk `accent-ink` (ikke pastell) for «Angre» på lys pille.

**[Tokenkomplett]** – Skjemafelt har bare kantlinjen `border-hairline` (#E7E7E3 mot #FFFFFF = 1,24:1) (§ DESIGN linje 244, 249–251)
WCAG 1.4.11 krever 3:1 for feltgrenser. Det samme gjelder valgt filter, prioritetsvelger og valgt dag, der valgt tilstand bare vises med pastellfyll (1,28–1,76:1 mot hvit) (DESIGN linje 244, 249–251).
Fiks: Gi feltene en egen `border-input` på ≥ 3:1, og gi valgt tilstand et ekstra signal (kant i `accent-ink` eller hake).

**[Komponentdekning]** –  (§ DESIGN linje 246, EXPERIENCE linje 154, 191)
Kalender** har bare en visuell rad. Oppførselen mangler: hva trykk på dag gjør (dagsliste eller skjema), månedsnavigasjon (forrige/neste/«I dag»), hva som skjer når en dag har mange elementer på PC («+3 til»), og hvor «+ Ny» står på PC, der den flytende knappen ikke finnes. Flyt 2 steg 2 bruker likevel «+ Ny» på PC (DESIGN linje 246, EXPERIENCE linje 154, 191).
Fiks: Legg til en rad «Kalender» i Component Patterns med disse reglene.

**[Tilstandsdekning]** –  (§ Flyt 2, KI-planlegging steg 3)
Hendelse over midnatt motsier skjemaet.** Hendelsesfelt har én dato, og «Slutt før start» gir feilmelding. Da kan ikke Saras nattevakt (Flyt 2, KI-planlegging steg 3) legges inn (EXPERIENCE linje 83, 115).
Fiks: Legg til sluttdato eller regelen «slutt før start = neste dag», og juster feilmeldingen.

**[Tilstandsdekning]** –  (§ Hendelsesdetalj, EXPERIENCE linje 30, 83)
Gjentakende hendelser:** Det er ikke sagt hva *Endre* og *Slett* gjør på én forekomst kontra hele serien (Hendelsesdetalj, EXPERIENCE linje 30, 83). Dette påvirker datamodellen direkte.
Fiks: Bestem dette, f.eks. «Bare denne / Hele serien» i dialogen, eller «bare hele serien i v1», og skriv det inn.

**[Tilstandsdekning]** –  (§ Flyt 4)
Økters livssyklus er udefinert.** Det står ikke hva som skjer med godtatte økter når fristen endres (Flyt 4), når oppgaven fullføres, slettes eller gjenopprettes, eller når en økt passeres uten å være huket av. Det står heller ikke hvilken smartliste en økt havner i, og om den teller i gruppeantallet (EXPERIENCE linje 73–74, 158–167).
Fiks: Legg til en tabell for økters livssyklus i KI-planlegging.

**[Arvedisiplin]** –  (§ EXPERIENCE linje 76, DESIGN linje 244)
Avvik som ikke er listet:** FR-26 sier at studenten kan filtrere på etikett, *prioritet, frist og prosjekt*. Spinene har bare filtrene Alle/Skole/Jobb/Privat (EXPERIENCE linje 76, DESIGN linje 244).
Fiks: Legg til prioritet, frist og prosjekt (f.eks. et «Filter»-ark), eller før det opp som avvik nr. 12 i «Avvik fra PRD».

**[Personvern-tekst]** – Personvernerklæringen er ikke synlig ett klikk unna på mobil (§ EXPERIENCE IA «Personvernerklæring – Lenke på alle skjermer» mot Navigasjon og DESIGN Layout for mobil)
(EXPERIENCE IA «Personvernerklæring – Lenke på alle skjermer» mot Navigasjon og DESIGN Layout for mobil). Mobiloppsettet har logo, lupe og ⚙ øverst og Oppgaver/Kalender/Arkiv nederst. Det er ikke sagt hvor lenken står. Via ⚙ → Personvern og data → erklæring blir det to–tre klikk. Avvikstabellen (#11) sier «FR-41 er fortsatt oppfylt», men det er ikke vist.
Fiks: Bestem en fast plassering, for eksempel lenken «Personvern» nederst i ⚙-menyen *som første nivå*. Det er bedre med en liten tekstlenke «Personvern» i bunnen av hver side, under lista eller over bunnmenyen, og i toppen av skjema og detalj. Lenken bør også stå i samtykkedialogen og i Personvern og data. Skriv inn i EXPERIENCE: «Lenken *Personvernerklæring* er synlig uten å åpne menyer på alle skjermer, også mobil.»

**[Personvern-tekst]** – FR-37-påminnelsen mangler for hendelser og notater (§ EXPERIENCE Component Patterns «KI-påminnelse»)
(EXPERIENCE Component Patterns «KI-påminnelse»). Påminnelsen står bare «under oppgavetekst» og sier «Teksten sendes …». I Flyt 2 legger Sara inn «Legetime» uten å få vite at tittelen sendes. Det står bare i en kommentar i spinen, ikke i UI-et.
Fiks: Bruk tre varianter når KI er på:
- Oppgave: «Teksten og notatene sendes til KI (Claude) for å lage forslag.» Uten «og notatene» når FR-39 er på.
- Hendelse: «Tittel og tid brukes av KI (Claude) når den planlegger økter. Slå på 🔒 hvis tittelen er privat – da sendes bare at du er opptatt.»
- Når 🔒 er på, byttes påminnelsen ut med: «Sendes ikke til KI.» (oppgave) eller «KI ser bare at du er opptatt.» (hendelse).

**[Personvern-tekst]** – «🔒 Ikke send til KI» lover for mye på hendelser (§ EXPERIENCE Component Patterns, DESIGN Components «Bryteren»)
(EXPERIENCE Component Patterns, DESIGN Components «Bryteren»). På en hendelse sendes fortsatt dato og klokkeslett som «opptatt». Etiketten sier noe annet enn det som skjer.
Fiks: Behold samme bryter og ikon, men bruk en egen tekst for hendelser: **«🔒 Skjul tittel for KI»** med hjelpeteksten «KI får bare vite at du er opptatt kl. 14–15, ikke hva du skal.» Kan ikke etiketten endres, må hjelpeteksten stå rett under bryteren.

**[Personvern-tekst]** – Skissens personverntekster lover mer enn det som bygges, og de er ikke forkastet (§ reconcile-skisse-design «Kvalitative ideer» #4, skissens Personvern og data, EXPERIENCE IA «hva sendes, lagring»)
(reconcile-skisse-design «Kvalitative ideer» #4, skissens Personvern og data, EXPERIENCE IA «hva sendes, lagring»). Skissen sier tre ting som ikke stemmer: - «✕ Navn, telefon og e-post sendes aldri». FR-42 er bare et *Bør*, og selv da gjelder det pseudonymisering med feilrate. Reconcile flagger dette, men memloggen har ingen beslutning. - «Det Anthropic mottar, slettes hos dem innen 30 dager». Teksten er absolutt, men flaggede samtaler kan lagres i inntil 2 år. - «Slår du den av, får du regelbaserte forslag i stedet». Det stemmer ikke med FR-19. Med KI av får studenten ingen forslag, og reserveløsningen gjelder bare når KI er på, men utilgjengelig.
Fiks: Skriv en fastsatt tekst for «Hva sendes til KI» og «Lagring» i EXPERIENCE (se forslaget under), og noter beslutningen i memloggen. Fram til FR-42 er bygget skal det stå: «Skriv ikke navn, telefonnummer eller helseopplysninger – appen fjerner dem ikke automatisk.» Når FR-42 er bygget: «Appen prøver å bytte ut telefonnumre og e-post med plassholdere før sending, men kan ikke garantere at alt blir fanget.»

**[Personvern-tekst]** – Data for «Foreslå ny tid» og økter er ikke beskrevet, og forholdet til 🔒 og KI av er udefinert (§ EXPERIENCE Component Patterns «Kollisjonsmerke», KI-planlegging punkt 5)
(EXPERIENCE Component Patterns «Kollisjonsmerke», KI-planlegging punkt 5). Det står ikke hva som sendes når studenten trykker «Foreslå ny tid»: oppgavetekst, notater, frist, alle hendelser og andre økter? Det står heller ikke at knappen må skjules (1) når KI er av, (2) på økter til en oppgave med 🔒, og (3) for manuelle økter når KI er av. Ellers bryter en 🔒-oppgave FR-38 i det øyeblikket det oppstår en kollisjon.
Fiks: Legg til i Component Patterns: «*Foreslå ny tid* vises bare når KI er på og oppgaven ikke er merket 🔒. Ellers vises bare *Endre tid*. Til KI sendes det samme som ved øktforslag: oppgavetekst, notater (om tillatt), frist, hendelser i perioden (🔒-hendelser som «opptatt») og tidspunktene for andre godtatte økter som «opptatt».» Nevn «Foreslå ny tid» i samtykket og i erklæringen.

### Middels (26)

**[Flytdekning]** – F6 etter oppstart mangler flyt: endre KI-valg (FR-36), Eksporter/Importer (FR-43) og Slett alle data (FR-40)
Det er heller ikke sagt hva som skjer etter Slett alle data, for eksempel om appen går tilbake til Førstegangsoppsett.
Fiks: Lag én flyt for Personvern og data med bekreftelse og sluttilstand.

**[Flytdekning]** – Flyt 3 og Flyt 4 har ingen navngitt person og ingen klimaks (§ EXPERIENCE linje 200–210)
Flyt 3 beskriver ikke hva som skjer ved *Nei* eller *Hopp over*, for eksempel hvordan hilsenen ser ut uten navn (EXPERIENCE linje 200–210).
Fiks: Bruk Ida eller Sara, legg til klimaks, og legg til avvik for «Nei til KI» (ingen KI-boks, «+ Legg til økt») og «uten navn» (f.eks. «Hei 👋»).

**[Flytdekning]** – FR-13 (ny tekst gir nye forslag, mens de gamle verdiene beholdes) har ingen flyt eller tilstand
Flyt 4 nevner det bare i en bisetning.
Fiks: Legg til et avvikssteg i Flyt 4 der teksten endres, og vis hvordan gamle og nye forslag står i KI-boksen.

**[Flytdekning]** – Flyt 2 mangler avviksvei når KI er utilgjengelig ved «Foreslå ny tid», og når KI er av (EXPERIENCE linje 195) (§ EXPERIENCE linje 195)

Fiks: Legg til «Avvik: uten KI → knappen skjules, studenten flytter økta selv med Endre».

**[Tokenkomplett]** – Gløden og KI-boksen er ikke tokens (§ DESIGN linje 145, 224)
`ai-suggestion-box.background` er prosa («accent 35 % blandet …»), og gløden (radiell gradient, 75 %/30 %) finnes bare i prosa (DESIGN linje 145, 224).
Fiks: Legg inn `glow-strength: 0.75` / `glow-strength-dark: 0.30` og `ai-box-mix` / `ai-box-mix-dark` som tokens, eller skriv dem som `color-mix()`-uttrykk med tokenreferanser.

**[Tokenkomplett]** – Kontrast er ikke oppgitt for `warn` (5,11:1 på hvit og 4,76:1 på bakgrunnen, men bare 3,4:1 på gløden) eller for `text-muted` mot `surface-base` (4,51:1, rett over grensen og brukt i `tag`) (DESIGN Colors) (§ DESIGN Colors)

Fiks: Legg til begge i kontrollavsnittet, og si at `warn` aldri brukes i glødsonen.

**[Tokenkomplett]** – Fargene på kalenderprikkene på mobil er ikke definert: «fargede prikker eller streker» (§ DESIGN linje 246, 264)
Hva skiller oppgave, økt, hendelse og forfalt når etikettene ikke har egne farger og bare én pastell brukes (DESIGN linje 246, 264)?
Fiks: Gi en eksplisitt mapping, for eksempel oppgave = `accent-ink`, hendelse = `text-muted`, forfalt = `warn`, og økt = hul ring.

**[Komponentdekning]** – Disse har bare visuell spesifikasjon og ingen oppførselsrad: Bunnmeny/sidemeny, Prioritetsvelger, Bryter [Oppgave | Hendelse] (bare nevnt inne i Skjema-raden), Dialog/bekreftelse, Snackbar (oppførselen står i Interaction Primitives) og Skeleton

Fiks: Gi hver sin rad med regler (f.eks. Dialog: fokusfelle, Esc = Avbryt, standardfokus på Avbryt ved sletting).

**[Komponentdekning]** – Disse har bare oppførsel og ingen visuell rad: Sortering «⇅ Frist», «+ Legg til økt», Foreslåtte økter (som egen radtype), KI-påminnelse, Skrivefelt «+ Ny oppgave … skriv med egne ord» (nevnt i Layout og Shapes, men har ikke egen komponent), Prosjektliste, merket «regelbasert», og «✦»-prikken for ubesvarte forslag (EXPERIENCE linje 77–89, 102) (§ EXPERIENCE linje 77–89, 102)

Fiks: Legg til korte visuelle rader i DESIGN Components.

**[Komponentdekning]** – Det finnes ingen komponent i noen av filene for: Arkivrad (nedtelling, «…»-meny med Gjenopprett/Slett nå), Gruppeoverskrift med antall og sammenleggbar «Ingen frist (n)», Hendelsesdetalj, sidene i Førstegangsoppsett og lenken til Personvernerklæringen (FR-41 krever at den finnes på *alle* skjermer, men plasseringen er ikke tegnet)

Fiks: Legg dem til i begge filene. Lenken til Personvernerklæringen er viktigst, fordi FR-41 er et Må-krav.

**[Komponentdekning]** – Sortering: de andre sorteringsvalgene er ikke navngitt (FR-25), bare standardvalget (EXPERIENCE linje 77) (§ EXPERIENCE linje 77)

Fiks: List valgene, f.eks. Frist / Prioritet / Nyeste.

**[Tilstandsdekning]** – Oppgaver: tomt resultat når et filter er valgt (f.eks (§ EXPERIENCE linje 97–98)
ingen *Privat*) mangler. Det er heller ikke sagt om tomme grupper utenom «I dag» skjules, inkludert søndagsregelen i FR-22 (EXPERIENCE linje 97–98).
Fiks: Legg til tilstandene «Tomt filter» og «Tom gruppe».

**[Tilstandsdekning]** – Lagring i nettleseren feiler (privat modus, full kvote, blokkert lagring) mangler
NFR-4 gjør lagringen bærende.
Fiks: Legg til en saklig melding og at appen kan brukes uten lagring.

**[Tilstandsdekning]** – Skjema: det er ikke sagt hva som skjer med ulagrede endringer ved tilbakepil/Esc (forkaste eller spørre) (EXPERIENCE linje 82, 123) (§ EXPERIENCE linje 82, 123)

Fiks: Bestem dette, f.eks. «Forkaste endringene?» bare når noe er endret.

**[Tilstandsdekning]** – Import: det er ikke sagt om import *erstatter* eller *slår sammen* data, og det mangler både bekreftelse og suksessmelding (EXPERIENCE linje 114) (§ EXPERIENCE linje 114)

Fiks: Bestem regelen og legg til tilstanden «Import fullført».

**[Arvedisiplin]** –  (§ EXPERIENCE linje 163, 220)
Avvik som ikke er listet:** I KI-planlegging steg 2 sendes *frist* til KI, og trolig også godtatte økter ved «Foreslå ny tid». FR-15 sier «bare oppgavetekst og notater». Avvik #3 dekker bare hendelser (EXPERIENCE linje 163, 220).
Fiks: Utvid avvik #3 til «hendelser, frist og eksisterende økter», slik at PRD-oppdateringen, FR-35-teksten og personvernerklæringen tar det med.

**[Arvedisiplin]** –  (§ EXPERIENCE linje 85–86)
Uenighet med memlog:** Ifølge `.memlog.md` linje 63 skal påminnelsen etter FR-37 også stå i *hendelsesskjemaet*. Raden KI-påminnelse dekker bare oppgavetekst. Det er heller ikke sagt om påminnelsen gjelder for skrivefeltet på PC (FR-37 sier «skrivefeltet») (EXPERIENCE linje 85–86).
Fiks: Utvid raden med begge.

**[Arvedisiplin]** –  (§ EXPERIENCE linje 29, 154)
Uenighet med memlog:** Linje 49 sier at trykk på dag åpner «+ Ny oppgave» med frist ferdig utfylt. Linje 57 sier at trykk på dag viser dagslista. IA-raden «Ny / Endre nås fra … trykk på dag i Kalender» og Responsive («valgt dag åpner dagslista») sier hver sitt (EXPERIENCE linje 29, 154).
Fiks: Velg dagsliste + «+ Ny» (i tråd med linje 57), og rett IA-raden.

**[Personvern-tekst]** – Hendelsestitler sendes som standard, og det finnes ingen global innstilling (§ EXPERIENCE IA «Personvern og data», KI-planlegging)
(EXPERIENCE IA «Personvern og data», KI-planlegging). Art. 25 nr. 2 (personvern som standard) og motmålet i PRD-en peker mot minst mulig data. Gruppas valg om å sende titler godtas, men studenten bør ha en samlet bryter, slik FR-39 har for notater.
Fiks: Legg til i Personvern og data: «**Send hendelsestitler til KI** (på/av). Av: KI ser bare når du er opptatt, ikke hva du skal.» Vurder om standarden skal være *av*. Det er gruppas avveining.

**[Personvern-tekst]** – At fornavnet aldri sendes til KI, står bare i memloggen (§ `.memlog.md`: «Sendes aldri til KI», EXPERIENCE IA «Profil»)
(`.memlog.md`: «Sendes aldri til KI», EXPERIENCE IA «Profil»). Spinen sier ikke noe om det. Det må være en uttrykkelig regel for arkitekturen (ikke i prompt eller systemprompt, for eksempel for et personlig sammendrag) og stå i teksten til brukeren.
Fiks: I EXPERIENCE Profil: «Fornavnet lagres bare i nettleseren, brukes i hilsenen og sendes aldri til KI eller serveren.» Samme setning hører hjemme i Personvern og data og i erklæringen. Steg 1 i Flyt 3 kan få hjelpeteksten «Bare for hilsenen. Lagres på denne enheten.»

**[Personvern-tekst]** – Hvordan godtatte økter og 🔒-oppgaver brukes som «opptatt», er udefinert
(KI-planlegging punkt 2). Når en ny oppgave planlegges, må KI kjenne til økter som allerede er godtatt. Slike økter heter «Økt 1/3 – <oppgavetekst>», og det er uklart om teksten sendes med. For en 🔒-oppgave ville det bryte FR-38.
Fiks: «Andre godtatte økter sendes bare som opptatt-tid, uten oppgavetekst.»

**[Personvern-tekst]** – Omfanget av «Slett alle data» er ikke oppdatert, og den ærlige setningen om Anthropic mangler i UI-et (§ EXPERIENCE IA «Personvern og data», FR-40)
(EXPERIENCE IA «Personvern og data», FR-40). FR-40 sier «oppgaver og innstillinger». Nå finnes også hendelser, økter, fornavn, tema, prosjekter og samtykkevalg.
Fiks: Dialogtekst: «**Slette alle data?** Alle oppgaver, hendelser, økter, navnet ditt og innstillingene slettes fra denne nettleseren, og appen starter på nytt. Det kan ikke angres. Tekst som allerede er sendt til KI, kan ikke slettes herfra – Anthropic sletter den normalt innen 30 dager.» Knapper: *Avbryt* / *Slett alt* (varselfarge).

**[Personvern-tekst]** – Eksport og import mangler personverntekst og regler (§ EXPERIENCE IA, State Patterns «Import feiler»)
(EXPERIENCE IA, State Patterns «Import feiler»). Eksportfila inneholder fornavn og eventuelle helsetitler i klartekst. Det står ikke om import erstatter eller fletter data, og ikke om importerte oppgaver sendes til KI automatisk.
Fiks: Eksport: «Fila inneholder alt du har skrevet, også navnet ditt og hendelsene. Lagre den et trygt sted.» Import: «Importen erstatter alle data i appen. Fortsette?» Legg også til regelen at importerte oppgaver ikke sender noe til KI før studenten endrer teksten eller ber om forslag. Merk at FR-43 er *Bør*. Om den ikke bygges, må knappene fjernes fra spinen.

**[Personvern-tekst]** – Samtykket mangler tilbaketrekking, lenke og frivillighet (§ Flyt 3 steg 2–3)
(Flyt 3 steg 2–3). Teksten «Valget kan endres i Innstillinger» står bare i flyten, ikke i dialogen. Art. 7 nr. 3 krever at studenten får vite om retten til å trekke samtykket *før* hen samtykker.
Fiks: Ta det med i dialogteksten (se forslaget) sammen med «Les hele personvernerklæringen».

**[Personvern-tekst]** – Hvor mye som sendes, er ikke avgrenset (dataminimering)
(KI-planlegging punkt 2: «hendelser … i perioden fram til fristen»). Har en oppgave frist om fire måneder, sendes alle hendelser i fire måneder. FR-13 sender dem på nytt hver gang teksten endres.
Fiks: Begrens perioden, for eksempel til maks 14 dager fram, eller til fristen hvis den er tidligere. Skriv det i spinen og i erklæringen: «KI får bare hendelser for de nærmeste 14 dagene.» Selve tallet bestemmes i arkitekturen.

**[Personvern-tekst]** – Opplysninger om andre personer i hendelsestitler (§ Flyt 1–2)
(Flyt 1–2). Titler som «Middag med Ola» eller «Kjøre mamma til sykehus» er tredjepersons opplysninger, også helse. Samtykket fra studenten dekker ikke dem.
Fiks: Advarselen i samtykket og hendelsespåminnelsen bør si: «Unngå navn på andre og helseopplysninger – bruk 🔒 eller en nøytral tittel som «Avtale».»

### Lav (24)

**[Flytdekning]** – I Flyt 2 steg 5 «ser» Sara kollisjonen med legetimen *før* hun har lagt den inn (linje 194) (§ linje 194)

Fiks: Skriv om til at hun husker legetimen og legger den inn, og at merket så dukker opp.

**[Tokenkomplett]** – Komponent-tokens peker bare til lys-varianter (§ DESIGN linje 102–155)
Mørk modus må utledes av `-dark`-suffikset, og den regelen står ikke noe sted (DESIGN linje 102–155).
Fiks: Skriv én setning om at `{colors.x}` løses til `x-dark` i mørk modus når tokenet finnes.

**[Tokenkomplett]** – `typography.fontFamily` er en streng på rotnivå, mens spesifikasjonen forventer et objekt per rolle (§ DESIGN linje 48, 99, 107)
`task-card.padding: '10px 12px'` og `margin-desktop: 26px` ligger utenfor 4 px-skalaen (DESIGN linje 48, 99, 107).
Fiks: Flytt reservefontene inn i hver rolle (eller en `note`), og bruk 8/12 og 24 eller 28, eller begrunn avvikene.

**[Tokenkomplett]** – Skygge på dialoger, «svakere linje» på hendelsesraden og fokusringen (2 px) mangler tokens (DESIGN linje 226, 242, 249) (§ DESIGN linje 226, 242, 249)

Fiks: Legg til `dialog.shadow`, `border-subtle` og `focus-ring`.

**[Komponentdekning]** – Tema-velgeren i DESIGN dekker bare fargeprøvene
Kontrollen Lys/Mørk/«Følg systemet» fra EXPERIENCE linje 90 har ingen visuell form.
Fiks: Spesifiser den som segmentert pille, likt bryteren [Oppgave | Hendelse].

**[Tilstandsdekning]** – Oppgave med «🔒 Ikke send til KI» mangler i State Patterns
Den står bare i Component Patterns, og låseikonet på kortet står bare i DESIGN.
Fiks: Legg til en rad «Ikke send til KI» for Oppgavedetalj: ingen KI-boks, «+ Legg til økt» vises.

**[Tilstandsdekning]** – Hilsen uten fornavn (*Hopp over*) mangler

Fiks: «Hei 👋».

**[Visuell referansedekning]** – Lenkene til `mockups/color-themes.html`, `mockups/backgrounds-dark.html` og `mockups/desktop-layout.html` peker ikke til noe ennå (§ DESIGN linje 258, EXPERIENCE linje 48)
Det er forventet, fordi mockupene ikke er flyttet over. Men navnene stemmer ikke med `.working/`-filene (`color-themes-1`, `backgrounds-2-dark`, `desktop-layouts-1`), og ikke med mockup-planen i `.memlog.md` linje 82 (Oppgaver, Oppgavedetalj, Kalender, Skjema + oppstart) (DESIGN linje 258, EXPERIENCE linje 48).
Fiks: Bestem endelige filnavn når mockupene flyttes over, og lenk de planlagte mockupene inline i Kalender, KI-forslagsboks og State Patterns.

**[Visuell referansedekning]** – DESIGN lenker ikke skissen inline
Den står bare i frontmatter, og Colors omtaler «den første skissen» uten sti. `reconcile-skisse-design.md` er ikke lenket fra noen av spinene.
Fiks: Legg til lenke i Colors og ved IA.

**[Visuell referansedekning]** – Regelen om at spinene gjelder foran mockupene står i begge filene (DESIGN linje 258, EXPERIENCE linje 48) (§ DESIGN linje 258, EXPERIENCE linje 48)
Det er greit, men den skal ideelt stå én gang.
Fiks: Ingen handling nødvendig, eventuelt stryk den ene.

**[Overflødig og overspesifisert]** – Colors-prosaen og tematabellen gjentar alle hex-verdiene fra frontmatter (§ DESIGN linje 172–187)
Det er en risiko for at de glir fra hverandre ved senere endringer (DESIGN linje 172–187).
Fiks: Behold tabellen, men henvis til tokennavn i stedet for hex i punktlista.

**[Overflødig og overspesifisert]** – Tekster i Voice and Tone som «Sterkt! (§ EXPERIENCE linje 57, 59)
3 av 4 økter gjort 💪» og «Du har kontroll på uka!» har ingen flate eller utløser. `.memlog.md` linje 70 sier i tillegg «ingen egen fremdriftsstrek for økter». Dette er tekst uten en beslutning bak (EXPERIENCE linje 57, 59).
Fiks: Knytt dem til en tilstand (f.eks. snackbar når en økt hukes av), eller merk dem som eksempler på tonen.

**[Overflødig og overspesifisert]** – «Størrelsene er hentet fra forhåndsvisningene og godkjent av gruppa» er en prosessnotis (DESIGN linje 209) (§ DESIGN linje 209)

Fiks: Stryk den. Den hører hjemme i memlog.

**[Arvedisiplin]** – FR-18-merket er skrevet om fra «Forslag basert på nøkkelord – KI var ikke tilgjengelig» til «regelbasert» + «KI var ikke tilgjengelig (§ EXPERIENCE linje 61, 100)
Forslagene er basert på nøkkelord.», og det er ikke listet som avvik (EXPERIENCE linje 61, 100).
Fiks: Bruk PRD-teksten ordrett, eller list endringen.

**[Arvedisiplin]** – FR-38 «privat» heter nå «🔒 Ikke send til KI» (`.memlog.md` linje 75) (§ `.memlog.md` linje 75)
Navnebyttet står ikke i Avvik-tabellen, og avvik #4 dekker bare utvidelsen til hendelser.
Fiks: Nevn navnebyttet i #4, så begrepet blir oppdatert i PRD-en.

**[Arvedisiplin]** – Komponentnavnene er ikke helt like
Frontmatter bruker engelske nøkler (`task-card`, `check-ring`, `filter-chip`, `ai-suggestion-box`, `fab`, `bottom-nav`, `sidebar-item-active`) uten kobling til de norske prosanavnene. Disse navneparene er også ulike: «Søkefelt» / «Lupe / søkefelt», «Skjemafelt» / «Skjema Ny/Endre», «Flytende knapp» / «+ Ny oppgave» / «+ Ny».
Fiks: Gjør komponentnavnene like i begge filene, og legg til en kolonne med tokennøkkel.

**[Arvedisiplin]** – Punkt 4 og 5 i `reconcile-skisse-design.md` («Navn, telefon og e-post sendes aldri» og plassholderen for behandlingsansvarlig) er ikke avgjort i `.memlog.md`
Linje 80 avgjør bare punkt 1, 2, 3 og 6.
Fiks: Avgjør punktene og logg beslutningen. Punkt 4 bør avvises så lenge FR-42 bare er et Bør-krav.

**[Formtilpasning]** – DESIGN følger den kanoniske rekkefølgen
EXPERIENCE har alle påkrevde seksjoner, i tillegg til Responsive og Inspiration. De oppfunne seksjonene «KI-planlegging (økter)» og «Avvik fra PRD» fortjener plassen sin, men KI-planlegging overlapper med Component Patterns (Foreslåtte økter, Kollisjonsmerke).
Fiks: La KI-planlegging eie reglene (og livssyklusen, se 4), og la komponentradene bare henvise dit.

**[Formtilpasning]** – Layout sier ikke hva som gjelder for «+ Ny oppgave» mellom 768 og 1023 px: flytende knapp eller skrivefelt (DESIGN linje 217, EXPERIENCE linje 153) (§ DESIGN linje 217, EXPERIENCE linje 153)

Fiks: Legg til én setning.

**[Personvern-tekst]** – Låsikonet vises bare på oppgavekort (§ DESIGN Components «Bryteren»)
(DESIGN Components «Bryteren»). Hendelsesrader, kalenderceller og hendelsesdetalj viser ikke om hendelsen er 🔒.
Fiks: Bruk samme lille låsikon på hendelsesrad og hendelsesdetalj, med skjermlesertekst «Skjult for KI».

**[Personvern-tekst]** – «Helt tom app» sier at KI hjelper selv om studenten har sagt nei
(State Patterns: «… KI hjelper deg å sortere»).
Fiks: Bruk en variant uten KI: «Hei, Ida 👋 Skriv inn det første du må huske.»

**[Personvern-tekst]** – Påminnelsen er unøyaktig (§ Component Patterns «KI-påminnelse»)
(Component Patterns «KI-påminnelse»). «Teksten sendes til KI (Claude) for å lage forslag» nevner ikke notatene. Se fiks under høy-funnet om FR-37.

**[Personvern-tekst]** – Erklæringen bør nevne mer
(FR-41). Formålet er nå også *planlegging av økter*, ikke bare sortering. Ingen automatiske avgjørelser tas (studenten godtar alt, art. 22 er ikke relevant), reserveløsningen sender ingenting, aldersgrensen er 13 år (pol. § 5), og fornavn, tema og samtykkevalg lagres lokalt (ekomloven § 3-15, strengt nødvendig).
Fiks: Legg punktene inn i FR-41-lista.

**[Personvern-tekst]** – Dokumentasjon av samtykket
(research-gdpr-regelverk §2, [Usikkert]). Lagre samtykket lokalt med dato og versjon av teksten. Vis da samtykket på nytt hvis innholdet endres, for eksempel hvis titler kommer til senere.
Fiks: «Godkjent 9.11.2026 (tekst v2)» vises i Personvern og data.

## Gjennomgangsfiler
- `review-rubric.md`
- `review-personvern.md`

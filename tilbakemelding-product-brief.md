# Tilbakemelding på product brief

| | |
|---|---|
| **Gruppe** | G43 – G43-grafstrom-haugen-sivakumar |
| **Product brief** | `product-brief.md` (commit `bb0ce37`) |
| **Tilbakemelding fra** | Faglærer i IBE160 (utarbeidet med KI-støtte) |
| **Dato** | 2026-10-06 |

Vurdert fil: `product-brief.md` i repoets rot. `project-brief.md` er tom og er ikke vurdert. Den bør slettes eller fylles ut, slik at det er tydelig hvilken brief som gjelder. Repoet har ellers et nyopprettet Next.js-prosjekt, men ingen PRD, arkitektur eller epics ennå.

## Samlet vurdering

- **Godt utgangspunkt med justeringer.** Gruppen kan gå videre og innarbeide punktene under.

**Det som er bra:**

1. Kjerneopplevelsen er tydelig i fem steg: brukeren skriver en oppgave, appen analyserer teksten, KI foreslår etikett, prioritet og sammendrag, brukeren godtar eller endrer, og oppgaven havner i smarte lister. Eksempelet «Levere programmeringsoppgave fredag» viser godt hva dere mener.
2. Dere har et gjennomtenkt skille mellom regler og KI: regler for forfallsdato og faste kategorier, KI der teksten må tolkes. Sammenligningen med manuell tagging, nøkkelord og generell chatbot er ærlig og gjør verdien tydelig.

**De viktigste endringene:**

1. Gjør suksesskriteriene testbare i emnet. «Minst 30 prosent reduksjon i tiden» og «antall oppgaver opprettet per uke» krever målinger dere neppe rekker. «Minst 50 prosent av KI-forslagene beholdes» er bedre, men trenger et fast testsett. Lag for eksempel 20 oppgavetekster med forventet etikett og prioritet, og sett et mål for hvor mange KI-en skal treffe.
2. Avklar innloggingen. «Valgfri innlogging for synkronisering» står i MVP-listen, men deling og flere enheter er ellers utelatt. Innlogging gir mye ekstra arbeid. Bestem om den er nødvendig i v1, eller om lokal lagring holder til å begynne med.
3. Legg en plan for språkmodellen. Briefen sier ikke hvilken KI-tjeneste dere vil bruke, hvordan nøkkelen holdes utenfor koden, eller hva som skjer når KI ikke svarer. Sensor må kunne kjøre appen uten deres nøkkel, for eksempel med en testmodus eller en regelbasert reserveløsning.

## Vanskelighetsgrad og gjennomførbarhet

### Vurdert vanskelighetsgrad

- **Enkel**

**Sammenlignbart med:** 6) To-do-liste med smarte etiketter (enkel). Briefen dekker hele dette forslaget: etikett, prioritet, sammendrag og smarte lister.

**Begrunnelse:**

| Faktor | Nivå (lav / middels / høy) | Kommentar |
|---|---|---|
| Domenelogikk – hvor mange og hvor kompliserte regler og beregninger må stemme? | Lav | Regler for forfallsdato, tidsrom («denne uken») og filtrering/sortering. Oversiktlig. |
| Datamodell – antall entiteter og relasjoner mellom dem | Lav | Oppgave, prosjekt og etikett, eventuelt bruker. |
| Brukere, roller og innlogging | Lav til middels | Én rolle. Valgfri innlogging løfter dette til middels hvis den blir med i v1. |
| KI-funksjonalitet i appen, f.eks. kall til språkmodell, prompts i koden og håndtering av usikre svar | Middels | Tre forslag per oppgave på norsk, med strukturert svar og mulighet til å endre. Avgrenset, men krever gode prompts og feilhåndtering. |
| Integrasjoner og eksterne tjenester, f.eks. API-er, betaling og e-post | Lav | Bare språkmodell-API. Canvas og Teams er utelatt. |
| Sanntid, samtidighet eller flere brukere som påvirker hverandre | Lav | Ingen. |
| Filhåndtering, f.eks. opplasting, PDF-lesing og eksport | Lav | Ingen. |
| Sikkerhet og personvern | Lav til middels | Oppgavetekst sendes til KI. Dere skriver selv at brukeren skal vite hva som sendes. Personvernvalg og arkiveringsregler er ikke avklart ennå. |

**Hva vanskelighetsgraden betyr for dere:**

- _Enkel:_ Et enkelt prosjekt gir stor sjanse for å bli ferdig. Vanskelighetsgraden inngår likevel i vurderingen, så for å nå helt opp må dere vise mer i gjennomføringen. Det betyr særlig et gjennomarbeidet design, grundig testing, en tydelig dokumentert prosess og en README som virker.

### Gjennomførbarhet med BMAD og Claude Code

| Spørsmål | Vurdering (OK / risiko / stor risiko) | Kommentar |
|---|---|---|
| **Tid og omfang** – kan v1 realistisk bli ferdig og stabil i løpet av semesteret, med tid til flere iterasjoner? | OK | Ja. Omfanget er passe for en gruppe på tre, med rom for forbedringer. |
| **BMAD-flyten** – er briefen konkret nok til at PRD, arkitektur og stories kan lages uten store hull, og blir det overkommelig mange stories? | OK | MVP-listen og kjerneflyten kan nesten direkte bli krav og stories. Avklar innlogging og hvilke smarte lister som skal finnes. |
| **Egnet for Claude Code** – bruker løsningen en vanlig, godt dokumentert teknologistakk som Claude Code håndterer godt, eller krever den nisjeteknologi, spesialmaskinvare eller mye manuell konfigurasjon? | OK | Next.js med CRUD og ett API-kall er godt egnet. |
| **Kontroll på KI-ens arbeid** – kan gruppen selv avgjøre om koden gjør det riktige? Krever domenet kunnskap gruppen ikke har, f.eks. avanserte beregninger eller fagregler, så er det vanskelig å kvalitetssikre. | OK | Dere kan selv vurdere om en etikett eller prioritet er rimelig, særlig med et testsett med forventede svar. |
| **Testbarhet** – finnes det tydelige regler og forventede resultater som tester kan skrives mot? | Risiko | CRUD, filtrering og sortering er lett å teste. KI-forslagene trenger et fast testsett og mock-svar i automatiske tester. |
| **Kjørbar for sensor** – kan appen kjøres lokalt etter README, uten gruppens nøkler, betalte kontoer eller egen infrastruktur? | Risiko | Avhenger av plan for KI-nøkkel og eventuell innloggingstjeneste. Ikke beskrevet ennå. |
| **Avhengigheter og kostnader** – krever løsningen betalte API-er, f.eks. språkmodeller, og finnes det en plan for kostnad, testmodus eller mock-data? | Risiko | Krever språkmodell-API, uten plan for kostnad eller testmodus. |

**Konklusjon om gjennomførbarhet:**

- **Gjennomførbart som beskrevet.**

**Forslag til justering av omfang eller vanskelighetsgrad:**

1. Bygg uten innlogging først (lokal lagring eller enkel database), og legg innlogging til som et eget trinn hvis det blir tid.
2. Når kjerneflyten virker, vurder én utvidelse som gir mer å vise frem, for eksempel at KI-en lærer av brukerens korrigeringer (enkelt: bruk tidligere godkjente etiketter som eksempler i prompten), eller at en oppgave skrevet i fritekst gir forslag til forfallsdato.

## Hvorfor product brief er viktig for mappen

Product brief er utgangspunktet for PRD, arkitektur, stories og til slutt koden. Del 1 av mappen vurderes blant annet på om sensor kan følge en sporbar vei fra plan til ferdig app. Den vurderes også på om appen gjør det dere har beskrevet, om den er testet, om den er godt designet, og om den kan kjøres etter README. Et uklart, for stort eller for lite brief gjør alt dette vanskeligere senere. Det er mye enklere å rette nå enn sent i semesteret.

## 1. Gjennomgang av briefens deler

| Del av brief | Status | Kommentar |
|---|---|---|
| Executive Summary – er det klart hva appen er, og hvilket problem den løser? | OK | Klart: norsk, KI-assistert oppgaveapp for studenter med forslag til etikett, prioritet og sammendrag. |
| The Problem – er problemet konkret, med reelle situasjoner og brukere? | OK | Konkret, med eksempelet om gruppemøte onsdag, programmeringsoppgave fredag og eksamen uken etter. |
| The Solution – beskriver løsningen brukeropplevelsen, ikke bare teknologi? | Juster | Godt beskrevet, men eksempelet viser også «Type» og «Tidsrom», som ikke står i listen over forslag. Bestem hvilke felt KI-en faktisk skal foreslå. |
| What Makes This Different – er vurderingen ærlig og realistisk? | OK | Ærlig og godt strukturert sammenligning med fire alternativer. |
| Who This Serves – er primærbrukerne tydelige, og vet vi hva de trenger? | OK | Norske studenter med oppgaver på tvers av fag. Sekundærmålgruppen (små team) kan godt tas ut, siden deling er utelatt. |
| Success Criteria – kan kriteriene faktisk sjekkes eller testes? | Endre | Funksjonelle kriterier er gode, men måltallene (30 % tidsbesparelse, ukentlig bruk) kan ikke måles i emnet. Erstatt dem med et testsett med forventede svar. |
| Scope – er det klart hva som er med i første versjon, og hva som ikke er det? | Juster | Tydelig liste, men valgfri innlogging og uavklarte personvern- og arkiveringsregler bør avgjøres før PRD. |
| Vision – henger visjonen sammen med resten uten å blåse opp omfanget? | OK | Kalender, deling og Canvas er tydelig lagt etter v1. |

## 2. Utgangspunkt for del 1 av mappen

Punktene følger kriteriene i sensorveiledningen for del 1. Vektene i parentes viser hvor mye hvert kriterium teller i del 1.

| Kriterium i del 1 | Hva briefen bør legge til rette for | Status | Kommentar |
|---|---|---|---|
| **1. Prosess og KI-styring** (30 %) | Brief som er presis nok til at PRD og stories kan bygges direkte på den, slik at krav kan spores fra brief til kode. | Juster | Briefen er presis nok. Bruk BMAD videre (PRD, arkitektur, stories) før dere bygger mer på Next.js-prosjektet, og lagre promptene. |
| **2. Funksjonalitet og omfang** (20 %) | Realistisk omfang for gruppen og semesteret: en tydelig kjerneflyt som kan bli ferdig og stabil, og nok innhold til å vise reell funksjonalitet. | OK | Realistisk, med tydelig kjerneflyt og nok funksjoner til å vise. |
| **3. Kvalitetssikring og testing** (15 %) | Suksesskriterier og funksjoner som er konkrete nok til å bli testtilfeller. | Juster | Lag testsett for KI-forslagene og erstatt måltall som ikke kan måles. |
| **4. Design og brukeropplevelse** (10 %) | Tydelige brukere og brukssituasjoner som designet kan bygges rundt, gjerne med de viktigste skjermbildene eller flytene skissert. | OK | Kjerneflyten og smarte lister gir et godt designgrunnlag. Skisser gjerne hvordan forslagene vises og endres. |
| **5. Kodekvalitet og arkitektur** (10 %) | Teknologivalg som er begrunnet og ikke mer komplekse enn appen trenger. | Juster | Next.js er allerede valgt, men ikke begrunnet i briefen. Begrunn valget og lagringsløsningen i arkitekturdokumentet. |
| **6. README og kjørbarhet** (10 %) | Løsning som andre kan kjøre lokalt uten betalte kontoer, og uten tilgang til gruppens egne tjenester og nøkler. | Juster | Planlegg testmodus for KI, og unngå at innlogging krever en ekstern tjeneste sensor ikke har tilgang til. |
| **7. Ryddighet i repoet** (5 %) | En plan for hvor hemmeligheter, testdata og dokumentasjon skal ligge. | Juster | Fjern den tomme `project-brief.md`, legg planleggingsdokumenter i en egen mappe, og hold API-nøkkelen i `.env.local` utenfor Git. |

## 3. Neste steg for gruppen

1. Lag et testsett på rundt 20 oppgavetekster med forventet etikett og prioritet, og skriv om suksesskriteriene slik at de måles mot dette.
2. Bestem om innlogging skal være med i v1, og velg KI-tjeneste med plan for nøkkel, kostnad og testmodus.
3. Rydd bort `project-brief.md`, og lag PRD og arkitektur med BMAD før dere bygger videre på Next.js-prosjektet.

Oppdater product brief i repoet når dere har gjort endringene, slik at historikken viser hvordan planen utviklet seg. Det er en del av prosessen sensor ser etter.

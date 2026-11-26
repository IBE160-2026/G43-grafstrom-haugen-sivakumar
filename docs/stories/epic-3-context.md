# Epic 3 Context: Samtykke og kontroll over egne data

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Studenten bestemmer selv om KI skal brukes, og vet hva det betyr. Førstegangsoppsettet spør om fornavn og KI-valg med demo-advarsel og fastsatt samtykketekst. Personvern og data lar henne endre valget, se hva som sendes og slette alt. 🔒 holder en oppgave helt utenfor KI, og påminnelser viser hva som sendes mens hun skriver. Personvernerklæringen er alltid ett klikk unna. Epicen gjør ingen KI-kall, men lager de eneste stedene som avgjør om KI er på (`kiErPå`, `kanSendes`), og de bruker Epic 4 og 6. Fra nå sender appen til `/oppstart` når samtykket mangler. Appen er en demo bare for fiktive data, og en ny personvernvurdering må gjøres før ekte data brukes.

## Stories

- Story 3.1: Samtykke og fastsatte tekster i kjernen
- Story 3.2: Personvernerklæring ett klikk unna
- Story 3.3: Førstegangsoppsett med fornavn og KI-valg
- Story 3.4: Personvern og data
- Story 3.5: 🔒 på oppgaver og KI-påminnelser
- Story 3.6: Slett alle data
- Story 3.7 (Bør): Eksportere og importere data

## Requirements & Constraints

- KI er av til studenten svarer ja. *Nei, uten KI* og *Ja, bruk KI* er like store, står side om side, og ingen er forhåndsvalgt. Samtykket lagres med svar, tidspunkt og tekstversjon. En ny tekstversjon gjør KI av til hun har svart på nytt.
- KI-valget kan endres når som helst. Slår hun KI på etter et «Nei», vises samtykketeksten først. Slår hun KI av, lagres «nei», og det kommer ingen nye forslag.
- Demo-advarselen står før KI-valget i oppsettet og øverst i Personvern og data, også når KI er av.
- 🔒 på en oppgave betyr at ingenting fra den sendes: ingen forslag, ingen øktforslag og ingen «Foreslå ny tid». Godtatte økter kan likevel sendes som «opptatt». Låsikonet vises.
- Valget «Send aldri notater til KI» (standard av) og «Send hendelsestitler til KI» (standard på) lagres i `innstillinger`.
- «Slett alle data» sletter oppgaver, hendelser, økter, fornavn, prosjekter, innstillinger, tema og samtykke etter bekreftelse, og appen starter på førstegangsoppsettet.
- Personvernerklæringen er på norsk og sier: demo bare for test- eller fiktive data, og gruppen lagrer ingenting; Anthropic behandler i USA, sletter normalt innen 30 dager, men kan lagre flaggede forespørsler i inntil 2 år; hvilke data som sendes; at formålet også er planlegging av økter; ingen automatiske avgjørelser; reserveløsningen sender ingenting; aldersgrense 13 år; fornavn, tema og samtykke lagres bare lokalt; det som er sendt, kan ikke slettes fra appen. Den nevner **ikke** behandlingsansvarlig eller SCC.
- Eksport (Bør) gir hele dokumentet etter en advarsel. Import erstatter alt etter bekreftelse. Samtykket følger ikke med, og importerte oppgaver sender ingenting til KI før teksten endres.
- Alle tekster om personvern, samtykke, påminnelser, eksport, import og sletting brukes ordrett fra EXPERIENCE.md, saklig og uten emoji. WCAG 2.1 AA og trykkflater ≥ 44 px gjelder.

## Technical Decisions

- `kjerne/samtykke.ts` har `GJELDENDE_SAMTYKKEVERSJON`, `kiErPå(dokument)` (sann bare når svaret er «ja» og versjonen er gjeldende) og `kanSendes(oppgave, dokument)` (sjekker også 🔒). Disse to er de **eneste** stedene som avgjør om KI brukes. Butikken, `lib/ki/` og UI kaller dem og gjentar aldri logikken.
- Samtykke i skjemaet: `{ svar: "ja" | "nei", tidspunkt (ISO UTC), tekstversjon: number } | null`. Et nytt felt (for eksempel 🔒 eller de nye valgene i `innstillinger`, hvis de ikke finnes) krever endring i `kjerne/skjema.ts`, økning av `GJELDENDE_SKJEMAVERSJON` og en migrering med test.
- Fastsatte tekster ligger ordrett i `kjerne/tekster.ts` sammen med samtykkeversjonen. Komponenter skriver dem ikke selv. En test sammenligner tekstene med EXPERIENCE.md.
- Ruter: `/oppstart`, `/personvern`, `/personvernerklaering`. Rotlayouten sender til `/oppstart` når `samtykke` er `null` (første oppstart, etter «Slett alle data» og etter import), men ikke fra personvernerklæringen. Valget må vente til lagringen er lest (skjelett først).
- Bare `lib/storage/` rører localStorage. «Slett alle data» går gjennom adapteren og butikken.
- Import følger samme vei som lesing: rå JSON → `migrer(rå)` → valideres og migreres hele før noe endres. Ved suksess settes `samtykke` og alle `ventendeKall` til `null`, og ingen KI-kall startes. Ved `for-ny`/`ugyldig` endres ingenting.
- Tester: Vitest for `kiErPå`/`kanSendes` (ja, nei, `null`, gammel tekstversjon) og for tekstene. Playwright for Flyt 3 og Flyt 7 med axe-sjekk.

## UX & Interaction Patterns

- **Førstegangsoppsett** er helside med glød. Side 1: «Hei! Hva heter du?», hjelpeteksten «Bare for hilsenen. Lagres på denne enheten.», *Fortsett* og *Hopp over*. Side 2: demo-advarsel som nøytral infoboks (ikke varselfarge), samtykketeksten under, «Les hele personvernerklæringen» åpner erklæringen uten at oppsettet mistes. Etter svar havner hun på Oppgaver. Tomtilstanden er med eller uten «– KI hjelper deg å sortere.» etter svaret.
- **Personvern og data** i fast rekkefølge: Demo-advarsel → KI-forslag → Send aldri notater til KI → Send hendelsestitler til KI → Hva sendes til KI → Lagring → Eksporter / Importer → Slett alle data → Personvernerklæring. To kolonner med tilbakepil på PC, uten detaljpanel. Nås fra Innstillinger og fra sidemenyen på PC. KI-bryteren har samtykkestatus som undertekst, for eksempel «Godkjent 9.11.2026 (tekst v2)».
- **Brytere** (`privacy-switch`) har samme form i skjemaet og i Personvern og data. Låsikonet (`lock-icon`, `text-muted`) står på kort og detalj, med skjermlesertekst «Skjult for KI».
- **KI-påminnelse** (`ai-reminder`): én linje i `meta` under oppgaveteksten og under skrivefeltet på PC, bare når KI er på. «Teksten og notatene sendes til KI (Claude) for å lage forslag.», uten «og notatene» når notatvalget er på, og «Sendes ikke til KI.» ved 🔒. Under skrivefeltet (glødsonen) brukes `text-on-glow`.
- **Personvernlenken** «Personvernerklæring» står nederst på hver side på mobil og nederst i sidemenyen under «Personvern og data» på PC.
- **Dialoger** har fokusfelle, Esc = *Avbryt* og fokus tilbake etter lukking. «Slette alle data?» har *Avbryt* med standardfokus og *Slett alt* i varselfarge. Import: *Avbryt* / *Importer*, deretter «Importen er fullført.» eller «Fila kunne ikke leses. Ingen data er endret.»

## Cross-Story Dependencies

- 3.1 (spor C) avhenger av 1.2. 3.2 trenger 1.4 og 3.1; 3.3 → 3.4 → 3.5 (som også trenger 1.7) og 3.6 → 3.7.
- 3.6 gjenbruker og fullfører «Slett alle data» fra feilsiden i story 1.3. Samme handling skal virke begge steder.
- Bryteren «Send hendelsestitler til KI» vises først når story 5.3 er bygget, og hendelsespåminnelsene og «🔒 Skjul tittel for KI» hører til Epic 5. Tekstene står likevel ordrett i `kjerne/tekster.ts` nå. Eksporter/Importer vises først når 3.7 er bygget.
- Epic 4 (KI-forslag) og Epic 6 (økter) bruker `kiErPå`/`kanSendes` og notatvalget i utdraget til KI. Brukertesten i 4.9 måler om ≥ 4/5 forstår samtykket. Linjen om navn og telefonnummer i «Hva sendes til KI» byttes delvis ut av story 4.10.

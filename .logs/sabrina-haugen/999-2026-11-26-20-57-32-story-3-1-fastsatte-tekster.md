# Story 3.1 del 1: fastsatte tekster

## 2026-11-26 kl. 20:57 — Sabrina Haugen

### Oppgave
Finne ut hva spor C (KI) kan gjøre før grunnmuren er ferdig, og deretter bygge tekstdelen av story 3.1 med `bmad-build`: de fastsatte tekstene fra EXPERIENCE.md i kjernen, med test som oppdager avvik.

### Plan
- Hentet story 1.1 fra Abhira (`git pull`) og kjørte `npm install`. Da fantes zod og Vitest, men ikke dokumentskjemaet fra 1.2, så bare tekstdelen av 3.1 kunne bygges.
- Laget epic-konteksten `docs/stories/epic-3-context.md` og specen [spec-3-1-fastsatte-tekster-i-kjernen.md](../../docs/stories/spec-3-1-fastsatte-tekster-i-kjernen.md).
- Implementerte og gikk gjennom to runder med tre gjennomganger hver. Runde 1 fant at testen var for svak, så specen ble rettet og koden bygd på nytt. Runde 2 ga rettinger i testen og fire nye etiketter.

### Resultat
- `kjerne/tekster.ts`: `GJELDENDE_SAMTYKKEVERSJON = 1`, `LÅS_VALG`, `DEMO_ADVARSEL`, `SAMTYKKETEKST`, `KI_PÅMINNELSER`, `oppgavePåminnelse`, `PERSONVERN_VALG`, `HVA_SENDES_TIL_KI`, `LAGRING`, `EKSPORT_ADVARSEL`, `IMPORT_DIALOG` og `SLETT_ALLE_DATA_DIALOG`. Hver tekst står bare én gang.
- `tests/kjerne/tekster.test.ts` (25 tester) feiler ved endret, avkortet, flyttet eller ombyttet tekst og navngir stien. En SHA-256-hash binder samtykketeksten til versjonen.
- `passWithNoTests` er fjernet fra `vitest.config.mts` og `test:e2e`. Det løser et utsatt punkt fra 1.1.
- `npm test`, `npm run lint` og `npm run typecheck` er grønne. `npm run test:e2e` kunne ikke kjøres, fordi Playwright-nettleserne ikke er installert på maskinen.
- Commit `3dd8e21`. Specen er `done`. Story 3.1 står som `in-progress` i sprint-status, fordi `samtykke.ts` gjenstår. Begge utsatte punkter står i `docs/stories/deferred-work.md`.
- Senere samme kveld ble spor C kontrollert mot epics.md, PRD og EXPERIENCE.md. Tekstdelen oppfyller kravene om ordrette tekster og test mot EXPERIENCE.md, og samtykketeksten dekker alle punktene i FR-35, FR-65 og FR-42. Endringene berører ingen filer i spor A eller B.
- Sabrina ba om å fullføre 3.1. Story 1.2 står fortsatt som `backlog` på `origin/main`, og arbeidsmetoden i epics.md sier at en story bare kan startes når storyene den avhenger av, er ferdige. Derfor ble alternativ 1 valgt: del 2 (`kjerne/samtykke.ts`) venter på 1.2.
- Kontrollert på nytt: `npm test` (25/25), `npm run lint` og `npm run typecheck` er grønne.
- Sprint-status har nå en kommentar på 3.1 om at del 1 er klar til gjennomgang og at del 2 venter på 1.2. Specen har fått en sjekkliste for Stines gjennomgang (seksjonen «Til kodegjennomgang (Stine)»).
- Ikke committet eller pushet ennå. Venter på Sabrinas godkjenning.

### Åpne punkter
- Bygg `kjerne/samtykke.ts` (`kiErPå`, `kanSendes`) når story 1.2 er ferdig. Da er story 3.1 fullført. Spør Abhira når 1.2 er klar.
- Stine går gjennom story 3.1 del 1 med `bmad-code-review` eller `bmad-walkthrough`, etter sjekklisten i specen.
- Si fra til Lena at commiten endrer én linje i `package.json` og én i `vitest.config.mts`, som hun går gjennom i story 1.1.
- Kjør `npx playwright install chromium` og deretter `npm run test:e2e`, for å bekrefte at e2e går uten `--pass-with-no-tests`.
- Tekstsjekken oppdager ikke en ny «…»-tekst lagt til i KI-påminnelser, Innhold i Personvern og data eller dialoglinjene i EXPERIENCE.md (utsatt).

## 2026-11-28 kl. 13:11 — Sabrina Haugen

### Oppgave
Fullføre story 3.1 med del 2, `kjerne/samtykke.ts` med `kiErPå` og `kanSendes`, slik at Lena kan starte story 3.3. Først skulle det sjekkes at Abhiras story 1.2 er ferdig og at avhengighetene er på plass.

### Plan
- Sjekket at 1.2 er `done` (godkjent av Lena 2026-11-27, commit `27682eb`), og at `Dokument`, `Oppgave.skjultForKi`, `samtykke` og `GJELDENDE_SAMTYKKEVERSJON` finnes. Ingen skjemaendring eller migrering trengs.
- `bmad-build`: specen [spec-3-1-samtykke-i-kjernen.md](../../docs/stories/spec-3-1-samtykke-i-kjernen.md), godkjent av Sabrina med tre beslutninger: versjonen blir i `tekster.ts` og eksporteres videre, parameterne er smale (`Pick`), og `kanSendes` sjekker bare samtykke og 🔒.
- Implementering, så gjennomgang med tre lag (blind, kanttilfeller, verifiseringshull), så `bmad-walkthrough` med Sabrina, som godkjente.

### Resultat
- `kjerne/samtykke.ts`: `kiErPå` er sann bare ved «ja» og akkurat gjeldende tekstversjon (`===`). `kanSendes` er `kiErPå(dokument) && !oppgave.skjultForKi`. `GJELDENDE_SAMTYKKEVERSJON` eksporteres videre fra `tekster.ts`.
- `tests/kjerne/samtykke.test.ts`: 14 tester, som dekker alle 8 radene i specens tabell.
- Gjennomgangen ga 13 funn: 2 rettet (doc-kommentar, merknad i `deferred-work.md`), 1 utsatt (automatisk sjekk av AD-12), 10 avvist. Begrunnelsene står i specens Review Triage Log.
- `npm test` 375/375, `npm run lint` og `npm run typecheck` er grønne. Ingen e2e kjørt, fordi endringen ikke berører UI.
- Commit `0c99473`. Specen er `done`, og story 3.1 står som `review` i sprint-status. Story 3.3 og `product-brief.md` er ikke endret. Ikke pushet.
- Lukket punktene om å bygge `samtykke.ts`, Stines gjennomgang av del 1 og e2e uten `--pass-with-no-tests`. De to siste ble løst av Stine 2026-11-27 (111 grønne e2e).

### Åpne punkter
- Story 3.1 del 2 trenger gjennomgang av en annen i gruppa før den settes til `done`.
- Si fra til Lena at `kiErPå` finnes i `@/kjerne/samtykke`, så 3.3 kan starte. Linjen for 3.3 i sprint-status sier fortsatt «venter på kiErPå», og den oppdaterer hun selv.
- Automatisk sjekk av at bare `kjerne/samtykke.ts` sammenligner `samtykke.svar` og `tekstversjon` (AD-12), utsatt i `deferred-work.md`.

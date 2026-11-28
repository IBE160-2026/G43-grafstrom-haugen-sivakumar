# Story 3.2: personvernerklæring

## 2026-11-28 kl. 11:59 — Lena Grafstrøm

### Oppgave
Bygge story 3.2 «Personvernerklæring ett klikk unna» (spor B): siden `/personvernerklaering` med erklæringen etter FR-41, og lenken «Personvernerklæring» på alle sider.

### Plan
- `bmad-build`, spec: [spec-3-2-personvernerklaering-ett-klikk-unna.md](../../docs/stories/spec-3-2-personvernerklaering-ett-klikk-unna.md), kontekst i `docs/stories/epic-3-context.md`.
- Lena valgte at ordlyden skrives i siden etter FR-41 og gjenbruker de fastsatte tekstene i `kjerne/tekster.ts` (ikke ny fast tekst i EXPERIENCE.md), og at specen beholdes samlet (~1750 tokens).
- Lenken i `components/ramme.tsx`: under Innstillinger i sidemenyen på PC, og sist i `<main>` med `mt-auto` på mobil, så den aldri står på gløden.
- Gjennomgang med tre agenter (blind, grensetilfeller, verifiseringshull).

### Resultat
- Ny side `app/personvernerklaering/page.tsx` med seks deler (demo, hva appen lagrer, når KI er på, hvem får det og hvor lenge, du bestemmer, aldersgrense). Bruker `DEMO_ADVARSEL`, `HVA_SENDES_TIL_KI`, `LAGRING` og `SAMTYKKETEKST.hvemFårDet`/`hvorLenge`.
- `components/ramme.tsx`: `PersonvernLenke` (`privacy-link`), glødkolonnen fikk `min-h-dvh`, og `<main>` ble en flex-kolonne.
- Tester: ny `tests/e2e/personvernerklaering.spec.ts` (lenke på alle ruter, plassering på mobil og PC, trykkflate, `aria-current`, innhold mot FR-41, feilsiden), og `/personvernerklaering` lagt til i rute-løkka med axe i `tests/e2e/ramme.spec.ts`.
- Gjennomgang: 20 funn i specens Review Triage Log; 5 rettet (bruker `LAGRING`, formålet tar med ny tid ved kollisjon, skarpere tekstsjekker, testen for at lenken står sist), 4 utsatt i `docs/stories/deferred-work.md`, resten avvist.
- Verifisert: lint, typecheck og build uten feil; `npx playwright test --workers=1` 150 bestått, 16 hoppet over med vilje; `npm test` 346/347 (kjent CRLF-feil i `tekster.test.ts`). Vitest kjører nå på denne maskinen.
- Commit `3c8f1b5`. Story 3.2 står på `review` i sprint-status.
- Pushet til GitHub (`8e8f915..630bb37`): story 3.2, loggen og logglinja fra gjennomgangen av 1.5.
- Måtte stoppe dev-serveren fra tidligere i økta fordi Playwright starter sin egen.

### Åpne punkter
- Les gjennom ordlyden i erklæringen, særlig tekst som går utover FR-41 (listet i specens Implementation Notes).
- Abhira går gjennom story 3.2 før den settes til `done`.
- I story 3.3: omdirigeringen til `/oppstart` må unnta `/personvernerklaering` (se `deferred-work.md`).

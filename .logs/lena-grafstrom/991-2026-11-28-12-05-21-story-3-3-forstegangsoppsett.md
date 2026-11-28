# Story 3.3: førstegangsoppsett

## 2026-11-28 kl. 12:05 — Lena Grafstrøm

### Oppgave
Starte story 3.3 «Førstegangsoppsett med fornavn og KI-valg» (spor B): `/oppstart` med fornavn og KI-valg, lagring av samtykket og omdirigering når `samtykke` er `null`.

### Plan
- `bmad-build`, planleggingssteget. Spec-utkast: [spec-3-3-forstegangsoppsett-med-fornavn-og-ki-valg.md](../../docs/stories/spec-3-3-forstegangsoppsett-med-fornavn-og-ki-valg.md).
- Funn i undersøkelsen: omdirigeringen sender alle eksisterende e2e-tester til `/oppstart`, så alle trenger et besvart samtykke som standard. Tomteksten og kravet om ny tekstversjon trenger `kiErPå`, som hører til 3.1 del 2 (Sabrina) og ikke finnes.

### Resultat
- Lenas beslutninger, skrevet inn i specen: vent på at Sabrina lager `kiErPå` i `kjerne/samtykke.ts` (3.1 del 2); ny tekstversjon gir ingen omdirigering, bare KI av til hun slår den på igjen i Personvern og data (3.4); specen beholdes samlet (~1900 tokens).
- Specen står som `draft` og er ikke godkjent eller implementert. Sprint-status har en kommentar om at 3.3 venter. Commit `a7b4f87`.

### Åpne punkter
- Si fra til Sabrina at 3.3 venter på `kiErPå` i `kjerne/samtykke.ts` (3.1 del 2).
- Når `kiErPå` finnes: kjør `bmad-build` på spec-utkastet for 3.3 og godkjenn det før implementering.

## 2026-11-28 kl. 13:41 — Lena Grafstrøm

### Oppgave
Bygge 3.3 nå som Sabrina har pushet `kiErPå` i `kjerne/samtykke.ts` (3.1 del 2).

### Plan
- `bmad-build` fra spec-utkastet: la inn `kjerne/samtykke.ts` i Code Map, flyttet baseline til `1481f2b`, Lena godkjente specen.
- Implementert direkte; tre gjennomgangsagenter (blind, grensetilfeller, verifiseringshull) etterpå.

### Resultat
- `/oppstart` (`app/oppstart/page.tsx`, `components/oppstart.tsx`): steg 1 fornavn, steg 2 demo-advarsel og samtykketeksten ordrett med like store Ja/Nei; egen sidetittel per steg; `?steg=2` overlever turen til erklæringen.
- `lib/store/index.ts`: `settSamtykke(svar)`; gjelder i økta også med sperret skriving, ellers ville studenten blitt stående fast i oppsettet.
- `components/app-tilstand.tsx`: omdirigering til `/oppstart` uten svar (unntatt erklæringen) og bort fra `/oppstart` med svar, skjelett til den er ferdig, oppsettet uten ramme. `lib/ruter.ts` (ny) deler rutene.
- `components/oppgaveliste.tsx`: tomteksten følger `kiErPå`.
- Tester: ny `tests/e2e/fikstur.ts` gir alle e2e-tester et besvart KI-valg («nei») som standard (av med `test.use({ medSamtykke: false })`), og alle spec-filer importerer `test`/`expect` derfra. Ny `tests/e2e/oppstart.spec.ts` (Flyt 3 med ja og nei, hele matrisen, axe, ingen meny før omdirigeringen). Vitest for `settSamtykke`.
- Gjennomgang: 18 funn; 9 rettet, 1 utsatt (fra erklæringen via menyen havner hun på steg 1), resten avvist i specens Review Triage Log.
- Verifisert: lint, typecheck og build uten feil; `npm test` 378/379 (kjent CRLF-feil); `npx playwright test --workers=1` 184 bestått, 16 hoppet over med vilje. Skjermbilder av begge steg sett på mobil.
- Commit `54bf29d` (ikke pushet). Story 3.3 står på `review`. Løser punktene om å vente på `kiErPå` og om unntaket for erklæringen.

### Åpne punkter
- Si fra til gruppa: nye e2e-tester må importere `test`/`expect` fra `tests/e2e/fikstur.ts`, ellers sendes de til `/oppstart`. Dokumenter de lager selv trenger `besvart(…)`.
- Abhira går gjennom story 3.3 før den settes til `done`.

# Story 5.1: Planleggingscaser i KI-testsettet

## 2026-11-27 kl. 20:06 — Stine Olsen

### Oppgave
Implementere story 5.1 etter spesifikasjonen `docs/stories/spec-5-1-planleggingscaser-i-ki-testsettet.md`: faste planleggingscaser og to mock-svar med økter i KI-testsettet, slik at suksesskriteriet for øktforslag kan måles i Epic 6.

### Plan
- Spesifikasjon: [spec-5-1-planleggingscaser-i-ki-testsettet.md](../../docs/stories/spec-5-1-planleggingscaser-i-ki-testsettet.md), kontekst i `docs/stories/epic-5-context.md`.
- Lage 6 caser i uka 2026-11-02–08 etter I/O-matrisen, to mock-svar, en Vitest-test for form og dekning og en ny README-del.
- Kontrollere mock-svarene for hånd mot FR-49 og skrive kontrollen i README.

### Resultat
- Ny `tests/ki-testsett/planleggingscaser.json`: 6 caser (vanlig uke, nattevakt, 🔒 Legetime, titler av, frist i morgen, frist i dag) og toppnivå `forventet`.
- Nye `tests/ki-testsett/mock/okter-gyldig.json` (case 1, 3 gyldige økter) og `mock/okter-bryter-fr49.json` (case 2, onsdag 09:00–11:00 bryter 8-timersregelen etter nattevakt).
- Ny `tests/ki-testsett/planleggingscaser.test.ts` (23 tester): format via `hendelseSkjema.pick`, `øktForslagSkjema.omit({ id })`, unike id-er, frist ≥ dagen for «nå», alle datoer i uka, dekning av slutt før start / 🔒 / titler av, og at mockene peker på en case som finnes. Ingen FR-49-sjekk i kode.
- `tests/ki-testsett/README.md`: ny del «Planleggingscaser» med format, FR-49, forventet resultat, tabell over casene med eksempel på gyldig økt, og håndkontroll av mockene.
- Verifisert: `npx vitest run` 252/252 grønne, `npx tsc --noEmit` og `npx eslint tests/ki-testsett` uten feil. Ukommittert.

### Åpne punkter
- Gruppa går gjennom de forventede svarene i planleggingscasene og mock-svarene sammen.
- Mock-formen (`svar.felt` med rene verdier, `økter` uten `id`) låses i story 4.1; avviker den, justeres de to mock-filene.

---
title: 'Story 2.7 (Bør): Prosjekter i Innstillinger'
type: 'feature'
created: '2026-11-28'
status: 'done'
baseline_commit: '3283a15c5eb733dcd36583611eccd91c25303d73'
route: 'oneshot'
story_key: '2-7-bør-prosjekter-i-innstillinger'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Prosjektnavn er fritekst på oppgavene, og gamle navn blir liggende. Studenten kan ikke se hvilke navn hun har brukt eller rydde bort et navn hun ikke vil ha (FR-61).

**Approach:** En ny seksjon «Prosjekter» i Innstillinger mellom Utseende og Om appen (rekkefølgen i EXPERIENCE.md). Den viser alle prosjektnavn som er brukt på oppgaver, også fullførte, regnet ut av en ren funksjon i `kjerne/prosjekter.ts` hver gang og aldri lagret (AD-1, AD-4): unike navn, sortert alfabetisk på norsk (æ, ø, å sist), uten Skole, Jobb og Privat (de er faste etiketter). Hver rad (`project-list-row`) har navnet i `body` og en søppelbøtte til høyre (trykkflate ≥ 44 px, tilgjengelig navn «Slett IBE160»). Søppelbøtta åpner en modal dialog (samme mønster som «Slette alle data?» i `components/feilside.tsx`: fokus på *Avbryt*, Esc lukker) med tittelen «Er du sikker?», teksten «Prosjektet «IBE160» fjernes fra 3 oppgaver. Oppgavene beholdes.» (entall «1 oppgave») og knappene *Avbryt* og *Slett* (`button-danger`). *Slett* kaller `slettProsjekt(navn)` i butikken, som setter `prosjekt` til `null` på alle oppgaver med akkurat det navnet og lager nye objekter. Uten prosjekter står «Prosjekter dukker opp her når du skriver dem på en oppgave.». Tester: Vitest for kjernefunksjonen (unike, sortering med æøå, faste etiketter utelatt, fullførte med) og `slettProsjekt`; Playwright for lista, tomteksten, dialogen (Avbryt endrer ingenting, Slett fjerner navnet fra oppgavene og lista) og axe med åpen dialog.

</frozen-after-approval>

## Implementation Notes

- `kjerne/prosjekter.ts` (ny): `prosjektnavn(oppgaver)` og `antallMedProsjekt(oppgaver, navn)`. Sorterer med `Intl.Collator("nb")` med fast språk, så resultatet ikke avhenger av nettleseren. Navn sammenlignes nøyaktig (store og små bokstaver skilles), siden `slettProsjekt` også gjør det.
- `lib/store/index.ts`: `slettProsjekt(navn)` setter `prosjekt: null` på treffene og lager nye objekter bare for dem; ukjent navn gir ingen skriving.
- `components/innstillinger.tsx`: seksjonen «Prosjekter» med `Prosjekter`; dialogen bruker `<dialog>` og `showModal` som feilsiden, åpnes i en effekt når `valgt` settes, og `onClose` nullstiller (også ved Esc). Knappestilene er kopiert fra `components/feilside.tsx` (to små konstanter). `components/ikoner.tsx`: `SøppelbøtteIkon`.
- `tests/e2e/innstillinger.spec.ts`: rekkefølgetesten teller nå `main section > h2` (dialogens `<h2>` ligger også i `main`) og har fire seksjoner.
- Etter gjennomgangen: `slettProsjekt` nekter selv å slette Skole, Jobb og Privat (`erFastEtikett` i kjernen). Fokus flyttes til naboens søppelbøtte, eller til lista når den blir tom, etter sletting. Bare når noe faktisk ble slettet.
- Verifisert: lint, typecheck og build uten feil; `npm test` 360/361 (kjent CRLF-feil i `tekster.test.ts`); `npx playwright test --workers=1` 160 bestått, 16 hoppet over med vilje. Sett på skjermbilder av lista (mobil) og dialogen (PC).

## Review Triage Log

| # | Funn | Verdikt | Evidens / rute |
|---|---|---|---|
| 1 | `slettProsjekt` beskytter ikke Skole, Jobb og Privat | low | AK sier «kan ikke slettes»; bare UI skjulte dem → patch (`erFastEtikett` i butikken, Vitest) |
| 2 | Et fritekstprosjekt som heter «Skole» kan ikke ryddes bort | false | AK i epics.md sier at Skole, Jobb og Privat ikke vises og ikke kan slettes |
| 3 | Ingen test for at `slettProsjekt` ikke gjør noe før innlasting eller med sperret skriving | low | Direkte retting → patch |
| 4 | *Slett* gir ingen tilbakemelding med sperret skriving | low | Lagringsbanneret forklarer, som for de andre kommandoene → avvist |
| 5 | Fokus går tapt etter sletting | medium | Raden med søppelbøtta forsvinner → patch (fokus til nabo eller lista, e2e) |
| 6 | Dialog og knappestiler er kopiert fra feilsiden | low | Story 2.4 trenger en tredje bekreftelsesdialog → defer (felles komponent) |
| 7 | Søppelbøtta har bare hover-tilstand | low | Global `:focus-visible` gjelder; kosmetisk → avvist |
| 8 | axe kjøres ikke på lista uten dialog | low | Direkte retting → patch |
| 9 | Status henger etter | false | Settes til `review` når storyen leveres |
| 10 | CRLF-feilen er ikke sporet | false | Står i Abhiras `issues.md` siden 1.2 |

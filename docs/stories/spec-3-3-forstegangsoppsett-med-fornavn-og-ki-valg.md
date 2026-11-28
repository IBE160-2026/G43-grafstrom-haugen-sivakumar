---
title: 'Story 3.3: Førstegangsoppsett med fornavn og KI-valg'
type: 'feature'
created: '2026-11-28'
status: 'draft'
baseline_commit: '9bd29cd806278c965002ede570cb4e4b8ef899a7'
route: 'dispatch'
story_key: '3-3-førstegangsoppsett-med-fornavn-og-ki-valg'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-3-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen spør aldri om KI-valget. `samtykke` er alltid `null`, så studenten vet ikke hva hun sier ja eller nei til, og senere stories har ikke noe svar å bygge på.

**Approach:** Et førstegangsoppsett på `/oppstart` i to steg: fornavn, deretter KI-valg med demo-advarselen og samtykketeksten ordrett. Svaret lagres i `samtykke`, og appen sender til `/oppstart` så lenge `samtykke` er `null`, unntatt fra personvernerklæringen.

## Boundaries & Constraints

**Always:** AD-15: omdirigeringen skjer i klienten etter at lagringen er lest (skjelett til da, ingen blink av andre sider). `/oppstart` er helside med glød uten menyer (`onboarding-page`), ett spørsmål per steg, knappene nederst. Steg 1: `<h1>` «Hei! Hva heter du?», fornavnfelt, hjelpeteksten «Bare for hilsenen. Lagres på denne enheten.», *Fortsett* (primær) og *Hopp over*. Steg 2: `DEMO_ADVARSEL` som nøytral infoboks (ikke `warn`), `SAMTYKKETEKST` ordrett fra `kjerne/tekster.ts`, «Les hele personvernerklæringen» til `/personvernerklaering`, og *Nei, uten KI* / *Ja, bruk KI* like store side om side, ingen forhåndsvalgt. Svar lagrer `{ svar, tidspunkt: nå som ISO UTC, tekstversjon: GJELDENDE_SAMTYKKEVERSJON }` via en butikkommando som lager nye objekter, og sender til `/`. Kommer hun tilbake fra erklæringen, står hun på steg 2 med fornavnet lagret. Tomtilstanden på Oppgaver: «Skriv inn det første du må huske – KI hjelper deg å sortere.» når KI er på, ellers uten « – KI hjelper deg å sortere». Om KI er på avgjøres bare av `kiErPå` (epic 3-konteksten). WCAG 2.1 AA, trykkflater ≥ 44 px, du-form.

**Beslutninger (Lena, 2026-11-28):**
- `kiErPå` lages av Sabrina i 3.1 del 2 (`kjerne/samtykke.ts`). 3.3 starter ikke implementeringen før den finnes, og importerer den derfra.
- Ny tekstversjon gir ingen omdirigering (AD-15 gjelder bare `samtykke: null`). Har hun svart «ja» på en eldre versjon, er KI av til hun slår den på igjen i Personvern og data (3.4).
- Specen beholdes samlet (~1900 tokens), fordi tilpasningen av e2e-testene må med omdirigeringen.

**Never:** Ingen KI-kall. Ingen Personvern og data-side eller samtykkestatus (3.4). Ingen nye felt i dokumentet (skjemaet har `samtykke` og `profil` fra 1.2). Ikke endre tekstene i `kjerne/tekster.ts`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Første oppstart | Tomt lager, åpner `/arkiv` | Sendes til `/oppstart`, steg 1 | N/A |
| Erklæringen | `samtykke: null`, åpner `/personvernerklaering` | Erklæringen vises, ingen omdirigering | N/A |
| Fortsett | «  Ida  » + *Fortsett* | `profil.fornavn` «Ida», steg 2 | N/A |
| Hopp over | *Hopp over* | `profil` uendret (`null`), steg 2 | N/A |
| Ja | *Ja, bruk KI* | `samtykke.svar` «ja», gjeldende versjon; Oppgaver med «Hei, Ida 👋» og KI-varianten av tomteksten | N/A |
| Nei | *Nei, uten KI* | `svar` «nei»; tomteksten uten KI-delen | N/A |
| Tilbake fra erklæringen | Steg 2 → lenken → tilbake | Steg 2 igjen, fornavnet er der | N/A |
| Allerede svart | `samtykke` satt, åpner `/oppstart` | Sendes til `/` | N/A |
| Lagring feiler | `lagringFeilet` | Svaret gjelder i økta, banneret forklarer | Som 1.3 |

</frozen-after-approval>

## Code Map

- `components/app-tilstand.tsx` -- viser skjelett / feilside / `Ramme`. Her legges omdirigeringen (etter `status === "klar"` og `nå`), og `/oppstart` vises uten `Ramme`.
- `components/ramme.tsx` -- `PERSONVERNERKLÆRING`-ruta er privat her; flytt/eksporter én konstant så vakta og lenken deler den.
- `lib/store/index.ts` -- `redigerbart()`, `settFornavn` (trimmer, tomt → `null`); legg til `settSamtykke(svar)` på samme måte, med `nå` fra butikken (aldri `new Date()` i kjernen).
- `kjerne/skjema.ts` -- `samtykkeSkjema` (`svar`, `tidspunkt`, `tekstversjon`); `nyttDokument()` har `samtykke: null`.
- `kjerne/tekster.ts` -- `GJELDENDE_SAMTYKKEVERSJON`, `DEMO_ADVARSEL`, `SAMTYKKETEKST` (`duBestemmer.deler` med `{ uthevet }`, `lenke`, `knapper.nei`/`ja`). Ikke endre.
- `components/innstillinger.tsx` -- fornavnfelt, hjelpetekst og primærknapp (`rounded-full bg-accent text-text-on-pastel`) å gjenbruke.
- `components/oppgaveliste.tsx` -- tomteksten (linje ~27); `components/hilsen.tsx` -- hilsenen.
- `tests/e2e/*.spec.ts` -- alle starter i dag med `samtykke: null` og vil bli sendt til `/oppstart`. Gi alle tester et besvart samtykke som standard (for eksempel `storageState` eller felles hjelper), og legg `samtykke` inn der testene lager egne dokumenter (`oppgaveliste.spec.ts` `start`, `lagring.spec.ts`).
- `docs/ux-designs/…/mockups/key-skjema-oppstart.html` -- oppsett og stegprikker; tekstene der er utdaterte, bruk `kjerne/tekster.ts`.

## Tasks & Acceptance

**Execution:**
- [ ] `lib/store/index.ts` -- `settSamtykke(svar: "ja" | "nei")` -- lagrer svaret
- [ ] `tests/store/…` -- Vitest for `settSamtykke` (tidspunkt fra `nå`, versjon, nytt objekt); `kiErPå` testes i 3.1 del 2
- [ ] `components/app-tilstand.tsx` -- omdirigering og `/oppstart` uten ramme
- [ ] `app/oppstart/page.tsx` + `components/oppstart.tsx` -- de to stegene; steget i søkeparameter (`?steg=2`) så det overlever turen til erklæringen
- [ ] `components/oppgaveliste.tsx` -- tomteksten etter `kiErPå`
- [ ] `tests/e2e/` -- standard samtykke for eksisterende tester; ny `oppstart.spec.ts` for matrisen og Flyt 3 (ja og nei) med axe på begge steg

**Acceptance Criteria:**
- Given steg 2, when knappene måles, then er de like store, står på samme rad og ingen har `aria-pressed` eller fokus ved lasting
- Given demo-advarselen, when den vises, then bruker den ikke `warn`

## Design Notes

Omdirigering i `AppTilstand` med `router.replace` i en effekt; så lenge `samtykke` er `null` på en annen rute enn `/oppstart` og erklæringen, vises skjelettet i stedet for siden.

Erklæringen er tilgjengelig før samtykket, med rammen rundt; menylenkene sender videre til `/oppstart`.

## Verification

**Commands:**
- `npm test` -- expected: grønt, unntatt kjent CRLF-feil i `tekster.test.ts`
- `npm run lint`, `npm run typecheck`, `npm run build` -- expected: ingen feil
- `npx playwright test --workers=1` -- expected: alle grønne

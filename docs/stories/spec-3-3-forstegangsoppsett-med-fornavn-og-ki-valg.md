---
title: 'Story 3.3: Førstegangsoppsett med fornavn og KI-valg'
type: 'feature'
created: '2026-11-28'
status: 'done'
baseline_commit: '1481f2be7823810d28218636ae163611a2aba43b'
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
- `components/ramme.tsx` -- `PERSONVERNERKLÆRING`-ruta (fra 3.2) er privat her; eksporter én konstant så vakta og lenken deler den. `PersonvernLenke` står sist i `<main>` på mobil.
- `lib/store/index.ts` -- `redigerbart()`, `settFornavn` (trimmer, tomt → `null`); legg til `settSamtykke(svar)` på samme måte, med `nå` fra butikken (aldri `new Date()` i kjernen).
- `kjerne/samtykke.ts` -- `kiErPå(dokument)` fra 3.1 del 2 (Sabrina). Eneste sted som avgjør om KI er på (AD-12): sammenlign aldri `samtykke.svar` eller `tekstversjon` andre steder; `GJELDENDE_SAMTYKKEVERSJON` kan importeres herfra.
- `kjerne/skjema.ts` -- `samtykkeSkjema` (`svar`, `tidspunkt`, `tekstversjon`); `nyttDokument()` har `samtykke: null`.
- `kjerne/tekster.ts` -- `GJELDENDE_SAMTYKKEVERSJON`, `DEMO_ADVARSEL`, `SAMTYKKETEKST` (`duBestemmer.deler` med `{ uthevet }`, `lenke`, `knapper.nei`/`ja`). Ikke endre.
- `components/innstillinger.tsx` -- fornavnfelt, hjelpetekst og primærknapp (`rounded-full bg-accent text-text-on-pastel`) å gjenbruke.
- `components/oppgaveliste.tsx` -- tomteksten (linje ~27); `components/hilsen.tsx` -- hilsenen.
- `tests/e2e/*.spec.ts` -- alle starter i dag med `samtykke: null` og vil bli sendt til `/oppstart`. Gi alle tester et besvart samtykke som standard (for eksempel `storageState` eller felles hjelper), og legg `samtykke` inn der testene lager egne dokumenter (`oppgaveliste.spec.ts` `start`, `lagring.spec.ts`).
- `docs/ux-designs/…/mockups/key-skjema-oppstart.html` -- oppsett og stegprikker; tekstene der er utdaterte, bruk `kjerne/tekster.ts`.

## Tasks & Acceptance

**Execution:**
- [x] `lib/store/index.ts` -- `settSamtykke(svar: "ja" | "nei")` -- lagrer svaret
- [x] `tests/lib/butikk.test.ts` -- Vitest for `settSamtykke` (tidspunkt fra `nå`, versjon, nytt objekt); `kiErPå` testes i 3.1 del 2
- [x] `components/app-tilstand.tsx` -- omdirigering og `/oppstart` uten ramme
- [x] `app/oppstart/page.tsx` + `components/oppstart.tsx` -- de to stegene; steget i søkeparameter (`?steg=2`) så det overlever turen til erklæringen
- [x] `components/oppgaveliste.tsx` -- tomteksten etter `kiErPå`
- [x] `tests/e2e/` -- standard samtykke for eksisterende tester; ny `oppstart.spec.ts` for matrisen og Flyt 3 (ja og nei) med axe på begge steg

**Acceptance Criteria:**
- Given steg 2, when knappene måles, then er de like store, står på samme rad og ingen har `aria-pressed` eller fokus ved lasting
- Given demo-advarselen, when den vises, then bruker den ikke `warn`

## Implementation Notes

- Implementert direkte i hovedsesjonen. `kiErPå` importeres fra Sabrinas `kjerne/samtykke.ts`; ingen annen kode sammenligner `samtykke.svar` eller `tekstversjon`.
- `lib/ruter.ts` (ny) har `OPPSTART` og `PERSONVERNERKLÆRING`, delt av `AppTilstand`, rammen og oppsettet. `Logo` er eksportert fra `components/ramme.tsx`.
- `components/app-tilstand.tsx`: `omdirigering(stinavn, harSvart)` avgjør målet etter innlasting; skjelettet vises til `router.replace` er ferdig, så andre sider aldri blinker. `/oppstart` vises uten `Ramme`, men med lagringsbanneret.
- `app/oppstart/page.tsx` leser `searchParams` (Next 16: `PageProps<"/oppstart">`, gjør ruta dynamisk) og gir `steg` til `components/oppstart.tsx`. Steg 1 → 2 bruker `router.push`, så tilbakeknappen virker.
- Steg 2: begge svarknappene bruker `button-secondary`, så ingen ser forhåndsvalgt ut. Samtykketeksten står i et kort på `surface-raised`, så den ikke står på gløden.
- **Avvik fra `redigerbart()`:** `settSamtykke` virker også med sperret skriving (lageret kan ikke leses). Ellers ville studenten blitt stående fast i oppsettet, fordi appen sender tilbake til `/oppstart` så lenge `samtykke` er `null`. Abonnementet skriver fortsatt ikke. Dette er matriseraden «Lagring feiler».
- E2e: `tests/e2e/fikstur.ts` (ny) utvider Playwright med et besvart samtykke («nei») som standard, lagt inn på konteksten bare når lageret er tomt. Alle spec-filer importerer `test`/`expect` derfra; dokumenter testene lager selv får `besvart(…)`. Første oppstart-testene slår det av med `test.use({ medSamtykke: false })`. Testen for sperret skriving i `innstillinger.spec.ts` går nå gjennom oppsettet først, og «setItem som kaster» i `lagring.spec.ts` viser banneret over steg 1.
- Etter gjennomgangen: egen sidetittel per steg, bare `AppTilstand` omdirigerer, `?steg` som liste, fiksturen legger inn samtykke én gang per fane, og strammere tester (sletting ender i oppsettet, menyene vises aldri før omdirigeringen).
- Verifisert: lint, typecheck og build uten feil; `npm test` 378/379 (kjent CRLF-feil i `tekster.test.ts`); `npx playwright test --workers=1` 184 bestått, 16 hoppet over med vilje. Sett på skjermbilder av begge steg på mobil.

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Evidens / rute |
|---|---|---|---|---|
| 1 | blind | Fiksturen legger inn samtykke på nytt ved hver omlasting med tomt lager | low | Direkte retting → patch (bare første gang per fane, `sessionStorage`) |
| 2 | blind, edge, gap | «Slett alt» og flere tester godtar `/^Hei/`, som også treffer oppsettet | medium | Testen viste ikke at sletting sender til oppsettet → patch (URL og «Hei! Hva heter du?»; første start i `tema.spec.ts` slår av fiksturen) |
| 3 | blind, edge | Går hun fra erklæringen via menyen, havner hun på steg 1 | low | Fornavnet står i feltet, ett trykk til → defer |
| 4 | blind | Steg 1 og 2 har samme tittel; skjermlesere hører ikke stegbyttet | medium | Next leser opp ny sidetittel → patch (`generateMetadata` per steg, e2e) |
| 5 | blind | Ingen knapp tilbake fra steg 2 | low | Tilbakeknappen i nettleseren virker → avvist |
| 6 | blind, edge | Svarknappene omdirigerer i tillegg til `AppTilstand` | low | Direkte retting → patch (bare `AppTilstand`, AD-15) |
| 7 | blind | Tomt fornavn og Hopp over etter lagret navn er ikke testet | low | `settFornavn` trimmer og er testet i 1.8 → avvist |
| 8 | blind | Ja på eldre tekstversjon får ingen vei til nytt samtykke | false | Lenas beslutning: KI slås på igjen i Personvern og data (3.4) |
| 9 | blind | `omdirigering()` har ingen enhetstest, og stisammenligningen er skjør | low | Ingen `basePath` eller `trailingSlash` i oppsettet; dekket av e2e → avvist |
| 10 | blind | Flere faner er ikke testet | low | `lastPåNytt` oppdaterer `harSvart`, og omdirigeringen følger → avvist |
| 11 | blind, edge | `?steg` som liste gir steg 1 | low | Direkte retting → patch |
| 12 | blind | Dobbel tom linje i `ramme.tsx` | low | Direkte retting → patch |
| 13 | blind | Docs er ikke med i diffen | false | Utelatt med vilje; specen er påstandsfila |
| 14 | edge | `settFornavn` dropper navnet ved sperret skriving | low | Samme som i 1.8; banneret forklarer → avvist |
| 15 | edge | Raske dobbeltklikk på Ja/Nei kan overskrive svaret | false | Med svar viser `AppTilstand` skjelettet straks, så knappene forsvinner |
| 16 | edge | Navigering skjer selv om `settSamtykke` ikke gjorde noe | low | Løst av patch 6 (ingen egen navigering) |
| 17 | edge | Specen sier `tests/store/…`, men testene ligger i `tests/lib/butikk.test.ts` | low | Direkte retting → patch |
| 18 | gap | Ingen test for at menyene aldri vises før omdirigeringen | medium | Ekte hull → patch (MutationObserver-test; feiler uten vakta) |

## Design Notes

Omdirigering i `AppTilstand` med `router.replace` i en effekt; så lenge `samtykke` er `null` på en annen rute enn `/oppstart` og erklæringen, vises skjelettet i stedet for siden.

Erklæringen er tilgjengelig før samtykket, med rammen rundt; menylenkene sender videre til `/oppstart`.

## Verification

**Commands:**
- `npm test` -- expected: grønt, unntatt kjent CRLF-feil i `tekster.test.ts`
- `npm run lint`, `npm run typecheck`, `npm run build` -- expected: ingen feil
- `npx playwright test --workers=1` -- expected: alle grønne

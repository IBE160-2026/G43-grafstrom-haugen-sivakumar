---
title: 'Story 2.1: Regelbaserte forslag fra nøkkelord'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: '737608dc1b6be30c91d9531c49765496f1448586'
route: 'dispatch'
story_key: '2-1-regelbaserte-forslag-fra-nøkkelord'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Når KI er av, mangler nøkkel, svarer tomt eller ugyldig, tidsavbrytes eller når kallgrensen, skal appen likevel foreslå etikett og prioritet (FR-16–18). Det finnes ingen slik regel i koden i dag, og Epic 4 (4.7) trenger både reglene og tabellen for hva hver `reserve` gir (AD-8).

**Approach:** Lag `kjerne/reserve.ts` med en ren funksjon som foreslår etikett og prioritet ut fra nøkkelord i oppgaveteksten, og tabellen kalltype × årsak som avgjør hvilke felt som får forslag. Mål reglene mot de 20 tekstene i KI-testsettet og skriv resultatet i README som referanse for 4.8.

## Boundaries & Constraints

**Always:**
- Ren TypeScript i `kjerne/`, uten import fra React, Next eller `lib/`. Typene for etikett og prioritet kommer fra `kjerne/skjema.ts`.
- Forslagene har formen til `oppgave.forslag.felt` i skjemaet, med `kilde: "regelbasert"`.
- Nøkkelordlista ligger bare i `kjerne/reserve.ts` og er lista i Decisions under (Å-7).
- Uten treff: ingen etikett, og prioriteten foreslås som Middels.
- Tabellen dekker alle sju årsaker fra AD-6 (`ingen-nokkel`, `tidsavbrudd`, `tomt`, `ugyldig`, `avvist`, `api-feil`, `kallgrense`) og felt i `forkastet` fra et `ok`-svar.

**Never:**
- Aldri forslag til sammendrag, frist eller økter (FR-17).
- Ingen visning, ingen kommando i butikken, ingen kall til `/api/ki` (hører til Epic 4).
- Ikke `kjerne/ki-kontrakt.ts` (story 4.1, spor C).
- Ingen nye pakker. Ikke noe minstekrav i testen for antall riktige.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Treff | «Levere oblig i IBE160 i kveld», felt etikett + prioritet | etikett Skole, prioritet Høy, begge `regelbasert` | N/A |
| Ingen treff | «Ting jeg må huske» | ingen etikett, prioritet Middels | N/A |
| Uavgjort etikett | like mange treff for to etiketter | ingen etikett | N/A |
| Bare noen felt ønsket | `forslag`, ønsker bare `prioritet`, årsak `tidsavbrudd` | bare prioritet | N/A |
| Forkastet felt | `ok`-svar med `forkastet: ["etikett"]` | bare etikett | N/A |
| Bare økter | `forslag` med `felt: []`, `økter: true` | ingen forslag | N/A |
| `nyTid` | alle årsaker | ingen forslag | N/A |

## Decisions

- **Nøkkelordlista er generell (valgt av Stine 2026-11-27):** ord en student typisk skriver, ikke tilpasset de 20 testtekstene, slik at resultatet blir en ærlig referanse for 4.8. Et ord treffer når et ord i teksten starter med det (store/små bokstaver likt); emnekoder som IBE160 teller som Skole.
  - Skole: eksamen, innlevering, oblig, forelesning, seminar, kollokvie, pensum, kapittel, lærebok, gruppeprosjekt, gruppearbeid, canvas, emne, repeter, skole, studiet
  - Jobb: jobb, sjef, vakt, ekstravakt, timelist, lønn, kollega, kunde, personalmøte, arbeid, skift, turnus
  - Privat: husleie, regning, betale, handle, middag, lege, fastlege, tannlege, trening, vaske, rydde, klær, bursdag, gave, mamma, pappa, familie, venn, studielån, lånekassen, busskort, frisør
  - Høy: eksamen, levere, innlevering, frist, haster, viktig, «i dag», «i kveld», betale, husleie, «går ut»
  - Lav: kanskje, «en gang», «etter hvert», «når jeg har tid», sjekke, rydde, vaske

</frozen-after-approval>

## Code Map

- `kjerne/skjema.ts:21-22` -- `etikettSkjema`, `prioritetSkjema`; bruk `z.infer`-typene. `oppgaveForslagSkjema` (linje 32) viser formen `{ verdi, kilde }`. Ikke endre skjemaet.
- `kjerne/tekster.ts` -- mønster for ren kjernefil med JSDoc på norsk og `as const`.
- `tests/kjerne/*.test.ts` -- plassering og stil for Vitest; `vitest.config.mts` henter `tests/**/*.test.ts`, `@/` er prosjektroten.
- `tests/ki-testsett/testsett.json` -- 20 oppgaver med `tekst` og `forventet.etikett/prioritet`. `README.md` får en ny seksjon med resultatet.
- `docs/architecture/.../ARCHITECTURE-SPINE.md:93-110` -- AD-6 (forespørsel/svar, årsaker) og AD-8 (tabellen).

## Tasks & Acceptance

**Execution:**
- [x] `kjerne/reserve.ts` -- eksporter `ÅRSAKER`/`Årsak`, `Feltnavn` (`etikett | prioritet | sammendrag`), `nøkkelordforslag(tekst)` og `reserve(kall, utfall, tekst)`, der `kall` er `{ type: "forslag", ønsker: { felt, økter } } | { type: "nyTid" }` og `utfall` er `{ type: "reserve", årsak } | { type: "ok", forkastet }`. Tabellen er én eksportert konstant -- én kilde for 4.7.
- [x] `tests/kjerne/reserve.test.ts` -- matrisen over, alle kombinasjoner kalltype × årsak (og `forkastet`), at sammendrag aldri foreslås, bøyde ord og store bokstaver, og en test som kjører de 20 testtekstene og skriver antall riktige til konsollen.
- [x] `tests/ki-testsett/README.md` -- ny seksjon «Reserveløsningen» med dato og antall riktige etiketter og prioriteringer.

**Acceptance Criteria:**
- Gitt en oppgavetekst, når `nøkkelordforslag` kjøres, så er svaret det samme hver gang for samme tekst (ingen tid, tilfeldighet eller tilstand).
- Gitt `npm test`, `npm run lint` og `npm run typecheck`, når de kjøres, så går de uten feil.

## Implementation Notes

- `kjerne/reserve.ts` eksporterer `ÅRSAKER`, `Årsak`, `Feltnavn`, `Kall`, `Utfall`, `RESERVETABELL`, `NØKKELORD`, `nøkkelordforslag` og `reserve`. Bare typer importeres fra `kjerne/skjema.ts`.
- Matching: teksten normaliseres til NFC og små bokstaver og deles på alt som ikke er bokstav eller tall. Et enkeltord treffer starten av et ord; uttrykk med flere ord («i dag», «går ut») må stå nøyaktig. Et ord i teksten teller høyst én gang per etikett. Emnekode: 2–4 bokstaver fulgt av 3–4 sifre.
- Testen for KI-testsettet låser 19/20 og 15/20 og skriver ut bommene. Endres nøkkelordlista, må README-raden oppdateres samtidig (det er ikke et minstekrav, men en kontroll av at referansen stemmer).
- Kjente svakheter (til 4.8): bøyninger som endrer ordslutten («husleia», «betalt», «levert»), sammensetninger med nøkkelordet sist («hjemmeeksamen», «kontinuasjonseksamen»), og falske treff fra ordstart («arbeidskrav» → Jobb, «vaktmester», «leverandør»).

## Spec Change Log

## Review Triage Log

| Funn | Verdikt | Begrunnelse |
|---|---|---|
| Testen for KI-testsettet sjekker bare at det er 20 oppgaver; tallene i README kan gli uten at noe feiler (verification-gap, edge-case, blind) | medium | Bekreftet: eneste `expect` er `toHaveLength(20)`. 4.8 sammenligner mot tallet. → patch: lås tallene og skriv ut bommene |
| NFD-tekst (dekomponert å) deler ord, så «studielån», «når jeg har tid» slutter å treffe (edge-case) | low | Bekreftet i node: «går ut» → `[ga, r, ut]`. Direkte retting med `normalize("NFC")`. → patch |
| Siste ord i uttrykk treffer som starten av et ord: «i dagligvarebutikken» gir Høy (blind, verification-gap) | low | Bekreftet ved lesing av `treffer`. Uttrykksregelen er ikke låst i Decisions. Direkte retting: alle ord i et uttrykk må stå nøyaktig. → patch |
| Mangler test for tom tekst og `ok` med `forkastet: ["etikett"]` uten treff (blind) | low | Bekreftet, to korte tester. → patch |
| `forkastet` filtreres ikke mot `ønsker.felt` (edge-case, blind) | false | AD-8 og specen sier «felt kallet ba om **eller** som står i `forkastet`». Oppførselen følger regelen. |
| Bøyninger som «husleia», «betalt», «levert», sammensetninger som «hjemmeeksamen», og falske treff som «arbeidskrav», «vaktmester», «leverandør» (edge-case, blind) | low | Bekreftet, men følger av den låste nøkkelordlista og regelen om ordstart i Decisions. Avvist: rettingen er å endre specen. Notert som kjent svakhet til 4.8. |
| Emnekoderegex treffer «høst2025», «jul2026», bommer på «IBE-160» (edge-case, blind) | low | Bekreftet, men sjelden skrevet slik, og rettingen krever ekstra regler. Avvist. |
| Sprint-status står `in-progress`, ikke `review` (blind) | false | Settes i trinn 5 av arbeidsflyten. |
| Spec og epic-kontekst mangler i diffen (blind) | false | Bevisst: specen gis bare til edge-case-laget. Committes sammen med koden. |
| Testen «idag» → Middels låser en svakhet (blind) | low | Avvist: dokumenterer ordstartregelen, ingen brukerskade. |
| Determinismetesten beviser lite (blind) | low | Avvist: fila importerer ikke klokke eller tilfeldighet, synlig ved lesing. |
| Død gren og nøkkelen `forkastet` ved siden av årsakene i tabellen (blind, verification-gap) | low | Avvist: ingen bruker merker det, og ingen årsak heter `forkastet` i AD-6. |
| Dobbel test for tidsavbrudd med bare prioritet (blind) | low | Avvist: dekker matriseraden eksplisitt. |

## Design Notes

`Årsak` og `Feltnavn` defineres her fordi `ki-kontrakt.ts` (4.1) ikke finnes ennå. 4.1 bør importere dem herfra, så det bare finnes én liste. Høy vinner over Lav når begge treffer; etikett med flest treff vinner, uavgjort gir ingen.

## Verification

**Commands:**
- `npm test` -- expected: alle grønne, resultatet for testsettet skrives ut
- `npm run lint` -- expected: ingen feil (se bort fra den lokale `studieliste/`)
- `npm run typecheck` -- expected: ingen feil

## Gjennomgang (Sabrina, 2026-11-28): godkjent

Gått gjennom med `bmad-walkthrough` mot commit `777156d`.

- `npm test` 375/375 (50 i `tests/kjerne/reserve.test.ts`), `npm run lint` og `npm run typecheck` uten feil.
- Nøkkelordlista i `kjerne/reserve.ts` er lik lista i Decisions, og ordene finnes ikke i annen kode. `reserve.ts` importerer bare typer og har ingen klokke eller tilfeldighet.
- `npx vitest run tests/kjerne/reserve.test.ts --silent=false` gir 19 av 20 etiketter og 15 av 20 prioriteringer, med de samme bommene som i README.
- Alle akseptansekriteriene i epics.md er oppfylt for alle data appen kan få i dag.

Oppfølging til Stine (blokkerer ikke):
- **3a:** et kall som bare gjelder økter, gir likevel etikett eller prioritet hvis `ok`-svaret har feltet i `forkastet` (`kjerne/reserve.ts:272–274`, bekreftet ved kjøring). AD-8 sier at slike kall aldri gir forslag. Det kan bare skje hvis serveren legger felt i `forkastet` som kallet ikke ba om, så det avgjøres av kontrakten i 4.1. Kombinasjonen «bare økter × `ok`» har ingen test. Forslag: legg til en test, og enten filtrer `forkastet` mot `ønsker.felt` i `reserve()` eller la 4.1 garantere at `forkastet` bare har felt kallet ba om.
- **3b:** testen «treffer bøyde ord» (`tests/kjerne/reserve.test.ts:47`) bruker «Betale Husleia», men bare «betale» treffer. «Husleia» alene gir ingen etikett (kjent svakhet). Bytt til et bøyd ord som virkelig treffer, for eksempel «husleien».
- Merknader: Vitest skjuler bomlista i en vanlig `npm test` (vises med `--silent=false`). «Skifte dekk» → Jobb er et nytt eksempel på falskt treff fra ordstart som kan noteres til 4.8.

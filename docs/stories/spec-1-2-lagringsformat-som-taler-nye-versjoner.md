---
title: 'Story 1.2: Lagringsformat som tåler nye versjoner'
type: 'feature'
created: '2026-11-26'
status: 'done'
baseline_commit: '679c584f8d7badb5d4b34327a90caf36855fb8b3'
route: 'dispatch'
story_key: '1-2-lagringsformat-som-tåler-nye-versjoner'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen har ingen fast form på dataene og ingen trygg vei fra localStorage til minnet. Uten det kan en ny versjon av appen ødelegge eller overskrive det studenten har skrevet, og spor B, C og D kan ikke starte.

**Approach:** Lag det låste dokumentskjemaet i `kjerne/skjema.ts` (zod, versjon 1), en ren `migrer(rå)` i `kjerne/migrering.ts` som aldri kaster, og en liten adapter i `lib/storage/` som er eneste kode som rører localStorage. Ingen UI.

## Boundaries & Constraints

**Always:** Formene i AD-12 ordrett: `oppgave.forslag` `{ felt: { etikett?, prioritet?, sammendrag? }, økter: ØktForslag[] } | null` med felt `{ verdi, kilde: "ki" | "regelbasert" }` og øktforslag `{ id, dato, start, slutt }`; `oppgave.fullført` og `økt.avhuket` ISO-tidsstempel eller `null`; `økt.kilde` `"ki" | "manuell"`; `oppgave.ventendeKall` `{ id, type: "forslag" | "nyTid" } | null`; `samtykke` `{ svar: "ja" | "nei", tidspunkt, tekstversjon: number } | null`. Alle samlinger finnes fra versjon 1. Typer via `z.infer`. Norske nøkler med æøå. `kjerne/` importerer bare `kjerne/` og `zod`, uten klokke. Forventede feil returneres som navngitte resultater, aldri `throw`. Det lagrede overskrives aldri ved `for-ny` eller `ugyldig`.

Besluttet av Abhira 2026-11-26: «✦» på oppgavekortet er ikonet for sammendragslinja og vises ved alle sammendrag, så skjemaet har ikke noe felt for hvor sammendraget kom fra.

**Never:** Ingen butikk, klokke, React eller UI (1.3/1.4). Ingen `storage`-lytter (1.3) og ikke tema-skriptet (1.4). Ingen felt utover listen i Design Notes. Ingen avledede verdier i dokumentet.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tomt lager | `migrer(null)` | `{ type: "ok", dokument: nyttDokument(), endret: true }` | N/A |
| Gyldig v1 | JSON av gyldig dokument | `{ type: "ok", dokument, endret: false }` | N/A |
| Høyere versjon | `schemaVersion: 2` | `{ type: "for-ny", rå }` | Adapter skriver ikke |
| Ødelagt JSON | `"{ikke json"` | `{ type: "ugyldig", rå }` | Adapter skriver ikke |
| Feil form | v1 med `prioritet: "Kjempehøy"` eller ukjent nøkkel | `{ type: "ugyldig", rå }` | Adapter skriver ikke |
| Manglende versjon | JSON-objekt uten `schemaVersion` | `{ type: "ugyldig", rå }` | Adapter skriver ikke |
| Rar versjon | `schemaVersion` `0`, `-1`, `1.5` eller `"1"` | `{ type: "ugyldig", rå }` | Adapter skriver ikke |
| Manglende nøkkel | v1 uten `innstillinger.tema` | `{ type: "ugyldig", rå }` (ingen stille standardverdi) | Adapter skriver ikke |
| Skriving feiler | `setItem` kaster (kvote/blokkert) | `{ ok: false, feil: "lagring-feilet" }` | Kaster ikke |
| Tilbakeskriving feiler | `les()` med `endret` og `setItem` kaster | `{ type: "ok", dokument, lagringFeilet: true }` | Kaster ikke |
| Lesing feiler | `getItem` eller `window.localStorage` kaster | `{ type: "lesefeil" }` | Kaster ikke, skriver ikke |

</frozen-after-approval>

## Code Map

- `kjerne/`, `lib/` -- tomme (bare `.gitkeep`); fjern `.gitkeep` når første fil kommer
- `vitest.config.mts` -- `include` er bare `tests/kjerne/**/*.test.ts`; adaptertesten trenger `tests/lib/`
- `tests/e2e/*.spec.ts` -- Playwright bruker `.spec.ts`, så `*.test.ts` kolliderer ikke
- `docs/stories/deferred-work.md` -- punktet om å fjerne `passWithNoTests` når første Vitest-test finnes, løses her
- zod 4.6.7: `z.iso.date()` avviser ugyldige datoer (2026-02-30), `z.iso.time({ precision: -1 })` gir `HH:mm`, `z.iso.datetime()` for tidsstempler; `z.strictObject` avviser ukjente nøkler

## Tasks & Acceptance

**Execution:**
- [x] `kjerne/skjema.ts` -- zod-skjema og typer for `Dokument`, `Oppgave`, `Økt`, `Hendelse`, `Innstillinger`, `Profil`, `Samtykke`, `OppgaveForslag`; `GJELDENDE_SKJEMAVERSJON = 1`; `nyttDokument()` uten klokke -- AD-4, AD-12
- [x] `kjerne/migrering.ts` -- `migrer(rå: string | null): MigreringsResultat` som parser JSON, sjekker `schemaVersion`, kjører trinn fra tabellen `MIGRERINGER` (tom i v1) og validerer til slutt; `endret` er sann når dokumentet er nytt eller migrert -- AD-3
- [x] `lib/storage/index.ts` -- `LAGRINGSNØKKEL = "duenext"`; `lagLagring(hentStorage: () => Storage)` med `les()` (kaller `migrer`, skriver tilbake når `endret`) og `skriv(dokument)`; standardinstansen slår opp `window.localStorage` først ved bruk, inni try/catch, så import virker uten `window` og blokkert lagring gir `lesefeil`/`lagring-feilet` -- AD-3
- [x] `tests/kjerne/skjema.test.ts`, `tests/kjerne/migrering.test.ts` -- alle rader i matrisen for `migrer`, pluss at `nyttDokument()` validerer og at hver AD-12-form avviser feil verdier
- [x] `tests/lib/lagring.test.ts` -- falsk `Storage` i minnet; tilbakeskriving ved `endret`, aldri skriving ved `for-ny`/`ugyldig`/`lesefeil`, rådata returneres, `lagring-feilet` når `setItem` kaster
- [x] `vitest.config.mts` -- `include: ['tests/**/*.test.ts']`, fjern `passWithNoTests` -- tester finnes nå
- [x] `docs/stories/deferred-work.md` -- marker Vitest-delen av `passWithNoTests`-punktet som løst (Playwright-delen gjelder fortsatt)

**Acceptance Criteria:**
- Given produksjonskoden (alt utenfor `tests/`), when man søker etter `localStorage`, then finnes det bare i `lib/storage/`
- Given `kjerne/`, when man søker etter `Date`, `window`, `fetch` og imports, then finnes ingen klokke- eller nettleserbruk og bare imports fra `kjerne/` og `zod`

## Implementation Notes

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Evidens / rute |
|---|---|---|---|---|
| 1 | blind+gap | Migreringsløkka og `endret: true` etter migrering testes aldri | medium | `MIGRERINGER` er tom og kan ikke byttes; løkka kan slettes med alle tester grønne → patch (valgfri parameter + tester) |
| 2 | blind | Tilbakeskriving etter migrering i adapteren er ikke testet | low | Samme gren (`resultat.endret`) er dekket via tomt lager; rot som 1 → dekkes av 1 |
| 3 | blind+edge | `skriv()` validerer ikke dokumentet | low | Ingen kaller ennå; skade krever en feil i en senere kommando → defer til 1.3 |
| 4 | edge | Gammel fane kan overskrive data fra nyere versjon | low | Krever app-oppdatering med to åpne faner; v1 har ingen v2 → defer til første migrering |
| 5 | blind+edge | `Number.MAX_VALUE * 10`-testen tester `null`, ikke Infinity | low | `JSON.stringify(Infinity)` gir `null` → patch |
| 6 | blind | `ugyldig` har ingen årsak | low | Feilsiden i 1.3 trenger ikke årsak (AK); ville gi ny flate → avvist |
| 7 | blind | AK om `localStorage`/ren kjerne sjekkes bare manuelt | low | Ingen brudd nå; ESLint-regler er ny konfig → defer |
| 8 | blind | Tekst med bare mellomrom godtas | low | Trimming er kommandoenes ansvar (Design Notes) → avvist |
| 9 | blind | Hull i negative skjematester | low | Delte primitiver (`dato`, `klokkeslett`, `id`) er testet andre steder → avvist |
| 10 | blind | Standardinstans-testen avhenger av `node`-miljøet | low | Bryter hvis jsdom blir global → patch (`@vitest-environment node`) |
| 11 | gap | `--pass-with-no-tests` er utdatert, e2e-test finnes | low | `tests/e2e/forside.spec.ts` finnes → patch |

## Design Notes

Skjemaet sjekker bare form: alle objekter `strictObject`, ingen `.default()` (standardverdier settes bare i `nyttDokument()`), ingen kryssfelt-regler (som at `oppgaveId` finnes eller start < slutt) — de hører til kjernefunksjonene, og et brudd skal ikke låse hele appen på feilsiden. Valgfrie tekstfelt er `min(1)` eller `null`, aldri `""`; `tekst` og `tittel` er `min(1)` (trimming gjøres av kommandoene). Forslagsverdier typet per felt: etikett- og prioritet-enum, sammendrag streng. `ventendeKall` holder seg til AD-12 (`{ id, type }`): frist ved kallstart, `øktId` og et `nyTid`-svar lever i minnet hos kommandoen, fordi `ventendeKall` nullstilles ved oppstart uansett (AD-13). Felt:
- `Dokument`: `schemaVersion: 1`, `oppgaver`, `økter`, `hendelser`, `innstillinger`, `profil: { fornavn } | null`, `samtykke`
- `Oppgave`: `id`, `tekst` (ikke tom), `frist: dato | null`, `prosjekt`, `etikett: "Privat" | "Skole" | "Jobb" | null`, `prioritet: "Lav" | "Middels" | "Høy"`, `sammendrag`, `notater` (streng eller `null`), `skjultForKi: boolean`, `createdAt`, `fullført`, `forslag`, `ventendeKall`
- `Økt`: `id`, `oppgaveId`, `dato`, `start`, `slutt`, `kilde`, `avhuket`, `createdAt`
- `Hendelse`: `id`, `tittel`, `dato`, `start`, `slutt` (slutt før start = neste dag, så ingen rekkefølgesjekk her), `skjulTittelForKi`, `seriesId: string | null`, `gjentakelse: { hver: "uke" | "annenhver-uke", sluttdato } | null`, `createdAt`
- `Innstillinger`: `modus: "lys" | "mørk" | "system"` (standard `system`), `tema: "blå" | "oransje" | "lilla" | "gul" | "grønn" | "rosa"` (standard `blå`), `sendAldriNotater` (standard `false`), `sendHendelsestitler` (standard `true`)

`lesefeil` lar butikken i 1.3 vise lagringsbanneret uten å skrive over noe som kanskje finnes.

## Verification

**Commands:**
- `npm test` -- expected: alle nye tester grønne
- `npm run lint` -- expected: ingen feil
- `npm run typecheck` -- expected: ingen typefeil
- `git grep -n "localStorage" -- ':!docs' ':!.logs' ':!*.md'` -- expected: bare treff i `lib/storage/` og `tests/lib/`

---
title: 'Story 3.1 (del 2): Samtykke i kjernen'
type: 'feature'
created: '2026-11-28'
status: 'done'
baseline_commit: '28dfeb93f0014d842eb4b3501f819ed0d2c28121'
route: 'dispatch'
story_key: '3-1-samtykke-og-fastsatte-tekster-i-kjernen'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-3-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Ingen kode avgjør i dag om KI er på eller om en oppgave kan sendes. Uten ett felles sted vil førstegangsoppsettet (3.3), Personvern og data (3.4), 🔒 (3.5) og KI-veien (Epic 4 og 6) skrive hver sin sjekk, og et utdatert samtykke eller en låst oppgave kan slippe gjennom.

**Approach:** Lag `kjerne/samtykke.ts` med `kiErPå(dokument)` og `kanSendes(oppgave, dokument)` som de eneste beslutningsstedene (AD-12), og gjør `GJELDENDE_SAMTYKKEVERSJON` tilgjengelig derfra. Dette er del 2 av story 3.1 og fullfører storyen. Del 1 (`kjerne/tekster.ts`) er godkjent.

## Boundaries & Constraints

**Always:**
- `kiErPå` er sann bare når `samtykke.svar === "ja"` og `samtykke.tekstversjon === GJELDENDE_SAMTYKKEVERSJON`. Alt annet gir usann.
- `kanSendes` er `kiErPå(dokument) && !oppgave.skjultForKi`. Den gjentar ikke samtykkelogikken, men kaller `kiErPå`.
- Ren TypeScript som bare importerer fra `kjerne/`: ingen klokke, nettleser, React, Next eller `lib/`. Funksjonene er rene og endrer ikke det de får.

**Beslutninger (Sabrina, 2026-11-28):**
- `GJELDENDE_SAMTYKKEVERSJON` blir værende i `kjerne/tekster.ts` som eneste kilde, ved siden av samtykketeksten og hashtesten (arkitekturen, Stines godkjenning av del 1). `samtykke.ts` eksporterer den videre, så akseptansekriteriet i epics.md («finnes i `kjerne/samtykke.ts`») holder uten en ny kopi.
- Parameterne er smale: `kiErPå(dokument: Pick<Dokument, "samtykke">)` og `kanSendes(oppgave: Pick<Oppgave, "skjultForKi">, dokument: Pick<Dokument, "samtykke">)`. Et helt `Dokument` og en hel `Oppgave` passer fortsatt.
- `kanSendes` sjekker bare samtykke og 🔒. Notatvalget (`sendAldriNotater`), hendelsestitler, fullførte oppgaver og «importerte oppgaver sender ingenting før teksten endres» hører til utdraget (4.1), `ki-trigger.ts` (4.5) og import (3.7).

**Never:**
- Ingen endring i `kjerne/skjema.ts` eller `GJELDENDE_SKJEMAVERSJON`. `samtykke` og `skjultForKi` finnes fra 1.2, så det trengs ingen migrering.
- Ikke endre `kjerne/tekster.ts`, versjonsnummeret eller hashtesten.
- Ingen butikkommando (`settSamtykke` hører til 3.3), ingen UI og ingen omdirigering.
- Ingen nye pakker.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Ja, gjeldende versjon | `samtykke: { svar: "ja", tekstversjon: GJELDENDE }` | `kiErPå` sann | N/A |
| Nei | `svar: "nei"`, gjeldende versjon | `kiErPå` usann | N/A |
| Ikke svart | `samtykke: null` | `kiErPå` usann | N/A |
| Gammel tekstversjon | `svar: "ja"`, `tekstversjon: GJELDENDE − 1` | `kiErPå` usann | N/A |
| Ukjent nyere versjon | `svar: "ja"`, `tekstversjon: GJELDENDE + 1` | `kiErPå` usann | N/A |
| Ulåst oppgave, KI på | `skjultForKi: false`, `kiErPå` sann | `kanSendes` sann | N/A |
| 🔒, KI på | `skjultForKi: true`, `kiErPå` sann | `kanSendes` usann | N/A |
| KI av | nei, `null` eller gammel versjon, med og uten 🔒 | `kanSendes` usann | N/A |

</frozen-after-approval>

## Code Map

- `kjerne/skjema.ts` -- `Dokument`, `Oppgave` (`skjultForKi: boolean`) og `samtykkeSkjema` (`{ svar: "ja" | "nei", tidspunkt, tekstversjon: int ≥ 0 } | null`) fra 1.2. Importer typene med `import type`. Ikke endre.
- `kjerne/tekster.ts:15` -- `GJELDENDE_SAMTYKKEVERSJON = 1`. `tekster.ts` importerer ingenting, så vi får ingen sirkulær import. Ikke endre.
- `kjerne/prosjekter.ts` -- mønster for en liten kjernemodul: doc-kommentar øverst med AD/FR, korte doc-kommentarer per eksport, `./skjema`-import.
- `tests/kjerne/fikstur.ts` -- `fulltDokument()` (samtykke «ja», v1, `o1` ulåst) og `T`. Lag variantene med spredning, ikke ny fikstur.
- `tests/kjerne/prosjekter.test.ts` -- teststil: `describe`/`it` på norsk, import via `@/kjerne/…`.
- `tests/kjerne/tekster.test.ts:349` -- tester eksportlisten til `tekster.ts`. Påvirkes ikke, fordi den nye eksporten ligger i `samtykke.ts`.
- `docs/stories/deferred-work.md` -- punktet «Bygg resten av story 3.1 …» løses her.
- Brukes senere av: `components/app-tilstand.tsx` og `components/oppgaveliste.tsx` (3.3), Personvern og data (3.4), `ki-trigger.ts` og `mottaKiSvar` (4.5).

## Tasks & Acceptance

**Execution:**
- [x] `kjerne/samtykke.ts` -- eksporter `GJELDENDE_SAMTYKKEVERSJON` videre fra `./tekster`, og lag `kiErPå` og `kanSendes` etter Boundaries. Doc-kommentarene sier at disse to er de eneste beslutningsstedene (AD-12), og at kallere aldri gjentar logikken.
- [x] `tests/kjerne/samtykke.test.ts` -- én test per rad i matrisen. `kanSendes` testes med 🔒 av og på for hver KI-av-tilstand. Test også at `GJELDENDE_SAMTYKKEVERSJON` fra `@/kjerne/samtykke` er samme verdi som fra `@/kjerne/tekster`, og at funksjonene ikke endrer argumentene (`Object.freeze` / `structuredClone`-sammenligning).
- [x] `docs/stories/deferred-work.md` -- merk punktet om resten av 3.1 med «(Løst i story 3.1 del 2.)» foran, som for punktene løst i 1.2 og 1.3.

**Acceptance Criteria:**
- Gitt `kjerne/samtykke.ts`, når en annen modul trenger samtykkeversjonen eller vil vite om KI er på, så kan den importere `GJELDENDE_SAMTYKKEVERSJON`, `kiErPå` og `kanSendes` fra `@/kjerne/samtykke`.
- Gitt kodebasen, når den søkes gjennom etter samtykkelogikk, så sammenlignes `svar` og `tekstversjon` bare i `kjerne/samtykke.ts`.
- Gitt `npm test`, `npm run lint` og `npm run typecheck`, når de kjøres, så går de uten feil.

## Implementation Notes

- Nye filer: `kjerne/samtykke.ts` og `tests/kjerne/samtykke.test.ts` (14 tester). Endret: `docs/stories/deferred-work.md`.
- Med `it.each` dekker testene for `kanSendes` alle fire tilstander der KI er av, både med og uten 🔒. Varianter lages ved å spre `fulltDokument()`.
- `git grep` i Verification finner ikke filer som ikke er sporet ennå. Den ble kjørt som `grep -rn` på `app components lib kjerne`, og den eneste treffen var `kjerne/samtykke.ts:21–22`.

## Spec Change Log

## Review Triage Log

| Funn | Verdikt | Begrunnelse |
|---|---|---|
| `kiErPå` kaster når `samtykke` er `undefined` (edge, blind) | false | `dokumentSkjema` krever `samtykke` (objekt eller `null`). Alle dokumenter valideres i `migrer` og før lagring (`lib/store/index.ts:168`), og typen tillater ikke `undefined`. |
| `kanSendes` slipper gjennom når `skjultForKi` mangler (edge) | false | `oppgaveSkjema` krever `skjultForKi: z.boolean()` (strengt objekt), og typen `Pick<Oppgave, "skjultForKi">` krever feltet. Data uten feltet når aldri kjernen. |
| `sprint-status.yaml` mangler i diffen (blind) | false | Settes i trinn 5 etter gjennomgangen, som i del 1. |
| Specen er ikke med i diffen (blind) | false | Bevisst holdt utenfor gjennomgangen og committes sammen med koden når den er godkjent. Implementation Notes og triagen er nå fylt ut. |
| Prefikset i `deferred-work.md` sier ikke hvordan punktet ble løst (blind) | low | Bekreftet. 1.3-punktet sier hvordan. Ren tekstretting. → patch |
| Doc-kommentaren til `kanSendes` nevner ikke fullførte oppgaver (blind) | low | Bekreftet. Specen utelater dem, men kommentaren gjør det ikke tydelig, så kallere i 4.5 kan tro at de filtreres her. → patch |
| AC 2 (bare `samtykke.ts` sammenligner `svar`/`tekstversjon`) sjekkes ikke automatisk (blind) | low | Bekreftet. I dag gjelder det bare manuell `grep`, og 3.3, 3.4 og 4.5 kan gjenta logikken uten at noe feiler. Samme slags hull som det utsatte punktet om ESLint-regler for AD-1/AD-3. → defer |
| `kiErPå`-testene gjentar `kiAv`-tabellen (blind) | false | Ingen konkret skade. Nye av-tilstander i `kiAv` går gjennom `kiErPå` via `kanSendes`. |
| Renhetstesten er smal (grunn `freeze`, bare én gren) (blind) | false | Funksjonene skriver ingenting. Det finnes ingen mutasjon testen kunne gått glipp av (bekreftet av verification-gap). |
| Ingen test med en hel låst `Oppgave` (blind) | false | `kanSendes` leser bare `skjultForKi`. En hel oppgave gir samme vei, og typen for full `Oppgave` er testet i sann-tilfellet. |
| Versjonen kan importeres fra to steder (blind) | false | Besluttet i specen (videreeksport). Samme verdi, og testen sikrer likheten. |
| Verification gap: ingen hull funnet | — | Alle mutasjoner av logikken (fjernet `svar`, null-vakt, `<=`/`>=`, `!skjultForKi`) gir en rød test. |

## Design Notes

Versjonen sammenlignes med `===`, ikke `>=`. En nyere versjon enn appen kjenner kan bare komme fra en manipulert lagring, fordi import nullstiller samtykket (3.7). Det trygge svaret er da at KI er av.

```ts
import { GJELDENDE_SAMTYKKEVERSJON } from "./tekster";
export { GJELDENDE_SAMTYKKEVERSJON };

export function kiErPå(dokument: Pick<Dokument, "samtykke">): boolean {
  const { samtykke } = dokument;
  return samtykke !== null && samtykke.svar === "ja" && samtykke.tekstversjon === GJELDENDE_SAMTYKKEVERSJON;
}
```

## Verification

**Commands:**
- `npm test` -- forventet: alle tester grønne, også de nye i `tests/kjerne/samtykke.test.ts`
- `npm run lint` -- forventet: ingen feil
- `npm run typecheck` -- forventet: ingen feil
- `git grep -n -e 'svar === "ja"' -e 'tekstversjon ===' -- app components lib kjerne` -- forventet: bare treff i `kjerne/samtykke.ts`

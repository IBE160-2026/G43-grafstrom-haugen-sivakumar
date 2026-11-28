---
title: 'Story 6.4: Øktgrenser i kjernen'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: '3012e67ca0052a1f711ee6468c16bea9e0fcb121'
route: 'dispatch'
story_key: '6-4-øktgrenser-i-kjernen'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-6-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** KI kan foreslå økter midt i en vakt, om natta eller rett etter en nattevakt. FR-49 setter grensene, men de finnes ikke i koden. Serveren (6.5) og godtak (6.6) trenger én felles regel som sier om et forslag holder, og hvorfor det ikke gjør det.

**Approach:** Lag `kjerne/okter.ts` med en ren funksjon som sjekker ett øktforslag mot FR-49 og gir en årsakskode, og en funksjon som kontrollerer en hel liste (forkaster én og én, og beholder høyst 5). Mål reglene mot planleggingscasene og mock-svarene fra 5.1.

## Boundaries & Constraints

**Always:**
- Ren TypeScript i `kjerne/` (AD-1). «Nå» er en `Date`-parameter (AD-5). Bruk `slutterNesteDag` fra `kjerne/hendelser.ts` og `lokalDato`/`lokaltKlokkeslett` fra `kjerne/tid.ts`.
- Tidene regnes som veggklokkeminutter: `dato` + `HH:mm` gjøres om til minutter med `Date.UTC`, så dagskifter går av seg selv og tidssonen ikke spiller inn. En hendelse som slutter neste dag, får +1440 minutter på slutten.
- Intervaller er halvåpne `[start, slutt)`: å ligge kant i kant er ikke overlapp.
- Reglene og årsakene, i denne rekkefølgen (første brudd gir årsaken):
  1. `varighet`: slutt ≤ start, eller varighet under 30 minutter eller over 3 timer
  2. `utenfor-dagtid`: start før 07:00 eller slutt etter 23:00
  3. `fortid`: start før «nå»
  4. `etter-frist`: dato etter fristdagen
  5. `overlapp-hendelse`: overlapper en hendelse, også en nattevakt fra dagen før
  6. `overlapp-økt`: overlapper en godtatt økt
  7. `etter-nattevakt`: overlapper de første 8 timene etter slutten på en hendelse som slutter neste dag. Regelen bruker bare klokkeslett, ikke titler.
- Funksjonene tar bare feltene de trenger (`Pick<…, "dato" | "start" | "slutt">`), og returnerer forslagene uendret.

**Never:**
- Ingen sjekk av overlapp mellom forslagene i samme svar (FR-49 krever det ikke, og godtak sjekker på nytt i 6.6).
- Ingen server, kontrakt, butikk, `vedlikehold` eller UI (6.5, 6.6). Ikke endre `kjerne/hendelser.ts`, `kjerne/skjema.ts` eller dataene i `tests/ki-testsett/`. Ingen nye pakker.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Gyldig | case 1, man. 13:00–15:00 | ok | N/A |
| For kort / for lang | 25 min / 3 t 15 min | ikke ok | `varighet` |
| Grense varighet | 30 min og 3 t | ok | N/A |
| Utenfor dagtid | 06:30–08:00 / 22:00–23:30 | ikke ok | `utenfor-dagtid` |
| Grense dagtid | 07:00–08:00 og 22:00–23:00 | ok | N/A |
| Fortid | «nå» 12:00, økt 11:30–13:00 | ikke ok | `fortid` |
| Starter ved «nå» | «nå» 12:00, økt 12:00–13:00 | ok | N/A |
| Etter frist | dato dagen etter fristen | ikke ok | `etter-frist` |
| På fristdagen | dato = frist | ok | N/A |
| Overlapp hendelse | inni forelesning 10:15–12:00 | ikke ok | `overlapp-hendelse` |
| Kant i kant | 12:00–13:00 etter hendelse som slutter 12:00 | ok | N/A |
| Inn i nattevakt | økt 07:00–08:00 dagen etter vakt 21:00–07:30 | ikke ok | `overlapp-hendelse` |
| Overlapp godtatt økt | case 1, tir. 15:00–16:30 | ikke ok | `overlapp-økt` |
| Etter nattevakt | case 2, ons. 09:00–11:00 | ikke ok | `etter-nattevakt` |
| 8 t-grensen | ons. 15:30–17:00 (vakt slutter 07:30) | ok | N/A |
| Uten titler | case 4 (`sendHendelsestitler: false`), fre. 09:00–11:00 etter nattevakt tor. | ikke ok | `etter-nattevakt` |
| Mock gyldig | `okter-gyldig.json` mot case 1 | alle 3 beholdes | N/A |
| Mock bryter | `okter-bryter-fr49.json` mot case 2 | 2 beholdes, onsdag forkastes | `etter-nattevakt` |
| Mer enn 5 | 7 gyldige forslag | de 5 første beholdes | de 2 siste: `for-mange` |
| Ugyldige først | 2 ugyldige + 5 gyldige | 5 beholdes | de 2 ugyldige med sin årsak |

## Decisions

- **Fem etter kontroll:** listefunksjonen forkaster ugyldige forslag først og beholder så de 5 første gyldige (rekkefølgen fra svaret). Overskytende får `for-mange`.
- **«I fortiden» betyr at starten er før «nå».** En økt som starter akkurat nå, er gyldig.

</frozen-after-approval>

## Code Map

- `kjerne/hendelser.ts` -- `slutterNesteDag(h)`. `erOver`/`leggTilDager` er private og trengs ikke: minuttregningen i denne storyen dekker dagskiftet.
- `kjerne/tid.ts` -- `lokalDato`/`lokaltKlokkeslett` gjør «nå» om til veggklokke. Legg minutthjelperen her hvis den er generell (`tilMinutter(dato, klokkeslett)`), ellers privat i `okter.ts`.
- `kjerne/skjema.ts` -- typene `ØktForslag`, `Økt`, `Hendelse` (bare `Pick` brukes). Ikke endre.
- `tests/ki-testsett/planleggingscaser.json` og `mock/*.json` -- testdata. «Nå» der er `"YYYY-MM-DDTHH:mm"` og gjøres om til `new Date(år, måned - 1, dag, t, m)` i testen. `godtatteØkter` og `hendelser` har de feltene funksjonene trenger.
- `tests/ki-testsett/README.md` («Casene») -- eksempeløkt per case, som også bør godtas.
- `tests/kjerne/hendelser.test.ts` -- teststil. `vitest.config.mts` låser `TZ=Europe/Oslo`.

## Tasks & Acceptance

**Execution:**
- [x] `kjerne/okter.ts` -- `ØKTÅRSAKER`, `sjekkØktforslag(forslag, { hendelser, godtatteØkter, frist, nå })` → `{ ok: true } | { ok: false, årsak }`, og `kontrollerØktforslag(forslag[], kontekst)` → `{ beholdt, forkastet: { forslag, årsak }[] }`, der `årsak` også kan være `for-mange`.
- [x] `kjerne/tid.ts` (valgfritt) -- `tilMinutter(dato, klokkeslett)` hvis den legges her, med test i `tests/kjerne/tid.test.ts`.
- [x] `tests/kjerne/okter.test.ts` -- én test per rad i matrisen, og en test som kjører eksempeløkta for hver case i README gjennom `sjekkØktforslag` og forventer ok.

**Acceptance Criteria:**
- Given hver case i `planleggingscaser.json` og eksempeløkta i README, when `sjekkØktforslag` kjører, then er alle ok.
- Given `kjerne/okter.ts`, when et søk etter `Date.now(` og `new Date()` og en importsjekk kjøres, then finnes ingen treff og ingen import utenfor `kjerne/` og `zod`.

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Bevis / rute |
|---|---|---|---|---|
| 1 | ECH, BH | Feil format (NaN fra `tilMinutter`) gir `ok: true` | low | Svaret fra KI valideres med kontraktskjemaet før kjernekontrollen (AD-6/AD-7), så feil format kommer ikke fram hit. Forutsetningen står ingen steder. Patch: si i JSDoc at forslag, hendelser og økter må være skjemavaliderte. |
| 2 | ECH, BH, VG | `utenfor-dagtid` sammenligner strenger, de andre reglene minutter | low | Stemmer, og det er sårbart for «6:30». Patch: sammenlign i minutter. |
| 3 | ECH | `frist` og `dato` sammenlignes som strenger | false | Formatet er garantert av skjemaet (se 1). `YYYY-MM-DD` sorteres riktig som streng. |
| 4 | ECH | Ugyldig «nå» | false | «Nå» kommer bare fra `lib/klokke.ts`. |
| 5 | ECH | «Nå» med sekunder gjør at en økt kl. 12:00 godtas ved 12:00:45 | false | Spesifikasjonen regner på minuttnivå, og en økt som starter ved «nå», er gyldig (Decisions). |
| 6 | BH | Første brudd skjuler kollisjon ved godtak, og resultatet sier ikke hva økta kolliderer med | medium | Stemmer for 6.6/6.8: merket trenger tittelen og må se kollisjon uavhengig av de andre reglene. Ingen bruker funksjonen ennå. Defer til 6.6/6.8 (egen kollisjonsfunksjon). |
| 7 | BH | Ingen sier at økta selv må holdes utenfor `godtatteØkter` ved ny sjekk | low | Stemmer. Patch: én setning i JSDoc på `Øktkontekst`. |
| 8 | BH | Hendelse som slutter 00:00, utløser nattevaktregelen | low (avvist) | Følger FR-45 ordrett (slutt før start = neste dag). Påvirker bare 07:00–08:00 morgenen etter. |
| 9 | BH | Ingen test av rekkefølgen på reglene | low | Stemmer. Patch: test med flere brudd samtidig. |
| 10 | BH | Ingen test av `fortid` på tvers av dager | low | Stemmer. Patch (test). |
| 11 | BH, VG | Ingen test av godtatt økt over midnatt | low | Stemmer. Mutasjon uten +1440 gir fortsatt grønne tester. Patch (test). |
| 12 | BH | Ingen test av ugyldig forslag etter 5 gyldige | low | Stemmer. Patch (test). |
| 13 | BH | Eksemplene fra README er kopiert inn i testen | low (avvist) | Dataene i 5.1 skal ikke endres (Never). Koblingen står i Code Map. |
| 14 | BH, VG | Sesjonsloggen sier at status ikke er oppdatert | low | Stemmer, og loggen rettes ved avslutningen. Sprint-status settes til `review` i step 5. |
| 15 | BH | Spesifikasjonen og `studieliste/` mangler i diffen | false | Spesifikasjonen holdes utenfor med vilje. `studieliste/` er ikke en del av arbeidet. |
| 16 | BH | `varighet <= 0` er overflødig | low | Stemmer. Patch (fjern). |
| 17 | BH | Oppførselen ved sommertidsskiftet er ikke testet | low (avvist) | Godtatt begrensning (Design Notes). En test ville låst fast en kjent unøyaktighet. |
| 18 | VG | Lengden på 8-timersvinduet er løst testet (2 t gir også grønne tester) | low | Stemmer. Mutasjonen er vist. Patch: ons. 15:00–16:00 gir `etter-nattevakt`. |

## Design Notes

- **Veggklokke, ikke tidspunkter.** Som i 5.2 er alle grensene i FR-49 klokkeslett. 8 timer etter en nattevakt regnes som 480 veggklokkeminutter. Natta sommertiden skifter, kan vinduet bli én time for langt eller kort. Det er godtatt, i tråd med den kjente begrensningen i 5.2.
- **Én funksjon for server og godtak.** 6.6 bruker `sjekkØktforslag` ved godtak og ser bare på `overlapp-hendelse`/`overlapp-økt` for merket «⚠ Kolliderer med». Derfor er overlapp hendelse og økt egne koder.

## Verification

**Commands:**
- `npx vitest run tests/kjerne` -- expected: alle grønne
- `npx vitest run` -- expected: ingen eksisterende tester brekker
- `npx tsc --noEmit` og `npx eslint kjerne tests/kjerne` -- expected: ingen feil

## Implementation Notes

- `tilMinutter(dato, klokkeslett)` ligger i `kjerne/tid.ts` (generell), med tester i `tests/kjerne/tid.test.ts`.
- `kjerne/okter.ts` eksporterer også `Øktårsak`, `Kontrollårsak`, `Øktkontekst`, `Sjekkresultat`, `Kontrollresultat<T>` og `MAKS_ØKTER = 5`. `frist` er `string` (forslag gjelder bare oppgaver med frist).
- Samme intervallhjelper (+1440 når slutt < start) brukes for hendelser og godtatte økter, så en manuell økt over midnatt også regnes riktig ved overlapp.
- `kontrollerØktforslag` er generisk (`T extends Pick<ØktForslag, "dato" | "start" | "slutt">`) og gir samme objekter tilbake; `forkastet` står i rekkefølgen fra svaret.

## Gjennomgang (Sabrina, 2026-11-28): godkjent

Gått gjennom med `bmad-walkthrough` mot commit `5fbd0fd`.

- `tests/kjerne/okter.test.ts` og `tid.test.ts` 42/42, `npm test` 375/375, og `npx eslint kjerne tests/kjerne` og `npx tsc --noEmit` uten feil.
- Alle akseptansekriteriene i epics.md og specen er oppfylt. Alle 20 radene i tabellen over tilfeller er testet. Ingen `Date.now(` eller `new Date()` i `kjerne/okter.ts`. Importene er bare `./hendelser`, `./skjema` og `./tid`.
- I gjennomgangen av 5.1 ble eksempeløktene og mock-svarene også kjørt gjennom `sjekkØktforslag` for seg, med samme resultat som testene.

Merknader (blokkerer ikke):
- **a:** Design Notes sier at 6.6 bruker `sjekkØktforslag` ved godtak for merket «⚠ Kolliderer med». Triagen (rad 6) og punktet i `docs/stories/deferred-work.md` sier det motsatte: kontrollen stopper ved første brudd og gir ikke tilbake hva økta kolliderer med, så 6.6/6.8 trenger en egen kollisjonsfunksjon. Den som bygger 6.6, skal følge `deferred-work.md`, ikke Design Notes. (Stine / den som tar 6.6)
- **b:** «Mer enn 5 forslag gir bare de 5 første» er tolket som de 5 første *gyldige* (Decisions). Det stemmer med «1–5 økter per oppgave» i FR-49.
- **c:** en hendelse som slutter kl. 00:00, sperrer 07:00–08:00 morgenen etter (FR-45, avvist i triagen, rad 8). Natta sommertiden skifter, kan 8-timersvinduet bli én time feil (godtatt i Design Notes).

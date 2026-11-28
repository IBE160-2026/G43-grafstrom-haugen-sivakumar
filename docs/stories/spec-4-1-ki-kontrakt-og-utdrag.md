---
title: 'Story 4.1: KI-kontrakt og utdrag'
type: 'feature'
created: '2026-11-28'
status: 'ready-for-dev'
baseline_commit: '3b4a5f6c8e4bb9e9876a643a85dfe41d25220d7b'
route: 'dispatch'
story_key: '4-1-ki-kontrakt-og-utdrag'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-4-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Serverruta (4.2), Claude-kallet (4.3), klienten (4.4) og triggeren (4.5) trenger én felles form for forespørsel og svar, og én regel for hva som sendes til KI. Uten den kan hver del sende mer enn FR-15 tillater, og svaret kan få ulik form fra server og mock.

**Approach:** Lag `kjerne/ki-kontrakt.ts` med zod-skjema for forespørsel, svar og modellsvar etter AD-6, og `kjerne/utdrag.ts` med én ren funksjon som lager utdraget etter FR-15 og AD-9. Den kaller `kanSendes`, så 🔒 og samtykke avgjøres bare der. Begge testes med Vitest og fast «nå».

## Boundaries & Constraints

**Always:**
- Ren TypeScript i `kjerne/` (AD-1). Importer bare fra `kjerne/` og `zod`. «Nå» er en `Date`-parameter (AD-5).
- `årsak` bruker `ÅRSAKER` fra `kjerne/reserve.ts`, og feltnavnene stemmer med typen `Feltnavn` der. Det er én liste, sjekket av TypeScript. Etikett, prioritet og øktformen kommer fra `kjerne/skjema.ts`.
- Utdraget er `null` når `kanSendes(oppgave, dokument)` er usann. Ellers inneholder det oppgavetekst, frist og `nå`, notater bare når de finnes og `sendAldriNotater` er av, og aldri fornavn, prosjekt, etikett, prioritet, sammendrag eller id-er.
- Hendelser og økter tas bare med ved `forslag` med `ønsker.økter` og ved `nyTid`. Perioden er fra i dag til og med i dag + 13 dager (14 kalenderdager), men aldri etter fristdagen. En hendelse eller økt fra i går som slutter i dag (slutt før start), tas også med, slik at nattevaktregelen og overlapp i 6.5 kan sjekkes.
- Hendelser har `dato`, `start` og `slutt`, og `tittel` bare når `sendHendelsestitler` er på og hendelsen ikke har `skjulTittelForKi`. Godtatte økter sendes som `opptatt` med bare tidspunkt, også fra oppgaver med 🔒 (FR-38). Ved `nyTid` er økta som skal flyttes, ikke med.
- Forespørselsskjemaet håndhever AD-9: uten `ønsker.økter` (og ikke `nyTid`) avvises et utdrag med periode, hendelser eller opptatt. Forslagskall må ønske minst ett felt eller økter.
- Modellsvaret har formen til mock-svarene fra 5.1 (`felt` med `etikett`, `prioritet` og `sammendrag` som valgfrie strenger, `økter` med `dato`, `start` og `slutt`). Det er bevisst løst, slik at 4.2 kan forkaste ugyldige felt ett og ett (FR-14). API-svaret er strengt.

**Beslutninger (Sabrina, 2026-11-28):**
- **Spørsmål 1 → A: `passerForespørsel(forespørsel, svar)` i kontrakten** (oppfølging 3a fra 2.1). Et `ok`-svar passer bare når `felt` og `forkastet` har felt fra `ønsker.felt` og hvert felt står høyst ett av stedene, `økter` er tom uten `ønsker.økter`, og et `nyTid`-svar har tomme `felt` og `forkastet` og høyst én økt. Et `reserve`-svar passer alltid. 4.2 kaller funksjonen og gir `reserve: ugyldig` ved brudd. Da kan reserveløsningen aldri få `forkastet` med felt kallet ikke ba om.
- **Spørsmål 2 → A: `nå` sendes i hvert utdrag** som `YYYY-MM-DDTHH:mm` i lokal tid. KI trenger datoen for å unngå økter i fortiden og for å bedømme hvor nær fristen er. Det er ikke en personopplysning, og «Hva sendes til KI» endres ikke.
- **Lengde:** specen beholdes samlet (ca. 2 500 tokens), fordi akseptansekriteriene i epics.md binder kontrakt og utdrag sammen, og fordi utdraget avhenger av `utdragSkjema`.
- **Rekkefølge:** implementeringen starter først når story 3.1 er godkjent av Stine (`done`), etter arbeidsmetoden i epics.md.

**Never:**
- Ingen serverrute, mock, prompt, Claude-kall, klient eller trigger (4.2–4.5). Ingen kontroll av modellsvaret mot FR-14/FR-49 (4.2, 6.5). Ingen maskering av telefonnumre (4.10).
- Ikke endre `kjerne/reserve.ts`, `kjerne/samtykke.ts`, `kjerne/skjema.ts` eller mock-filene. Ingen nye pakker. Ingen gjentatte hendelser (5.7).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Bare felt | `forslag`, KI på, notater, `sendAldriNotater` av | tekst, frist, notater. Ingen periode, hendelser eller opptatt | N/A |
| Notater av | samme, `sendAldriNotater` på | uten notater | N/A |
| 🔒 | `skjultForKi: true` | `null` | N/A |
| KI av | `samtykke` nei, `null` eller gammel versjon | `null` | N/A |
| Fornavn | `profil.fornavn` «Ida» | «Ida» finnes ikke i utdraget | N/A |
| Med økter | `ønsker.økter`, frist om 5 dager | periode i dag–fristdagen, hendelser og opptatt i perioden | N/A |
| Lang frist | frist om 30 dager | periode i dag–i dag + 13 | N/A |
| Utenfor perioden | hendelse i går (vanlig), dagen etter fristen | ikke med | N/A |
| Nattevakt i går | i går 21:00–07:30 | med | N/A |
| Titler av | `sendHendelsestitler` av | ingen `tittel` | N/A |
| Hendelse 🔒 | `skjulTittelForKi: true`, titler på | uten `tittel` | N/A |
| Opptatt fra 🔒-oppgave | godtatt økt på en annen oppgave med 🔒 | med som opptatt | N/A |
| `nyTid` | øktId for en godtatt økt | periode med, økta selv ikke i opptatt | N/A |
| Ugyldig forespørsel | `forslag` uten `ønsker.økter`, men med hendelser | `safeParse` feiler | Ruta (4.2) avviser |
| Mock-svar | `okter-gyldig.json`, `okter-bryter-fr49.json` | `svar` passer modellsvaret | N/A |
| «Nå» | «nå» 2026-11-03 09:05 | `nå: "2026-11-03T09:05"` | N/A |
| Svar passer | `forslag` ønsker etikett og prioritet, `ok` med etikett og `forkastet: ["prioritet"]` | `passerForespørsel` sann | N/A |
| Uønsket felt | `forslag` ønsker bare økter, `ok` med `forkastet: ["etikett"]` | usann | 4.2 gir `reserve: ugyldig` |
| Felt to steder | `felt.etikett` og `forkastet: ["etikett"]` | usann | 4.2 gir `reserve: ugyldig` |
| Økter uten ønske | `ønsker.økter: false`, `ok` med én økt | usann | 4.2 gir `reserve: ugyldig` |
| `nyTid` | `ok` med to økter, eller med et felt | usann | 4.2 gir `reserve: ugyldig` |
| Reserve | alle kall, `reserve` med en årsak | sann | N/A |

</frozen-after-approval>

## Code Map

- `kjerne/samtykke.ts` -- `kanSendes(oppgave, dokument)` (`Pick<Dokument, "samtykke">`). Utdraget kaller den og gjentar ikke 🔒 eller samtykke. Ikke endre.
- `kjerne/reserve.ts:24,37` -- `ÅRSAKER` (konstant) og `Feltnavn` (bare type). Lag `FELTNAVN` i kontrakten med `satisfies readonly Feltnavn[]` og en typesjekk begge veier. Ikke endre `reserve.ts`.
- `kjerne/skjema.ts` -- `etikettSkjema`, `prioritetSkjema`, `øktForslagSkjema` (`.omit({ id: true })` for økter i svar), `Oppgave`, `Hendelse`, `Økt`, `Innstillinger`, `Dokument`.
- `kjerne/hendelser.ts` -- `slutterNesteDag` for nattevakt fra i går. `kjerne/tid.ts` -- `lokalDato`, `lokaltKlokkeslett`, `dagnummer` for perioden.
- `tests/kjerne/fikstur.ts` -- `fulltDokument()` (samtykke ja v1, `sendAldriNotater: true`, `sendHendelsestitler: false`, hendelse med 🔒). Bygg varianter med spredning.
- `tests/ki-testsett/mock/okter-*.json` -- `svar` er modellsvaret. `tests/ki-testsett/README.md:92` sier «Story 4.1 låser den endelige formen».
- `docs/architecture/.../ARCHITECTURE-SPINE.md:88-118` -- AD-6 og AD-9. PRD FR-15, FR-38, FR-39, FR-58, FR-59.

## Tasks & Acceptance

**Execution:**
- [ ] `kjerne/ki-kontrakt.ts` -- `FELTNAVN`, `utdragSkjema`, `forespørselSkjema` (diskriminert på `type`, med AD-9-reglene som `superRefine`), `modellsvarSkjema` (løst), `kiSvarSkjema` (`ok` strengt med `felt`, `økter`, `forkastet`, eller `reserve` med `årsak`), typer via `z.infer`, og `passerForespørsel(forespørsel, svar): boolean` etter Beslutninger.
- [ ] `kjerne/utdrag.ts` -- `lagUtdrag(oppgave, dokument, nå, kall)`. `dokument` er `Pick<Dokument, "samtykke" | "hendelser" | "økter" | "innstillinger">` og `kall` er `{ type: "forslag"; økter: boolean } | { type: "nyTid"; øktId: string }`. Gir `Utdrag | null`, og resultatet passer `utdragSkjema`.
- [ ] `tests/kjerne/ki-kontrakt.test.ts` -- gyldige og ugyldige forespørsler og svar, at `årsak` er lik `ÅRSAKER`, at begge mock-svarene passer `modellsvarSkjema`, og hver rad for `passerForespørsel` i matrisen.
- [ ] `tests/kjerne/utdrag.test.ts` -- én test per rad i matrisen, pluss grensene i perioden (i dag, i dag + 13, i dag + 14, fristdagen), frist i fortiden, ingen frist med `nyTid`, og at `JSON.stringify(utdrag)` aldri inneholder fornavn, prosjekt eller id-er.
- [ ] `tests/ki-testsett/README.md` -- bytt setningen «Story 4.1 låser den endelige formen …» med at formen er låst av `modellsvarSkjema` i `kjerne/ki-kontrakt.ts`. Lukker oppfølging b fra 5.1.

**Acceptance Criteria:**
- Given `kjerne/ki-kontrakt.ts`, when forespørsler og svar fra AD-6 valideres, then godtas de gyldige formene og alle andre avvises.
- Given `kjerne/utdrag.ts` og `kjerne/ki-kontrakt.ts`, when det søkes etter `Date.now(`, `new Date()`, `skjultForKi` og `samtykke.svar`, then finnes ingen treff, og importene er bare fra `kjerne/` og `zod`.
- Given `npm test`, `npm run lint` og `npm run typecheck`, when de kjøres, then går de uten feil.

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

- **Perioden** regnes i dagnummer (`dagnummer`), ikke i millisekunder, så sommertid ikke gir feil: `til = min(i dag + 13, frist)`. Er fristen før i dag, blir perioden tom, og hendelser og opptatt blir tomme lister.
- **Tre skjema:** `utdragSkjema` og `forespørselSkjema` (nettleser → server), `modellsvarSkjema` (Claude/mock → server, løst) og `kiSvarSkjema` (server → nettleser, strengt). Det API-et returnerer, inneholder bare verdier som har bestått kontrollen.

```ts
type Utdrag = {
  oppgave: { tekst: string; frist: string | null; notater?: string };
  nå: string; // "YYYY-MM-DDTHH:mm", lokal tid
  periode?: { fra: string; til: string };
  hendelser?: { dato: string; start: string; slutt: string; tittel?: string }[];
  opptatt?: { dato: string; start: string; slutt: string }[];
};
```

## Verification

**Commands:**
- `npx vitest run tests/kjerne` -- forventet: alle grønne
- `npm test`, `npm run lint`, `npm run typecheck` -- forventet: ingen feil
- `grep -nE 'Date\.now\(|new Date\(\)|skjultForKi|samtykke\.svar' kjerne/ki-kontrakt.ts kjerne/utdrag.ts` -- forventet: ingen treff

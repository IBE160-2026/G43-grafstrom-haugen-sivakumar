---
title: 'Story 5.1: Planleggingscaser i KI-testsettet'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: '16c2dddce80ca9a0c401152234f63e44a2c9124b'
route: 'dispatch'
story_key: '5-1-planleggingscaser-i-ki-testsettet'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-5-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Suksesskriteriet for øktforslag («minst én økt per case, og alle økter holder FR-49», sjekket med regler) kan ikke måles, fordi KI-testsettet bare har oppgaver uten hendelser. Story 6.4 og 6.5 trenger faste planleggingscaser og to mock-svar med økter.

**Approach:** Legg til `tests/ki-testsett/planleggingscaser.json` med 6 caser (fast «nå», oppgavetekst, frist, hendelser, godtatte økter og om titler sendes), to mock-svar under `tests/ki-testsett/mock/`, en Vitest-test som sjekker formatet og kravene til dekning, og en ny del i README.

## Boundaries & Constraints

**Always:**
- Ukene starter mandag 2026-11-02, som er referansedatoen i `testsett.json`. Alle datoer i casene ligger i uka 2026-11-02–08.
- Datoer er `YYYY-MM-DD`, klokkeslett `HH:mm` og «nå» `YYYY-MM-DDTHH:mm`, alt i lokal tid uten sone (AD-5). JSON-nøklene er norske med æøå.
- Hendelsene har feltene `tittel`, `dato`, `start`, `slutt` og `skjulTittelForKi`, og navnene og formene er de samme som i `hendelseSkjema`. Slutt før start betyr neste dag (FR-45).
- Hver case skal kunne få minst én økt som holder FR-49. Det gyldige mock-svaret skal holde FR-49 for casen sitt, og det ugyldige skal ha nøyaktig én økt som bryter FR-49. Begge kontrolleres for hånd mot FR-49 og skrives ned i README.
- Det åpne punktet om at gruppa skal gå gjennom de forventede svarene, føres i `issues.md` av sesjonsloggen.

**Never:**
- Ingen FR-49-sjekk i kode. Den hører til `kjerne/` i story 6.4 (AD-1), og testen her sjekker bare form og dekning.
- Ikke endre `testsett.json`, de eksisterende testene, `kjerne/` eller `server/`.
- Ikke lag mock-filene `gyldig`/`ugyldig`/`tomt`/`tidsavbrudd`/`treg-10s` (story 4.2), og ikke lag nye `x-ki-mock`-verdier.
- Ingen nye pakker.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Vanlig uke | Case 1: forelesning, vakt, trening og én godtatt økt fra en annen oppgave | Plass til økter før fristen | N/A |
| Nattevakt | Case 2: to nattevakter 21:00–07:30 | Ingen økt før 15:30 dagen etter | N/A |
| 🔒 | Case 3: «Legetime» med `skjulTittelForKi: true` | KI får bare vite at hun er opptatt | N/A |
| Titler av | Case 4: `sendHendelsestitler: false` | Ingen titler sendes, alle tider sendes | N/A |
| Frist i morgen | Case 5: «nå» mandag 19:00, frist tirsdag | Bare korte hull, men minst én gyldig økt | N/A |
| Frist i dag | Case 6: «nå» fredag 10:00, frist fredag | Ingen økt før «nå» eller etter 23:00 | N/A |
| Mock gyldig | `okter-gyldig.json` → case 1 | 3 økter, alle holder FR-49 | N/A |
| Mock bryter | `okter-bryter-fr49.json` → case 2 | 3 økter, én innenfor 8 t etter nattevakt | Story 6.4 forkaster den |

</frozen-after-approval>

## Code Map

- `tests/ki-testsett/testsett.json` -- eksisterende format med `beskrivelse` + `referansedato` (2026-11-02). Følg samme toppnivåform. Ikke endre.
- `tests/ki-testsett/README.md` -- har «Format» og «Slik vurderes svarene» for oppgavene. Legg til en ny del med egen overskrift. Ikke skriv om det som står der fra før.
- `kjerne/skjema.ts` -- `hendelseSkjema` (feltnavn for hendelser), `øktForslagSkjema` (`dato`/`start`/`slutt`) og `innstillingerSkjema.sendHendelsestitler`. Testen gjenbruker `hendelseSkjema.pick(...)` for å sjekke hendelsene.
- `tests/kjerne/reserve.test.ts` -- viser hvordan JSON importeres i Vitest (`import testsett from "../ki-testsett/testsett.json"`).
- `vitest.config.mts` -- tar med `tests/**/*.test.ts`, så den nye testen kjøres uten endring.
- `docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/prd.md:140` -- FR-49, ordrett grunnlag for README.
- `docs/architecture/.../ARCHITECTURE-SPINE.md:92-96, 153` -- AD-6 (svarform `felt` og `økter`) og AD-14 (mock erstatter Claude-kallet).

## Tasks & Acceptance

**Execution:**
- [x] `tests/ki-testsett/planleggingscaser.json` -- 6 caser som i matrisen. Hver har `id`, `beskrivelse`, `nå`, `oppgave` (`tekst`, `frist`), `hendelser`, `godtatteØkter` (`dato`/`start`/`slutt`) og `sendHendelsestitler`, pluss toppnivå `forventet` med «minst én økt, og alle økter holder FR-49» -- fast grunnlag for 6.4, 6.5 og 4.8.
- [x] `tests/ki-testsett/mock/okter-gyldig.json` og `tests/ki-testsett/mock/okter-bryter-fr49.json` -- `{ "planleggingscase": <id>, "svar": { "felt": {...}, "økter": [...] } }` -- mock-svar til Epic 6.
- [x] `tests/ki-testsett/planleggingscaser.test.ts` -- sjekker formatet og dekningen (se AC) -- slik at feil i dataene oppdages før Epic 6.
- [x] `tests/ki-testsett/README.md` -- ny del «Planleggingscaser»: format, FR-49-reglene, forventet resultat, tabell over casene og hva hver tester, og de to mock-svarene med hvilken økt som bryter hvilken regel.

**Acceptance Criteria:**
- Given `planleggingscaser.json`, when testen kjører, then finnes minst 5 caser med unik `id`, gyldig «nå», frist som ikke er før dagen for «nå», og hendelser som passer `hendelseSkjema`-feltene.
- Given casene, when testen kjører, then har minst én case en hendelse med slutt før start, minst én en hendelse med `skjulTittelForKi: true`, og minst én `sendHendelsestitler: false`.
- Given de to mock-svarene, when testen kjører, then peker de på en case som finnes, og hver økt har gyldig `dato`, `start` og `slutt`.
- Given README, when den leses, then beskriver den formatet og at forventet resultat er «minst én økt, og alle økter holder FR-49».

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Bevis / rute |
|---|---|---|---|---|
| 1 | VG, BH, ECH | Datoene i mock-øktene sjekkes ikke mot uka, «nå» og fristen for casen | low | Stemmer, testen sjekker bare form. Rettes som patch (ny test). |
| 2 | VG | `økt.safeParse` i mock-testen gjentar det `mockSkjema.parse` har sjekket | low | Stemmer. Patch (fjern linja). |
| 3 | BH | Loggen sier «23 tester», men fila har 25 | low | Det stemte da loggen ble skrevet. Etterpå la hovedøkta til 2 tester. Rettes i sesjonsloggen. |
| 4 | BH | Sprint-status står på `in-progress` | false | Step 5 setter `review`, gjennomgangen kjører før det. |
| 5 | BH | Ingen case har nattevakt sammen med titler av | low | Stemmer, og story 6.4 sjekker uttrykkelig at nattevaktregelen virker uten titler. Patch: nattevakt i case 4 og en dekningstest. |
| 6 | BH | Bryter-mocken bryter bare én regeltype | false | Akseptansekriteriet ber om nøyaktig én økt som bryter FR-49. |
| 7 | BH, ECH | Eksempeløkta i case 6 (10:00–12:00) starter ved «nå» og ligger kant i kant med to hendelser | low | Stemmer. Om den er gyldig, kommer an på hvordan 6.4 tolker grensene. Patch: eksempel 10:30–11:30. |
| 8 | BH | `referansedato` er hardkodet i stedet for å sammenlignes med `testsett.json` | low | Stemmer. Patch (importer og sammenlign). |
| 9 | BH, ECH | `parse` ved lasting gir feil ved innsamling i stedet for en vanlig testfeil | false | Suiten blir rød uansett, og det er en tydelig feil, ikke en stille. |
| 10 | BH, ECH | Ingen sjekk av overlapp mellom hendelser og godtatte økter, eller av grensene for godtatte økter | low (avvist) | Ingen feil i dataene i dag. Å sjekke dette krever overlappslogikk, som hører til 6.4 (Never: FR-49 i kode). |
| 11 | BH, ECH | En nattevakt på søndag ville slutte utenfor uka uten at noe sier fra | low (avvist) | Ingen slik hendelse finnes. En vakt mot dette ville gitt mer logikk for en hypotetisk feil. |
| 12 | BH | Felles `forventet` på toppnivå låser én forventning for alle casene | false | Akseptansekriteriet sier at forventet resultat er det samme for alle casene. |
| 13 | BH, ECH | README sier «Løpenummer 1–6», og testen sjekker ikke rekkefølgen | low | Teksten går ut på dato når noen legger til en case. Patch: «Løpenummer fra 1». |
| 14 | BH | «parallel» i epic-5-context | false | Ordrett fra ARCHITECTURE-SPINE.md:159 (Next-begrepet «parallel routes»). |
| 15 | BH | Løs JSDoc etter importene | low | Stemmer. Patch (flytt til en kommentar øverst i fila). |
| 16 | BH | README sier «før fristdagen» om den gyldige mocken | false | Påstanden stemmer: alle tre øktene ligger før fredag. |
| 17 | ECH | Godtatte økter og mock-økter med slutt ≤ start godtas | low (avvist) | Ingen slike data finnes. Å rette det krever en ny refine-vakt mot en hypotetisk feil. |
| 18 | ECH | Sjekken av lik start og slutt gjelder bare hendelser | low (avvist) | Samme som 17. |

## Design Notes

- **Egen fil i stedet for å utvide `testsett.json`:** Casene har en annen form (hendelser, «nå» med klokkeslett), og `reserve.test.ts` leser `oppgaver` derfra.
- **Mock-form:** Mocken erstatter Claude-kallet (AD-14), så `svar` er det Claude ville returnert: `felt` med rene verdier (`etikett`, `prioritet`, `sammendrag`) og `økter` uten `id`. `type`, `forkastet` og `kilde` legges til av serveren og appen. `planleggingscase` sier hvilken case svaret gjelder. Story 4.1 låser den endelige formen. Avviker den, justeres disse to filene der.
- **Bryter-mocken bruker nattevaktregelen** (økt onsdag 09:00–11:00 etter vakt som slutter 07:30). Det er den regelen som er lettest å bomme på, og den virker uten titler.

## Verification

**Commands:**
- `npx vitest run tests/ki-testsett` -- expected: alle tester grønne
- `npx vitest run` -- expected: ingen eksisterende tester brekker
- `npx tsc --noEmit` -- expected: ingen typefeil

## Implementation Notes

## Gjennomgang (Sabrina, 2026-11-28): godkjent

Gått gjennom med `bmad-walkthrough` mot commit `5934320`.

- `npx vitest run tests/ki-testsett` 28/28, `npm test` 375/375, og `npm run lint` og `npm run typecheck` uten feil.
- Alle akseptansekriteriene i epics.md er oppfylt: 6 caser, nattevakt over midnatt (case 2 og 4), 🔒 (case 3), titler av (case 4), README med format og forventet resultat, ett gyldig mock-svar og ett med én økt som bryter FR-49, og det åpne punktet om gjennomgang i gruppa er ført i Stines `issues.md`.
- Kontrollert mot `sjekkØktforslag` fra story 6.4 med en midlertidig testfil: alle seks eksempeløktene i README godtas, `okter-gyldig.json` gir 3/3 godtatt, og `okter-bryter-fr49.json` gir nøyaktig onsdagsøkta forkastet med `etter-nattevakt`. Håndkontrollen i README stemmer. Det er nå også låst i `tests/kjerne/okter.test.ts`.

Oppfølging (blokkerer ikke):
- **a:** `caseSkjema` i `planleggingscaser.test.ts` godtar en case uten hendelser (`z.array(hendelse)`), men kriteriet sier «hver med … hendelser». Alle casene har 2–6 hendelser i dag. Forslag: `.min(1)`. (Stine)
- **b:** mock-formen er foreløpig. Låser kontrakten i story 4.1 (Sabrina, spor C) en annen svarform, må `tests/ki-testsett/mock/okter-gyldig.json` og `okter-bryter-fr49.json` justeres. Notert på 4.1 i sprint-status.
- **c:** gruppa har ennå ikke gått gjennom de forventede svarene sammen (åpent punkt i Stines `issues.md`). Kontrollen mot 6.4 over kan brukes som grunnlag.

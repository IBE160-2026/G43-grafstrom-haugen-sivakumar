---
title: 'Story 5.2: Hendelsesregler i kjernen'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: '67f049a98bb0f1d0c67177647e2f99aeb2c16fbe'
route: 'dispatch'
story_key: '5-2-hendelsesregler-i-kjernen'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-5-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Det finnes ingen regler for hendelser i koden. Story 5.3–5.6 trenger validering, visning av klokkeslett med «(+1 dag)» og utvalget av dagens hendelser til «I dag». Uten felles regler blir en nattevakt over midnatt fort feil (FR-44, FR-45, FR-48).

**Approach:** Lag `kjerne/hendelser.ts` med rene funksjoner for validering av et hendelsesutkast, tidsvisning og dagens hendelser ut fra «nå». Lag `kjerne/tid.ts` med de to hjelperne som gjør `Date` om til lokal dato og lokalt klokkeslett, slik at 1.5 og 6.4 kan bruke dem senere. Alt testes med Vitest og fast «nå».

## Boundaries & Constraints

**Always:**
- Ren TypeScript i `kjerne/` (AD-1). Importer bare fra `kjerne/` og `zod`. «Nå» kommer inn som `Date`-parameter, ingen `Date.now()` eller `new Date()` uten argument (AD-5).
- Datoer er `YYYY-MM-DD` og klokkeslett `HH:mm` i lokal tid. `kjerne/tid.ts` bruker de lokale getterne (`getFullYear`, `getHours` …), aldri UTC.
- Valideringen tar et utkast med strengene `tittel`, `dato`, `start` og `slutt`, og returnerer feilkoder per felt, ingen tekster. Tittel med bare mellomrom regnes som tom. Formatene sjekkes med feltene i `hendelseSkjema` fra `kjerne/skjema.ts`.
- Slutt før start betyr at hendelsen slutter neste dag. Lik start og slutt er ugyldig (feilkode på `slutt`).
- Tidsvisningen er `"HH:mm – HH:mm"` med tankestrek og mellomrom, og ` (+1 dag)` til slutt når hendelsen slutter neste dag.
- En hendelse er over når «nå» er lik eller senere enn slutten (minuttnivå). Dagens hendelser sorteres etter starttid.

**Never:**
- Ingen tekster i `kjerne/tekster.ts` («Slutt må være etter start» legges inn i 5.3 sammen med skjemaet).
- Ingen gjentakelse eller `foldUt` (5.7), ingen kollisjonssjekk eller øktgrenser (6.4).
- Ikke endre `kjerne/skjema.ts`, butikken, `lib/` eller UI. Ingen nye pakker.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Gyldig | «Vakt», 2026-11-03, 16:00–21:00 | gyldig, visning «16:00 – 21:00» | N/A |
| Over midnatt | 21:00–07:30 | gyldig, visning «21:00 – 07:30 (+1 dag)» | N/A |
| Lik start og slutt | 10:00–10:00 | ugyldig | `slutt`: `lik-start` |
| Manglende felt | tittel «  », dato tom | ugyldig | `tittel`/`dato`: `påkrevd` |
| Ugyldig format | dato 2026-02-30, start «9:00» | ugyldig | `dato`/`start`: `ugyldig` |
| Dagens, sortert | «nå» 08:00, hendelser i dag 12:00 og 09:00, én i morgen | 09:00, 12:00 | N/A |
| Grensen ved slutt | «nå» 12:00, hendelse 10:00–12:00 | er over, ikke med | N/A |
| Ett minutt før | «nå» 11:59, samme hendelse | med | N/A |
| Nattevakt i dag | «nå» 22:00, hendelse i dag 21:00–07:30 | med | N/A |
| Nattevakt fra i går | «nå» tirsdag 02:00, hendelse mandag 21:00–07:30 | med, først i lista | N/A |
| Nattevakt fra i går, over | «nå» tirsdag 07:30, samme hendelse | ikke med | N/A |
| Vanlig hendelse fra i går | «nå» tirsdag 02:00, hendelse mandag 16:00–21:00 | ikke med | N/A |

## Decisions

- **Nattevakt fra i går vises til den er over (valgt av Stine 2026-11-27):** «Dagens hendelser» er hendelser med dagens dato som ikke er over, pluss hendelser fra i går som slutter neste dag og ikke er over ennå. Slike hendelser fra i går står først, fordi de startet tidligst.

</frozen-after-approval>

## Code Map

- `kjerne/skjema.ts` -- `hendelseSkjema` og typen `Hendelse`. Bruk `hendelseSkjema.shape.dato`/`.start` til formatsjekk. Ikke endre fila.
- `kjerne/reserve.ts` -- husstil for en kjernemodul: JSDoc øverst med AD-/FR-henvisninger, eksporterte konstanter med STORE bokstaver, norske navn med æøå.
- `lib/store/index.ts:15` -- `nå: Date | null` i butikken. Kjernen får `Date`, aldri `null` (kalleren sjekker).
- `tests/kjerne/reserve.test.ts`, `tests/kjerne/fikstur.ts` -- teststil (`describe`/`it` på norsk, `@/kjerne/...`-import).
- `docs/stories/spec-5-1-planleggingscaser-i-ki-testsettet.md` -- de faste casene. Nattevaktene der (21:00–07:30) er gode testdata, men testen her trenger ikke importere dem.

## Tasks & Acceptance

**Execution:**
- [x] `kjerne/tid.ts` -- `lokalDato(nå: Date): string` (`YYYY-MM-DD`) og `lokaltKlokkeslett(nå: Date): string` (`HH:mm`) -- felles for 1.5, 5.x og 6.4.
- [x] `kjerne/hendelser.ts` -- `validerHendelse(utkast)` → `{ gyldig: true } | { gyldig: false, feil: Partial<Record<"tittel"|"dato"|"start"|"slutt", "påkrevd"|"ugyldig"|"lik-start">> }`, `slutterNesteDag(h)`, `visTid(h)`, `erOver(h, nå)` og `dagensHendelser(hendelser, nå)`. Funksjonene tar bare feltene de trenger (`Pick<Hendelse, …>`), slik at 5.3 kan validere før en `Hendelse` finnes.
- [x] `tests/kjerne/tid.test.ts` og `tests/kjerne/hendelser.test.ts` -- én test per rad i matrisen, pluss månedsskifte og årsskifte for nattevakter og `lokalDato`. «Nå» lages med `new Date(år, måned, dag, t, m)` slik at testene ikke avhenger av tidssonen på maskinen.

**Acceptance Criteria:**
- Given en hendelse 23:30–00:30 den 31.12, when `erOver` får «nå» 2027-01-01 00:15, then er den ikke over, og ved 00:30 er den over.
- Given `kjerne/hendelser.ts` og `kjerne/tid.ts`, when `npx eslint kjerne` og et søk etter `Date.now(` og `new Date()` kjøres, then finnes ingen treff og ingen import utenfor `kjerne/` og `zod`.

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Bevis / rute |
|---|---|---|---|---|
| 1 | VG, BH | Regningen av neste dag skal tåle sommertid, men ingen test går over et skifte, og tidssonen i testene er ikke låst | low | Stemmer. Begrunnelsen i Design Notes blir ikke testet. Patch: lås `TZ` til Europe/Oslo i `vitest.config.mts` (AD-5) og legg til tester for 2026-03-29 og 2026-10-25. |
| 2 | BH | Når klokka stilles tilbake, kan en vakt som slutter 02:30, dukke opp igjen i 30 minutter | low (avvist) | Stemmer, men det skjer én natt i året i et halvtimesvindu. Å rette det krever sammenligning av tidspunkter med tvetydig lokal tid. |
| 3 | BH | Testen for skuddårsdagen er svak, og et vanlig år fra 28.02 til 01.03 mangler | low | Stemmer. Den andre sjekken er alltid sann. Patch: sjekk 07:29/07:30 og legg til 2027-02-28. |
| 4 | BH | Spesifikasjonen mangler i diffen, og statusene er ulike | false | Spesifikasjonen holdes utenfor diffen med vilje, og step 5 setter `review`. |
| 5 | BH | Rekkefølgen er ikke fastsatt når to hendelser har lik start | low (avvist) | Sorteringen er stabil og beholder lagret rekkefølge. Ingen faktisk skade. |
| 6 | BH | Valideringen gir ikke tilbake en trimmet tittel | low | Stemmer, 5.3 kan lagre «  Vakt  ». Patch: si i JSDoc at kalleren trimmer. |
| 7 | BH, ECH | `erOver`/`dagensHendelser` sjekker ikke formatet på input, og år 0000–0099 tolkes som 1900-tallet | false | Hendelsene kommer fra et dokument som er validert med `dokumentSkjema` ved lasting (AD-3). År under 100 kan ikke skrives i datofeltet. |
| 8 | BH | Mangler test for slutt kl. 00:00 og for nattevakt fra i forgårs | low | Stemmer. Patch: tester for 22:00–00:00 og for en hendelse to dager tilbake. |
| 9 | BH | `HENDELSESFELT`/`HENDELSESFEIL` er ikke testet | false | Typen `feil` er `Hendelsesfeil`, så TypeScript sørger for at bare disse kodene kan brukes. |
| 10 | BH | Kommentaren i testen nevner ikke ONSDAG | low | Stemmer. Patch (rett kommentaren). |
| 11 | ECH | Ugyldig «nå» gir NaN-strenger (to funn) | false | «Nå» kommer bare fra `lib/klokke.ts` som `new Date()` og er aldri ugyldig. |
| 12 | ECH | Tittel med tegn uten bredde (U+200B) godtas | low (avvist) | Lite sannsynlig i vanlig bruk, og å rette det krever en ny vakt. |
| 13 | ECH | Mangler korrigering av datoer i lagrede data | false | Samme som 7. |

## Design Notes

- **`erOver` regner slutten ut fra datoen.** Slutten er `dato + slutt`, og en dag legges til når hendelsen slutter neste dag. Sammenlign som strengene `"YYYY-MM-DDTHH:mm"` for slutten og for `lokalDato(nå) + "T" + lokaltKlokkeslett(nå)`. Det gir riktig rekkefølge uten tidssoneregning. Neste dag finnes med `Date`-aritmetikk på datoen (lokal midnatt + 1 dag), ikke ved å legge 24 t til et tidspunkt, så sommertid ikke slår feil.
- **Feilkoder, ikke tekster.** 5.3 gjør `lik-start` om til «Slutt må være etter start» og legger teksten i `kjerne/tekster.ts`.

## Verification

**Commands:**
- `npx vitest run tests/kjerne` -- expected: alle grønne
- `npx vitest run` -- expected: ingen eksisterende tester brekker
- `npx tsc --noEmit` og `npx eslint kjerne tests/kjerne` -- expected: ingen feil

## Implementation Notes

## Gjennomgang (Sabrina, 2026-11-28): godkjent

Gått gjennom med `bmad-walkthrough` mot commit `27f12e0`. Story 1.5 og 6.4 har senere bare lagt nye funksjoner til i `kjerne/tid.ts`.

- `tests/kjerne/hendelser.test.ts` og `tid.test.ts` 38/38, `npm test` 375/375, og `npx eslint kjerne tests/kjerne` og `npx tsc --noEmit` uten feil.
- Alle akseptansekriteriene i epics.md og specen er oppfylt. Ingen `Date.now(` eller `new Date()` i `kjerne/`. Importene er bare `./skjema` og `./tid`. Tankestreken i `visTid` er det samme tegnet som i FR-45.

Merknader (blokkerer ikke):
- **a:** natta klokka stilles tilbake til vintertid, vises en hendelse som slutter mellom 02:00 og 03:00, igjen i «I dag» til den lokale sluttiden kommer for andre gang. Bekreftet ved kjøring: en vakt 2026-10-24 21:00–02:30 er borte kl. 02:30 sommertid, er med igjen kl. 02:00 vintertid og er borte kl. 02:30 vintertid. Dette bryter ikke akseptansekriteriene. «Over» er definert som lokal veggklokke på minuttnivå, og den natta er en lokal sluttid som 02:30 tvetydig. Avvist av Stine i Review Triage Log (rad 2), og jeg er enig.
- **b:** `## Implementation Notes` er tom og står etter Verification. Ingen følger for koden.

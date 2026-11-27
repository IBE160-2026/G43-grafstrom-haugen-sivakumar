# Story 5.2: Hendelsesregler i kjernen

## 2026-11-27 kl. 20:27 — Stine Olsen

### Oppgave
Starte story 5.2 med `bmad-build`: rene regler for hendelser i kjernen (validering, «(+1 dag)»-visning og dagens hendelser ut fra «nå»), slik at 5.3–5.6 og 6.4 bygger på samme regler og en nattevakt over midnatt blir riktig.

### Plan
- Spesifikasjon: [spec-5-2-hendelsesregler-i-kjernen.md](../../docs/stories/spec-5-2-hendelsesregler-i-kjernen.md), kontekst i `docs/stories/epic-5-context.md`.
- Beslutning (Stine): en nattevakt fra i går vises øverst i «I dag» til den er over.
- Implementering av underagent, deretter gjennomgang med tre lag: 16 funn, 6 rettet, 6 falske, 4 avvist (triage i spesifikasjonens «Review Triage Log»).

### Resultat
- Ny `kjerne/tid.ts`: `lokalDato` og `lokaltKlokkeslett` (lokal tid, til bruk også i 1.5 og 6.4).
- Ny `kjerne/hendelser.ts`: `validerHendelse` (feilkoder `påkrevd`/`ugyldig`/`lik-start`, ingen tekster), `slutterNesteDag`, `visTid` («21:00 – 07:30 (+1 dag)»), `erOver` (over når «nå» ≥ slutt) og `dagensHendelser` (dagens + nattevakt fra i går som ikke er over, sortert etter start).
- Nye `tests/kjerne/tid.test.ts` og `tests/kjerne/hendelser.test.ts`: hver rad i matrisen, måneds- og årsskifte, skuddår og vanlig år, slutt kl. 00:00, nattevakt fra i forgårs og sommertidsskiftene 2026-03-29 og 2026-10-25.
- `vitest.config.mts`: `process.env.TZ = "Europe/Oslo"`, så sommertid kan testes og resultatet ikke avhenger av maskinen (AD-5).
- Verifisert: `npx vitest run` 292/292 grønne, `npx tsc --noEmit` og `npx eslint` uten feil.
- Spesifikasjonen er `done`, story 5.2 står som `review` i sprint-status. Commit `27f12e0`.

### Åpne punkter
- En i gruppa går gjennom story 5.2 (status `review`).
- Si fra til gruppa at `vitest.config.mts` nå låser tidssonen til Europe/Oslo for alle Vitest-tester.
- Kjent begrensning: natta klokka stilles tilbake (siste søndag i oktober) kan en hendelse som slutter mellom 02:00 og 03:00, dukke opp igjen i «I dag» i opptil en time. Bevisst ikke rettet.
- Story 5.3 må trimme tittelen før lagring og legge «Slutt må være etter start» i `kjerne/tekster.ts`.

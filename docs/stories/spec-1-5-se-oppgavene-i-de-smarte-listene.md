---
title: 'Story 1.5: Se oppgavene i de smarte listene'
type: 'feature'
created: '2026-11-28'
status: 'done'
baseline_commit: '8dd3e66504983a247f77f71b9172b41068919583'
route: 'dispatch'
story_key: '1-5-se-oppgavene-i-de-smarte-listene'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Oppgaver-siden viser bare «Oppgavene dine kommer snart.» Studenten ser ikke hva som haster, og reglene for de fem smarte listene finnes ikke.

**Approach:** En ren `kjerne/smarte-lister.ts` som grupperer og sorterer aktive oppgaver etter frist med «nå» som parameter, og en klientliste på `/` med gruppeoverskrifter, oppgavekort og tomtilstander. Ingen oppretting eller redigering (1.6/1.7).

## Boundaries & Constraints

**Always:** FR-20–24 og AD-1/AD-5: hver aktiv oppgave i nøyaktig én liste ut fra `frist` og lokal dato fra `nå`; uka mandag–søndag; fullførte (`fullført !== null`) utelates; listene regnes ut og lagres aldri. Rekkefølge: frist stigende, så prioritet Høy → Middels → Lav, så `createdAt` eldste først; «Ingen frist» uten fristleddet. Kortet viser ring, tittel, sammendrag med «✦» i `accent-ink` på en linje under (når det finnes) og merkelappene prosjekt, frist og prioritet; Høy i `warn` med tekst; forfalte kort med 4 px stripe i `warn`. Gruppeoverskrift (`<h2>`) i `section-label` og `text-muted` med antall, alle på formen «I DAG · 3» (kildetekst «I dag», store bokstaver via CSS), FORFALT i `warn`. Lista starter under glødsonen (DESIGN.md): den ligger på `bg-surface-base`, så `warn` og `text-muted` aldri står på gløden. Tomme grupper skjules unntatt «I dag». Farge er aldri eneste signal. Tekster i du-form.

**Never:** Ingen klikk på kort eller ring (detalj i 1.7, avhuking i 2.2) — ringen er dekor (`aria-hidden`), ingen døde knapper. Ingen filter, sortering, søk (2.5/2.6), hendelser (5.4) eller økter (6.1). Ingen datolinje under hilsenen. Ingen «+ Ny oppgave»-knapp (1.6).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Testsettet | 20 oppgaver, «nå» 2026-11-02 (mandag) | `forventet.tidsrom` stemmer 20 av 20 | N/A |
| Grenser | «nå» onsdag; frist tirsdag / onsdag / torsdag / søndag / neste mandag | Forfalt / I dag / Denne uken / Denne uken / Senere | N/A |
| Søndag | «nå» søndag; frist mandag etter | Senere med merkelappen «i morgen»; «Denne uken» tom og skjult | N/A |
| Sommertid | «nå» 2026-10-25 og 2027-03-28; frister rundt | Riktig dag og liste begge veier | N/A |
| Årsskifte | «nå» tirsdag 2026-12-29; frist 2027-01-03 / 2027-01-04 | Denne uken «søndag» / Senere «4. jan 2027» | N/A |
| Rekkefølge | Lik frist, ulik prioritet og `createdAt` | Høy før Middels før Lav; eldste først ved lik prioritet | N/A |
| Fullført | `fullført` satt | I ingen liste | N/A |
| Tom «I dag» | Oppgaver finnes, ingen i dag | «I DAG · 0» med «Alt unna i dag 🎉 Nyt kvelden!» | N/A |
| Helt tom app | Ingen aktive oppgaver | Hilsen + «Skriv inn det første du må huske.» (KI-varianten kommer i 3.3); ingen grupper | N/A |
| Midnatt | `nå` går fra 23:59 til etter 00:01 (takten er 60 s fra oppstart) | Oppgaven med frist neste dag flytter fra Denne uken til I dag uten omlasting | N/A |

</frozen-after-approval>

## Code Map

- `kjerne/tid.ts` -- `lokalDato(nå)`; gjenbruk, legg til datohjelpere her ved behov (Stines fil, bare tillegg)
- `kjerne/skjema.ts` -- `Oppgave` (`frist`, `prioritet`, `createdAt`, `fullført`, `prosjekt`, `skjultForKi`)
- `lib/store/index.ts` -- `useButikk`; `nå` og `dokument` er satt når `AppTilstand` viser siden
- `app/page.tsx` -- serverside med `Hilsen` og plassholdertekst; erstatt teksten med listekomponenten
- `components/hilsen.tsx`, `components/ramme.tsx`, `app/globals.css` -- Lenas tokens og utilities (`section-label`, `text-tag`, `bg-surface-raised`, `warn`, `glod` 340 px høy osv.); bruk dem, ikke nye farger
- `kjerne/tekster.ts` -- dekker bare «Personvern og data»; tomtekstene for lista legges ikke der
- `tests/ki-testsett/testsett.json` -- `referansedato`, `oppgaver[].forfallsdato`, `forventet.tidsrom`
- `tests/e2e/lagring.spec.ts` -- mønster for å legge inn et dokument i localStorage før `goto`

## Tasks & Acceptance

**Execution:**
- [x] `kjerne/smarte-lister.ts` -- `LISTER` i fast rekkefølge, `listeFor(frist, nå)`, `sammenlignOppgaver` (eksportert til 2.5), `smarteLister({ oppgaver }, nå)` som gir `{ liste, elementer, antall }[]` for alle fem, og `fristMerkelapp(frist, nå)` (se Design Notes). Dager regnes på `YYYY-MM-DD` med `Date.UTC` (som `tilMinutter`), aldri ms / 86 400 000
- [x] `tests/kjerne/smarte-lister.test.ts` -- alle rader i matrisen unntatt midnatt, testsettet 20/20 via `listeFor` med lokal «nå» (`new Date(2026, 10, 2, 12)`), og `fristMerkelapp`
- [x] `components/oppgaveliste.tsx` -- `'use client'`; velger `dokument.oppgaver` og `nå` hver for seg og regner lista i `useMemo` (aldri i selektoren — Zustand 5 gir ellers evig rendering); `null` når `nå` mangler. Grupper som `<h2>` + `<ul>`/`<li>`; «Ingen frist» kan felles sammen (`<h2><button aria-expanded aria-controls>`, åpen som standard, ikke lagret); tomtekstene ligger i komponenten
- [x] `components/oppgavekort.tsx` -- ring (dekor, `aria-hidden`), tittel i `task-title`, sammendrag med «✦», merkelapper i `tag`; låsikon `aria-hidden` + `sr-only` «Skjult for KI» når `skjultForKi`
- [x] `app/page.tsx` -- erstatt plassholderen med `<Oppgaveliste />`
- [x] `tests/e2e/oppgaveliste.spec.ts` -- `test.use({ timezoneId: "Europe/Oslo" })`; legg inn dokument, sjekk grupper, rekkefølge, antall, FORFALT-stripe, tom «I dag», helt tom app, midnatt med `page.clock` (spol minst 60 s forbi 00:00), axe på `/`

**Acceptance Criteria:**
- Given `kjerne/smarte-lister.ts`, when man søker etter `Date.now`, `new Date()` uten argument, `window` og imports, then finnes ingen av dem og bare imports fra `kjerne/` og `zod` (AD-1)
- Given en liste med grupper, when den leses med skjermleser, then er hver gruppe en overskrift med antall, og hvert kort har tittel og merkelapper som tekst

## Design Notes

Frist-merkelapp (fra mockupen `key-oppgaver.html`), relative ord vinner over dato: i går → «i går»; i dag → ingen merkelapp (overskriften sier det); i morgen → «i morgen», også når den ligger i Senere på søndag; resten av uka → ukedag med liten forbokstav («fredag»); eldre forfalt og resten av Senere → «18. nov», med år hvis annet år enn «nå» («4. jan 2027»); ingen frist → ingen merkelapp. Faste forkortelser: jan, feb, mars, apr, mai, juni, juli, aug, sep, okt, nov, des. Prioritet vises alltid som merkelapp (Lav/Middels/Høy). Ukedager og måneder skrives ut i kjernen (ingen `Intl`, så testene ikke avhenger av nettleserens språk).

Ringen og kortet blir interaktive i 2.2 og 1.7. Bevisst avvik fra AK i epics.md: pilen mot «+ Ny oppgave» i tom-tilstanden kommer i 1.6, sammen med knappen.

API for senere stories: `Listeelement` er en union `{ type: "oppgave", oppgave }`; 6.1 legger til `{ type: "økt", … }` (teller i `antall`), og 5.4 legger hendelser øverst i «I dag» uten å telle. `smarteLister` tar et objekt så `økter` og `hendelser` kan legges til.

## Implementation Notes

- `kjerne/tid.ts` har fått `dagnummer(dato)` (via `tilMinutter(dato, "00:00") / 1440`) og `ukedag(dato)` (mandag = 0), bare tillegg.
- `sammenlignOppgaver` legger oppgaver uten frist sist, sammenligner `createdAt` med `Date.parse` (tåler ulik presisjon i ISO-strengene) og bruker `id` som siste skille.
- `components/ikoner.tsx` har fått `LåsIkon` og `PilNedIkon`.
- Lista ligger i en beholder med `bg-surface-base` som går kant til kant (negativ marg) under hilsenen. Den gir en synlig kant der gløden kuttes; vurder i gjennomgangen om den skal mykes opp.
- `tests/e2e/forside.spec.ts` sjekket plassholderteksten og sjekker nå «Skriv inn det første du må huske.».
- AD-1-søket er automatisert i `tests/kjerne/smarte-lister.test.ts` (kildesøk etter `Date.now`, `new Date()`, `window`, `Intl` og imports).

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Evidens / rute |
|---|---|---|---|---|
| 1 | gap | Siste ledd i `sammenlignOppgaver` (`createdAt`-presisjon, `id`) er ikke testet | low | Kan fjernes med grønne tester; brukes av 2.5 → patch |
| 2 | gap | Ikke sjekket at bare «Høy» har varselfarge | low | Alle merkelapper kunne blitt `warn` uten feil → patch |
| 3 | blind | `dagnummer`/`ukedag` mangler egne tester | low | Dekket via grenser og merkelapper; før-1970 kan ikke nås → avvist |
| 4 | blind | Toppkommentaren i `kjerne/tid.ts` er utdatert | low | Direkte retting → patch |
| 5 | blind | Merkelappene leses som løse ord for skjermleser | medium | «IBE160, i går, Høy» skiller ikke prosjekt/frist/prioritet → patch (`sr-only`-prefiks) |
| 6 | blind | Eldre forfalte kort sier ikke «forfalt» | low | Gruppeoverskriften FORFALT leses som `h2` før kortene → avvist |
| 7 | blind | AD-1-kildesjekken i testen har hull | low | Ekstra sikkerhetsnett utover AK → avvist |
| 8 | blind | `oppgave()`-fabrikken er duplisert | low | Utviklerkomfort, ingen feil i dag → avvist |
| 9 | blind | `lokalDatoPluss` gjenimplementerer `lokalDato` | low | Testhjelper, samme format → avvist |
| 10 | blind | axe bare i lys modus og med «Ingen frist» åpen | low | Samme som utsatt punkt fra 1.4 → defer |
| 11 | blind | `key={i}` på merkelappene | low | Samme retting som 5 → patch |
| 12 | blind | «Ingen frist»-overskriften har annen avstand | low | `min-h-11` er trykkflate; kosmetisk → avvist |
| 13 | blind | E2e-hjelpere avhenger av DOM-struktur | low | Ingen feil i dag → avvist |
| 14 | blind | Midnattstesten sjekker bare én takt | low | Klokka er testet i 1.3 → avvist |
| 15 | blind | `NaN` fra ugyldig `createdAt` i sammenligningen | false | `createdAt` valideres med `z.iso.datetime()` før det når kjernen |
| 16 | blind | Diffen mangler docs | false | Utelatt med vilje; specen er påstandsfila |

## Verification

**Commands:**
- `npm test` -- expected: alle grønne (kjent unntak: CRLF-testen i `tekster.test.ts` på Windows)
- `npm run lint`, `npm run typecheck`, `npm run build` -- expected: ingen feil
- `npx playwright test --workers=1` -- expected: alle grønne (parallelt gir tidsavbrudd på denne maskinen)

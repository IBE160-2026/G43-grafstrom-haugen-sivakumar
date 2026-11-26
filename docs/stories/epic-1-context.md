# Epic 1 Context: Skriv ned og se hva som haster

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Studenten starter dueNext lokalt, legger inn fornavn, oppretter og redigerer oppgaver og ser dem i de fem smarte listene, på mobil og PC, i lys og mørk modus. Dataene ligger i nettleseren og er der neste gang appen åpnes. Ingen KI i denne epicen, og ingen førstegangsoppsett: appen åpner rett på Oppgaver. Epicen legger grunnmuren (pakker, lagring, butikk, klokke, ramme) som alle de andre sporene bygger på.

## Stories

- Story 1.1: Gjør prosjektet klart etter arkitekturen
- Story 1.2: Lagringsformat som tåler nye versjoner
- Story 1.3: Appen husker og følger klokka
- Story 1.4: Appens ramme, navigasjon og utseende
- Story 1.5: Se oppgavene i de smarte listene
- Story 1.6: Opprette en oppgave
- Story 1.7: Se og redigere en oppgave
- Story 1.8: Fornavn og lys eller mørk modus

## Requirements & Constraints

- Appen startes lokalt etter README uten gruppens nøkkel, betalte kontoer eller eksterne tjenester, og kan bare nås fra egen maskin. Ingen publisering.
- All data bare i nettleseren, bevart mellom økter. Ingen innlogging eller database. Feiler lagring, vises et banner så lenge feilen varer.
- Ingen analyseverktøy eller tredjepartsskript. All tekst på norsk, du-form.
- WCAG 2.1 AA på alle flater, trykkflater ≥ 44 px, synlig fokusring. Fungerer på telefon, nettbrett og PC uten vannrett rulling ned til 320 px.
- Tekst er eneste påkrevde felt i en oppgave; prioritet er «Middels» som standard; frist settes bare av studenten og kan mangle.
- Fem smarte lister i rekkefølgen Forfalt, I dag, Denne uken, Senere, Ingen frist; uka går mandag–søndag; hver aktiv oppgave i nøyaktig én liste. Målt mot KI-testsettet: 20/20.
- Dato- og tidsregler må kunne testes med fast «nå».

## Technical Decisions

- Stack: Next 16.3.5 (App Router), React 19.2.8, TypeScript 5, Tailwind 4, Zustand 5.1.0, zod 4.6.7, Vitest 5.1.2, Playwright 1.65.1 med @axe-core/playwright 4.14.1, Node ≥ 22. Prisma brukes ikke. Les `node_modules/next/dist/docs/` før Next-kode skrives — versjonen avviker fra treningsdata.
- Lag og importregler: `kjerne/` (rene funksjoner, importerer bare `kjerne/` og `zod`, aldri klokke/nettleser/nettverk) ← `lib/store/` (én Zustand-butikk med navngitte kommandoer) → adaptere `lib/storage/` (eneste som rører localStorage), `lib/klokke.ts` (eneste klokke). UI i `app/` og `components/`.
- Lagring: ett versjonert JSON-dokument under én localStorage-nøkkel; `kjerne/migrering.ts: migrer(rå)` gir dokument, `for-ny` eller `ugyldig` og kaster aldri; ved `for-ny`/`ugyldig` overskrives aldri det lagrede. Skjemaet i `kjerne/skjema.ts` (zod, typer via `z.infer`) har fra versjon 1 samlingene `oppgaver`, `økter`, `hendelser` og objektene `innstillinger`, `profil`, `samtykke`.
- Avledede verdier (smarte lister o.l.) regnes av kjernen og lagres aldri.
- Datoer `YYYY-MM-DD`, klokkeslett `HH:mm` i lokal tid; tidsstempler ISO UTC; ID-er `crypto.randomUUID()`. `nå` ligger i butikken og oppdateres hvert minutt og ved synlighet.
- Brukerdata vises i klientkomponenter med skjelett til lagringen er lest; lagring starter først etter innlasting.
- Ruter: `/`, `/arkiv`, `/innstillinger` (Kalender først i Epic 5). Valgt innhold i søkeparametre (`?oppgave=`, `?ny=oppgave`); egen side under `lg` (1024 px), detaljpanel fra `lg`.
- `<html lang="nb" suppressHydrationWarning>`; tema-skript i `<head>` setter `data-tema`/`data-modus` før første tegning; farger som CSS-variabler i `app/globals.css`.
- Scripts kjører Next med `-H 127.0.0.1`. Miljø: `ANTHROPIC_API_KEY` og `KI_MOCK` i `.env.example`, ingen `NEXT_PUBLIC_`-variabler for KI.
- Konvensjoner: norske domenenavn med æøå i kode og JSON, filnavn uten æøå i kebab-case; fastsatte tekster ordrett i `kjerne/tekster.ts`; kjernefunksjoner returnerer navngitte feil i stedet for å kaste. Tester: Vitest i `tests/kjerne/`, Playwright i `tests/e2e/` med `page.clock` og axe-sjekk.

## UX & Interaction Patterns

- Mobil (< 768 px): bunnmeny Oppgaver/Arkiv (Kalender senere), logo, lupe og ⚙ øverst, flytende «+ Ny oppgave». Nettbrett: sidemeny + FAB. PC (≥ 1024): sidemeny 200 px, liste, detaljpanel 340 px og skrivefelt «+ Ny oppgave … skriv med egne ord», «N» fokuserer det.
- Pastellfarger fra DESIGN.md med seks temaer (pastellblå standard), lys/mørk/følg system; Poppins med systemskrift som reserve; glød øverst på hovedsider der sekundærtekst bruker `text-on-glow`.
- Gruppeoverskrifter med antall («I DAG · 3»), FORFALT i varselfarge, tomme grupper skjules unntatt «I dag»; oppgavekort med ring, tittel og merkelapper.
- Skjema som egen side (mobil) eller panel (PC) med hjelpeteksten «Bare oppgaveteksten er påkrevd. Resten kan stå tomt.»; «Forkaste endringene?» bare ved endringer.
- Tone: heiing bare i positive øyeblikk; feil og personvern saklig uten emoji; ingen badge-tellere.

## Cross-Story Dependencies

- 1.1 → 1.2 → 1.3 er grunnmuren; spor B (1.4), C (3.1) og D (2.1, 5.2) venter på 1.2. 1.5 trenger 1.3 og 1.4; 1.6 → 1.7; 1.8 trenger 1.3 og 1.4.
- Feilsiden i 1.3 trenger en enkel «Slett alle data» som story 3.6 senere gjenbruker.
- Førstegangsoppsett, samtykke og omdirigering til `/oppstart` kommer i Epic 3; Kalender-fanen i story 5.6.

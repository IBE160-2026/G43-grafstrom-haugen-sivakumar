# Epic 2 Context: Fullfør, rydd og finn fram

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Studenten huker av oppgaver og kan angre, ser fullførte oppgaver i Arkiv med nedtelling til automatisk sletting etter 7 dager, sletter oppgaver, filtrerer, sorterer og søker i både aktive og fullførte oppgaver. Som Bør kan hun også rydde prosjektnavn og velge ett av seks fargetemaer. Epicen bygger også reserveløsningens nøkkelordregler i kjernen og måler dem mot KI-testsettet. Selve visningen av reserveforslagene og når de slår inn, kommer i Epic 4. Med Epic 1 og 2 er skive 1 en komplett oppgaveapp uten KI.

## Stories

- Story 2.1: Regelbaserte forslag fra nøkkelord
- Story 2.2: Huke av en oppgave og angre
- Story 2.3: Arkiv med nedtelling
- Story 2.4: Slette en oppgave
- Story 2.5: Filtrere og sortere
- Story 2.6: Søke i aktive og fullførte oppgaver
- Story 2.7 (Bør): Prosjekter i Innstillinger
- Story 2.8 (Bør): Seks fargetemaer

## Requirements & Constraints

- Fullført oppgave forsvinner fra de smarte listene og havner i Arkiv. Fullføring kan angres rett etter avhuking (snackbar) og senere fra Arkiv; oppgaven havner da i lista som passer fristen.
- Fullført oppgave slettes automatisk 7 × 24 timer etter **siste** fullføring, sammen med øktene. Hver arkivrad viser «Slettes om N dager», siste dag «Slettes i morgen» i varselfarge.
- Sletting fra detaljen eller Arkiv krever bekreftelse og kan ikke angres. Har oppgaven økter, sier dialogen hvor mange som slettes.
- Reserveløsningen foreslår bare etikett (Privat/Skole/Jobb) og prioritet (Lav/Middels/Høy) ut fra nøkkelord, aldri sammendrag, økter eller frist. Uten treff: ingen etikett, prioritet Middels. Nøkkelordlista bestemmes i storyen. Resultatet mot de 20 testtekstene skrives som referanse; det finnes ikke noe minstekrav.
- Sortering: Frist (standard), Prioritet eller Nyeste. Standard gjelder igjen neste gang lista vises. Økter følger oppgaven sin.
- Filter på etikett, prioritet, frist (Forfalt/I dag/Denne uken/Senere/Ingen frist) og prosjekt. Filteret gjelder også Kalender; økter filtreres etter oppgaven, hendelser vises alltid.
- Søk i tekst, notater, prosjekt og sammendrag, med treff i aktive og fullførte oppgaver som viser status og frist.
- Bør: prosjektlista viser brukte navn; sletting tømmer feltet på alle oppgaver med navnet. Etikettene er faste og kan ikke slettes. Seks fargetemaer, pastellblå standard, uten axe-brudd i lys og mørk modus.
- WCAG 2.1 AA, trykkflater ≥ 44 px, farge aldri eneste signal, `prefers-reduced-motion` respekteres. All tekst norsk, du-form.

## Technical Decisions

- Rene regler i `kjerne/` med «nå» som parameter: `reserve.ts` (nøkkelord + tabellen kalltype × `årsak`), arkivregelen (`ryddArkiv` og «Slettes om N dager» fra **samme** funksjon), filter, søk, sortering og prosjektlista. Avledede verdier lagres aldri.
- Reservetabellen: feltforslag gir etikett og prioritet bare for felt kallet ba om eller som står i `forkastet`; kall som bare gjelder økter, og `nyTid`, gir ingenting. Vitest dekker alle kombinasjoner. Nøkkelordene ligger bare i `kjerne/reserve.ts`.
- `oppgave.fullført` er ISO-tidsstempel eller `null`; det finnes ikke noe `status`-felt. Fullføring og gjenåpning endrer aldri øktene; hvor de vises, avledes av `fullført`.
- Kommandoer i butikken: `fullfør`, gjenopprett, `slettOppgave` (sletter øktene i samme kommando), `slettProsjekt(navn)` (setter `prosjekt` til `null`), `vedlikehold(nå)` som kjører `ryddArkiv` ved oppstart og hver time via takten i `lib/klokke.ts`.
- Prosjekter har ingen egen samling; `oppgave.prosjekt` er eneste kilde.
- Filter og søk ligger i butikkens `visning`, som ikke lagres og deles av Oppgaver og Kalender. Sortering er lokal tilstand i lista og starter på «Frist».
- Tema: valget lagres i `innstillinger`, tema-skriptet i `<head>` setter `data-tema` før første tegning, og fargene er CSS-variabler i `app/globals.css`.
- Fastsatte tekster ordrett fra `kjerne/tekster.ts`. Tester: Vitest med fast «nå» (arkivgrensen), Playwright for Flyt 5 (avhuking/angre/Arkiv, med `page.clock`) og Flyt 6 (søk/filter/sortering), axe-sjekk på hver hovedside.

## UX & Interaction Patterns

- **Avkrysningsring** 20 px med 44 px trykkflate, navn «Huk av: <oppgavetekst>». Ringen fylles og haken spretter (ca. 300 ms) før kortet glir ut; uten animasjon ved `prefers-reduced-motion`. *Fullfør* i detaljen gjør det samme.
- **Snackbar** «Flyttet til Arkiv · Angre» i ca. 5 s, én om gangen (ny erstatter forrige), annonsert for skjermleser, *Angre* nåbar med tastatur.
- **Arkiv** (`/arkiv`): forklaringstekst om 7 dager, rader med strek over tittelen, «…»-meny med *Gjenopprett* og *Slett nå*. Tomt: «Ingen fullførte oppgaver ennå – hold på! 💪».
- **Slettedialog**: «Er du sikker? Oppgaven kan ikke gjenopprettes.», med økter «Oppgaven og n økter slettes. Det kan ikke angres.». Fokusfelle, *Avbryt* standardfokus, Esc = *Avbryt*, fokus tilbake til knappen; *Slett* i `button-danger`. Aldri mer enn ett dialognivå.
- **Filterknapper** Alle/Skole/Jobb/Privat, én om gangen, valgt med pastellfyll, kant, hake og `aria-pressed`. «☰ Filter» åpner ark nedenfra på mobil og nedtrekk på PC; aktive filtre som fjernbare knapper med «×». Tomt: «Ingen oppgaver med dette filteret.» med *Fjern filter*. Sortering via «⇅ Frist» med meny.
- **Søk**: lupe øverst på mobil (feltet fyller toppen, *Avbryt* til høyre), søkefelt ved filterknappene på PC. Treff som oppgavekort med *Aktiv*/*Fullført* og frist. Esc eller *Avbryt* lukker. Uten treff: «Fant ingenting på "<ord>". Sjekk stavingen eller prøv et annet ord.»
- **Innstillinger** (Bør): Prosjekter med tomteksten «Prosjekter dukker opp her når du skriver dem på en oppgave.» og søppelbøtte med «Er du sikker?»; Utseende med seks fargeprøver der valgt har ring i `accent-ink` og hake, og byttet skjer med én gang.

## Cross-Story Dependencies

- 2.1 (spor D) trenger bare 1.2 og er ren kjerne; Epic 4 (story 4.7) bruker tabellen til visning og flyt, og 4.8 bruker referansetallene.
- Spor A: 1.7 → 2.2 → 2.3 → 2.4. Spor D: 2.5 trenger 1.5, 2.6 trenger 2.3. Spor B: 2.7 og 2.8 trenger 1.8.
- Øktene finnes først i Epic 6: dialogen «Du har n økter igjen. Fullføre likevel?» og avhuking av økter hører til der, men sletting og arkivrydding skal allerede nå ta med øktene.
- Filteret må virke for Kalender når den kommer i Epic 5 (derfor delt `visning`). Bør-storyene 2.7 og 2.8 kuttes før Må-stories ved tidsnød.

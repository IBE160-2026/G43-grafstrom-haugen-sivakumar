# Epic 4 Context: KI-forslag til etikett, prioritet og sammendrag

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Når studenten har lagret en oppgave, får hun KI-forslag til etikett, prioritet og sammendrag, ett per felt, og godtar eller endrer dem med ett trykk. Svarer ikke KI, får hun regelbaserte forslag fra nøkkelord, så appen hjelper henne uansett. Har hun sagt nei til KI, kommer det ingen forslag. Epicen bygger hele KI-veien: kontrakt og utdrag i kjernen, `/api/ki` med mock-KI, Claude-kallet, klienten med tidsfrist og kallgrense, reglene for når KI spørres, KI-boksen og reserveløsningen. Den måles mot KI-testsettet og avsluttes med brukertest. Skive 3 (økter) bruker samme vei uten nye kall eller ruter, så kontrakt og trigger må ha plass til `ønsker.økter` allerede nå.

## Stories

- Story 4.1: KI-kontrakt og utdrag
- Story 4.2: Serverrute med mock-KI
- Story 4.3: Claude-kallet
- Story 4.4: KI-klient med tidsfrist og kallgrense
- Story 4.5: Når KI spørres
- Story 4.6: Godta og endre KI-forslag
- Story 4.7: Regelbaserte forslag når KI ikke svarer
- Story 4.8: Måle KI-forslagene mot testsettet
- Story 4.9: Brukertest av oppgaver, KI-forslag og samtykke
- Story 4.10 (Bør): Bytte ut telefonnumre og e-post før sending

## Requirements & Constraints

- Oppgaven lagres straks ved «Lagre». Forslagene hentes etterpå, og lagringen venter aldri. Med mock som svarer etter 10 s skal oppgaven stå i lista innen 1 s.
- Forslag hentes bare når KI er på og oppgaven ikke er 🔒. Ny oppgave eller endret tekst gir feltforslag. Endres bare fristen, kommer ingen nye feltforslag. KI foreslår aldri frist.
- Ubesvarte forslag gir standardverdiene (tom etikett, «Middels», tomt sammendrag) og vises igjen ved neste åpning til de er besvart. Etter endret tekst gjelder de gamle verdiene til hun godtar de nye.
- Etikett er en fast verdi: Privat, Skole eller Jobb. Prioritet er Lav, Middels eller Høy. All tekst, også sammendragene fra KI, er på norsk.
- Svaret kontrolleres før det vises. Ugyldige felt forkastes, og hvert av dem får reserveforslag for seg.
- Reserveløsningen slår inn ved manglende nøkkel, tidsavbrudd, tomt eller ugyldig svar, avvisning, API-feil og kallgrense. Den gir bare etikett og prioritet, aldri sammendrag eller økter.
- KI får bare oppgavetekst, frist og notater (ikke når «Send aldri notater til KI» er på). Fornavnet sendes aldri, og ingenting fra 🔒-oppgaver. Hendelser og økter tas bare med når forespørselen ønsker økter eller gjelder `nyTid`.
- Kall avbrytes etter 15 s. En lagring gir høyst ett forslagskall, og det sendes høyst 10 KI-kall per minutt per fane. Kall over grensen gir reserveløsningen.
- Uten nøkkel virker alt unntatt KI-forslag. Automatiske tester bruker bare mock-svar: gyldig, ugyldig, tomt og tidsavbrudd. De tre siste gir reserveløsningen.
- Suksesskriterier: minst 16/20 riktige etiketter og 14/20 riktige prioriteringer i KI-testsettet. I brukertesten skal minst 4 av 5 klare å opprette en oppgave og endre et KI-forslag uten hjelp på 5 minutter, og minst 4 av 5 skal svare riktig på begge spørsmålene om samtykket. Prompten kan ikke sende mer data enn utdragsreglene tillater.
- Bør: telefonnumre og e-post byttes med plassholdere før sending (pseudonymisering). Navn maskeres ikke.

## Technical Decisions

- **Kontrakt** i `kjerne/ki-kontrakt.ts` (zod). Forespørselen er `{ type: "forslag", ønsker: { felt, økter }, utdrag }` eller `{ type: "nyTid", øktId, utdrag }`. Svaret er `{ type: "ok", felt, økter, forkastet }` eller `{ type: "reserve", årsak }`, der `årsak` er `ingen-nokkel | tidsavbrudd | tomt | ugyldig | avvist | api-feil | kallgrense`.
- **Utdrag**: én ren funksjon i `kjerne/` som får oppgaven, hendelsene, øktene, innstillingene og «nå». Den er eneste kilde til det som sendes.
- **Eneste vei til Claude** er `POST /api/ki` (route handler, ingen Server Actions). Ruta validerer mot kontrakten, avviser `Host` som ikke er `127.0.0.1`/`localhost` og logger aldri innhold. Kjernen kontrollerer svaret før det returneres.
- **Claude** i `server/claude.ts` med `import 'server-only'`: `claude-sonnet-5-5`, `client.messages.parse` + `zodOutputFormat` (`@anthropic-ai/sdk/helpers/zod`), `output_config: { effort: "low" }`, `maxRetries: 0`, ingen fallback-modell. Serverfristen er 13 000 ms, og kallet avbrytes ved `request.signal`. `stop_reason: "refusal"` gir `avvist`. Systemprompten er på norsk og ligger fast i `server/`. Nøkkelen er `ANTHROPIC_API_KEY` i `.env.local`, og det finnes ingen `NEXT_PUBLIC_`-variabler for KI.
- **Mock-KI** bare i `server/mock.ts`, og den erstatter bare selve Claude-kallet. `KI_MOCK=1` + headeren `x-ki-mock` (`gyldig`, `ugyldig`, `tomt`, `tidsavbrudd`, `treg-10s`) gir svar fra `tests/ki-testsett/mock/`. Uten header brukes `gyldig`, og uten `KI_MOCK` ignoreres headeren. Klienten har ingen mock-kode.
- **Klient** `lib/ki/` er eneste kode som kaller `/api/ki`. Den bruker `AbortSignal.timeout(15000)`, endrer aldri tilstand og importerer ikke butikken. Kallgrensen i `lib/ki/kallgrense.ts` er et glidende vindu på 60 s med 10 kall, holdes i minnet per fane og teller også `nyTid`.
- **Reserve**: én tabell i `kjerne/reserve.ts` (kalltype × årsak). Ved feltforslag gis etikett og prioritet bare for felt som ble bedt om eller står i `forkastet`. Et kall som bare gjelder økter, gir ingen forslag, og `nyTid` gir aldri forslag. Nøkkelordene fra story 2.1 gjenbrukes.
- **Livsløp**: `kjerne/ki-trigger.ts` har én tabell som avgjør `ønsker`. Kall startes bare av kommandoer, aldri ved oppstart, import eller visning. Kommandoen lagrer `oppgave.ventendeKall = { id: crypto.randomUUID(), type }`, og et nytt kall erstatter det. `mottaKiSvar(oppgaveId, id, resultat)` forkaster svaret uten melding hvis oppgaven er borte, id ikke stemmer eller `kanSendes` er usann. `ventendeKall` settes til `null` ved oppstart og import.
- **Lagret form**: `oppgave.forslag = { felt: { etikett?, prioritet?, sammendrag? }, økter: [] } | null`, der hvert felt er `{ verdi, kilde: "ki" | "regelbasert" }`. *Godta* og *Endre* fjerner forslaget, og når alt er besvart, er `forslag` `null`. Nye felt krever skjemaendring, ny skjemaversjon og migrering med test.
- `kiErPå` og `kanSendes` fra `kjerne/samtykke.ts` er de eneste beslutningsstedene. Trigger, butikk og UI kaller dem.
- **Tester**: Vitest for kontrakt, utdrag, trigger, forkasting, reserve og kallgrense (med falsk tid og fast «nå»). Playwright med mock-headerne og axe-sjekk. Måleskriptet (4.8) kjører de 20 tekstene med ekte nøkkel, skriver resultatfil med dato og promptversjon, og hver kjøring noteres i `tests/ki-testsett/README.md`.

## UX & Interaction Patterns

- **KI-boksen** (`ai-suggestion-box`) står på oppgavedetaljen, aldri i skjemaet. Den er pastell blandet med kortfarge og har «✦ KI-forslag» i `accent-ink`, én rad per felt med *Godta* (primær) og *Endre* (sekundær), *Godta alle* øverst til høyre og «Frist: ingen foreslått – legg til selv» nederst. All tekst er i `text-primary` eller `accent-ink`, aldri `text-muted` eller varselfarge.
- **Mens KI henter**: skeleton «✦ Lager forslag …» med pulsering som stopper ved `prefers-reduced-motion`. Studenten kan gå videre. Når forslagene kommer, annonseres «3 KI-forslag klare» med `aria-live="polite"`.
- **Nye forslag etter endret tekst** viser nåværende verdi, for eksempel «Prioritet: Høy (nå: Middels)».
- **Reserve**: hver rad har merket «regelbasert» (`fallback-badge`), og boksen har linjen «Forslag basert på nøkkelord – KI var ikke tilgjengelig» ordrett. Det vises ikke sammendrag.
- **KI av eller 🔒**: ingen KI-boks.
- **Oppgavekortet** har ✦-prikken (`unanswered-dot`) så lenge det finnes ubesvarte forslag. Et godtatt sammendrag står på én linje under tittelen med «✦» i `accent-ink`. Godtatte verdier har ikke merket «KI-forslag».
- Knappene har tilgjengelige navn, for eksempel «Godta foreslått etikett: Skole». Trykkflatene er ≥ 44 px, og WCAG 2.1 AA gjelder. Fastsatte tekster ligger ordrett i `kjerne/tekster.ts`.

## Cross-Story Dependencies

- Spor C (Sabrina) går i rekkefølge: 4.1 (trenger 3.1) → 4.2 → 4.3 og 4.4 → 4.5 (trenger også 1.7) → 4.6 → 4.7 (trenger også 2.1). 4.8 trenger 4.3 og gjøres sammen med spor D. 4.10 trenger 4.1. 4.9 gjøres av alle og trenger 4.7 og 3.3.
- 4.8 og den ekte bekreftelsen av `effort` i 4.3 trenger en ekte nøkkel. Alt annet kjøres med mock.
- Når 4.10 er bygget, byttes bare telefonnummer-delen av «Hva sendes til KI» fra Epic 3 ut. Advarselen om navn og helseopplysninger blir stående.
- Epic 6 (6.5, 6.6, 6.9) fyller `ønsker.økter`, økt-radene i trigger-tabellen, `nyTid` og kontrollen av FR-49 i samme vei. Hendelser i utdraget forutsetter Epic 5. Epic 4 må ikke legge til noe som krever nye kall eller ruter senere.
- Brukertesten i 4.9 skrives i `docs/`, og funn som må rettes, blir egne oppgaver. 4.6–4.8 er planlagt til 7.–9.12, før sjekkpunktet 9.12, og brukertesten til 10.–12.12.

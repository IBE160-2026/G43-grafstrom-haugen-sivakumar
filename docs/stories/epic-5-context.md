# Epic 5 Context: Hendelser og Kalender

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Studenten legger inn jobbvakter, kamper og andre faste avtaler som hendelser, ser dagens hendelser øverst i «I dag» og ser oppgaver og hendelser i en månedskalender. Slik ser hun når hun er opptatt, og en nattevakt over midnatt blir riktig. Epicen legger grunnlaget for Epic 6: KI-testsettet får planleggingscaser, og hendelsene blir det øktforslagene legges utenom. Epicen er skive 3, som kuttes først, og Bør-storyen 5.7 kuttes før resten.

## Stories

- Story 5.1: Planleggingscaser i KI-testsettet
- Story 5.2: Hendelsesregler i kjernen
- Story 5.3: Legge inn en hendelse
- Story 5.4: Dagens hendelser øverst i «I dag»
- Story 5.5: Endre og slette en hendelse
- Story 5.6: Kalender med månedsvisning
- Story 5.7 (Bør): Gjentakende hendelser

## Requirements & Constraints

- En hendelse har tittel, dato, starttid og sluttid, og alle er påkrevd. Lik start og slutt er ugyldig. Slutt før start betyr neste dag og vises som «21:00 – 07:30 (+1 dag)».
- Hendelser kan ikke fullføres og havner aldri i Arkiv. Dagens hendelser står øverst i «I dag», sortert etter starttid, og forsvinner når de er over. De teller ikke i gruppeantallet og vises alltid uansett filter. Hendelser på andre dager vises bare i Kalender.
- Hendelser kan endres og slettes. Sletting må bekreftes.
- «🔒 Skjul tittel for KI» per hendelse betyr at KI bare får vite at hun er opptatt. Bryteren «Send hendelsestitler til KI» (standard på) i Personvern og data gjelder alle hendelser. 🔒 per hendelse gjelder i tillegg.
- Kalender viser oppgaver på fristen, forfalte på opprinnelig dato i varselfarge, hendelser på sin dag og (fra Epic 6) bare godtatte økter. Oppgaver uten frist står i en egen seksjon.
- Gjentakelse (Bør): Ingen / Hver uke / Annenhver uke, med påkrevd sluttdato. Uregelmessige tider legges inn én og én. Endring eller sletting av én forekomst spør «Bare denne / Denne og alle senere».
- KI-testsettet trenger minst 5 planleggingscaser med fast «nå», oppgavetekst, frist og hendelser. Minst én har nattevakt over midnatt, én har en hendelse med 🔒 og én kjøres med hendelsestitler av. Forventet resultat er «minst én økt, og alle økter holder FR-49» (1–5 økter, 30 min–3 t, kl. 07–23, ikke i fortiden eller etter fristdagen, ingen overlapp, ingen økt de første 8 timene etter en hendelse som slutter neste dag).
- Alle tekster om hendelser, påminnelser og tomtilstander brukes ordrett fra EXPERIENCE.md. Norsk, WCAG 2.1 AA, trykkflater ≥ 44 px, farge aldri eneste signal.

## Technical Decisions

- Reglene ligger som rene funksjoner i `kjerne/hendelser.ts` (validering, «+1 dag»-visning, valg av dagens hendelser ut fra «nå», og `foldUt` for serier). «Nå» kommer som parameter fra `state.nå`, og ingen andre leser klokka. Avledede verdier (om en hendelse er over, hvilken dag den vises på) lagres aldri.
- Samlingen `hendelser` og feltene `skjulTittelForKi`, `seriesId` og `gjentakelse` (med `sluttdato`) finnes allerede i skjemaet, og `sendHendelsestitler` ligger i `innstillinger`. Epicen skal ikke trenge ny skjemaversjon. Trengs et nytt felt likevel, kreves økt `GJELDENDE_SKJEMAVERSJON` og en migrering med test.
- Datoer er `YYYY-MM-DD` og klokkeslett `HH:mm` i lokal tid. Uka går mandag–søndag. ID-er lages med `crypto.randomUUID()`.
- En gjentakende hendelse foldes ut til én hendelse per gang med felles `seriesId`. «Denne og alle senere» gir hendelsene fra valgt dato ny `seriesId`, og de tidligere får sluttdato dagen før.
- Endringer går gjennom navngitte kommandoer i Zustand-butikken. Bare `lib/storage/` rører localStorage.
- Ruter og søkeparametre: `?ny=hendelse`, `?hendelse=<id>` og `/kalender?dag=YYYY-MM-DD`. Under `lg` (1024 px) er detalj og skjema egen side med tilbakepil, fra `lg` et panel til høyre. Ingen parallel eller intercepting routes.
- Filter og søk ligger i `visning` i butikken (ikke lagret) og deles av Oppgaver og Kalender. Sortering er lokal.
- Om KI er på, avgjøres bare av `kiErPå`. Utdraget til KI (Epic 6) tar hendelser for 14 dager, aldri etter fristdagen, og titler bare når `sendHendelsestitler` er på og hendelsen ikke har 🔒.
- Skive 3 legger ikke til nye samlinger, kall eller rutemodeller.
- Tester: Vitest med fast «nå» for hendelser over midnatt, grensen når en hendelse slutter og (Bør) utfolding og deling av serier. Playwright med `page.clock` og axe-sjekk på `/kalender`.

## UX & Interaction Patterns

- **Skjema:** Velgeren [Oppgave | Hendelse] øverst bytter feltene uten å miste teksten. Den vises bare ved Ny. Feil står ved feltet, for eksempel «Slutt må være etter start», og innholdet beholdes. «🔒 Skjul tittel for KI» står nederst med hjelpeteksten «KI får bare vite at du er opptatt kl. <start>–<slutt>, ikke hva du skal.» med hendelsens egne klokkeslett.
- **KI-påminnelse under tittelen** (bare når KI er på): «Tittel og tid brukes av KI (Claude) når den planlegger økter. Slå på 🔒 hvis tittelen er privat – da sendes bare at du er opptatt.» og «Unngå navn på andre og helseopplysninger – bruk 🔒 eller en nøytral tittel som "Avtale".» Ved 🔒 eller titler av: «KI ser bare at du er opptatt.»
- **Hendelsesrad** (`event-row`): uten ring, tid først, `border-subtle`, låsikon med skjermlesertekst «Skjult for KI», «(+1 dag)». Trykk åpner hendelsesdetaljen med tittel, dato, start–slutt, låsikon, *Endre* og *Slett*.
- **Dialoger:** fokusfelle, Esc = *Avbryt*, *Avbryt* har standardfokus ved sletting, og fokus går tilbake etter lukking. Aldri mer enn ett dialognivå.
- **Kalender:** Fanen står mellom Oppgaver og Arkiv. Topplinjen har ‹ › og «I dag» (på PC også «+ Ny»). Dagens dato har ring, og valgt dag har pastell og kant. Mobil viser prikker (oppgave fylt `accent-ink`, økt hul ring, hendelse `text-muted`, forfalt `warn`), nettbrett tekst, og PC titler med klokkeslett og «+n til», som velger dagen. Dagslista står under rutenettet på mobil og i panelet på PC, med «+ Ny» og dagen ferdig utfylt. FAB fra Kalender med valgt dag fyller ut dato eller frist.
- **Tomtilstander:** «Fri dag 🙌» for en tom dag og «Ingen planer denne måneden ennå» under rutenettet for en tom måned. «Ingen frist (n)» er sammenleggbar.
- **Tastatur og skjermleser:** Piltastene flytter valgt dag, og hver dag har en tekst som «Onsdag 11. november, 2 oppgaver, 1 økt, 1 hendelse».

## Cross-Story Dependencies

- 5.1 avhenger av ingenting og bør gjøres tidlig. Mock-svarene (ett gyldig med økter og ett med en økt som bryter FR-49) brukes i Epic 6. Gruppa går gjennom forventede svar sammen (åpent punkt i `issues.md`).
- 5.2 → 1.2. 5.3 → 5.2 og 3.5 (🔒-bryter og påminnelser). 5.4 → 5.3. 5.5 → 5.4. 5.6 → 5.4 og 2.5 (filter). 5.7 (Bør) → 5.5.
- 5.3 slår på bryteren «Send hendelsestitler til KI» i Personvern og data, som Epic 3 har forberedt. Tekstene ligger allerede i `kjerne/tekster.ts`.
- 5.6 slår på Kalender-fanen i rammen fra 1.4. Øktkort og hule ringer i Kalender fylles inn av Epic 6.
- Epic 6 bruker hendelsene til øktforslag, kollisjonssjekk og merket «⚠ Kolliderer med <tittel>». Hendelsene står fortsatt øverst i «I dag», over økter og oppgaver.

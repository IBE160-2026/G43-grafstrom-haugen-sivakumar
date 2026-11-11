---
name: dueNext
status: final
created: 2026-11-09
updated: 2026-11-11
sources:
  - docs/product-brief.md
  - docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/prd.md
  - docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/imports/Skisse-design.jpg.jpeg
---

# dueNext – opplevelse

## Foundation

dueNext er en **web-app** som skal fungere like godt på **telefon og PC**. Det finnes ingen egen app for iOS eller Android. Det er heller ikke valgt noe ferdig UI-bibliotek: komponentene følger `DESIGN.md`, som er den visuelle referansen. Denne fila beskriver hvordan appen virker.

Det finnes **ingen konto, innlogging eller passord**. Alle data lagres bare i studentens nettleser (PRD, NFR-1 og NFR-4). Om det blir localStorage eller IndexedDB, avgjøres i arkitekturen (PRD, Å-5). Appen må kunne kjøres av sensor uten KI-nøkkel, og da brukes reserveløsningen (PRD, F3).

Gruppa ønsket opprinnelig telefonnummer og SMS-innlogging. Det er **forkastet for v1**, fordi det bryter med NFR-1 og ville gitt mer personvernansvar.

Prosjektet er et skoleprosjekt i IBE160, men tilgjengeligheten skal følge **WCAG 2.1 AA**.

**Mockups.** Visuelle referanser ligger i `mockups/` og er lenket der de hører hjemme. Ved uenighet gjelder `DESIGN.md` og `EXPERIENCE.md` foran mockupene og skissen.

Valg som avviker fra PRD-en, står i [prd-avvik.md](prd-avvik.md).

## Information Architecture

| Flate | Nås fra | Formål |
|---|---|---|
| Førstegangsoppsett | Første oppstart, og etter «Slett alle data» | Fornavn, deretter KI-valg (FR-35) |
| **Oppgaver** | Bunnmeny / sidemeny (start) | Hilsen, filter, sortering, søk og smartlistene |
| Oppgavedetalj | Trykk på oppgave- eller øktkort | Felt, KI-forslag, økter, notater, Endre, Fullfør, Slett |
| Ny / Endre (skjema) | Flytende knapp «+ Ny oppgave», skrivefeltet (PC), «+ Ny» i Kalender, «Endre» | Velger [Oppgave \| Hendelse], felt, personvernbryter |
| Hendelsesdetalj | Trykk på hendelse (I dag / Kalender) | Tid, gjentakelse, Endre, Slett |
| **Kalender** | Bunnmeny / sidemeny | Månedsrutenett, dagsliste for valgt dag, «Ingen frist» |
| **Arkiv** | Bunnmeny / sidemeny | Fullførte oppgaver med 7-dagersregel |
| Søk | Lupe (mobil), søkefelt (PC) | Treff i aktive og fullførte oppgaver (FR-27, FR-28) |
| Innstillinger | ⚙ øverst (mobil), nederst i sidemenyen (PC) | Se under |
| ↳ Profil | Innstillinger | Fornavn. Fornavnet lagres bare i nettleseren, brukes i hilsenen og sendes aldri til KI eller serveren. |
| ↳ Utseende | Innstillinger | Lys / Mørk / Følg systemet, og Tema (6 pastellfarger) |
| ↳ Prosjekter | Innstillinger | Liste over brukte prosjektnavn, med mulighet for å slette |
| ↳ Personvern og data | Innstillinger, «Personvern og data» i sidemenyen (PC) | KI-valg, samtykkestatus og data. Se [Personvern og data – fastsatte tekster](#personvern-og-data--fastsatte-tekster). |
| ↳ Om appen | Innstillinger | Versjon og gruppe |
| Personvernerklæring | Lenken «Personvernerklæring» (se under) | Full erklæring på norsk |

**Navigasjon.**
- **Mobil:** Bunnmeny med Oppgaver / Kalender / Arkiv. Logo, lupe og ⚙ ligger øverst. Oppgavedetalj, skjema, hendelsesdetalj og innstillinger åpnes som **egne sider** med tilbakepil. Det er aldri mer enn ett nivå med dialog over en side.
- **PC:** Sidemeny til venstre med de samme tre fanene øverst, og Innstillinger og «Personvern og data» nederst. Lista ligger i midten, og **detaljpanelet** til høyre viser valgt oppgave (oppsett A).

**Personvernerklæringen (FR-41).** Lenken «Personvernerklæring» er synlig på alle skjermer, også på mobil, uten at studenten må åpne en meny. På mobil står den nederst på hver side: under siste oppgave, under kalenderen, under arkivet, under innstillingene og nederst i detalj og skjema. På PC står den nederst i sidemenyen, under «Personvern og data», og er dermed synlig på alle sider. Den står også i samtykketeksten og i Personvern og data. Dette avsnittet er eneste kilde for hvor lenken står.

→ Referanser: [mockups/desktop-layout.html](mockups/desktop-layout.html) (oppsett A), [imports/Skisse-design.jpg.jpeg](imports/Skisse-design.jpg.jpeg) (første skisse) og [reconcile-skisse-design.md](reconcile-skisse-design.md) (hva som er tatt med fra skissen).

## Voice and Tone

Tekstene er **motiverende og heiende**. De bruker du-form, korte setninger, og emoji er lov. Merkevarestemmen er beskrevet i `DESIGN.md`.

| Gjør | Ikke gjør |
|---|---|
| «Hei, Ida 👋» | «Velkommen tilbake, bruker» |
| «Alt unna i dag 🎉 Nyt kvelden!» | «Ingen oppgaver.» |
| «Forfalt» som nøktern gruppeoverskrift | Ros på forfalte oppgaver |
| «Forslag basert på nøkkelord – KI var ikke tilgjengelig» | «Feil 503» |
| «Er du sikker? Oppgaven kan ikke gjenopprettes.» | Spøk i slettedialoger |
| Skyldfri tone | «Du har 3 forfalte oppgaver!!» |

*Eksempler på tonen, uten egen flate:* «Sterkt! 3 av 4 økter gjort 💪» og «Du har kontroll på uka!». De viser stemmen, men er ikke knyttet til noen tilstand i v1. Det finnes ingen fremdriftsstrek for økter.

Heiingen hører hjemme i **positive øyeblikk**, som avhuking, tom dag og en plan som går opp. Personvern, sletting og feil skrives saklig og tydelig, uten emoji.

## Component Patterns

Her beskrives oppførselen. Navnene er de samme som i `DESIGN.md` → Components, og tokenkolonnen viser til `components` i frontmatter i DESIGN.md. Regler for økter og KI-planlegging eies av seksjonen **KI-planlegging (økter)**. Radene under henviser dit.

| Komponent | Token | Bruk | Regler |
|---|---|---|---|
| Oppgavekort | `task-card` | Oppgaver, Kalender (dagsliste), søk | Trykk på kortet åpner detaljen. Trykk på ringen huker av. |
| Øktkort | `session-card` | Smartlista for øktas dag, Kalender | «Økt n/N – <oppgave>». Trykk åpner oppgavens detalj. Se KI-planlegging for livssyklus. |
| Øktvarsel | `session-warning` | Øktkort | «⚠ Kolliderer med <hendelse>» eller «⚠ Etter fristen», med *Endre tid* og eventuelt *Foreslå ny tid*. Når knappen vises, og hva som sendes: se KI-planlegging. |
| Hendelsesrad | `event-row` | Øverst i «I dag», Kalender | Ingen ring. Trykk åpner hendelsesdetalj. Forsvinner av seg selv når den er over, og havner ikke i Arkiv. Andre dagers hendelser vises bare i Kalender. |
| Avkrysningsring | `check-ring` | Oppgave- og øktkort | Avhuket oppgave: animasjon (se Interaction Primitives), deretter Snackbar og flytting til **Arkiv**. Har oppgaven uferdige økter, spør appen først (se KI-planlegging). Avhuket økt blir værende med strek over til dagen er slutt. |
| Gruppeoverskrift | `group-header` | Oppgaver | Viser antall elementer i gruppa, inkludert økter. «Ingen frist (n)» kan felles sammen. |
| Filterknapper | `filter-chip` | Oppgaver | Alle / Skole / Jobb / Privat. Én etikett er valgt om gangen. Filtrerer også Kalender. |
| Filterark | `filter-sheet` | Knappen «☰ Filter» ved filterknappene | Velg prioritet, frist og prosjekt (FR-26). Aktive filtre vises som fjernbare filterknapper med «×». Frist-filteret har valgene Forfalt / I dag / Denne uken / Senere / Ingen frist. |
| Sortering | `sort-button` | Oppgaver («⇅ Frist») | Valg: **Frist** (standard, FR-24) / **Prioritet** / **Nyeste**. Velger studenten noe annet enn Frist, gjelder valget til lista åpnes på nytt (FR-25). |
| Søkefelt | `search-field` | Lupe øverst (mobil), ved filterknappene (PC) | Søker i tekst, notater, prosjekt og sammendrag (FR-27). Hvert treff viser *Aktiv* eller *Fullført* og frist (FR-28). På mobil fyller feltet toppen når lupen trykkes, med *Avbryt* til høyre. Esc eller *Avbryt* lukker søket. |
| Skrivefelt | `quick-add-field` | Øverst i lista (PC) | Enter åpner skjemaet i panelet, med teksten ferdig utfylt. «N» fokuserer feltet. KI-påminnelsen står under når KI er på (FR-37). |
| Flytende knapp | `fab` | Oppgaver og Kalender (mobil og nettbrett) | «+ Ny oppgave» åpner skjemaet med Oppgave valgt. Fra Kalender med valgt dag er frist eller dato ferdig utfylt. |
| Skjema Ny/Endre | – | Egen side (mobil og nettbrett), panel (PC) | Bare oppgavetekst er påkrevd, med hjelpeteksten «Bare oppgaveteksten er påkrevd. Resten kan stå tomt.» **Lagre** lagrer straks (FR-2). KI-forslag kommer *etter* lagring, på detaljen. Tilbakepil eller Esc spør «Forkaste endringene?» bare når noe er endret. |
| Skjemafelt | `text-field` | Skjema, Innstillinger | Ledetekst over, hjelpetekst og feil under. Innholdet beholdes ved feil. |
| Velger [Oppgave \| Hendelse] | `segmented-toggle` | Øverst i skjemaet | Bytter feltene uten å miste oppgaveteksten/tittelen. Vises bare ved Ny, ikke ved Endre. |
| Prioritetsvelger | `priority-selector` | Skjema (Oppgave) | Lav / Middels / Høy. Standard er Middels (FR-12). Piltaster flytter valget. |
| Hendelsesfelt | `text-field` | Skjema (Hendelse) | Tittel, dato, start, slutt, Gjenta: Ingen / Hver uke / Annenhver uke, med sluttdato. Er slutt før start, regnes slutt som neste dag, og tiden vises som «21:00 – 07:30 (+1 dag)». Uregelmessig turnus legges inn én og én. |
| Personvernbryter | `privacy-switch` | Nederst i skjemaet | Holder en oppgave helt utenfor KI, eller skjuler tittelen på en hendelse for KI. Se [Personvernbryter](#personvernbryter). |
| Låsikon | `lock-icon` | Oppgavekort, hendelsesrad, oppgavedetalj, hendelsesdetalj | Vises når 🔒 er på. Skjermlesertekst «Skjult for KI». |
| KI-påminnelse | `ai-reminder` | Under oppgavetekst i skjemaet, under skrivefeltet (PC) og under tittel på hendelse | Vises bare når KI er på, med teksten som passer innstillingene. Tekstene står i [Personvern og data – fastsatte tekster](#personvern-og-data--fastsatte-tekster). |
| KI-forslagsboks | `ai-suggestion-box` | Oppgavedetalj | Én rad per felt med *Godta* og *Endre*. Kortform i teksten: «KI-boksen». Se [KI-forslagsboks](#ki-forslagsboks). |
| Foreslått økt-rad | `suggested-session-row` | I KI-boksen, under «✦ Foreslåtte økter» | Dag og tid (for eksempel «Man 08:00–10:00») med *Godta* / *Endre*. Se KI-planlegging. |
| Merket «regelbasert» | `fallback-badge` | Forslagsrader fra reserveløsningen | Står på hver rad. KI-boksen har i tillegg linjen «Forslag basert på nøkkelord – KI var ikke tilgjengelig» (FR-18). |
| Ubesvarte forslag | `unanswered-dot` | Oppgavekort | «✦»-prikken vises til alle forslag er besvart (FR-12). |
| «+ Legg til økt» | `add-session-button` | Oppgavedetalj | Alltid tilgjengelig. Eneste måte å få økter på uten KI. Åpner valg av dag og tid for en ny økt. |
| Oppgavedetalj | `detail-panel` | Egen side (mobil), panel (PC) | *Endre* åpner skjemaet. *Fullfør* huker av som ringen. *Slett* åpner slettedialogen. Se [mockups/key-detalj.html](mockups/key-detalj.html). |
| Hendelsesdetalj | `detail-panel` | Egen side (mobil), panel (PC) | *Endre* og *Slett*. På en gjentakende hendelse spør appen «Bare denne / Denne og alle senere». Sletting bekreftes. |
| Kalender | `calendar` | Kalender-fanen | Trykk på en dag velger den og viser **dagslista**. Se [Kalender](#kalender). |
| Kalenderprikk | `calendar-dot` | Kalender (mobil) | Oppgave = `{colors.accent-ink}`, økt = hul ring, hendelse = `{colors.text-muted}`, forfalt = `{colors.warn}`. Dagen har alltid en tekstlig ekvivalent for skjermleser. |
| Bunnmeny | `bottom-nav` | Mobil | Tre faner. Trykk på aktiv fane ruller til toppen. Ingen badge-tellere. |
| Sidemeny | `sidebar-item-active` | PC og nettbrett | Samme faner. Innhold nederst: se Information Architecture. |
| Arkivrad | `archive-row` | Arkiv | «Slettes om n dager» (FR-31), «Slettes i morgen» i `{colors.warn}` den siste dagen. «…»-meny med *Gjenopprett* og *Slett nå*. |
| Dialog / bekreftelse | `dialog` | Sletting, fullføring med økter, forkaste, import, Slett alle data | Fokusfelle. Esc = *Avbryt*. Ved sletting har *Avbryt* standardfokus. Fokus går tilbake til knappen som åpnet dialogen. |
| Snackbar | `snackbar` | Etter avhuking | «Flyttet til Arkiv · Angre» i ca. 5 sekunder. *Angre* legger oppgaven tilbake der den var. Én snackbar om gangen; en ny erstatter den forrige. |
| Skeleton | `skeleton` | KI-boksen mens forslag hentes | «✦ Lager forslag …». Pulseringen stoppes ved `prefers-reduced-motion`. |
| Banner | `banner` | Øverst på alle sider | Brukes når lagring feiler (se State Patterns). Kan ikke lukkes så lenge feilen varer. |
| Prosjektliste | `project-list-row` | Innstillinger → Prosjekter | Viser alle prosjektnavn som er brukt. Sletting fjerner navnet fra alle oppgaver, etter «Er du sikker?». Etikettene Skole/Jobb/Privat er faste og kan ikke slettes. |
| Temavelger | `theme-swatch` | Innstillinger → Utseende | Seks fargeprøver. Endringen vises umiddelbart. |
| Modusvelger | `segmented-toggle` | Innstillinger → Utseende | Lys / Mørk / Følg systemet. Følg systemet er standard. |
| Personvernlenke | `privacy-link` | Se Information Architecture | Åpner erklæringen. Fra førstegangsoppsettet åpnes den uten at oppsettet mistes. |
| Førstegangsoppsett | `onboarding-page` | Første oppstart | Side 1: fornavn. Side 2: KI-valg. Se Flyt 3 og [mockups/key-skjema-oppstart.html](mockups/key-skjema-oppstart.html). |

### Personvernbryter

- **Oppgave: «🔒 Ikke send til KI».** Ingen data til KI og ingen KI i det hele tatt for oppgaven, heller ikke økter eller *Foreslå ny tid* (FR-38).
- **Hendelse: «🔒 Skjul tittel for KI»**, med hjelpeteksten «KI får bare vite at du er opptatt kl. 14–15, ikke hva du skal.» Klokkeslettene er hendelsens egne.

### KI-forslagsboks

- Én rad per felt: etikett, prioritet og sammendrag. *Godta* setter verdien, og *Endre* åpner feltet. *Godta alle* godtar hele KI-boksen.
- Nederst står «Frist: ingen foreslått – legg til selv» (FR-5).
- Ubesvarte forslag blir liggende (FR-12).
- Nye forslag etter endret tekst (FR-13): hver rad viser forslaget og nåværende verdi, for eksempel «Prioritet: Høy (nå: Middels)». Den gamle verdien gjelder til studenten godtar.

### Kalender

- Dagslista vises under rutenettet på mobil og i panelet til høyre på PC. Den har «+ Ny» med dagen ferdig utfylt.
- Topplinjen har forrige / neste måned og «I dag». På PC står «+ Ny» også i topplinjen.
- Har en dag flere elementer enn det er plass til (PC), vises «+n til», som velger dagen.
- Forfalte oppgaver vises på opprinnelig dato i varselfarge.
- «Ingen frist (n)» er en sammenleggbar seksjon under rutenettet.
- Bare godtatte økter vises.
- Se [mockups/key-kalender.html](mockups/key-kalender.html).

## State Patterns

| Tilstand | Flate | Behandling |
|---|---|---|
| Første oppstart | Førstegangsoppsett | (1) «Hei! Hva heter du?» med fornavn, som kan hoppes over. (2) KI-valg med fastsatt samtykketekst (se Personvern og data – fastsatte tekster). «Ja» og «Nei» er like synlige, og ingen er forhåndsvalgt (FR-35). |
| Uten fornavn | Oppgaver | Hilsenen er «Hei 👋». |
| Tom «I dag» | Oppgaver | «Alt unna i dag 🎉 Nyt kvelden!» Gruppa vises fortsatt. |
| Tom gruppe | Oppgaver | Tomme grupper utenom «I dag» skjules, også «Denne uken» på søndag (FR-22). «I dag» vises alltid. |
| Tomt filter | Oppgaver | «Ingen oppgaver med dette filteret.» og knappen *Fjern filter*. |
| Helt tom app | Oppgaver | KI på: «Hei, Ida 👋 Skriv inn det første du må huske – KI hjelper deg å sortere.» KI av: «Hei, Ida 👋 Skriv inn det første du må huske.» Uten navn begynner teksten med «Hei 👋» i stedet. Pil mot «+ Ny oppgave». |
| KI henter forslag | Oppgavedetalj | Skeleton med «✦ Lager forslag …». Oppgaven er allerede lagret, og studenten kan gå videre. Når forslagene kommer: «3 KI-forslag klare» til skjermleser. |
| KI utilgjengelig | Oppgavedetalj | Regelbaserte forslag til etikett og prioritet, merket «regelbasert», og linjen «Forslag basert på nøkkelord – KI var ikke tilgjengelig» (FR-18). Ingen sammendrag og ingen økter. «+ Legg til økt» vises. |
| KI av | Oppgavedetalj | Ingen KI-boks og ingen påminnelser. «+ Legg til økt» vises. Øktvarsler har bare *Endre tid*. |
| Ikke send til KI | Oppgavedetalj | Låsikon ved tittelen. Ingen KI-boks. «+ Legg til økt» vises. Øktvarsler har bare *Endre tid*. |
| Forfalt | Oppgaver, Kalender | Gruppe **øverst** i lista, med stripe og overskrift i varselfarge (`{colors.warn}`). Passerte økter som ikke er huket av, ligger også her. I Kalender vises oppgaven på opprinnelig dato i varselfarge. |
| Ingen frist | Kalender | Sammenleggbar seksjon «Ingen frist (n)» under rutenettet. |
| Tom måned | Kalender | Rutenettet vises som vanlig, med teksten «Ingen planer denne måneden ennå» under. |
| Valgt dag uten noe | Kalender | «Fri dag 🙌» og knappen «+ Ny» med dagen ferdig utfylt. |
| Søk uten treff | Søk | «Fant ingenting på "statistikk". Sjekk stavingen eller prøv et annet ord.» |
| Arkiv | Arkiv | En tekst forteller at fullførte oppgaver ligger her i 7 dager. Arkivrader med nedtelling (FR-30, FR-31). |
| Tomt arkiv | Arkiv | «Ingen fullførte oppgaver ennå – hold på! 💪» |
| Sletting | Alle | Dialogen «Er du sikker? Oppgaven kan ikke gjenopprettes.» (FR-34). Med økter: «Oppgaven og n økter slettes. Det kan ikke angres.» |
| Skjemafeil | Skjema | Tom oppgavetekst gir «Skriv inn hva du skal gjøre» ved feltet. Lik start og slutt gir «Slutt må være etter start». Slutt før start er lov og betyr neste dag. |
| Fokus | Alle | Synlig fokusring, `{components.focus-ring}` (2 px i `{colors.accent-ink}`). |
| Ingen prosjekter | Innstillinger → Prosjekter | «Prosjekter dukker opp her når du skriver dem på en oppgave.» |
| Lagring feiler | Alle | Banner: «Nettleseren lar ikke appen lagre. Det du skriver nå, forsvinner når du lukker fanen.» Appen virker ellers. |
| Samtykke gitt | Personvern og data | «Godkjent 9.11.2026 (tekst v2)» – dato og versjon av samtykketeksten som ble godkjent. Ny tekstversjon gir nytt samtykke. |
| Import fullført | Personvern og data | «Importen er fullført.» |
| Import feiler | Personvern og data | «Fila kunne ikke leses. Ingen data er endret.» |
| Etter «Slett alle data» | Førstegangsoppsett | Alt er slettet, også navn og samtykke. Appen starter på Førstegangsoppsett. |

Ubesvarte forslag, nye forslag etter endret tekst, ulagrede endringer og øktvarsler er beskrevet i Component Patterns og KI-planlegging.

## Interaction Primitives

- **Trykk** åpner, og **trykk på ringen** huker av. Det finnes ingen skjulte sveipebevegelser i v1.
- **Avhuking:** Ringen fylles med temafargen og haken spretter (ca. 300 ms). Deretter glir kortet ut av lista. Ved `prefers-reduced-motion` fylles ringen umiddelbart og kortet forsvinner uten glid.
- **Angre etter avhuking:** med *Angre* i snackbaren, og etterpå med *Gjenopprett* i Arkiv (FR-32).
- **Endring av frist** flytter oppgaven straks til riktig liste (FR-23).
- **PC:** Alt kan brukes med tastatur. Tab går i leserekkefølge. Enter åpner, Esc lukker panel, søk og dialog, og «N» fokuserer skrivefeltet.
- **Bannlyst:** streaks og poeng som straffer, badge-tellere på faner, karuseller, automatisk omplanlegging uten at studenten godtar, og KI som setter frist på egen hånd (FR-5).

## Accessibility Floor

Her beskrives oppførselen. Kontrast er beskrevet i `DESIGN.md` under Colors.

- **WCAG 2.1 AA** på alle flater.
- Alle knapper og felt har tilgjengelige navn, for eksempel «Huk av: Lese kapittel 4–5» eller «Godta foreslått etikett: Skole».
- KI-forslag som kommer inn, annonseres med `aria-live="polite"` («3 KI-forslag klare»).
- Avhuking annonseres: «Flyttet til Arkiv». *Angre* i snackbaren kan nås med tastatur mens den vises.
- Valgt filter, prioritet, dag og valgt side i velgere har både et synlig ekstra signal (kant eller hake) og `aria-pressed` / `aria-selected`.
- Dialoger har fokusfelle, Esc = *Avbryt*, og fokus går tilbake etter lukking.
- Låsikonet har skjermlesertekst «Skjult for KI».
- Trykkflater er minst 44 × 44 px på mobil. Avkrysningsringen er 20 px visuelt, men trykkflaten er 44 px.
- Kalenderen kan brukes med tastatur (piltaster mellom dager) og skjermleser («Onsdag 11. november, 2 oppgaver, 1 økt, 1 hendelse»). Prikker på mobil har alltid en tekstlig ekvivalent.
- Farge er aldri eneste signal. Forfalt har både stripe og gruppeoverskrift, Høy har tekst, og øktvarsler har ⚠ og tekst.
- `prefers-reduced-motion` respekteres, og `prefers-color-scheme` brukes når modus er «Følg systemet».
- Skjemaet beholder innholdet ved feil, og feilmeldinger står ved feltet de gjelder.

## Inspiration & Anti-patterns

- **Tatt fra gruppas egen skisse:** grupper etter frist, KI-forslag per felt med Godta/Endre, og arkiv med nedtelling.
- **Tatt fra e-postklienter (oppsett A):** liste og detaljpanel side om side på PC, slik at man ser oversikt og detaljer samtidig.
- **Tatt fra Google Kalender:** månedsrutenett med titler i dagene på PC.
- **Forkastet:** Todoist og Things (for tette, se `DESIGN.md` → Brand & Style), automatisk omplanlegging (se KI-planlegging) og skissens personvernløfter (erstattet av de fastsatte tekstene, se [reconcile-skisse-design.md](reconcile-skisse-design.md)).

## Responsive & Platform

Bredder, marger og plassering eies av `DESIGN.md` → Layout & Spacing. Her beskrives hvordan appen oppfører seg på hver bredde.

| Bredde | Oppførsel |
|---|---|
| < 768 px (mobil) | Detalj og skjema åpnes som egen side. Kalenderen har prikker, og dagslista vises under rutenettet. |
| 768–1023 px (nettbrett) | Detalj og skjema åpnes som egen side, som på mobil. Kalenderen viser tekst. |
| ≥ 1024 px (PC) | Detalj og skjema åpnes i panelet til høyre. Kalenderen har titler i dagene, og valgt dag åpner dagslista i panelet. |

Samme komponenter og tokens brukes på alle bredder. Designet skal oppleves som ett produkt.

## KI-planlegging (økter)

Økter er en ny funksjon som ikke står i PRD-en. Her beskrives en enkel variant. Denne seksjonen eier reglene for økter. Komponentradene henviser hit.

**Forslag**
1. Når en oppgave **med frist** lagres og KI er på, kommer forslag til etikett, prioritet og sammendrag, og i tillegg **foreslåtte økter** i KI-boksen.
2. Øktene skal legges utenom hendelser og andre godtatte økter. KI-en skal helst unngå å legge økter rett etter for eksempel en nattevakt. Hvordan dette styres i prompten, bestemmes i arkitekturen.
3. Studenten godtar eller endrer hver økt, eller trykker *Godta alle*. Først da vises øktene i lister og Kalender.
4. **Ingen automatisk omplanlegging.** Kolliderer en hendelse med en godtatt økt, får økta merket «⚠ Kolliderer med <tittel>».
5. **Uten KI** (KI av, KI utilgjengelig eller 🔒 på oppgaven) blir det ingen øktforslag. Studenten bruker «+ Legg til økt». Reserveløsningen foreslår ikke økter.
6. **Endret oppgavetekst (FR-13)** gir nye forslag til etikett, prioritet og sammendrag, men ikke nye øktforslag når økter allerede er godtatt. Godtatte økter beholdes, og studenten flytter dem selv ved behov.

**Hva KI får (øktforslag og «Foreslå ny tid»)**
- oppgavetekst, notater (ikke når «Send aldri notater til KI» er på) og frist
- hendelser i en **begrenset periode** fram til fristen: dato og klokkeslett, og tittelen når «Send hendelsestitler til KI» er på. Hendelser med «🔒 Skjul tittel for KI» sendes bare som «opptatt» med tidspunkt. Antall dager (for eksempel 14) avgjøres i arkitekturen.
- andre godtatte økter bare som «opptatt» med tidspunkt, uten oppgavetekst, også økter til 🔒-oppgaver
- aldri fornavnet, og ingenting fra oppgaver merket «🔒 Ikke send til KI»

**«Foreslå ny tid»** vises bare når KI er på og oppgaven ikke er merket 🔒. Ellers vises bare *Endre tid*. KI foreslår én ny tid, som studenten godtar eller endrer. Er KI på, men svarer ikke: «KI svarte ikke. Flytt økta selv med Endre tid.» 🔒 betyr ingen KI i det hele tatt for oppgaven, heller ikke omplanlegging.

**Økters livssyklus**

| # | Situasjon | Regel |
|---|---|---|
| 1 | Godtatt økt | Vises i smartlista for sin dag som «Økt n/N – <oppgave>» og teller med i antallet i gruppeoverskriften. Vises også i Kalender. Kan hukes av for seg. Oppgaven er fullført først når selve oppgaven hukes av. |
| 2 | Passert økt som ikke er huket av | Havner i **Forfalt** i varselfarge til den hukes av, flyttes (*Endre tid*) eller slettes. |
| 3 | Ny, tidligere frist | Økter etter fristen beholdes, men får merket «⚠ Etter fristen» med *Endre tid* (og *Foreslå ny tid* når den er tilgjengelig). Ingen automatisk endring. |
| 4 | Oppgaven fullføres med uferdige økter | Dialog: «Du har n økter igjen. Fullføre likevel?» Ved ja følger øktene oppgaven til Arkiv. Ved gjenoppretting kommer de tilbake, og passerte uferdige økter havner i Forfalt. |
| 5 | Oppgaven slettes | Alle øktene slettes. Dialog: «Oppgaven og n økter slettes. Det kan ikke angres.» |

## Personvern og data – fastsatte tekster

Tekstene under er fastsatt og skal brukes ordrett. Tonen er saklig, uten emoji.

**Fastsatt samtykketekst (FR-35)**

Vises i førstegangsoppsettet (Flyt 3) og når KI slås på etter et «Nei».

> **Vil du bruke KI?**
>
> dueNext kan bruke KI-tjenesten Claude til å foreslå etikett, prioritet og sammendrag, og til å foreslå når du kan jobbe med en oppgave, også en ny tid hvis en økt kolliderer.
>
> **Dette sendes når KI er på:**
> - teksten og notatene på oppgavene dine, og fristen
> - dato og klokkeslett på hendelsene i kalenderen din, og titlene hvis du tillater det (for eksempel «Jobbvakt tor 16–22»), slik at øktene legges utenom dem
> - tidspunktene for økter du allerede har planlagt, bare som «opptatt»
>
> Navnet ditt sendes aldri.
>
> **Hvem får det:** Anthropic, selskapet bak Claude. Avtalen er med Anthropic Ireland, men dataene behandles i USA. Overføringen er sikret med EUs standardavtaler (SCC).
>
> **Hvor lenge:** Anthropic bruker ikke dataene til å trene KI-modeller. De slettes normalt innen 30 dager, men kan lagres i inntil 2 år hvis en forespørsel flagges for brudd på bruksreglene. Det som er sendt, kan ikke slettes fra appen.
>
> **Vær forsiktig:** Skriv helst ikke helseopplysninger eller navn på andre, heller ikke i hendelser som «Legetime». Bruk 🔒 eller en nøytral tittel som «Avtale». Velger du *Ja*, samtykker du også til at slike opplysninger sendes hvis du likevel skriver dem. Med **🔒 Ikke send til KI** holder du en oppgave helt utenfor. Med **🔒 Skjul tittel for KI** på en hendelse sendes bare at du er opptatt. Titlene på hendelsene sendes som standard. Du kan slå det av i Innstillinger → Personvern og data.
>
> Appen virker fullt ut uten KI. Da fyller du ut feltene og legger inn økter selv. Du kan ombestemme deg når som helst i Innstillinger → Personvern og data.
>
> [Les hele personvernerklæringen]
>
> **[ Nei, uten KI ]**  **[ Ja, bruk KI ]**

**KI-påminnelser** (vises bare når KI er på)

- Oppgave: «Teksten og notatene sendes til KI (Claude) for å lage forslag.» Uten «og notatene» når «Send aldri notater til KI» er på.
- Hendelse: «Tittel og tid brukes av KI (Claude) når den planlegger økter. Slå på 🔒 hvis tittelen er privat – da sendes bare at du er opptatt.» og «Unngå navn på andre og helseopplysninger – bruk 🔒 eller en nøytral tittel som "Avtale".»
- Når 🔒 er på: «Sendes ikke til KI.» (oppgave) eller «KI ser bare at du er opptatt.» (hendelse).
- Er «Send hendelsestitler til KI» av, vises «KI ser bare at du er opptatt.» på alle hendelser.

**Innhold i Personvern og data**

- **KI-forslag** (på/av, FR-36), med samtykkestatus som undertekst. Slås KI på etter et «Nei», vises samtykketeksten over først. Slås KI av, kommer det ingen nye forslag (FR-19).
- **Send aldri notater til KI** (FR-39).
- **Send hendelsestitler til KI** – standard **på**. Hjelpetekst: «Av: KI ser bare når du er opptatt, ikke hva du skal.» «🔒 Skjul tittel for KI» per hendelse gjelder i tillegg.
- **Samtykkestatus**, for eksempel «Godkjent 9.11.2026 (tekst v2)». Samtykket lagres i nettleseren med dato og tekstversjon.
- **Eksporter / Importer / Slett alle data** (se Flyt 7).
- Lenken «Personvernerklæring» til hele erklæringen.

Rekkefølge på siden: KI-forslag → Send aldri notater til KI → Send hendelsestitler til KI → Hva sendes til KI → Lagring → Eksporter / Importer → Slett alle data → Personvernerklæring. På PC vises siden med tilbakepil i to kolonner, uten detaljpanel. Se [mockups/key-personvern.html](mockups/key-personvern.html).

**Hva sendes til KI**

> ✓ Oppgavetekst, notater (kan slås av) og frist
> ✓ Dato og klokkeslett på hendelser, og tittelen hvis «Send hendelsestitler til KI» er på. Hendelser med 🔒 sendes bare som «opptatt».
> ✓ Tidspunkter for andre økter, som «opptatt»
> ✓ Bare hendelser og økter for en begrenset periode fram til fristen
> ✕ Oppgaver merket 🔒
> ✕ Fornavnet ditt
> Skriv ikke navn, telefonnummer eller helseopplysninger – appen fjerner dem ikke automatisk.

**Lagring**

> Alt ligger bare i denne nettleseren. Det som sendes til Anthropic, slettes normalt innen 30 dager, men kan lagres i inntil 2 år hvis det flagges for brudd på bruksreglene.

Linjen om navn, telefonnummer og helseopplysninger gjelder til FR-42 eventuelt bygges. Da byttes den til: «Appen prøver å bytte ut telefonnumre og e-post med plassholdere før sending, men kan ikke garantere at alt blir fanget.»

**Eksport (advarsel før lagring av fila)**

> Fila inneholder alt du har skrevet, også navnet ditt og hendelsene. Lagre den et trygt sted.

**Import (dialog)**

> **Importere data?** Importen erstatter alle data i appen. Fortsette?

Knapper: *Avbryt* / *Importer*. Importerte oppgaver sender ingenting til KI før teksten endres. Suksess: «Importen er fullført.» Feil: «Fila kunne ikke leses. Ingen data er endret.» Samtykket følger ikke med i importen. Etter import må KI-valget besvares på nytt.

**Slett alle data (dialog)**

> **Slette alle data?** Alle oppgaver, hendelser, økter, navnet ditt og innstillingene slettes fra denne nettleseren, og appen starter på nytt. Det kan ikke angres. Tekst som allerede er sendt til KI, kan ikke slettes herfra – Anthropic sletter den normalt innen 30 dager.

Knapper: *Avbryt* / *Slett alt* (varselfarge). *Avbryt* har standardfokus.

**Personvernerklæringen** (FR-41). I tillegg til PRD-kravene skal erklæringen si:

- at formålet også er planlegging av økter
- at ingen automatiske avgjørelser tas (studenten godtar alt)
- at reserveløsningen ikke sender noe
- at aldersgrensen er 13 år
- at fornavn, tema og samtykkevalg lagres lokalt
- hvilke data som sendes (som over)

Behandlingsansvarlig står som plassholder til PRD Å-3 er avklart.

## Key Flows

### Flyt 1 – Ida planlegger uka (mobil, søndag kveld i senga)

Ida er 21 år og går 2. år på økonomi. Hun har nettopp fått en ny innlevering i Canvas med frist fredag.

1. Ida åpner dueNext. **Oppgaver** viser «Hei, Ida 👋» og gruppene Forfalt / I dag / Denne uken / Senere / Ingen frist.
2. Hun trykker på den flytende knappen «+ Ny oppgave», velger **Hendelse** i velgeren og legger inn «Håndballkamp», onsdag 18–20. Under tittelen står påminnelsen om at tittel og tid brukes av KI. Hun trykker Lagre.
3. Hun legger inn «Jobbvakt», torsdag 16–22, på samme måte.
4. Hun legger inn oppgaven «Innlevering i markedsføring» med frist fredag og trykker Lagre. Oppgaven er lagret med én gang.
5. I detaljen viser KI-boksen etikett **Skole**, prioritet **Høy**, et sammendrag og **tre foreslåtte økter**: mandag, tirsdag og fredag morgen, rundt kampen og vakten.
6. Hun trykker *Endre* på én økt og flytter den, fordi hun vet at hun blir sliten etter jobb. Så trykker hun *Godta alle*.
7. Hun trykker på **Kalender**. Prikkene viser økter (hule ringer), kamp, vakt og frist fordelt utover uka. Hun trykker seg gjennom dagene, og dagslista vises under rutenettet.
8. **Klimaks:** Ida ser at uka går opp. Innleveringen blir ferdig selv med kamp og vakt. *«Yes, dette hjalp.»*

Avvik: Er KI utilgjengelig i steg 5, får hun regelbasert etikett og prioritet med «Forslag basert på nøkkelord – KI var ikke tilgjengelig», og legger inn øktene selv med «+ Legg til økt». Har hun sagt nei til KI, er det ingen KI-boks og ingen påminnelser, bare «+ Legg til økt».

### Flyt 2 – Sara får turnus og hjemmeeksamen til å gå opp (PC, torsdag kveld ved kjøkkenbordet)

Sara er 23 år og går 3. år på sykepleie. Hun har fått turnusplanen for praksis neste måned, og en hjemmeeksamen som åpner om ti dager.

1. Sara åpner dueNext i nettleseren og går til **Kalender** i sidemenyen.
2. Hun trykker på en dag, velger «+ Ny» i dagslista og deretter **Hendelse**, og legger inn praksisvaktene. De faste vaktene får «Gjenta: Hver uke», og de uregelmessige legges inn én og én. En nattevakt 21:00–07:30 vises som «21:00 – 07:30 (+1 dag)».
3. Hun legger inn oppgaven «Hjemmeeksamen» med frist og lagrer.
4. I detaljpanelet til høyre foreslår KI leseøkter på fridager og korte økter før kveldsvakter, men ingen rett etter nattevakt. Hun trykker *Godta alle*.
5. Hun ser over uka og kommer plutselig på en legetime hun har glemt. Hun legger inn «Legetime» som hendelse. Økta som ligger samtidig, får merket «⚠ Kolliderer med Legetime».
6. Hun trykker **Foreslå ny tid**, og KI foreslår en ny tid som hun godtar.
7. **Klimaks:** Kalenderen viser at både turnus og hjemmeeksamen går opp, og at planen gir henne hvile etter vaktene.

Avvik:
- **KI på, men svarer ikke** i steg 6: «KI svarte ikke. Flytt økta selv med Endre tid.» Hun trykker *Endre tid* og flytter økta.
- **KI av** eller oppgaven er 🔒: knappen *Foreslå ny tid* vises ikke. Hun flytter økta selv med *Endre tid*.
- **Personvern:** Med «Send hendelsestitler til KI» på sendes titler som «Legetime». Vil Sara unngå det for denne hendelsen, slår hun på «🔒 Skjul tittel for KI», og KI ser bare at hun er opptatt. Vil hun skjule alle titler, slår hun av bryteren i Personvern og data (Flyt 7).
- **Gjentakende vakt endres:** Endrer hun én vakt i serien, spør appen «Bare denne / Denne og alle senere».

### Flyt 3 – Ida starter appen for første gang (mobil)

1. Første skjerm viser «Hei! Hva heter du?» med et felt for fornavn og hjelpeteksten «Bare for hilsenen. Lagres på denne enheten.» Ida skriver «Ida» og trykker *Fortsett*.
2. Deretter kommer KI-valget med den fastsatte samtykketeksten (se [Personvern og data – fastsatte tekster](#personvern-og-data--fastsatte-tekster)). *Ja* og *Nei* er like store og står side om side, og ingen er forhåndsvalgt. Lenken «Les hele personvernerklæringen» åpner erklæringen uten at oppsettet mistes.
3. Ida leser og trykker *Ja, bruk KI*. Samtykket lagres med dato og tekstversjon.
4. **Klimaks:** Ida havner på **Oppgaver** med «Hei, Ida 👋», pastellblått tema og lys eller mørk modus etter systemet. Hun vet hva hun har sagt ja til, og kan begynne med én gang: «Skriv inn det første du må huske – KI hjelper deg å sortere.»

Avvik:
- **Nei til KI:** Ida havner på Oppgaver med «Hei, Ida 👋 Skriv inn det første du må huske.» Det er ingen KI-boks og ingen påminnelser. Økter legges inn med «+ Legg til økt».
- **Uten navn:** Trykker hun *Hopp over* i steg 1, er hilsenen «Hei 👋». Navnet kan legges inn senere i Innstillinger → Profil.

### Flyt 4 – Ida får tidligere frist (mobil)

Foreleseren flytter fristen for «Innlevering i markedsføring» fra fredag til torsdag.

1. Ida trykker på oppgaven, og detaljen åpnes.
2. Hun trykker **Endre**, endrer fristen til torsdag og trykker Lagre.
3. Oppgaven flytter seg straks til riktig liste (FR-23). Ingen nye KI-forslag kommer, fordi bare fristen er endret.
4. Fredagsøkta får merket «⚠ Etter fristen» med *Endre tid* og *Foreslå ny tid*. Hun trykker *Foreslå ny tid* og godtar en tid onsdag morgen.
5. **Klimaks:** Planen går fortsatt opp, og Ida måtte ikke starte på nytt.

Avvik:
- **Ny tekst (FR-13):** Endrer hun i steg 2 også teksten til «Innlevering i markedsføring – gruppeoppgave», kommer nye forslag i KI-boksen. Hver rad viser forslaget og nåværende verdi, for eksempel «Prioritet: Høy (nå: Middels)». De gamle verdiene gjelder til hun godtar.
- **Uten KI eller 🔒:** I steg 4 vises bare *Endre tid*, og hun flytter økta selv.

### Flyt 5 – Ida huker av og angrer (mobil)

1. Ida er ferdig med «Lese kapittel 4–5» og trykker på ringen. Ringen fylles, haken spretter og kortet glir ut av lista.
2. Snackbaren «Flyttet til Arkiv · Angre» vises nederst. Ida ser at hun huket av feil oppgave og trykker *Angre*. Oppgaven er tilbake der den var.
3. Hun huker av riktig oppgave, «Innlevering i markedsføring». Den har to uferdige økter, så appen spør «Du har 2 økter igjen. Fullføre likevel?» Hun trykker ja.
4. Senere åpner hun **Arkiv**. Oppgaven står der med «Slettes om 7 dager».
5. Hun husker at hun skal sende inn en rettelse, åpner «…»-menyen og trykker *Gjenopprett*. Oppgaven havner i smartlista som passer fristen (FR-32), og de uferdige øktene kommer tilbake.
6. **Klimaks:** Ingenting går tapt ved et feiltrykk, og Ida stoler på at avhuking er trygt.

Avvik:
- **5 sekunder er gått:** Snackbaren er borte. Ida angrer fra Arkiv med «…» → *Gjenopprett*, som i steg 5.
- **Slett nå:** I Arkiv kan hun velge *Slett nå*. Dialogen «Er du sikker? Oppgaven kan ikke gjenopprettes.» kommer først (FR-34).
- **Siste dag:** Arkivraden viser «Slettes i morgen» i varselfarge. Etter 7 dager slettes oppgaven automatisk (FR-30).

### Flyt 6 – Sara leter etter statistikkprøven (PC)

Sara er usikker på når statistikkprøven er, og om hun allerede har fullført den.

1. Hun klikker i søkefeltet ved filterknappene og skriver «statistikk».
2. Treffene viser både aktive og fullførte oppgaver. «Statistikkprøve» har merkelappen *Fullført* og frist 4. november.
3. **Klimaks:** Sara ser med én gang at prøven er unnagjort, uten å bla i Arkiv. Hun lukker søket med Esc.
4. Etterpå vil hun se det viktigste først. Hun åpner «☰ Filter», velger prioritet *Høy* og bytter sortering fra «⇅ Frist» til *Prioritet*. Det aktive filteret vises som en fjernbar filterknapp.

Avvik:
- **Ingen treff:** «Fant ingenting på "statistikk". Sjekk stavingen eller prøv et annet ord.»
- **Mobil:** Søket åpnes med lupen øverst, og søkefeltet fyller toppen.
- **Tomt filter:** «Ingen oppgaver med dette filteret.» med *Fjern filter*.

### Flyt 7 – Sara bytter PC og rydder opp (Personvern og data)

Praksisperioden er over, og Sara har fått ny bærbar PC.

1. På den gamle PC-en går hun til Innstillinger → **Personvern og data**. Hun leser «Hva sendes til KI» og ser «Godkjent 9.11.2026 (tekst v2)».
2. Hun slår av **Send hendelsestitler til KI**, fordi turnusen har mange private avtaler. Fra nå ser KI bare når hun er opptatt.
3. Hun trykker **Eksporter**. Advarselen «Fila inneholder alt du har skrevet, også navnet ditt og hendelsene. Lagre den et trygt sted.» vises, og hun lagrer fila.
4. På den nye PC-en åpner hun dueNext, går gjennom førstegangsoppsettet og velger **Importer** i Personvern og data. Hun bekrefter «Importen erstatter alle data i appen. Fortsette?» og får «Importen er fullført.» Ingenting sendes til KI før hun endrer teksten på en oppgave.
5. Tilbake på den gamle PC-en trykker hun **Slett alle data**, leser dialogen og trykker *Slett alt*.
6. **Klimaks:** Alt ligger på den nye PC-en, og den gamle starter på Førstegangsoppsett uten spor av henne.

Avvik:
- **Fila kan ikke leses:** «Fila kunne ikke leses. Ingen data er endret.»
- **Slår av KI:** Fra nå kommer ingen forslag (FR-19). «+ Legg til økt» og *Endre tid* virker som før.
- **Slår på KI igjen:** Den fastsatte samtykketeksten (se Personvern og data – fastsatte tekster) vises før KI blir slått på.

---
name: dueNext
status: draft
created: 2026-11-09
updated: 2026-11-09
sources:
  - docs/product-brief.md
  - docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/prd.md
  - docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/imports/Skisse-design.jpg.jpeg
---

# dueNext – opplevelse

## Foundation

dueNext er en **web-app** som skal fungere like godt på **telefon og PC**. Det finnes ingen innfødt app. Det er heller ikke valgt noe ferdig UI-bibliotek: komponentene følger `DESIGN.md`, som er den visuelle referansen. Denne fila beskriver hvordan appen virker.

Data lagres bare i studentens nettleser. Det finnes ingen innlogging eller konto (PRD, NFR-1). Appen må kunne kjøres av sensor uten KI-nøkkel, og da brukes reserveløsningen (PRD, F3).

Prosjektet er et skoleprosjekt i IBE160, men tilgjengelighet følger likevel **WCAG 2.1 AA**.

## Information Architecture

| Flate | Nås fra | Formål |
|---|---|---|
| Førstegangsoppsett | Første oppstart | Fornavn, deretter KI-valg (FR-35) |
| **Oppgaver** | Bunnmeny / sidemeny (start) | Hilsen, filter, søk og de smarte listene |
| Oppgavedetalj | Trykk på oppgave | Felt, KI-forslag, økter, notater, Endre, Fullfør, Slett |
| Ny / Endre (skjema) | «+ Ny oppgave», «Endre», trykk på dag i Kalender | Bryter [Oppgave \| Hendelse], felt, «🔒 Ikke send til KI» |
| Hendelsesdetalj | Trykk på hendelse (I dag / Kalender) | Tid, gjentakelse, Endre, Slett |
| **Kalender** | Bunnmeny / sidemeny | Månedsrutenett, dagsliste, «Ingen frist» |
| **Arkiv** | Bunnmeny / sidemeny | Fullførte oppgaver med 7-dagersregel |
| Søk | Lupe (mobil), søkefelt (PC) | Treff i aktive og fullførte oppgaver (FR-27/28) |
| Innstillinger | ⚙ øverst (mobil), sidemenyen nederst (PC) | Se under |
| ↳ Profil | Innstillinger | Fornavn (lokalt) |
| ↳ Utseende | Innstillinger | Mørk/lys-modus og Tema (6 pastellfarger) |
| ↳ Prosjekter | Innstillinger | Liste over brukte prosjektnavn, med mulighet for å slette |
| ↳ Personvern og data | Innstillinger, «Personvern» i sidemenyen | KI av/på, notater aldri til KI, hva som sendes, lagring, Eksporter / Importer / Slett alle data |
| ↳ Om appen | Innstillinger | Versjon og gruppe |
| Personvernerklæring | Lenke på alle skjermer (FR-41) | Full erklæring på norsk |

**Navigasjon.**
- **Mobil:** Bunnmeny med Oppgaver / Kalender / Arkiv. Logo, lupe og ⚙ ligger øverst. Oppgavedetalj, skjema og innstillinger åpnes som **egne sider** med tilbakepil. Det er aldri mer enn ett nivå med dialog over en side.
- **PC:** Sidemeny til venstre med de samme tre fanene, og Innstillinger og Personvern nederst. Lista ligger i midten, og **detaljpanelet** til høyre viser valgt oppgave (oppsett A).

**Personvern er flyttet** fra bunnmenyen i skissen og inn i Innstillinger. Erklæringen er fortsatt ett klikk unna fra alle skjermer.

→ Referanser: `mockups/desktop-layout.html` (oppsett A), `imports/Skisse-design.jpg.jpeg` (første skisse). Denne fila gjelder foran begge.

## Voice and Tone

Tekstene er **motiverende og heiende**. De bruker du-form, korte setninger, og emoji er lov. Merkevarestemmen er beskrevet i `DESIGN.md`.

| Gjør | Ikke gjør |
|---|---|
| «Hei, Ida 👋» | «Velkommen tilbake, bruker» |
| «Sterkt! 3 av 4 økter gjort 💪» | «Fremdrift: 75 %» |
| «Alt unna i dag 🎉 Nyt kvelden!» | «Ingen oppgaver.» |
| «Du har kontroll på uka!» | Skyldfølelse: «Du har 3 forfalte oppgaver!!» |
| «Forfalt» som nøktern gruppeoverskrift | Ros på forfalte oppgaver |
| «KI var ikke tilgjengelig. Forslagene er basert på nøkkelord.» | «Feil 503» |
| «Er du sikker? Oppgaven kan ikke gjenopprettes.» | Spøk i slettedialoger |

Heiingen hører hjemme i **positive øyeblikk**, som avhuking, tom dag og en plan som går opp. Personvern, sletting og feil skrives saklig og tydelig.

## Component Patterns

Her beskrives oppførselen. Visuelle detaljer står i `DESIGN.md` under Components.

| Komponent | Bruk | Regler |
|---|---|---|
| Oppgavekort | Oppgaver, Kalender (dagsliste), søk | Trykk på kortet åpner detaljen. Trykk på ringen huker av. |
| Avkrysningsring | Oppgave- og øktkort | Avhuket oppgave: animasjon (se Interaction Primitives), deretter flyttes den til **Arkiv**. Avhuket økt blir værende med strek over til dagen er slutt. |
| Øktkort | Smartlister på sin dag, Kalender | «Økt n/N – <oppgave>». Kan hukes av for seg. Selve oppgaven er fullført først når den hukes av. |
| Hendelsesrad | Øverst i «I dag», Kalender | Ingen ring. Trykk åpner hendelsesdetalj. Forsvinner av seg selv når den er over, og havner ikke i Arkiv. |
| Filterknapper | Oppgaver | Alle / Skole / Jobb / Privat. Én er valgt om gangen. Filtrerer også Kalender. |
| Sortering | Oppgaver («⇅ Frist») | Standard er FR-24. Annet valg gjelder til lista åpnes på nytt (FR-25). |
| KI-forslagsboks | Oppgavedetalj | Én rad per felt: etikett, prioritet, sammendrag. *Godta* setter verdien, *Endre* åpner feltet. *Godta alle* godtar hele boksen. Nederst står linjen «Frist: ingen foreslått – legg til selv» (FR-5). Ubesvarte forslag blir liggende (FR-12). |
| Foreslåtte økter | Oppgavedetalj, i KI-boksen | Rader med dag og tid (f.eks. «Man 08:00–10:00») med Godta/Endre. Bare godtatte økter vises i lister og Kalender. |
| «+ Legg til økt» | Oppgavedetalj | Alltid tilgjengelig. Eneste måte å få økter på uten KI. |
| Kollisjonsmerke | Øktkort | «⚠ Kolliderer med <hendelse>» og knappen **Foreslå ny tid**. KI foreslår én ny tid, som studenten godtar eller endrer. Ingen automatisk omplanlegging. |
| Skjema Ny/Endre | Egen side (mobil), panel (PC) | Bryter øverst [Oppgave \| Hendelse]. Bare oppgavetekst er påkrevd, med hjelpeteksten «Bare oppgaveteksten er påkrevd. Resten kan stå tomt.» **Lagre** lagrer straks (FR-2). KI-forslag kommer *etter* lagring, på detaljen. |
| Hendelsesfelt | Skjema (Hendelse) | Tittel, dato, start, slutt, Gjenta: Ingen / Hver uke / Annenhver uke, med sluttdato. |
| «🔒 Ikke send til KI» | Nederst i skjemaet | Oppgave: ingen data til KI, ingen forslag (FR-38). Hendelse: sendes bare som «opptatt» med tid. |
| KI-påminnelse | Under oppgavetekst i skjemaet når KI er på | «Teksten sendes til KI (Claude) for å lage forslag.» (FR-37) |
| Skrivefelt «+ Ny oppgave … skriv med egne ord» | Øverst i lista (PC) | Enter åpner skjemaet i panelet, med teksten ferdig utfylt. |
| Flytende knapp «+ Ny oppgave» | Oppgaver og Kalender (mobil) | Åpner skjemaet. Fra Kalender med valgt dag er frist eller dato ferdig utfylt. |
| Lupe / søkefelt | Topp (mobil), ved filtrene (PC) | Søker i tekst, notater, prosjekt og sammendrag. Hvert treff viser *Aktiv* eller *Fullført* og frist (FR-28). |
| Prosjektliste | Innstillinger → Prosjekter | Viser alle prosjektnavn som er brukt. Sletting fjerner navnet fra alle oppgaver, etter «Er du sikker?». Etikettene Skole/Jobb/Privat er faste og kan ikke slettes. |
| Tema-velger | Innstillinger → Utseende | Seks fargeprøver. Endringen vises umiddelbart. Lys/mørk/«Følg systemet». |

## State Patterns

| Tilstand | Flate | Behandling |
|---|---|---|
| Første oppstart | Førstegangsoppsett | (1) «Hva heter du?» med fornavn, som kan hoppes over. (2) KI-valg med «Ja» og «Nei» like synlige og ingen forhåndsvalgt (FR-35). Teksten nevner oppgavetekst, notater **og hendelser i kalenderen**. |
| Tom «I dag» | Oppgaver | «Alt unna i dag 🎉 Nyt kvelden!» Gruppen vises fortsatt. |
| Helt tom app | Oppgaver | «Hei, Ida 👋 Skriv inn det første du må huske – KI hjelper deg å sortere.» med pil mot «+ Ny oppgave». |
| KI henter forslag | Oppgavedetalj | Boksen viser «✦ Lager forslag …» med en rolig skeleton. Oppgaven er allerede lagret, og studenten kan gå videre. |
| KI utilgjengelig | Oppgavedetalj | Forslag fra reserveløsningen merket «regelbasert» og «KI var ikke tilgjengelig. Forslagene er basert på nøkkelord.» (FR-18). Ingen sammendrag og ingen økter. |
| KI av | Oppgavedetalj | Ingen forslagsboks. «+ Legg til økt» vises. |
| Ubesvarte forslag | Oppgavekort | Liten «✦»-prikk på kortet til forslagene er besvart (FR-12). |
| Forfalt | Oppgaver, Kalender | Gruppe **øverst** i lista, med stripe og tekst i varselfarge. I Kalender vises den på opprinnelig dato i varselfarge. |
| Kollisjon | Øktkort | Kollisjonsmerke og «Foreslå ny tid». |
| Ingen frist | Kalender | Sammenleggbar seksjon «Ingen frist (n)» under rutenettet. |
| Søk uten treff | Søk | «Fant ingenting på "statistikk". Sjekk stavingen eller prøv et annet ord.» |
| Arkiv | Arkiv | Info om at fullførte oppgaver ligger her i 7 dager. Hver oppgave viser «Slettes om n dager» (FR-31). Når det er én dag igjen, står det «Slettes i morgen» i varselfarge. Meny med *Gjenopprett* og *Slett nå*. |
| Tomt arkiv | Arkiv | «Ingen fullførte oppgaver ennå – hold på! 💪» |
| Sletting | Alle | Dialogen «Er du sikker?» kan ikke angres (FR-34). |
| Fokus | Alle | Synlig fokusring i `accent-ink`, 2 px. |
| Tom måned | Kalender | Rutenettet vises som vanlig, med teksten «Ingen planer denne måneden ennå» under. |
| Valgt dag uten noe | Kalender | «Fri dag 🙌» og knappen «+ Ny» med dagen ferdig utfylt. |
| Ingen prosjekter | Innstillinger → Prosjekter | «Prosjekter dukker opp her når du skriver dem på en oppgave.» |
| Import feiler | Personvern og data | «Fila kunne ikke leses. Ingen data er endret.» |
| Skjemafeil | Skjema | Tom oppgavetekst gir «Skriv inn hva du skal gjøre» ved feltet. Slutt før start gir «Slutt må være etter start». |

## Interaction Primitives

- **Trykk** åpner, og **trykk på ringen** huker av. Det finnes ingen skjulte sveipebevegelser i v1. Gruppa har ikke bedt om det.
- **Avhuking:** Ringen fylles med temafargen og haken spretter (ca. 300 ms). Deretter glir kortet ut av lista. Ved `prefers-reduced-motion` fylles ringen umiddelbart og kortet forsvinner uten glid.
- **Angre etter avhuking:** En kort melding nederst, «Flyttet til Arkiv · Angre», i ca. 5 sekunder.
- **Endring av frist** flytter oppgaven straks til riktig liste (FR-23).
- **PC:** Tastaturet virker fullt ut. Tab går i leserekkefølge. Enter åpner, Esc lukker panel og dialog, og «N» fokuserer skrivefeltet.
- **Bannlyst:** streaks og poeng som straffer, badge-tellere på faner, karuseller, automatisk omplanlegging uten at studenten godtar, og KI som setter frist på egen hånd (FR-5).

## Accessibility Floor

Her beskrives oppførselen. Kontrast er beskrevet i `DESIGN.md` under Colors.

- **WCAG 2.1 AA** på alle flater.
- Alle knapper og felt har tilgjengelige navn, for eksempel «Huk av: Lese kapittel 4–5» eller «Godta foreslått etikett: Skole».
- KI-forslag som kommer inn, annonseres med `aria-live="polite"` («3 KI-forslag klare»).
- Avhuking annonseres: «Flyttet til Arkiv».
- Trykkflater er minst 44 × 44 px på mobil. Avkrysningsringen er 20 px visuelt, men trykkflaten er 44 px.
- Kalenderen kan brukes med tastatur (piltaster mellom dager) og skjermleser («Onsdag 11. november, 2 oppgaver, 1 hendelse»). Prikker på mobil har alltid en tekstlig ekvivalent.
- Farge er aldri eneste signal. Forfalt har både stripe og gruppeoverskrift, Høy har tekst, og kollisjon har ⚠ og tekst.
- `prefers-reduced-motion` respekteres, og `prefers-color-scheme` brukes ved første oppstart.
- Skjemaet beholder innholdet ved feil, og feilmeldinger står ved feltet de gjelder.

## Inspiration & Anti-patterns

- **Tatt fra gruppas egen skisse:** grupper etter frist, KI-forslag per felt med Godta/Endre, og arkiv med nedtelling.
- **Tatt fra e-postklienter (oppsett A):** liste og detaljpanel side om side på PC, slik at man ser oversikt og detaljer samtidig.
- **Tatt fra Google Kalender:** månedsrutenett med titler i dagene på PC.
- **Forkastet – Todoist og Things:** De oppleves som kjedelige og for tette. dueNext viser bare det som trengs for å bestemme seg, og resten ligger ett trykk unna.
- **Forkastet – automatisk omplanlegging:** KI flytter aldri noe uten at studenten godtar det.

## Responsive & Platform

| Bredde | Oppsett |
|---|---|
| < 768 px (mobil) | Én kolonne, bunnmeny og flytende knapp. Detalj og skjema som egen side. Kalender med prikker og dagsliste under. |
| 768–1023 px | Sidemeny og liste. Detalj som egen side. Kalender med tekst. |
| ≥ 1024 px (PC) | Oppsett A: sidemeny, liste og detaljpanel. Skrivefelt øverst i lista. Kalender med titler i dagene, og valgt dag åpner dagslista i panelet til høyre. |

Samme komponenter og tokens brukes på alle bredder. Designet skal oppleves som ett produkt.

## KI-planlegging (økter)

Dette er en ny funksjon i forhold til PRD-en, i en enkel variant.

1. Når en oppgave **med frist** lagres og KI er på, kommer forslag til etikett, prioritet og sammendrag, og i tillegg **foreslåtte økter**.
2. KI får oppgavetekst, notater, frist og **hendelser med tid og tittel** i perioden fram til fristen. Unntaket er hendelser merket «🔒 Ikke send til KI», som bare sendes som «opptatt».
3. Øktene skal legges utenom hendelser. Det er en forventning til KI-en at den unngår økter rett etter for eksempel nattevakt. Hvordan dette styres i prompten, bestemmes i arkitekturen.
4. Studenten godtar eller endrer hver økt, eller trykker *Godta alle*. Først da vises øktene i lister og Kalender.
5. **Ingen automatisk omplanlegging.** Kolliderer en ny hendelse med en godtatt økt, får økta kollisjonsmerke og knappen «Foreslå ny tid».
6. **Uten KI** blir det ingen forslag, men studenten kan bruke «+ Legg til økt».

## Key Flows

### Flyt 1 – Ida planlegger uka (mobil, søndag kveld i senga)

Ida er 21 år og går 2. år på økonomi. Hun har nettopp fått en ny innlevering i Canvas med frist fredag.

1. Ida åpner dueNext. **Oppgaver** viser «Hei, Ida 👋» og gruppene Forfalt / I dag / Denne uken / Senere / Ingen frist.
2. Hun trykker på «+ Ny oppgave», velger **Hendelse** og legger inn «Håndballkamp», onsdag 18–20. Hun trykker Lagre.
3. Hun legger inn «Jobbvakt», torsdag 16–22, på samme måte.
4. Hun legger inn oppgaven «Innlevering i markedsføring» med frist fredag og trykker Lagre. Oppgaven er lagret med én gang.
5. I detaljen viser KI-boksen etikett **Skole**, prioritet **Høy**, et sammendrag og **tre foreslåtte økter**: mandag, tirsdag og fredag morgen, rundt kampen og vakten.
6. Hun trykker *Endre* på én økt og flytter den, fordi hun vet hun blir sliten etter jobb. Så trykker hun *Godta alle*.
7. Hun trykker på **Kalender**. Prikkene viser økter, kamp, vakt og frist fordelt utover uka. Hun trykker seg gjennom dagene.
8. **Klimaks:** Ida ser at uka går opp. Innleveringen blir ferdig selv med kamp og vakt. *«Yes, dette hjalp.»*

Avvik: Er KI utilgjengelig i steg 5, får hun regelbasert etikett og prioritet, og legger inn øktene selv med «+ Legg til økt».

### Flyt 2 – Sara får turnus og hjemmeeksamen til å gå opp (PC, torsdag kveld ved kjøkkenbordet)

Sara er 23 år og går 3. år på sykepleie. Hun har fått turnusplanen for praksis neste måned, og en hjemmeeksamen som åpner om ti dager.

1. Sara åpner dueNext i nettleseren og går til **Kalender** i sidemenyen.
2. Hun trykker på en dag, velger «+ Ny» og deretter **Hendelse**, og legger inn praksisvaktene. De faste vaktene får «Gjenta: Hver uke», og de uregelmessige legges inn én og én.
3. Hun legger inn oppgaven «Hjemmeeksamen» med frist og lagrer.
4. I detaljpanelet til høyre foreslår KI leseøkter på fridager og korte økter før kveldsvakter, men ingen rett etter nattevakt. Hun trykker *Godta alle*.
5. Hun ser at én økt ligger samtidig med en legetime hun har glemt. Hun legger inn «Legetime» som hendelse.
6. Økta får «⚠ Kolliderer med Legetime». Hun trykker **Foreslå ny tid**, og KI foreslår en ny tid som hun godtar.
7. **Klimaks:** Kalenderen viser at både turnus og hjemmeeksamen går opp, og at planen gir henne hvile etter vaktene.

Personvern: Titler som «Legetime» sendes til KI. Vil Sara unngå det, slår hun på «🔒 Ikke send til KI» på hendelsen, og da sendes den bare som «opptatt».

### Flyt 3 – Første oppstart

1. Første skjerm viser «Hei! Hva heter du?» med et felt for fornavn og *Fortsett* / *Hopp over*.
2. Deretter kommer KI-valget. Teksten forklarer hva som sendes (oppgavetekst, notater og hendelser), til hvem (Anthropic, USA), at det normalt slettes innen 30 dager og ikke brukes til trening, og ber studenten unngå sensitive opplysninger. *Ja* og *Nei* er like store, og ingen er forhåndsvalgt.
3. Studenten havner på **Oppgaver** med pastellblått tema og lys eller mørk modus etter systemet. Valget kan endres i Innstillinger → Personvern og data.

### Flyt 4 – Endre frist på en oppgave

1. Studenten trykker på oppgaven, og detaljen åpnes.
2. Hen trykker **Endre**, endrer fristen og trykker Lagre.
3. Oppgaven flytter seg straks til riktig liste. Ingen nye KI-forslag kommer. Det skjer bare hvis oppgaveteksten endres (FR-13).

## Avvik fra PRD

UX-arbeidet har gjort valg som PRD-en må oppdateres med (`bmad-prd`, oppdatering) før arkitekturen lages:

| # | Endring | Berørt i PRD |
|---|---|---|
| 1 | **Hendelser** som egen type med start, slutt og gjentakelse | Ny funksjon. Begreper, F1, F4 |
| 2 | **KI-foreslåtte økter** (enkel variant, ingen automatisk omplanlegging) og «Foreslå ny tid» ved kollisjon | F2, FR-5 presiseres (KI setter fortsatt aldri frist), suksesskriterier, KI-testsett |
| 3 | **Hendelser (tid og tittel) sendes til KI** | FR-15, FR-35, FR-37, FR-41, personvernerklæring |
| 4 | «🔒 Ikke send til KI» gjelder også hendelser | FR-38 |
| 5 | **Kalender**-visning i appen (ikke integrasjon) | Utenfor scope-lista, F4 |
| 6 | Smartlister: **Forfalt øverst** | FR-20 |
| 7 | «Fullførte» heter **Arkiv** og er egen fane | FR-29 |
| 8 | **Profil** med lokalt fornavn | F6, personvernerklæring |
| 9 | **Prosjekter** kan slettes i Innstillinger | F1 |
| 10 | **Utseende**: mørk/lys og 6 temaer | Ny |
| 11 | Personvern og data ligger i Innstillinger | F6 (FR-41 er fortsatt oppfylt) |

Gruppa ønsket opprinnelig telefonnummer og SMS-innlogging. Det er **forkastet for v1**, fordi det bryter med NFR-1 og ville gitt mer personvernansvar.

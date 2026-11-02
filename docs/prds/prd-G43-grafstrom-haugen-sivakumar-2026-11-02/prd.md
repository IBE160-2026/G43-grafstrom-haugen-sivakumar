---
title: PRD – dueNext
status: final
created: 2026-11-02
updated: 2026-11-02
---

# PRD – dueNext

Gruppe G43: grafstrom-haugen-olsen-sivakumar
Grunnlag: [product brief](../../product-brief.md), [tilbakemelding fra faglærer](../../../tilbakemelding-product-brief.md)

## Visjon

dueNext lar norske studenter skrive oppgaver med egne ord og få dem organisert automatisk. KI foreslår etikett, prioritet og sammendrag, regler sorterer oppgavene i smarte lister etter frist, og studenten bestemmer alltid selv.

## Målgruppe

Norske studenter som har oppgaver spredt på flere fag, gruppearbeid, deltidsjobb og hverdag, og som bruker tid på å finne ut hva de bør gjøre først. Studenten trenger ikke være teknisk erfaren, og skriver oppgaver med vanlig språk.

**Jobben som skal gjøres:** «Når jeg får en ny oppgave, vil jeg skrive den ned raskt og se hva som haster, uten å måtte sortere alt selv.»

## Begreper

| Begrep | Betydning |
|---|---|
| Aktiv oppgave | En oppgave som ikke er fullført. Vises i én smart liste. |
| Fullført oppgave | En oppgave som er ferdig eller ikke lenger skal gjøres. Vises under «Fullførte» i 7 dager og slettes deretter. |
| Smart liste | En av de fem listene (I dag, Denne uken, Senere, Ingen frist, Forfalt), beregnet av regler ut fra fristen. |
| Etikett | Fast kategori: Privat, Skole eller Jobb. |
| Prosjekt | Fritekst studenten velger selv, for eksempel «IBE160» eller «Høgskolen i Molde». |
| KI-forslag | Forslag til etikett, prioritet og sammendrag fra Claude. |
| Reserveløsning | Regelbaserte forslag til etikett og prioritet når KI ikke er tilgjengelig. |

## Funksjoner og krav

### F1 Oppgavehåndtering

Studenten oppretter, redigerer og fullfører oppgaver. Fullførte oppgaver og sletting står under F5.

**Oppgavefelt**

| Felt | Påkrevd | Standardverdi | Satt av |
|---|---|---|---|
| Tekst | Ja | – | Studenten |
| Frist | Nei | ingen | Alltid studenten, aldri KI |
| Prosjekt | Nei | tom | Studenten. Fritekst-etikett, ikke et eget objekt |
| Etikett | Nei | tom | KI foreslår, studenten kan overstyre. Fast verdi: Privat, Skole eller Jobb. Egne navn, som «Høgskolen i Molde», skrives i prosjektfeltet |
| Prioritet | Nei | Middels | KI foreslår (Lav, Middels, Høy), studenten kan overstyre |
| Sammendrag | Nei | tom | KI foreslår, studenten kan overstyre |
| Notater | Nei | tom | Studenten |

- **FR-1** Studenten kan opprette en oppgave ved å skrive inn tekst. Tekst er det eneste påkrevde feltet.
- **FR-2** Oppgaven lagres straks når studenten trykker «Lagre», også når KI-forslag ikke er klare eller ikke er tilgjengelige.
- **FR-3** Felt studenten lar stå tomme, forblir tomme til studenten fyller dem ut selv eller godtar et KI-forslag (F2).
- **FR-4** Prioritet er «Middels» når ingen annen verdi er valgt.
- **FR-5** Frist settes alltid av studenten, og en oppgave kan mangle frist. Oppgaver uten frist vises i lista «Ingen frist» (F4). Eksempel: «Vaske klær» eller «Innlevering i IBE160» lagret uten frist.
- **FR-6** Studenten kan når som helst redigere alle feltene på en lagret oppgave, og kan fjerne fristen helt.
- **FR-7** Studenten kan markere en oppgave som fullført. Den forsvinner da fra de smarte listene (F4) og vises under «Fullførte» (F5). Det gjelder også oppgaver som ikke ble gjort, for eksempel en prøve studenten var syk på.

### F2 KI-forslag

KI foreslår etikett, prioritet og sammendrag. Studenten bestemmer alltid selv. KI foreslår aldri frist (FR-5).

- **FR-8** Når en oppgave er lagret, henter appen forslag til etikett, prioritet og sammendrag. Dette skjer bare hvis studenten har sagt ja til KI (F6). Lagringen venter ikke på forslagene (FR-2).
- **FR-9** Forslagene vises på den lagrede oppgaven, ett per felt, med knappene «Godta» og «Endre».
- **FR-10** «Godta» setter den foreslåtte verdien i feltet. «Endre» lar studenten velge eller skrive en annen verdi.
- **FR-11** Forslagene er tydelig merket som KI-forslag.
- **FR-12** Svarer ikke studenten på forslagene, beholder oppgaven standardverdiene: tom etikett, prioritet «Middels» og tomt sammendrag. Forslagene vises igjen neste gang studenten åpner appen, til hun har svart på dem.
- **FR-13** Endrer studenten teksten på en lagret oppgave, kommer nye forslag på samme måte. De gamle verdiene beholdes til studenten godtar de nye.
- **FR-14** Svaret fra KI kontrolleres før det vises. Ugyldige verdier forkastes, og reserveløsningen brukes i stedet (F3).
- **FR-15** Bare oppgavetekst og notater sendes til KI.

### F3 Reserveløsning

Appen skal fungere uten KI, slik at sensor og andre kan kjøre den uten gruppens API-nøkkel.

- **FR-16** Hvis studenten har sagt ja til KI, men API-nøkkelen mangler, Claude ikke svarer eller svaret er ugyldig, foreslår en regelbasert reserveløsning etikett og prioritet ut fra nøkkelord i oppgaveteksten.
- **FR-17** Reserveløsningen foreslår ikke sammendrag. Sammendraget står tomt til studenten skriver det selv.
- **FR-18** Forslag fra reserveløsningen vises på samme måte som KI-forslag (FR-9, FR-10), men er merket «Forslag basert på nøkkelord – KI var ikke tilgjengelig».
- **FR-19** Har studenten sagt nei til KI (F6), får hun ingen forslag og fyller ut feltene selv.

### F4 Smarte lister, filter, sortering og søk

Listene beregnes av regler, ikke av KI.

| Liste | Frist |
|---|---|
| I dag | i dag |
| Denne uken | i morgen til og med søndag |
| Senere | etter denne uken |
| Ingen frist | ingen frist |
| Forfalt | før i dag |

- **FR-20** Appen har fem smarte lister, vist i rekkefølgen i tabellen over, med «Forfalt» nederst.
- **FR-21** Hver aktive oppgave ligger i nøyaktig én liste, bestemt av fristen. Fullførte oppgaver vises ikke i smarte lister.
- **FR-22** Uka regnes fra mandag til søndag. Er det søndag i dag, er «Denne uken» tom.
- **FR-23** Endrer studenten fristen, flyttes oppgaven straks til riktig liste.
- **FR-24** Standard rekkefølge i en liste er: nærmeste frist først, deretter prioritet (Høy først), deretter opprettelsestidspunkt (eldste først). I «Ingen frist» sorteres oppgavene etter prioritet og deretter opprettelsestidspunkt.
- **FR-25** Studenten kan velge en annen sortering. Standard rekkefølge gjelder igjen neste gang lista åpnes.
- **FR-26** Studenten kan filtrere på etikett, prioritet, frist og prosjekt.
- **FR-27** Studenten kan søke i alle feltene på en oppgave: tekst, notater, prosjekt og sammendrag.
- **FR-28** Søket gir treff både i aktive og fullførte oppgaver, og hvert treff viser om oppgaven er aktiv eller fullført, og hvilken frist den har. Eksempel: Studenten er usikker på når statistikkprøven er, og om hun allerede har fullført den. Hun søker på «statistikk» og ser oppgaven med frist og status.

### F5 Fullførte oppgaver og sletting

Fullført betyr at oppgaven er ferdig eller ikke lenger skal gjøres, for eksempel en prøve studenten var syk på. Ved kontinuasjon eller ny frist legger studenten inn en ny oppgave.

- **FR-29** Studenten åpner «Fullførte» fra «…»-menyen.
- **FR-30** En fullført oppgave slettes automatisk 7 dager etter at den ble fullført. Blir oppgaven gjenåpnet og fullført på nytt, regnes de 7 dagene fra siste fullføring.
- **FR-31** Hver oppgave i «Fullførte» viser hvor mange dager det er igjen før den slettes, for eksempel «Slettes om 3 dager».
- **FR-32** Studenten kan angre fullføringen så lenge oppgaven ligger i «Fullførte». Oppgaven blir da aktiv igjen og havner i den smarte lista som passer fristen.
- **FR-33** Studenten kan slette en oppgave både fra de smarte listene og fra «Fullførte».
- **FR-34** Før en oppgave slettes, må studenten bekrefte i en «Er du sikker?»-dialog. En slettet oppgave kan ikke gjenopprettes.

### F6 Personvern og egne data

Oppgavene lagres bare i studentens nettleser. Teksten sendes via serveren til Claude (Anthropic, USA) bare når studenten har sagt ja til KI. Gruppen er da behandlingsansvarlig, og Anthropic er databehandler. Grunnlag: [research-gdpr-regelverk.md](research-gdpr-regelverk.md) og [research-gdpr-forskning.md](research-gdpr-forskning.md). Dette er ikke juridisk rådgivning.

Prioritet: **Må** er med i v1. **Bør** tas med hvis det er tid.

- **FR-35 (Må)** Ved første oppstart spør appen om studenten vil bruke KI. KI er av til hun har sagt ja. Dialogen forteller hva som sendes (oppgavetekst og notater), til hvem (Anthropic i USA), at Anthropic normalt sletter det innen 30 dager, og at det ikke brukes til å trene modeller. Forslag til tekst: «Oppgaveteksten og notatene dine sendes til KI-tjenesten Claude fra selskapet Anthropic (USA) for å lage svaret. Anthropic bruker ikke dataene til å trene KI-modeller, og sletter dem normalt innen 30 dager.» Den ber henne også unngå å skrive sensitive opplysninger, for eksempel om helse. «Nei» er like lett å velge som «Ja», og ingen av dem er forhåndsvalgt.
- **FR-36 (Må)** Studenten kan endre KI-valget når som helst i innstillingene. Slår hun av KI, gjelder FR-19.
- **FR-37 (Må)** Når KI er på, viser skrivefeltet en kort påminnelse om at teksten sendes til KI.
- **FR-38 (Må)** Studenten kan markere en oppgave som privat. Da sendes verken tekst eller notater til KI, og hun får ingen forslag på den oppgaven.
- **FR-39 (Må)** Studenten kan velge at notater aldri sendes til KI.
- **FR-40 (Må)** «Slett alle data» i innstillingene sletter alle oppgaver og innstillinger fra nettleseren, etter en «Er du sikker?»-bekreftelse.
- **FR-41 (Må)** En personvernerklæring på norsk ligger ett klikk unna fra alle skjermbilder. Den dekker kravene i GDPR art. 13, og sier ærlig at tekst som allerede er sendt til Anthropic, ikke kan slettes fra appen. Den forteller også at:
  - Anthropic normalt sletter dataene innen 30 dager, men kan lagre samtaler som flagges for brudd på bruksreglene i inntil 2 år, og lenger hvis loven krever det ([research-anthropic-lagringstid.md](research-anthropic-lagringstid.md))
  - avtaleparten er Anthropic Ireland Ltd., men dataene behandles i USA, og overføringen er sikret med EUs standardavtaler (SCC), fordi Anthropic ikke er med i EU-US Data Privacy Framework ([research-anthropic-dpf.md](research-anthropic-dpf.md))
- **FR-42 (Bør)** Navn og telefonnummer i oppgavetekst og notater erstattes med plassholdere før teksten sendes til KI. Dette er pseudonymisering, ikke anonymisering. Navn er vanskelig å finne sikkert, så metoden bestemmes i arkitekturen.
- **FR-43 (Bør)** Studenten kan eksportere alle oppgaver og innstillinger til en fil, og importere dem igjen.

## Ikke-funksjonelle krav

- **NFR-1 Kjørbar for sensor.** Appen kan startes lokalt etter README uten gruppens API-nøkkel, betalte kontoer eller eksterne tjenester. Uten nøkkel brukes reserveløsningen (F3).
- **NFR-2 Nøkkelen er hemmelig.** Kallet til Claude gjøres fra serveren, aldri fra nettleseren. API-nøkkelen ligger bare i `.env.local`, som ikke er i Git. `.env.example` viser hvilke variabler som trengs.
- **NFR-3 Ingen sporing.** Appen har ingen analyseverktøy eller tredjepartsskript. Serveren logger ikke innholdet i oppgavene.
- **NFR-4 Lokal lagring.** Oppgaver og innstillinger lagres bare i studentens nettleser og er der neste gang hun åpner appen på samme maskin. Gruppen lagrer ingen brukerdata.
- **NFR-5 Rask lagring.** Lagring av en oppgave venter aldri på KI (FR-2).
- **NFR-6 Testbar uten KI.** Automatiske tester bruker faste mock-svar i stedet for ekte kall til Claude.
- **NFR-7 Testbar tid.** Regler som avhenger av dato (smarte lister, sletting etter 7 dager) kan testes med en fast «i dag»-dato.
- **NFR-8 Norsk.** All tekst i appen, KI-forslagene og personvernerklæringen er på norsk.

## Suksesskriterier

| Mål | Kriterium |
|---|---|
| KI-etikett | Minst 16 av 20 riktige etiketter i [KI-testsettet](../../../tests/ki-testsett/testsett.json) |
| KI-prioritet | Minst 14 av 20 riktige prioriteringer i KI-testsettet |
| Smarte lister | 20 av 20 riktige lister i KI-testsettet |
| Brukervennlighet | Minst 4 av 5 testbrukere oppretter en oppgave og endrer et KI-forslag uten veiledning |
| Reserveløsning | Alle funksjoner unntatt KI-forslag virker uten API-nøkkel |

**Motmål:** Et høyt treff i testsettet må ikke oppnås ved å sende mer data enn nødvendig til KI (FR-15, FR-38, FR-39), og testbrukerne skal forstå samtykkedialogen (FR-35) uten å trykke «Ja» bare for å komme videre.

## Utenfor scope

- Sekundærmålgruppen (enkeltpersoner og små team). Kan bli en utvidelse senere.
- Innlogging, brukerkontoer og synkronisering mellom enheter
- Egne etiketter. Egne navn skrives i prosjektfeltet.
- KI-forslag til frist
- Automatisk henting fra Canvas, Teams eller andre systemer
- Deling og samarbeid mellom brukere
- Mobilapp, varsler og påminnelser, kalenderintegrasjon

## Åpne spørsmål

| # | Spørsmål | Avgjøres i |
|---|---|---|
| Å-1 | ~~Hvilken Claude-modell skal brukes?~~ Avgjort: Claude Sonnet. Eksakt versjon og modell-ID settes i arkitekturen. | Arkitektur |
| Å-2 | ~~Hvor lenge lagrer Anthropic API-data, og er Anthropic sertifisert under EU-US Data Privacy Framework?~~ Avklart 2026-11-02: inntil 30 dager, ikke DPF-sertifisert, overføring med SCC. Står i FR-35 og FR-41. | – |
| Å-3 | Hvem i gruppen er formelt behandlingsansvarlig i personvernerklæringen? | Gruppen kommer tilbake til dette |
| Å-4 | Hvordan skal navn finnes til maskeringen (FR-42)? | Arkitektur |
| Å-5 | Lagring i nettleseren: localStorage eller IndexedDB? | Arkitektur |
| Å-6 | Skal gruppen skrive en kort overføringsvurdering (TIA), siden overføringen til USA bygger på SCC? | Gruppen |
| Å-7 | Hvilke nøkkelord bruker reserveløsningen (FR-16)? | Arkitektur eller story, testes mot KI-testsettet |

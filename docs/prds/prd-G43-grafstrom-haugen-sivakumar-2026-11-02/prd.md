---
title: PRD – dueNext
status: final
created: 2026-11-02
updated: 2026-11-11
---

# PRD – dueNext

Gruppe G43: grafstrom-haugen-olsen-sivakumar
Grunnlag: [product brief](../../product-brief.md), [tilbakemelding fra faglærer](../../../tilbakemelding-product-brief.md)
UX: [DESIGN.md](../../ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/DESIGN.md) (utseende) og [EXPERIENCE.md](../../ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/EXPERIENCE.md) (oppførsel og fastsatte tekster). Oppdatert 2026-11-11 med [avvikene fra UX-arbeidet](../../ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/prd-avvik.md).

## Visjon

dueNext lar norske studenter skrive oppgaver med egne ord og få dem organisert automatisk. KI foreslår etikett, prioritet og sammendrag, og når studenten kan jobbe med oppgaven, rundt hendelsene i kalenderen hennes. Regler sorterer oppgavene i smarte lister etter frist, og studenten bestemmer alltid selv.

## Målgruppe

Norske studenter som har oppgaver spredt på flere fag, gruppearbeid, deltidsjobb og hverdag, og som bruker tid på å finne ut hva de bør gjøre først. Studenten trenger ikke være teknisk erfaren, og skriver oppgaver med vanlig språk.

**Jobben som skal gjøres:** «Når jeg får en ny oppgave, vil jeg skrive den ned raskt og se hva som haster, uten å måtte sortere alt selv.»

## Begreper

| Begrep | Betydning |
|---|---|
| Aktiv oppgave | En oppgave som ikke er fullført. Vises i én smart liste. |
| Fullført oppgave | En oppgave som er ferdig eller ikke lenger skal gjøres. Ligger i **Arkiv** i 7 dager og slettes deretter. |
| Hendelse | Noe med fast tidspunkt, for eksempel en jobbvakt eller en håndballkamp. Har tittel, dato, start og slutt, og kan gjentas. Kan ikke fullføres. |
| Økt | Et tidsrom der studenten jobber med en oppgave, for eksempel «Økt 1/3 – Innlevering i markedsføring». Har dato, starttid og sluttid, og hører alltid til én oppgave. Foreslås av KI eller legges inn manuelt. Et ubesvart forslag er en *foreslått økt*. Når studenten har godtatt den, er den en *godtatt økt*. |
| Smart liste | En av de fem listene (Forfalt, I dag, Denne uken, Senere, Ingen frist), beregnet av regler ut fra fristen til oppgaver og datoen til økter. «I dag» viser også dagens hendelser. |
| Kalender | Månedsvisning i appen med oppgaver, økter og hendelser. Ikke en kobling til andre kalendere. |
| Etikett | Fast kategori: Privat, Skole eller Jobb. |
| Prosjekt | Fritekst studenten velger selv, for eksempel «IBE160» eller «Høgskolen i Molde». |
| KI-forslag | Forslag fra Claude til etikett, prioritet, sammendrag og økter. |
| Reserveløsning | Regelbaserte forslag til etikett og prioritet når KI ikke er tilgjengelig. |
| 🔒 | Personvernbryter. På en oppgave: «🔒 Ikke send til KI». På en hendelse: «🔒 Skjul tittel for KI». |

## Funksjoner og krav

Prioritet: Krav uten merke er **Må** og er med i v1. Krav merket **(Bør)** tas med hvis det er tid.

### F1 Oppgaver og hendelser

Studenten oppretter, redigerer og fullfører oppgaver, og legger inn hendelser. Arkiv og sletting står under F5. Når studenten lager noe nytt, velger hun Oppgave eller Hendelse øverst i skjemaet.

**Oppgavefelt**

| Felt | Påkrevd | Standardverdi | Satt av |
|---|---|---|---|
| Tekst | Ja | – | Studenten |
| Frist | Nei | ingen | Alltid studenten, aldri KI |
| Prosjekt | Nei | tom | Studenten. Fritekst-etikett, ikke et eget objekt (se FR-61) |
| Etikett | Nei | tom | KI foreslår, studenten kan overstyre. Fast verdi: Privat, Skole eller Jobb. Egne navn, som «Høgskolen i Molde», skrives i prosjektfeltet |
| Prioritet | Nei | Middels | KI foreslår (Lav, Middels, Høy), studenten kan overstyre |
| Sammendrag | Nei | tom | KI foreslår, studenten kan overstyre |
| Notater | Nei | tom | Studenten |
| 🔒 Ikke send til KI | Nei | av | Studenten (FR-38) |

**Oppgaver**

- **FR-1** Studenten kan opprette en oppgave ved å skrive inn tekst. Tekst er det eneste påkrevde feltet.
- **FR-2** Oppgaven lagres straks når studenten trykker «Lagre», også når KI-forslag ikke er klare eller ikke er tilgjengelige.
- **FR-3** Felt studenten lar stå tomme, forblir tomme til studenten fyller dem ut selv eller godtar et KI-forslag (F2).
- **FR-4** Prioritet er «Middels» når ingen annen verdi er valgt.
- **FR-5** Frist settes alltid av studenten, og en oppgave kan mangle frist. KI setter aldri frist, heller ikke når den foreslår økter. Oppgaver uten frist vises i lista «Ingen frist» (F4). Eksempel: «Vaske klær» eller «Innlevering i IBE160» lagret uten frist.
- **FR-6** Studenten kan når som helst redigere alle feltene på en lagret oppgave, og kan fjerne fristen helt.
- **FR-7** Studenten kan markere en oppgave som fullført. Den forsvinner da fra de smarte listene (F4) og flyttes til Arkiv (F5). Det gjelder også oppgaver som ikke ble gjort, for eksempel en prøve studenten var syk på.

**Hendelser**

- **FR-44** Studenten kan opprette en hendelse med tittel, dato, starttid og sluttid. Alle fire er påkrevd.
- **FR-45** Er sluttiden før starttiden, slutter hendelsen neste dag. Den vises da som for eksempel «21:00 – 07:30 (+1 dag)». Lik start og slutt er ugyldig.
- **FR-46 (Bør)** En hendelse kan gjentas: Ingen, Hver uke eller Annenhver uke, med sluttdato for gjentakelsen. Uregelmessige tider, for eksempel en turnus, legges inn én og én. Uten FR-46 legges alle hendelser inn én og én.
- **FR-47 (Bør, sammen med FR-46)** Endrer eller sletter studenten én forekomst av en gjentakende hendelse, spør appen «Bare denne / Denne og alle senere». Sletting av en hendelse må bekreftes.
- **FR-48** Hendelser kan ikke fullføres og havner aldri i Arkiv. Dagens hendelser vises øverst i «I dag», sortert etter starttid, og forsvinner derfra når de er over. De teller ikke med i antallet i gruppeoverskriften. Hendelser på andre dager vises bare i Kalender (FR-55).

### F2 KI-forslag og økter

KI foreslår etikett, prioritet og sammendrag, og for oppgaver med frist også økter. Studenten bestemmer alltid selv. KI foreslår aldri frist (FR-5), og flytter aldri noe på egen hånd.

**Forslag til felt**

- **FR-8** Når en oppgave er lagret, henter appen forslag til etikett, prioritet og sammendrag. Har oppgaven frist, hentes også forslag til økter (FR-49). Dette skjer bare hvis studenten har sagt ja til KI (F6) og oppgaven ikke er merket 🔒 (FR-38). Lagringen venter ikke på forslagene (FR-2).
- **FR-9** Forslagene vises på den lagrede oppgaven, ett per felt og én rad per økt, med knappene «Godta» og «Endre». «Godta alle» godtar alle forslagene på oppgaven.
- **FR-10** «Godta» setter den foreslåtte verdien i feltet. «Endre» lar studenten velge eller skrive en annen verdi.
- **FR-11** Forslagene er tydelig merket som KI-forslag.
- **FR-12** Svarer ikke studenten på forslagene, beholder oppgaven standardverdiene: tom etikett, prioritet «Middels», tomt sammendrag og ingen økter. Forslagene vises igjen neste gang studenten åpner appen, til hun har svart på dem. Unntak: Foreslåtte økter med en tid som har passert, forkastes uten melding. Er alle øktforslagene forkastet, vises bare «+ Legg til økt».
- **FR-13** Endrer studenten teksten på en lagret oppgave, kommer nye forslag til etikett, prioritet og sammendrag på samme måte. De gamle verdiene beholdes til studenten godtar de nye. Er det allerede godtatte økter, kommer det ikke nye øktforslag.
- **FR-62** Endres bare fristen, kommer det ingen nye forslag til etikett, prioritet og sammendrag. Får en oppgave uten godtatte økter frist, første gang eller ny frist, kommer det øktforslag (FR-49). Har oppgaven godtatte økter, gjelder FR-52.
- **FR-14** Svaret fra KI kontrolleres før det vises. Ugyldige verdier forkastes, og reserveløsningen brukes i stedet (F3). Et øktforslag som bryter grensene i FR-49, forkastes for seg. De andre forslagene vises som vanlig.
- **FR-15** KI får bare det den trenger:
  - oppgavetekst, notater (ikke når FR-39 er på) og frist
  - hendelser i en begrenset periode fram til fristen: dato og klokkeslett, og tittelen når FR-58 er på og hendelsen ikke er merket «🔒 Skjul tittel for KI»
  - andre godtatte økter i samme periode, bare som «opptatt» med tidspunkt og uten oppgavetekst
  - aldri fornavnet (FR-59), og ingenting fra oppgaver merket «🔒 Ikke send til KI»

  Hendelser og økter sendes bare ved øktforslag og «Foreslå ny tid». Hvor lang perioden er, avgjøres i arkitekturen (Å-8).

**Økter**

- **FR-49** KI foreslår økter for en oppgave med frist. Hvert forslag har dato, starttid og sluttid. Forslagene må holde disse grensene:
  - 1–5 økter per oppgave
  - hver økt varer fra 30 minutter til 3 timer, og ligger mellom kl. 07:00 og 23:00
  - ingen økt i fortiden eller etter fristdagen
  - ingen overlapp med hendelser eller andre godtatte økter
  - ingen økt de første 8 timene etter en hendelse som slutter neste dag (for eksempel en nattevakt). Regelen bruker bare klokkeslett, så den virker også når titlene ikke sendes (FR-58).

  Økter studenten legger inn selv (FR-51), har ikke disse grensene.
- **FR-50** Foreslåtte økter vises ikke i lister og Kalender før studenten har godtatt dem. Når studenten godtar et forslag, sjekkes det på nytt mot hendelser og godtatte økter. Kolliderer det, godtas det likevel, men med merket i FR-52.
- **FR-51** Studenten kan alltid legge til økter selv med «+ Legg til økt» på oppgaven. Uten KI er dette eneste måte å få økter på.
- **FR-52** Appen endrer aldri en godtatt økt automatisk. Kolliderer en hendelse med økta, får den merket «⚠ Kolliderer med <tittel>». Får oppgaven en tidligere frist, får økter etter fristen merket «⚠ Etter fristen». Begge merkene har knappen «Endre tid».
- **FR-53 (Bør)** «Foreslå ny tid» er et eget KI-kall på en økt med merke (FR-52). KI foreslår én ny tid innenfor grensene i FR-49, og studenten godtar eller endrer den. Svarer ikke KI, vises «KI svarte ikke. Flytt økta selv med Endre tid.» Uten FR-53 flytter studenten økter med «Endre tid».
- **FR-54** Øktforslag og knappen «Foreslå ny tid» vises bare når KI er på og oppgaven ikke er merket 🔒. Ellers vises bare «Endre tid» og «+ Legg til økt». Svarer ikke KI, kommer det ingen øktforslag (FR-17), og «Foreslå ny tid» gir meldingen i FR-53.

### F3 Reserveløsning

Appen skal fungere uten KI, slik at sensor og andre kan kjøre den uten gruppens API-nøkkel.

- **FR-16** Hvis studenten har sagt ja til KI, men API-nøkkelen mangler, Claude ikke svarer eller svaret er ugyldig, foreslår en regelbasert reserveløsning etikett og prioritet ut fra nøkkelord i oppgaveteksten.
- **FR-17** Reserveløsningen foreslår ikke sammendrag eller økter. Sammendraget står tomt til studenten skriver det selv, og økter legges inn med «+ Legg til økt» (FR-51).
- **FR-18** Forslag fra reserveløsningen vises på samme måte som KI-forslag (FR-9, FR-10). Forslagene har linjen «Forslag basert på nøkkelord – KI var ikke tilgjengelig», ordrett, og hver forslagsrad er i tillegg merket «regelbasert».
- **FR-19** Har studenten sagt nei til KI (F6), får hun ingen forslag, ingen øktforslag og ingen «Foreslå ny tid». Hun fyller ut feltene og legger inn økter selv.

### F4 Smarte lister, kalender, filter, sortering og søk

Listene beregnes av regler, ikke av KI.

| Liste | Frist |
|---|---|
| Forfalt | før i dag |
| I dag | i dag |
| Denne uken | i morgen til og med søndag |
| Senere | etter denne uken |
| Ingen frist | ingen frist |

- **FR-20** Appen har fem smarte lister, vist i rekkefølgen i tabellen over, med «Forfalt» øverst.
- **FR-21** Hver aktive oppgave ligger i nøyaktig én liste, bestemt av fristen. En godtatt økt vises i lista for øktas dato som «Økt n/N – <oppgave>», og teller med i antallet i gruppeoverskriften. En økt som ikke er huket av, er passert når dagen den gjelder, er over. Da ligger den i «Forfalt» til den hukes av, flyttes eller slettes. Fullførte oppgaver og deres økter vises ikke i smarte lister. Antallet i gruppeoverskriften teller oppgaver og økter, ikke hendelser (FR-48).
- **FR-22** Uka regnes fra mandag til søndag. Er det søndag i dag, er «Denne uken» tom.
- **FR-23** Endrer studenten fristen, flyttes oppgaven straks til riktig liste.
- **FR-24** Standard rekkefølge i en liste er: nærmeste frist først, deretter prioritet (Høy først), deretter opprettelsestidspunkt (eldste først). I «Ingen frist» sorteres oppgavene etter prioritet og deretter opprettelsestidspunkt. Økter sorteres sammen med oppgavene etter dato. På samme dato står øktene først, etter starttid. Dagens hendelser står alltid øverst i «I dag» (FR-48).
- **FR-25** Studenten kan sortere på Frist (standard, FR-24), Prioritet eller Nyeste. Ved Prioritet og Nyeste sorteres en økt etter prioriteten og opprettelsestidspunktet til oppgaven sin. Standard rekkefølge gjelder igjen neste gang lista åpnes.
- **FR-26** Studenten kan filtrere på etikett, prioritet, frist og prosjekt. Etikett velges med filterknapper (Alle / Skole / Jobb / Privat). Prioritet, frist og prosjekt velges i et filterark, og aktive filtre vises som knapper som kan fjernes. Filteret gjelder også Kalender. Økter filtreres etter etiketten, prioriteten, fristen og prosjektet til oppgaven sin. Hendelser vises alltid, uansett filter, fordi de viser når studenten er opptatt.
- **FR-27** Studenten kan søke i alle feltene på en oppgave: tekst, notater, prosjekt og sammendrag.
- **FR-28** Søket gir treff både i aktive og fullførte oppgaver, og hvert treff viser om oppgaven er aktiv eller fullført, og hvilken frist den har. Eksempel: Studenten er usikker på når statistikkprøven er, og om hun allerede har fullført den. Hun søker på «statistikk» og ser oppgaven med frist og status.
- **FR-55** Appen har en egen Kalender-fane med månedsvisning av oppgaver (på fristen), godtatte økter og hendelser. Studenten kan bla mellom måneder og velge en dag for å se dagslista og legge inn noe nytt med dagen ferdig utfylt. Forfalte oppgaver vises på opprinnelig dato i varselfarge, og oppgaver uten frist ligger i en egen seksjon under månedsvisningen. Kalenderen kobles ikke til andre kalendere.

### F5 Arkiv og sletting

Fullført betyr at oppgaven er ferdig eller ikke lenger skal gjøres, for eksempel en prøve studenten var syk på. Ved kontinuasjon eller ny frist legger studenten inn en ny oppgave.

- **FR-29** Fullførte oppgaver ligger i **Arkiv**, som er en egen fane ved siden av Oppgaver og Kalender.
- **FR-30** En fullført oppgave slettes automatisk 7 dager etter at den ble fullført. Blir oppgaven gjenåpnet og fullført på nytt, regnes de 7 dagene fra siste fullføring. Øktene til oppgaven slettes samtidig.
- **FR-31** Hver oppgave i Arkiv viser hvor mange dager det er igjen før den slettes, for eksempel «Slettes om 3 dager».
- **FR-32** Studenten kan angre fullføringen, rett etter avhuking og senere så lenge oppgaven ligger i Arkiv. Oppgaven blir da aktiv igjen og havner i den smarte lista som passer fristen. Øktene kommer tilbake, og passerte økter som ikke er huket av, havner i «Forfalt».
- **FR-33** Studenten kan slette en oppgave både fra de smarte listene og fra Arkiv.
- **FR-34** Før en oppgave slettes, må studenten bekrefte i en «Er du sikker?»-dialog. Øktene slettes sammen med oppgaven, og dialogen sier hvor mange økter som slettes. En slettet oppgave kan ikke gjenopprettes.
- **FR-56** Studenten kan huke av en økt for seg. Oppgaven er fullført først når selve oppgaven hukes av.
- **FR-57** Fullfører studenten en oppgave som har uferdige økter, spør appen «Du har n økter igjen. Fullføre likevel?». Ved ja følger øktene oppgaven til Arkiv.

### F6 Personvern og egne data

Alle data lagres bare i studentens nettleser. Oppgaver og hendelser sendes via serveren til Claude (Anthropic, USA) bare når studenten har sagt ja til KI, og bare det FR-15 tillater. Gruppen er da behandlingsansvarlig, og Anthropic er databehandler. Hvem i gruppen som står som behandlingsansvarlig, er ikke avgjort (Å-3). Grunnlag: [research-gdpr-regelverk.md](research-gdpr-regelverk.md) og [research-gdpr-forskning.md](research-gdpr-forskning.md). Dette er ikke juridisk rådgivning.

Alle tekster i denne delen er fastsatt i [EXPERIENCE.md → Personvern og data – fastsatte tekster](../../ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/EXPERIENCE.md#personvern-og-data--fastsatte-tekster) og skal brukes ordrett. Personvern og data ligger i Innstillinger, og på PC også i sidemenyen.

- **FR-35 (Må)** Ved første oppstart spør appen først om fornavn (FR-59), og deretter om studenten vil bruke KI. KI er av til hun har sagt ja. Samtykketeksten sier:
  - hva som sendes (FR-15), og at fornavnet aldri sendes
  - hvem som får det: Anthropic, med Anthropic Ireland som avtalepart, behandling i USA og overføring sikret med EUs standardavtaler (SCC)
  - hvor lenge: ingen trening av KI-modeller, normalt slettet innen 30 dager, inntil 2 år hvis en forespørsel flagges for brudd på bruksreglene, og at det som er sendt, ikke kan slettes fra appen
  - at hun helst ikke skal skrive helseopplysninger eller navn på andre, heller ikke i hendelser, og at et «Ja» også er et uttrykkelig samtykke til at slike opplysninger sendes hvis hun likevel skriver dem
  - hvordan 🔒 virker, at hendelsestitler sendes som standard, og at det kan slås av
  - at appen virker fullt ut uten KI, at samtykket er frivillig og kan trekkes tilbake når som helst, og en lenke til personvernerklæringen

  «Nei» er like lett å velge som «Ja», og ingen av dem er forhåndsvalgt. Samtykket lagres i nettleseren med dato og versjon av teksten. En ny versjon av teksten krever nytt samtykke.
- **FR-36 (Må)** Studenten kan endre KI-valget når som helst i Personvern og data, der samtykkestatusen også vises (for eksempel «Godkjent 9.11.2026 (tekst v2)»). Slår hun på KI etter et «Nei», vises samtykketeksten først. Slår hun av KI, gjelder FR-19.
- **FR-37 (Må)** Når KI er på, viser skjemaet en kort påminnelse om hva som sendes til KI: under oppgaveteksten, under skrivefeltet på PC og under tittelen på en hendelse. Teksten tilpasses innstillingene (FR-39, FR-58) og 🔒.
- **FR-38 (Må)** Studenten kan slå på «🔒 Ikke send til KI» på en oppgave. Da sendes ingenting fra oppgaven til KI, og hun får ingen forslag, ingen øktforslag og ingen «Foreslå ny tid» på den. Godtatte økter på oppgaven kan likevel sendes som «opptatt» når andre oppgaver planlegges (FR-15). På en hendelse heter bryteren «🔒 Skjul tittel for KI». Da sendes bare tidspunktet, som «opptatt». 🔒 vises med et låsikon på oppgaven eller hendelsen.
- **FR-39 (Må)** Studenten kan velge at notater aldri sendes til KI.
- **FR-58 (Må)** Studenten kan velge om hendelsestitler sendes til KI. Standard er på. Er det av, får KI bare vite når hun er opptatt. Standard er på fordi titlene gir bedre økter: KI ser forskjell på en forelesning og en jobbvakt. Det koster at titler som «Legetime» kan være helseopplysninger. Derfor sier samtykketeksten (FR-35) at titlene sendes som standard, og studenten kan skjule én tittel med 🔒 (FR-38) eller alle med denne bryteren. Svarer faglærer i Å-6 at en DPIA trengs, vurderes standarden på nytt.
- **FR-40 (Må)** «Slett alle data» i Personvern og data sletter alt fra nettleseren etter en bekreftelse: oppgaver, hendelser, økter, fornavn, prosjekter, innstillinger, tema og samtykke. Appen starter deretter på førstegangsoppsettet.
- **FR-41 (Må)** En personvernerklæring på norsk ligger ett klikk unna fra alle skjermbilder. Lenken står nederst på hver side på mobil og nederst i sidemenyen på PC. Erklæringen dekker kravene i GDPR art. 13, og sier ærlig at tekst som allerede er sendt til Anthropic, ikke kan slettes fra appen. Den forteller også:
  - at Anthropic normalt sletter dataene innen 30 dager, men kan lagre samtaler som flagges for brudd på bruksreglene i inntil 2 år, og lenger hvis loven krever det ([research-anthropic-lagringstid.md](research-anthropic-lagringstid.md))
  - at avtaleparten er Anthropic Ireland Ltd., men at dataene behandles i USA, og at overføringen er sikret med EUs standardavtaler (SCC), fordi Anthropic ikke er med i EU-US Data Privacy Framework ([research-anthropic-dpf.md](research-anthropic-dpf.md))
  - hvilke data som sendes (FR-15)
  - at formålet også er planlegging av økter
  - at det ikke tas automatiske avgjørelser, fordi studenten godtar alt selv
  - at reserveløsningen ikke sender noe
  - at aldersgrensen er 13 år
  - at fornavn, tema og samtykkevalg lagres bare i nettleseren

  Behandlingsansvarlig står som plassholder til Å-3 er avklart.
- **FR-42 (Bør)** Telefonnumre og e-postadresser i oppgavetekst, notater og hendelsestitler erstattes med plassholdere før teksten sendes til KI. Dette er pseudonymisering, ikke anonymisering. Navn maskeres ikke, fordi de er vanskelige å finne sikkert. Til FR-42 er bygget, sier appen «Skriv ikke navn, telefonnummer eller helseopplysninger – appen fjerner dem ikke automatisk.» Når den er bygget, byttes teksten ut (se EXPERIENCE.md).
- **FR-43 (Bør)** Studenten kan eksportere alle data til en fil, også hendelser, økter og fornavn, og importere dem igjen. Før fila lagres, advarer appen om at den inneholder alt hun har skrevet. Import erstatter alle data i appen etter en bekreftelse. Samtykket følger ikke med, så KI-valget må besvares på nytt etter import. Importerte oppgaver sender ingenting til KI før teksten endres.

### F7 Profil, utseende og prosjekter

- **FR-59** Studenten kan legge inn fornavnet sitt i førstegangsoppsettet eller i Innstillinger → Profil. Fornavnet brukes bare i hilsenen («Hei, Ida 👋»), lagres bare i nettleseren og sendes aldri til KI eller serveren. Uten fornavn er hilsenen «Hei 👋».
- **FR-60** Studenten kan velge Lys, Mørk eller Følg systemet (standard). Endringen vises med én gang.
- **FR-63 (Bør)** Studenten kan velge ett av seks fargetemaer. Endringen vises med én gang. Til FR-63 er bygget, brukes standardtemaet fra DESIGN.md.
- **FR-61 (Bør)** Innstillinger → Prosjekter viser alle prosjektnavn som er brukt på oppgaver. Studenten kan slette et prosjektnavn etter en bekreftelse, og navnet fjernes da fra alle oppgaver. Etikettene Skole, Jobb og Privat er faste og kan ikke slettes.

## Ikke-funksjonelle krav

- **NFR-1 Kjørbar for sensor.** Appen kan startes lokalt etter README uten gruppens API-nøkkel, betalte kontoer eller eksterne tjenester. Uten nøkkel brukes reserveløsningen (F3).
- **NFR-2 Nøkkelen er hemmelig.** Kallet til Claude gjøres fra serveren, aldri fra nettleseren. API-nøkkelen ligger bare i `.env.local`, som ikke er i Git. `.env.example` viser hvilke variabler som trengs.
- **NFR-3 Ingen sporing.** Appen har ingen analyseverktøy eller tredjepartsskript. Serveren logger ikke innholdet i oppgaver, hendelser eller økter.
- **NFR-4 Lokal lagring.** Alle data, også fornavn, tema og samtykke, lagres bare i studentens nettleser og er der neste gang hun åpner appen på samme maskin. Gruppen lagrer ingen brukerdata.
- **NFR-5 Rask lagring.** Lagring av en oppgave venter aldri på KI (FR-2).
- **NFR-6 Testbar uten KI.** Automatiske tester bruker faste mock-svar i stedet for ekte kall til Claude.
- **NFR-7 Testbar tid.** Regler som avhenger av dato og klokkeslett (smarte lister, økter i Forfalt, gjentakende hendelser, sletting etter 7 dager) kan testes med en fast «nå»-tid.
- **NFR-8 Norsk.** All tekst i appen, KI-forslagene og personvernerklæringen er på norsk.
- **NFR-9 Tilgjengelighet.** Alle flater følger WCAG 2.1 AA. Detaljene står i EXPERIENCE.md → Accessibility Floor.
- **NFR-10 Web på mobil og PC.** dueNext er en web-app som fungerer like godt på telefon, nettbrett og PC. Det lages ingen egen app for iOS eller Android.

## Suksesskriterier

| Mål | Kriterium |
|---|---|
| KI-etikett | Minst 16 av 20 riktige etiketter i [KI-testsettet](../../../tests/ki-testsett/testsett.json) |
| KI-prioritet | Minst 14 av 20 riktige prioriteringer i KI-testsettet |
| Smarte lister | 20 av 20 riktige lister i KI-testsettet |
| Øktforslag | Alle foreslåtte økter holder grensene i FR-49, og hvert planleggingscase i KI-testsettet får minst én økt. Sjekkes med regler, ikke for hånd. [ASSUMPTION] KI-testsettet utvides med minst 5 planleggingscaser med frist og hendelser, hvorav minst én med nattevakt. |
| Brukervennlighet | Minst 4 av 5 testbrukere oppretter en oppgave og endrer et KI-forslag uten veiledning |
| Reserveløsning | Alle funksjoner unntatt KI-forslag, øktforslag og «Foreslå ny tid» virker uten API-nøkkel |

**Motmål:**
- Et høyt treff i testsettet må ikke oppnås ved å sende mer data enn nødvendig til KI (FR-15, FR-38, FR-39, FR-58). Hendelser og økter sendes bare for perioden fram til fristen, og bare ved planlegging.
- Testbrukerne skal forstå samtykkedialogen (FR-35) uten å trykke «Ja» bare for å komme videre.

## Utenfor scope

- Sekundærmålgruppen (enkeltpersoner og små team). Kan bli en utvidelse senere.
- Innlogging, brukerkontoer og synkronisering mellom enheter
- Egne etiketter. Egne navn skrives i prosjektfeltet.
- KI-forslag til frist
- Automatisk omplanlegging av økter (FR-52)
- Automatisk henting fra Canvas, Teams eller andre systemer
- Deling og samarbeid mellom brukere
- Mobilapp for iOS eller Android, varsler og påminnelser
- Kalenderintegrasjon (import fra eller eksport til Google Kalender, Outlook o.l.). Kalendervisningen i appen er med (FR-55).

## Åpne spørsmål

| # | Spørsmål | Avgjøres i |
|---|---|---|
| Å-1 | ~~Hvilken Claude-modell skal brukes?~~ Avgjort: Claude Sonnet. Eksakt versjon og modell-ID settes i arkitekturen. | Arkitektur |
| Å-2 | ~~Hvor lenge lagrer Anthropic API-data, og er Anthropic sertifisert under EU-US Data Privacy Framework?~~ Avklart 2026-11-02: inntil 30 dager, ikke DPF-sertifisert, overføring med SCC. Står i FR-35 og FR-41. | – |
| Å-3 | Hvem i gruppen er formelt behandlingsansvarlig i personvernerklæringen? Til det er avklart, står det en plassholder (FR-41). | Gruppen, etter svar fra faglærer |
| Å-4 | ~~Hvordan skal navn finnes til maskeringen (FR-42)?~~ Avgjort 2026-11-11: navn maskeres ikke. FR-42 gjelder telefonnumre og e-post. | – |
| Å-5 | Lagring i nettleseren: localStorage eller IndexedDB? | Arkitektur |
| Å-6 | Skal gruppen skrive en kort overføringsvurdering (TIA), siden overføringen til USA bygger på SCC? Vurderingen, og en eventuell DPIA, må nå også ta med at hendelser og økter sendes, og at de kan inneholde helseopplysninger (art. 9). | Gruppen, etter svar fra faglærer |
| Å-7 | Hvilke nøkkelord bruker reserveløsningen (FR-16)? | Arkitektur eller story, testes mot KI-testsettet |
| Å-8 | Hvor mange dager fram til fristen sendes hendelser og økter for (for eksempel 14) (FR-15)? | Arkitektur |

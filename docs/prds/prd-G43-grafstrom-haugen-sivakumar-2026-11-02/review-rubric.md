# Kvalitetsgjennomgang av PRD – dueNext

Gjennomgått mot BMADs PRD-sjekkliste, 2026-11-11 (tredje kjøring).

## Samlet vurdering

PRD-en er klar for arkitektur og epics. Det høye funnet fra forrige kjøring er løst med FR-64, og de fire middels rettingene holder: konfliktregel og peker til Key Flows øverst, lagringsvarsel i NFR-4, ubesvarte øktforslag forkastes i FR-62, og avhuket økt står i FR-56. FR-64 passer med FR-21, FR-34 og FR-52 uten nye motsigelser. Det som gjenstår, er mest at regelen for når øktforslag hentes, nå er spredt på FR-8, FR-13 og FR-62, og at øktmerkene fortsatt mangler regler for når de forsvinner.

## Beslutningsklarhet – sterk

Valgene står som beslutninger, og avveiningene er skrevet ut. FR-58 sier hva gruppen får («KI ser forskjell på en forelesning og en jobbvakt»), hva det koster («titler som «Legetime» kan være helseopplysninger»), og når valget tas opp igjen (Å-6). FR-62 er nå også et tydelig valg: ubesvarte forslag forkastes, og «det hentes ikke nye».

Å-3 og Å-6 er åpne med vilje, og PRD-en sier hva som gjelder imens. Konfliktregelen øverst («PRD-en gjelder for *hva* … EXPERIENCE.md gjelder for *hvordan*») gjør det klart hvem som avgjør hva.

## Innhold fremfor pynt – god

Ingen personas, ingen pynt i visjonen og ingen generiske NFR-er. NFR-1, NFR-2, NFR-4, NFR-6 og NFR-7 svarer på konkrete behov i emnet. NFR-10 er det eneste kravet som fortsatt er et adjektiv, men EXPERIENCE.md → Responsive & Platform har bruddpunktene, så det er nå lavt.

### Funn
- **lav** NFR-10 bruker et adjektiv i stedet for en grense (§ NFR-10) — «fungerer like godt på telefon, nettbrett og PC» kan ikke testes, og kravet viser ikke til bruddpunktene i EXPERIENCE.md. *Tiltak:* Skriv «Følger EXPERIENCE.md → Responsive & Platform», og legg til en minste bredde (for eksempel 320 px uten vannrett rulling) og hvilke nettlesere som testes.

## Strategisk sammenheng – god

Kjernen er tydelig: KI der teksten må tolkes, regler der svaret er forutsigbart, og studenten bestemmer. Økter passer inn fordi de bare er forslag (FR-50, FR-52), og FR-64 gjør at studenten alltid kan rette dem selv. Brukertesten måler likevel fortsatt bare oppgaver, selv om planlegging er en stor del av visjonen.

### Funn
- **middels** Brukertesten dekker ikke planlegging (§ Suksesskriterier, «Brukervennlighet») — Kriteriet er å opprette en oppgave og endre et KI-forslag. Hendelser, økter og Kalender er en stor del av v1, men ingen testbruker prøver dem. *Tiltak:* Legg til én oppgave i brukertesten, for eksempel «legg inn en vakt og godta en økt».
- **lav** Jobben som skal gjøres nevner ikke planlegging (§ Målgruppe) — Visjonen lover «når studenten kan jobbe med oppgaven», men JTBD handler bare om å skrive raskt og se hva som haster. *Tiltak:* Utvid JTBD med én setning om å finne tid rundt jobb og faste avtaler.

## Klarhet om når et krav er ferdig – god

FR-62 og FR-56 er nå mye tydeligere. FR-56 sier at en avhuket økt «blir stående i lista med strek over til dagen er over», og EXPERIENCE.md sier at «nummereringen n/N oppdateres». FR-64 sier hva som må bekreftes. Det som gjenstår, er to kanter i øktlogikken som vil dukke opp i stories, og noen mindre punkter.

### Funn
- **middels** Når øktforslag hentes, står tre steder og dekker ikke alle tilfeller (§ FR-8, FR-13, FR-62) — FR-8 sier at forslag til økter hentes «Når en oppgave er lagret» og har frist. FR-13 antyder at ny tekst gir nye øktforslag når det ikke er godtatte økter. FR-62 sier at endret frist med ubesvarte forslag gir «det hentes ikke nye». Det står ikke hva som skjer når tekst og frist endres i samme lagring, eller når fristen endres på en oppgave som verken har ubesvarte eller godtatte økter, for eksempel fordi alle forslagene gikk ut. FR-13 sier heller ikke om ubesvarte øktforslag erstattes ved ny tekst, og FR-62 sier ikke om forkastingen skjer uten melding. *Tiltak:* Samle regelen i FR-62: «Øktforslag hentes bare ved første lagring med frist, når en oppgave uten frist får frist, og ved ny tekst når oppgaven har frist og verken godtatte eller ubesvarte økter. Ellers hentes de ikke. Endret frist forkaster ubesvarte øktforslag uten melding, også når teksten endres samtidig.»
- **middels** Øktmerkene er knyttet til hendelser, ikke til tilstand (§ FR-52, FR-62) — «⚠ Etter fristen» settes når oppgaven «får en tidligere frist». Det står ikke når merkene forsvinner, for eksempel når studenten flytter økta med «Endre tid» (FR-64), sletter hendelsen eller setter fristen senere. FR-62 sier «Har oppgaven godtatte økter, gjelder FR-52» også når fristen fjernes, men FR-52 sier ingenting om fjernet frist. Kollisjon mellom to økter er ikke nevnt. *Tiltak:* Skriv merkene som beregnet tilstand: «En økt har merket så lenge den overlapper en hendelse eller ligger etter fristen. Uten frist får ingen økt «Etter fristen».» Si om økt mot økt gir merke.
- **lav** Avhuking av en økt kan ikke angres (§ FR-56) — FR-32 lar studenten angre fullføring av en oppgave, men FR-56 sier ikke om en avhuket økt kan hukes av igjen. *Tiltak:* Legg til «Avhukingen kan angres så lenge økta står i lista».
- **lav** Nedre grense på én økt kan ikke alltid holdes (§ FR-49, FR-14) — «1–5 økter» krever minst én, men en oppgave med frist i dag kl. 22:30 har ingen lovlig tid. FR-12 sier hva som vises når alle forslag er forkastet fordi tiden har passert, men ikke når KI ikke finner noen lovlig tid. *Tiltak:* Skriv «0–5 økter», og at bare «+ Legg til økt» vises når ingen forslag er gyldige, uansett grunn.
- **lav** «Nærmeste frist først» er tvetydig i Forfalt (§ FR-24) — I Forfalt kan det bety eldste eller nyeste forfalte først. *Tiltak:* Skriv det eksplisitt for Forfalt, for eksempel «eldste frist først».
- **lav** Tidsgrense for «KI svarer ikke» mangler (§ FR-16, FR-53, FR-54) — Flere krav bygger på at KI «ikke svarer», men ingen sier hvor lenge appen venter. *Tiltak:* Sett en grense (for eksempel 15 sekunder) eller legg den inn som et åpent spørsmål for arkitekturen.
- **lav** Import er uklar på to punkter (§ FR-43) — «KI-valget må besvares på nytt» sier ikke om førstegangsoppsettet vises, eller om KI er av til hun slår det på. Fila lister ikke innstillinger, tema og prosjekter slik FR-40 gjør. Kravet er Bør, så det haster mindre. *Tiltak:* Skriv «KI er av etter import, og samtykketeksten vises neste gang KI slås på». List innholdet som i FR-40.
- **lav** Hendelse over midnatt mangler regel for «I dag» (§ FR-45, FR-48) — Står en nattevakt 21:00–07:30 (+1 dag) i «I dag» også dag to, til 07:30? *Tiltak:* Én setning i FR-48.
- **lav** Gjentakelse uten grenser (§ FR-46) — Det står ikke om sluttdato er påkrevd, eller hvor langt fram den kan settes. *Tiltak:* Skriv om sluttdato er påkrevd, og en øvre grense (for eksempel ett år).

## Omfang – god

Hullet fra forrige kjøring er tettet. FR-64 er Må og dekker både hendelser og enkeltøkter, og FR-47 gjelder nå bare valget «Bare denne / Denne og alle senere». Bør-kravene sier fortsatt selv hva som gjelder uten dem. «Utenfor scope» er tydelig, og antall åpne punkter er lavt.

### Funn
- **middels** Advarselen om navn og helse forsvinner når FR-42 bygges (§ FR-42) — Teksten «byttes ut» når maskeringen er bygget. Den nye teksten i EXPERIENCE.md nevner bare telefonnumre og e-post, men navn og helseopplysninger maskeres fortsatt ikke. Siden PRD-en gjelder for regler, bør regelen stå her. *Tiltak:* Skriv i FR-42 at advarselen om navn og helseopplysninger blir stående, og rett teksten i EXPERIENCE.md.
- **lav** Må-krav viser til Bør-krav (§ FR-54) — FR-54 er Må, men beskriver knappen «Foreslå ny tid» og meldingen i FR-53, som er Bør. *Tiltak:* Skriv «Når FR-53 er bygget, vises …».
- **lav** Noen utelatelser er underforstått (§ Utenfor scope) — Gjentakende oppgaver, heldagshendelser og søk i hendelser er ikke med, men det står ingen steder. *Tiltak:* Legg dem til i «Utenfor scope».

## Nedstrøms bruk – sterk

Krav er lette å hente ut. ID-ene er stabile og unike, og begrepslista dekker økter og hendelser. Konfliktregelen øverst løser forrige funn, og EXPERIENCE.md → KI-planlegging sier nå selv at PRD-en gjelder ved konflikt. FR-64 brukes riktig i FR-21, og EXPERIENCE.md viser til FR-64 i øktkortet, hendelsesdetaljen og rad 6 i Økters livssyklus. Det som gjenstår, er små begrepsavvik under Mekaniske merknader.

## Form – sterk

Visjon + funksjoner uten brukerreiser passer. Produktet har én brukerrolle, og brukerreisene finnes i EXPERIENCE.md → Key Flows med navngitte personer. PRD-en peker nå dit («Brukerreiser: EXPERIENCE.md → Key Flows (Flyt 1–7)»), så forrige funn er løst.

## Mekaniske merknader

- FR-1 til FR-64, NFR-1 til NFR-10 og Å-1 til Å-8 er alle med, én gang hver. FR-62, FR-63 og FR-64 står ved kravene de hører til, og det er greit. Alle FR-henvisninger peker på krav som finnes.
- FR-12 sier at ubesvarte øktforslag vises til hun har svart, med passert tid som eneste unntak. Legg til «og når fristen endres (FR-62)», så de to kravene ikke ser ut til å motsi hverandre.
- FR-62 skriver «ubesvarte øktforslag», mens begrepslista bruker «foreslått økt». Bruk samme ord.
- F6 har fortsatt «(Må)» på FR-35–FR-41 og FR-58. Med regelen «Krav uten merke er Må» er merket overflødig. Fjern det, slik at F6 ser ut som resten.
- Det er én `[ASSUMPTION]` (planleggingscaser i KI-testsettet, § Suksesskriterier), men ingen oversikt over antakelser. Flytt den til Åpne spørsmål, eller lag en kort oversikt.
- «Påminnelse» brukes i to betydninger: KI-påminnelsen i skjemaet (FR-37) og varsler som er utenfor scope. Skriv «KI-påminnelse» i FR-37.
- FR-40 lister «prosjekter» som egne data, mens begrepslista og FR-61 sier at prosjekt er fritekst på oppgaven. Det kan få arkitekturen til å lage et eget prosjektobjekt.
- «Førstegangsoppsett» og «Personvern og data» brukes som stedsnavn uten å stå i begrepslista.
- Tabellen i F4 har kolonnen «Frist», men økter plasseres etter dato (FR-21). Skriv «Frist / øktdato».

# Kvalitetsgjennomgang av PRD – dueNext

Gjennomgått mot BMADs PRD-sjekkliste, 2026-11-11 (ny kjøring etter rettinger).

## Samlet vurdering

PRD-en er nå klar for arkitektur og epics. De seks høye funnene fra forrige kjøring er rettet, og rettingene holder: økter og hendelser har plass i lister, sortering, filter og antall, økta har grenser, og Må/Bør gjelder hele PRD-en. Rettingene har gitt én ny høy svakhet: å endre og slette hendelser står nå bare i et Bør-krav (FR-47), så v1 kan ende uten det. Ellers gjenstår mest mindre kanter rundt øktforslag som venter, øktmerker og avhuking.

## Beslutningsklarhet – sterk

Valgene står som beslutninger, og avveiningene er skrevet ut. FR-58 sier nå både hva gruppen får («KI ser forskjell på en forelesning og en jobbvakt»), hva det koster («titler som «Legetime» kan være helseopplysninger»), og når valget tas opp igjen (svar på Å-6). FR-5, FR-42 og FR-49 («Regelen bruker bare klokkeslett, så den virker også når titlene ikke sendes») er gode eksempler på det samme.

Å-3 og Å-6 er åpne med vilje, og PRD-en sier hva som gjelder imens. Prioriteringslinja over F1 gjør at leseren vet hva som kan kuttes.

## Innhold fremfor pynt – god

Ingen personas, ingen pynt i visjonen og ingen generiske NFR-er. NFR-1, NFR-2, NFR-6 og NFR-7 svarer på konkrete behov i emnet. NFR-10 er fortsatt unntaket.

### Funn
- **middels** NFR-10 bruker et adjektiv i stedet for en grense (§ NFR-10) — «fungerer like godt på telefon, nettbrett og PC» kan ikke testes. *Tiltak:* Bruk bruddpunktene fra EXPERIENCE.md, en minste bredde (for eksempel 320 px uten vannrett rulling) og hvilke nettlesere som testes.

## Strategisk sammenheng – god

Kjernen er tydelig: KI der teksten må tolkes, regler der svaret er forutsigbart, og studenten bestemmer. Økter passer inn fordi de bare er forslag (FR-50, FR-52). Øktkriteriet er nå strammet inn og kan ikke nås ved å foreslå null økter. Brukertesten måler derimot fortsatt bare oppgaver.

### Funn
- **middels** Brukertesten dekker ikke planlegging (§ Suksesskriterier, «Brukervennlighet») — Kriteriet er å opprette en oppgave og endre et KI-forslag. Hendelser, økter og Kalender er en stor del av v1, men ingen testbruker prøver dem. *Tiltak:* Legg til én oppgave i brukertesten, for eksempel «legg inn en vakt og godta en økt».
- **lav** Jobben som skal gjøres nevner ikke planlegging (§ Målgruppe) — Visjonen lover «når studenten kan jobbe med oppgaven», men JTBD handler bare om å skrive raskt og se hva som haster. *Tiltak:* Utvid JTBD med én setning om å finne tid rundt jobb og faste avtaler.

## Klarhet om når et krav er ferdig – god

Dette var tynt sist, og er nå mye bedre. FR-49 gir målbare grenser (1–5 økter, 30 min–3 t, 07–23, 8 timer etter nattevakt). FR-21 sier når en økt er passert. FR-24–FR-26 sier hvor økter og hendelser står i sortering og filter. FR-12, FR-14 og FR-50 sier hva som skjer med utdaterte og ugyldige forslag. En story-skriver kan nå skrive akseptkriterier for det meste. Kantene under er mindre, men vil dukke opp i stories.

### Funn
- **middels** Ventende øktforslag ved ny eller fjernet frist (§ FR-62, FR-12, FR-50) — FR-62 sier at ny frist gir nye øktforslag. Det står ikke om ubesvarte forslag fra den gamle fristen erstattes. Det står heller ikke hva som skjer med dem når fristen fjernes. FR-50 sjekker bare kollisjon ved Godta, ikke om forslaget nå ligger etter fristen. *Tiltak:* Skriv i FR-62: «Ubesvarte øktforslag forkastes når fristen endres eller fjernes.»
- **middels** Øktmerkene er knyttet til hendelser, ikke til tilstand (§ FR-52) — «⚠ Etter fristen» settes når oppgaven «får en tidligere frist». Det står ikke hva som skjer med en økt studenten selv legger etter fristen (FR-51), når fristen fjernes, eller når merkene forsvinner. Kollisjon mellom to økter er ikke nevnt. *Tiltak:* Skriv merkene som beregnet tilstand: «En økt har merket så lenge den overlapper en hendelse eller ligger etter fristen.» Si om økt mot økt gir merke.
- **middels** Avhuket økt er ikke beskrevet (§ FR-56) — FR-56 sier bare at en økt kan hukes av. Det står ikke om økta blir i lista, om avhukingen kan angres, eller hvordan «Økt n/N» nummereres når økter legges til eller slettes. *Tiltak:* Legg til to setninger i FR-56, eller vis til EXPERIENCE.md → KI-planlegging.
- **lav** Nedre grense på én økt kan ikke alltid holdes (§ FR-49, FR-14) — «1–5 økter» krever minst én, men en oppgave med frist i dag kl. 22:30 har ingen lovlig tid. FR-14 sier ikke hva som vises når alle øktforslag forkastes, bare FR-12 gjør det for passert tid. *Tiltak:* Skriv «0–5 økter», og at bare «+ Legg til økt» vises når ingen forslag er gyldige, uansett grunn.
- **lav** «Nærmeste frist først» er tvetydig i Forfalt (§ FR-24) — I Forfalt kan det bety eldste eller nyeste forfalte først. *Tiltak:* Skriv det eksplisitt for Forfalt, for eksempel «eldste frist først».
- **lav** Tidsgrense for «KI svarer ikke» mangler (§ FR-16, FR-53, FR-54) — Flere krav bygger på at KI «ikke svarer», men ingen sier hvor lenge appen venter. *Tiltak:* Sett en grense (for eksempel 15 sekunder) eller legg den inn som et åpent spørsmål for arkitekturen.
- **lav** Import er uklar på to punkter (§ FR-43) — «KI-valget må besvares på nytt» sier ikke om førstegangsoppsettet vises, eller om KI er av til hun slår det på. Fila lister ikke innstillinger, tema og prosjekter slik FR-40 gjør. Kravet er Bør, så det haster mindre. *Tiltak:* Skriv «KI er av etter import, og samtykketeksten vises neste gang KI slås på». List innholdet som i FR-40.
- **lav** Hendelse over midnatt mangler regel for «I dag» (§ FR-45, FR-48) — Står en nattevakt 21:00–07:30 (+1 dag) i «I dag» også dag to, til 07:30? *Tiltak:* Én setning i FR-48.
- **lav** Gjentakelse uten grenser (§ FR-46) — Det står ikke om sluttdato er påkrevd, eller hvor langt fram den kan settes. *Tiltak:* Skriv om sluttdato er påkrevd, og en øvre grense (for eksempel ett år).

## Omfang – god

Prioriteringen er nå gjort for hele PRD-en: «Krav uten merke er **Må** … Krav merket **(Bør)** tas med hvis det er tid.» Bør-kravene (FR-42, FR-43, FR-46, FR-47, FR-53, FR-61, FR-63) sier selv hva som gjelder uten dem, for eksempel «Uten FR-46 legges alle hendelser inn én og én». Det er god praksis. «Utenfor scope» er tydelig, og antall åpne punkter er lavt. Splittingen har likevel gitt ett hull.

### Funn
- **høy** Endre og slette hendelser og enkeltøkter er ikke et Må-krav (§ F1 innledning, FR-44, FR-47, FR-21, FR-52) — Den eneste setningen om å endre eller slette en hendelse står i FR-47, som er Bør og bare gjelder gjentakende hendelser. F1 sier bare at studenten «legger inn hendelser». Kuttes FR-46 og FR-47, kan studenten ikke rette en feil tid på en vakt, og bekreftelsen ved sletting forsvinner. For økter nevner FR-21 at en økt kan «flyttes eller slettes», og FR-52 har «Endre tid», men ingen krav sier at studenten kan endre eller slette en enkelt økt. *Tiltak:* Legg til ett Må-krav: «Studenten kan endre og slette en hendelse og en enkelt økt. Sletting må bekreftes.» La FR-47 bare gjelde valget «Bare denne / Denne og alle senere».
- **middels** Advarselen om navn og helse forsvinner når FR-42 bygges (§ FR-42) — Teksten «byttes ut» når maskeringen er bygget, men navn og helseopplysninger maskeres fortsatt ikke. *Tiltak:* Skriv i FR-42 at advarselen om navn og helseopplysninger blir stående.
- **lav** Må-krav viser til Bør-krav (§ FR-54) — FR-54 er Må, men beskriver knappen «Foreslå ny tid» og meldingen i FR-53, som er Bør. *Tiltak:* Skriv «Når FR-53 er bygget, vises …».
- **lav** Noen utelatelser er underforstått (§ Utenfor scope) — Gjentakende oppgaver, heldagshendelser og søk i hendelser er ikke med, men det står ingen steder. *Tiltak:* Legg dem til i «Utenfor scope».

## Nedstrøms bruk – god

Krav er lette å hente ut. ID-ene er stabile og unike, begrepslista dekker nå «foreslått økt» og «godtatt økt», og «Smart liste» er oppdatert med økter og hendelser. De fastsatte tekstene ligger i EXPERIENCE.md med lenke. Det mangler fortsatt en regel for hva som gjelder ved konflikt.

### Funn
- **middels** Det står ikke hvilket dokument som gjelder ved konflikt (§ innledningen) — Memloggen sier at DESIGN.md og EXPERIENCE.md gjelder foran PRD-en, men det står ikke i PRD-en. EXPERIENCE.md sier at seksjonen KI-planlegging eier reglene for økter, mens PRD-en har FR-49–FR-57. *Tiltak:* Skriv én linje øverst om hvilket dokument som gjelder for hva.

## Form – god

Visjon + funksjoner uten brukerreiser passer. Produktet har én brukerrolle, og brukerreisene finnes i EXPERIENCE.md → Key Flows med navngitte personer. Å skrive dem på nytt her ville gitt dobbelt vedlikehold. PRD-en peker likevel ikke til dem.

### Funn
- **lav** Ingen peker fra PRD-en til brukerreisene (§ innledningen) — Den som lager epics, må lete i EXPERIENCE.md for å finne flytene. *Tiltak:* Legg til «Brukerreiser: EXPERIENCE.md → Key Flows», gjerne med hvilke FR-er hver flyt dekker.

## Mekaniske merknader

- FR-1 til FR-63, NFR-1 til NFR-10 og Å-1 til Å-8 er alle med, én gang hver. FR-62 og FR-63 står ved kravene de hører til, og det er greit. Alle FR-henvisninger peker på krav som finnes.
- F6 har fortsatt «(Må)» på FR-35–FR-41 og FR-58. Med den nye regelen («Krav uten merke er Må») er merket overflødig. Fjern det, slik at F6 ser ut som resten.
- Det er én `[ASSUMPTION]` (planleggingscaser i KI-testsettet, § Suksesskriterier), men ingen oversikt over antakelser. Flytt den til Åpne spørsmål, eller lag en kort oversikt.
- «Påminnelse» brukes i to betydninger: KI-påminnelsen i skjemaet (FR-37) og varsler som er utenfor scope. Skriv «KI-påminnelse» i FR-37.
- FR-40 lister «prosjekter» som egne data, mens begrepslista og FR-61 sier at prosjekt er fritekst på oppgaven. Det kan få arkitekturen til å lage et eget prosjektobjekt.
- «Førstegangsoppsett» og «Personvern og data» brukes som stedsnavn uten å stå i begrepslista.
- Tabellen i F4 har kolonnen «Frist», men økter plasseres etter dato (FR-21). Skriv «Frist / øktdato».

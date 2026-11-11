# Kvalitetsgjennomgang av PRD – dueNext

Gjennomgått mot BMADs PRD-sjekkliste, 2026-11-11.

## Samlet vurdering

PRD-en holder til arkitekturen. Visjonen, personvernkravene og de gamle kravene (F3–F6) er konkrete og sporbare. De nye kravene om hendelser, økter og kalender er derimot tynnere enn resten. Smartlistene er fortsatt skrevet bare for oppgaver, økta mangler felt og grenser, og flere overganger (frist lagt til senere, utdaterte øktforslag) er ikke avgjort. Disse bør rettes før epics og stories. Omfanget er nesten doblet uten at det er prioritert.

## Beslutningsklarhet – god

De fleste valg står som beslutninger med begrunnelse. FR-5 («KI setter aldri frist»), FR-42 («Navn maskeres ikke, fordi de er vanskelige å finne sikkert») og FR-38 («Godtatte økter på oppgaven kan likevel sendes som «opptatt»») sier både hva som er valgt og hva som er gitt opp. Å-3 er godt formulert: den har eier, og PRD-en sier hva som gjelder til den er avklart (plassholder i FR-41).

Svakheten er FR-58. Her er et personvernvalg tatt uten at avveiningen står i PRD-en.

### Funn
- **høy** Hendelsestitler sendes som standard, uten begrunnelse (§ FR-58, FR-35, Motmål) — FR-58 sier bare «Standard er på». Titler som «Legetime» kan være helseopplysninger (art. 9), og Å-6 nevner dette selv. Motmålet sier at KI ikke skal få «mer data enn nødvendig». Standard på går mot innebygd personvern (art. 25), og PRD-en sier ikke hva gruppen får igjen for det (bedre økter rundt nattevakt?). *Tiltak:* Skriv én setning i FR-58 om hvorfor standard er på, og hva som er gitt opp. Alternativt: sett standard til av. Knytt Å-6 til FR-58: «Svarer faglærer at DPIA trengs, vurderes standarden på nytt.»
- **lav** Å-6 og Å-8 samler to spørsmål hver (§ Åpne spørsmål) — Å-6 spør om både TIA og DPIA, og sier ikke hva svaret endrer i PRD-en. Å-8 blander antall dager og prompt-styring. *Tiltak:* Del dem opp. Skriv i Å-6 hva et «ja» betyr for v1, for eksempel «må være skrevet før KI slås på i innleveringen».

## Innhold fremfor pynt – god

Ingen personas, ingen pynt i visjonen og ingen generiske NFR-er. NFR-1, NFR-2, NFR-6 og NFR-7 er knyttet til konkrete behov i emnet. NFR-9 viser til en målbar standard (WCAG 2.1 AA). NFR-10 er unntaket.

### Funn
- **middels** NFR-10 bruker et adjektiv i stedet for en grense (§ NFR-10) — «fungerer like godt på telefon, nettbrett og PC» kan ikke testes. *Tiltak:* Bruk bruddpunktene fra EXPERIENCE.md (< 768, 768–1023, ≥ 1024 px), en minste bredde (for eksempel 320 px uten vannrett rulling) og hvilke nettlesere som testes.

## Strategisk sammenheng – god

Kjernen er fortsatt tydelig: KI der teksten må tolkes, regler der svaret er forutsigbart, og studenten bestemmer. Økter passer inn, fordi de bare er forslag (FR-50, FR-52). Visjonen er oppdatert med planlegging. Suksesskriteriene validerer derimot planleggingen dårlig.

### Funn
- **middels** Øktkriteriet kan nås ved å ikke foreslå noe (§ Suksesskriterier, «Øktforslag») — «Ingen foreslåtte økter kolliderer …» er oppfylt hvis KI foreslår null økter, eller legger alle kl. 23. Ingen brukertest dekker økter, hendelser eller kalender. *Tiltak:* Legg til «minst én økt per planleggingscase» og et tidsvindu (for eksempel 08–22). Legg til en oppgave i brukertesten: «legg inn en vakt og godta en økt».
- **lav** Jobben som skal gjøres nevner ikke planlegging (§ Målgruppe) — JTBD handler om å skrive raskt og se hva som haster. Visjonen lover nå også «når studenten kan jobbe med oppgaven». *Tiltak:* Utvid JTBD med én setning om å finne tid rundt jobb og andre faste avtaler.

## Klarhet om når et krav er ferdig – tynn

De gamle kravene (FR-1–FR-43) er fortsatt testbare. Mange har eksempler og ordrette tekster. De nye kravene om økter og hendelser er derimot ofte skrevet som hovedregel uten kanter. En story-skriver vil støte på spørsmålene under med én gang. Flere av svarene finnes delvis i EXPERIENCE.md, men PRD-en sier ikke at de gjelder.

### Funn
- **høy** Smartlistene er skrevet for oppgaver, men inneholder nå økter og hendelser (§ FR-21, FR-24, FR-25, FR-26, FR-48, Begreper «Smart liste») — Begrepet sier lista er «beregnet av regler ut fra fristen», men økter og hendelser har ingen frist. FR-24 sorterer på frist og prioritet. Det står ikke hvor økter og hendelser havner i sorteringen, eller hva «Prioritet» og «Nyeste» (FR-25) gjør med dem. Det står ikke om etikettfilteret (FR-26) skjuler hendelser, som ikke har etikett, eller om økter arver oppgavens etikett. FR-21 sier at økter teller i gruppeoverskriften, men ikke om hendelser gjør det. *Tiltak:* Legg til ett krav som sier: hendelser står alltid øverst i «I dag» etter starttid, økter sorteres etter starttid sammen med oppgavene (eller i egen blokk), økter arver oppgavens etikett og prosjekt i filteret, og hendelser vises/vises ikke ved etikettfilter. Oppdater begrepet «Smart liste».
- **høy** Økta mangler felt og grenser (§ FR-49, FR-51, FR-53, Begreper «Økt») — Oppgaven har en felttabell, men økta har ingen. Det står ikke om en økt har start og slutt eller bare start, hvor lang den kan være, hvor mange økter KI foreslår, hvilke klokkeslett som er lov, eller at forslag ikke kan ligge i fortiden. «KI bør unngå økter rett etter for eksempel en nattevakt» er et ønske, ikke et krav, og kan ikke virke når titler er av (FR-58). *Tiltak:* Lag en felttabell for økt (og hendelse). Sett grenser for forslag: ikke i fortiden, innenfor et tidsvindu, 1–N økter, lengde. Gjør nattevakt-regelen målbar (for eksempel «minst 8 timer etter en hendelse som slutter etter 02:00») eller flytt den helt til Å-8.
- **høy** Frist lagt til senere gir aldri øktforslag (§ FR-8, FR-13) — FR-8 henter øktforslag bare når en oppgave med frist lagres. FR-13 sier «Endres bare fristen, kommer det ingen nye forslag». En oppgave lagret uten frist og gitt frist dagen etter, får derfor aldri KI-økter. Det finnes ingen knapp for å be om øktforslag. *Tiltak:* Avgjør det: enten gir ny frist (fra ingen frist) øktforslag når oppgaven ikke har økter, eller så skrives det som bevisst valg, med «+ Legg til økt» som vei videre.
- **høy** Ubesvarte øktforslag kan bli utdaterte (§ FR-12, FR-50) — FR-12 sier at forslag vises igjen neste gang appen åpnes, til hun har svart. Et øktforslag for mandag 08:00 kan da vises på onsdag, eller kollidere med en hendelse som er lagt inn etterpå. Godtas det, havner økta rett i «Forfalt» (FR-21). *Tiltak:* Skriv at øktforslag med passert tid forkastes, og at kollisjon sjekkes på nytt når studenten godtar.
- **middels** Øktmerkene er knyttet til hendelser, ikke til tilstand (§ FR-52) — «⚠ Etter fristen» settes når oppgaven «får en tidligere frist». Det står ikke hva som skjer med en økt studenten selv legger etter fristen (FR-51), eller når fristen fjernes. Det står ikke når merkene forsvinner (hendelsen slettes, økta flyttes). Kollisjon mellom to økter er ikke nevnt. *Tiltak:* Skriv merkene som beregnet tilstand: «En økt har merket så lenge den overlapper en hendelse / ligger etter fristen.» Si om økt mot økt gir merke.
- **middels** «Svarer» kan ikke vites før kallet, og tidsgrensen mangler (§ FR-54, FR-53, FR-16) — FR-54 sier at «Foreslå ny tid» finnes bare når KI «er på og svarer». FR-53 har en egen melding for når KI ikke svarer, altså må knappen vises før svaret. Ingen krav sier hvor lenge appen venter før «Claude ikke svarer» (FR-16) gjelder. *Tiltak:* Skriv «når KI er på og oppgaven ikke er merket 🔒» i FR-54. Sett en tidsgrense (for eksempel 15 sekunder) eller legg den inn som Å-9 for arkitekturen.
- **middels** FR-14 sier ikke hva et ugyldig øktforslag er (§ FR-14, FR-17) — FR-14 sier at ugyldige verdier forkastes og at reserveløsningen brukes. Reserveløsningen foreslår ikke økter (FR-17). Det står ikke om en økt som kolliderer eller ligger etter fristen, er ugyldig, og hva som vises hvis alle øktforslag forkastes. *Tiltak:* Skriv at øktforslag som bryter FR-49 forkastes enkeltvis, og at de andre forslagene vises som vanlig. Da blir også suksesskriteriet for økter en regel i appen, ikke bare i testen.
- **middels** Avhuket økt er ikke beskrevet (§ FR-56) — FR-56 sier bare at en økt kan hukes av. Det står ikke om økta blir i lista (EXPERIENCE.md: «med strek over til dagen er slutt»), om avhukingen kan angres, eller hvordan «Økt n/N» nummereres når økter legges til eller slettes. *Tiltak:* Legg til to setninger i FR-56, eller vis til EXPERIENCE.md → KI-planlegging som bindende.
- **middels** Import er uklar på to punkter (§ FR-43, FR-35) — «KI-valget må besvares på nytt» sier ikke hvordan: vises førstegangsoppsettet, eller er KI av til hun slår det på? FR-43 sier «alle data», men lister ikke innstillingene (FR-39, FR-58), tema og prosjekter slik FR-40 gjør. *Tiltak:* Skriv «KI er av etter import, og samtykketeksten vises neste gang KI slås på» (eller tilsvarende). List innholdet i fila som i FR-40.
- **lav** Hendelse over midnatt mangler regel for «I dag» (§ FR-45, FR-48) — En nattevakt 21:00–07:30 (+1 dag): står den i «I dag» begge dagene til 07:30? *Tiltak:* Én setning i FR-48.
- **lav** Gjentakelse uten grenser (§ FR-46) — Det står ikke om sluttdato er påkrevd, eller hvor langt fram den kan settes. *Tiltak:* Skriv om sluttdato er påkrevd, og en øvre grense (for eksempel ett år).
- **lav** «Først» er tvetydig (§ FR-50) — «vises først i lister og Kalender når …» kan leses som «øverst». *Tiltak:* Skriv «vises ikke i lister og Kalender før studenten har godtatt dem».

## Omfang – god

«Utenfor scope» er tydelig og oppdatert. Skillet mellom kalendervisning (med) og kalenderintegrasjon (ute) er godt. Antall åpne punkter er lavt (fire åpne Å, én [ASSUMPTION]) og passer et emneprosjekt. Problemet er at det nye omfanget ikke er prioritert.

### Funn
- **høy** Omfanget er nesten doblet uten prioritering (§ F1 Hendelser, F2 Økter, F4 FR-55, F7) — Oppdateringen la til 18 nye FR-er: gjentakende hendelser, KI-planlegging, månedskalender, seks fargetemaer og prosjektliste. Bare F6 har «Må» og «Bør». For en gruppe på fire er det ikke sagt hva som kuttes hvis tiden ikke strekker til. *Tiltak:* Merk FR-44–FR-61 med Må/Bør, som i F6. Kandidater til Bør: FR-46 (gjentakelse), FR-53 («Foreslå ny tid»), FR-60 (seks tema), FR-61 (prosjektliste).
- **middels** Advarselen om navn og helse forsvinner når FR-42 bygges (§ FR-42) — FR-42 sier at teksten «byttes ut» når maskeringen er bygget. Den nye teksten i EXPERIENCE.md nevner bare telefonnumre og e-post. Navn og helseopplysninger maskeres fortsatt ikke, men advarselen om dem forsvinner. *Tiltak:* Skriv i FR-42 at advarselen om navn og helseopplysninger blir stående, og be UX legge den til i den nye teksten.
- **lav** Noen utelatelser er underforstått (§ Utenfor scope) — Gjentakende oppgaver, heldagshendelser og søk i hendelser er ikke med, men det står ingen steder. *Tiltak:* Legg dem til i «Utenfor scope».

## Nedstrøms bruk – god

PRD-en er lett å hente krav fra. ID-ene er stabile og unike. Begrepslista finnes, og de fastsatte tekstene er lagt i EXPERIENCE.md med lenke, slik at de ikke finnes to steder. Det som mangler, er en regel for hva som gjelder når de to dokumentene sier ulikt.

### Funn
- **middels** Det står ikke hvilket dokument som gjelder ved konflikt (§ innledningen, F2) — Memloggen sier at DESIGN.md og EXPERIENCE.md gjelder foran PRD-en. Det står ikke i PRD-en. EXPERIENCE.md sier i tillegg at seksjonen KI-planlegging «eier reglene for økter», mens PRD-en har FR-49–FR-57. Story-skrivere vet da ikke hvilket dokument de skal følge. *Tiltak:* Skriv én linje øverst: «Ved konflikt gjelder PRD-en for hva appen skal gjøre, og EXPERIENCE.md for hvordan og ordrette tekster» (eller omvendt, men si det).
- **lav** Begrepslista mangler nye begreper (§ Begreper) — «Foreslått økt» og «godtatt økt» er bærende i FR-15, FR-21, FR-50 og FR-52, men er ikke definert. «Arkiv», «Førstegangsoppsett» og «Personvern og data» brukes som stedsnavn uten definisjon. *Tiltak:* Legg dem til.

## Form – god

Visjon + funksjoner uten brukerreiser passer her. Produktet har én brukerrolle, og brukerreisene finnes allerede i EXPERIENCE.md → Key Flows, med navngitte personer (Ida og Sara) og konkrete situasjoner. Å skrive dem på nytt i PRD-en ville bare gitt dobbelt vedlikehold. PRD-en peker likevel ikke til dem.

### Funn
- **lav** Ingen peker fra PRD-en til brukerreisene (§ innledningen) — Den som lager epics, finner ikke flytene uten å lete i EXPERIENCE.md. *Tiltak:* Legg til en linje: «Brukerreiser: EXPERIENCE.md → Key Flows (Flyt 1–7)», gjerne med hvilke FR-er hver flyt dekker.

## Mekaniske merknader

- FR-1 til FR-61, NFR-1 til NFR-10 og Å-1 til Å-8 er alle med, én gang hver. Rekkefølgen inne i funksjonsgruppene er bevisst. Alle FR-henvisninger i teksten (FR-15, FR-38, FR-55, FR-59, FR-61 osv.) peker på krav som finnes.
- Lenkene til brief, tilbakemelding, prd-avvik.md, DESIGN.md, EXPERIENCE.md (med ankeret `#personvern-og-data--fastsatte-tekster`), KI-testsettet og research-filene peker på filer som finnes.
- Det er én `[ASSUMPTION]` (planleggingscaser i KI-testsettet, § Suksesskriterier), men ingen oversikt over antakelser. *Tiltak:* Flytt den til Åpne spørsmål, eller lag en kort oversikt nederst.
- «Påminnelse» brukes i to betydninger: KI-påminnelsen i skjemaet (FR-37) og varsler som er utenfor scope («varsler og påminnelser»). Skriv «KI-påminnelse» i FR-37.
- FR-40 lister «prosjekter» som egne data, mens FR-61 og begrepslista sier at prosjekt er fritekst på oppgaven. Små ord, men det kan få arkitekturen til å lage et eget prosjektobjekt.
- Den forrige gjennomgangen (2026-11-02) nevnte bare FR-1–FR-43 og NFR-1–NFR-8. Den er erstattet av denne.

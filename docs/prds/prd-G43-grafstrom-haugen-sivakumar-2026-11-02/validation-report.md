# Valideringsrapport – dueNext

- **PRD:** `docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/prd.md`
- **Rubrikk:** `.claude/skills/bmad-prd/assets/prd-validation-checklist.md`
- **Kjørt:** 2026-11-11T17:23:56+01:00
- **Karakter:** Middels

## Samlet vurdering
PRD-en er nå klar for arkitektur og epics. De seks høye funnene fra forrige kjøring er rettet, og rettingene holder: økter og hendelser har plass i lister, sortering, filter og antall, økta har grenser, og Må/Bør gjelder hele PRD-en. Rettingene har gitt én ny høy svakhet: å endre og slette hendelser står nå bare i et Bør-krav (FR-47), så v1 kan ende uten det. Ellers gjenstår mest mindre kanter rundt øktforslag som venter, øktmerker og avhuking.

## Vurdering per dimensjon
- Beslutningsklarhet – sterk
- Innhold fremfor pynt – god
- Strategisk sammenheng – god
- Klarhet om når et krav er ferdig – god
- Omfang – god
- Nedstrøms bruk – god
- Form – god

## Funn etter alvorlighet

### Kritisk (0)

### Høy (1)
**[Omfang]** — Endre og slette hendelser og enkeltøkter er ikke et Må-krav (§ F1 innledning, FR-44, FR-47, FR-21, FR-52)
Den eneste setningen om å endre eller slette en hendelse står i FR-47, som er Bør og bare gjelder gjentakende hendelser. F1 sier bare at studenten «legger inn hendelser». Kuttes FR-46 og FR-47, kan studenten ikke rette en feil tid på en vakt, og bekreftelsen ved sletting forsvinner. For økter nevner FR-21 at en økt kan «flyttes eller slettes», og FR-52 har «Endre tid», men ingen krav sier at studenten kan endre eller slette en enkelt økt.
Tiltak: Legg til ett Må-krav: «Studenten kan endre og slette en hendelse og en enkelt økt. Sletting må bekreftes.» La FR-47 bare gjelde valget «Bare denne / Denne og alle senere».


### Middels (7)
**[Innhold fremfor pynt]** — NFR-10 bruker et adjektiv i stedet for en grense (§ NFR-10)
«fungerer like godt på telefon, nettbrett og PC» kan ikke testes.
Tiltak: Bruk bruddpunktene fra EXPERIENCE.md, en minste bredde (for eksempel 320 px uten vannrett rulling) og hvilke nettlesere som testes.

**[Strategisk sammenheng]** — Brukertesten dekker ikke planlegging (§ Suksesskriterier, «Brukervennlighet»)
Kriteriet er å opprette en oppgave og endre et KI-forslag. Hendelser, økter og Kalender er en stor del av v1, men ingen testbruker prøver dem.
Tiltak: Legg til én oppgave i brukertesten, for eksempel «legg inn en vakt og godta en økt».

**[Klarhet om når et krav er ferdig]** — Ventende øktforslag ved ny eller fjernet frist (§ FR-62, FR-12, FR-50)
FR-62 sier at ny frist gir nye øktforslag. Det står ikke om ubesvarte forslag fra den gamle fristen erstattes. Det står heller ikke hva som skjer med dem når fristen fjernes. FR-50 sjekker bare kollisjon ved Godta, ikke om forslaget nå ligger etter fristen.
Tiltak: Skriv i FR-62: «Ubesvarte øktforslag forkastes når fristen endres eller fjernes.»

**[Klarhet om når et krav er ferdig]** — Øktmerkene er knyttet til hendelser, ikke til tilstand (§ FR-52)
«⚠ Etter fristen» settes når oppgaven «får en tidligere frist». Det står ikke hva som skjer med en økt studenten selv legger etter fristen (FR-51), når fristen fjernes, eller når merkene forsvinner. Kollisjon mellom to økter er ikke nevnt.
Tiltak: Skriv merkene som beregnet tilstand: «En økt har merket så lenge den overlapper en hendelse eller ligger etter fristen.» Si om økt mot økt gir merke.

**[Klarhet om når et krav er ferdig]** — Avhuket økt er ikke beskrevet (§ FR-56)
FR-56 sier bare at en økt kan hukes av. Det står ikke om økta blir i lista, om avhukingen kan angres, eller hvordan «Økt n/N» nummereres når økter legges til eller slettes.
Tiltak: Legg til to setninger i FR-56, eller vis til EXPERIENCE.md → KI-planlegging.

**[Omfang]** — Advarselen om navn og helse forsvinner når FR-42 bygges (§ FR-42)
Teksten «byttes ut» når maskeringen er bygget, men navn og helseopplysninger maskeres fortsatt ikke.
Tiltak: Skriv i FR-42 at advarselen om navn og helseopplysninger blir stående.

**[Nedstrøms bruk]** — Det står ikke hvilket dokument som gjelder ved konflikt (§ innledningen)
Memloggen sier at DESIGN.md og EXPERIENCE.md gjelder foran PRD-en, men det står ikke i PRD-en. EXPERIENCE.md sier at seksjonen KI-planlegging eier reglene for økter, mens PRD-en har FR-49–FR-57.
Tiltak: Skriv én linje øverst om hvilket dokument som gjelder for hva.


### Lav (10)
**[Strategisk sammenheng]** — Jobben som skal gjøres nevner ikke planlegging (§ Målgruppe)
Visjonen lover «når studenten kan jobbe med oppgaven», men JTBD handler bare om å skrive raskt og se hva som haster.
Tiltak: Utvid JTBD med én setning om å finne tid rundt jobb og faste avtaler.

**[Klarhet om når et krav er ferdig]** — Nedre grense på én økt kan ikke alltid holdes (§ FR-49, FR-14)
«1–5 økter» krever minst én, men en oppgave med frist i dag kl. 22:30 har ingen lovlig tid. FR-14 sier ikke hva som vises når alle øktforslag forkastes, bare FR-12 gjør det for passert tid.
Tiltak: Skriv «0–5 økter», og at bare «+ Legg til økt» vises når ingen forslag er gyldige, uansett grunn.

**[Klarhet om når et krav er ferdig]** — «Nærmeste frist først» er tvetydig i Forfalt (§ FR-24)
I Forfalt kan det bety eldste eller nyeste forfalte først.
Tiltak: Skriv det eksplisitt for Forfalt, for eksempel «eldste frist først».

**[Klarhet om når et krav er ferdig]** — Tidsgrense for «KI svarer ikke» mangler (§ FR-16, FR-53, FR-54)
Flere krav bygger på at KI «ikke svarer», men ingen sier hvor lenge appen venter.
Tiltak: Sett en grense (for eksempel 15 sekunder) eller legg den inn som et åpent spørsmål for arkitekturen.

**[Klarhet om når et krav er ferdig]** — Import er uklar på to punkter (§ FR-43)
«KI-valget må besvares på nytt» sier ikke om førstegangsoppsettet vises, eller om KI er av til hun slår det på. Fila lister ikke innstillinger, tema og prosjekter slik FR-40 gjør. Kravet er Bør, så det haster mindre.
Tiltak: Skriv «KI er av etter import, og samtykketeksten vises neste gang KI slås på». List innholdet som i FR-40.

**[Klarhet om når et krav er ferdig]** — Hendelse over midnatt mangler regel for «I dag» (§ FR-45, FR-48)
Står en nattevakt 21:00–07:30 (+1 dag) i «I dag» også dag to, til 07:30?
Tiltak: Én setning i FR-48.

**[Klarhet om når et krav er ferdig]** — Gjentakelse uten grenser (§ FR-46)
Det står ikke om sluttdato er påkrevd, eller hvor langt fram den kan settes.
Tiltak: Skriv om sluttdato er påkrevd, og en øvre grense (for eksempel ett år).

**[Omfang]** — Må-krav viser til Bør-krav (§ FR-54)
FR-54 er Må, men beskriver knappen «Foreslå ny tid» og meldingen i FR-53, som er Bør.
Tiltak: Skriv «Når FR-53 er bygget, vises …».

**[Omfang]** — Noen utelatelser er underforstått (§ Utenfor scope)
Gjentakende oppgaver, heldagshendelser og søk i hendelser er ikke med, men det står ingen steder.
Tiltak: Legg dem til i «Utenfor scope».

**[Form]** — Ingen peker fra PRD-en til brukerreisene (§ innledningen)
Den som lager epics, må lete i EXPERIENCE.md for å finne flytene.
Tiltak: Legg til «Brukerreiser: EXPERIENCE.md → Key Flows», gjerne med hvilke FR-er hver flyt dekker.

## Mekaniske merknader
- FR-1 til FR-63, NFR-1 til NFR-10 og Å-1 til Å-8 er alle med, én gang hver. FR-62 og FR-63 står ved kravene de hører til, og det er greit. Alle FR-henvisninger peker på krav som finnes.
- F6 har fortsatt «(Må)» på FR-35–FR-41 og FR-58. Med den nye regelen («Krav uten merke er Må») er merket overflødig. Fjern det, slik at F6 ser ut som resten.
- Det er én `[ASSUMPTION]` (planleggingscaser i KI-testsettet, § Suksesskriterier), men ingen oversikt over antakelser. Flytt den til Åpne spørsmål, eller lag en kort oversikt.
- «Påminnelse» brukes i to betydninger: KI-påminnelsen i skjemaet (FR-37) og varsler som er utenfor scope. Skriv «KI-påminnelse» i FR-37.
- FR-40 lister «prosjekter» som egne data, mens begrepslista og FR-61 sier at prosjekt er fritekst på oppgaven. Det kan få arkitekturen til å lage et eget prosjektobjekt.
- «Førstegangsoppsett» og «Personvern og data» brukes som stedsnavn uten å stå i begrepslista.
- Tabellen i F4 har kolonnen «Frist», men økter plasseres etter dato (FR-21). Skriv «Frist / øktdato».

## Filer fra gjennomgangene
- `review-rubric.md`

# Tilbakemelding på PRD

| | |
|---|---|
| **Gruppe** | G43 – G43-grafstrom-haugen-sivakumar |
| **PRD vurdert** | `docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/prd.md` (status `final`, sist endret 2026-11-11, commit 379f509) |
| **Dato** | 2026-11-12 |
| **Type** | Formativ tilbakemelding, ikke karakter |

## 1. Samlet inntrykk

PRD-en til dueNext har en tydelig tese (KI foreslår, regler sorterer, studenten bestemmer), er ærlig om avveiningene i personvernet og har et gjennomtenkt skille mellom KI og reserveløsning. Største risiko er størrelsen. Briefen ble vurdert som «enkel», men PRD-en har nå 64 FR-er og ca. 4 200 ord med hendelser, økter, kalender og et omfattende personvernløp. Det er krevende å bygge, teste og dokumentere på ett semester.

## 2. Dette fungerer godt

- **Ærlige avveininger.** FR-58 forklarer hvorfor hendelsestitler sendes som standard («titlene gir bedre økter … Det koster at titler som «Legetime» kan være helseopplysninger») og når standarden skal vurderes på nytt. Slik skal et valg dokumenteres.
- **Testbare grenser og testbar infrastruktur.** FR-49 (1–5 økter, 30 min–3 t, mellom 07:00 og 23:00, ingen overlapp) kan sjekkes med kode, og suksesskriteriet sier nettopp «Sjekkes med regler, ikke for hånd». NFR-6 (mock-svar) og NFR-7 (fast «nå»-tid) gir en vei til automatiske tester.
- **Reserveløsning og avgrensning.** F3 og NFR-1 gjør at appen kan kjøres uten nøkkel. «Utenfor scope» og de åpne spørsmålene (Å-1, Å-2 og Å-4 ført som avgjort) viser hva som er besluttet og hva som gjenstår.

## 3. Oversikt per dimensjon

| Dimensjon | Vurdering | Kort begrunnelse |
|---|---|---|
| Beslutningsklarhet | sterk | Valg står som valg, med kostnad (FR-58, FR-42, Å-4). |
| Substans | sterk | Ingen pynte-personas eller boilerplate. NFR-ene er produktspesifikke. |
| Strategisk sammenheng | god | Tesen holder, men økter/kalender er en betydelig utvidelse av den opprinnelige tesen i briefen. |
| Testbarhet | god | Mange FR-er har konkrete regler, men noen er tette regelklumper eller bruker adjektiver. |
| Scope og avgrensning | god | Utelatelser og Bør/Må er eksplisitte, men Må-omfanget er stort. |
| Brukbarhet for neste fase | god | IDs 1–64 er hele, glossar finnes. Brukerreisene ligger i annet dokument og er ikke knyttet til FR-ene. |
| Formtilpasning | god | Egen form uten malens UJ-seksjon passer for en liten app, men dokumentet er langt. |

## 4. Viktigste forbedringer

### 4.1 Må-omfanget er for stort til å prioritere uten en kuttrekkefølge
- **Alvorlighet:** høy
- **Hvor:** «Prioritet: Krav uten merke er **Må** og er med i v1», F1–F6
- **Problem og hvorfor det betyr noe:** Bare 8 av 64 FR-er er merket (Bør). Resten, inkludert hendelser, økter med fem grenser, Kalender og ni personvern-Må, er forpliktelser. Epics og stories får ingen rekkefølge, og hvis dere blir forsinket, finnes det ingen avtalt plan for hva som utgår. Økter krever hendelser og kalender, så forsinkelser slår raskt ut i kjernen.
- **Forslag:** Legg inn tre leveranseskiver, f.eks. (1) F1 oppgaver, F3 reserveløsning, F4 lister, F5 arkiv, (2) F6 personvern og KI-forslag til felt (F2 «Forslag til felt»), (3) hendelser, økter og Kalender. Skriv: «Skive 3 kuttes først. Uten den er dueNext fortsatt en fungerende oppgaveapp med KI-forslag.» Vurder også om FR-55 (Kalender) og FR-52 (merking av kolliderende økter) kan bli (Bør).

### 4.2 KI-kallet mangler tidsgrense, kostnadsramme og testscenarier
- **Alvorlighet:** medium
- **Hvor:** FR-16 «Claude ikke svarer», FR-14, NFR-6
- **Problem og hvorfor det betyr noe:** «Ikke svarer» er udefinert (hvor lenge venter appen?), og det står ikke hva et kall får koste eller hva som hindrer at andre bruker nøkkelen hvis appen publiseres. FR-14 kontrollerer gyldighet, men ikke «usikre» svar. NFR-6 sier «faste mock-svar» uten å si hvilke.
- **Forslag:** Ny NFR: «Et KI-kall avbrytes etter 15 sekunder. Da gjelder FR-16. Appen sender høyst ett forslagskall per lagring, og høyst 10 kall per minutt per nettleser.» Utvid NFR-6: «Mock-svarene dekker fire tilfeller: gyldig svar, ugyldig verdi (FR-14), tomt svar og tidsavbrudd.» Bestem også om appen skal kjøres offentlig eller bare lokalt (NFR-1), siden det avgjør kostnadsrisikoen.

### 4.3 Noen FR-er er regelklumper eller bruker adjektiver
- **Alvorlighet:** medium
- **Hvor:** FR-21, FR-62, FR-11 «tydelig merket», FR-37 «kort påminnelse», NFR-5 «Rask lagring»
- **Problem og hvorfor det betyr noe:** FR-21 og FR-62 samler 5–7 regler i ett avsnitt, så én story kan ikke ferdigstilles og testes med ett svar. De adjektivbaserte kravene kan ikke bli testtilfeller.
- **Forslag:** Del opp i tabell: «Tilstand → forventet resultat», f.eks. for FR-62: «Frist endres, oppgaven har ubesvarte øktforslag → forslagene forkastes, ingen nye hentes». Gjør NFR-5 målbar: «Med mock-KI som svarer etter 10 s vises oppgaven i lista innen 1 s etter «Lagre»». For FR-11: «Hvert KI-forslag har teksten «KI-forslag» og skiller seg fra godtatte verdier».

### 4.4 Brukerreisene er ikke knyttet til kravene
- **Alvorlighet:** medium
- **Hvor:** «Brukerreiser: EXPERIENCE.md → Key Flows (Flyt 1–7)»
- **Problem og hvorfor det betyr noe:** Det er greit at reisene bor i UX-dokumentet, men ingen FR sier hvilken flyt den realiserer. Stories og testplan kan dermed ikke spore fra flyt til krav, og dere ser ikke om en flyt mangler FR-er.
- **Forslag:** Legg til en linje under hver F-overskrift: «Realiserer Flyt 1, 2 og 5», eller en liten tabell Flyt → FR. Én setning per flyt i PRD-en gjør den lesbar alene.

### 4.5 Måling av to kriterier er uklar
- **Alvorlighet:** lav
- **Hvor:** «Minst 4 av 5 testbrukere … uten veiledning» og motmålet «skal forstå samtykkedialogen … uten å trykke «Ja» bare for å komme videre»
- **Problem og hvorfor det betyr noe:** Uten en definisjon av «uten veiledning» og hvordan forståelse kontrolleres blir resultatet et skjønn. Det samme gjelder [ASSUMPTION] om fem nye planleggingscaser, som ikke er bekreftet.
- **Forslag:** «Uten veiledning = ingen hjelp fra gruppen i løpet av 5 minutter. Forståelse = testbrukeren svarer riktig på to spørsmål: hva sendes, og kan det slettes?» Bekreft eller fjern antakelsen.

## 5. Mekaniske funn

- FR-1 til FR-64 er hele og unike, men står ikke i rekkefølge (FR-44–48 og FR-64 i F1, FR-62 midt i F2, FR-63 før FR-61). Dokumentet har uforklarte hopp for lesere.
- Linje 10 oppgir et annet gruppenavn enn repo-navnet (ett etternavn mer).
- Frontmatter har `status: final`, mens Å-3 og Å-6 er åpne og personvernerklæringen har plassholder. Vurder `draft` til de er avklart.
- Bare én inline `[ASSUMPTION]` (Suksesskriterier), og det finnes ingen Assumptions Index.
- FR-21 sier «hver aktive oppgave ligger i nøyaktig én liste», mens økter til samme oppgave kan ligge i andre lister. Presiser at regelen gjelder oppgaven, ikke øktene.
- Glossaret brukes konsekvent. Lenken til KI-testsettet løser seg.

## 6. Før dere går videre

**Må avklares før UX-oppdatering, arkitektur og epics:**
- Leveranseskiver og kuttrekkefølge (4.1).
- Tidsavbrudd, kallgrense og om appen driftes offentlig (4.2).
- Å-3 og Å-6 (behandlingsansvarlig, TIA/DPIA) hvis personvernerklæringen skal være ferdig. Å-5 og Å-8 kan vente til arkitekturen.

**Kan vente:** Å-7 (nøkkelord til reserveløsningen) og (Bør)-kravene.

**Oppfølging av briefen:** Ja. Testsettet er laget og lenket, innlogging er utenfor scope, nøkkelen ligger i `.env.local` og reserveløsningen er beskrevet (F3, NFR-1, NFR-2). Sekundærmålgruppen er flyttet til «Utenfor scope».

## 7. Refleksjonsspørsmål

1. FR-58 begrunner standarden «titler sendes». Hvordan kom dere frem til den avveiningen, hva foreslo KI-assistenten, og hva endret dere selv?
2. PRD-en har vokst fra briefens «enkle» oppgaveapp til hendelser, økter og kalender. Hvem tok initiativet til utvidelsen, og hvordan vurderte dere om dere rekker å teste den?

_Vurdert mot kvalitetsrubrikken i bmad-prd. Dette er veiledning, ikke sensur._

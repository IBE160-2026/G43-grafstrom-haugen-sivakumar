# Prompter fra PRD-økta 2026-11-02

Dokumentasjon av KI-styringen da PRD-en for dueNext ble laget. Promptene er gjengitt ordrett slik Abhira skrev dem. Under hver prompt står et kort sammendrag av hva Claude gjorde.

| | |
|---|---|
| **Verktøy** | Claude Code (modell Claude Opus 5.5) med BMAD v6.12.4 |
| **Skill** | `bmad-prd`, coaching med funksjonene først |
| **Kilder** | [product brief](../../product-brief.md), [tilbakemelding fra faglærer](../../../tilbakemelding-product-brief.md) |
| **Resultat** | [prd.md](prd.md), beslutningslogg i `.memlog.md`, fire research-notater og [review-rubric.md](review-rubric.md) |
| **Tidssone** | Norsk tid |

## Promptene

### 1. kl. 17:12

> BMAD

**Hva Claude gjorde:** Sjekket at BMAD ikke var installert, og spurte hva brukeren ville. Svar i dialogen: «Forklar BMAD-flyten». Claude forklarte stegene brief → PRD → arkitektur → stories → utvikling.

### 2. kl. 17:14

> Installer BMAD

**Hva Claude gjorde:** Installerte BMAD v6.12.4 (core + bmm) for Claude Code med norsk språk, og planleggingsdokumenter i `docs/`.

### 3. kl. 17:18

> Ligger product-brief.md og tilbakemelding-product-brief.md under bmad nå?

**Hva Claude gjorde:** Forklarte at filene ikke er flyttet, og at BMAD finner `docs/product-brief.md`, men ikke tilbakemeldingen i roten.

### 4. kl. 17:23

> Nei. Lag PRD

**Hva Claude gjorde:** Startet `bmad-prd` med briefen og tilbakemeldingen som grunnlag. Leste kildene og spurte om flere kilder, åpne beslutninger og arbeidsmåte.

### 5. kl. 17:38

> Vi er fire på gruppen - grafstrom-haugen-olsen-sivakumar. 1. Ønsker gjerne at vi har med mer om GDPR (personvern) i forbindelse med bruk av applikasjonen. Bruk gjerne forskningsartikler og internett. Bruk to subagenter. 2. Fullførte oppgaver skal arkiveres 7 dager. Sekundærmålgruppen skal være Out of Scope og en eventuell utvidelse på sikt. Vi ønsker ikke at fullførte og arkiverte oppgaver skal være med i smarte lister, men at det er mulig å finne fram i applikasjonen. Dersom en oppgave ikke blir fullført pga at man ikke har møtt opp eller fått tatt prøven (for eksempel en prøve på skolen), bør det være mulig å arkivere denne oppgaven uten at den er fullført  og eventuelt legge den inn en smart liste. 3. Coaching

**Hva Claude gjorde:** Startet to research-subagenter om GDPR (se under). Spurte om arkiveringsreglene og om coaching-inngang.

### 6. kl. 17:48

> Vi mener at en fullført oppgave ligger i arkivet i 7 dager og deretter slettes automatisk. Hvis vi ser for oss studenten som ikke møtte til prøve på grunn av sykdom, kan en anta at studenten har rett på eller kan ta en kontinuasjonsprøve eller ha en ny frist. Den kan derfor arkiveres etter 7-dagersregelen  og så får studenten legge inn oppgaven på nytt med eventuell ny frist/ny prøve. Vi ser for oss en nedtrekks meny med "..." der en kan trykke på arkiverte eller fullførte. De arkiverte oppgavene er ikke fullførte oppgaver, mens de fullførte oppgavene er fullført. Vi ønsker å begynne med funksjoner.

**Hva Claude gjorde:** Skilte mellom fullført og arkivert, og la frem seks funksjonsgrupper (F1–F6).

### 7. kl. 18:12

> Prosjekt er en tekstetikett. Arkivering og sletting står i både F1 og F5. F1 kan dekke opprette, redigere og fullføre, mens arkivering og slettingg av oppgaver kan stå under F5. DU kan legge inn "søk" under F4. En oppgave har feltene tekst, frist, prosjekt, prioritet og notater. Kun tekst er påkrevd. Oppgaven lagres umiddelbart når studenten trykker "lagre", uavhengig av om KI-forslag er tilgjengelige. Felt som står tomt, forblir tomme til studenten fyller dem ut eller godtar KI-forslag (se F2). Prioritet er "normal" dersom ingen annen verdi er valgt. Oppgaven legges i "uten frist" dersom man ikke godtar KI sin anbefaling eller har endret på det selv. Eksempel: Dersom man har lagt inn "innlevering i IBE160" og går ut av appen uten å ha valgt et KI-forslag eller endret på frist selv, blir denne lagt under "uten frist".

**Hva Claude gjorde:** Skrev F1 Oppgavehåndtering (FR-1 til FR-7) og pekte på fire avvik fra briefen.

### 8. kl. 18:24

> 1. Nei, KI kan ikke foreslå frist. Fristen skal alltid settes av studenten. Det må være mulighet for å ikke ha frist også. For eksempel med hverdagslige ting som å vaske klær eller vaske gulv etc. 2. Beklager, mente  "Middels" - ikke "normal". 3. KI skal gi et forslag, men bruker kan overstyre KI-forslaget. 4. Vi bruker "ingen frist". Kan du endre det i briefen også? Briefens formulering ser bra ut! Vi ønsker at arkivert og fullført skal slås sammen og kalles fullført. Kan du også endre i briefen at smart listen "Forfalt" havner nederst, altså etter "Uten dato"?

**Hva Claude gjorde:** Oppdaterte briefen (Ingen frist, Forfalt nederst, arkivert slått sammen med fullført) og KI-testsettet. Spurte om F2 KI-forslag.

### 9. kl. 18:28

> 1. Det bør være mulig å "lagre" uten å svare på KI-sine forslag. Deretter kommer forslagene. Vi tenker ett forslag per felt med "godta" eller "endre" da det er mer rom for brukeren å bestemme selv. 2. Da blir den lagret under "ingen frist" med "middels" prioritet. 3. Første oppstart

**Hva Claude gjorde:** Skrev F2 KI-forslag (FR-8 til FR-15).

### 10. kl. 18:40

> FR-11: Ja. FR-12: I det du trykker på "lagre", men går ut av appen etterpå, vil den lagres i appen med "ingen frist" og "middels" prioritet. Når brukeren går inn igjen bør forslag fra KI komme opp igjen, da oppgaven er ufullstendig. KI kan komme med forslag til etiketter, men brukeren kan selv velge å gå for KI-forslaget eller endre etikette etter at en har godtatt forslaget. Hvis man vil endre for eksempel etiketten "skole" til "Høgskolen i Molde", kan en gjøre det manuelt senere. 1. Da fyller brukeren ut alt selv. 2. Forslagene fra KI vises, så da kan en anta at alt annet er egne forslag/manuell innskriving. 3. Da er det nok at den forslår etikett og prioritet, mens sammendraget må brukeren skrive selv - den står da i utgangspunktet tomt.

**Hva Claude gjorde:** Oppdaterte FR-12 og skrev F3 Reserveløsning (FR-16 til FR-19). Pekte på at «Høgskolen i Molde» ikke passer med faste etiketter.

### 11. kl. 18:46

> 1. Høgskolen i Molde skal i prosjektfeltet, etiketten forblir fast.2. "Forslag basert på nøkkelord - KI var ikke tilgjengelig". Kan du endre de tre etikettene i i product brief og PRD til Privat, Skole og Jobb?

**Hva Claude gjorde:** Endret etikettene til Privat, Skole og Jobb i brief og PRD, og satte merkingen av reserveforslag i FR-18.

### 12. kl. 18:53

> Vi tenker at gruppearbeid går innunder etiketten "Skole". Gjerne endre de 4 oppgavene til "Jobb". Kan du legge inn oppgaver med gruppearbeid under "Skole" slik at vi også får eksempler på det?  Vi vil fortsatt ha 20 oppgaver. 1. Alt. 2. Vi tenker alt. Eksempel: Student som er usikker på når fristen/dato for statistikkprøven er og er usikker på om den er fullført eller om den står under smarte lister. 3. Det er fint om vi får ta med prosjekt under filtrering.

**Hva Claude gjorde:** Skrev om KI-testsettet (fem Jobb-oppgaver, to gruppeoppgaver under Skole) og skrev F4 (FR-20 til FR-28).

### 13. kl. 18:58

> 1. Ja, hvis det skjer innen 7 dager. Fra begge med en "er du sikker?"-knapp. 3. Det er fint om det står hvor mange dager det er igjen før oppgaven slettes fra fullført

**Hva Claude gjorde:** Skrev F5 Fullførte oppgaver og sletting (FR-29 til FR-34) og la frem ni personvernkrav fra researchen.

### 14. kl. 19:04

> Alle, men d og g er fint å ha. Vi tenker at navn og telefonnummer er nok, trenger ikke fødselsnummer.

**Hva Claude gjorde:** Skrev F6 Personvern (FR-35 til FR-43), og utkast til målgruppe, begreper, NFR, suksesskriterier, utenfor scope og åpne spørsmål.

### 15. kl. 19:23

> Å-1: Sonnet Å-2: Vi trenger to subagenter for å finne ut av dette. Å-3: kommer tilbake til det

**Hva Claude gjorde:** Startet to subagenter om Anthropics lagringstid og overføringsgrunnlag (se under), og oppdaterte FR-35, FR-41 og de åpne spørsmålene med svarene.

### 16. kl. 19:33

> avslutt PRD, commit og push

**Hva Claude gjorde:** Avsluttet PRD-en (beslutningslogg, sjekk mot kilder, kvalitetsgjennomgang, status final), committet og pushet.

### 17. kl. 19:37

> Kan du lagre promptene fra denne økten. Commit og push

**Hva Claude gjorde:** Lagret denne fila. Underveis skrev Abhira «Kan du kjøre pull». Claude kjørte `git pull`, og repoet var allerede oppdatert.

## Prompter til subagentene

Claude skrev disse promptene til research-subagentene etter at gruppen ba om det (prompt 5 og 15).

### GDPR-research: regelverk og praksis (kl. 17:38)

```text
Du gjør research for en PRD (produktkravdokument) i et norsk studentprosjekt (emnet IBE160). Svar på norsk.

Produktet: dueNext, en norsk oppgaveapp (to-do) for studenter, laget med Next.js. Brukeren skriver oppgaver med fritekst (f.eks. «Levere programmeringsoppgave fredag», men det kan også stå helse, eksamen, private avtaler o.l. i teksten og notatene). Serveren sender oppgavetekst og notater til Claude API fra Anthropic (USA), som foreslår etikett, prioritet og sammendrag. Det er ingen innlogging. Oppgavene lagres bare lokalt i nettleseren (f.eks. localStorage/IndexedDB) på brukerens maskin, og gruppen lagrer ingen brukerdata selv. Fullførte oppgaver arkiveres i 7 dager. Hvis API-nøkkel mangler, brukes en regelbasert reserveløsning lokalt.

Oppgave: Finn ut hva GDPR (og norsk personopplysningslov, ePrivacy/ekomloven § 3-15 om lagring i nettleseren) betyr for et slikt produkt. Bruk WebSearch/WebFetch, og prioriter primærkilder: GDPR-teksten (EUR-Lex), Datatilsynet (datatilsynet.no), EDPB-retningslinjer (bl.a. om privacy by design art. 25, og om LLM-er, f.eks. EDPB-rapporten om LLM og personvern fra 2025), Nkom om informasjonskapsler/lokal lagring, og Anthropics egne vilkår om API-data (lagringstid, om data brukes til trening, DPA, overføring til USA / EU-US Data Privacy Framework).

Dekk særlig:
1. Er gruppen/appen behandlingsansvarlig når data bare ligger lokalt, men sendes via serveren til Claude? Rollen til Anthropic (databehandler?).
2. Behandlingsgrunnlag (art. 6) og risiko for særlige kategorier (art. 9) i fritekst.
3. Informasjonsplikt (art. 13), dataminimering (art. 5), privacy by design/default (art. 25).
4. Overføring til tredjeland (kapittel V, DPF, SCC).
5. Lokal lagring i nettleser: krever det samtykke etter ekomloven § 3-15? (Hva er «strengt nødvendig»?)
6. Brukerens rettigheter: innsyn, sletting, dataportabilitet (eksport) i en app uten konto.
7. Lagringstid / arkivering (7 dager) og sletting.
8. Konkrete, testbare krav som kan bli funksjonelle eller ikke-funksjonelle krav i PRD-en (f.eks. «brukeren ser før første KI-kall hva som sendes», «knapp for å slette alle data», «mulighet for å skru av KI», «fjerne navn/personnummer før sending»).

Skriv hele funnet til filen C:\Users\Abhira\IBE160\G43-grafstrom-haugen-sivakumar\docs\prds\prd-G43-grafstrom-haugen-sivakumar-2026-11-02\research-gdpr-regelverk.md med kildeliste (URL-er), og merk tydelig hva som er usikkert eller tolkning (dette er ikke juridisk rådgivning). Returner bare et kort sammendrag (maks 25 linjer): de viktigste funnene og 8–12 kravforslag.
```

### GDPR-research: forskningsartikler (kl. 17:39)

```text
Du gjør research for en PRD (produktkravdokument) i et norsk studentprosjekt (emnet IBE160). Svar på norsk.

Produktet: dueNext, en norsk oppgaveapp (to-do) for studenter. Brukeren skriver oppgaver i fritekst, og teksten sendes til en stor språkmodell (Claude API) som foreslår etikett, prioritet og sammendrag. Ingen innlogging, data lagres lokalt i nettleseren. Brukeren godtar eller endrer KI-forslagene.

Oppgave: Finn fagfellevurderte forskningsartikler og anerkjente rapporter (bruk WebSearch/WebFetch; søk f.eks. i Google Scholar, arXiv, ACM Digital Library, SpringerLink, Semantic Scholar) om:
1. Personvern og LLM-er: hvilke risikoer det gir å sende brukertekst til en LLM-tjeneste (lekkasje, memorering, sensitiv informasjon i prompts). F.eks. studier av hva brukere avslører i chatboter/LLM-prompts.
2. Brukeres oppfatning av personvern og tillit i KI-assisterte apper, og hvordan åpenhet (transparency) og kontroll påvirker tillit — gjerne studier av studenter eller produktivitetsapper.
3. Privacy by design i praksis, og design av personvernerklæringer/samtykke som brukere faktisk forstår (f.eks. «just-in-time notices», usable privacy, dark patterns i samtykke).
4. Teknikker for dataminimering før sending til LLM (f.eks. automatisk fjerning/maskering av personopplysninger, lokale modeller, regelbasert reserveløsning).

For hver kilde: full referanse (forfattere, år, tittel, publikasjon/konferanse, DOI eller URL), 1–3 setninger om hovedfunn, og hvordan funnet kan begrunne et konkret krav eller designvalg i dueNext. Ta bare med kilder du faktisk har funnet og bekreftet at finnes — ikke dikt opp referanser. Sikt på 8–12 gode kilder.

Skriv hele funnet til filen C:\Users\Abhira\IBE160\G43-grafstrom-haugen-sivakumar\docs\prds\prd-G43-grafstrom-haugen-sivakumar-2026-11-02\research-gdpr-forskning.md. Returner bare et kort sammendrag (maks 25 linjer): de viktigste funnene og 5–8 designprinsipper/kravforslag med kildehenvisning.
```

### Anthropic: lagringstid API-data (kl. 19:23)

```text
Svar på norsk. Du gjør faktasjekk for en PRD i et norsk studentprosjekt. Appen sender oppgavetekst og notater fra en Next.js-server til Claude API (Anthropic) med en vanlig API-nøkkel fra Claude Console (kommersielle vilkår, ikke forbrukerproduktet Claude.ai). Modellen er Claude Sonnet. Brukerne er i Norge (EØS).

Spørsmål: Hvor lenge lagrer Anthropic input og output fra API-kall i dag (november 2026), og brukes de til trening?

Bruk WebSearch/WebFetch og prioriter Anthropics egne primærkilder: privacy.anthropic.com / support.anthropic.com (Privacy Center-artikler om lagringstid for API/Commercial), anthropic.com/legal/commercial-terms, anthropic.com/legal/privacy, Data Processing Addendum (DPA), trust.anthropic.com, og docs.anthropic.com/docs.claude.com (f.eks. om Zero Data Retention, Files API, prompt caching, Batch API). En tidligere research fant motstridende tall: «inntil 30 dager» i primærkilde og «7 dager» i sekundærkilder, og at noen nyere modeller («Covered Models») kan kreve lengre lagring, samt inntil 2 år ved brudd på bruksreglene. Finn ut hva som gjelder nå, med dato for når kilden sist ble oppdatert. Skill mellom standard-API, Zero Data Retention (krever avtale), og unntak (Trust & Safety-flaggede samtaler, juridiske krav). Sjekk om det har kommet endringer i 2025–2026.

Skriv funnet til C:\Users\Abhira\IBE160\G43-grafstrom-haugen-sivakumar\docs\prds\prd-G43-grafstrom-haugen-sivakumar-2026-11-02\research-anthropic-lagringstid.md med sitater og URL-er, og merk tydelig hva som er bekreftet i primærkilde og hva som er usikkert. Foreslå en kort, ærlig formulering (1–3 setninger, norsk, enkelt språk) som kan stå i samtykkedialogen og personvernerklæringen. Returner bare et kort sammendrag (maks 15 linjer).
```

### Anthropic: DPF og overføring til USA (kl. 19:23)

```text
Svar på norsk. Du gjør faktasjekk for en PRD i et norsk studentprosjekt. Appen sender oppgavetekst og notater fra en Next.js-server til Claude API (Anthropic) med en vanlig API-nøkkel. Brukerne er i Norge (EØS). Gruppen er behandlingsansvarlig, Anthropic er databehandler.

Spørsmål:
1. Er Anthropic (Anthropic PBC og/eller Anthropic Ireland Ltd.) sertifisert under EU-US Data Privacy Framework (DPF) per november 2026? Sjekk primærkilden: deltakerlisten på dataprivacyframework.gov (søk på «Anthropic»), og hva Anthropics egne dokumenter sier (anthropic.com/legal/privacy, Data Processing Addendum, trust.anthropic.com).
2. Hvilket overføringsgrunnlag bruker Anthropic for data fra EØS til USA: DPF, standardavtaler (SCC, hvilke moduler), eller begge? Hvem er avtalepart for EØS-kunder av API-et?
3. Status for DPF selv: EU-domstolens underrett avviste Latombe-saken (T-553/23) 3.9.2025 og den ble anket. Finn ut om det har kommet en avgjørelse eller andre endringer i 2025–2026, og hva Datatilsynet (Norge) sier om overføring til USA.
4. Gjelder DPF for Norge (EØS) på samme måte som for EU?

Bruk WebSearch/WebFetch og prioriter primærkilder. Skriv funnet til C:\Users\Abhira\IBE160\G43-grafstrom-haugen-sivakumar\docs\prds\prd-G43-grafstrom-haugen-sivakumar-2026-11-02\research-anthropic-dpf.md med sitater og URL-er, og merk tydelig hva som er bekreftet og hva som er usikkert (ikke juridisk rådgivning). Foreslå en kort, ærlig formulering (1–3 setninger, norsk, enkelt språk) om overføring til USA til personvernerklæringen. Returner bare et kort sammendrag (maks 15 linjer).
```

# Samsvar mellom PRD og UX-spec – dueNext

Gjennomgått 2026-11-11. Grunnlag: `prd.md` (oppdatert 2026-11-11), `EXPERIENCE.md`, `DESIGN.md` og `prd-avvik.md` i UX-mappa.

## Samlet vurdering

PRD-en følger UX-spesifikasjonen godt. Alle 24 avvik er tatt inn, og de fastsatte tekstene som PRD-en siterer, stemmer ordrett. Det som gjenstår, er hull som finnes i begge dokumentene, især rundt økter. De bør avklares før stories skrives, men ingen av dem gjør at arkitekturen bygger feil ting.

## Avvik fra prd-avvik.md

| # | Status | Merknad |
|---|---|---|
| 2 | delvis | Innholdet er med (FR-49–54, FR-19, FR-5). Men FR-54 sier at «Foreslå ny tid» bare finnes når KI «er på og svarer». Det kan appen ikke vite før kallet er gjort, og FR-53 viser en feilmelding når KI ikke svarer. Se funn under. |
| 20 | delvis | Import, advarsel og «sender ingenting til KI før teksten endres» er med (FR-43). Det er uklart hva import gjør med et samtykke som allerede er gitt på samme enhet. Se funn under. |

De andre 22 avvikene er dekket fullt ut i PRD-en.

## Motsigelser og hull

- **middels** Når vises «Foreslå ny tid» hvis KI er utilgjengelig? (PRD FR-53, FR-54 / EXPERIENCE.md § KI-planlegging) — prd-avvik #2 sier at knappen ikke finnes når KI er utilgjengelig. FR-54 sier «KI er på og svarer». EXPERIENCE.md sier at knappen vises når KI er på og oppgaven ikke er 🔒, og at «KI svarte ikke …» vises ved feil. Uten API-nøkkel (sensor) er det uklart om knappen skal vises. *Tiltak:* Skriv i FR-54 at knappen vises når KI er på og oppgaven ikke er 🔒, men skjules når serveren melder at API-nøkkel mangler. Ved andre feil vises meldingen i FR-53.
- **middels** Frist lagt til senere gir ingen øktforslag (PRD FR-13, FR-8 / EXPERIENCE.md § KI-planlegging, punkt 1 og 6) — FR-13 sier at endret frist ikke gir nye forslag. En oppgave som lagres uten frist og får frist senere, får da aldri øktforslag, med mindre teksten endres. *Tiltak:* Avgjør om første frist på en oppgave uten økter skal utløse øktforslag, og skriv det i FR-13 og EXPERIENCE.md.
- **middels** Når regnes en økt som passert? (PRD FR-21 / EXPERIENCE.md § Økters livssyklus #2 og Component Patterns → Avkrysningsring) — En økt kl. 08–10 i dag: ligger den i «I dag» eller i «Forfalt» kl. 12? Forfalt for oppgaver regnes per dag, og en avhuket økt blir værende «til dagen er slutt». *Tiltak:* Fastsett at en økt er passert når dagen er over (eller når sluttiden er passert), og skriv det i FR-21.
- **middels** Hvor økter sorteres i en liste (PRD FR-24, FR-25 / EXPERIENCE.md § Økters livssyklus #1) — Økter vises i smartlistene, men sorteringsreglene gjelder bare oppgaver (frist, prioritet, opprettet). *Tiltak:* Si i FR-24 hvordan økter sorteres, for eksempel etter starttid, og om de følger prioritet og sortering for oppgaven.
- **middels** Endre og slette en godtatt økt utenom varsler (PRD FR-21, FR-52 / EXPERIENCE.md § Økters livssyklus #2) — Begge dokumentene sier at en passert økt kan «flyttes eller slettes». Ingen FR og ingen komponent beskriver hvordan studenten sletter én økt, eller endrer tiden på en økt uten varsel. *Tiltak:* Legg til en FR om at studenten kan endre tid på og slette en enkelt godtatt økt fra oppgavedetaljen, og beskriv det i EXPERIENCE.md.
- **middels** Import og samtykke på samme enhet (PRD FR-43 / EXPERIENCE.md § Import og Flyt 7, steg 4) — I Flyt 7 svarer Sara på KI-valget i førstegangsoppsettet og importerer etterpå. FR-43 sier at KI-valget må besvares på nytt etter import. Det er uklart om importen nullstiller samtykket som nettopp ble gitt, og om importert fornavn erstatter det hun skrev i oppsettet. *Tiltak:* Skriv at import beholder samtykket på enheten (eller nullstiller det), og at fornavnet fra fila erstatter det lokale.
- **middels** Lagring som feiler mangler krav (PRD NFR-4 / EXPERIENCE.md § State Patterns → Lagring feiler) — EXPERIENCE.md krever et banner som ikke kan lukkes når nettleseren ikke lar appen lagre. Det påvirker valget i Å-5 og feilhåndteringen, men står ikke i PRD-en. *Tiltak:* Legg til en setning i NFR-4 om at appen skal oppdage og vise at lagring feiler, med henvisning til EXPERIENCE.md.
- **middels** Etikettfilter og hendelser i Kalender (PRD FR-26, FR-55 / EXPERIENCE.md § Component Patterns → Filterknapper) — Etikettfilteret gjelder også Kalender, men hendelser har ingen etikett. Det er uklart om hendelser og økter vises når «Skole» er valgt. *Tiltak:* Fastsett at hendelser alltid vises, og at økter følger etiketten til oppgaven.
- **lav** Avhuket økt (PRD FR-56 / EXPERIENCE.md § Component Patterns → Avkrysningsring) — «Avhuket økt blir værende med strek over til dagen er slutt» står ikke i PRD-en. Det er heller ikke sagt om avhukingen kan angres. *Tiltak:* Legg setningen inn i FR-56.
- **lav** Redigering av hendelser (PRD FR-44, FR-47 / EXPERIENCE.md § Hendelsesdetalj) — FR-47 forutsetter at hendelser kan endres, men ingen FR sier det rett ut. *Tiltak:* Legg til «og endre» i FR-44.
- **lav** Gruppeantall og hendelser (PRD FR-21, FR-48 / EXPERIENCE.md § Component Patterns → Gruppeoverskrift) — Antallet i «I dag» teller oppgaver og økter. Det er ikke sagt om dagens hendelser teller med. *Tiltak:* Avgjør og skriv det i EXPERIENCE.md.
- **lav** Standardtema (PRD FR-60 / DESIGN.md § Temaer) — DESIGN.md sier at Pastellblå er standard. FR-60 nevner bare at Følg systemet er standard for modus. *Tiltak:* Legg til «Pastellblå er standard» i FR-60.
- **lav** Økter mangler i F6-innledningen (PRD F6 / EXPERIENCE.md § Hva KI får) — Innledningen sier «Oppgaver og hendelser sendes». Tidspunkt for økter sendes også. *Tiltak:* Skriv «Oppgaver, hendelser og tidspunkt for økter».
- **lav** «Ett klikk unna» på mobil (PRD FR-41 / EXPERIENCE.md § Information Architecture) — På mobil står lenken nederst på siden, så studenten må rulle først. *Tiltak:* Skriv «tilgjengelig fra alle skjermbilder» eller godta formuleringen bevisst.
- **lav** Manglende FR-henvisninger i EXPERIENCE.md (EXPERIENCE.md § Hendelsesfelt, Kalender, Profil, Utseende, Prosjekter, Send hendelsestitler til KI) — De nye kravene FR-44–48, FR-55, FR-58 og FR-59–61 er ikke nevnt i EXPERIENCE.md. Henvisningene som finnes, peker riktig. *Tiltak:* Legg inn henvisninger ved neste oppdatering av EXPERIENCE.md.

## Lagt til i PRD uten støtte i UX

- **FR-44:** «Alle fire er påkrevd» (tittel, dato, start, slutt). EXPERIENCE.md sier ikke dette direkte, men det er en rimelig slutning. Det er heller ikke sagt om sluttdato for gjentakelse (FR-46) er påkrevd.
- **FR-41:** «og lenger hvis loven krever det». Står ikke i EXPERIENCE.md, men kommer fra research-fila og er ikke nytt i denne oppdateringen.
- **Suksesskriterier → Øktforslag:** minst 5 planleggingscaser i KI-testsettet er merket [ASSUMPTION]. Støttet av prd-avvik #2, men ikke av EXPERIENCE.md. Greit så lenge merket blir stående til testsettet er utvidet.
- **NFR-7:** gjentakende hendelser og økter i Forfalt er lagt til som tidsavhengige regler. Dette følger av UX-kravene og er ikke et nytt krav.

Ellers er alt nytt i PRD-en støttet av EXPERIENCE.md eller prd-avvik.md.

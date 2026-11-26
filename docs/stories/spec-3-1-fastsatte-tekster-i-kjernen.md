---
title: 'Story 3.1 (del 1): Fastsatte tekster i kjernen'
type: 'feature'
created: '2026-11-26'
status: 'done'
baseline_commit: '679c584f8d7badb5d4b34327a90caf36855fb8b3'
route: 'dispatch'
story_key: '3-1-samtykke-og-fastsatte-tekster-i-kjernen'
review_loop_iteration: 1
context:
  - '{project-root}/docs/stories/epic-3-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Samtykke, påminnelser, eksport, import og «Slett alle data» skal bruke tekstene fra EXPERIENCE.md ordrett. I dag finnes det ikke noe sted i koden som har dem, så hver komponent i spor B og C ville skrevet sine egne kopier, og kopiene ville gli fra hverandre.

**Approach:** Lag `kjerne/tekster.ts` med tekstene fra «Personvern og data – fastsatte tekster» i EXPERIENCE.md som typede konstanter, sammen med `GJELDENDE_SAMTYKKEVERSJON`. En Vitest-test leser EXPERIENCE.md og feiler hvis en tekst avviker. Dette er tekstdelen av story 3.1. `kjerne/samtykke.ts` (`kiErPå`, `kanSendes`) venter på dokumentskjemaet fra story 1.2.

## Boundaries & Constraints

**Always:**
- Tekstene står ordrett, med norske anførselstegn, tankestreker og 🔒.
- Strukturen følger tekstene: overskrift, avsnitt, punkter og knapper er egne felt. Uthevinger i markdown (`**…**`) blir egne felt (for eksempel `tittel`), ikke markdown i strengen.
- Filen er ren TypeScript uten import fra React, Next eller `lib/`, i tråd med arkitekturen.
- Alle konstanter eksporteres `as const`.
- Testen samler alle strenger rekursivt, slik at nye tekster blir sjekket uten at testen må endres.

**Never:**
- Ikke `kjerne/samtykke.ts`, `kiErPå` eller `kanSendes` (venter på 1.2).
- Ingen UI-komponenter og ingen endringer i EXPERIENCE.md.
- Ikke innholdet i personvernerklæringen (bare punktliste i EXPERIENCE.md, hører til 3.2).
- Ingen formatering av samtykkestatus («Godkjent …», hører til 3.4).
- Ingen nye pakker.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tekstene stemmer | EXPERIENCE.md og `tekster.ts` er like | `npm test` grønt | N/A |
| Avvik | Ett ord endret i en konstant eller i EXPERIENCE.md | Testen feiler og navngir den avvikende strengen | Feilmelding viser stien, for eksempel `SAMTYKKETEKST.hvemFårDet.tekst` |
| Avledet påminnelse | `oppgavePåminnelse(false)` | «Teksten og notatene sendes til KI (Claude) for å lage forslag.» | N/A |
| Avledet påminnelse | `oppgavePåminnelse(true)` (notater skal ikke sendes) | Samme setning uten « og notatene» | N/A |
| Seksjonen mangler | Overskriften «## Personvern og data – fastsatte tekster» er ikke i EXPERIENCE.md | Testen feiler med tydelig melding | N/A |

</frozen-after-approval>

## Code Map

- `docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/EXPERIENCE.md` -- linje 252–350 er kilden: demo-advarsel, samtykketekst med knapper og lenke, KI-påminnelser (oppgave, hendelse, 🔒, titler av), hjelpeteksten for «Send hendelsestitler til KI», Hva sendes til KI, Lagring med den alternative FR-42-linjen, eksportadvarsel, importdialog med knapper og suksess- og feiltekst, og Slett alle data-dialog med knapper. Skal bare leses.
- `kjerne/` -- tom bortsett fra `.gitkeep`. `tekster.ts` blir første fil.
- `tests/kjerne/` -- tom. Vitest henter `tests/kjerne/**/*.test.ts` (`vitest.config.mts`), og `@/` peker på prosjektroten.
- `vitest.config.mts` -- `passWithNoTests: true` kan fjernes når testen finnes (utsatt punkt fra 1.1). E2e har allerede `tests/e2e/forside.spec.ts`, så `--pass-with-no-tests` i `test:e2e` kan også fjernes.
- Arkitekturen sier at `GJELDENDE_SAMTYKKEVERSJON` ligger i `tekster.ts` sammen med tekstene. `samtykke.ts` importerer den derfra senere.

## Tasks & Acceptance

**Execution:**
- [x] `kjerne/tekster.ts` -- lag `GJELDENDE_SAMTYKKEVERSJON = 1` og konstantene `DEMO_ADVARSEL`, `SAMTYKKETEKST`, `LÅS_VALG` (`oppgave`: «🔒 Ikke send til KI», `hendelse`: «🔒 Skjul tittel for KI»), `KI_PÅMINNELSER`, `PERSONVERN_VALG` (etikettene «KI-forslag», «Send aldri notater til KI», «Send hendelsestitler til KI» med hjelpeteksten, overskriftene «Hva sendes til KI» og «Lagring», etikettene «Samtykkestatus», «Eksporter», «Importer» og «Slett alle data», og lenketeksten «Personvernerklæring»), `HVA_SENDES_TIL_KI` (med `navnelinje` og `navnelinjeFR42`), `LAGRING`, `EKSPORT_ADVARSEL`, `IMPORT_DIALOG` og `SLETT_ALLE_DATA_DIALOG`, pluss `oppgavePåminnelse(utenNotater: boolean)`. Ingen tekst står to ganger -- én kilde for alle fastsatte tekster.
- [x] `tests/kjerne/tekster.test.ts` -- skriv en ren sjekkfunksjon `finnAvvik(markdown)` som returnerer `{ sti, tekst }` for hver avvikende streng, etter reglene i Design Notes. Kjør den mot den ekte EXPERIENCE.md (forventet: tom liste) og mot doktorert markdown der ett ord er endret, en setning er fjernet og en setning er lagt til (forventet: avvik med riktig sti). Test `oppgavePåminnelse` for begge verdier. Test at en SHA-256 av `JSON.stringify(SAMTYKKETEKST)` er lik hashen som står i testen for `GJELDENDE_SAMTYKKEVERSJON`, med feilmelding om å øke versjonen og oppdatere hashen -- oppdager avvik i begge retninger og glemt versjonsøkning.
- [x] `vitest.config.mts`, `package.json` -- fjern `passWithNoTests` og `--pass-with-no-tests` -- så en feil glob ikke gir grønt.

**Acceptance Criteria:**
- Gitt `kjerne/tekster.ts`, når en komponent trenger en fastsatt tekst, så kan den importere den fra `@/kjerne/tekster` uten å skrive teksten selv.
- Gitt alle tekstene AC-en i 3.1 nevner (demo-advarsel, samtykketekst, KI-påminnelser, Hva sendes til KI, Lagring, eksportadvarsel, import- og Slett alle data-dialog), når testen kjøres, så er hver av dem dekket.
- Gitt en konstant som er avkortet, mangler et felt, har byttet om to felt (for eksempel `knapper.nei` og `knapper.ja`), eller en kort etikett som bare stemmer et annet sted i seksjonen, når testen kjøres, så feiler den og navngir stien.
- Gitt `npm test`, `npm run lint` og `npm run typecheck`, når de kjøres, så går de uten feil.

## Implementation Notes

- `SAMTYKKETEKST.duBestemmer` har `tittel` og `deler`: en rekke med strenger og `{ uthevet: LÅS_VALG.… }`, vist med mellomrom mellom. Slik står låsetikettene bare i `LÅS_VALG`.
- «Avbryt» er én ikke-eksportert konstant som begge dialogene viser til. «KI ser bare at du er opptatt.» er `KI_PÅMINNELSER.hendelseLåst` og brukes også når hendelsestitler er av.
- `finnAvvik(markdown, konstanter = tekster)` ligger i testfila. Blokkfelt sammenlignes parvis med sitt eget segment i sitatblokken (linje, punkt, ✓/✕, utheving, knapp eller lenke), med type, og første avvik meldes. Hver enhet-sti er knyttet til én bestemt enhet (etter etiketten foran, plassen i «Knapper: *A* / *B*» eller listepunktet). Konstantene sammenlignes rått; bare EXPERIENCE.md-siden normaliseres. En streng uten regel, en enhet-sti som mangler i koden og en deltekst som står to ganger gir avvik eller feil. «Importer» er én ikke-eksportert konstant som `PERSONVERN_VALG.importer` og importknappen viser til.

## Spec Change Log

- **Runde 1 (review_loop_iteration 1).** Utløst av: alle tre gjennomgangene fant at `seksjon.includes(tekst)` mot hele seksjonen slipper gjennom avkortede tekster, manglende felt, ombyttede felt og korte etiketter som «Avbryt»/«Importer» som stemmer andre steder, og at tekst lagt til i EXPERIENCE.md ikke oppdages. Også: etikettene i Personvern og data manglet (komponentene ville skrevet dem selv), låsvalgene sto dobbelt under `SAMTYKKETEKST.duBestemmer`, versjonen var ikke knyttet til samtykketeksten, og raden «Avvik» i matrisen hadde ingen test. Endret: Tasks, AC og Design Notes (sjekk per deltekst og per enhet, `finnAvvik` med negative tester, hash for samtykkeversjon, `LÅS_VALG`, `PERSONVERN_VALG` i stedet for `HENDELSESTITLER_HJELPETEKST`). Unngår: grønn test med feil samtykketekst i UI. KEEP: tekstinnholdet og feltnavnene i forrige `kjerne/tekster.ts` var ordrett riktige (`DEMO_ADVARSEL`, `SAMTYKKETEKST` med `overskrift`, `innledning`, `hvaSendes`, `navnSendesAldri`, `hvemFårDet`, `hvorLenge`, `duBestemmer`, `utenKi`, `lenke`, `knapper.nei/ja`; `KI_PÅMINNELSER` med `oppgave`, `hendelse.tekst/advarsel`, `oppgaveLåst`, `hendelseLåst`; dialogene med `tittel`, `tekst`, `knapper`, `suksess`, `feil`). `hentSeksjon` med tydelig feil når overskriften mangler, og fjerningen av `passWithNoTests`, var bra og skal beholdes.

## Review Triage Log

| Funn | Verdikt | Begrunnelse |
|---|---|---|
| Substring mot hele seksjonen slipper gjennom avkorting, sletting, ombytting og korte etiketter (alle tre) | medium | Bekreftet: `hvorLenge.tekst` uten siste setning og ombyttet `knapper.nei/ja` er fortsatt delstrenger. → bad_spec |
| Tekst lagt til i EXPERIENCE.md oppdages ikke | medium | Bekreftet, sjekken går bare én vei. → bad_spec |
| Etikettene i Personvern og data og lenketeksten mangler | medium | Bekreftet, står i seksjonen men ikke i koden; 3.4 ville skrevet dem selv. → bad_spec |
| Versjonen er ikke knyttet til samtykketeksten | medium | Bekreftet, glemt økning gjør gamle samtykker gyldige for ny tekst. → bad_spec |
| Raden «Avvik» i matrisen har ingen test | medium | Bekreftet, bare manuell sjekk. → bad_spec |
| `oppgaveValg`/`hendelseValg` står dobbelt | low | Bekreftet, skjemaene trenger låsetikettene utenfor samtykket. → bad_spec |
| Første test lister eksportnavn | false | Ny konstant gir en tydelig feil, ikke en stille glipp. |
| `replace` i `oppgavePåminnelse` kan stille gjøre ingenting | false | Testen sammenligner med den eksakte setningen. |
| Rette anførselstegn i «"Avtale"» | false | Ordrett fra EXPERIENCE.md, som specen krever. |
| Importregler og varselfarge mangler i `tekster.ts` | false | Oppførsel og utseende, ikke tekst som vises. |
| Specen er usporet, status ulik i spec og sprint-status | false | Committes i trinn 5; sprint-status settes til review der. |
| `deferred-work.md` lister fortsatt `passWithNoTests` | low | Avvist: eksisterende oppføringer skal ikke endres. |
| ENOENT ved flyttet EXPERIENCE.md | false | Feilen fra `readFileSync` viser stien. |
| `## ` i kodeblokk avkorter seksjonen | low | Avvist: seksjonen har ingen kodeblokker. |
| Ulik Unicode-normalisering (NFD) | low | Avvist: ingen tegn på at det skjer. |
| Eksport som ikke er streng hoppes over | false | Navnelisten fanger nye konstanter. |
| Runde 2: enhet-felt kan byttes om, settes til en annen enhet i samme deltekst eller slettes uten feil (alle tre) | medium | Bekreftet av gjennomgangen ved kjøring: ombyttet `suksess`/`feil`, `oppgaveLåst`/`hendelseLåst`, Slett-knappene og `kiForslag = "Samtykkestatus"` gir `[]`. Bryter AC om ombyttede felt. → patch (bare testen) |
| Runde 2: ord kan flyttes over feltgrenser i blokker, f.eks. fra ✓ til ✕ i Hva sendes til KI, og uthevingen i `duBestemmer` sjekkes ikke | medium | Bekreftet ved kjøring: flytting av «Oppgaver merket 🔒» til `sendes` gir `[]`. → patch (bare testen) |
| Runde 2: etikettene Samtykkestatus, Eksporter, Importer og Slett alle data mangler i `PERSONVERN_VALG` | low | Bekreftet; samme begrunnelse som runde 1, og specen listet dem ikke. Tasks utvidet, lagt til som patch. |
| Runde 2: negative tester bruker `toContain` | low | Bekreftet, ekstra stier slipper gjennom. → patch |
| Runde 2: konstantene normaliseres som markdown, så `*` eller doble mellomrom i koden oppdages ikke | low | Bekreftet. → patch |
| Runde 2: to deltekster med samme navn overskriver hverandre | low | Bekreftet i `delSeksjon`; én linje å fikse. → patch |
| Runde 2: ny «…»-enhet i EXPERIENCE.md i enhet-deltekster oppdages ikke | medium | Bekreftet ved kjøring. Krever liste over hva som ikke er UI-tekst. → defer |
| Runde 2: hashen bruker nøkkelnavn og tar ikke med demo-advarselen | low | Avvist: et nytt nøkkelnavn gir en høylytt feil, og arkitekturen knytter versjonen til samtykketeksten. |
| Runde 2: `replace` i `oppgavePåminnelse` | false | carried: testen sammenligner med eksakt setning. |
| Runde 2: ingen eksportert type for `deler` | low | Avvist: typen avledes av `as const`, og 3.3 kan smalne med `typeof`. |
| Runde 2: `sjekkBlokk` stopper ved første avvik | low | Avvist: bare flere kjøringer ved flere feil. |
| Runde 2: diffen mangler status- og specfiler | false | carried: committes i trinn 5. |
| Runde 2: eksport som ikke er streng hoppes over | false | carried: navnelisten fanger nye eksporter. |
| Runde 2: «Send hendelsestitler til KI» står også inne i `sendes[1]` | false | Del av en ordrett setning, ikke en egen tekst. |

## Design Notes

Tekstene er strukturerte i koden og markdown i EXPERIENCE.md. Normalisering (fjern `>`, `**`, `*`, punkttegn, `[ ]`, slå sammen mellomrom) gjør dem sammenlignbare.

Regler for `finnAvvik`:
- Seksjonen deles i deltekster etter linjene som bare er uthevet (`**Demo-advarsel (FR-65)**`, `**Lagring**` osv.). Testen har en tabell som knytter hver konstant til sin deltekst.
- Har deltekstene en sitatblokk (`>`), skal den normaliserte blokken være lik konstantens blokkfelt slått sammen med mellomrom i rekkefølge. Det fanger avkorting, sletting, tillegg og ombytting.
- Strenger utenfor sitatblokker (påminnelser, knapper, suksess og feil, etiketter, `navnelinjeFR42`) skal være lik én hel enhet i sin deltekst: et «…»-sitat, en `*…*`-knapp eller en `**…**`-etikett. Ikke delstreng.
- `LÅS_VALG` sjekkes som enheter i samtykketeksten. `oppgavePåminnelse(true)` står ikke i EXPERIENCE.md og testes for seg.

```ts
export const DEMO_ADVARSEL = {
  tittel: "Dette er en demo.",
  tekst: "Bruk bare test- eller fiktive data, og skriv ikke inn ekte personopplysninger. Når KI er på, kan teksten du skriver, sendes til Claude (Anthropic) i USA.",
} as const;
```

## Verification

**Commands:**
- `npm test` -- forventet: tekstene stemmer, alle tester grønne
- `npm run lint` -- forventet: ingen feil
- `npm run typecheck` -- forventet: ingen feil

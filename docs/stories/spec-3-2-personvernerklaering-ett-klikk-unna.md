---
title: 'Story 3.2: Personvernerklæring ett klikk unna'
type: 'feature'
created: '2026-11-28'
status: 'done'
baseline_commit: '8e4b89b69a81b0e459be69b85bb511c90f69906d'
route: 'dispatch'
story_key: '3-2-personvernerklæring-ett-klikk-unna'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-3-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen har ingen personvernerklæring. Studenten kan ikke lese hva som skjer med dataene, og FR-41 krever at erklæringen ligger ett klikk unna fra alle skjermbilder.

**Approach:** En ny side `/personvernerklaering` med erklæringen på norsk, og lenken «Personvernerklæring» i rammen: nederst på hver side på mobil og nederst i sidemenyen på PC.

## Boundaries & Constraints

**Always:** Erklæringen sier alt i FR-41: demo bare for test- eller fiktive data, og gruppen lagrer ingen data; Anthropic behandler det som sendes i USA, sletter normalt innen 30 dager, men kan lagre flaggede forespørsler i inntil 2 år; hvilke data som sendes; at formålet også er planlegging av økter; ingen automatiske avgjørelser, fordi studenten godtar alt selv; reserveløsningen sender ingenting; aldersgrense 13 år; fornavn, tema og samtykke lagres bare i nettleseren; det som er sendt, kan ikke slettes fra appen. Fakta som alt står i `kjerne/tekster.ts` (`DEMO_ADVARSEL`, `HVA_SENDES_TIL_KI`, `LAGRING`, `PERSONVERN_VALG.personvernerklæring`) importeres derfra og skrives aldri på nytt. Lenken er `privacy-link`: `text-meta`, `text-muted`, understreket, trykkflate ≥ 44 px, `aria-current="page"` på erklæringen. Lenken og dempet tekst står aldri i glødsonen. Saklig tone uten emoji. WCAG 2.1 AA.

**Beslutning (Lena, 2026-11-28):** Ordlyden er ikke fastsatt i EXPERIENCE.md. Teksten skrives i siden etter punktene i FR-41, gjenbruker de fastsatte tekstene, og godkjennes av Lena i gjennomgangen. Den legges ikke i `kjerne/tekster.ts` eller EXPERIENCE.md.

**Never:** Nevner ikke behandlingsansvarlig eller SCC (NFR-11). Ingen omdirigering til `/oppstart` og ingen samtykkelogikk (3.3). Ingen «Personvern og data»-lenke eller -side (3.4). Ingen nye felt i dokumentet.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Mobil | `/`, `/arkiv`, `/innstillinger`, `/personvernerklaering` under 768 px | Lenken står nederst i innholdet, over bunnmenyen, ikke på gløden | N/A |
| PC | Samme ruter fra 768 px | Lenken står nederst i sidemenyen under Innstillinger; ingen lenke nederst i innholdet | N/A |
| Kort side | `/arkiv` (lite innhold) | Lenken står likevel nederst på siden, under glødsonen | N/A |
| Åpne | Klikk på lenken | `/personvernerklaering` med `<h1>` «Personvernerklæring», tittel «Personvernerklæring – dueNext» | N/A |
| Feilside | Data kan ikke leses | Ingen lenke (feilsiden erstatter rammen, som i 1.3) | N/A |

</frozen-after-approval>

## Code Map

- `components/ramme.tsx` -- `Ramme`: sidemenyen har `mt-auto`-blokk med Innstillinger (linje ~76); `<main>` er `flex-1` med `pb-24` for bunnmenyen. Lenken legges her, så alle sider får den.
- `kjerne/tekster.ts` -- `PERSONVERN_VALG.personvernerklæring` (lenketekst), `DEMO_ADVARSEL`, `HVA_SENDES_TIL_KI` (`sendes`, `sendesIkke`, `navnelinje`), `LAGRING`, `SAMTYKKETEKST.hvorLenge`. Ikke endre.
- `app/arkiv/page.tsx` -- mønster for en serverside med `metadata` og `<h1 className="text-greeting">`.
- `components/innstillinger.tsx` -- `Seksjon`: `section-label` i `text-on-glow` og kortflate `bg-surface-raised`; samme mønster for avsnittene i erklæringen.
- `tests/e2e/ramme.spec.ts` -- teller lenker i `nav, header` (3 på mobil), og løkka over ruter sjekker glød, at første `p/h2` i `main` er `text-on-glow`, og axe. Utvid løkka med erklæringen.
- `docs/ux-designs/…/mockups/key-personvern.html` -- `.plink` (sentrert, 13 px, understreket) og `.side .small` i sidemenyen.

## Tasks & Acceptance

**Execution:**
- [x] `app/personvernerklaering/page.tsx` -- serverside med `metadata` og erklæringen i avsnitt med `<h2>` -- FR-41
- [x] `components/ramme.tsx` -- `PersonvernLenke`; i sidemenyen under Innstillinger, og på mobil sist i `<main>` med `mt-auto` (`<main>` blir `flex flex-col`) og `md:hidden` -- én plassering for alle sider
- [x] `tests/e2e/personvernerklaering.spec.ts` -- lenken på alle fire ruter i begge prosjekter, plassering (under glødsonen på mobil, under Innstillinger på PC), trykkflate ≥ 44 px, klikk åpner siden, `aria-current`, at teksten nevner 30 dager, 2 år, USA, 13 år og ikke «behandlingsansvarlig»/«SCC»
- [x] `tests/e2e/ramme.spec.ts` -- legg `/personvernerklaering` til i løkka over ruter

**Acceptance Criteria:**
- Given erklæringen, when den leses med skjermleser, then er hver del en overskrift, og lenken har navnet «Personvernerklæring»
- Given alle ruter i begge bredder, when axe kjøres, then er det ingen brudd

## Implementation Notes

- Implementert direkte i hovedsesjonen (ingen implementeringsagent).
- `<main>` fikk `<div>{children}</div>` rundt innholdet, så sidene beholder blokkoppsettet sitt i flex-kolonnen; mellomrommet over lenken er `mb-8` på innholdet (ikke `pt-8` på lenken, som ville gjort trykkflaten tom over teksten).
- Glødkolonnen fikk `min-h-dvh`, ellers er den bare så høy som innholdet på mobil, og `mt-auto` virker ikke.
- Tekst som går utover FR-41, til Lenas gjennomgang: «Appen har ingen innlogging og ingen egen database», «Før appen kan brukes med ekte data, må personvernet vurderes på nytt …», og at formålet også er en ny tid når en økt kolliderer (fra `SAMTYKKETEKST.innledning`). «Anthropic kan også lagre data lenger hvis loven krever det» står i FR-41 i PRD-en.
- `npm test`: 346/347, den kjente CRLF-feilen i `tekster.test.ts`. Vitest kjører nå på Lenas maskin.

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Evidens / rute |
|---|---|---|---|---|
| 1 | blind, edge, gap | `LAGRING` importeres ikke; lagringsavsnittet er skrevet for hånd | medium | Avvik fra Always-regelen → patch (`LAGRING.tekst` i «Hva appen lagrer») |
| 2 | blind | Lagringsavsnittet motsier KI-avsnittet | low | Samme rot som 1; løst av patchen |
| 3 | blind, gap | «lenger hvis loven krever det» har ingen kilde | false | Står i FR-41 i PRD-en |
| 4 | blind | Formålssetningen mangler «ny tid hvis en økt kolliderer» | low | Direkte retting → patch |
| 5 | blind | Tekst utover FR-41 er ikke merket for gjennomgang | low | Listet i Implementation Notes for Lena |
| 6 | blind | Mangler dato, hvor KI slås av og hvordan data slettes | low | Personvern og data finnes ikke før 3.4 → defer |
| 7 | blind | «usa»-sjekken består via demo-advarselen | low | Direkte retting → patch («dataene behandles i usa») |
| 8 | blind | Testen skriver tekster selv og sjekker ikke «sendes ikke»/navnelinja | low | Direkte retting → patch (importerer `HVA_SENDES_TIL_KI`) |
| 9 | blind | Glødgrensen 340 px er hardkodet | low | Heuristikk, kortsidetesten dekker risikoen → avvist |
| 10 | blind | Alle `<h2>` bruker `text-on-glow` | false | Samme mønster som `Seksjon` i Innstillinger; mørkere enn `text-muted`, så kontrasten er høyere |
| 11 | blind | PC-lenken står under Innstillinger, ikke «Personvern og data» | low | Avtalt i specen; 3.4 må flytte «Personvern og data» inn over → defer |
| 12 | blind | Unntaket for `/oppstart` står bare i tekst | low | Hører til 3.3 → defer |
| 13 | blind | Spec og sprint-status har ulik status | false | Sprint-status settes til `review` når storyen leveres |
| 14 | blind, edge | `navnelinje` byttes ikke når FR-42 bygges | low | Gjelder alle brukssteder; søk på `navnelinje` finner dem → avvist |
| 15 | edge | Feilsiden skjuler erklæringen | low | Unntatt i intent-matrisen (raden Feilside) → defer |
| 16 | edge | Ingen lenke mens appen laster | low | Varer et øyeblikk → avvist |
| 17 | edge | Sidemenyen kan flyte over ved svært lav høyde | low | Trenger under ca. 300 px høyde → avvist |
| 18 | edge | Like React-nøkler i punktlistene | false | Listene er faste konstanter uten like punkter |
| 19 | edge | Testen «lenken er sist» sjekker ikke rekkefølgen | low | Direkte retting → patch (`lastElementChild`) |
| 20 | gap | axe sjekker ikke kontrasten på mobillenken (gradient gir `incomplete`) | medium | Ekte hull i verifiseringen → defer |

## Design Notes

Erklæringen har korte deler med `<h2>`: Dette er en demo · Hva appen lagrer · Når KI er på (formål: forslag og planlegging av økter; hva som sendes fra `HVA_SENDES_TIL_KI`) · Hvem får det og hvor lenge (USA, 30 dager / 2 år, kan ikke slettes fra appen) · Du bestemmer (ingen automatiske avgjørelser; reserveløsningen sender ingenting) · Aldersgrense.

Lenken står sist i `<main>` med `mt-auto`, ikke rett under innholdet: på korte sider som Arkiv ville den ellers havnet på gløden, der `text-muted` er for svak (DESIGN.md). `<main>` er `flex-1` i en kolonne på minst `100dvh`, så `mt-auto` legger lenken nederst. På PC går lenken under Innstillinger; 3.4 legger «Personvern og data» mellom dem.

Omdirigeringen til `/oppstart` i 3.3 må unnta `/personvernerklaering`.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm run build` -- expected: ingen feil
- `npx playwright test --workers=1` -- expected: alle grønne

**Manual checks (if no CLI):**
- Mobil og PC, lys og mørk modus: lenken er lesbar og står ikke på gløden.

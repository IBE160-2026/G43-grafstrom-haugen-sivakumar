# Kvalitetsgjennomgang av PRD – dueNext

Gjennomgått mot BMADs PRD-sjekkliste, 2026-11-02.

## Samlet vurdering

PRD-en er klar til arkitektur og stories. Kravene er konkrete, nummerert og sporbare til briefen, og personvernkravene er begrunnet i egen research. Det som gjenstår, er små presiseringer og åpne spørsmål som hører hjemme i arkitekturen.

## Beslutningsklarhet – sterk

Beslutninger står som beslutninger (for eksempel FR-5 «aldri KI» for frist, faste etiketter med prosjekt som fritekst). De åpne spørsmålene er reelle og har en eier.

## Innhold fremfor pynt – god

Ingen personas eller generiske NFR-er. NFR-ene er knyttet til konkrete behov i emnet (sensor kan kjøre appen, testbarhet uten KI).

### Funn
- **lav** Motmålet om samtykkedialogen er vanskelig å måle (§ Suksesskriterier). *Tiltak:* Spør testbrukerne etter brukertesten om de forsto hva som sendes. Tas med i testplanen.

## Strategisk sammenheng – sterk

Kjernen er «KI der teksten må tolkes, regler der svaret er forutsigbart, studenten bestemmer». F2, F3 og F4 følger dette direkte.

## Klarhet om når et krav er ferdig – god

### Funn
- **middels** FR-16 sier ikke hvilke nøkkelord reserveløsningen bruker. *Tiltak:* Nøkkelordlisten lages i arkitekturen eller storyen, og testes mot KI-testsettet.
- **lav** FR-30 sier ikke hva som skjer med 7-dagersfristen når en oppgave fullføres, gjenåpnes og fullføres igjen. *Tiltak:* Fristen regnes fra siste fullføring. Rettet i PRD-en.

## Omfang – sterk

«Må» og «Bør» er markert i F6. Utenfor scope er tydelig.

## Brukerreiser – ikke brukt

Gruppen valgte funksjoner først. Hvordan forslagene vises og endres, bør skisseres i UX-steget (anbefalt i tilbakemeldingen fra faglærer).

## Mekaniske notater

- FR-1 til FR-43 og NFR-1 til NFR-8 er sammenhengende.
- Begrepene er brukt likt i hele dokumentet (Fullført, Ingen frist, Privat/Skole/Jobb).
- Lenker til brief, tilbakemelding, testsett og research er kontrollert.

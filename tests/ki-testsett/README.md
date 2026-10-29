# KI-testsett

Fast testsett for å måle KI-forslagene i dueNext mot suksesskriteriene i [product brief](../../docs/product-brief.md). Settet har 20 oppgavetekster: 10 studieoppgaver og 10 hverdagsoppgaver.

## Format

`testsett.json` inneholder en `referansedato` og en liste med `oppgaver`. Hver oppgave har:

| Felt | Innhold |
|---|---|
| `id` | Løpenummer 1–20 |
| `type` | `studie` eller `hverdag` |
| `tekst` | Oppgaveteksten slik brukeren skriver den |
| `forfallsdato` | Forfallsdato (`ÅÅÅÅ-MM-DD`) |
| `forventet.etikett` | `Skole`, `Gruppearbeid` eller `Privat` |
| `forventet.prioritet` | `Lav`, `Middels` eller `Høy` |
| `forventet.sammendrag` | Eksempel på et godt sammendrag |
| `forventet.tidsrom` | `I dag`, `Denne uken` eller `Senere` |

## Slik vurderes svarene

- **Etikett og prioritet** kommer fra Claude og sammenlignes med forventet verdi. Målet er minst 16 av 20 riktige etiketter og minst 14 av 20 riktige prioriteringer.
- **Sammendrag** er fritekst og kan ikke sammenlignes ord for ord. Vurder om Claudes sammendrag er kort, på norsk og sier det samme som eksempelet.
- **Tidsrom** beregnes av regler, ikke av KI. Beregningen bruker `referansedato` som «i dag», slik at resultatet blir det samme uansett når testen kjøres. Referansedatoen 2026-11-02 er en mandag, så «Denne uken» gjelder til og med søndag 2026-11-08. Tidsrom skal stemme 20 av 20.

Kjør testsettet på nytt hver gang prompten endres, og noter resultatet, slik at endringer kan sammenlignes.

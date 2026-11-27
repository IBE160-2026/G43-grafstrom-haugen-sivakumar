# KI-testsett

Fast testsett for å måle KI-forslagene i dueNext mot suksesskriteriene i [product brief](../../docs/product-brief.md). Settet har 20 oppgavetekster: 8 studieoppgaver (to av dem gruppearbeid), 5 jobboppgaver og 7 hverdagsoppgaver.

## Format

`testsett.json` inneholder en `referansedato` og en liste med `oppgaver`. Hver oppgave har:

| Felt | Innhold |
|---|---|
| `id` | Løpenummer 1–20 |
| `type` | `studie`, `jobb` eller `hverdag` |
| `tekst` | Oppgaveteksten slik brukeren skriver den |
| `forfallsdato` | Forfallsdato (`ÅÅÅÅ-MM-DD`), eller `null` hvis oppgaven ikke har frist |
| `forventet.etikett` | `Privat`, `Skole` eller `Jobb`. Gruppearbeid i studiet er `Skole` |
| `forventet.prioritet` | `Lav`, `Middels` eller `Høy` |
| `forventet.sammendrag` | Eksempel på et godt sammendrag |
| `forventet.tidsrom` | `Forfalt`, `I dag`, `Denne uken`, `Senere` eller `Ingen frist` (de fem smarte listene) |

## Slik vurderes svarene

- **Etikett og prioritet** kommer fra Claude og sammenlignes med forventet verdi. Målet er minst 16 av 20 riktige etiketter og minst 14 av 20 riktige prioriteringer.
- **Sammendrag** er fritekst og kan ikke sammenlignes ord for ord. Vurder om Claudes sammendrag er kort, på norsk og sier det samme som eksempelet.
- **Tidsrom** beregnes av regler, ikke av KI. Beregningen bruker `referansedato` som «i dag», slik at resultatet blir det samme uansett når testen kjøres. Referansedatoen 2026-11-02 er en mandag. Det gir disse tidsrommene:

  | Tidsrom | Forfallsdato |
  |---|---|
  | Forfalt | før 2026-11-02 |
  | I dag | 2026-11-02 |
  | Denne uken | 2026-11-03 til og med 2026-11-08 |
  | Senere | etter 2026-11-08 |
  | Ingen frist | ingen forfallsdato (`null`) |

  Tidsrom skal stemme 20 av 20.

Kjør testsettet på nytt hver gang prompten endres, og noter resultatet, slik at endringer kan sammenlignes.

## Reserveløsningen

Reserveløsningen i `kjerne/reserve.ts` foreslår etikett og prioritet ut fra nøkkelord når KI ikke svarer (FR-16–18). Nøkkelordlista er generell og ikke tilpasset testtekstene. Resultatet er en referanse for story 4.8, ikke et krav. `tests/kjerne/reserve.test.ts` kjører de 20 tekstene og skriver resultatet til konsollen.

| Dato | Riktige etiketter | Riktige prioriteringer |
|---|---|---|
| 2026-11-27 | 19 av 20 | 15 av 20 |

Bommene 2026-11-27: etiketten på oppgave 6 («kontinuasjonseksamen» starter ikke med «eksamen»), og prioriteten på oppgave 5, 8 og 11 (Middels i stedet for Lav), 6 (Høy for «fristen» i stedet for Middels) og 15 (Høy for «i kveld» i stedet for Middels).

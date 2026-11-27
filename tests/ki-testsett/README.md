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

## Planleggingscaser

`planleggingscaser.json` er et fast grunnlag for å måle øktforslagene (story 6.4, 6.5 og 4.8). Casene ligger i en egen fil fordi de har en annen form enn oppgavene: hendelser, godtatte økter og «nå» med klokkeslett. Alle datoer ligger i uka 2026-11-02–08 (mandag–søndag), og ukestarten er den samme som `referansedato` i `testsett.json`. `planleggingscaser.test.ts` sjekker form og dekning, men ikke FR-49. Den sjekken hører til `kjerne/` (story 6.4).

### Format

Toppnivået har `beskrivelse`, `referansedato`, `forventet` og en liste med `caser`. Hver case har:

| Felt | Innhold |
|---|---|
| `id` | Løpenummer fra 1 |
| `beskrivelse` | Hva casen tester |
| `nå` | Fast «nå» (`ÅÅÅÅ-MM-DDTHH:mm`, lokal tid uten sone) |
| `oppgave.tekst` | Oppgaveteksten slik brukeren skriver den |
| `oppgave.frist` | Fristdagen (`ÅÅÅÅ-MM-DD`), aldri før dagen for «nå» |
| `hendelser` | Liste med `tittel`, `dato`, `start`, `slutt` (`HH:mm`) og `skjulTittelForKi`, samme navn og former som `hendelseSkjema`. Slutt før start betyr at hendelsen slutter neste dag (FR-45) |
| `godtatteØkter` | Økter som allerede er godtatt for andre oppgaver, med `dato`, `start` og `slutt` |
| `sendHendelsestitler` | Om bryteren «Send hendelsestitler til KI» er på. Når den er av, sendes ingen titler, men alle tider |

### Forventet resultat

For hver case er forventet resultat: **minst én økt, og alle økter holder FR-49**. Svaret sjekkes med regler, ikke for hånd. FR-49 sier at forslagene må holde disse grensene:

- 1–5 økter per oppgave
- hver økt varer fra 30 minutter til 3 timer, og ligger mellom kl. 07:00 og 23:00
- ingen økt i fortiden eller etter fristdagen
- ingen overlapp med hendelser eller andre godtatte økter
- ingen økt de første 8 timene etter en hendelse som slutter neste dag (for eksempel en nattevakt). Regelen bruker bare klokkeslett, så den virker også når titlene ikke sendes (FR-58)

### Casene

| Case | «Nå» | Frist | Tester | Eksempel på gyldig økt |
|---|---|---|---|---|
| 1 | man. 02.11 08:00 | fre. 06.11 | Vanlig uke med forelesning, vakt, trening og én godtatt økt fra en annen oppgave (tir. 14:00–16:00) | man. 13:00–15:00 |
| 2 | man. 02.11 12:00 | fre. 06.11 | To nattevakter 21:00–07:30 (tir.–ons. og tor.–fre.). Ingen økt før 15:30 dagen etter | man. 14:00–16:00 |
| 3 | tir. 03.11 09:00 | tor. 05.11 | «Legetime» med 🔒 (`skjulTittelForKi: true`). KI får bare vite at hun er opptatt ons. 10:00–10:45 | tir. 09:30–11:30 |
| 4 | ons. 04.11 07:00 | søn. 08.11 | `sendHendelsestitler: false` og nattevakt tor.–fre. 21:00–07:30. Ingen titler sendes, alle tider sendes, og nattevaktregelen må virke uten titler. Én godtatt økt tor. 09:00–11:00 | ons. 09:00–11:00 |
| 5 | man. 02.11 19:00 | tir. 03.11 | Frist i morgen. Bare korte hull (høyst 75 min) mellom hendelsene | tir. 07:00–08:00 |
| 6 | fre. 06.11 10:00 | fre. 06.11 | Frist i dag. Ingen økt før «nå» eller etter 23:00. Én godtatt økt 13:00–14:30 | fre. 10:30–11:30 |

Eksempeløktene viser at hver case kan få minst én økt som holder FR-49.

### Mock-svar med økter

Mappa `mock/` har to faste svar til Epic 6. De har formen `{ "planleggingscase": <id>, "svar": { "felt": {...}, "økter": [...] } }`. `svar` er det Claude ville returnert: `felt` med rene verdier (`etikett`, `prioritet`, `sammendrag`) og `økter` uten `id`. `type`, `forkastet` og `kilde` legges til av serveren og appen. Story 4.1 låser den endelige formen. Avviker den, justeres disse to filene.

Begge er kontrollert for hånd mot FR-49 (2026-11-27):

**`okter-gyldig.json` → case 1.** Alle tre øktene holder FR-49.

| Økt | Varighet | Kontroll |
|---|---|---|
| man. 02.11 13:00–15:00 | 2 t | Etter «nå» (08:00), etter forelesningen (10:15–12:00) |
| ons. 04.11 09:00–11:30 | 2 t 30 min | Før vakten (16:00–21:00) |
| tor. 05.11 14:00–16:00 | 2 t | Før treningen (18:00–19:30) |

3 økter, alle 30 min–3 t, innenfor 07–23, før fristdagen, ingen overlapp med hendelser, med den godtatte økta (tir. 14:00–16:00) eller med hverandre. Casen har ingen hendelser over midnatt.

**`okter-bryter-fr49.json` → case 2.** Nøyaktig én økt bryter FR-49.

| Økt | Varighet | Kontroll |
|---|---|---|
| man. 02.11 14:00–16:00 | 2 t | Holder FR-49 (etter «nå» 12:00) |
| ons. 04.11 09:00–11:00 | 2 t | **Bryter** 8-timersregelen: nattevakta tir. 21:00 slutter ons. 07:30, så første lovlige start er 15:30 |
| tor. 05.11 10:00–12:00 | 2 t | Holder FR-49 (mer enn 8 t etter forrige nattevakt, før neste starter 21:00) |

Story 6.4 skal forkaste onsdagsøkta og beholde de to andre.

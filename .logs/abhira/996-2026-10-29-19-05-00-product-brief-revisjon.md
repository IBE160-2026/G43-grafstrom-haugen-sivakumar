# Product brief-revisjon

## 2026-10-29 kl. 19:05 — Abhira

### Oppgave
Gjøre de viktigste endringene i `docs/product-brief.md` etter faglærerens tilbakemelding (`tilbakemelding-product-brief.md`). Gruppen har bestemt at Claude API skal brukes, og at det ikke skal være innlogging foreløpig.

### Plan
- Ta utgangspunkt i «De viktigste endringene» og radene merket Juster/Endre i tilbakemeldingen.

### Resultat
Endringer i `docs/product-brief.md`:
- **Løsningen:** KI foreslår nøyaktig tre felt: etikett, prioritet og sammendrag. «Type» er fjernet fra eksempelet. «Tidsrom» beregnes nå av regler ut fra forfallsdatoen.
- **Ny seksjon «KI-tjeneste»:** Claude API kalles fra serveren, og nøkkelen ligger i `.env.local` med `.env.example` som mal. Seksjonen beskriver også strukturert og validert svar, regelbasert reserveløsning slik at sensor kan kjøre appen uten nøkkel, mock-svar i tester, kostnad og hva som sendes til Claude.
- **MVP-scope:** «Valgfri innlogging» er erstattet med lokal lagring uten innlogging. Innlogging og synkronisering er flyttet til «Utenfor MVP».
- **Suksesskriterier:** Måltallene som ikke kan måles i emnet (30 % tidsbesparelse og ukentlig bruk) er fjernet. De er erstattet med et testsett på 20 oppgavetekster (mål: etikett 16/20, prioritet 14/20) og en brukertest med 5 testbrukere.
- Endringene er ikke committet.

### Åpne punkter
- Lag testsettet med 20 oppgavetekster og forventet etikett og prioritet.
- Opprett `.env.example` med variabelen for Claude API-nøkkelen.
- Bestem hvilke smarte lister som skal finnes i v1.
- Velg Claude-modell og lagringsløsning i arkitekturdokumentet.
- Bestem arkiveringsregler for fullførte oppgaver.
- Vurder å fjerne sekundærmålgruppen «små team», siden deling er utelatt.

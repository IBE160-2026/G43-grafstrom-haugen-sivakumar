# Endre dato og etikett

## 2026-10-29 kl. 19:55 — Abhira

### Oppgave
Gjøre det tydelig i product brief at brukeren kan endre forfallsdato og etikett ved behov.

### Plan
- Presisere eksisterende punkter i `docs/product-brief.md` i stedet for å lage en ny seksjon.

### Resultat
Endringer i `docs/product-brief.md`:
- **MVP-scope:** «redigere oppgaver» er utvidet. Brukeren kan når som helst endre tekst, forfallsdato, etikett, prioritet, prosjekt og notater på en lagret oppgave, og kan fjerne forfallsdatoen helt.
- **Smarte lister:** Når forfallsdatoen endres, flyttes oppgaven automatisk til riktig liste.
- **Suksesskriterier:** Nytt kriterium om at forfallsdato og etikett kan endres på en lagret oppgave, og at oppgaven da havner i riktig smart liste.
- Endringene er ikke committet.

### Åpne punkter
- Bestem om brukeren bare kan velge blant faste etiketter (Skole, Privat, Gruppearbeid) eller også lage egne.
- Bestem om KI skal foreslå nye verdier når brukeren endrer oppgaveteksten på en lagret oppgave.

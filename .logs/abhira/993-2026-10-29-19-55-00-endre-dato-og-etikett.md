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
- Committet og pushet i `c553f62`.

Oppfølging i samme økt: gruppen har tatt to beslutninger, som nå står i `docs/product-brief.md`:
- **Bare faste etiketter:** Skole, Privat og Gruppearbeid står i «Løsningen». «Egne etiketter laget av brukeren» er lagt til under «Utenfor MVP».
- **Nye KI-forslag ved endret tekst:** Når brukeren endrer oppgaveteksten på en lagret oppgave, foreslår Claude på nytt. De gamle verdiene beholdes til brukeren godtar de nye. Dette er lagt inn i MVP-listen.
- Lukket begge de åpne punktene fra denne fila.
- Endringene etter `c553f62` er ikke committet.

### Åpne punkter
Ingen.

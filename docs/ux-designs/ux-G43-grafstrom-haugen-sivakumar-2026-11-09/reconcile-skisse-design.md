# Avstemming: imports/Skisse-design.jpg.jpeg

Skissen viser fire mobilskjermer: Mine oppgaver, Ny oppgave med KI-forslag, Arkiv (F5) og Personvern og data (F6). Gruppa kalte den et tidlig utkast som kan endres.

## Tatt med i spinene

| Fra skissen | Hvor |
|---|---|
| Logo «due**Next**», hilsen, dato og tannhjul | DESIGN Components, EXPERIENCE IA |
| Filterknapper og sortering på frist | EXPERIENCE Component Patterns (Privat lagt til) |
| Grupper med antall, forfalt med stripe til venstre | DESIGN Components, EXPERIENCE State Patterns |
| Merkelapper for prosjekt, frist og prioritet | DESIGN Components |
| Flytende knapp «+ Ny oppgave» | Beholdt på mobil |
| KI-forslag per felt med Godta/Endre og Godta alle | Flyttet fra skjemaet til oppgavedetaljen (forslag etter lagring, FR-8) |
| Merket «regelbasert» | EXPERIENCE State Patterns (KI utilgjengelig) |
| Prioritetsvelger med tre knapper | Beholdt. «Normal» er byttet til «Middels» |
| Arkiv med 7-dagersregel, «Slettes om n dager», Gjenopprett og Slett nå | EXPERIENCE State Patterns |
| Personvern: KI-bryter, hva som sendes, lagring, Eksporter og Slett alle data | Flyttet til Innstillinger → Personvern og data |

## Endret eller forkastet

| Fra skissen | Hva skjedde |
|---|---|
| Mørkegrønn aksentfarge | Forkastet. Erstattet av 6 pastelltemaer med blå som standard |
| Bunnmenyen Oppgaver / Arkiv / Personvern | Ny meny: Oppgaver / Kalender / Arkiv |
| Grupperekkefølge uten «Senere» | «Senere» er lagt til, og Forfalt ligger øverst |
| KI-forslag i skjemaet før Lagre | Forslagene vises nå på oppgaven etter lagring |

## Kvalitative ideer som ellers kunne gått tapt

Disse står i skissen, men er ikke formelt bestemt. Spør gruppa om de skal være med:

1. **«Bare oppgaveteksten er påkrevd. Resten kan stå tomt.»** Hjelpetekst under tekstfeltet i skjemaet.
2. **«Frist: ingen foreslått – legg til selv.»** Forklarer at KI aldri setter frist (FR-5).
3. **«"regelbasert" vises når forslaget kommer fra appens regler, ikke fra KI.»** Forklaring under forslagsboksen.
4. **«Navn, telefon og e-post sendes aldri»** i Personvern. Dette er et sterkere løfte enn PRD-en gir: FR-42 er bare et *Bør*, og det er pseudonymisering, ikke en garanti. Teksten må stemme med det som faktisk bygges.
5. **«Behandlingsansvarlig: [fyll inn navn på enhet]»** er en plassholder som hører til det åpne punktet Å-3 i PRD-en.
6. **Merkelapp med «Slettes i morgen»** i varselfarge når det er 1 dag igjen. Dette er en finere variant av FR-31.

# Spine-gjennomgang – dueNext

Gjennomgått: `DESIGN.md`, `EXPERIENCE.md`, `.memlog.md`, `reconcile-skisse-design.md`, `imports/Skisse-design.jpg.jpeg`, `.working/*.html`, mot `prd.md` og `product-brief.md`. Avvik som står i EXPERIENCE «Avvik fra PRD» (1–11) er ikke regnet som feil. Dato: 2026-11-09.

## Samlet vurdering

Spinene er godt skrevet og har riktig form. Kjernen (oppgavekort, smartlister, KI-forslagsboks, temaer, glød, lys/mørk) er tydelig nok til å bygges, og kontrastpåstandene i Colors stemmer når de regnes ut. De to nye funksjonene som ikke finnes i PRD-en, **hendelser** og **KI-økter**, er bare beskrevet for «gladveien». Livssyklus, gjentakelse, nattevakter over midnatt og kalenderens egen oppførsel mangler, så en arkitekt eller story-utvikler må gjette på datamodell og regler. I tillegg er det ett PRD-avvik som ikke er listet (FR-26-filtre), et par AA-brudd som motsier målet om WCAG 2.1 AA, og flere komponenter som bare har visuell spesifikasjon eller bare oppførsel. Paret er **ikke klart som kontrakt** før de høye funnene er lukket. Ingen funn er kritiske.

## 1. Flytdekning – tynn

Sjekket: PRD-funksjonene F1–F6 (PRD-en har ingen navngitte brukerreiser) og reisene i `.memlog.md` mot Key Flows (navngitt person, nummererte steg, klimaks, avviksvei).

### Funn
- **[høy]** F5 (Arkiv: fullføre, angre via snackbar, gjenopprette, slette nå, 7-dagersregel) har ingen Key Flow. Reglene finnes bare spredt i State Patterns og Interaction Primitives (EXPERIENCE, Key Flows). *Fiks:* Legg til «Flyt 5 – Ida huker av og angrer» med avhuking → snackbar → Arkiv → Gjenopprett, og som avvik at 5 sekunder er gått og angring skjer fra Arkiv.
- **[høy]** F4 søk har et ferdig scenario i PRD-en (FR-28, «statistikk»), men ingen flyt. Filter og sortering mangler også flyt (EXPERIENCE, Key Flows). *Fiks:* Legg til en kort søkeflyt med navngitt person, der klimaks er at treffet viser *Fullført* og frist, og avviksveien er «Fant ingenting …».
- **[middels]** F6 etter oppstart mangler flyt: endre KI-valg (FR-36), Eksporter/Importer (FR-43) og Slett alle data (FR-40). Det er heller ikke sagt hva som skjer etter Slett alle data, for eksempel om appen går tilbake til Førstegangsoppsett. *Fiks:* Lag én flyt for Personvern og data med bekreftelse og sluttilstand.
- **[middels]** Flyt 3 og Flyt 4 har ingen navngitt person og ingen klimaks. Flyt 3 beskriver ikke hva som skjer ved *Nei* eller *Hopp over*, for eksempel hvordan hilsenen ser ut uten navn (EXPERIENCE linje 200–210). *Fiks:* Bruk Ida eller Sara, legg til klimaks, og legg til avvik for «Nei til KI» (ingen KI-boks, «+ Legg til økt») og «uten navn» (f.eks. «Hei 👋»).
- **[middels]** FR-13 (ny tekst gir nye forslag, mens de gamle verdiene beholdes) har ingen flyt eller tilstand. Flyt 4 nevner det bare i en bisetning. *Fiks:* Legg til et avvikssteg i Flyt 4 der teksten endres, og vis hvordan gamle og nye forslag står i KI-boksen.
- **[middels]** Flyt 2 mangler avviksvei når KI er utilgjengelig ved «Foreslå ny tid», og når KI er av (EXPERIENCE linje 195). *Fiks:* Legg til «Avvik: uten KI → knappen skjules, studenten flytter økta selv med Endre».
- **[lav]** I Flyt 2 steg 5 «ser» Sara kollisjonen med legetimen *før* hun har lagt den inn (linje 194). *Fiks:* Skriv om til at hun husker legetimen og legger den inn, og at merket så dukker opp.

## 2. Tokenkomplett – tilstrekkelig

Sjekket: alle frontmatter-tokens, alle `{…}`-referanser i prosa og komponenter, lys/mørk-par og kontrast. Alle referanser løses (`{colors.text-on-pastel}`, `{colors.text-on-glow}`, `{colors.border-hairline}`, `{colors.accent-ink}` og `{rounded.*}`). Kontrasttallene i Colors er regnet ut på nytt og stemmer (ink/hvit 5,99–8,28, tekst på pastell 8,98–12,31, pastell/mørkt kort 9,13–12,51, text-on-glow ≥ 5,15).

### Funn
- **[høy]** Snackbar: «Angre» i pastell på *lys pille i mørk modus* gir bare ca. 1,3–1,8:1, som er et klart AA-brudd. Pillens farger er heller ikke tokens (DESIGN linje 254). *Fiks:* Legg til tokenene `snackbar-bg` og `snackbar-bg-dark`, og bruk `accent-ink` (ikke pastell) for «Angre» på lys pille.
- **[høy]** Skjemafelt har bare kantlinjen `border-hairline` (#E7E7E3 mot #FFFFFF = 1,24:1). WCAG 1.4.11 krever 3:1 for feltgrenser. Det samme gjelder valgt filter, prioritetsvelger og valgt dag, der valgt tilstand bare vises med pastellfyll (1,28–1,76:1 mot hvit) (DESIGN linje 244, 249–251). *Fiks:* Gi feltene en egen `border-input` på ≥ 3:1, og gi valgt tilstand et ekstra signal (kant i `accent-ink` eller hake).
- **[middels]** Gløden og KI-boksen er ikke tokens. `ai-suggestion-box.background` er prosa («accent 35 % blandet …»), og gløden (radiell gradient, 75 %/30 %) finnes bare i prosa (DESIGN linje 145, 224). *Fiks:* Legg inn `glow-strength: 0.75` / `glow-strength-dark: 0.30` og `ai-box-mix` / `ai-box-mix-dark` som tokens, eller skriv dem som `color-mix()`-uttrykk med tokenreferanser.
- **[middels]** Kontrast er ikke oppgitt for `warn` (5,11:1 på hvit og 4,76:1 på bakgrunnen, men bare 3,4:1 på gløden) eller for `text-muted` mot `surface-base` (4,51:1, rett over grensen og brukt i `tag`) (DESIGN Colors). *Fiks:* Legg til begge i kontrollavsnittet, og si at `warn` aldri brukes i glødsonen.
- **[middels]** Fargene på kalenderprikkene på mobil er ikke definert: «fargede prikker eller streker». Hva skiller oppgave, økt, hendelse og forfalt når etikettene ikke har egne farger og bare én pastell brukes (DESIGN linje 246, 264)? *Fiks:* Gi en eksplisitt mapping, for eksempel oppgave = `accent-ink`, hendelse = `text-muted`, forfalt = `warn`, og økt = hul ring.
- **[lav]** Komponent-tokens peker bare til lys-varianter. Mørk modus må utledes av `-dark`-suffikset, og den regelen står ikke noe sted (DESIGN linje 102–155). *Fiks:* Skriv én setning om at `{colors.x}` løses til `x-dark` i mørk modus når tokenet finnes.
- **[lav]** `typography.fontFamily` er en streng på rotnivå, mens spesifikasjonen forventer et objekt per rolle. `task-card.padding: '10px 12px'` og `margin-desktop: 26px` ligger utenfor 4 px-skalaen (DESIGN linje 48, 99, 107). *Fiks:* Flytt reservefontene inn i hver rolle (eller en `note`), og bruk 8/12 og 24 eller 28, eller begrunn avvikene.
- **[lav]** Skygge på dialoger, «svakere linje» på hendelsesraden og fokusringen (2 px) mangler tokens (DESIGN linje 226, 242, 249). *Fiks:* Legg til `dialog.shadow`, `border-subtle` og `focus-ring`.

## 3. Komponentdekning – tynn

Sjekket: alle komponentnavn i begge filene mot DESIGN Components (visuelt) og EXPERIENCE Component Patterns (oppførsel).

### Funn
- **[høy]** **Kalender** har bare en visuell rad. Oppførselen mangler: hva trykk på dag gjør (dagsliste eller skjema), månedsnavigasjon (forrige/neste/«I dag»), hva som skjer når en dag har mange elementer på PC («+3 til»), og hvor «+ Ny» står på PC, der den flytende knappen ikke finnes. Flyt 2 steg 2 bruker likevel «+ Ny» på PC (DESIGN linje 246, EXPERIENCE linje 154, 191). *Fiks:* Legg til en rad «Kalender» i Component Patterns med disse reglene.
- **[middels]** Disse har bare visuell spesifikasjon og ingen oppførselsrad: Bunnmeny/sidemeny, Prioritetsvelger, Bryter [Oppgave | Hendelse] (bare nevnt inne i Skjema-raden), Dialog/bekreftelse, Snackbar (oppførselen står i Interaction Primitives) og Skeleton. *Fiks:* Gi hver sin rad med regler (f.eks. Dialog: fokusfelle, Esc = Avbryt, standardfokus på Avbryt ved sletting).
- **[middels]** Disse har bare oppførsel og ingen visuell rad: Sortering «⇅ Frist», «+ Legg til økt», Foreslåtte økter (som egen radtype), KI-påminnelse, Skrivefelt «+ Ny oppgave … skriv med egne ord» (nevnt i Layout og Shapes, men har ikke egen komponent), Prosjektliste, merket «regelbasert», og «✦»-prikken for ubesvarte forslag (EXPERIENCE linje 77–89, 102). *Fiks:* Legg til korte visuelle rader i DESIGN Components.
- **[middels]** Det finnes ingen komponent i noen av filene for: Arkivrad (nedtelling, «…»-meny med Gjenopprett/Slett nå), Gruppeoverskrift med antall og sammenleggbar «Ingen frist (n)», Hendelsesdetalj, sidene i Førstegangsoppsett og lenken til Personvernerklæringen (FR-41 krever at den finnes på *alle* skjermer, men plasseringen er ikke tegnet). *Fiks:* Legg dem til i begge filene. Lenken til Personvernerklæringen er viktigst, fordi FR-41 er et Må-krav.
- **[middels]** Sortering: de andre sorteringsvalgene er ikke navngitt (FR-25), bare standardvalget (EXPERIENCE linje 77). *Fiks:* List valgene, f.eks. Frist / Prioritet / Nyeste.
- **[lav]** Tema-velgeren i DESIGN dekker bare fargeprøvene. Kontrollen Lys/Mørk/«Følg systemet» fra EXPERIENCE linje 90 har ingen visuell form. *Fiks:* Spesifiser den som segmentert pille, likt bryteren [Oppgave | Hendelse].

## 4. Tilstandsdekning – tilstrekkelig

Sjekket: hver IA-flate mot tomme tilstander, lasting, feil, fokus, KI av/utilgjengelig og lagringsfeil.

### Funn
- **[høy]** **Hendelse over midnatt motsier skjemaet.** Hendelsesfelt har én dato, og «Slutt før start» gir feilmelding. Da kan ikke Saras nattevakt (Flyt 2, KI-planlegging steg 3) legges inn (EXPERIENCE linje 83, 115). *Fiks:* Legg til sluttdato eller regelen «slutt før start = neste dag», og juster feilmeldingen.
- **[høy]** **Gjentakende hendelser:** Det er ikke sagt hva *Endre* og *Slett* gjør på én forekomst kontra hele serien (Hendelsesdetalj, EXPERIENCE linje 30, 83). Dette påvirker datamodellen direkte. *Fiks:* Bestem dette, f.eks. «Bare denne / Hele serien» i dialogen, eller «bare hele serien i v1», og skriv det inn.
- **[høy]** **Økters livssyklus er udefinert.** Det står ikke hva som skjer med godtatte økter når fristen endres (Flyt 4), når oppgaven fullføres, slettes eller gjenopprettes, eller når en økt passeres uten å være huket av. Det står heller ikke hvilken smartliste en økt havner i, og om den teller i gruppeantallet (EXPERIENCE linje 73–74, 158–167). *Fiks:* Legg til en tabell for økters livssyklus i KI-planlegging.
- **[middels]** Oppgaver: tomt resultat når et filter er valgt (f.eks. ingen *Privat*) mangler. Det er heller ikke sagt om tomme grupper utenom «I dag» skjules, inkludert søndagsregelen i FR-22 (EXPERIENCE linje 97–98). *Fiks:* Legg til tilstandene «Tomt filter» og «Tom gruppe».
- **[middels]** Lagring i nettleseren feiler (privat modus, full kvote, blokkert lagring) mangler. NFR-4 gjør lagringen bærende. *Fiks:* Legg til en saklig melding og at appen kan brukes uten lagring.
- **[middels]** Skjema: det er ikke sagt hva som skjer med ulagrede endringer ved tilbakepil/Esc (forkaste eller spørre) (EXPERIENCE linje 82, 123). *Fiks:* Bestem dette, f.eks. «Forkaste endringene?» bare når noe er endret.
- **[middels]** Import: det er ikke sagt om import *erstatter* eller *slår sammen* data, og det mangler både bekreftelse og suksessmelding (EXPERIENCE linje 114). *Fiks:* Bestem regelen og legg til tilstanden «Import fullført».
- **[lav]** Oppgave med «🔒 Ikke send til KI» mangler i State Patterns. Den står bare i Component Patterns, og låseikonet på kortet står bare i DESIGN. *Fiks:* Legg til en rad «Ikke send til KI» for Oppgavedetalj: ingen KI-boks, «+ Legg til økt» vises.
- **[lav]** Hilsen uten fornavn (*Hopp over*) mangler. *Fiks:* «Hei 👋».

## 5. Visuell referansedekning – tilstrekkelig

Sjekket: `imports/` (1 fil), `.working/` (4 filer), `mockups/` og `wireframes/` (finnes ikke ennå).

### Funn
- **[lav]** Lenkene til `mockups/color-themes.html`, `mockups/backgrounds-dark.html` og `mockups/desktop-layout.html` peker ikke til noe ennå. Det er forventet, fordi mockupene ikke er flyttet over. Men navnene stemmer ikke med `.working/`-filene (`color-themes-1`, `backgrounds-2-dark`, `desktop-layouts-1`), og ikke med mockup-planen i `.memlog.md` linje 82 (Oppgaver, Oppgavedetalj, Kalender, Skjema + oppstart) (DESIGN linje 258, EXPERIENCE linje 48). *Fiks:* Bestem endelige filnavn når mockupene flyttes over, og lenk de planlagte mockupene inline i Kalender, KI-forslagsboks og State Patterns.
- **[lav]** DESIGN lenker ikke skissen inline. Den står bare i frontmatter, og Colors omtaler «den første skissen» uten sti. `reconcile-skisse-design.md` er ikke lenket fra noen av spinene. *Fiks:* Legg til lenke i Colors og ved IA.
- **[lav]** Regelen om at spinene gjelder foran mockupene står i begge filene (DESIGN linje 258, EXPERIENCE linje 48). Det er greit, men den skal ideelt stå én gang. *Fiks:* Ingen handling nødvendig, eventuelt stryk den ene.

## 6. Overflødig og overspesifisert – sterk

### Funn
- **[lav]** Colors-prosaen og tematabellen gjentar alle hex-verdiene fra frontmatter. Det er en risiko for at de glir fra hverandre ved senere endringer (DESIGN linje 172–187). *Fiks:* Behold tabellen, men henvis til tokennavn i stedet for hex i punktlista.
- **[lav]** Tekster i Voice and Tone som «Sterkt! 3 av 4 økter gjort 💪» og «Du har kontroll på uka!» har ingen flate eller utløser. `.memlog.md` linje 70 sier i tillegg «ingen egen fremdriftsstrek for økter». Dette er tekst uten en beslutning bak (EXPERIENCE linje 57, 59). *Fiks:* Knytt dem til en tilstand (f.eks. snackbar når en økt hukes av), eller merk dem som eksempler på tonen.
- **[lav]** «Størrelsene er hentet fra forhåndsvisningene og godkjent av gruppa» er en prosessnotis (DESIGN linje 209). *Fiks:* Stryk den. Den hører hjemme i memlog.

## 7. Arvedisiplin – tilstrekkelig

Sjekket: at `sources` løses (alle tre stier finnes), navn er ordrett fra kildene, begrepene er like, komponentnavn er like i begge filene, og at tokenreferanser løses.

### Funn
- **[høy]** **Avvik som ikke er listet:** FR-26 sier at studenten kan filtrere på etikett, *prioritet, frist og prosjekt*. Spinene har bare filtrene Alle/Skole/Jobb/Privat (EXPERIENCE linje 76, DESIGN linje 244). *Fiks:* Legg til prioritet, frist og prosjekt (f.eks. et «Filter»-ark), eller før det opp som avvik nr. 12 i «Avvik fra PRD».
- **[middels]** **Avvik som ikke er listet:** I KI-planlegging steg 2 sendes *frist* til KI, og trolig også godtatte økter ved «Foreslå ny tid». FR-15 sier «bare oppgavetekst og notater». Avvik #3 dekker bare hendelser (EXPERIENCE linje 163, 220). *Fiks:* Utvid avvik #3 til «hendelser, frist og eksisterende økter», slik at PRD-oppdateringen, FR-35-teksten og personvernerklæringen tar det med.
- **[middels]** **Uenighet med memlog:** Ifølge `.memlog.md` linje 63 skal påminnelsen etter FR-37 også stå i *hendelsesskjemaet*. Raden KI-påminnelse dekker bare oppgavetekst. Det er heller ikke sagt om påminnelsen gjelder for skrivefeltet på PC (FR-37 sier «skrivefeltet») (EXPERIENCE linje 85–86). *Fiks:* Utvid raden med begge.
- **[middels]** **Uenighet med memlog:** Linje 49 sier at trykk på dag åpner «+ Ny oppgave» med frist ferdig utfylt. Linje 57 sier at trykk på dag viser dagslista. IA-raden «Ny / Endre nås fra … trykk på dag i Kalender» og Responsive («valgt dag åpner dagslista») sier hver sitt (EXPERIENCE linje 29, 154). *Fiks:* Velg dagsliste + «+ Ny» (i tråd med linje 57), og rett IA-raden.
- **[lav]** FR-18-merket er skrevet om fra «Forslag basert på nøkkelord – KI var ikke tilgjengelig» til «regelbasert» + «KI var ikke tilgjengelig. Forslagene er basert på nøkkelord.», og det er ikke listet som avvik (EXPERIENCE linje 61, 100). *Fiks:* Bruk PRD-teksten ordrett, eller list endringen.
- **[lav]** FR-38 «privat» heter nå «🔒 Ikke send til KI» (`.memlog.md` linje 75). Navnebyttet står ikke i Avvik-tabellen, og avvik #4 dekker bare utvidelsen til hendelser. *Fiks:* Nevn navnebyttet i #4, så begrepet blir oppdatert i PRD-en.
- **[lav]** Komponentnavnene er ikke helt like. Frontmatter bruker engelske nøkler (`task-card`, `check-ring`, `filter-chip`, `ai-suggestion-box`, `fab`, `bottom-nav`, `sidebar-item-active`) uten kobling til de norske prosanavnene. Disse navneparene er også ulike: «Søkefelt» / «Lupe / søkefelt», «Skjemafelt» / «Skjema Ny/Endre», «Flytende knapp» / «+ Ny oppgave» / «+ Ny». *Fiks:* Gjør komponentnavnene like i begge filene, og legg til en kolonne med tokennøkkel.
- **[lav]** Punkt 4 og 5 i `reconcile-skisse-design.md` («Navn, telefon og e-post sendes aldri» og plassholderen for behandlingsansvarlig) er ikke avgjort i `.memlog.md`. Linje 80 avgjør bare punkt 1, 2, 3 og 6. *Fiks:* Avgjør punktene og logg beslutningen. Punkt 4 bør avvises så lenge FR-42 bare er et Bør-krav.

## 8. Formtilpasning – sterk

Sjekket: kanonisk rekkefølge i DESIGN, påkrevde seksjoner i EXPERIENCE og om de oppfunne seksjonene fortjener plassen sin.

### Funn
- **[lav]** DESIGN følger den kanoniske rekkefølgen. EXPERIENCE har alle påkrevde seksjoner, i tillegg til Responsive og Inspiration. De oppfunne seksjonene «KI-planlegging (økter)» og «Avvik fra PRD» fortjener plassen sin, men KI-planlegging overlapper med Component Patterns (Foreslåtte økter, Kollisjonsmerke). *Fiks:* La KI-planlegging eie reglene (og livssyklusen, se 4), og la komponentradene bare henvise dit.
- **[lav]** Layout sier ikke hva som gjelder for «+ Ny oppgave» mellom 768 og 1023 px: flytende knapp eller skrivefelt (DESIGN linje 217, EXPERIENCE linje 153). *Fiks:* Legg til én setning.

## Mekaniske merknader

- Alle `{…}`-referanser i DESIGN løses. EXPERIENCE refererer bare til `accent-ink`, og det løses.
- `sources` i frontmatter løses for begge filene. EXPERIENCE mangler `description` (valgfritt).
- `task-card-overdue.borderLeft` og `check-ring.border` bygger tokens inn i CSS-strenger (`'4px solid {colors.warn}'`). Sjekk at resolveren håndterer dette, eller del opp i `borderLeftWidth` og `borderLeftColor`.
- Ulik knappetekst: «+ Ny oppgave» (flytende knapp, også brukt til å lage Hendelse i Flyt 1 steg 2) og «+ Ny» (Kalender, Flyt 2). Velg én.
- Lenkene til `mockups/` peker ikke til noe ennå (forventet, se 5).
- Ingen Mermaid-diagrammer i filene.

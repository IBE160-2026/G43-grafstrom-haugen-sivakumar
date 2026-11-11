---
name: dueNext
description: Norsk, KI-assistert oppgave- og kalenderapp for studenter. Minimalistisk, ryddig, motiverende og fresh, med seks pastelltemaer i lys og mørk modus.
status: final
created: 2026-11-09
updated: 2026-11-11
sources:
  - docs/product-brief.md
  - docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/prd.md
  - docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/imports/Skisse-design.jpg.jpeg
colors:
  # Nøytrale, lys modus
  surface-base: '#F7F7F5'
  surface-raised: '#FFFFFF'
  text-primary: '#1F2328'
  text-muted: '#6B7280'
  text-on-glow: '#4B5160'
  border-hairline: '#E7E7E3'
  border-subtle: '#EFEFEC'
  border-input: '#858A93'
  warn: '#C2413B'
  snackbar-bg: '#1F2328'
  snackbar-text: '#FFFFFF'
  # Nøytrale, mørk modus
  surface-base-dark: '#15161A'
  surface-raised-dark: '#202127'
  text-primary-dark: '#ECEDEF'
  text-muted-dark: '#9CA1A9'
  text-on-glow-dark: '#ECEDEF'
  border-hairline-dark: '#2D2E35'
  border-subtle-dark: '#27282E'
  border-input-dark: '#737882'
  warn-dark: '#F09A94'
  snackbar-bg-dark: '#ECEDEF'
  snackbar-text-dark: '#1F2328'
  # Tekst på pastellfyll (alle temaer, begge modi)
  text-on-pastel: '#1F2328'
  # Temaer: pastell = fyll, ink = tekst/ikon i lys modus. I mørk modus er ink = pastell.
  theme-blue-pastel: '#A9CBF2'
  theme-blue-ink: '#2C5B8E'
  theme-orange-pastel: '#F9C9A2'
  theme-orange-ink: '#8A4419'
  theme-purple-pastel: '#CDBBEE'
  theme-purple-ink: '#5A3F8E'
  theme-yellow-pastel: '#F5E39E'
  theme-yellow-ink: '#7A6008'
  theme-green-pastel: '#B6E2C4'
  theme-green-ink: '#2C6B44'
  theme-pink-pastel: '#F5BFD4'
  theme-pink-ink: '#983862'
  # Aktive alias. Standardtema er blå; appen bytter aliasene når studenten velger tema.
  accent: '{colors.theme-blue-pastel}'
  accent-ink: '{colors.theme-blue-ink}'
  accent-ink-dark: '{colors.theme-blue-pastel}'
  # «Angre» i snackbaren: pastell på mørk pille (lys modus), ink på lys pille (mørk modus).
  snackbar-action: '{colors.theme-blue-pastel}'
  snackbar-action-dark: '{colors.theme-blue-ink}'
typography:
  greeting:
    fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  task-title:
    fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
  meta:
    fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
  tag:
    fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
  section-label:
    fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: 12px
    fontWeight: 600
    letterSpacing: 0.06em
    lineHeight: 1.3
rounded:
  sm: 6px
  md: 12px
  lg: 14px
  xl: 28px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  margin-mobile: 16px
  margin-desktop: 24px
  sidebar-width: 200px
  detail-panel-width: 340px
components:
  background-glow:
    color: '{colors.accent}'
    glow-strength: 0.75
    glow-strength-dark: 0.30
    shape: 'radial-gradient ovenfra, tones ut mot {colors.surface-base}'
  focus-ring:
    width: 2px
    color: '{colors.accent-ink}'
    offset: 2px
  task-card:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    rounded: '{rounded.lg}'
    padding: '{spacing.3}'
  task-card-overdue:
    borderLeftWidth: 4px
    borderLeftColor: '{colors.warn}'
  session-card:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    rounded: '{rounded.lg}'
    padding: '{spacing.3}'
  session-warning:
    text: '{colors.warn}'
    typography: '{typography.tag}'
  event-row:
    background: '{colors.surface-raised}'
    border: '{colors.border-subtle}'
    rounded: '{rounded.lg}'
    timeTypography: '{typography.meta}'
  check-ring:
    size: 20px
    hitArea: 44px
    borderWidth: 2px
    borderColor: '{colors.accent-ink}'
    checkedFill: '{colors.accent}'
    checkedMark: '{colors.text-on-pastel}'
  group-header:
    typography: '{typography.section-label}'
    text: '{colors.text-muted}'
    overdueText: '{colors.warn}'
  filter-chip:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    rounded: '{rounded.full}'
    activeBackground: '{colors.accent}'
    activeText: '{colors.text-on-pastel}'
    activeBorder: '{colors.accent-ink}'
    activeBorderWidth: 2px
  filter-sheet:
    background: '{colors.surface-raised}'
    rounded: '{rounded.xl}'
  sort-button:
    text: '{colors.text-primary}'
    typography: '{typography.meta}'
    rounded: '{rounded.full}'
  search-field:
    background: '{colors.surface-raised}'
    border: '{colors.border-input}'
    rounded: '{rounded.full}'
  quick-add-field:
    background: '{colors.surface-raised}'
    border: '{colors.border-input}'
    rounded: '{rounded.md}'
    typography: '{typography.body}'
  text-field:
    background: '{colors.surface-raised}'
    border: '{colors.border-input}'
    rounded: '{rounded.md}'
    typography: '{typography.body}'
    labelTypography: '{typography.meta}'
    errorText: '{colors.warn}'
  segmented-toggle:
    background: '{colors.surface-raised}'
    border: '{colors.border-input}'
    rounded: '{rounded.full}'
    selectedBackground: '{colors.accent}'
    selectedText: '{colors.text-on-pastel}'
    selectedBorder: '{colors.accent-ink}'
    selectedBorderWidth: 2px
  priority-selector:
    background: '{colors.surface-raised}'
    border: '{colors.border-input}'
    rounded: '{rounded.md}'
    selectedBackground: '{colors.accent}'
    selectedText: '{colors.text-on-pastel}'
    selectedBorder: '{colors.accent-ink}'
    selectedBorderWidth: 2px
  privacy-switch:
    onTrack: '{colors.accent-ink}'
    offTrack: '{colors.border-input}'
    helperTypography: '{typography.meta}'
  lock-icon:
    color: '{colors.text-muted}'
    size: 14px
  ai-reminder:
    text: '{colors.text-muted}'
    typography: '{typography.meta}'
  tag:
    background: '{colors.surface-base}'
    text: '{colors.text-muted}'
    rounded: '{rounded.sm}'
    typography: '{typography.tag}'
  tag-high:
    text: '{colors.warn}'
    border: '{colors.warn}'
  button-primary:
    background: '{colors.accent}'
    text: '{colors.text-on-pastel}'
    rounded: '{rounded.full}'
  button-secondary:
    background: '{colors.surface-raised}'
    border: '{colors.border-input}'
    rounded: '{rounded.full}'
  button-danger:
    background: '{colors.warn}'
    text: '{colors.surface-raised}'
    rounded: '{rounded.full}'
  fab:
    background: '{colors.accent}'
    text: '{colors.text-on-pastel}'
    rounded: '{rounded.full}'
    shadow: '0 6px 18px rgba(0,0,0,.15)'
  ai-suggestion-box:
    ai-box-mix: 0.35
    ai-box-mix-dark: 0.18
    background: 'color-mix(in srgb, {colors.accent} 35%, {colors.surface-raised})'
    backgroundDark: 'color-mix(in srgb, {colors.accent} 18%, {colors.surface-raised-dark})'
    text: '{colors.text-primary}'
    label: '{colors.accent-ink}'
    rounded: '{rounded.lg}'
  suggested-session-row:
    background: '{colors.surface-raised}'
    rounded: '{rounded.md}'
    typography: '{typography.meta}'
  fallback-badge:
    background: '{colors.surface-raised}'
    text: '{colors.text-muted}'
    rounded: '{rounded.sm}'
    typography: '{typography.tag}'
  unanswered-dot:
    size: 8px
    color: '{colors.accent-ink}'
  add-session-button:
    text: '{colors.accent-ink}'
    border: '{colors.border-input}'
    rounded: '{rounded.full}'
  skeleton:
    color: '{colors.border-hairline}'
    rounded: '{rounded.sm}'
  detail-panel:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    rounded: '{rounded.lg}'
  calendar:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    selectedBackground: '{colors.accent}'
    selectedBorder: '{colors.accent-ink}'
    selectedBorderWidth: 2px
    todayRing: '{colors.accent-ink}'
    overdueText: '{colors.warn}'
  calendar-dot:
    size: 6px
    task: '{colors.accent-ink}'
    session: 'hul ring, 1.5px {colors.accent-ink}'
    event: '{colors.text-muted}'
    overdue: '{colors.warn}'
  bottom-nav:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    activeText: '{colors.accent-ink}'
  sidebar-item-active:
    background: '{colors.accent}'
    text: '{colors.text-on-pastel}'
    rounded: '{rounded.md}'
  archive-row:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    rounded: '{rounded.lg}'
    countdownText: '{colors.text-muted}'
    lastDayText: '{colors.warn}'
  dialog:
    background: '{colors.surface-raised}'
    rounded: '{rounded.xl}'
    shadow: '0 12px 32px rgba(0,0,0,.18)'
    titleTypography: '{typography.title}'
  snackbar:
    background: '{colors.snackbar-bg}'
    text: '{colors.snackbar-text}'
    action: '{colors.snackbar-action}'
    rounded: '{rounded.full}'
  banner:
    background: '{colors.surface-raised}'
    border: '{colors.warn}'
    text: '{colors.text-primary}'
    rounded: '{rounded.md}'
  project-list-row:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    typography: '{typography.body}'
  theme-swatch:
    size: 36px
    rounded: '{rounded.full}'
    selectedRing: '{colors.accent-ink}'
  privacy-link:
    text: '{colors.text-muted}'
    typography: '{typography.meta}'
  onboarding-page:
    background: '{colors.surface-base}'
    titleTypography: '{typography.greeting}'
---

## Brand & Style

dueNext er for studenter som allerede har nok å tenke på. Appen skal gi oversikt med én gang, uten innlæring. Fire ord styrer uttrykket: **minimalistisk, ryddig, motiverende og fresh**. I tillegg skal appen føles **ungdommelig**.

Gruppa har brukt Todoist og Things som eksempler på det vi vil unngå. De oppleves som kjedelige og for tette, med for mye informasjon på samme sted. dueNext viser derfor bare det studenten trenger for å bestemme seg: hva som haster, hva som skjer i dag, og hva som kommer. Alt annet ligger ett trykk unna.

Uttrykket er lyst og luftig, med én pastellfarge som studenten velger selv. Den gir appen personlighet uten å bli masete. En myk glød i temafargen øverst på skjermen gjør at bakgrunnen ikke er helt hvit eller helt svart. Kort og tekst ligger på rolige, nøytrale flater, slik at innholdet alltid er lett å lese.

Lys og mørk modus er like gjennomarbeidet. Mørk modus bruker de samme pastellfargene på mørk bakgrunn.

## Colors

**Mørk modus.** I mørk modus erstattes `{colors.x}` med `{colors.x-dark}` når det tokenet finnes. Finnes det ikke, brukes samme token i begge modi (for eksempel `{colors.accent}` og `{colors.text-on-pastel}`).

**Nøytrale.** Bakgrunn, kort, tekst og linjer er like i alle temaene. Bare aksentfargen bytter.

- **Bakgrunn (`{colors.surface-base}`)** er lerretet. Den er litt varm i lys modus, slik at den ikke føles klinisk.
- **Kort (`{colors.surface-raised}`)** brukes for oppgavekort, detaljpanel, kalender, bunnmeny og sidemeny. Teksten står alltid på en slik flate eller på bakgrunnen, aldri direkte på sterk pastell. Unntaket er knapper og valgte filtre med `{colors.text-on-pastel}`.
- **Tekst (`{colors.text-primary}`)** og **dempet tekst (`{colors.text-muted}`)** brukes til henholdsvis titler og metadata.
- **Glødsonen** er toppen av hver hovedskjerm, der gløden ligger (se Elevation & Depth). Den omfatter hilsen, dato, søk, filtre og skrivefeltet på PC. Lista med gruppeoverskrifter starter under glødsonen. All sekundærtekst i glødsonen, også KI-påminnelsen under skrivefeltet, bruker **`{colors.text-on-glow}`**. Dempet tekst og varselfarge er for svake der og brukes **aldri i glødsonen**.
- **Linjer.** `{colors.border-hairline}` skiller kort fra bakgrunnen. `{colors.border-subtle}` er en svakere linje for hendelsesrader. `{colors.border-input}` er kanten på felt og kontroller som må kunne sees (kontrast ≥ 3:1).
- **Varsel (`{colors.warn}`)** brukes bare for *Forfalt*, prioritet *Høy*, kollisjonsmerke, «⚠ Etter fristen», «Slettes i morgen», feilmeldinger ved felt og *Slett*. Varselfargen brukes aldri som dekor.
- **Snackbar (`{colors.snackbar-bg}`, `{colors.snackbar-text}`, `{colors.snackbar-action}`)** er en mørk pille i lys modus og en lys pille i mørk modus. «Angre» er pastell på den mørke pillen og ink på den lyse.

**Temaer.** Studenten velger én av seks pastellfarger under Innstillinger → Utseende → Tema. **Pastellblå er standard** for nye brukere. Den mørkegrønne fargen fra den første skissen ([imports/Skisse-design.jpg.jpeg](imports/Skisse-design.jpg.jpeg), se [reconcile-skisse-design.md](reconcile-skisse-design.md)) er forkastet.

| Tema | Pastell (fyll) | Ink (tekst/ikon, lys modus) |
|---|---|---|
| Pastellblå *(standard)* | `#A9CBF2` | `#2C5B8E` |
| Pastelloransje | `#F9C9A2` | `#8A4419` |
| Pastellilla | `#CDBBEE` | `#5A3F8E` |
| Pastellgul | `#F5E39E` | `#7A6008` |
| Pastellgrønn | `#B6E2C4` | `#2C6B44` |
| Pastellrosa | `#F5BFD4` | `#983862` |

- **Pastell** (`{colors.accent}`) fyller valgt filter, primærknapper, den flytende knappen, aktiv fane i sidemenyen, valgt dag, avkrysset ring og KI-forslagsboksen (blandet med kortfarge). Kortformen i teksten er «KI-boksen».
- **Ink** (`{colors.accent-ink}`) er en mørkere tone av samme farge. Den brukes på tekst og ikoner i lys modus: «Next» i logoen, avkrysningsringen, aktiv fane i bunnmenyen, KI-etiketten, sammendragslinjen, fokusringen og kanten rundt valgte kontroller. I mørk modus brukes pastellen selv som ink.
- Etikettene **Skole, Jobb og Privat har ingen egne farger**. De følger temaet og vises som nøytrale merkelapper.

→ Visuell referanse: [mockups/color-themes.html](mockups/color-themes.html).

**Kontroll (WCAG 2.1 AA).** Gløden er målt på sitt sterkeste punkt (pastell med 75 % dekkevne over bakgrunnen i lys modus, 30 % i mørk). Alle tall gjelder alle seks temaer.

| Par | Kontrast | Merknad |
|---|---|---|
| Ink mot hvitt kort | 5,99–8,28:1 | |
| Ink mot gløden | 4,69–5,37:1 | Oransje ink er mørknet fra `#9A4F1E` (4,3:1) til `#8A4419` |
| Tekst på pastellfyll | 8,98–12,31:1 | |
| Pastell mot mørkt kort | 9,13–12,51:1 | |
| `text-on-glow` mot gløden | 5,15–6,47:1 (lys) / 6,49–7,53:1 (mørk) | |
| `text-muted` mot hvitt / bakgrunn | 4,83:1 / 4,51:1 | Rett over grensen. Brukes i merkelapper, men aldri i glødsonen eller KI-boksen |
| `text-muted-dark` mot bakgrunn / kort | 6,96:1 / 6,18:1 | |
| `warn` mot hvitt / bakgrunn | 5,11:1 / 4,76:1 | Mot gløden bare 3,31–4,16:1. Brukes derfor **aldri i glødsonen** |
| `warn-dark` mot bakgrunn / kort | 8,40:1 / 7,46:1 | Mot mørk glød 3,53–4,10:1. Samme regel |
| `border-input` mot hvitt / bakgrunn | 3,47:1 / 3,23:1 | Måles mot feltets eget fyll, som alltid er kortfargen |
| `border-input-dark` mot kort / bakgrunn | 3,62:1 / 4,08:1 | |
| Kant på valgt kontroll (`accent-ink`) mot hvitt | 5,99–8,28:1 | Mot pastellfyllet 4,18–4,76:1. Mørk modus: pastell mot kort 9,13–12,51:1 |
| Fokusring (`accent-ink`) | ≥ 5,99:1 (lys) / ≥ 9,13:1 (mørk) | |
| Snackbar, lys modus: tekst / «Angre» | 15,80:1 / 8,98–12,31:1 | `#1F2328`-pille, hvit tekst, pastell |
| Snackbar, mørk modus: tekst / «Angre» | 13,49:1 / 5,12–7,07:1 | `#ECEDEF`-pille, mørk tekst, ink |
| KI-boks: tekst / ink | 13,11–14,48:1 / 5,49–6,87:1 | Mørk: tekst 8,33–9,05:1, pastell 6,03–7,60:1 |

Pastellfyll alene skiller ikke valgt fra ikke valgt (1,28–1,76:1 mot hvitt). Valgt tilstand får derfor alltid et ekstra signal: kant i `accent-ink` eller hake. Dempet tekst (4,01–4,43:1) og varselfarge (4,24–4,68:1) er for svake inne i KI-boksen, så all tekst der bruker `{colors.text-primary}` eller `{colors.accent-ink}`.

## Typography

Skriften er **Poppins** fra Google Fonts, med systemskrift som reserve. Poppins er geometrisk og rund, og passer til «ungdommelig og fresh».

| Rolle | Størrelse / vekt | Bruk |
|---|---|---|
| `greeting` | 24 / 600 | «Hei, Ida 👋» og sidetitler (Kalender, Arkiv), tittel i førstegangsoppsettet |
| `title` | 18 / 600 | Tittel i oppgavedetaljen og overskrifter i dialoger |
| `body` | 16 / 400 | Skjemafelt, notater, brødtekst. 16 px hindrer at mobilnettlesere zoomer inn i felt |
| `task-title` | 15 / 500 | Tittel på oppgave- og øktkort |
| `meta` | 13 / 400 | Dato under hilsen, metadata, klokkeslett, ledetekster, KI-påminnelse |
| `tag` | 12 / 500 | Merkelapper (prosjekt, frist, prioritet) |
| `section-label` | 12 / 600, STORE BOKSTAVER, sperret | Gruppeoverskrifter: FORFALT, I DAG … |

## Layout & Spacing

Skalaen bygger på 4 px: 4 / 8 / 12 / 16 / 24 / 32. Margen er 16 px på mobil og 24 px på PC.

- **Mobil (< 768 px):** Én kolonne. Bunnmeny med tre faner (Oppgaver, Kalender, Arkiv). Logo, søk og tannhjul ligger øverst, og den flytende knappen «+ Ny oppgave» ligger nede til høyre over bunnmenyen.
- **Nettbrett (768–1023 px):** Sidemeny og liste. «+ Ny oppgave» er den flytende knappen, som på mobil.
- **PC (≥ 1024 px):** Oppsett A. Sidemeny på 200 px til venstre, med logo og de tre fanene øverst, og Innstillinger og «Personvern og data» nederst. Lista ligger i midten, og detaljpanelet på 340 px ligger til høyre. Skrivefeltet «+ Ny oppgave … skriv med egne ord» ligger øverst i lista i stedet for den flytende knappen.
- Hvor lenken «Personvernerklæring» står: se `EXPERIENCE.md` → Information Architecture. Hvordan detaljer, skjema og kalender oppfører seg på hver bredde: se `EXPERIENCE.md` → Responsive & Platform.
- PC og mobil skal se ut som samme produkt, med samme kort, farger, skrift og glød. Det er bare plasseringen som endrer seg.

→ Visuell referanse: [mockups/desktop-layout.html](mockups/desktop-layout.html).

## Elevation & Depth

Dybde lages med tone og glød, ikke med skygger.

- **Glød ovenfra (`background-glow`):** En radiell gradient i `{colors.accent}` øverst på hver hovedskjerm, som tones ut nedover mot bakgrunnen. Styrken er `glow-strength` (0,75) i lys modus og `glow-strength-dark` (0,30) i mørk modus, lik for alle temaene. Hva glødsonen omfatter, og hvilken tekst som brukes der: se Colors.
- **Kort** skilles fra bakgrunnen med kortfarge og en tynn linje (`{colors.border-hairline}`), uten skygge.
- **Skygge** brukes bare på den flytende knappen (`fab.shadow`) og på dialoger og ark (`dialog.shadow`).

→ Visuelle referanser: [mockups/backgrounds.html](mockups/backgrounds.html) (valgt variant B) og [mockups/backgrounds-dark.html](mockups/backgrounds-dark.html) (styrke i mørk modus).

## Shapes

Formene er myke og runde. De skal føles vennlige, men ikke barnslige.

- `{rounded.full}` brukes for filterknapper, knapper, søkefelt, den flytende knappen, segmenterte velgere, snackbar, temaprøver og avkrysningsringer.
- `{rounded.lg}` (14 px) brukes for oppgave-, økt- og arkivkort, hendelsesrader, KI-forslagsboks og detaljpanel.
- `{rounded.md}` (12 px) brukes for skjemafelt, skrivefeltet, prioritetsvelgeren, banner og aktiv fane i sidemenyen.
- `{rounded.sm}` (6 px) brukes for merkelapper og skeleton-linjer.
- `{rounded.xl}` (28 px) brukes for dialoger og ark (for eksempel filterarket) på mobil.

## Components

Navnene i første kolonne er de samme som i `EXPERIENCE.md` → Component Patterns. Tokennøkkelen viser til `components` i frontmatter.

| Komponent | Token | Utseende |
|---|---|---|
| Oppgavekort | `task-card` | Avkrysningsring til venstre. Tittel i `task-title`. Godtatt KI-sammendrag på en linje under, med «✦» i `{colors.accent-ink}`. Under den står merkelappene prosjekt, frist og prioritet. Forfalt: 4 px stripe i `{colors.warn}` til venstre (`task-card-overdue`). *Høy* har varselfarge (`tag-high`). Låsikon ved tittelen når oppgaven er 🔒. |
| Øktkort | `session-card` | Som oppgavekortet, med tittelen «Økt 1/3 – Innlevering» og tidspunkt som merkelapp. Avhuket økt får strek over tittelen. |
| Øktvarsel | `session-warning` | «⚠ Kolliderer med Legetime» eller «⚠ Etter fristen» i `{colors.warn}` og `tag`, under tittelen, med sekundærknappene *Endre tid* og eventuelt *Foreslå ny tid*. |
| Hendelsesrad | `event-row` | Ingen avkrysningsring. Klokkeslettet først i `meta`, så tittelen. Kortflate med `{colors.border-subtle}`, så den ikke forveksles med en oppgave. Låsikon når tittelen er skjult for KI. Over midnatt: «21:00 – 07:30 (+1 dag)». |
| Avkrysningsring | `check-ring` | 20 px, kant 2 px i `accent-ink`, trykkflate 44 px. Avhuket: fylt med pastell og hake i `text-on-pastel`. |
| Gruppeoverskrift | `group-header` | `section-label` i `text-muted` med antall, for eksempel «I DAG · 3». FORFALT i `warn`. «Ingen frist (n)» har en pil for å felle sammen. |
| Filterknapper | `filter-chip` | Alle / Skole / Jobb / Privat og aktive filtre fra filterarket. Valgt: pastellfyll, 2 px kant i `accent-ink` og hake «✓» foran teksten. Aktive filtre fra arket har «×» for å fjernes. |
| Filterark | `filter-sheet` | Knappen «☰ Filter» ved filterknappene. Arket kommer nedenfra på mobil (`rounded.xl`) og som nedtrekk på PC. Valgene vises som filterknapper. |
| Sortering | `sort-button` | Tekstknapp med valgt sortering, for eksempel «⇅ Frist», i `meta`. Liten meny med hake ved valgt. |
| Søkefelt | `search-field` | Pille med lupe og `{colors.border-input}`. Treff vises som oppgavekort med merkelappen *Aktiv* eller *Fullført*. |
| Skrivefelt | `quick-add-field` | Bare PC. Felt øverst i lista med plassholder «+ Ny oppgave … skriv med egne ord». Plass til KI-påminnelsen rett under. |
| Flytende knapp | `fab` | «+ Ny oppgave» i pastell med skygge, nede til høyre (mobil og nettbrett). |
| Skjema Ny/Endre | – | Tilbakepil, tittel, Velger [Oppgave \| Hendelse], skjemafelt og **Lagre** som primærknapp nederst. |
| Skjemafelt | `text-field` | Kortflate, `{colors.border-input}`, `{rounded.md}`, tekst i `body`. Ledetekst i `meta` over. Hjelpetekst og feilmelding i `meta` under feltet, feil i `warn`. Fokus: `focus-ring`. |
| Velger [Oppgave \| Hendelse] | `segmented-toggle` | To knapper i en pille. Valgt: pastellfyll og 2 px kant i `accent-ink`. |
| Modusvelger | `segmented-toggle` | Lys / Mørk / Følg systemet, samme form som velgeren over. |
| Prioritetsvelger | `priority-selector` | Lav / Middels / Høy, tre like brede knapper. Valgt: pastellfyll og 2 px kant i `accent-ink`. |
| Personvernbryter | `privacy-switch` | Vanlig bryter med låsikon nederst i skjemaet. Oppgave: «🔒 Ikke send til KI». Hendelse: «🔒 Skjul tittel for KI», med hjelpetekst i `meta` rett under. Samme bryterform brukes for KI-valgene i Personvern og data. |
| Låsikon | `lock-icon` | Lite lås i `text-muted` på oppgavekort, hendelsesrad, oppgavedetalj og hendelsesdetalj når 🔒 er på. |
| KI-påminnelse | `ai-reminder` | Én linje i `meta` og `text-muted` rett under oppgavetekst, tittel på hendelse eller skrivefeltet. |
| KI-forslagsboks | `ai-suggestion-box` | Pastell blandet med kortfarge (`ai-box-mix`), merket «✦ KI-forslag» i `accent-ink`. Én rad per felt (etikett, prioritet, sammendrag) med *Godta* (primær) og *Endre* (sekundær). *Godta alle* øverst til høyre. Linjen «Frist: ingen foreslått – legg til selv» nederst. All tekst i `text-primary`. Se [mockups/key-detalj.html](mockups/key-detalj.html). |
| Foreslått økt-rad | `suggested-session-row` | Rad inne i KI-boksen under «✦ Foreslåtte økter»: dag og tid i `meta` (for eksempel «Man 08:00–10:00»), *Godta* og *Endre*. |
| Merket «regelbasert» | `fallback-badge` | Liten merkelapp i `tag` på hver forslagsrad fra reserveløsningen. |
| Ubesvarte forslag | `unanswered-dot` | 8 px prikk «✦» i `accent-ink` ved tittelen på oppgavekortet. |
| «+ Legg til økt» | `add-session-button` | Sekundærknapp med tekst i `accent-ink` under øktene i detaljen. |
| Oppgavedetalj | `detail-panel` | Tittel i `title`. Felt som par ledetekst/verdi (frist, prosjekt, etikett, prioritet), KI-forslagsboks, økter, notater. *Endre* øverst til høyre, *Fullfør* (primær) og *Slett* (fare) nederst. |
| Hendelsesdetalj | `detail-panel` | Tittel, dato, start–slutt, gjentakelse og låsikon. *Endre* øverst til høyre, *Slett* (fare) nederst. |
| Kalender | `calendar` | Månedsrutenett på kortflate. Topplinje med månedsnavn, ‹ › og «I dag» (og «+ Ny» på PC). PC: titler inne i dagene, hendelser og økter med klokkeslett, og «+n til». Mobil: prikker (`calendar-dot`). Valgt dag: pastellfyll og 2 px kant i `accent-ink`. Dagens dato: tallet i en ring i `accent-ink`. Forfalt i `warn`. Se [mockups/key-kalender.html](mockups/key-kalender.html). |
| Kalenderprikk | `calendar-dot` | Oppgave = fylt prikk i `accent-ink`. Økt = hul ring i `accent-ink`. Hendelse = fylt prikk i `text-muted`. Forfalt = fylt prikk i `warn`. |
| Bunnmeny | `bottom-nav` | Oppgaver (☰), Kalender (kalenderikon med «Kalender» under) og Arkiv. Aktiv fane i `accent-ink`. |
| Sidemeny | `sidebar-item-active` | Samme faner øverst, og Innstillinger og «Personvern og data» nederst (se Layout & Spacing). Aktiv fane har pastellfyll. |
| Arkivrad | `archive-row` | Avkrysset ring, tittel med strek over, «Slettes om n dager» i `text-muted`, «Slettes i morgen» i `warn`. «…»-meny til høyre. |
| Dialog / bekreftelse | `dialog` | Kortflate, `{rounded.xl}` og `dialog.shadow` over et dempet lag. Tittel i `title`. Primærknapp i pastell, eller `button-danger` ved sletting. *Avbryt* som sekundærknapp. |
| Snackbar | `snackbar` | Pille nederst, over bunnmenyen: «Flyttet til Arkiv · Angre». Farger fra `snackbar`-tokenene. |
| Skeleton | `skeleton` | Rolige grå linjer i KI-boksen med svak pulsering. |
| Banner | `banner` | Kortflate med kant i `warn` øverst på siden, tekst i `text-primary`. Brukes når lagring feiler. |
| Prosjektliste | `project-list-row` | Ett prosjektnavn per rad i `body`, med søppelbøtte-ikon til høyre. |
| Temavelger | `theme-swatch` | Seks runde fargeprøver i pastell. Den valgte har ring i `accent-ink` og hake. |
| Personvernlenke | `privacy-link` | Liten tekstlenke «Personvernerklæring» i `meta` og `text-muted`, understreket. Plassering: se `EXPERIENCE.md` → Information Architecture. |
| Førstegangsoppsett | `onboarding-page` | Helside på bakgrunn med glød. Tittel i `greeting`, ett spørsmål per side, knappene nederst. Se [mockups/key-skjema-oppstart.html](mockups/key-skjema-oppstart.html). |
| Knapper | `button-primary`, `button-secondary`, `button-danger` | Pille. Primær: pastell og `text-on-pastel`. Sekundær: kortflate og `border-input`. Fare: `warn`-fyll med hvit tekst. |

→ Oppgaveliste og kort på mobil og PC: [mockups/key-oppgaver.html](mockups/key-oppgaver.html).

## Do's and Don'ts

| Gjør | Ikke gjør |
|---|---|
| Én pastell om gangen, valgt av studenten | Egne farger per etikett eller prosjekt |
| Bruk ink-tonen til tekst og ikoner i lys modus | Pastell som tekstfarge på lys bakgrunn |
| Bruk `text-on-glow` for sekundærtekst i glødsonen | Dempet grå tekst eller varselfarge oppå gløden |
| Gi valgt tilstand kant i `accent-ink` eller hake i tillegg til pastellfyll | Bare pastellfyll som tegn på valgt |
| `border-input` på felt og kontroller (mockups laget før 11.11.2026 viser feilaktig `border-hairline`) | `border-hairline` som eneste feltgrense |
| Kort på nøytral flate med tynn linje | Tunge skygger, gradienter på kort |
| Varselfarge bare for Forfalt, Høy, øktvarsler, feil og Slett | Rødt som dekor eller i temaer |
| Luft mellom grupper, tette kort inne i gruppa | Fylle skjermen med all informasjon på én gang (Todoist-fella) |
| Samme komponenter på mobil og PC | Eget designspråk for PC |

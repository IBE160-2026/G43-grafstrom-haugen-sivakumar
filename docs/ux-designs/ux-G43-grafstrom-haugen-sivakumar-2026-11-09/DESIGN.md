---
name: dueNext
description: Norsk, KI-assistert oppgave- og kalenderapp for studenter. Minimalistisk, ryddig, motiverende og fresh, med seks pastelltemaer i lys og mørk modus.
status: draft
created: 2026-11-09
updated: 2026-11-09
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
  warn: '#C2413B'
  # Nøytrale, mørk modus
  surface-base-dark: '#15161A'
  surface-raised-dark: '#202127'
  text-primary-dark: '#ECEDEF'
  text-muted-dark: '#9CA1A9'
  text-on-glow-dark: '#ECEDEF'
  border-hairline-dark: '#2D2E35'
  warn-dark: '#F09A94'
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
typography:
  fontFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  greeting:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: Poppins
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  task-title:
    fontFamily: Poppins
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
  meta:
    fontFamily: Poppins
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
  tag:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
  section-label:
    fontFamily: Poppins
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
  margin-desktop: 26px
  sidebar-width: 200px
  detail-panel-width: 340px
components:
  task-card:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    rounded: '{rounded.lg}'
    padding: '10px 12px'
  task-card-overdue:
    borderLeft: '4px solid {colors.warn}'
  check-ring:
    size: 20px
    border: '2px solid {colors.accent-ink}'
    checkedFill: '{colors.accent}'
    checkedMark: '{colors.text-on-pastel}'
  filter-chip:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    rounded: '{rounded.full}'
    activeBackground: '{colors.accent}'
    activeText: '{colors.text-on-pastel}'
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
    border: '{colors.border-hairline}'
    rounded: '{rounded.full}'
  button-danger:
    text: '{colors.warn}'
  fab:
    background: '{colors.accent}'
    text: '{colors.text-on-pastel}'
    rounded: '{rounded.full}'
    shadow: '0 6px 18px rgba(0,0,0,.15)'
  ai-suggestion-box:
    background: 'accent 35 % blandet med surface-raised (mørk: 18 %)'
    label: '{colors.accent-ink}'
    rounded: '{rounded.lg}'
  bottom-nav:
    background: '{colors.surface-raised}'
    border: '{colors.border-hairline}'
    activeText: '{colors.accent-ink}'
  sidebar-item-active:
    background: '{colors.accent}'
    text: '{colors.text-on-pastel}'
    rounded: '{rounded.md}'
---

## Brand & Style

dueNext er for studenter som allerede har nok å tenke på. Appen skal gi oversikt med én gang, uten innlæring. Fire ord styrer uttrykket: **minimalistisk, ryddig, motiverende og fresh**. I tillegg skal appen føles **ungdommelig**.

Gruppa har brukt Todoist og Things som eksempler på det vi vil unngå. De oppleves som kjedelige og for tette, med for mye informasjon på samme sted. dueNext viser derfor bare det studenten trenger for å bestemme seg: hva som haster, hva som skjer i dag, og hva som kommer. Alt annet ligger ett trykk unna.

Uttrykket er lyst og luftig, med én pastellfarge som studenten velger selv. Den gir appen personlighet uten å bli masete. En myk glød i temafargen øverst på skjermen gjør at bakgrunnen ikke er helt hvit eller helt svart. Kort og tekst ligger på rolige, nøytrale flater, slik at innholdet alltid er lett å lese.

Lys og mørk modus er like gjennomarbeidet. Mørk modus bruker de samme pastellfargene på mørk bakgrunn.

## Colors

**Nøytrale.** Bakgrunn, kort, tekst og linjer er like i alle temaene. Bare aksentfargen bytter.

- **Bakgrunn (`#F7F7F5` / mørk `#15161A`)** er lerretet. Den er litt varm i lys modus, slik at den ikke føles klinisk.
- **Kort (`#FFFFFF` / mørk `#202127`)** brukes for oppgavekort, detaljpanel, bunnmeny og sidemeny. Teksten står alltid på en slik flate eller på bakgrunnen, aldri direkte på sterk pastell. Unntaket er knapper og aktive filtre med `{colors.text-on-pastel}`.
- **Tekst (`#1F2328` / `#ECEDEF`)** og **dempet tekst (`#6B7280` / `#9CA1A9`)** brukes til titler og metadata.
- **Tekst i glødsonen (`#4B5160` / `#ECEDEF`)** brukes for hilsen, dato og annen sekundærtekst øverst, der gløden ligger. Vanlig dempet tekst er for svak der: 2,9–3,9:1, som er under AA-kravet.
- **Varsel (`#C2413B` / `#F09A94`)** brukes bare for *Forfalt*, prioritet *Høy*, kollisjonsmerke og *Slett*. Varselfargen brukes aldri som dekor.

**Temaer.** Studenten velger én av seks pastellfarger under Innstillinger → Utseende → Tema. **Pastellblå er standard** for nye brukere. Den mørkegrønne fargen fra den første skissen er forkastet.

| Tema | Pastell (fyll) | Ink (tekst/ikon, lys modus) |
|---|---|---|
| Pastellblå *(standard)* | `#A9CBF2` | `#2C5B8E` |
| Pastelloransje | `#F9C9A2` | `#8A4419` |
| Pastellilla | `#CDBBEE` | `#5A3F8E` |
| Pastellgul | `#F5E39E` | `#7A6008` |
| Pastellgrønn | `#B6E2C4` | `#2C6B44` |
| Pastellrosa | `#F5BFD4` | `#983862` |

- **Pastell** fyller valgt filter, primærknapper, «+ Ny oppgave», aktiv fane i sidemenyen, avkrysset ring og KI-forslagsboksen (blandet med kortfarge).
- **Ink** er en mørkere tone av samme farge. Den brukes på tekst og ikoner i lys modus: «Next» i logoen, avkrysningsringen, aktiv fane i bunnmenyen, KI-etiketten og sammendragslinjen. I mørk modus brukes pastellen selv som ink.
- Etikettene **Skole, Jobb og Privat har ingen egne farger**. De følger temaet og vises som nøytrale merkelapper.

**Kontroll (WCAG 2.1 AA).** Ink mot hvitt ligger på 5,98–8,28:1, og mot gløden på 4,66–5,37:1. Tekst på pastellfyll er 8,98–12,31:1. Pastell mot mørkt kort er 9,13–12,51:1. Den oransje ink-fargen er mørknet fra `#9A4F1E` til `#8A4419`, fordi den første varianten bare ga 4,3:1 mot gløden.

## Typography

Skriften er **Poppins** fra Google Fonts, med systemskrift som reserve. Poppins er geometrisk og rund, og passer til «ungdommelig og fresh».

| Rolle | Størrelse / vekt | Bruk |
|---|---|---|
| `greeting` | 24 / 600 | «Hei, Ida 👋» og sidetitler (Kalender, Arkiv) |
| `title` | 18 / 600 | Tittel i oppgavedetaljen og overskrifter i dialoger |
| `body` | 16 / 400 | Skjemafelt, notater, brødtekst. 16 px hindrer at mobilnettlesere zoomer inn i felt |
| `task-title` | 15 / 500 | Tittel på oppgavekort |
| `meta` | 13 / 400 | Dato under hilsen, metadata |
| `tag` | 12 / 500 | Merkelapper (prosjekt, frist, prioritet) |
| `section-label` | 12 / 600, STORE BOKSTAVER, sperret | Gruppeoverskrifter: FORFALT, I DAG … |

Størrelsene er hentet fra forhåndsvisningene og godkjent av gruppa.

## Layout & Spacing

Skalaen bygger på 4 px: 4 / 8 / 12 / 16 / 24 / 32. Margen er 16 px på mobil og 26 px på PC.

- **Mobil (< 768 px):** Én kolonne. Bunnmeny med tre faner (Oppgaver, Kalender, Arkiv). Logo, søk og tannhjul ligger øverst, og «+ Ny oppgave» flyter nede til høyre over bunnmenyen.
- **PC (≥ 1024 px):** Oppsett A. Sidemeny på 200 px til venstre, med logo, de tre fanene og Innstillinger og Personvern nederst. Lista ligger i midten. Detaljpanelet på 340 px til høyre åpnes for valgt oppgave. Skrivefeltet «+ Ny oppgave … skriv med egne ord» ligger øverst i lista i stedet for den flytende knappen.
- **Mellom 768 og 1023 px:** Sidemeny og liste, mens detaljene åpnes som egen side, som på mobil.
- PC og mobil skal se ut som samme produkt, med samme kort, farger, skrift og glød. Det er bare plasseringen som endrer seg.

## Elevation & Depth

Dybde lages med tone og glød, ikke med skygger.

- **Glød ovenfra:** En radiell gradient i temafargen øverst på hver hovedskjerm, som tones ut nedover. Styrken er **75 % i lys modus** og **30 % i mørk modus**, og den er lik for alle temaene. Gløden ligger bak hilsen, dato og filtre. Sekundærtekst i glødsonen bruker `{colors.text-on-glow}`.
- **Kort** skilles fra bakgrunnen med kortfarge og en tynn linje (`{colors.border-hairline}`), uten skygge.
- **Skygge** brukes bare på den flytende knappen «+ Ny oppgave» (`0 6px 18px rgba(0,0,0,.15)`) og på dialoger.

## Shapes

Formene er myke og runde. De skal føles vennlige, men ikke barnslige.

- `{rounded.full}` brukes for filterknapper, knapper, den flytende knappen og avkrysningsringer.
- `{rounded.lg}` (14 px) brukes for oppgavekort, KI-forslagsboks og detaljpanel.
- `{rounded.md}` (12 px) brukes for skjemafelt, skrivefeltet og aktiv fane i sidemenyen.
- `{rounded.sm}` (6 px) brukes for merkelapper.
- `{rounded.xl}` (28 px) brukes for dialoger og ark på mobil.

## Components

- **Oppgavekort:** Avkrysningsring til venstre. Tittel i `task-title`. Hvis KI-sammendraget er godtatt, vises det på en linje under med «✦» i `{colors.accent-ink}`. Under der kommer merkelappene prosjekt, frist og prioritet. Forfalte oppgaver får en 4 px stripe i varselfarge til venstre, og *Høy* får varselfarge.
- **Øktkort:** Samme kort, med tittelen «Økt 1/3 – Innlevering» og tidspunkt som merkelapp. Kolliderer økta med en hendelse, får den merket «⚠ Kolliderer med Legetime» i varselfarge.
- **Hendelsesrad (i «I dag»):** Ingen avkrysningsring. Klokkeslettet står først i `meta`, så tittelen. Raden har kortflate med svakere linje, slik at den ikke kan forveksles med en oppgave.
- **Avkrysningsring:** Kantlinje i `accent-ink`. Når den hukes av, fylles den med pastell og en hake i `text-on-pastel`.
- **Filterknapper:** Alle / Skole / Jobb / Privat. Den aktive er fylt med pastell.
- **KI-forslagsboks:** Pastell blandet med kortfarge, merket «✦ KI-forslag» i `accent-ink`. Hvert felt (etikett, prioritet, sammendrag, økter) har sin egen rad med *Godta* som primærknapp og *Endre* som sekundærknapp, og *Godta alle* ligger øverst til høyre. Forslag fra reserveløsningen får merket «regelbasert».
- **Kalender:** Månedsrutenett. På PC står oppgavetitlene inne i dagene, og hendelser og økter vises med klokkeslett. På mobil vises fargede prikker eller streker i stedet for tekst. Valgt dag er fylt med pastell, og dagens dato er markert med ring i `accent-ink`. Forfalte oppgaver vises i varselfarge på sin opprinnelige dato.
- **Bunnmeny (mobil) og sidemeny (PC):** Oppgaver (☰), Kalender (kalenderikon med «Kalender» under) og Arkiv. Aktiv fane bruker `accent-ink` på mobil og pastellfyll i sidemenyen.
- **Bryteren «🔒 Ikke send til KI»:** Ligger nederst i skjemaet, med låsikon og vanlig bryter. Når den er på, får oppgavekortet et lite låsikon.
- **Skjemafelt:** Kortflate, tynn linje og `{rounded.md}`, med tekst i `body`. Ledetekst i `meta` over feltet. Fokus vises med en 2 px ring i `accent-ink`.
- **Prioritetsvelger:** Tre like brede knapper (Lav / Middels / Høy) side om side. Den valgte er fylt med pastell.
- **Bryteren [Oppgave | Hendelse]:** To knapper i en pille med `{rounded.full}`. Den valgte er fylt med pastell.
- **Søkefelt:** Pille med `{rounded.full}`. På PC ligger det ved filterknappene. På mobil fyller det toppen når man trykker på lupen.
- **Dialog / bekreftelse:** Kortflate, `{rounded.xl}` og skygge. Tittel i `title`. Primærknappen er pastell, eller varselfarge ved sletting.
- **Snackbar «Flyttet til Arkiv · Angre»:** Mørk pille nederst (lys pille i mørk modus), med «Angre» i pastell.
- **Skeleton (KI henter):** Rolige grå linjer i KI-boksen med svak pulsering, som stoppes ved `prefers-reduced-motion`.
- **Tema-velger:** Seks runde fargeprøver i pastell. Den valgte har en ring i `accent-ink` og en hake.

→ Visuelle referanser: `mockups/color-themes.html`, `mockups/backgrounds-dark.html`, `mockups/desktop-layout.html`. Ved uenighet gjelder denne fila foran mockupene.

## Do's and Don'ts

| Gjør | Ikke gjør |
|---|---|
| Én pastell om gangen, valgt av studenten | Egne farger per etikett eller prosjekt |
| Bruk ink-tonen til tekst og ikoner i lys modus | Pastell som tekstfarge på lys bakgrunn |
| Bruk `text-on-glow` for sekundærtekst i glødsonen | Dempet grå tekst oppå gløden |
| Kort på nøytral flate med tynn linje | Tunge skygger, gradienter på kort |
| Varselfarge bare for Forfalt, Høy, kollisjon og Slett | Rødt som dekor eller i temaer |
| Luft mellom grupper, tette kort inne i gruppa | Fylle skjermen med all informasjon på én gang (Todoist-fella) |
| Samme komponenter på mobil og PC | Eget designspråk for PC |

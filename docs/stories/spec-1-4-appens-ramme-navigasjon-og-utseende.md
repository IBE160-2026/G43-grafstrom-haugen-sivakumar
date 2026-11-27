---
title: 'Story 1.4: Appens ramme, navigasjon og utseende'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: '7af5f9b1d50e3995dd538dd23324ce97c5d02985'
route: 'dispatch'
story_key: '1-4-appens-ramme-navigasjon-og-utseende'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-1-context.md'
  - '{project-root}/docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Appen er en hvit plassholderside uten farger, fonter eller navigasjon. Spor A (1.5) og B (1.8, 3.2) kan ikke bygge sider før rammen, designtokenene og fanene finnes, og feilsiden, dialogen og lagringsbanneret fra 1.3 mangler stil og varselfarge.

**Approach:** Legg alle tokens fra DESIGN.md som CSS-variabler i `app/globals.css`, styrt av `data-tema`/`data-modus` på `<html>` og satt før første tegning av et lite skript eid av `lib/storage/`. Last Poppins med `next/font/google`. Bygg rammen (bunnmeny under 768 px, sidemeny fra 768 px, plass til detaljpanel fra `lg`) inni `AppTilstand`, med rutene `/`, `/arkiv` og `/innstillinger`, og gi 1.3-flatene stil.

## Boundaries & Constraints

**Always:** Tokens og verdier ordrett fra DESIGN.md (farger D:11-57, typografi D:394-402, spacing D:101-111, rundinger D:95-100, glød D:113-117). Pastellblå og `system` er standard. Mørk modus: `x-dark` hvis tokenet finnes, ellers samme verdi. `data-modus="system"` løses i CSS med `prefers-color-scheme`. Rammen ligger inni `AppTilstand` under banneret, så banneret alltid står øverst. Tailwinds standard `md`/`lg`, ingen egne brytepunkter. WCAG 2.1 AA, fokusring 2 px `accent-ink` med 2 px avstand, trykkflater ≥ 44 × 44 px, `aria-current` på aktiv fane. Du-form, saklig tone i feil og personvern, ingen badge-tellere, ingen analyseverktøy eller tredjepartsskript. Les `node_modules/next/dist/docs/` før Next-kode skrives.

**Never:** Ingen Kalender-fane eller `/kalender` (5.6), ingen lupe/søk (2.6), ingen FAB eller skrivefelt «+ Ny oppgave» (1.6), ingen Personvern og data-lenke (3.4) eller personvernerklæring (3.2), ingen innstillinger for modus/tema (1.8, 2.8), ingen omdirigering til `/oppstart` (3.3), ingen detaljpanel-innhold (1.7). Ingen døde knapper. Ingen nye felt i dokumentskjemaet.

**Besluttet av Lena 2026-11-27:** Egne komponenter med Tailwind, ikke shadcn/ui (ingen nye pakker; designet i DESIGN.md følges direkte, og dialogen bygger på `<dialog>`). Ikonene er egne små SVG-ikoner i `components/ikoner.tsx` som farges med `currentColor`, ikke Unicode-tegn. Hele specen beholdes (~1750 tokens) i stedet for å deles.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Første start | Tomt lager | `data-tema="blå"`, `data-modus="system"` før første tegning | N/A |
| Lagret tema/modus | `innstillinger` `{ tema: "rosa", modus: "mørk" }` | Rosa og mørk fra første tegning, ingen blink | N/A |
| Systemet er mørkt | `modus: "system"`, OS mørk | Mørke farger | N/A |
| Ødelagte data | `{ikke json` eller ukjent tema | Standardverdiene settes; feilsiden fra 1.3 vises med stil | Skriptet kaster aldri |
| Lagring blokkert | `localStorage` kaster | Standardverdiene settes | try/catch i skriptet |
| Smal skjerm | 320 px | Bunnmeny, ingen vannrett rulling | N/A |
| Bredde 768–1023 | Nettbrett | Sidemeny, ikke bunnmeny | N/A |

</frozen-after-approval>

## Code Map

- `app/layout.tsx` -- har `lang="nb" suppressHydrationWarning` og `<body><AppTilstand>`; legg til `<head>` med temaskriptet og Poppins-klassen. Rammen legges *ikke* her, men inni `AppTilstand`
- `app/globals.css` -- bare `@import "tailwindcss"`; tokens som CSS-variabler + `@theme inline` så Tailwind-klasser som `bg-surface-base` virker
- `app/page.tsx` -- plassholder; blir Oppgaver-siden med glød og nøytral tekst
- `components/app-tilstand.tsx:42-47` -- banner + `children`/`Feilside`; ramme rundt `children` bare i `klar`-grenen, banneret over alt
- `components/feilside.tsx:8,52,66` -- `KNAPP` uten stil, `<dialog>` uten stil, *Slett alt* uten varselfarge; bruk `button-danger` (D:227-230) og dialogstil (D:295-299)
- `components/lagringsbanner.tsx:6` -- `role="alert"`; stil fra D:305-309
- `lib/storage/index.ts:5` -- `LAGRINGSNØKKEL = "duenext"`; temaskriptet bor i ny `lib/storage/tema-skript.ts` som en frittstående streng (kan ikke importere zod/migrer), hvitelister verdiene fra `kjerne/skjema.ts:101-103`
- `kjerne/skjema.ts:150-152` -- standardverdiene `system`/`blå`
- `lib/store/index.ts` -- butikken; `dokument.innstillinger` er kilden etter innlasting
- `tests/e2e/forside.spec.ts:6` -- forventer overskriften «dueNext»; oppdateres når siden endres
- `tests/e2e/lagring.spec.ts:62-63` -- eksisterende axe-mønster (`AxeBuilder`, `violations` = `[]`)
- `playwright.config.ts:10-13` -- bare Pixel 7 (412 px) og Desktop Chrome (1280); 320 px og 768 px testes med `page.setViewportSize`
- Next 16 docs: `02-guides/preventing-flash-before-hydration.md` (vanlig `<script dangerouslySetInnerHTML>` i `<head>`, ikke `next/script`; StrictMode nullstiller attributtene i dev → sett dem på nytt i `useLayoutEffect`), `03-api-reference/02-components/font.md` (Poppins er ikke variabel → `weight` påkrevd), `link.md:585-631` (`usePathname` for aktiv fane)

## Tasks & Acceptance

**Execution:**
- [x] `app/globals.css` -- alle tokens for lys/mørk og seks temaer under `[data-tema]`/`[data-modus]`, `system` via `prefers-color-scheme`, `@theme inline`, typografiroller, spacing, rundinger, fokusring globalt (`:focus-visible`), `prefers-reduced-motion`
- [x] `lib/storage/tema-skript.ts` -- streng med IIFE + try/catch som leser `innstillinger.tema`/`modus` fra `localStorage["duenext"]`, hvitelister og setter `data-tema`/`data-modus` (standard `blå`/`system`)
- [x] `app/layout.tsx` -- `<head>` med skriptet, Poppins (`next/font/google`, vekter 400/500/600, `variable`) med systemskrift som reserve
- [x] `components/tema-synk.tsx` -- klientkomponent som setter attributtene fra butikken i `useLayoutEffect` når `dokument.innstillinger` endres (og etter StrictMode-remount)
- [x] `components/ramme.tsx`, `components/ikoner.tsx` -- logo «due**Next**», toppfelt med logo og ⚙ under `md`, bunnmeny Oppgaver/Arkiv under `md`, sidemeny 200 px fra `md` med fanene øverst og ⚙ Innstillinger nederst, hovedflate med plass til 340 px panel fra `lg`; `aria-current="page"`, tilgjengelige navn, `nav` med `aria-label`
- [x] `components/app-tilstand.tsx` -- rammen rundt `children` i `klar`-grenen; banneret står over rammen
- [x] `app/page.tsx`, `app/arkiv/page.tsx`, `app/innstillinger/page.tsx` -- tittel i `greeting`-stil, glød øverst, nøytral tekst («… kommer snart.») uten knapper
- [x] `components/feilside.tsx`, `components/lagringsbanner.tsx` -- stil fra DESIGN.md, *Slett alt* som `button-danger`, dialog med dempet bakgrunn
- [x] `tests/e2e/ramme.spec.ts` -- bunnmeny ved 320/412 px, sidemeny ved 768/1280 px, ingen vannrett rulling ved 320 px, `aria-current` følger ruta, ingen Kalender-fane, trykkflater ≥ 44 px på mobil, axe på `/`, `/arkiv`, `/innstillinger`
- [x] `tests/e2e/tema.spec.ts` -- matriseradene: attributter fra lagret dokument før hydrering (`addInitScript`), standard ved ødelagt/blokkert lager, `emulateMedia({ colorScheme: "dark" })` med `system`, ingen hydreringsfeil i konsollen
- [x] `tests/e2e/lagring.spec.ts`, `tests/e2e/forside.spec.ts` -- axe også på banner- og dialogtilstanden; oppdater forsideforventningen
- [x] `docs/stories/spec-1-4-…md` (Implementation Notes) -- beslutningen om komponentbibliotek og toneregelen for senere stories (du-form, heiing bare i positive øyeblikk, saklig uten emoji i personvern/sletting/feil, ingen badge-tellere)

**Acceptance Criteria:**
- Given produksjonskoden, when man søker etter `localStorage`, then finnes den bare i `lib/storage/` (inkludert temaskriptet)
- Given lys og mørk modus i alle seks temaer, when axe kjøres på `/`, then er det ingen WCAG 2.1 AA-brudd
- Given en hovedside, when den vises, then ligger gløden øverst og sekundærtekst i glødsonen bruker `text-on-glow`
- Given appen, when man søker etter eksterne skript eller analyseverktøy, then finnes ingen

## Implementation Notes

**Komponentbibliotek (besluttet av Lena 2026-11-27).** Ingen shadcn/ui eller andre nye pakker. Komponentene er egne, med Tailwind-klasser som peker på tokenene i `app/globals.css` (`bg-surface-raised`, `text-text-on-glow`, `border-border-input`, `bg-accent`, `text-accent-ink`, `bg-warn`, `rounded-md/lg/xl/full`, `shadow-dialog`, `w-sidebar`, `w-panel`). Typografirollene er klasser: `text-greeting`, `text-title`, `text-body`, `text-task-title`, `text-meta`, `text-tag` og `section-label` (med store bokstaver). Gløden er klassen `glod`. Dialoger bygger på `<dialog>` med `showModal()` (se `components/feilside.tsx`). Ikonene ligger i `components/ikoner.tsx` som SVG med `currentColor` og `aria-hidden`.

**Spacing.** DESIGN 1–4 (4–16 px) er lik Tailwinds 1–4. DESIGN 5 (24 px) er Tailwind `6`, DESIGN 6 (32 px) er Tailwind `8`. Tailwinds tallskala er ikke overstyrt. Rå verdier finnes som `--space-1` … `--space-6`.

**Tema og modus.** `lib/storage/tema-skript.ts` bygger skriptstrengen fra `innstillingerSkjema` og `nyttDokument()`, så hvitelisten og standardverdiene har én kilde. Uten attributter på `<html>` gir CSS-en blå og «følg systemet». `components/tema-synk.tsx` leser det skriptet satte når modulen lastes (før hydrering) og setter det på nytt før innlasting, ettersom StrictMode-remounten i dev nullstiller attributtene. Etter innlasting er `dokument.innstillinger` kilden. Story 1.8 og 2.8 trenger bare å endre innstillingene i butikken.

**Detaljpanel.** Rammen har ingen tom kolonne. Hovedflaten (`main`) er fleksibel, og story 1.7 legger panelet ved siden av lista inne i siden med `lg:w-panel` (340 px). Ved 1024 px blir det 484 px igjen til lista.

**Toneregel for senere stories.** Du-form overalt. Heiing (for eksempel 👋 eller «Bra jobba!») bare i positive øyeblikk. Feil, personvern og sletting er saklige og uten emoji. Ingen badge-tellere på faner eller ikoner.

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Evidens / rute |
|---|---|---|---|---|
| 1 | gap | `TemaSynk` oppdaterer temaet når en annen fane skriver, men ingen test sjekker det | medium | Tofanetesten leser aldri `data-tema`/`data-modus` i fane B; effekten kan fjernes med grønne tester → patch |
| 2 | gap | Ingen test viser at et ikke-blått tema faktisk gir andre farger | medium | Temaløkka sjekker bare attributtet og axe; en feilstavet `[data-tema="grønn"]` faller stille tilbake til blå → patch |
| 3 | blind | Sprint-status sier `in-progress`, specen `in-review`; specen mangler i diffen | false | Sprint-status settes til `review` i siste steg; specen er utelatt med vilje (påstandsfila) |
| 4 | blind+edge | Lagringsbanneret skyver bunnen av sidemenyen (Innstillinger) under skjermkanten | low | Ekte (`sticky h-dvh` under banneret), men bare når lagring er blokkert, og lenken nås ved å rulle; retting krever ny layout → avvist |
| 5 | blind | ⚙ Innstillinger ligger utenfor «Hovedmeny» på mobil | low | Lenken ligger i `<header>` (banner-landmerke) med tilgjengelig navn; ikke et WCAG-brudd, slik mockupen viser → avvist |
| 6 | blind | Skjelettet har ingen ramme, så siden hopper når innlastingen er ferdig | low | Valgt i 1.3 (Design Notes: «Under skjelettet vises ingen ramme (kort øyeblikk)») → avvist |
| 7 | blind+edge | `fraSkriptet` er et øyeblikksbilde, så feilsiden etter skriving fra annen fane kan få temaet fra sidelastingen | low | Krever temaendring i annen fane og deretter ugyldige data i samme økt; retting legger til grener → avvist |
| 8 | edge | Skjema-ugyldig dokument med gyldige innstillinger gir feilside i brukerens tema | low | Skriptet kan ikke validere hele dokumentet uten zod; brukerens eget tema på feilsiden er ufarlig → avvist |
| 9 | blind+edge | Ukjent tema + gyldig `mørk` beholder mørk modus, mens matrisen sier «Standardverdiene settes»; testen sjekker bare tema | low | Avvik fra matriseraden «Ødelagte data» → patch (begge standardverdier når én verdi er ukjent, og assert på modus) |
| 10 | blind | axe kjøres i alle temaer bare på `/`, ikke med aktiv ⚙ på `/innstillinger` (`accent-ink` på glød) | maybe-false | Kontrasten for aktiv ⚙ i gul/oransje/rosa er ikke målt; avgjøres billig ved å kjøre axe der → patch (utvid temaløkka) |
| 11 | blind | Sidetitlene er ulike: «Arkiv – dueNext», men Oppgaver bare «dueNext» | low | Direkte retting med `title.template` → patch |
| 12 | blind | Mørk-blokken er kopiert to ganger i `globals.css` (`mørk` og `system` + mørkt OS) | low | Et token lagt til i bare én blokk gir stille feil i «følg systemet» når senere stories legger til tokens → patch (test som sammenligner verdiene) |
| 13 | blind | Lagringsnøkkelen er hardkodet i testene | low | En endret nøkkel gir høylytte feil i testene, ikke stille → avvist |
| 14 | blind | Temalista i testen er kopiert for hånd | low | Et nytt tema i skjemaet ville aldri få axe-kjøring → patch (bruk `innstillingerSkjema.shape.tema.options`) |
| 15 | blind | `expect(antall).toBe(3)` teller alle lenker på siden | low | Story 1.5 legger lenker i `main` og knekker rammetesten → patch (tell bare i `nav` og `header`) |
| 16 | blind | `backdrop:bg-black/50` bruker ikke et token | false | DESIGN.md har ikke noe token for dempet bakgrunn, bare «dempet lag» (D:295-299) |
| 17 | blind | Fokusringen sjekkes ikke automatisk | low | Kravet er eksplisitt (2 px `accent-ink`, 2 px avstand); én Tab-test er billig → patch |
| 18 | blind | `prefers-reduced-motion` sjekkes ikke automatisk | low | Ren CSS-regel uten logikk; test gir lite → avvist |

## Design Notes

Attributtverdiene er de samme som i skjemaet (`blå`, `mørk`), uten oversetting til ASCII: CSS-selektorer som `[data-tema="blå"]` virker, og én sannhet for verdiene er enklere enn en tabell som kan gli fra hverandre. Etter innlasting eier butikken attributtene via `tema-synk`; skriptet gjør bare første tegning. Gløden (mockup `key-oppgaver.html:16`):

```css
background: radial-gradient(120% 340px at 50% 0%,
  color-mix(in srgb, var(--accent) var(--glow), transparent), transparent 70%),
  var(--surface-base);
```

`--glow` er 75 % i lys og 30 % i mørk modus.

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm run build` -- expected: ingen feil
- `npm run test:e2e` -- expected: alle grønne på mobil og PC
- `npm test` -- expected: grønt hos noen med Vitest (blokkert av Smart App Control på Lenas maskin; ingen nye Vitest-tester trengs i denne storyen)
- `git grep -n "localStorage" -- ':!docs' ':!.logs' ':!*.md' ':!tests'` -- expected: bare `lib/storage/`

**Manual checks:**
- Last `/` på nytt med rosa + mørk lagret: ingen blink av lys/blå
- Mobil og PC i nettleseren: menyene, fokusringen med Tab, banneret og dialogen

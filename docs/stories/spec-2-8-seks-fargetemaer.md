---
title: 'Story 2.8 (Bør): Seks fargetemaer'
type: 'feature'
created: '2026-11-28'
status: 'done'
baseline_commit: '06614e8ce5b7400d44b85d84171ad72eafe8dc38'
route: 'oneshot'
story_key: '2-8-bør-seks-fargetemaer'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Temaene finnes i CSS, skjemaet og temaskriptet, men studenten kan ikke velge dem. Appen er alltid blå.

**Approach:** En temavelger (`theme-swatch`) i Innstillinger → Utseende under modusvelgeren: seks runde fargeprøver på 36 px (trykkflate ≥ 44 px), hver i sin egen pastellfarge. Den valgte har ring i `accent-ink` og hake. Et trykk kaller en ny butikkommando `settTema`, som lager nye objekter (som `settModus`), så aksentfargene byttes med én gang og valget lagres. Temaskriptet fra 1.4 setter det lagrede temaet før første tegning. Fargene i prøvene hentes fra temaenes CSS-tokener, ikke fra kopierte hex-verdier. Hver prøve har navnet som tilgjengelig navn (Blå, Oransje, Lilla, Gul, Grønn, Rosa) og `aria-pressed`, i en gruppe med navnet «Tema». Tester: Vitest for `settTema`; Playwright for at et trykk bytter `data-tema` og huskes etter omlasting, ring og hake på valgt prøve, og axe på Innstillinger i alle temaer i lys og mørk modus.

</frozen-after-approval>

## Implementation Notes

- `lib/store/index.ts`: `settTema(tema)`, laget som `settModus` (nye objekter, ingenting ved samme tema, før innlasting eller med sperret skriving). Vitest i `tests/lib/butikk.test.ts`.
- `app/globals.css`: temablokkene bruker nå `[data-tema="…"]` i stedet for `:root[data-tema="…"]`, og blå har fått en egen blokk. Da kan hver fargeprøve få `data-tema` og vise sin egen pastell fra tokenet, uten kopierte hex-verdier. Spesifisiteten er den samme som `:root`, og blokkene står etter den, så `<html>` oppfører seg som før.
- `components/innstillinger.tsx`: `Temavelger` under `Modusvelger` i Utseende, som en gruppe med navnet «Tema» og knapper med `aria-pressed` og `aria-label` (som modusvelgeren, men navnet står i `aria-label` fordi prøvene ikke har synlig tekst). Ringen er `ring-2 ring-accent-ink ring-offset-2`; haken er `HakeIkon` (ny i `components/ikoner.tsx`) i `text-on-pastel`. Prøvene har kant i `border-input`, så de skiller seg fra den hvite flaten (WCAG 1.4.11).
- `tests/e2e/innstillinger.spec.ts`: seks prøver med riktig pastell, 36 px og trykkflate ≥ 44 px; Rosa gjelder straks, har ring og hake, lagres, gjelder fra første tegning etter omlasting og følger med til Oppgaver. axe i alle temaer i lys og mørk modus dekkes av den eksisterende løkka i `tests/e2e/tema.spec.ts` (`/innstillinger` er med).
- Verifisert: lint, typecheck og build uten feil; `npm test` 349/350 (kjent CRLF-feil); `npx playwright test --workers=1` 158 bestått, 16 hoppet over med vilje.

## Review Triage Log

| # | Funn | Verdikt | Evidens / rute |
|---|---|---|---|
| 1 | Prøvene uten kant har under 3:1 mot hvitt (Gul, Oransje) | medium | WCAG 1.4.11; axe sjekker ikke dette → patch (`border border-border-input`) |
| 2 | Blås hex-verdier står to steder i `globals.css` | low | Direkte retting → patch (`:root, [data-tema="blå"]`) |
| 3 | Standardtemaet «blå» er hardkodet, og velgeren viser feil før innlasting | false | Sidene vises først når `status` er `klar` og `nå` er satt (`AppTilstand`), så `dokument` finnes alltid i velgeren |
| 4 | Testen for første tegning kan bestå uten temaskriptet | low | Samme mønster som modustesten, og temaskriptet er dekket i `tema.spec.ts` → avvist |
| 5 | Tastatur og ring i mørk modus testes ikke | low | Vanlige `<button>`; ringen skilles av `ring-offset` (sett på skjermbilde i mørk modus) → avvist |
| 6 | Testen sjekker bredde, ikke høyde | low | Direkte retting → patch |
| 7 | Kommentaren om rekkefølge på `TEMANAVN` er misvisende | low | Direkte retting → patch |
| 8 | Notatet sier «samme mønster», men navnet ligger i `aria-label` | low | Notatet rettet; valgt prøve vises med ring og hake, ikke bare farge → avvist |
| 9 | Status henger etter | false | Settes til `review` når storyen leveres |
| 10 | Brede `[data-tema]`-selektorer kan påvirke senere elementer | low | Står i kommentaren i `globals.css` → avvist |

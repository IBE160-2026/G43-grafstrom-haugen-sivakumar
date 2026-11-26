---
title: 'Story 1.1: Gjør prosjektet klart etter arkitekturen'
type: 'chore'
created: '2026-11-26'
status: 'done'
baseline_commit: '4ebf29c210e32420bb98453c09670564678d545b'
route: 'dispatch'
story_key: '1-1-gjør-prosjektet-klart-etter-arkitekturen'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Prosjektet er fortsatt create-next-app med Prisma, gammel SDK, ingen testoppsett og Next som lytter på 0.0.0.0. De andre sporene kan ikke starte før pakker, mapper og testkommandoer følger arkitekturen.

**Approach:** Oppdater `package.json` til Stack-tabellen i arkitekturen, legg til Vitest- og Playwright-oppsett som går grønt uten tester, bind Next til `127.0.0.1`, utvid `.env.example`, erstatt startfilene med en nøytral norsk side og opprett mappene fra Structural Seed.

## Boundaries & Constraints

**Always:** Eksakte versjoner fra arkitekturen (zustand 5.1.0, zod 4.6.7, server-only 0.0.1, @anthropic-ai/sdk 1.14.0, vitest 5.1.2, vite 8.4.0, @playwright/test 1.65.1, @axe-core/playwright 4.14.1, @types/node ^24). `engines.node` `>=22.12` (besluttet av Abhira 2026-11-26: Vitest 5.1.2 og vite 8.4.0 krever 22.12+; strammere enn `>=22` i storyen og arkitekturen). `dev` og `start` med `-H 127.0.0.1`. Norsk tekst. Les `node_modules/next/dist/docs/` før Next-filer endres.

**Never:** Ingen funksjonalitet fra senere stories (skjema, butikk, tema, Poppins, ruter utover `/`). Ingen ekstra pakker (jsdom, React Testing Library, vite-tsconfig-paths). Ingen `NEXT_PUBLIC_`-variabler. Ingen endring i `tests/ki-testsett/`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Tom testmappe, Vitest | `npm test`, ingen `*.test.ts` | Avslutter med kode 0 | `passWithNoTests` |
| Tom testmappe, Playwright | `npm run test:e2e`, ingen spec | Avslutter med kode 0 | `--pass-with-no-tests` |
| Uten nøkkel | Ingen `.env.local` | `npm run dev` starter og `/` vises | N/A |
| Fra annen maskin | Forespørsel til maskinens LAN-IP:3000 | Ingen tilkobling | Bundet til 127.0.0.1 |

</frozen-after-approval>

## Code Map

- `package.json` -- navn `studieliste` (bytt til `duenext`); fjern `prisma`, `@prisma/client`; scripts mangler test
- `package-lock.json` -- regenereres av `npm install`, ikke håndredigeres
- `.env.example` -- har bare `ANTHROPIC_API_KEY`; behold teksten, legg til `KI_MOCK`
- `.gitignore` -- dekker allerede `.env.*` med `!.env.example`, `test-results/`, `playwright-report/`; ingen endring trengs
- `app/layout.tsx` -- Geist-fonter og `lang="en"`; erstatt med minimal norsk layout (fonter kommer i 1.4)
- `app/page.tsx`, `public/*.svg` -- create-next-app-innhold; erstatt side, slett bildene
- `app/globals.css` -- behold `@import "tailwindcss"`, fjern Geist-variablene; farger kommer i 1.4
- `tsconfig.json` -- alias `@/*` → `./*`; Vitest må speile det
- `README.md` -- adresse `localhost:3000` → `127.0.0.1:3000`, mangler testseksjon og «Struktur»-mappene
- Ingen kildefil importerer Prisma (sjekket), bare `package.json`

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- sett navn, `engines`, avhengigheter etter Always; scripts `dev`/`start` med `-H 127.0.0.1`, `test: vitest run`, `test:e2e: playwright test --pass-with-no-tests`; kjør `npm install` -- arkitekturens Stack
- [x] `vitest.config.mts` -- `environment: 'node'`, `include: ['tests/kjerne/**/*.test.ts']`, `passWithNoTests: true`, alias `@` = `fileURLToPath(new URL('./', import.meta.url))` (ESM, ikke `__dirname`) -- kjernetester uten DOM
- [x] `playwright.config.ts` -- `testDir: 'tests/e2e'`, egen port: `webServer` `npm run dev -- -p 3001` med `env: { KI_MOCK: '1' }`, `baseURL` `http://127.0.0.1:3001`, `reuseExistingServer: false`, prosjekter for chromium mobil og desktop -- testene treffer aldri en dev-server uten mock-KI
- [x] `.env.example` -- legg til `KI_MOCK=` med norsk kommentar om at `1` bare brukes i tester -- AD-14
- [x] `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `public/` -- `<html lang="nb" suppressHydrationWarning>`, tittel «dueNext», nøytral side «dueNext er under bygging.»; slett SVG-ene -- startfilene erstattes
- [x] `kjerne/`, `lib/`, `server/`, `components/`, `tests/kjerne/`, `tests/e2e/` -- opprett med `.gitkeep` -- Structural Seed
- [x] `README.md` -- `127.0.0.1:3000`, Node 22.12 eller nyere (24 eller 26 anbefales), appen virker uten nøkkel, seksjon «Tester» (`npm test`, `npx playwright install chromium`, `npm run test:e2e`), oppdater «Struktur» -- NFR-1

**Acceptance Criteria:**
- Given den nye `package.json`, when `npm ls prisma @prisma/client` kjøres, then finnes ingen av dem
- Given prosjektet, when `npm run build` og `npm run lint` kjøres, then går begge uten feil
- Given `npm run dev`, when `http://127.0.0.1:3000` åpnes, then vises den norske siden med `lang="nb"`

## Implementation Notes

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Evidens / rute |
|---|---|---|---|---|
| 1 | edge | `engines` `>=22.12` slipper inn Node 23/25 | medium | Vitest 5.1.2 krever `^22.12 \|\| ^24 \|\| >=26`. `engines` står i den frosne delen; patch i README |
| 2 | edge | README sier «22.12 eller nyere» | medium | Samme rot som 1 → patch |
| 3 | edge+blind | `passWithNoTests`/`--pass-with-no-tests` skjuler feil glob senere | low | Ingen tester ennå; tiltak hører til første test → defer |
| 4 | edge | Vitest finner ikke `*.test.tsx` | false | Kjernen har ingen React (AD-1), så kjernetester er `.ts` |
| 5 | edge+blind | webServer standard 60 s kan gå ut ved kald kompilering | low | Billig direkte rettelse → patch (`timeout: 120_000`) |
| 6 | edge | Port 3001 opptatt | false | Playwright feiler høylytt; korrekt oppførsel |
| 7 | edge | `KI_MOCK=1` i `.env.local` gir stille mock | maybe-false | Ingen kode leser `KI_MOCK` ennå; avgjøres i story 4.2 → defer |
| 8 | edge+blind | `suppressHydrationWarning` skjuler feil | low | Påkrevd av AD-16, gjelder bare attributter på `<html>`; avvist |
| 9 | edge | Uten body-font vises serif | low | Midlertidig plassholderside; typografi eies av 1.4; avvist |
| 10 | blind | Lockfil mangler i diffen | false | Utelatt med vilje (generert); `npm ls` bekreftet versjoner og at Prisma er borte |
| 11 | blind | e2e-serveren har `ANTHROPIC_API_KEY` fra `.env.local` | maybe-false | AD-14: mock erstatter Claude-kallet når `KI_MOCK=1`; avhenger av rekkefølgen i 4.2/4.3 → defer |
| 12 | blind | `engines` håndheves ikke uten `engine-strict` | low | Samme rot som 1; README dekker; avvist |
| 13 | blind | `@types/node` ^24 over Node 22-gulvet | low | Påkrevd av arkitekturens Stack; avvist |
| 14 | blind | Mangler `typecheck`-skript; `tsc` feiler på ren klone | medium | `LayoutProps` genereres i `.next/types`; `next typegen` finnes → patch |
| 15 | blind | Mangler CI-innstillinger i Playwright | low | Ingen CI i v1 (arkitekturen); avvist |
| 16 | blind | README mangler `--with-deps` for Linux | low | Gruppa bruker Windows/Mac; avvist |
| 17 | blind | «kan bare nås fra din egen maskin» gjelder bare npm-skriptene | low | README instruerer npm-skriptene; avvist |
| 18 | gap | `lang="nb"` ikke testet automatisk | medium | Ingen e2e-test finnes → patch (`tests/e2e/forside.spec.ts`) |
| 19 | gap | 127.0.0.1-binding ikke testet automatisk | low | Miljøavhengig å teste; manuell curl i Verification → defer |

## Design Notes

Playwright-prosjektene bruker `devices['Pixel 7']` og `devices['Desktop Chrome']`, så mobil og PC testes fra første story uten ekstra nettlesere. `vite` pinnes til 8.4.0 (innenfor Vitest 5.1.2 sin peer-range `^6 || ^7 || ^8`), fordi arkitekturen ikke angir versjon. Playwright bruker port 3001 med `reuseExistingServer: false`, slik at en vanlig `npm run dev` uten `KI_MOCK` aldri gjenbrukes og KI-testene aldri går mot ekte Claude.

Utover ordlyden i storyen, men i tråd med arkitekturen: navnet `duenext`, `suppressHydrationWarning` (AD-16) og Playwright-prosjektene for mobil og PC. Ingen av dem tar beslutninger fra 1.2–1.4.

## Verification

**Commands:**
- `npm install` -- expected: ingen ERESOLVE-feil
- `npm ls prisma @prisma/client` -- expected: tomt
- `npm ls vitest vite` -- expected: bare vitest 5.1.2 og vite 8.4.0
- `npm test` -- expected: kode 0, «No test files found» tillatt
- `npm run test:e2e` -- expected: kode 0 (krever `npx playwright install chromium`)
- `npm run lint` -- expected: ingen feil
- `npm run build` -- expected: vellykket bygg (må kjøres før `tsc`, fordi `LayoutProps` genereres i `.next/types`)
- `npx tsc --noEmit` -- expected: ingen typefeil
- `npm start`, så `curl http://127.0.0.1:3000` og `curl http://<LAN-IP>:3000` -- expected: første svarer 200, andre får ingen tilkobling

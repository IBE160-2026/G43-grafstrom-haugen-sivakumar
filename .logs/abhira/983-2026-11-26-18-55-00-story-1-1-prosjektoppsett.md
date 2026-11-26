# Story 1.1: prosjektoppsett

## 2026-11-26 kl. 18:55 — Abhira

### Oppgave
Bygge story 1.1 «Gjør prosjektet klart etter arkitekturen» med `bmad-build`, slik at de andre sporene kan starte når 1.2 er ferdig.

### Plan
- Spec: [spec-1-1-gjor-prosjektet-klart-etter-arkitekturen.md](../../docs/stories/spec-1-1-gjor-prosjektet-klart-etter-arkitekturen.md), med epic-kontekst i [epic-1-context.md](../../docs/stories/epic-1-context.md).
- Specen ble gjennomgått av en subagent før godkjenning. Rettet: ESM-alias i Vitest, egen e2e-port 3001 med `KI_MOCK=1`, flere kontrollkommandoer.
- Abhira bestemte `engines.node` `>=22.12` (strammere enn `>=22` i storyen og arkitekturen), fordi Vitest 5.1.2 og vite 8.4.0 krever det.
- Bygget av en subagent, deretter tre uavhengige gjennomganger (blind, grensetilfeller, verifiseringshull). 19 funn er vurdert i specens Review Triage Log; 4 rettet, 3 utsatt til `docs/stories/deferred-work.md`.

### Resultat
- Commit `c9c1b94` (pushet til `origin/main` sammen med loggen): Prisma fjernet; zustand 5.1.0, zod 4.6.7, server-only, SDK 1.14.0, vitest 5.1.2, vite 8.4.0, Playwright 1.65.1, axe 4.14.1, @types/node ^24; `dev`/`start` med `-H 127.0.0.1`; skript `test`, `test:e2e`, `typecheck`; `vitest.config.mts`, `playwright.config.ts` (mobil + PC, port 3001); `KI_MOCK=` i `.env.example`; norsk plassholderside med `lang="nb"`; mappene fra Structural Seed; README oppdatert; første e2e-test `tests/e2e/forside.spec.ts`.
- Verifisert: `npm ls` (ingen Prisma, bare vitest 5.1.2/vite 8.4.0), `npm test`, `npm run lint`, `npm run build`, `npm run typecheck` og `npm run test:e2e` (2/2) grønt. `npm start` svarte på 127.0.0.1 og ikke på LAN-IP.
- Sprint-status: story 1.1 står på `review`, Epic 1 på `in-progress`.
- Løser de åpne punktene om `package.json` og `KI_MOCK` fra arkitektur-økta.
- Sikkerhet (etter 1.1, besluttet av Abhira): `next` og `eslint-config-next` oppgradert fra 16.3.5 til 16.4.6 (kritiske hull, blant annet fjernkjøring av kode), som gir `sharp` 0.35.5; `npm audit fix` for ESLint-verktøyene. `npm audit`: 0 funn. Stack-tabellen i arkitekturen og epic-1-context oppdatert. Alle kontroller grønne på nytt. Commits `39a8bc7` og `0472795` (Next-blokken i `AGENTS.md`).

### Åpne punkter
- Lena går gjennom story 1.1 (`bmad-code-review` eller `bmad-walkthrough`) før den settes til `done`.
- Gruppa må vite at Next nå er 16.4.6 (ikke 16.3.5 som i arkitekturen før), og alle må kjøre `npm install` etter `git pull`.
- Bare én `next dev` kan kjøre per prosjekt: stopp egen dev-server før `npm run test:e2e`. Hver må kjøre `npx playwright install chromium` én gang.
- Utsatt fra gjennomgangen (se `docs/stories/deferred-work.md`): fjern «pass with no tests»-flaggene når første test finnes; sørg i 4.2/4.3 for at mock-KI sjekkes før nøkkelen; vurder automatisk sjekk av 127.0.0.1-bindingen.

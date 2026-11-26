---
title: Gjennomgang – versjoner og teknologivalg
gjelder: ARCHITECTURE-SPINE.md (dueNext, 2026-11-26)
dato: 2026-11-26
linse: Er hver beslutning sjekket mot nettet, prosjektet eller pakken, og ikke bare skrevet fra hukommelsen?
---

# Gjennomgang: versjoner og teknologivalg

## Dom

Stort sett godt sjekket. Versjonene i Stack-tabellen stemmer med npm-registeret i dag, og påstandene om Next 16 stemmer med dokumentasjonen som er installert. Én detalj i AD-7 er likevel feil mot SDK-en: `fallbacks: "default"` finnes bare i **beta**-API-et og kan ikke brukes med `client.messages.parse` slik AD-7 beskriver. I tillegg mangler en installasjonsliste, og `@types/node` er for gammel for Vitest 5.

## Slik ble det sjekket

- `npm view <pakke> version` og `peerDependencies`/`engines` mot registeret 2026-11-26.
- `package.json` og `node_modules/*/package.json` for det som faktisk er installert.
- `@anthropic-ai/sdk@1.14.0` ble lastet ned med `npm pack` til en midlertidig mappe (ikke installert i prosjektet). Typefilene ble lest direkte.
- `node_modules/next/dist/docs/` (Next 16.3.5) for route handlers, `server-only`, `'use client'` og Turbopack.

## Funn

### F1 – `fallbacks: "default"` finnes ikke i `client.messages.parse` (høy)

**Påstand (AD-7):** «Kallet bruker `client.messages.parse` … Server-side fallback (`fallbacks: "default"`) er på.»

**Hva SDK 1.14.0 viser:**
- `fallbacks?: BetaFallbacksParam | null` (`Array<BetaFallbackParam> | 'default'`) står bare i `resources/beta/messages/messages.d.ts`. I `resources/messages/messages.d.ts` (ikke-beta) nevnes `fallbacks` bare i `ThreadUnsupportedFeatureName`. Feltet finnes altså ikke i parameterne til `client.messages.parse`.
- Beta-header-listen har `server-side-fallback-2026-06-01` og `server-side-fallback-2026-07-01`. Funksjonen er altså en beta som må slås på.
- Beta-varianten heter `client.beta.messages.parse(...)`. Den bruker hjelperen `betaZodOutputFormat` fra `@anthropic-ai/sdk/helpers/beta/zod`, ikke `zodOutputFormat` fra `helpers/zod`.

**Følge:** En story som følger AD-7 ordrett, får TypeScript-feil, eller så forsvinner feltet uten at noen merker det. Notatet i `.memlog.md` om claude-api-skillen (cachet 2026-11-03) dekker `messages.parse` og `zodOutputFormat`, men det står ingenting om at fallback er beta.

**Konsekvens for design:** Med fallback slått på kan et avslag (refusal) besvares av en annen modell enn `claude-sonnet-5-5`. Da treffer AD-7s regel om at «`stop_reason: "refusal"` gir reserveløsningen» sjeldnere, og Å-1 («modellen er claude-sonnet-5-5») stemmer ikke helt. Personvernteksten kan også bli berørt hvis den navngir modellen.

**Forslag:** Velg ett av to:
1. **Fjern fallback** (anbefalt for en demo). Bruk `client.messages.parse` + `zodOutputFormat` (ikke-beta, stabilt). Ved avslag brukes reserveløsningen.
2. **Behold fallback.** Skriv i AD-7: `client.beta.messages.parse` med `betas: ['server-side-fallback-2026-07-01']`, `fallbacks: 'default'` og `betaZodOutputFormat` fra `@anthropic-ai/sdk/helpers/beta/zod`. Legg også inn en setning om at svaret kan komme fra en annen modell.

### F2 – `@types/node ^20` passer ikke med Vitest 5.1.2 (middels)

- Vitest 5.1.2 har den valgfrie peer-avhengigheten `@types/node: "^22.0.0 || >=24.0.0"`. Prosjektet har `@types/node` 20.19.43 (`^20`) installert. Når en valgfri peer-avhengighet først er installert, må den passe i området. Ellers kan `npm install -D vitest@5` stoppe med ERESOLVE.
- Node lokalt er 26.7.0, så `@types/node ^20` beskriver uansett feil runtime. Siste `@types/node` er 26.6.11.
- Vitest 5.1.2 krever `node ^22.12.0 || ^24 || >=26`, så Node 26.7.0 er OK. `vite` er en påkrevd peer-avhengighet (`^6.4 || ^7 || ^8`). npm 11 installerer den automatisk, men den bør stå i lista.

**Forslag:** Legg til i Stack eller i en oppsett-story: «`@types/node` oppgraderes til `^24` eller `^26` sammen med Vitest».

### F3 – Stack-tabellen sier ikke hva som må installeres (middels)

Tabellen viser versjoner som om de allerede var i prosjektet. `package.json` inneholder i dag bare next, react, react-dom, `@anthropic-ai/sdk ^0.126.0`, prisma og Tailwind/TS/ESLint. Disse **mangler**: `zustand`, `zod` (bare transitivt 4.6.5 via SDK og eslint-plugin-react-hooks), `server-only`, `vitest` og `@playwright/test`. Spine nevner bare SDK-oppgraderingen og at Prisma fjernes.

- `zod` som direkte avhengighet er viktig fordi kjernen (AD-1) importerer den. Hvis den bare kommer transitivt, kan versjonen endre seg når SDK-en oppgraderes.
- `server-only` er valgfri ifølge Next-dokumentasjonen («installing `server-only` … is optional»). Pakka er 0.0.1 fra 2022 og fortsatt gjeldende. AD-6 bruker den, så den bør installeres eksplisitt.

**Forslag:** Legg inn en linje under Stack: «Legges til: zustand@^5.1.0, zod@^4.6.7, server-only, -D vitest@^5.1.2 vite, -D @playwright/test@^1.65.1. Oppgraderes: @anthropic-ai/sdk@^1.14.0, @types/node. Fjernes: prisma, @prisma/client.»

### F4 – Faste versjoner er ikke de nyeste, og det står ikke at det er et valg (lav)

| Pakke | Spine | Installert | Nyeste i registeret |
| --- | --- | --- | --- |
| next | 16.3.5 | 16.3.5 | 16.4.6 |
| react / react-dom | 19.2.8 | 19.2.8 | 19.3.1 |
| typescript | 5.x | 5.9.3 | 7.0.2 |
| tailwindcss | 4.x | 4.3.3 | 4.3.5 |

At spine følger det som er installert, er et forsvarlig valg, og det er sjekket mot prosjektet. Men `.memlog.md` viser bare at versjonene ble lest lokalt for next/react. Det står ikke at nyere versjoner finnes og at man bevisst blir værende. TypeScript 7 er en ny hovedversjon. Å holde seg på 5.x er fornuftig, men bør skrives som et valg.

**Forslag:** Skriv én setning: «Vi blir på versjonene som er installert (Next 16.3.x, React 19.2.x, TS 5.x) gjennom v1. Oppgraderinger gjøres som egen story.»

### F5 – SDK 0.126 → 1.x er en hovedversjon (lav)

Det finnes ingen kode i `app/` eller `tests/` som bruker SDK-en i dag, så oppgraderingen er trygg nå. Spine bør likevel si at endringsloggen ikke er lest. Kode eller eksempler fra 0.x-dokumentasjon kan være feil.

## Bekreftet og i orden

| Påstand | Kilde | Status |
| --- | --- | --- |
| `@anthropic-ai/sdk` 1.14.0 er siste versjon | npm view | OK |
| `client.messages.parse` finnes og gir `parsed_output` | `resources/messages/messages.d.ts` l. 237, `helpers/zod.d.ts` | OK |
| zod-hjelper `@anthropic-ai/sdk/helpers/zod` (`zodOutputFormat`) | export `./helpers/*`, `helpers/zod.d.ts` | OK |
| SDK 1.14.0 og zod 4 | peer `zod: ^3.25.0 \|\| ^4.0.0`, hjelperen importerer `zod/v4` | OK |
| `effort` (lav) | `OutputConfig.effort: 'low' \| … \| 'max'`, settes som `output_config.effort` | OK (skriv `output_config: { effort: 'low' }` i AD-7 for å være presis) |
| `timeout` i millisekunder, `maxRetries` | `client.d.ts` (standard 10 min / 2 forsøk) | OK, så `maxRetries: 0` er nødvendig |
| `stop_reason: "refusal"` | `StopReason` i messages.d.ts | OK |
| `claude-sonnet-5-5` | `Model`-unionen i SDK-en (og bekreftet av oppdragsgiver) | OK |
| zustand 5.1.0 og React 19 | peer `react >=18` (valgfri), `use-sync-external-store` valgfri | OK |
| zod 4.6.7 | npm view | OK |
| vitest 5.1.2 | npm view, engines passer Node 26.7.0 | OK (se F2) |
| @playwright/test 1.65.1 | npm view, `node >=20`, Next 16.3.5 peer `^1.51.1` | OK |
| server-only 0.0.1 | npm view, Next-dok. 05-server-and-client-components.md | OK |
| Route handler `app/api/ki/route.ts` med `POST` | Next-dok. 15-route-handlers.md, file-conventions/route.md | OK |
| Turbopack er standard i `next dev`/`next build` | Next-dok. 01-installation.md l. 151–156 | OK |
| Node 26.7.0 lokalt | `node -v` | OK |
| `app/` i roten (ikke `src/`) | prosjektmappa | OK |

## Ikke vurdert

- Om `claude-sonnet-5-5` støtter `effort` og server-side fallback (fallback-dokumentasjonen sier at noen modeller ikke gjør det). Det bør prøves med ett ekte kall i F2-storyen.
- Pris ($2/$10 per MTok) i `.memlog.md` er ikke sjekket på nytt.

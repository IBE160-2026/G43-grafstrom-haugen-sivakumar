# Utsatt arbeid

- source_spec: `docs/stories/spec-1-1-gjor-prosjektet-klart-etter-arkitekturen.md`
  summary: Fjern `passWithNoTests` i `vitest.config.mts` og `--pass-with-no-tests` i `test:e2e` når første test finnes i hver mappe.
  evidence: Med flaggene går `npm test` og `npm run test:e2e` grønt selv om en feil glob eller mappe gjør at ingen tester kjøres.
- source_spec: `docs/stories/spec-1-1-gjor-prosjektet-klart-etter-arkitekturen.md`
  summary: Sørg i story 4.2/4.3 for at mock-KI sjekkes før nøkkelen brukes, og at `KI_MOCK=1` aldri gir stille mock ved vanlig bruk (uverifisert, middels).
  evidence: Playwrights dev-server laster `.env.local` med `ANTHROPIC_API_KEY`; garantien om at e2e aldri bruker ekte Claude hviler på rekkefølgen i `server/`. Avgjøres når ruta og mocken bygges.
- source_spec: `docs/stories/spec-1-1-gjor-prosjektet-klart-etter-arkitekturen.md`
  summary: Vurder en automatisk sjekk av at `dev` og `start` bare lytter på 127.0.0.1.
  evidence: Fjernes `-H 127.0.0.1`, går alle tester fortsatt grønt; i dag sjekkes det bare med manuell curl.

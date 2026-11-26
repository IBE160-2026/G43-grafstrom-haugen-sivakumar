# G43 — AI’ll Be Back

Gruppeprosjekt i **IBE160 Programmering med KI** ved Høgskolen i Molde, høsten 2026 (15 studiepoeng).

Repoet inneholder gruppens applikasjon, dueNext, og dokumentasjon av utvikling, testing og kvalitetssikring med KI. dueNext er en norsk oppgaveapp for studenter der KI foreslår etikett, prioritet og sammendrag. Se [product brief](docs/product-brief.md).

## Medlemmer

- Lena S Grafstrom
- Sabrina Haugen
- Abhira Sivakumar
- Stine-Sofie Wisnes Olsen

## Kom i gang

Du trenger [Node.js](https://nodejs.org) 22.12 eller nyere og Git. Versjon 24 eller 26 anbefales. Oddetallsversjonene 23 og 25 virker ikke med testene.

### 1. Installer pakkene

```bash
npm install
```

### 2. Sett opp `.env.local` (valgfritt)

Appen bruker Claude API fra Anthropic til KI-forslagene. **Appen fungerer også uten API-nøkkel.** Da lages forslagene av en enkel regelbasert reserveløsning i stedet for Claude. Hopp over dette steget hvis du ikke har en nøkkel.

1. Kopier malen `.env.example` til en ny fil som heter `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   I PowerShell på Windows:

   ```powershell
   Copy-Item .env.example .env.local
   ```

2. Lag en API-nøkkel på [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).
3. Åpne `.env.local` og lim inn nøkkelen rett etter `=`, uten mellomrom eller anførselstegn:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

4. Lagre filen. Kjører utviklingsserveren allerede og tar ikke i bruk nøkkelen, start den på nytt.

`.env.local` er utelatt fra Git i `.gitignore`, så nøkkelen blir aldri lastet opp til GitHub. Legg aldri en ekte nøkkel i `.env.example`, i koden eller i en commit. Hver person som vil bruke Claude, må ha sin egen `.env.local` på maskinen sin.

### 3. Start appen

```bash
npm run dev
```

Åpne [http://127.0.0.1:3000](http://127.0.0.1:3000) i nettleseren. Appen virker uten API-nøkkel, og den kan bare nås fra din egen maskin.

## Tester

Enhetstester for kjernen (Vitest):

```bash
npm test
```

Typesjekk (genererer først rutetypene til Next):

```bash
npm run typecheck
```

Ende-til-ende-tester (Playwright). Installer nettleseren én gang først:

```bash
npx playwright install chromium
npm run test:e2e
```

Playwright starter selv en egen utviklingsserver på port 3001 med falsk KI (`KI_MOCK=1`), så testene bruker aldri ekte Claude.

## Struktur

| Mappe | Innhold |
|---|---|
| `app/` | Next.js-applikasjonen (sider og ruter) |
| `components/` | Felles React-komponenter |
| `kjerne/` | Rene funksjoner for domenet, uten klokke, nettleser eller nettverk |
| `lib/` | Butikk, lagring og klokke |
| `server/` | Kode som bare kjører på serveren |
| `docs/` | Planleggingsdokumenter, blant annet product brief |
| `tests/kjerne/` | Vitest-tester for kjernen |
| `tests/e2e/` | Playwright-tester for hele appen |
| `tests/ki-testsett/` | Fast testsett med 20 oppgaver for å måle KI-forslagene |
| `.logs/` | Sesjonslogger og åpne punkter per gruppemedlem |

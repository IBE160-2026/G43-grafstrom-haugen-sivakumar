---
title: Gjennomgang av ARCHITECTURE-SPINE.md – rubrikk og avstemming mot kildene
reviewed: docs/architecture/architecture-G43-grafstrom-haugen-sivakumar-2026-11-26/ARCHITECTURE-SPINE.md (status draft, 2026-11-26)
sources:
  - docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/prd.md
  - docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/DESIGN.md
  - docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/EXPERIENCE.md
  - package.json, app/, .env.example, node_modules/next/dist/docs
date: 2026-11-26
---

# Gjennomgang: rubrikk og avstemming mot kildene

## Dom

Spinen er solid i kjernen (ren domenekjerne, én butikk, ett versjonert lagringsdokument, én KI-rute, utdrag og reserveløsning er godt låst, og Å-1, Å-5 og Å-8 er avgjort), men den er **ikke klar til godkjenning ennå**. Fire høye funn må rettes først: serveren lytter på hele nettverket med gruppens nøkkel, rutingen mellom mobil og PC er ikke bestemt, tema og modus bryter med AD-3, og leveranseskivene og kuttrekkefølgen er ikke bundet.

Ingen kritiske funn. 4 høye, 7 middels, 5 lave.

## Det som fungerer

- **Divergenspunktene i domenet er godt dekket.** Regler i `kjerne/` (AD-1), én skrivevei (AD-2), ett lagringsdokument med `schemaVersion` og migrering (AD-3), eierskap til økter og serier (AD-4) og tidsmodellen (AD-5) er nettopp det som ellers ville sprikt mellom stories.
- **KI-grensen er tydelig.** Én route handler, `server-only`, zod-kontrakt i kjernen, faste reservegrunner, ingen logging av innhold (AD-6, AD-7). Det stemmer med Next 16-dokumentasjonen i `node_modules/next/dist/docs`.
- **De åpne spørsmålene fra PRD-en er håndtert.** Å-1 (claude-sonnet-5-5), Å-5 (localStorage) og Å-8 (14 dager, aldri etter fristdagen) er avgjort. Å-7 er utsatt til story, som PRD-en tillater.
- **Spinen bekrefter kodebasen i stedet for å motsi den.** Den bygger på create-next-app-skjelettet (Next 16.3.5, React 19.2.8, Tailwind 4) og fjerner Prisma, som er ubrukt og strider mot NFR-4.
- **Modellvalget er gyldig.** `claude-sonnet-5-5` er en gjeldende modell-ID, og `messages.parse` med zod finnes i SDK-en.

---

## Høy

### H-1 `next dev` og `next start` lytter på 0.0.0.0, så andre på nettverket kan bruke API-nøkkelen

**Funn.** AD-11 sier at v1 kjøres med `npm run dev` eller `npm run build && npm start` «på egen maskin», og at dette hindrer at andre bruker nøkkelen. Men Next 16 binder til `0.0.0.0` som standard (`node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md`, `-H` «Default: 0.0.0.0»). På skolens trådløse nett kan da hvem som helst nå `POST /api/ki` på port 3000 og bruke gruppens nøkkel. Det finnes ingen grense på serveren (AD-8 teller bare i nettleseren). Dermed holder ikke AD-11 det NFR-1 lover («slik at ingen andre kan bruke API-nøkkelen»).

**Retting.** Utvid regelen i AD-11:
- `package.json`: `"dev": "next dev -H 127.0.0.1"` og `"start": "next start -H 127.0.0.1"`.
- I tillegg, som et billig andre lag: `app/api/ki/route.ts` avviser forespørsler der `Host`/`Origin` ikke er `localhost` eller `127.0.0.1` (svarer med reservemarkering `avvist`).
- Ta med i Structural Seed eller Konvensjoner at dette ikke skal fjernes uten at AD-11 endres.

### H-2 Ruting og responsivt oppsett er ikke bestemt (mobil: egne sider, PC: detaljpanel)

**Funn.** EXPERIENCE.md → Responsive & Platform og Information Architecture krever at oppgavedetalj, hendelsesdetalj og skjema åpnes som **egne sider med tilbakepil** under 1024 px, men i **panelet til høyre** fra 1024 px (oppsett A). Det er et strukturelt valg som berører alle UI-stories. Structural Seed nevner bare `kalender/ arkiv/ innstillinger/ personvern/ personvernerklaering/`, og har ingen ruter for detalj, skjema, hendelse, søk eller førstegangsoppsett. To agenter vil løse dette ulikt: én med ruten `/oppgave/[id]`, en annen med valgt-ID i butikken og et panel som vises og skjules med CSS. Det samme gjelder førstegangsoppsettet: én story lager redirect i layout, en annen viser oppsettet som en modal på forsiden.

**Retting.** Legg til en AD, for eksempel «AD-12 Navigasjon og responsivt oppsett», som bestemmer:
- hvordan valgt element uttrykkes, for eksempel som søkeparameter (`?oppgave=<id>`, `?hendelse=<id>`, `?ny=oppgave|hendelse&dato=YYYY-MM-DD`) som samme komponent leser. Under `lg` vises den som side, og fra `lg` i panelet. Alternativt egne ruter med Next sine intercepting/parallel routes. Velg én av dem.
- at brytepunktene er Tailwinds standard `md` = 768 px og `lg` = 1024 px, som passer med DESIGN.md → Layout & Spacing. Egne brytepunkter skal ikke brukes.
- at førstegangsoppsettet er en egen rute, for eksempel `app/oppstart/`, og at én klientkomponent i layout sender dit når `profil`/`samtykke` ikke er besvart. Det gjelder også etter «Slett alle data» og etter import.
- Oppdater Structural Seed med disse rutene.

### H-3 Tema og lys/mørk modus strider mot AD-3 og gir blinking eller hydreringsfeil

**Funn.** Konvensjonen «Tema og lys/mørk modus settes med attributter på `<html>`» er riktig retning, men:
1. Temaet og modusen ligger i localStorage-dokumentet (AD-3, FR-60, FR-63). Med AD-10 leses dokumentet først etter hydrering, så siden blinker i feil tema (standard blå og lys) før riktig tema settes. Den vanlige løsningen er et lite blokkerende skript i `<head>` som leser localStorage før første tegning. Det bryter AD-3 («Bare `lib/storage/` leser og skriver localStorage»).
2. Når attributtene settes på `<html>` før React hydrerer, blir det hydreringsavvik hvis `suppressHydrationWarning` mangler.
3. Attributtnavn og verdier er ikke bestemt (for eksempel `data-tema="blaa|oransje|…"` og `data-modus="lys|mork|system"`), og heller ikke hvordan «Følg systemet» kobles til `prefers-color-scheme` (EXPERIENCE.md → Accessibility Floor).

**Retting.** Gjør dette til en egen regel, i AD-3 eller en ny AD:
- Et uttrykkelig unntak: `app/layout.tsx` har et lite inline-skript som bare *leser* `innstillinger.tema` og `innstillinger.modus` fra samme localStorage-nøkkel og setter `data-tema`/`data-modus` før første tegning. Skriptet ligger i `lib/storage/tema-skript.ts`, så det fortsatt eies av lagringsadapteren.
- `<html lang="nb" suppressHydrationWarning>`.
- Fastsatte attributtnavn og verdier. `data-modus="system"` løses i CSS med `@media (prefers-color-scheme: dark)`.
- Tokens: de seks temaene som CSS-variabler i `app/globals.css`, byttet med `[data-tema=…]`, og mørk modus med `[data-modus=mork]` og systemvarianten. Da kommer aliasene `accent`/`accent-ink` fra DESIGN.md bare ett sted.

### H-4 Leveranseskivene og kuttrekkefølgen er ikke bundet

**Funn.** PRD → Leveranseskiver sier at epics og stories følger tre skiver, at skive 3 kuttes først, og at Bør-kravene i skive 3 (FR-46–47, FR-52–53) kuttes før resten. Spinen nevner ikke skivene. Det gir tre konkrete divergenspunkter:
1. **Lagringsformatet.** Har `schemaVersion: 1` med `økter` og `hendelser` fra start, eller legges de til med en migrering i skive 3? En agent i skive 1 vil sannsynligvis utelate dem.
2. **KI-kontrakten.** Skive 2 trenger bare forslag til felt. Skive 3 legger til øktforslag og et eget kall, «Foreslå ny tid» (FR-53). AD-6 sier «samme form», men definerer ikke hvilke typer kall forespørselen kan ha. Uten det vil skive 3 enten bryte kontrakten eller lage en ny rute, som AD-6 forbyr.
3. **Bør-krav som kan kuttes.** FR-52-merker («⚠ Kolliderer», «⚠ Etter fristen») og `seriesId` (FR-46) må kunne utelates uten at noe annet brekker. Det krever at merkene er *avledet* i kjernen og ikke lagret, og at `seriesId` er valgfritt.

**Retting.**
- Legg en kolonne «Skive» til i Capability → Architecture Map (1, 2 eller 3, og Bør-merke).
- Lås i AD-4: `schemaVersion: 1` har alle samlingene fra start (tomme i skive 1). `seriesId` er valgfritt. Kollisjons- og fristmerker lagres ikke, men regnes ut av kjernen.
- Lås i AD-6: forespørselen er en diskriminert union i `kjerne/ki-kontrakt.ts`, for eksempel `{ type: "felt" } | { type: "felt+økter" } | { type: "nyTid" }`, og svaret har tilsvarende varianter. Skive 2 implementerer bare `felt`, men kontrakten er formet slik at skive 3 legger til varianter uten ny rute.
- En setning om kutt: når skive 3 kuttes, skal ingen kode i skive 1 eller 2 forutsette hendelser eller økter (PRD: «gjelder fra skive 3 er bygget»).

---

## Middels

### M-1 Samtykkeversjon og fastsatte tekster har ingen felles kilde

**Funn.** FR-35 og FR-36 krever at samtykket lagres «med dato og versjon av teksten», og at «en ny versjon av teksten krever nytt samtykke». AD-4 nevner bare objektet `samtykke`. Det står ikke hvor gjeldende tekstversjon ligger, eller hvordan gyldig samtykke avgjøres. Konvensjonen «Fastsatte tekster hentes ordrett fra EXPERIENCE.md» sier ikke *hvordan*, så agentene vil lime strengene inn direkte i komponentene. Da kan tekstene ikke testes samlet, og de vil drive fra hverandre. Det gjelder blant annet demo-advarselen, samtykketeksten, KI-påminnelsene, lagringsvarselet og import-, eksport- og slettedialogene.

**Retting.**
- Én modul for faste tekster, for eksempel `lib/tekster.ts` (eller `kjerne/tekster.ts`), med navngitte nøkler som kopieres ordrett fra EXPERIENCE.md. Komponentene og Playwright-testene bruker bare denne modulen.
- I samme modul eller i kjernen: `SAMTYKKE_TEKSTVERSJON` (for eksempel `"v2"`). Samtykket lagres som `{ svar: "ja" | "nei", dato: "YYYY-MM-DD", tekstversjon }`.
- En ren funksjon `kiErPå(samtykke, gjeldendeVersjon)` i kjernen, som er eneste kilde for om KI er på (brukes av AD-8 og FR-37-påminnelsene).

### M-2 Import, eksport og ødelagt lagringsdokument er for tynt beskrevet

**Funn.** AD-3 sier bare at eksport og import «bruker samme dokumentformat, uten samtykke». Kildene krever mer, og flere av kravene er arkitektur:
- Importen skal erstatte *alt* eller *ingenting* («Fila kunne ikke leses. Ingen data er endret.»). Det krever validering og migrering *før* noe skrives.
- En fil fra en eldre `schemaVersion` må gå gjennom samme migrering som ved lesing.
- Etter import skal KI-valget besvares på nytt, appen skal gå til førstegangsoppsettet eller KI-valget, og importerte oppgaver skal ikke sende noe til KI før teksten endres (FR-43, Flyt 7).
- Hva skjer når dokumentet i localStorage ikke består zod-valideringen ved oppstart? Overskrives det, kan studenten miste data uten å få beskjed.

**Retting.** Legg til i AD-3:
- `importer(fil)` validerer og migrerer hele fila i kjernen, og butikken bytter tilstand bare hvis det lykkes.
- Importen fjerner `samtykke` og ubesvarte `forslag`, og utløser aldri et KI-kall. Bare en kommando som endrer teksten kan gjøre det (se M-6).
- Eksportformatet er det samme JSON-dokumentet uten `samtykke`, med `schemaVersion`.
- Ugyldig dokument ved oppstart: rådata kopieres til en reservenøkkel (`…-ugyldig-<dato>`), appen starter tomt og viser lagringsbanneret eller en egen melding. Originalen overskrives aldri i stillhet.

### M-3 `KI_MOCK` er nevnt, men ikke definert

**Funn.** Konvensjonene sier at Playwright bruker `KI_MOCK`, og at fire tilfeller dekkes (NFR-6). Det står ikke hvor mocken ligger, hvordan en test velger tilfelle, eller hvordan NFR-5 («mock-KI som svarer etter 10 sekunder») skal testes. `.env.example` har bare `ANTHROPIC_API_KEY`, men NFR-2 sier at `.env.example` skal vise alle variablene. Det står heller ikke hvordan «nå» styres i e2e-testene (NFR-7 gjelder også flytene, for eksempel «Denne uken» på søndag og sletting etter 7 dager).

**Retting.**
- `KI_MOCK=gyldig|ugyldig|tomt|tidsavbrudd|treg` leses bare i `server/claude.ts`, som returnerer faste svar fra `tests/ki-mock/` i stedet for å kalle Claude. `treg` venter 10 s, til NFR-5.
- Legg `KI_MOCK=` til i `.env.example`, med en kommentar om at den bare er for tester.
- e2e-tider: Playwright `page.clock` setter «nå» i nettleseren. `lib/klokke.ts` bruker `Date`, så det virker uten egen kode.

### M-4 `fallbacks: "default"` krever beta-namespace og beta-header, ikke `client.messages.parse`

**Funn.** AD-7 sier `client.messages.parse` sammen med `fallbacks: "default"`. Ifølge Claude API-referansen er server-side fallback en beta-funksjon: den krever `betas: ["server-side-fallback-2026-07-01"]` på `client.beta.messages.*`. Agenten vil enten få en typefeil eller fjerne `fallbacks` i stillhet. I tillegg går `@anthropic-ai/sdk` fra 0.126 til 1.14. Det er et hovedversjonshopp som også kan endre API-versjonen. AD-7 sier heller ikke at en fallback-modell kan svare (`response.model` er da en annen), eller at en `refusal` i den endelige responsen betyr at hele kjeden avslo.

**Retting.** Skriv i AD-7: `client.beta.messages.parse({ betas: ["server-side-fallback-2026-07-01"], fallbacks: "default", output_config: { effort: "low", format: … } }, { timeout: 15_000, maxRetries: 0 })`. Sjekk at kallet typesjekker i SDK 1.14 før første KI-story. `stop_reason === "refusal"` på det endelige svaret gir `avvist`. Legg også til i Stack at oppgraderingen til 1.x gjøres i en egen story eller commit, med changelog.

### M-5 NFR-8, NFR-9 og NFR-10 (norsk, WCAG 2.1 AA, mobil og PC) styres ikke av noen regel

**Funn.** `binds` lister NFR-8–10, men ingen AD eller konvensjon sier hvordan de sikres, og de mangler i Capability-kartet. Kodebasen har i dag `<html lang="en">` (WCAG 3.1.1, NFR-8). Tilgjengelighet er et tverrgående krav som lett sklir mellom stories: `aria-live`-annonsering av KI-forslag, fokusfelle i dialoger og trykkflater på 44 px.

**Retting.** Legg til i Konvensjonene:
- `lang="nb"` på `<html>`.
- Tilgjengelighet: `@axe-core/playwright` kjøres i hver e2e-flyt, og nye brudd stopper testen. Én felles `aria-live`-region (komponent) brukes for annonseringer (EXPERIENCE.md → Accessibility Floor). Dialoger bruker én felles dialogkomponent med fokusfelle (velges sammen med komponentbiblioteket).
- Responsivt: se H-2 (Tailwinds `md`/`lg`). Playwright kjører flytene i to viewporter, mobil 390 px og PC 1280 px.
- Legg NFR-8/9/10 inn i Capability-kartet.

### M-6 Når KI kalles, er spredt over flere krav og ikke samlet i kjernen

**Funn.** Om et lagre-kall skal hente forslag, avhenger av FR-8, FR-13, FR-19, FR-38, FR-43 (import), FR-54 og FR-62 (tabellen med fire tilfeller). Om dette avgjøres i hver butikk-kommando, vil `opprettOppgave`, `endreOppgave`, `endreFrist` og `importer` gi ulike svar. AD-1 sier generelt «alle regler i kjernen», men nettopp dette er et kjent sted der det glipper. Det samme gjelder at kjernen skal være ren mens AD-4 lager ID-er med `crypto.randomUUID()`, som er en global sideeffekt på samme måte som `Date.now()`.

**Retting.**
- Legg til i AD-8: én ren funksjon `kiKallFor(før, etter, innstillinger, samtykke) → "ingen" | "felt" | "felt+økter" | "økter"` i kjernen. Butikken kaller `lib/ki` bare med denne.
- Legg til i AD-1: ID-er lages i butikken (eller en `lib/id.ts`) og sendes inn i kjernen, slik som «nå».

### M-7 Flere faner med appen åpen kan overskrive hverandres data

**Funn.** Med ett dokument under én nøkkel (AD-3) vil to åpne faner overskrive hverandre: den siste som lagrer, vinner, og endringer fra den andre fanen forsvinner uten varsel. Spinen tar ikke stilling til dette, og det er ikke utsatt.

**Retting.** Velg og skriv i AD-3, for eksempel: «Butikken lytter på `storage`-hendelsen og laster dokumentet på nytt når en annen fane har lagret.» Alternativt kan det føres under Deferred: «Flere faner støttes ikke i v1, siste lagring vinner.»

---

## Lav

### L-1 Node-versjonen er ikke låst for sensor

Spinen sier «Node.js 26.7.0 (lokalt)», mens README sier «LTS-versjon». Next 16 krever minst Node 20.9. Legg `"engines": { "node": ">=20.9" }` i `package.json` og skriv i Stack at gruppa bruker 26.x. Ta med `npx playwright install` i README sammen med teststegene (NFR-1: kjørbar etter README).

### L-2 Begrunnelsene mangler for faglærer

Hver AD har *Prevents*, men ikke *hvorfor dette valget og ikke alternativet* (for eksempel localStorage framfor IndexedDB, Zustand framfor Context, route handler framfor Server Actions). Begrunnelsene finnes i `.memlog.md`, men faglærer leser spinen. Legg til en linje «Hvorfor:» per AD, eller en kort tabell «Valg og alternativer». Overskriftene fra malen er på engelsk (Design Paradigm, Invariants & Rules, Binds/Prevents/Rule). Det er greit for KI-agentene, men en kort forklaring øverst gjør dokumentet lettere å lese.

### L-3 Rester fra create-next-app er ikke nevnt

`app/layout.tsx` laster Geist via `next/font/google` og har `title: "Create Next App"`, og `globals.css` har standardfargene fra malen. DESIGN.md krever Poppins. Skriv i Konvensjonene (Stil): Poppins lastes med `next/font/google`, som er selvhostet og ikke gir tredjepartsforespørsler i nettleseren (NFR-3). Geist, malfargene og malteksten fjernes i første UI-story.

### L-4 Kallgrensen og forslag som er underveis, går tapt ved omlasting

Telleren for 10 kall per minutt ligger i minnet i `lib/ki` og nullstilles når siden lastes på nytt. Et forslag som er underveis, blir aldri lagret hvis fanen lukkes (FR-12 sier at forslagene skal vises igjen). Begge deler er akseptabelt for en lokal demo, men det bør stå i spinen. Skriv det under Deferred: «Kallgrensen nullstilles ved omlasting. Kall som er underveis, startes ikke på nytt.»

### L-5 Utsatte valg må føres tilbake i spinen

«Komponentbibliotek» og «Nøkkelord (Å-7)» er utsatt til første story. Det er greit, men valget av komponentbibliotek påvirker dialog, fokusfelle og bryter for alle senere stories. Legg til at beslutningen skal føres inn i spinen (Stack og Konvensjoner) når den er tatt, slik at senere agenter ser den. Skriv også i den ryddingen som allerede kjøres (Konvensjoner, Arkivrydding) at den forkaster passerte øktforslag (FR-12), så dette ikke får to tidtakere.

---

## Avstemming mot kildene: oversikt

| Kildekrav | Dekket i spinen? | Funn |
|---|---|---|
| Leveranseskiver og kuttrekkefølge (PRD) | Nei | H-4 |
| NFR-1 bare lokalt, nøkkelen skal ikke kunne brukes av andre | Delvis, med hull | H-1 |
| Responsivt oppsett mobil, nettbrett og PC (EXPERIENCE, DESIGN) | Nei | H-2, M-5 |
| Tema, lys/mørk og «Følg systemet» (FR-60, FR-63, DESIGN) | Delvis | H-3 |
| Samtykkeversjon (FR-35, FR-36) | Nei | M-1 |
| Fastsatte tekster ordrett | Bare som prinsipp | M-1 |
| Eksport og import (FR-43, Flyt 7) | Delvis | M-2 |
| Lagringsvarsel (NFR-4) | Ja (AD-3) | ugyldig dokument: M-2 |
| NFR-5 og NFR-6 mock-KI | Delvis | M-3 |
| NFR-7 testbar tid | Ja for kjernen, ikke for e2e | M-3 |
| WCAG 2.1 AA (NFR-9) | Nei | M-5 |
| Norsk (NFR-8) | Tekst ja, `lang` nei | M-5 |
| Å-1, Å-5, Å-8 | Ja | – |
| Å-7 | Utsatt til story (tillatt) | L-5 |
| Tone (Voice and Tone) | Hører hjemme i stories, utenom M-1 | – |

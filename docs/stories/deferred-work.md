# Utsatt arbeid

- source_spec: `docs/stories/spec-1-1-gjor-prosjektet-klart-etter-arkitekturen.md`
  summary: (Løst i story 1.2.) Fjern `passWithNoTests` i `vitest.config.mts` og `--pass-with-no-tests` i `test:e2e` når første test finnes i hver mappe. Begge flaggene er fjernet.
  evidence: Med flaggene gikk `npm test` og `npm run test:e2e` grønt selv om en feil glob eller mappe gjorde at ingen tester ble kjørt.
- source_spec: `docs/stories/spec-1-1-gjor-prosjektet-klart-etter-arkitekturen.md`
  summary: Sørg i story 4.2/4.3 for at mock-KI sjekkes før nøkkelen brukes, og at `KI_MOCK=1` aldri gir stille mock ved vanlig bruk (uverifisert, middels).
  evidence: Playwrights dev-server laster `.env.local` med `ANTHROPIC_API_KEY`; garantien om at e2e aldri bruker ekte Claude hviler på rekkefølgen i `server/`. Avgjøres når ruta og mocken bygges.
- source_spec: `docs/stories/spec-1-1-gjor-prosjektet-klart-etter-arkitekturen.md`
  summary: Vurder en automatisk sjekk av at `dev` og `start` bare lytter på 127.0.0.1.
  evidence: Fjernes `-H 127.0.0.1`, går alle tester fortsatt grønt; i dag sjekkes det bare med manuell curl.
- source_spec: `docs/stories/spec-3-1-fastsatte-tekster-i-kjernen.md`
  summary: Sjekk i `tests/kjerne/tekster.test.ts` at hver «…»-, *…*- og **…**-enhet i KI-påminnelser, Innhold i Personvern og data og dialoglinjene har en konstant i `kjerne/tekster.ts`.
  evidence: I dag går sjekken bare fra kode til EXPERIENCE.md for disse deltekstene; en ny påminnelse lagt til i EXPERIENCE.md gir fortsatt grønn test. Trenger en liste over sitater som ikke er UI-tekst («Nei», «opptatt», «Godkjent 9.11.2026 (tekst v2)»).
- source_spec: `docs/stories/spec-3-1-fastsatte-tekster-i-kjernen.md`
  summary: (Løst i story 3.1 del 2: `kjerne/samtykke.ts` med `kiErPå` og `kanSendes`, testet i `tests/kjerne/samtykke.test.ts`.) Bygg resten av story 3.1: `kjerne/samtykke.ts` med `kiErPå(dokument)` og `kanSendes(oppgave, dokument)`, som importerer `GJELDENDE_SAMTYKKEVERSJON` fra `kjerne/tekster.ts`, med Vitest for ja, nei, `null` og gammel tekstversjon.
  evidence: Specen dekket bare tekstdelen fordi dokumentskjemaet fra story 1.2 ikke fantes ennå. Story 3.1 står derfor fortsatt som `in-progress` i sprint-status.
- source_spec: `docs/stories/spec-1-2-lagringsformat-som-taler-nye-versjoner.md`
  summary: (Løst i story 1.3: abonnementet validerer med `dokumentSkjema` før `skriv`.) La butikken i 1.3 (eller `skriv()`) validere dokumentet før lagring, så en feil i en kommando ikke gjør neste `les()` `ugyldig`.
  evidence: `skriv()` lagrer det den får; lesingen er streng, så et ugyldig dokument sender appen til feilsiden.
- source_spec: `docs/stories/spec-1-2-lagringsformat-som-taler-nye-versjoner.md`
  summary: Når første migrering legges til: hindre at en fane med gammel versjon skriver over et dokument fra nyere versjon.
  evidence: `skriv()` sjekker ikke `schemaVersion` på det som allerede er lagret.
- source_spec: `docs/stories/spec-1-2-lagringsformat-som-taler-nye-versjoner.md`
  summary: Vurder ESLint-regler som hindrer `localStorage` utenfor `lib/storage/` og klokke/nettleser i `kjerne/`.
  evidence: AD-1 og AD-3 sjekkes i dag bare med manuell `git grep`.
- source_spec: `docs/stories/spec-1-3-appen-husker-og-folger-klokka.md`
  summary: Story 1.4 (Lena) gir feilsiden, dialogen og lagringsbanneret farger, fokusring og varselfarge på *Slett alt*, og kjører axe på banner- og dialogtilstanden.
  evidence: 1.3 la bevisst ingen stil (tokens kommer i 1.4); EXPERIENCE.md krever varselfarge og synlig fokusring.
- source_spec: `docs/stories/spec-6-4-oktgrenser-i-kjernen.md`
  summary: Godtak (6.6) og merket «⚠ Kolliderer med <tittel>» (6.8) trenger en egen kollisjonsfunksjon som finner overlapp med hendelser og godtatte økter uavhengig av de andre FR-49-reglene, og som gir tilbake hendelsen/økta det kolliderer med.
  evidence: `sjekkØktforslag` stopper ved første brudd og gir bare en årsakskode, så en kollisjon skjules bak f.eks. `fortid` eller `utenfor-dagtid` (manuelle økter har ingen FR-49-grenser), og tittelen til merket kan ikke fylles inn. Design Notes i spesifikasjonen for 6.4 antar feilaktig at 6.6 kan bruke `sjekkØktforslag` direkte.

## Deferred from: code review of spec-1-4-appens-ramme-navigasjon-og-utseende (2026-11-28)

- Tema-skriptet (`lib/storage/tema-skript.ts`) ser ikke på `schemaVersion`; når en migrering endrer `innstillinger`, kan eldre dokumenter gi blink i standardtema til `TemaSynk` retter det.
- axe kjøres ikke på feilsiden, «Slette alle data?»-dialogen og lagringsbanneret i mørk modus; dagens tokens består (ca. 7,5:1), men en senere endring av `--warn` i mørk modus fanges ikke.
- source_spec: `docs/stories/spec-1-5-se-oppgavene-i-de-smarte-listene.md`
  summary: Kjør axe på oppgavelista i mørk modus og med «Ingen frist» lukket.
  evidence: axe kjøres i dag bare i lys modus med blått tema; `warn` og `text-muted` på `surface-base` har annen kontrast i mørk modus.
- source_spec: `docs/stories/spec-3-2-personvernerklaering-ett-klikk-unna.md`
  summary: Når Personvern og data finnes (3.4), bør erklæringen si hvor KI slås av og hvor data slettes, og «Personvern og data» legges over lenken i sidemenyen.
  evidence: Erklæringen sier bare «når som helst», og PC-lenken står i dag rett under Innstillinger fordi /personvern ikke finnes.
- source_spec: `docs/stories/spec-3-2-personvernerklaering-ett-klikk-unna.md`
  summary: Omdirigeringen til /oppstart i 3.3 må unnta /personvernerklaering, slik at erklæringen kan leses fra oppsettet.
  evidence: Unntaket står bare i Design Notes i 3.2; ruta er en privat konstant i components/ramme.tsx.
- source_spec: `docs/stories/spec-3-2-personvernerklaering-ett-klikk-unna.md`
  summary: Erklæringen kan ikke nås når feilsiden vises (data kan ikke leses).
  evidence: AppTilstand viser Feilside i stedet for rammen og sidene; godtatt i intent-matrisen for 3.2.
- source_spec: `docs/stories/spec-3-2-personvernerklaering-ett-klikk-unna.md`
  summary: Sjekk kontrasten på personvernlenken på mobil med en egen test (farge mot --surface-base, lys og mørk).
  evidence: Lenken ligger i .glod-kolonnen med gradient som bakgrunn, så axe legger den under incomplete, ikke violations.
- source_spec: `docs/stories/spec-2-7-prosjekter-i-innstillinger.md`
  summary: Lag en felles bekreftelsesdialog («Er du sikker?») og felles knappestiler når story 2.4 trenger den tredje.
  evidence: `components/feilside.tsx` og `components/innstillinger.tsx` har hver sin kopi av `<dialog>`-oppsettet og `SEKUNDÆR`/`FARE`.
- source_spec: `docs/stories/spec-3-1-samtykke-i-kjernen.md`
  summary: Sjekk automatisk (Vitest eller ESLint) at `samtykke.svar` og `samtykke.tekstversjon` bare sammenlignes i `kjerne/samtykke.ts`, så AD-12 håndheves når 3.3, 3.4 og 4.5 tar `kiErPå`/`kanSendes` i bruk.
  evidence: I dag sjekkes det bare med manuell `grep` i Verification. En ny `samtykke?.svar === "ja"` i en komponent gir grønne tester. Samme slags hull som punktet om ESLint-regler for AD-1/AD-3.
- source_spec: `docs/stories/spec-3-3-forstegangsoppsett-med-fornavn-og-ki-valg.md`
  summary: Uten svart KI-valg viser personvernerklæringen rammen med menyene; går hun videre via menyen i stedet for Tilbake, havner hun på steg 1 i stedet for steg 2.
  evidence: Omdirigeringen i `AppTilstand` går alltid til `/oppstart` uten `?steg=2`; fornavnet står likevel i feltet.

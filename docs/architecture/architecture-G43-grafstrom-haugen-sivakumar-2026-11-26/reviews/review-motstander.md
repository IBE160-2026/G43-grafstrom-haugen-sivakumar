---
type: review
lens: motstander (adversarial)
target: ../ARCHITECTURE-SPINE.md
created: '2026-11-26'
---

# Motstandergjennomgang av ARCHITECTURE-SPINE.md

## Dom

Ryggraden har god lagdeling (ren kjerne, én butikk, én serverrute), men låser nesten ingen datafasonger. To agenter kan følge alle AD-er ordrett og likevel lagre forslag, økter, samtykke og fullføring i ulike former, skrive KI-svar til en oppgave som er endret eller slettet, og bygge mock-KI på hver sin side av nettverket. Før stories deles ut bør det komme en AD med et låst dokumentskjema og en AD for livsløpet til et KI-kall.

## Metode

For hvert hull beskrives to enheter ett nivå ned (stories eller moduler bygget av ulike KI-agenter på ulike dager). Begge følger AD-1 til AD-11 og konvensjonene ordrett, men resultatet passer ikke sammen. Alvorlighet:

- **Kritisk:** gir datatap, feil data sendt til KI, eller at to slices ikke kan kobles uten omskriving.
- **Høy:** gir synlig feil oppførsel i en flyt eller brudd på et Må-krav.
- **Middels:** gir inkonsistent oppførsel eller unødvendig omskriving.
- **Lav:** kosmetisk eller bare i kanttilfeller.

## Oversikt

| # | Hull | Alvorlighet | Rettes med |
| --- | --- | --- | --- |
| H1 | Formen på `forslag`, og hvor øktforslag bor | Kritisk | Ny AD-12 (dokumentskjema) |
| H2 | KI-svar kommer tilbake etter at oppgaven er endret eller slettet | Kritisk | Ny AD-13 (livsløp for KI-kall) |
| H3 | Reserveløsningen kjøres likt for alle feil og alle kalltyper | Høy | Strammere AD-6 og AD-8 |
| H4 | Mock-KI (`KI_MOCK`): server eller klient? | Høy | Ny AD-14 |
| H5 | Samtykke: form, versjon og hvem som avgjør «KI er på» | Høy | AD-12 + ny regel i AD-8 |
| H6 | Ett kall per lagring når felt- og øktforslag bygges i ulike slices | Høy | Strammere AD-6/AD-8 (én kalltype per lagring) |
| H7 | Migrering, ugyldig dokument og import | Høy | Strammere AD-3 |
| H8 | «Nå» i UI, timetakt for `ryddArkiv` og 7-dagersregelen | Høy | Strammere AD-5 |
| H9 | Tidsavbrudd 15 s på server mot nettleserens venting | Middels | Strammere AD-7/AD-8 |
| H10 | Kallgrense-telleren: hvor den bor | Middels | Strammere AD-8 |
| H11 | Økt-nummerering n/N og avhuket økt | Middels | AD-12 |
| H12 | Filter- og sorteringstilstand | Middels | Ny AD-15 |
| H13 | Prosjekter: avledet eller egen liste | Middels | AD-12 |
| H14 | Gjentakende hendelser: sluttdato og «denne og alle senere» | Middels | Strammere AD-4 |
| H15 | Kall som var i gang ved lukking, og importerte oppgaver | Middels | AD-13 |
| H16 | Flere faner skriver samme dokument | Lav | Strammere AD-3 |

---

## H1 — Formen på `forslag`, og hvor øktforslag bor (kritisk)

**Enhet A (F2 felt, slice 2):** Lagrer `oppgave.forslag = { kilde: "ki", etikett: "Skole", prioritet: "Høy", sammendrag: "..." }`, altså ett objekt med én `kilde` for hele settet.

**Enhet B (F2 økter, slice 3):** AD-4 sier at «en økt ligger bare i `økter`». Agenten tolker det slik at også foreslåtte økter er økter, og lagrer dem i `økter` med `status: "foreslått"`. En annen agent som leser «ubesvarte KI-forslag lagres på oppgaven i feltet `forslag`», legger øktforslag i `oppgave.forslag.økter[]`. Begge følger AD-4.

**Kollisjon:**
- Smarte lister (F4) teller alt i `økter`, og foreslåtte økter dukker opp i lister og Kalender. Det bryter FR-50.
- `slettOppgave` sletter øktene i `økter`, men ikke forslag som ligger et annet sted, eller omvendt.
- FR-14 krever at ugyldige felt erstattes med reserveløsningen felt for felt, og FR-18 krever merket «regelbasert» per rad. Én `kilde` for hele settet kan ikke vise en blanding av KI og regelbasert.
- FR-13 (ny tekst gir nye feltforslag, men gamle verdier beholdes) og FR-62 (forkast øktforslag ved fristendring) krever at felt- og øktforslag kan forkastes hver for seg.
- «Godta» på ett felt: fjernes feltet fra `forslag`, settes det til `null`, eller får det `besvart: true`? Tre agenter, tre svar.

**Forslag – ny AD-12 «Dokumentskjemaet er låst i `kjerne/skjema.ts`»:**

> Alle typer i lagringsdokumentet defineres som zod-skjemaer i `kjerne/skjema.ts`, og typene avledes med `z.infer`. Ingen modul legger til felt utenfor dette skjemaet. Et nytt felt krever endring i skjemaet, en økning av `schemaVersion` og en migrering (AD-3). Forslag har denne formen:
> `oppgave.forslag: { felt: { etikett?: FeltForslag<Etikett>, prioritet?: FeltForslag<Prioritet>, sammendrag?: FeltForslag<string> }, økter: ØktForslag[] } | null`
> `FeltForslag<T> = { verdi: T, kilde: "ki" | "regelbasert" }`
> `ØktForslag = { id, dato, start, slutt, kilde: "ki" }`.
> Foreslåtte økter ligger bare i `oppgave.forslag.økter`. De ligger aldri i `økter`. `økter` inneholder bare godtatte eller manuelt lagte økter. «Godta» og «Endre» fjerner forslaget fra `forslag`. Når både `felt` og `økter` er tomme, settes `forslag` til `null`. Det finnes ingen `besvart`-flagg.

---

## H2 — KI-svar etter at oppgaven er endret eller slettet (kritisk)

**Enhet A (`lib/ki/`):** AD-8 sier at `lib/ki/` kjører reserveløsningen. Agenten lar `lib/ki/` kalle `useStore.getState().settForslag(id, forslag)` når svaret kommer. Kallet gjøres «fire and forget» fra `opprettOppgave`.

**Enhet B (`lib/store/`):** AD-2 sier at kommandoer regner ut ny tilstand. Agenten lar `opprettOppgave` vente på et promise fra `lib/ki/` og skrive forslaget med `set(...)` direkte i samme kommando, med oppgaveobjektet som var i lukningen (closure).

**Kollisjon og race:**
1. Studenten lagrer, endrer teksten etter 3 s (FR-13 gir et nytt kall) og deretter fristen. Svar 1 kommer etter svar 2 og overskriver nyere forslag.
2. Studenten sletter oppgaven før svaret kommer. Enhet B skriver en kopi av den gamle oppgaven tilbake fordi den bruker oppgaven fra lukningen, og den slettede oppgaven gjenoppstår. Enhet A kaller `settForslag` på en id som ikke finnes. Om det gir en feil, et nytt objekt eller ingenting, er ikke bestemt.
3. Studenten slår på 🔒 eller trekker samtykket mens kallet pågår. Forslaget vises likevel, selv om FR-19 og FR-38 sier at hun ikke skal få forslag.
4. Fristen endres mens et øktforslag-kall pågår. FR-62 sier at øktforslag skal forkastes, men svaret kommer etterpå og legger dem inn.
5. Det er uklart om `lib/ki/` (en adapter) får kalle butikken. Pilene i diagrammet går bare fra STORE til KIC.

**Forslag – ny AD-13 «Livsløpet til et KI-kall»:**

> `lib/ki/` endrer aldri tilstand. Den returnerer `Promise<KiResultat>` til butikken og importerer ikke butikken. Kommandoen som utløser kallet (`opprettOppgave`, `endreOppgave`, `foreslåNyTid`), lager en `forespørselId` (`crypto.randomUUID()`) og lagrer den på oppgaven i `oppgave.ventendeKall: { id, type } | null`. Når svaret kommer, kaller butikken kommandoen `mottaKiSvar(oppgaveId, forespørselId, resultat)`. Den forkaster svaret uten melding hvis oppgaven ikke finnes, hvis `ventendeKall.id !== forespørselId`, hvis oppgaven har 🔒, eller hvis KI ikke er på (AD-8, `kiErPå`). Øktforslag i svaret forkastes også hvis fristen er endret siden kallet startet (FR-62). Et nytt kall på samme oppgave erstatter `ventendeKall`, slik at svaret på det gamle kallet blir ignorert. Kommandoer leser alltid oppgaven fra `get()` når de skriver, aldri fra en lukning.

---

## H3 — Reserveløsningen kjøres likt for alle feil og kalltyper (høy)

**Enhet A (F3):** Følger AD-8 ordrett: Ved alle feil kjører `lib/ki/` `reserveløsning(oppgave)`, som gir etikett og prioritet.

**Enhet B («Foreslå ny tid», FR-53):** Bruker samme `lib/ki/`. Ved tidsavbrudd får brukeren etikett- og prioritetsforslag på en oppgave der hun bare ba om ny tid for en økt. PRD-en krever i stedet meldingen «KI svarte ikke. Flytt økta selv med Endre tid.».

**Flere kollisjoner:**
- FR-62: Når bare fristen endres og appen henter øktforslag, skal det ikke komme nye forslag til etikett og prioritet. Feiler kallet, gir AD-8 likevel etikett- og prioritetsforslag fra reserveløsningen.
- AD-6 nevner markeringene `ingen nøkkel`, `tidsavbrudd`, `ugyldig` og `avvist`, men ikke `tomt`, som NFR-6 krever en egen test for. Det står heller ikke om markeringene er norske strenger med mellomrom eller koder.
- FR-14 krever at feil i ett felt bare gir reserveløsning for det feltet. AD-6 lar ruta svare «forslag fra KI, *eller* en markering», altså alt eller ingenting. En agent forkaster hele svaret når prioriteten er ugyldig, en annen erstatter bare prioriteten.
- Kallgrense nådd, nettverksfeil og HTTP 500 fra ruta: AD-8 slår dem sammen. Det er greit for feltforslag, men ikke for «Foreslå ny tid».

**Forslag – strammere AD-6 og AD-8:**

> AD-6: Svaret fra ruta har formen `{ type: "ok", felt: {...delvis}, økter: [...], forkastet: Felt[] } | { type: "reserve", årsak: "ingen-nokkel" | "tidsavbrudd" | "tomt" | "ugyldig" | "avvist" | "api-feil" }`, definert i `kjerne/ki-kontrakt.ts`. Felt som er ugyldige, står i `forkastet`, og bare de feltene får reserveløsningen.
> AD-8: Reserveløsningen gir bare feltforslag, og bare for felt som kallet ba om. Ved `type: "nyTid"` kjøres aldri reserveløsningen. Da returnerer `lib/ki/` `{ type: "ingen-svar" }`, og UI viser teksten fra FR-53. Ved et kall som bare gjelder øktforslag (FR-62), gir feil ingen forslag. Tabellen *kalltype × feiltype → resultat* ligger i `kjerne/reserve.ts` og testes der.

---

## H4 — Mock-KI med `KI_MOCK`: server eller klient? (høy)

**Enhet A (server):** Leser `process.env.KI_MOCK` i `server/claude.ts` og returnerer et fast svar. For å teste fire tilfeller må Playwright starte serveren fire ganger med ulike verdier.

**Enhet B (e2e-tester):** Bruker `page.route('/api/ki', ...)` i Playwright, eller legger inn `NEXT_PUBLIC_KI_MOCK` i klienten. Konvensjonen forbyr bare hemmeligheter med `NEXT_PUBLIC_`, så dette er lov. Mocken hopper da over ruta, zod-kontrollen på serveren og kontrollen i kjernen (FR-14) når den bygges i `lib/ki/`.

**Kollisjon:** Testene for «ugyldig verdi» består fordi klientmocken returnerer `{type:"reserve"}` direkte, mens den ekte ruta aldri blir testet med en ugyldig verdi. Server-mocken og klient-mocken har ulike fixture-formater. NFR-5 krever en mock som svarer etter 10 s, men det er ikke bestemt hvordan forsinkelsen styres eller hvordan tidsavbrudd simuleres uten å vente i 15 s i hver test.

**Forslag – ny AD-14 «Mock-KI bor på serveren»:**

> Mock-KI finnes bare i `server/` og erstatter selve Claude-kallet. Ruta, zod-kontrollen og kjernekontrollen kjøres som vanlig. Når `KI_MOCK=1`, velger `server/claude.ts` en fast fixture fra `tests/ki-testsett/mock/` ut fra headeren `x-ki-mock: gyldig | ugyldig | tomt | tidsavbrudd | treg-10s`. Uten header brukes `gyldig`. Headeren ignoreres når `KI_MOCK` ikke er satt. `tidsavbrudd` gir samme resultat som et ekte tidsavbrudd, uten å vente. Fristen kan settes med `KI_TIMEOUT_MS` bare når `KI_MOCK=1`. Klienten har ingen mock-kode og ingen `NEXT_PUBLIC_`-variabler for KI. Playwright setter headeren med `page.setExtraHTTPHeaders` eller `route.continue({ headers })`.

---

## H5 — Samtykke: form, versjon og hvem som avgjør «KI er på» (høy)

**Enhet A (F6 personvern):** Lagrer `samtykke = { svar: "ja", dato: "2026-11-26", versjon: 2 }` og sammenligner med `EXPERIENCE_VERSJON = "v2"` (en streng) i komponenten.

**Enhet B (`lib/ki/`):** Sjekker `samtykke?.godkjent === true` og ser ikke på versjonen.

**Kollisjon:** Feltnavnene passer ikke sammen (`svar` mot `godkjent`), så B tror aldri at studenten har sagt ja. Retter man det i B, sendes det likevel data etter at teksten har fått en ny versjon, noe FR-35 forbyr. Tallet 2 og strengen `"v2"` sammenlignes aldri likt. `dato` er en dato etter AD-5, men samtykke er et tidspunkt for en hendelse og burde være ISO-tidsstempel. Det er heller ikke bestemt hvor «KI er på» avgjøres: AD-8 sier «uten samtykke», og FR-37 (påminnelsen i skjemaet) og FR-54 (knapper) må bruke samme vurdering i UI.

**Forslag – i AD-12 og en ny setning i AD-8:**

> `samtykke: { svar: "ja" | "nei", tidspunkt: ISO, tekstversjon: number } | null`. `kjerne/samtykke.ts` eksporterer `GJELDENDE_SAMTYKKEVERSJON: number` og `kiErPå(dok): boolean`, som er sann bare når `svar === "ja"` og `tekstversjon === GJELDENDE_SAMTYKKEVERSJON`. `kiErPå` og `kanSendes(oppgave, dok)` (som også sjekker 🔒) er de eneste stedene som avgjør om KI brukes. Både `lib/ki/`, butikken og UI (FR-37, FR-54) kaller dem. Import (FR-43) setter alltid `samtykke` til `null`.

---

## H6 — Ett kall per lagring når felt- og øktforslag er i ulike slices (høy)

**Enhet A (slice 2, feltforslag):** `opprettOppgave` kaller `hentFeltforslag()` som sender én forespørsel.

**Enhet B (slice 3, økter):** Legger til `hentØktforslag()` i `opprettOppgave` når oppgaven har frist. Det gir to kall per lagring.

**Kollisjon:** NFR-12 tillater bare ett forslagskall per lagring. Teller grensen per kall, blokkeres det andre kallet, og øktforslagene får alltid reserveløsningen. Teller den per lagring, må B vite om A. AD-9 sier at hendelser og økter bare sendes ved øktforslag. Det fører lett til to ulike forespørselsformer, med én zod-kontrakt hver.

**Forslag – strammere AD-6:**

> `kjerne/ki-kontrakt.ts` har én forespørselsform: `{ type: "forslag", ønsker: { felt: boolean, økter: boolean }, utdrag } | { type: "nyTid", øktId, utdrag }`. Én lagring gir høyst ett `forslag`-kall. Kommandoen avgjør `ønsker` med `kjerne/ki-trigger.ts`, som implementerer FR-8, FR-13 og FR-62 som én tabell. Slice 3 utvider `ønsker.økter`. Den legger ikke til et nytt kall.

---

## H7 — Migrering, ugyldig dokument og import (høy)

**Enhet A (`lib/storage/`):** Ved lesing gir `skjema.safeParse` feil. Agenten returnerer et tomt dokument, og butikken lagrer det med én gang. Alle data er borte.

**Enhet B (`kjerne/migrering.ts`):** Skriver `migrer(dok)` som tar inn et dokument av typen `Dokument`, altså etter validering. Et gammelt dokument stopper derfor i valideringen og når aldri migreringen.

**Flere kollisjoner:**
- Import (FR-43) av en fil med lavere `schemaVersion`: migreres den, eller avvises den? Og en fil med høyere versjon enn appen?
- Skrives det migrerte dokumentet tilbake med én gang, eller først ved neste kommando?
- Hvor bor `schemaVersion` som konstant, og hvem øker den?

**Forslag – strammere AD-3:**

> Lesing og import går samme vei: `rå: unknown` → `kjerne/migrering.ts: migrer(rå): Resultat<Dokument, "for-ny" | "ugyldig">`. Den leser `schemaVersion`, kjører migreringene trinn for trinn (`v1→v2→…`) på ukjent JSON, og validerer med zod til slutt. `GJELDENDE_SKJEMAVERSJON` ligger i `kjerne/skjema.ts`. Ved `ugyldig` eller `for-ny` overskriver adapteren aldri det lagrede. Butikken går i en skrivebeskyttet feiltilstand, og UI tilbyr eksport av rådata og «Slett alle data». Et migrert dokument skrives tilbake med én gang. Import bruker samme `migrer` og nuller deretter `samtykke` (FR-43). Hver migrering har en Vitest-test med en fixture av den gamle versjonen.

---

## H8 — «Nå» i UI, timetakt for `ryddArkiv` og 7-dagersregelen (høy)

**Enhet A (F4 smarte lister):** AD-5 sier at bare butikken henter «nå». Agenten lager selektoren `useSmarteLister()` i butikken, som kaller `klokke.nå()` hver gang den kjøres. Den kjøres bare når tilstanden endres, så ved midnatt flytter ingenting seg fra «I dag» til «Forfalt» før studenten gjør noe.

**Enhet B (F5 Arkiv):** Legger `nå` i butikken som en verdi og oppdaterer den med `setInterval` hver time sammen med `ryddArkiv`. Arkivkomponenten viser «Slettes om N dager» fra denne verdien.

**Kollisjon:**
- To ulike kilder til «nå» i UI gir ulike svar fram til neste time, og Playwright må overstyre to steder.
- 7-dagersregelen: A regner `nå - fullført >= 7 * 24 t` i millisekunder, mens B regner 7 kalenderdager i lokal tid. Ved overgang mellom sommertid og vintertid og rundt midnatt gir de ulike svar. «Slettes om 0 dager» kan vises mens `ryddArkiv` ikke har slettet oppgaven.
- `fullført` er ISO 8601, men det står ikke om tidsstempelet er i UTC (`Z`) eller har lokal forskyvning. Det er heller ikke bestemt hvordan `lib/klokke.ts` overstyres i nettleseren under Playwright (query-parameter, `window`-krok eller Playwrights `clock`-API).
- FR-12 sier at passerte øktforslag skal forkastes. Det er ikke bestemt om det skjer i `ryddArkiv`, ved oppstart eller ved visning.

**Forslag – strammere AD-5:**

> Butikken har `nå: string` (ISO) i tilstanden, som ikke lagres. Den settes ved oppstart og oppdateres av én takt i `lib/klokke.ts` hvert minutt og når fanen blir synlig igjen (`visibilitychange`). Alle selektorer og komponenter bruker `state.nå`. Ingen andre kaller `klokke.nå()`. Takten kjører `vedlikehold(nå)` ved oppstart og når timen skifter. Den kommandoen kjører `ryddArkiv` og forkaster passerte øktforslag (FR-12). Tidsstempler lagres som `new Date().toISOString()` (UTC). «7 dager» betyr 7 × 24 timer fra `fullført`. «Slettes om N dager» = `ceil((fullført + 7 d − nå) / 1 d)`, regnet av samme kjernefunksjon som `ryddArkiv`. Playwright styrer tiden bare med `page.clock`.

---

## H9 — Tidsavbrudd 15 s på server mot nettleserens venting (middels)

**Enhet A (`server/claude.ts`):** `timeout: 15000`, `maxRetries: 0` og `fallbacks: "default"` (AD-7). Avbrytes kallet, eller feiler hovedmodellen, kan fallback-modellen bruke nesten 15 s til. Totaltiden blir da opptil cirka 30 s pluss tiden Turbopack bruker på å kompilere ruta første gang.

**Enhet B (`lib/ki/`):** Bruker `fetch` uten tidsgrense, eller med `AbortSignal.timeout(15000)`. Uten tidsgrense venter nettleseren så lenge serveren gjør. Med 15 s avbryter nettleseren før serveren har svart med `tidsavbrudd`. Da blir resultatet «kallet feiler» med en annen årsak, og testen for «tidsavbrudd» kan få `api-feil`.

**Kollisjon:** NFR-12 sier at kallet avbrytes etter 15 s, men AD-7 setter fristen per forsøk på serveren, ikke totalt. Hvilken side som eier fristen, er ikke bestemt.

**Forslag – strammere AD-7 og AD-8:**

> Fristen på 15 s gjelder hele kallet sett fra nettleseren og eies av `lib/ki/` (`AbortSignal.timeout(15000)`). Avbrudd på klientsiden gir årsaken `tidsavbrudd`. Serveren bruker en total frist på 13 000 ms for primærmodell og fallback til sammen. Den sender `AbortSignal` til SDK-en og avbryter når forespørselen fra nettleseren lukkes (`request.signal`). Svar som kommer etter fristen, ignoreres (AD-13).

---

## H10 — Kallgrense-telleren: hvor den bor (middels)

**Enhet A:** Lagrer en tidsliste med kall som en variabel i modulen `lib/ki/`. Den nullstilles ved omlasting og er separat per fane.

**Enhet B:** «Per nettleser» (NFR-12) tolkes som noe som må lagres. B legger `kallLogg` i lagringsdokumentet og bryter dermed AD-3/AD-4, siden feltet ikke finnes i ERD-en. Alternativt skriver B en egen localStorage-nøkkel fra `lib/ki/`, noe som bryter «bare `lib/storage/` leser og skriver localStorage».

**Flere kollisjoner:** Teller «Foreslå ny tid» med i 10-per-minutt-grensen? Er vinduet glidende eller fast per minutt?

**Forslag – strammere AD-8:**

> Kallgrensen ligger i minnet i `lib/ki/kallgrense.ts` som et glidende vindu på 60 s med tidsstempler fra `lib/klokke.ts`. Den lagres ikke, og den gjelder per fane. Det godtas for en lokal demo og står under Deferred for v2. Alle kall til `/api/ki` teller, også `nyTid`. Er grensen nådd, returnerer `lib/ki/` `{ type: "reserve", årsak: "kallgrense" }` uten nettverkskall, og H3-tabellen avgjør hva som vises.

---

## H11 — Økt-nummerering n/N og avhuket økt (middels)

**Enhet A (F2 godta økter):** Lagrer `økt.nummer = 2` og `økt.antall = 3` når forslaget godtas.

**Enhet B (F4 lister):** Regner n/N ved visning ut fra sortering på dato og starttid. Når studenten legger til en økt selv (FR-51), sletter en økt eller flytter en med «Endre tid», blir de lagrede tallene i A feil, og A og B viser ulike tall.

**Avhuking:** En agent legger til `avhuket: boolean`. En annen bruker `fullført: ISO` på økta, siden AD-5 nevner `fullført` som tidsstempel. En tredje bruker `status: "aktiv" | "avhuket" | "arkivert"`, og en annen agent setter `status: "arkivert"` på øktene når oppgaven fullføres (FR-57), som er en ny eier av samme sannhet. Angrer studenten fullføringen (FR-32), vet ingen hvilken status øktene skal tilbake til.

**Forslag – i AD-12:**

> `Økt = { id, oppgaveId, dato, start, slutt, avhuket: ISO | null, kilde: "ki" | "manuell", createdAt }`. `Oppgave.fullført: ISO | null`. Det finnes ikke noe `status`-felt. Arkivstatus avledes fra `oppgave.fullført`. n/N lagres aldri. `kjerne/okter.ts: øktNummer(økter, øktId)` regner det ut fra alle økter med samme `oppgaveId`, sortert på `dato`, `start` og `createdAt`, også avhukede. Å fullføre en oppgave endrer aldri øktene.

---

## H12 — Filter- og sorteringstilstand (middels)

**Enhet A (F4 Oppgaver):** Lagrer filter og sortering i `innstillinger.filter` slik at de overlever omlasting.

**Enhet B (Kalender, slice 3):** FR-26 sier at filteret også gjelder Kalender. Agenten lager et eget filter i komponenttilstanden. Kalender og Oppgaver viser da ulike utvalg.

**Kollisjon:** FR-25 krever at sorteringen går tilbake til standard neste gang lista åpnes, noe A bryter. Om filteret skal huskes, sier PRD-en ikke. Det må avgjøres ett sted.

**Forslag – ny AD-15 «Visningstilstand»:**

> Filter og søk ligger i butikken i en egen del `visning` som ikke lagres. Oppgaver og Kalender deler den. Sortering er lokal komponenttilstand i lista og starter på «Frist» hver gang lista vises (FR-25). Ingenting i `visning` skrives til lagringsdokumentet, og filtrene nullstilles ved omlasting.

---

## H13 — Prosjekter: avledet eller egen liste (middels)

**Enhet A (F1):** `oppgave.prosjekt: string`.

**Enhet B (F7, FR-61):** FR-40 nevner «prosjekter» som noe eget. B lager `innstillinger.prosjekter: string[]` og sletter fra denne lista, men ikke fra oppgavene. Det gir to eiere.

**Forslag – i AD-12:**

> Prosjekter har ingen egen samling. `oppgave.prosjekt: string | null` er eneste kilde. Lista i Innstillinger avledes av `kjerne/prosjekter.ts: alleProsjekter(oppgaver)`. Kommandoen `slettProsjekt(navn)` setter `prosjekt = null` på alle oppgaver med navnet.

---

## H14 — Gjentakende hendelser: sluttdato og «denne og alle senere» (middels)

**Enhet A (opprett serie):** Lagrer gjentakelsesregelen (`gjentakelse: { hver: "uke", til: "2027-01-10" }`) på hver utfoldede hendelse.

**Enhet B (rediger serie):** Ved «denne og alle senere» endrer B de senere hendelsene, men beholder samme `seriesId`. En annen agent gir dem en ny `seriesId`. Den neste «denne og alle senere»-endringen på en tidligere dato treffer dermed ulike hendelser. Endres sluttdatoen eller regelen, finnes det ingen kilde til hvilke datoer som skal legges til eller fjernes.

**Forslag – strammere AD-4:**

> En hendelse i en serie har `seriesId` og `gjentakelse: { hver: "dag" | "uke" | ..., til: "YYYY-MM-DD" }`, med samme regel på alle hendelsene i serien. «Denne og alle senere» deler serien. Hendelsene fra og med valgt dato får ny `seriesId` og den nye regelen, og de tidligere hendelsene får `til` satt til dagen før. Endres regelen, slettes og foldes hendelsene fra valgt dato ut på nytt med `kjerne/hendelser.ts: foldUt(regel, fra)`. Ingen annen kode lager serier.

---

## H15 — Kall som var i gang ved lukking, og importerte oppgaver (middels)

**Enhet A:** Ved oppstart henter agenten forslag på nytt for oppgaver med `forslag === null` som har lagret `ventendeKall`, fordi FR-12 sier at forslagene skal vises igjen.

**Enhet B (import, FR-43):** Importerte oppgaver har `forslag: null`. Har de `ventendeKall` fra eksporten, eller tolker A «ingen forslag» som «mangler forslag», sendes det kall ved import. Det bryter FR-43, som sier at importerte oppgaver ikke skal sende noe før teksten endres.

**Forslag – i AD-13:**

> KI-kall startes bare av kommandoene som er listet i `kjerne/ki-trigger.ts` (lagre, endre tekst og endre frist etter FR-62), aldri ved oppstart, import eller visning. `ventendeKall` nullstilles ved oppstart og ved import. Et kall som ble borte ved omlasting, gir ingen forslag og ingen reserveløsning.

---

## H16 — Flere faner skriver samme dokument (lav)

**Enhet A og B:** Hver fane har sin egen butikk og skriver hele dokumentet ved hver kommando. Fane 2 overskriver det fane 1 nettopp lagret. Det er ikke bestemt om `storage`-hendelsen skal brukes.

**Forslag – strammere AD-3:**

> `lib/storage/` lytter på `storage`-hendelsen og laster dokumentet inn på nytt i butikken når en annen fane har skrevet. Den siste skrivingen vinner. Det godtas for en demo.

---

## Mindre funn (ikke egne hull)

- AD-2 sier at kommandoen «ber lagringsadapteren lagre», men ikke om det skjer synkront i hver kommando eller via `subscribe` på butikken. To agenter kan gjøre begge deler og lagre to ganger. Velg én løsning, helst `subscribe` i `lib/store/` med `skipHydration` til innlastingen er ferdig (AD-10).
- AD-4 bruker `økter` med æ i dokumentnøkkelen, men ERD-en bruker `okter`. Bestem om JSON-nøkler skal skrives med æøå, og bruk samme skrivemåte i ERD-en.
- Feltene `kilde` på `Økt` (manuell eller KI) og `kilde` på forslag (KI eller regelbasert) har samme navn, men ulike verdier. Det er greit hvis AD-12 låser begge, ellers er det en felle.
- `fallbacks: "default"` i AD-7 bør kontrolleres mot SDK 1.14 før det låses. Hvis det ikke finnes i den versjonen, går H9 bort, men AD-7 er da feil.

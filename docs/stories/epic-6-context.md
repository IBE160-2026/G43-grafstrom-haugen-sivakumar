# Epic 6 Context: Økter planlagt med KI

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Studenten planlegger når hun skal jobbe med en oppgave. Hun legger inn økter selv eller godtar øktforslag fra KI, som legges utenom hendelsene (vakter, kamper, nattevakter). Hun huker av økter og ser dem i smartlistene og i Kalender. Øktene følger oppgaven når den fullføres, gjenopprettes eller slettes. Epicen avsluttes med en brukertest av planleggingen (hendelse + godta økt). Den er skive 3, som kuttes først, og Bør-storyene 6.8 og 6.9 kuttes før resten. Appen skal virke fullt ut uten KI: «+ Legg til økt» er alltid tilgjengelig.

## Stories

- Story 6.1: Legge til en økt selv
- Story 6.2: Endre, slette og huke av en økt
- Story 6.3: Fullføre og slette oppgaver med økter
- Story 6.4: Øktgrenser i kjernen
- Story 6.5: KI foreslår økter
- Story 6.6: Godta øktforslag
- Story 6.7: Brukertest av planlegging
- Story 6.8 (Bør): Merker på økter som kolliderer eller ligger etter fristen
- Story 6.9 (Bør): Foreslå ny tid

## Requirements & Constraints

- **Grenser for KI-forslag:** 1–5 økter (flere gir bare de 5 første), hver på 30 min–3 t, innenfor kl. 07:00–23:00, ikke i fortiden eller etter fristdagen, ingen overlapp med hendelser eller godtatte økter, og ingen økt de første 8 timene etter en hendelse som slutter neste dag. Nattevaktregelen bruker bare klokkeslett, så den virker uten titler. Manuelle økter har ingen av grensene.
- KI setter aldri frist. Øktforslag gjelder bare oppgaver med frist.
- **Lister:** En godtatt økt som ikke er passert, står i lista for sin dato som «Økt n/N – <oppgave>» med tid. Kjernen regner ut n/N. Øktene teller i gruppeantallet (hendelser gjør ikke det). Sortert etter dato, med øktene først på samme dato etter starttid. Ved sortering på Prioritet eller Nyeste og ved filter følger økta oppgaven sin. En økt som ikke er huket av når dagen er over, står i «Forfalt».
- **Avhuking:** En økt kan hukes av for seg og står med strek over til dagen er over. Oppgaven fullføres bare når selve oppgaven hukes av. Fullføring med uferdige økter spør «Du har n økter igjen. Fullføre likevel?». Ved ja følger øktene til Arkiv uten å endres. Ved gjenoppretting kommer de tilbake, og passerte økter som ikke er huket av, havner i «Forfalt». Når oppgaven slettes (manuelt eller etter 7 dager i Arkiv), slettes øktene samtidig.
- **Når øktforslag hentes:** ved første lagring med frist; når en oppgave uten frist og uten godtatte økter får frist; ved ny tekst eller ny frist når oppgaven har frist og verken godtatte eller ubesvarte øktforslag. Endret eller fjernet frist forkaster ubesvarte øktforslag uten melding, og nye hentes ikke, også når teksten endres i samme lagring. Oppgaver med godtatte økter får aldri nye øktforslag.
- **Kontroll og godtak:** Serveren forkaster økter som bryter grensene én og én og returnerer resten. Reserveløsningen gir aldri økter. Foreslåtte økter vises ikke i lister eller Kalender før de er godtatt. Ved godtak sjekkes kollisjon på nytt, men økta godtas likevel. Ubesvarte øktforslag med passert tid forkastes uten melding. Er alle forkastet, vises bare «+ Legg til økt».
- **Når KI ikke brukes:** Når KI er av, studenten har sagt nei til KI eller oppgaven har 🔒, vises ingen øktforslag og ingen «Foreslå ny tid», bare «+ Legg til økt» og *Endre tid*. Godtatte økter på 🔒-oppgaver kan likevel sendes som «opptatt».
- **Merker (Bør):** «⚠ Kolliderer med <tittel>» og «⚠ Etter fristen» i varselfarge med *Endre tid*. De står så lenge tilstanden varer. Uten frist får ingen økt «Etter fristen», og to økter som overlapper hverandre, gir ikke merke. Appen endrer aldri en godtatt økt selv.
- **Foreslå ny tid (Bør):** eget KI-kall som gir én ny tid innenfor grensene. Svarer ikke KI: «KI svarte ikke. Flytt økta selv med Endre tid.»
- **Suksesskriterier:** Alle øktforslag i planleggingscasene holder grensene, og hver case får minst én økt (sjekkes med regler, med ekte nøkkel). Brukertest: minst 4 av 5 legger inn en hendelse og godtar en økt uten hjelp innen 5 minutter. Testbrukerne bruker fiktive data.
- Norsk, WCAG 2.1 AA, farge aldri eneste signal (merker har ⚠ og tekst), og fastsatte tekster brukes ordrett.

## Technical Decisions

- **Datamodell:** En godtatt eller manuell økt ligger i samlingen `økter` med `oppgaveId`, `dato`, `start`, `slutt`, `kilde: "ki" | "manuell"` og `avhuket` (ISO-tidsstempel eller `null`). Foreslåtte økter ligger bare i `oppgave.forslag.økter` som `{ id, dato, start, slutt }`, aldri i `økter`. Godta eller Endre fjerner forslaget, og `forslag` blir `null` når både felt og økter er tomme. Samlingen finnes fra `schemaVersion` 1, så epicen skal ikke trenge ny skjemaversjon.
- Å fullføre eller gjenåpne en oppgave endrer aldri øktene. Hvor de vises, avledes av `oppgave.fullført`. Kommandoen som sletter en oppgave, sletter også øktene.
- **Rene regler i `kjerne/`:** øktgrensene, n/N, liste- og forfaltsplassering og merkene regnes ut av kjernen og lagres aldri. «Nå» kommer som parameter fra `state.nå`. Øktgrensene ligger som én funksjon som brukes både av serveren (kontroll av svaret) og ved godtak (kollisjonssjekk).
- **KI-utløsere:** Bare kommandoer starter kall, etter tabellen i `kjerne/ki-trigger.ts`, som bestemmer `ønsker: { felt, økter }`. Én lagring gir høyst ett `forslag`-kall. Skive 3 utvider `ønsker.økter` og legger ikke til nye kall. Unntaket er Bør-kallet `{ type: "nyTid", øktId, utdrag }`. `mottaKiSvar` forkaster svaret hvis `ventendeKall.id` ikke stemmer, oppgaven er borte, `kanSendes` er usann eller fristen er endret siden kallet startet.
- **Kontrakt:** svaret er `{ type: "ok", felt, økter, forkastet }` eller `{ type: "reserve", årsak }`. `kjerne/reserve.ts` gir ingen forslag for kall som bare gjelder økter eller `nyTid`. Alle kall, også `nyTid`, teller i kallgrensen (10 per 60 s per fane).
- **Utdrag til KI:** én ren funksjon. Hendelser og andre godtatte økter fra i dag og 14 dager fram, aldri etter fristdagen. Økter sendes bare som «opptatt» med tid. Hendelsestitler sendes bare når `sendHendelsestitler` er på og hendelsen ikke har 🔒. Fornavn sendes aldri, og ingenting fra 🔒-oppgaver. Hendelser og økter tas bare med når kallet ønsker økter, eller ved `nyTid`.
- `vedlikehold(nå)` (ved oppstart og hver time) forkaster passerte øktforslag.
- Endringer går gjennom navngitte kommandoer i Zustand-butikken. Bare `lib/storage/` rører localStorage. Skive 3 legger ikke til nye samlinger, kall eller rutemodeller.
- **Tester:** Vitest med fast «nå» for øktgrensene (mock-svarene i `tests/ki-testsett/mock/` skal gi ett godtatt og ett avvist svar) og for hver rad i utløsertabellen, også tekst og frist endret i samme lagring. Playwright med `page.clock` og mock-KI for Flyt 1 (godta økter), Flyt 5 (fullføre og gjenopprette med økter) og som Bør Flyt 4 og Flyt 2.

## UX & Interaction Patterns

- **Øktkort** (`session-card`): «Økt n/N – <oppgave>» med tid og avkrysningsring. Avhuket økt får strek over. Trykk åpner oppgavedetaljen. I detaljen har hver økt en «…»-meny med *Endre tid* og *Slett*. *Slett* gir dialogen «Slette økta? Det kan ikke angres.».
- **«+ Legg til økt»** (`add-session-button`) står alltid i oppgavedetaljen og åpner valg av dag og tid. *Endre tid* bruker samme valg.
- **Foreslått økt-rad** (`suggested-session-row`) står i KI-boksen under «✦ Foreslåtte økter» med dag og tid, for eksempel «Man 08:00–10:00», og *Godta* / *Endre*. *Godta alle* godtar også øktene.
- **Kalender:** bare godtatte økter, som hul ring på mobil og med klokkeslett på PC. Skjermlesertekst per dag teller økter («…, 1 økt, …»).
- **Dialoger:** fokusfelle, Esc = *Avbryt*, *Avbryt* har standardfokus ved sletting, og fokus går tilbake. Sletting av oppgave med økter: «Oppgaven og n økter slettes. Det kan ikke angres.».
- **Øktvarsel (Bør)** (`session-warning`): ⚠ og tekst i varselfarge, *Endre tid* og *Foreslå ny tid* bare når KI er på og oppgaven ikke har 🔒.
- Det finnes ingen fremdriftsstrek for økter.

## Cross-Story Dependencies

- 6.1 → 5.6 (Kalender). 6.2 → 6.1. 6.3 → 6.2, og bygger på avhuking, Arkiv og sletting fra Epic 2 (2.2–2.4).
- 6.4 → 5.2 (hendelsesregler, «+1 dag») og bruker mock-svarene fra 5.1.
- 6.5 → 6.4, 4.7 og 5.1. Den utvider `ki-trigger`, kontrakt, serverkontroll og reserve fra Epic 4 og kjører måleskriptet fra 4.8 med planleggingscasene. Epic 4 er ikke bygget ennå, så KI-sporet (6.5, 6.6, 6.9) venter på den.
- 6.6 → 6.5 og 6.1, og utvider KI-boksen og *Godta alle* fra 4.6. 6.7 → 6.6 og utvider testmanuset fra 4.9. 6.8 (Bør) → 6.6. 6.9 (Bør) → 6.8.
- 🔒 på oppgaver, `kiErPå` og bryteren «Send hendelsestitler til KI» kommer fra Epic 3 og 5.3.

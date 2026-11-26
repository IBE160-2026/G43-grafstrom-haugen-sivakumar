---
status: final
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/prd.md
  - docs/architecture/architecture-G43-grafstrom-haugen-sivakumar-2026-11-26/ARCHITECTURE-SPINE.md
  - docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/DESIGN.md
  - docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/EXPERIENCE.md
  - tests/ki-testsett/README.md
  - tests/ki-testsett/testsett.json
  - docs/product-brief.md
  - docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/tilbakemelding-prd.md
  - docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/validation-report.md
---

# dueNext – epics og stories

## Oversikt

Dette dokumentet deler kravene i PRD-en, UX-dokumentene (DESIGN.md og EXPERIENCE.md) og arkitekturen opp i epics og stories som kan bygges én og én. Epics følger leveranseskivene i PRD-en: skive 1 oppgaveapp, skive 2 KI og personvern, skive 3 planlegging. **Skive 3 kuttes først**, og innenfor skive 3 kuttes Bør-kravene først (FR-46–47, FR-52–53).

Ved konflikt gjelder PRD-en for *hva* appen skal gjøre, EXPERIENCE.md for *hvordan* og for fastsatte tekster, DESIGN.md for utseende, og arkitekturen (AD-1–AD-17) for hvordan koden er bygget. Mockupene i `mockups/` er bare visuell referanse.

## Kravoversikt

### Funksjonelle krav

Krav uten merke er **Må**. Skive står i parentes.

**F1 Oppgaver (skive 1)**
- FR-1: Studenten kan opprette en oppgave ved å skrive inn tekst. Tekst er det eneste påkrevde feltet.
- FR-2: Oppgaven lagres straks ved «Lagre», også når KI-forslag ikke er klare eller tilgjengelige.
- FR-3: Felt studenten lar stå tomme, forblir tomme til hun fyller dem ut eller godtar et KI-forslag.
- FR-4: Prioritet er «Middels» når ingen annen verdi er valgt.
- FR-5: Frist settes alltid av studenten og kan mangle. KI setter aldri frist, heller ikke ved øktforslag. Uten frist havner oppgaven i «Ingen frist».
- FR-6: Studenten kan når som helst redigere alle felt på en lagret oppgave, og fjerne fristen helt.
- FR-7: Studenten kan markere en oppgave som fullført. Den forsvinner fra smarte lister og flyttes til Arkiv.

**F1 Hendelser (skive 3)**
- FR-44: Studenten kan opprette en hendelse med tittel, dato, starttid og sluttid (alle påkrevd).
- FR-45: Sluttid før starttid betyr neste dag, vist som «21:00 – 07:30 (+1 dag)». Lik start og slutt er ugyldig.
- FR-46 (Bør): Gjentakelse Ingen / Hver uke / Annenhver uke med sluttdato. Uregelmessige tider legges inn én og én.
- FR-47 (Bør, med FR-46): Endring eller sletting av én forekomst spør «Bare denne / Denne og alle senere».
- FR-48: Hendelser kan ikke fullføres og havner aldri i Arkiv. Dagens hendelser øverst i «I dag», sortert etter starttid, forsvinner når de er over, teller ikke i gruppeantallet. Andre dager bare i Kalender.
- FR-64: Studenten kan endre og slette en hendelse og en enkelt økt. Sletting må bekreftes.

**F2 Forslag til felt (skive 2)**
- FR-8: Etter lagring hentes forslag til etikett, prioritet og sammendrag (og økter når oppgaven har frist, skive 3), bare når KI er på og oppgaven ikke er 🔒. Lagringen venter ikke.
- FR-9: Forslagene vises på den lagrede oppgaven, ett per felt og én rad per økt, med «Godta» og «Endre», og «Godta alle».
- FR-10: «Godta» setter verdien. «Endre» lar studenten velge eller skrive en annen.
- FR-11: Hvert forslag har teksten «KI-forslag» og annen stil enn godtatte verdier. Godtatt verdi har ikke merket.
- FR-12: Ubesvarte forslag gir standardverdier og vises igjen ved neste åpning til de er besvart. Foreslåtte økter med passert tid forkastes uten melding. Er alle øktforslag forkastet, vises bare «+ Legg til økt».
- FR-13: Endret tekst gir nye forslag til etikett, prioritet og sammendrag. Gamle verdier beholdes til de nye godtas. Med godtatte økter kommer ingen nye øktforslag.
- FR-62: Bare fristen endres → tabell: ingen nye feltforslag; uten frist og uten godtatte økter som får frist → øktforslag hentes; ubesvarte øktforslag og fristen endres/fjernes → forslagene forkastes, ingen nye; godtatte økter → endres ikke, FR-52 gjelder. (Skive 2 bygger feltdelen, skive 3 øktdelen.)
- FR-14: Svaret kontrolleres før det vises. Ugyldige verdier forkastes og reserveløsningen brukes. Øktforslag som bryter FR-49, forkastes hver for seg.
- FR-15: KI får bare oppgavetekst, notater (ikke ved FR-39) og frist; hendelser (tid, og tittel når FR-58 er på og hendelsen ikke er 🔒) og andre godtatte økter som «opptatt», bare ved øktforslag og «Foreslå ny tid», 14 dager fra i dag og aldri etter fristdagen; aldri fornavn og ingenting fra 🔒-oppgaver.

**F2 Økter (skive 3)**
- FR-49: KI foreslår økter for en oppgave med frist: 1–5 økter, 30 min–3 t, mellom 07:00 og 23:00, ikke i fortiden eller etter fristdagen, ingen overlapp med hendelser eller godtatte økter, ingen økt de første 8 timene etter en hendelse som slutter neste dag. Manuelle økter har ikke grensene.
- FR-50: Foreslåtte økter vises ikke i lister og Kalender før de er godtatt. Ved godtak sjekkes kollisjon på nytt; kolliderer den, godtas den likevel (med merke når FR-52 er bygget).
- FR-51: Studenten kan alltid legge til økter selv med «+ Legg til økt».
- FR-52 (Bør): Appen endrer aldri en godtatt økt automatisk. Merkene «⚠ Kolliderer med <tittel>» og «⚠ Etter fristen» med «Endre tid».
- FR-53 (Bør): «Foreslå ny tid» er eget KI-kall på en merket økt, gir én ny tid innenfor FR-49. Svarer ikke KI: «KI svarte ikke. Flytt økta selv med Endre tid.»
- FR-54: Øktforslag og «Foreslå ny tid» vises bare når KI er på og oppgaven ikke er 🔒. Ellers bare «Endre tid» og «+ Legg til økt».

**F3 Reserveløsning (skive 1)**
- FR-16: Er KI på, men nøkkel mangler, tidsavbrudd, tomt eller ugyldig svar, foreslår en regelbasert reserveløsning etikett og prioritet ut fra nøkkelord.
- FR-17: Reserveløsningen foreslår ikke sammendrag eller økter.
- FR-18: Reserveforslag vises som KI-forslag, med linjen «Forslag basert på nøkkelord – KI var ikke tilgjengelig» ordrett, og hver rad merket «regelbasert».
- FR-19: Har studenten sagt nei til KI, får hun ingen forslag, ingen øktforslag og ingen «Foreslå ny tid».

**F4 Smarte lister, filter, sortering og søk (skive 1) og Kalender (skive 3)**
- FR-20: Fem smarte lister i rekkefølgen Forfalt, I dag, Denne uken, Senere, Ingen frist.
- FR-21: Aktiv oppgave i nøyaktig én liste etter frist; godtatt, ikke passert økt i lista for sin dato som «Økt n/N – <oppgave>»; ikke avhuket økt etter dagen den gjelder i «Forfalt»; fullførte oppgaver og øktene deres i ingen liste; hendelser bare i «I dag». Gruppeantallet teller oppgaver og økter, ikke hendelser.
- FR-22: Uka går mandag–søndag. Søndag er «Denne uken» tom.
- FR-23: Endret frist flytter oppgaven straks til riktig liste.
- FR-24: Standard rekkefølge: nærmeste frist, så prioritet (Høy først), så opprettet (eldste først). «Ingen frist»: prioritet, så opprettet. Økter sorteres med oppgavene etter dato, øktene først på samme dato etter starttid. Hendelser øverst i «I dag».
- FR-25: Sortering på Frist (standard), Prioritet eller Nyeste. Økter følger oppgaven sin. Standard gjelder igjen neste gang lista åpnes.
- FR-26: Filter på etikett (filterknapper), prioritet, frist og prosjekt (filterark, aktive filtre som fjernbare knapper). Filteret gjelder også Kalender. Økter filtreres etter oppgaven sin, hendelser vises alltid.
- FR-27: Søk i tekst, notater, prosjekt og sammendrag.
- FR-28: Søket gir treff i aktive og fullførte oppgaver, og viser status og frist.
- FR-55 (skive 3): Kalender-fane med månedsvisning av oppgaver (på fristen), godtatte økter og hendelser; bla mellom måneder, velge dag med dagsliste og «+ Ny» med dagen utfylt; forfalte på opprinnelig dato i varselfarge; «Ingen frist» i egen seksjon.

**F5 Arkiv og sletting (skive 1, unntatt FR-56–57 i skive 3)**
- FR-29: Fullførte oppgaver ligger i Arkiv, egen fane ved Oppgaver og Kalender.
- FR-30: Fullført oppgave slettes automatisk 7 dager etter siste fullføring, sammen med øktene.
- FR-31: Hver arkivrad viser «Slettes om N dager».
- FR-32: Fullføring kan angres rett etter avhuking og fra Arkiv. Oppgaven havner i riktig liste; øktene kommer tilbake, passerte uavhukede i «Forfalt».
- FR-33: Studenten kan slette en oppgave fra smarte lister og fra Arkiv.
- FR-34: Sletting krever «Er du sikker?»-dialog som sier hvor mange økter som slettes. Kan ikke gjenopprettes.
- FR-56 (skive 3): En økt kan hukes av for seg og står med strek over til dagen er over. Oppgaven fullføres bare når selve oppgaven hukes av.
- FR-57 (skive 3): Fullføring med uferdige økter spør «Du har n økter igjen. Fullføre likevel?». Ved ja følger øktene til Arkiv.

**F6 Personvern og egne data (skive 2)**
- FR-35: Første oppstart: fornavn, så KI-valg med demo-advarsel og fastsatt samtykketekst. KI av til ja. «Nei» og «Ja» like lette, ingen forhåndsvalgt. Samtykket lagres med dato og tekstversjon; ny versjon krever nytt samtykke.
- FR-36: KI-valget kan endres når som helst i Personvern og data, med samtykkestatus. Slås KI på etter «Nei», vises samtykketeksten først.
- FR-37: Når KI er på, vises KI-påminnelse under oppgavetekst, under skrivefeltet (PC) og under hendelsestittel, med variant etter FR-39, FR-58 og 🔒. Ingen påminnelse når KI er av.
- FR-38: «🔒 Ikke send til KI» på oppgave: ingenting sendes, ingen forslag, ingen øktforslag, ingen «Foreslå ny tid»; godtatte økter kan sendes som «opptatt». På hendelse: «🔒 Skjul tittel for KI». Låsikon vises.
- FR-39: Studenten kan velge at notater aldri sendes til KI.
- FR-58: Studenten kan velge om hendelsestitler sendes til KI. Standard er på.
- FR-40: «Slett alle data» sletter alt etter bekreftelse, og appen starter på førstegangsoppsettet.
- FR-41: Personvernerklæring på norsk, ett klikk unna fra alle skjermbilder, med innholdet PRD-en lister.
- FR-42 (Bør): Telefonnumre og e-post byttes med plassholdere før sending. Navn maskeres ikke. Til FR-42 er bygget vises advarselen om navn, telefonnummer og helseopplysninger.
- FR-65: Fast demo-advarsel i førstegangsoppsettet før KI-valget og øverst i Personvern og data, også når KI er av.
- FR-43 (Bør): Eksport av alle data til fil (med advarsel) og import som erstatter alt etter bekreftelse. Samtykket følger ikke med. Importerte oppgaver sender ingenting til KI før teksten endres.

**F7 Profil, utseende og prosjekter (skive 1)**
- FR-59: Fornavn i førstegangsoppsettet eller Innstillinger → Profil, brukt bare i hilsenen, lagres bare i nettleseren, sendes aldri. Uten navn «Hei 👋».
- FR-60: Lys, Mørk eller Følg systemet (standard), vises med én gang.
- FR-63 (Bør): Ett av seks fargetemaer, vises med én gang. Ellers standardtemaet (pastellblå).
- FR-61 (Bør): Innstillinger → Prosjekter viser brukte prosjektnavn; sletting etter bekreftelse fjerner navnet fra alle oppgaver. Etikettene er faste.

### Ikke-funksjonelle krav

- NFR-1: Kan startes lokalt etter README uten gruppens nøkkel, betalte kontoer eller eksterne tjenester. Bare lokal kjøring, ingen offentlig publisering.
- NFR-2: Claude-kallet gjøres fra serveren. Nøkkelen bare i `.env.local`; `.env.example` viser variablene.
- NFR-3: Ingen analyseverktøy eller tredjepartsskript. Serveren logger ikke innhold.
- NFR-4: Alle data bare i nettleseren og bevares mellom økter. Ingen innlogging eller ekstern database. Feiler lagring, vises banner så lenge feilen varer.
- NFR-5: Med mock-KI som svarer etter 10 s vises oppgaven i lista innen 1 s etter «Lagre».
- NFR-6: Automatiske tester bruker mock-svar: gyldig, ugyldig, tomt og tidsavbrudd. De tre siste gir reserveløsningen.
- NFR-7: Dato- og tidsregler kan testes med fast «nå».
- NFR-8: All tekst i appen, KI-forslagene og erklæringen er på norsk.
- NFR-9: WCAG 2.1 AA på alle flater (EXPERIENCE.md → Accessibility Floor).
- NFR-10: Web-app som fungerer på telefon, nettbrett og PC. Ingen egen iOS/Android-app.
- NFR-11: Ny personvernvurdering før ekte data, innlogging eller ekstern lagring.
- NFR-12: KI-kall avbrytes etter 15 s (da FR-16). Høyst ett forslagskall per lagring og 10 KI-kall per minutt per nettleser; kall over grensen gir reserveløsningen.

**Suksesskriterier som må kunne måles:** etikett ≥ 16/20, prioritet ≥ 14/20 og smarte lister 20/20 i KI-testsettet; alle øktforslag holder FR-49 og hvert planleggingscase får minst én økt (sjekkes med regler); brukertest ≥ 4/5 for oppgave + endre KI-forslag, og etter skive 3 ≥ 4/5 for hendelse + godta økt; motmål: ≥ 4/5 svarer riktig på to spørsmål om samtykket.

### Tilleggskrav fra arkitekturen

- **Oppstart (første story):** Ingen ny startmal. Prosjektet er create-next-app (Next 16.3.5, React 19.2.8). `package.json` oppdateres: fjern `prisma` og `@prisma/client`; legg til `zustand` 5.1.0, `zod` 4.6.7, `server-only`, `vitest` 5.1.2, `vite`, `@playwright/test` 1.65.1 og `@axe-core/playwright` 4.14.1; oppgrader `@anthropic-ai/sdk` til 1.x (1.14.0) og `@types/node` til ^24; `-H 127.0.0.1` i `dev` og `start`; `KI_MOCK` i `.env.example`. Startfilene fra create-next-app (`app/page.tsx`, bildene i `public/`) erstattes.
- AD-1: Alle regler som rene funksjoner i `kjerne/` (bare `kjerne/` og `zod`, ingen klokke, nettleser eller nettverk). Avledede verdier lagres aldri.
- AD-2: Én Zustand-butikk i `lib/store/` med navngitte kommandoer; lagring skjer på ett sted via abonnement.
- AD-3: Ett versjonert JSON-dokument i én localStorage-nøkkel; `migrer(rå)` med trinnvis migrering og zod-validering; `for-ny`/`ugyldig` gir feilside med eksport av rådata og «Slett alle data» uten overskriving; `storage`-hendelse laster på nytt.
- AD-4: Samlingene `oppgaver`, `økter`, `hendelser` og objektene `innstillinger`, `profil`, `samtykke` finnes fra `schemaVersion` 1. Foreslåtte økter bare i `oppgave.forslag.økter`. Prosjekter uten egen samling. Gjentakende hendelser foldes ut med `seriesId`.
- AD-5: Datoer `YYYY-MM-DD`, klokkeslett `HH:mm`, lokal tid; tidsstempler ISO UTC. `nå` i butikken, eneste klokke i `lib/klokke.ts` (hvert minutt og ved synlighet); `vedlikehold(nå)` ved oppstart og hver time (ryddArkiv + forkaste passerte øktforslag). Playwright bruker `page.clock`.
- AD-6: Eneste vei til Claude er `POST /api/ki` (route handler). Zod-kontrakt i `kjerne/ki-kontrakt.ts` med typene `forslag`/`nyTid` og svar `ok`/`reserve` med `årsak`. Ingen logging av innhold.
- AD-7: `claude-sonnet-5-5` via `messages.parse` + `zodOutputFormat`, `effort: "low"`, `maxRetries: 0`, server-frist 13 s, avbryt ved lukket forespørsel; norsk systemprompt i `server/`; `refusal` → `avvist`.
- AD-8: `lib/ki/` er eneste klient, endrer ikke tilstand; kallgrense 10 per 60 s i minnet per fane; én tabell i `kjerne/reserve.ts` (kalltype × årsak).
- AD-9: Én ren funksjon lager utdraget til KI (14 dager, aldri etter fristdagen, titler etter FR-58/🔒, aldri fornavn).
- AD-10: Brukerdata vises i klientkomponenter med skjelett til lagringen er lest; lagring starter først etter innlasting.
- AD-11: Bare `127.0.0.1`; `/api/ki` avviser `Host` som ikke er `127.0.0.1` eller `localhost`.
- AD-12: Zod-skjema i `kjerne/skjema.ts` med låste former for `forslag`, `fullført`, `avhuket`, `kilde`, `ventendeKall` og `samtykke`; `kiErPå` og `kanSendes` er eneste beslutningssteder.
- AD-13: KI-kall startes bare av kommandoer etter tabellen i `kjerne/ki-trigger.ts`; `ventendeKall` med id; `mottaKiSvar` forkaster foreldede svar.
- AD-14: Mock-KI bare i `server/`, aktivert med `KI_MOCK=1` og headeren `x-ki-mock` (`gyldig`, `ugyldig`, `tomt`, `tidsavbrudd`, `treg-10s`), svar fra `tests/ki-testsett/mock/`.
- AD-15: Ruter `/`, `/kalender`, `/arkiv`, `/innstillinger`, `/personvern`, `/personvernerklaering`, `/oppstart`; valgt innhold i søkeparametre; egen side under `lg`, detaljpanel fra `lg`; rotlayouten sender til `/oppstart` når `samtykke` er `null`.
- AD-16: `<html lang="nb">`, tema-skript i `<head>` setter `data-tema` og `data-modus` før første tegning; farger som CSS-variabler i `app/globals.css`.
- AD-17: Filter og søk i `visning` (ikke lagret, delt av Oppgaver og Kalender); sortering lokal og starter på «Frist».
- Konvensjoner: norske domenenavn med æøå i kode og JSON, filnavn uten æøå; fastsatte tekster ordrett i `kjerne/tekster.ts`; Vitest for `kjerne/` med fast «nå» og én test per migrering; Playwright for Flyt 1–7 med mock-KI og axe-sjekk på hver hovedside.
- Utsatt til stories: nøkkelord for reserveløsningen (Å-7, F3-storyen), komponentbibliotek (første UI-story), prompttekst og ett ekte kall som bekrefter `effort` (F2-storyen).
- Skive 3 legger ikke til nye samlinger, kall eller rutemodeller.

### UX-designkrav

- UX-DR1: Fargetokener fra DESIGN.md som CSS-variabler for lys og mørk modus, styrt av `data-tema` og `data-modus`, med de seks temaene og pastellblå som standard.
- UX-DR2: Typografi med Poppins (system-reserve) og rollene greeting, title, body, task-title, meta, tag og section-label; spacing-skala 4–32 px, marger 16/24 px, rundinger sm/md/lg/xl/full.
- UX-DR3: Glødsone med `background-glow` (0,75 lys / 0,30 mørk); sekundærtekst i glødsonen bruker `text-on-glow`, aldri `text-muted` eller `warn`.
- UX-DR4: Responsivt oppsett: mobil bunnmeny (Oppgaver/Kalender/Arkiv) med logo, lupe og ⚙ øverst og FAB; nettbrett sidemeny + FAB; PC (≥ 1024) sidemeny 200 px, liste, detaljpanel 340 px og skrivefelt.
- UX-DR5: Personvernlenken «Personvernerklæring» synlig på alle skjermer (nederst på hver side på mobil, nederst i sidemenyen på PC); fra førstegangsoppsettet uten at oppsettet mistes.
- UX-DR6: Oppgavekort med ring, tittel, godtatt sammendrag med ✦, merkelapper prosjekt/frist/prioritet, forfalt-stripe, Høy i varselfarge, låsikon og ✦-prikk for ubesvarte forslag.
- UX-DR7: Gruppeoverskrifter med antall («I DAG · 3»), FORFALT i varselfarge, «Ingen frist (n)» sammenleggbar; tomme grupper skjules unntatt «I dag»; tomtilstander («Alt unna i dag 🎉 Nyt kvelden!», helt tom app med/uten KI, tomt filter med *Fjern filter*).
- UX-DR8: Avkrysningsring 20 px med 44 px trykkflate; animasjon ca. 300 ms og glid ut, umiddelbart ved `prefers-reduced-motion`; snackbar «Flyttet til Arkiv · Angre» i ca. 5 s, én om gangen, annonsert for skjermleser.
- UX-DR9: Skjema Ny/Endre som egen side (mobil/nettbrett) og panel (PC); hjelpetekst «Bare oppgaveteksten er påkrevd. Resten kan stå tomt.»; feil ved feltet («Skriv inn hva du skal gjøre», «Slutt må være etter start»), innhold beholdes; «Forkaste endringene?» bare ved endringer; velger [Oppgave | Hendelse] bare ved Ny, uten å miste teksten.
- UX-DR10: Prioritetsvelger Lav/Middels/Høy med piltaster og `aria-pressed`; valgt tilstand alltid med kant i `accent-ink` eller hake i tillegg til pastellfyll.
- UX-DR11: Filterknapper Alle/Skole/Jobb/Privat, filterark (nedenfra på mobil, nedtrekk på PC) med prioritet, frist og prosjekt; aktive filtre som fjernbare knapper med «×»; sorteringsknapp «⇅ Frist» med meny.
- UX-DR12: Søk: lupe som fyller toppen på mobil med *Avbryt*, søkefelt ved filterknappene på PC; treff som oppgavekort med *Aktiv*/*Fullført*; tom-tekst «Fant ingenting på "…". Sjekk stavingen eller prøv et annet ord.»; Esc lukker.
- UX-DR13: Oppgavedetalj: felt som ledetekst/verdi, KI-boks, økter, notater, *Endre*, *Fullfør*, *Slett*.
- UX-DR14: KI-forslagsboks: pastell blandet med kortfarge, «✦ KI-forslag», én rad per felt med *Godta*/*Endre*, *Godta alle*, «Frist: ingen foreslått – legg til selv», nye forslag med «(nå: …)», skeleton «✦ Lager forslag …», `aria-live` «3 KI-forslag klare», all tekst i `text-primary`/`accent-ink`.
- UX-DR15: Merket «regelbasert» på hver reserverad og linjen «Forslag basert på nøkkelord – KI var ikke tilgjengelig».
- UX-DR16: Arkiv: forklaringstekst om 7 dager, arkivrader med strek, «Slettes om n dager» / «Slettes i morgen» i varselfarge, «…»-meny med *Gjenopprett* og *Slett nå*, tomt arkiv «Ingen fullførte oppgaver ennå – hold på! 💪».
- UX-DR17: Dialoger med fokusfelle, Esc = *Avbryt*, *Avbryt* standardfokus ved sletting, fokus tilbake; fastsatte tekster for sletting av oppgave (med og uten økter), økt, import og «Slett alle data».
- UX-DR18: Lagringsbanner «Nettleseren lar ikke appen lagre. Det du skriver nå, forsvinner når du lukker fanen.» øverst på alle sider, kan ikke lukkes.
- UX-DR19: Førstegangsoppsett som helside med glød: side 1 «Hei! Hva heter du?» med hjelpeteksten «Bare for hilsenen. Lagres på denne enheten.», *Fortsett* og *Hopp over*; side 2 demo-advarsel (nøytral infoboks) og samtykketekst med like store *Nei, uten KI* / *Ja, bruk KI*.
- UX-DR20: Personvern og data i fast rekkefølge (demo-advarsel → KI-forslag → notater → hendelsestitler → Hva sendes til KI → Lagring → Eksporter/Importer → Slett alle data → erklæring), to kolonner på PC uten detaljpanel; alle tekster ordrett fra EXPERIENCE.md.
- UX-DR21: KI-påminnelser (`ai-reminder`) med fastsatte varianter for oppgave, hendelse, 🔒 og titler av; personvernbryter med hjelpetekst; låsikon med skjermlesertekst «Skjult for KI».
- UX-DR22: Innstillinger: Profil, Utseende (modusvelger og seks temaprøver), Prosjekter (med tomtekst og sletting), Personvern og data, Om appen.
- UX-DR23: Øktkort «Økt n/N – <oppgave>» med tid, strek når avhuket, «…»-meny *Endre tid*/*Slett*; foreslått økt-rad i KI-boksen; «+ Legg til økt»; øktvarsel med ⚠ og tekst og *Endre tid* / *Foreslå ny tid*.
- UX-DR24: Hendelsesrad uten ring med tid først, `border-subtle`, låsikon, «(+1 dag)»; hendelsesdetalj med *Endre*/*Slett* og spørsmålet om serie.
- UX-DR25: Kalender: månedsrutenett, ‹ › og «I dag», valgt dag med pastell + kant, dagens dato med ring; mobil med prikker (oppgave fylt ink, økt hul ring, hendelse muted, forfalt warn), PC med titler og «+n til»; dagsliste under (mobil) eller i panel (PC) med «+ Ny»; «Ingen frist (n)» sammenleggbar; «Ingen planer denne måneden ennå», «Fri dag 🙌»; piltaster og skjermlesertekst per dag.
- UX-DR26: Tilgjengelighet: tilgjengelige navn på alle kontroller, synlig fokusring 2 px `accent-ink`, trykkflater ≥ 44 px, farge aldri eneste signal, `prefers-reduced-motion` og `prefers-color-scheme`, tastaturbruk på PC (Tab, Enter, Esc, «N»), aldri mer enn ett dialognivå.
- UX-DR27: Tone: du-form, heiende i positive øyeblikk; personvern, sletting og feil saklig uten emoji. Bannlyst: straffende streaks, badge-tellere, karuseller, automatisk omplanlegging.

### Funn fra PRD-valideringen som tas i stories

De fire middels funnene i `validation-report.md` (punkt i `.logs/abhira/issues.md`). PRD-en er delvis rettet 2026-11-26; resten tas som akseptansekriterier:

- **V-1 Brukertest for planlegging.** Lagt inn i suksesskriteriene. Tas som egen story for brukertest etter skive 3.
- **V-2 Regelen for øktforslag samlet.** FR-62 er nå en tabell, men to tilfeller mangler: tekst og frist endret i samme lagring, og frist endret på en oppgave uten ubesvarte eller godtatte økter (for eksempel fordi alle forslag gikk ut). Tas i storyen for `kjerne/ki-trigger.ts`: øktforslag hentes ved første lagring med frist, når en oppgave uten frist får frist, og ved ny tekst eller ny frist når oppgaven har frist og verken godtatte eller ubesvarte økter; endret frist forkaster ubesvarte øktforslag uten melding, også når teksten endres samtidig.
- **V-3 Øktmerker som tilstand.** FR-52 er Bør. Tas i FR-52-storyen: merkene regnes ut av kjernen (AD-1) og står så lenge økta overlapper en hendelse eller ligger etter fristen; uten frist får ingen økt «Etter fristen»; økt mot økt gir ikke merke.
- **V-4 Advarselen i FR-42.** Tas i FR-42-storyen: advarselen om navn og helseopplysninger blir stående når maskeringen bygges; bare delen om telefonnummer erstattes.

### FR-dekning

| Krav | Epic | Kort |
|---|---|---|
| FR-1–6 | Epic 1 | Opprette, lagre og redigere oppgaver |
| FR-7 | Epic 2 | Fullføre oppgave |
| FR-8–15 | Epic 4 | KI-forslag til felt, kontroll og utdrag |
| FR-16–17 | Epic 2 (regler) og Epic 4 (flyt) | Reserveløsningens nøkkelord og når den slår inn |
| FR-18–19 | Epic 4 | Visning av reserveforslag, KI av |
| FR-20–24 | Epic 1 | Smarte lister og standard rekkefølge |
| FR-25–28 | Epic 2 | Sortering, filter og søk |
| FR-29–34 | Epic 2 | Arkiv, angre og sletting |
| FR-35–41 | Epic 3 | Samtykke, KI-valg, påminnelser, 🔒, notater, slett alle data, erklæring |
| FR-42 (Bør) | Epic 4 | Maskering av telefon og e-post (med V-4), story 4.10 |
| FR-43 (Bør) | Epic 3 | Eksport og import |
| FR-44–45, FR-48 | Epic 5 | Hendelser, over midnatt, i «I dag» |
| FR-46–47 (Bør) | Epic 5 | Gjentakende hendelser |
| FR-49–51, FR-54 | Epic 6 | Økter: KI-forslag med grenser, godta, manuelle |
| FR-52–53 (Bør) | Epic 6 | Øktmerker (med V-3) og «Foreslå ny tid» |
| FR-55 | Epic 5 | Kalender |
| FR-56–57 | Epic 6 | Avhuke økt, fullføre med uferdige økter |
| FR-58 | Epic 3 | Bryter for hendelsestitler |
| FR-59–60 | Epic 1 | Fornavn, lys/mørk modus |
| FR-61, FR-63 (Bør) | Epic 2 | Prosjekter, fargetemaer |
| FR-62 | Epic 4 (felt) og Epic 6 (økter, med V-2) | Bare fristen endres |
| FR-64 | Epic 5 (hendelser) og Epic 6 (økter) | Endre og slette |
| FR-65 | Epic 3 | Demo-advarsel |
| NFR-1–5, NFR-7–10 | Epic 1 (grunnmur), sjekkes i alle | Lokal kjøring, lagring, ytelse, tid, norsk, WCAG, responsiv |
| NFR-6, NFR-12 | Epic 4 | Mock-KI, tidsfrist og kallgrense |
| NFR-11 | Epic 3 | Erklæring og samtykke sier at v1 bare er for fiktive data |
| V-1 | Epic 6 | Brukertest for planlegging |
| V-2 | Epic 6 | Samlet regel for øktforslag |
| V-3 | Epic 6 | Øktmerker som beregnet tilstand |
| V-4 | Epic 4 | Advarselen om navn og helse blir stående |

## Epic-liste

Epicene bygges i rekkefølge. Ingen epic trenger en senere epic for å virke. Epic 1–4 er hele appen uten planlegging. Skive 3 (Epic 5–6) kuttes først, og Bør-stories kuttes før Må-stories.

### Epic 1: Skriv ned og se hva som haster (skive 1)
Studenten starter appen, legger inn fornavn, oppretter og redigerer oppgaver og ser dem i de fem smarte listene, på mobil og PC, i lys og mørk modus. Dataene er der neste gang hun åpner appen.
**Krav:** FR-1–6, FR-20–24, FR-59, FR-60, NFR-1–5, NFR-7–10

### Epic 2: Fullfør, rydd og finn fram (skive 1)
Studenten huker av og angrer, ser Arkiv med 7-dagersregelen, sletter, filtrerer, sorterer og søker, og velger tema og prosjekter. Reserveløsningens nøkkelord bygges og måles mot KI-testsettet (Å-7).
**Krav:** FR-7, FR-16–17 (regler), FR-25–34, FR-61 (Bør), FR-63 (Bør)

### Epic 3: Samtykke og kontroll over egne data (skive 2)
Studenten får KI-valg med demo-advarsel og samtykketekst i førstegangsoppsettet, Personvern og data, 🔒-brytere, påminnelser, «Slett alle data» og personvernerklæringen. Fra denne epicen sender appen til `/oppstart` når samtykket mangler (AD-15).
**Krav:** FR-35–41, FR-58, FR-65, FR-43 (Bør), NFR-11

### Epic 4: KI-forslag til etikett, prioritet og sammendrag (skive 2)
Studenten får KI-forslag per felt etter lagring og godtar eller endrer dem. Uten KI får hun regelbaserte forslag. Omfatter `/api/ki`, mock-KI, Claude-kallet, kallgrensen, `ki-trigger`, måling mot KI-testsettet og brukertest for KI-forslag.
**Krav:** FR-8–15, FR-16–19 (flyt og visning), FR-62 (felt), NFR-6, NFR-12, FR-42 (Bør, V-4)

### Epic 5: Hendelser og Kalender (skive 3)
Studenten legger inn hendelser og ser oppgaver, hendelser og (senere) økter i Kalender. Første story utvider KI-testsettet med planleggingscaser, slik at det er klart før skive 3 testes.
**Krav:** FR-44, FR-45, FR-48, FR-55, FR-64 (hendelser), FR-46–47 (Bør)

### Epic 6: Økter planlagt med KI (skive 3)
Studenten legger inn økter selv eller godtar øktforslag fra KI rundt hendelsene, huker av økter og ser dem i lister og Kalender. Avsluttes med brukertest for planlegging.
**Krav:** FR-49–54, FR-56, FR-57, FR-62 (økter, V-2), FR-64 (økter), FR-52–53 (Bør, V-3), V-1

## Arbeidsdeling og tidsplan

Alle fire koder. Arbeidet går i fire spor som kan gå parallelt når grunnmuren (1.1–1.3) er ferdig. Sporene ble fordelt 2026-11-26. Linjen under hver storytittel viser spor og avhengigheter. En story kan startes når storyene den avhenger av, er ferdige.

| Spor | Ansvarlig | Ansvar | Stories i rekkefølge |
|---|---|---|---|
| A Oppgaver | Abhira | Grunnmur og oppgavelista | 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 2.2, 2.3, 2.4 |
| B Utseende og personvern | Lena | Ramme, design og samtykke | 1.4, 1.8, 3.2, 3.3, 3.4, 3.5, 3.6, 2.7 (Bør), 2.8 (Bør), 3.7 (Bør) |
| C KI | Sabrina | Hele KI-veien | 3.1, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.10 (Bør), deretter 6.5, 6.6, 6.9 (Bør) |
| D Regler og planlegging | Stine | Rene kjerneregler først, så filter, søk og skive 3 | 2.1, 5.1, 5.2, 6.4, 2.5, 2.6, deretter 5.3–5.7 og 6.1–6.3, 6.8 (Bør) |
| Alle | Alle | Brukertester | 4.9, 6.7 |

**Slik går hver story:** Koderen bygger med `bmad-build`, inkludert testene i akseptansekriteriene. En annen i gruppa går gjennom med `bmad-code-review` eller `bmad-walkthrough` og tester i nettleseren på mobil og PC (A og B går gjennom hverandres – Abhira og Lena; C og D hverandres – Sabrina og Stine). Storyen er ferdig når den er godkjent og committet. Alle skriver sesjonslogg.

**Tidsplan (frist 15.12.2026):**

| Datoer | Mål |
|---|---|
| 26.11–1.12 | 1.1–1.4 ferdig. Spor D lager rene kjerneregler (2.1, 5.1, 5.2, 6.4). Rekrutter 5 testbrukere |
| 2.12–6.12 | Resten av Epic 1 og 2, Epic 3, KI-veien 4.1–4.5 |
| 7.12–9.12 | 4.6–4.8 og måling mot testsettet. Skive 3 starter i spor D |
| **9.12 – sjekkpunkt** | Er skive 1 og 2 ferdige og testet? Hvis nei: kutt skive 3 og bruk tiden på feilretting |
| 10.12–12.12 | Brukertest 4.9. Skive 3 (Må-stories først). Bør-stories bare hvis alt annet er ferdig |
| 13.12–15.12 | Brukertest 6.7 hvis skive 3 er med, feilretting, dokumentasjon. Ingen nye funksjoner |

**Kuttrekkefølge:** Bør-stories i skive 3 (5.7, 6.8, 6.9) → resten av skive 3 → Bør-stories i skive 1 og 2 (2.7, 2.8, 3.7, 4.10).

**Hvis skive 3 kuttes:** Epic 1–4 er en fungerende oppgaveapp med KI-forslag. Kalender-fanen (1.4, 5.6) og bryteren for hendelsestitler (3.4, 5.3) vises ikke før skive 3 er bygget. Suksesskriteriet for øktforslag og brukertesten for planlegging faller bort og nevnes i rapporten som kuttet etter planen i PRD-en.

## Epic 1: Skriv ned og se hva som haster

Studenten starter appen, oppretter og redigerer oppgaver og ser dem i de fem smarte listene, på mobil og PC, i lys og mørk modus. Dataene er der neste gang hun åpner appen. Ingen KI ennå. Førstegangsoppsettet med KI-valg kommer i Epic 3, så i denne epicen åpner appen rett på Oppgaver.

### Story 1.1: Gjør prosjektet klart etter arkitekturen

*Spor A, alle hjelper · Avhenger av ingenting*

Som utvikler i gruppa,
vil jeg at `package.json`, miljøvariablene og testoppsettet følger arkitekturen,
slik at alle stories bygger på samme pakker og kan testes fra første dag.

**Akseptansekriterier:**

**Gitt** `package.json` slik den er i dag
**Når** storyen er ferdig
**Så** er `prisma` og `@prisma/client` fjernet, og ingen fil importerer dem
**Og** `zustand` 5.1.0, `zod` 4.6.7 og `server-only` er avhengigheter, og `vitest` 5.1.2, `vite`, `@playwright/test` 1.65.1 og `@axe-core/playwright` 4.14.1 er utviklingsavhengigheter (Stack i arkitekturen)
**Og** `@anthropic-ai/sdk` er oppgradert til 1.x (1.14.0) og `@types/node` til ^24
**Og** `engines.node` er `>=22`

**Gitt** skriptene i `package.json`
**Når** utvikleren kjører `npm run dev` eller `npm run build && npm start`
**Så** starter Next med `-H 127.0.0.1` og kan bare nås fra egen maskin (NFR-1, AD-11)
**Og** `npm test` kjører Vitest og `npm run test:e2e` kjører Playwright, begge uten feil på en tom testmappe

**Gitt** `.env.example`
**Når** storyen er ferdig
**Så** har den `ANTHROPIC_API_KEY=` og `KI_MOCK=`, med en norsk kommentar om at `KI_MOCK=1` bare brukes i tester (AD-14)
**Og** det finnes ingen `NEXT_PUBLIC_`-variabler for KI, og `.env.local` er i `.gitignore` (NFR-2)

**Gitt** startfilene fra create-next-app
**Når** storyen er ferdig
**Så** er innholdet i `app/page.tsx` og bildene i `public/` erstattet, og `app/layout.tsx` har `<html lang="nb">` og norsk tittel
**Og** mappene `kjerne/`, `lib/`, `server/`, `components/`, `tests/kjerne/` og `tests/e2e/` finnes etter Structural Seed
**Og** README viser adressen `http://127.0.0.1:3000`, at appen virker uten nøkkel, og hvordan testene kjøres (NFR-1)
**Og** `npm run build` og `npm run lint` går uten feil

### Story 1.2: Lagringsformat som tåler nye versjoner

*Spor A · Avhenger av 1.1*

Som student,
vil jeg at dataene mine lagres i et fast format som kan oppgraderes uten at noe går tapt,
slik at en ny versjon av appen aldri sletter det jeg har skrevet.

**Akseptansekriterier:**

**Gitt** arkitekturen AD-3, AD-4 og AD-12
**Når** storyen er ferdig
**Så** finnes `kjerne/skjema.ts` med zod-skjema for dokumentet, `schemaVersion` 1 og `GJELDENDE_SKJEMAVERSJON`, med samlingene `oppgaver`, `økter` og `hendelser` og objektene `innstillinger`, `profil` og `samtykke`
**Og** formene for `oppgave.forslag`, `oppgave.fullført`, `økt.avhuket`, `økt.kilde`, `oppgave.ventendeKall` og `samtykke` er som i AD-12, og typene avledes med `z.infer`

**Gitt** rå JSON fra localStorage
**Når** `kjerne/migrering.ts: migrer(rå)` kjøres
**Så** gir den et gyldig dokument, `for-ny` eller `ugyldig`, uten å kaste
**Og** Vitest dekker tomt lager (nytt dokument), gyldig dokument, høyere `schemaVersion` (`for-ny`) og ødelagt JSON (`ugyldig`)

**Gitt** adapteren i `lib/storage/`
**Når** den leser og skriver
**Så** er den eneste kode som rører localStorage, under én fast nøkkel (AD-3)
**Og** lesing går alltid gjennom `migrer`, og et migrert dokument skrives tilbake med én gang
**Og** ved `for-ny` eller `ugyldig` skriver adapteren aldri over det lagrede, og returnerer rådataene slik at de kan eksporteres
**Og** en skriving som feiler, gir en navngitt feil og kaster ikke
**Og** storyen har ingen UI. Alt testes med Vitest mot en falsk localStorage

### Story 1.3: Appen husker og følger klokka

*Spor A · Avhenger av 1.2*

Som student,
vil jeg at det jeg legger inn, fortsatt er der neste gang jeg åpner appen, og at appen vet hvilken dag det er,
slik at jeg kan stole på dueNext uten konto eller innlogging.

**Akseptansekriterier:**

**Gitt** Zustand-butikken i `lib/store/` og `lib/klokke.ts`
**Når** appen starter
**Så** leser butikken dokumentet via `lib/storage/`, setter `nå` fra klokka og viser skjelett til innlastingen er ferdig (AD-10)
**Og** lagring starter først etter innlasting, slik at et tomt dokument aldri overskriver lagrede data
**Og** butikken lagrer via ett abonnement på dokumentet (AD-2), og bare `lib/storage/` rører localStorage (AD-3)
**Og** klokka oppdaterer `nå` hvert minutt og når fanen blir synlig igjen, og ingen annen kode leser klokka (NFR-7, AD-5)
**Og** kommandoene leser tilstand med `get()` og endrer data bare via kjernen (AD-2)

**Gitt** at lagret dokument er `for-ny` eller `ugyldig`
**Når** appen starter
**Så** viser appen en feilside med eksport av rådata og «Slett alle data», og det lagrede overskrives ikke

**Gitt** at nettleseren ikke lar appen lagre
**Når** en skriving feiler
**Så** vises banneret «Nettleseren lar ikke appen lagre. Det du skriver nå, forsvinner når du lukker fanen.» øverst på alle sider så lenge feilen varer, og appen virker ellers (NFR-4, UX-DR18)

**Gitt** at en annen fane skriver dokumentet
**Når** `storage`-hendelsen kommer
**Så** laster appen dokumentet på nytt

### Story 1.4: Appens ramme, navigasjon og utseende

*Spor B · Avhenger av 1.2*

Som student,
vil jeg ha en rolig og gjenkjennelig ramme med faner på mobil og sidemeny på PC,
slik at jeg finner fram uten innlæring.

**Akseptansekriterier:**

**Gitt** DESIGN.md
**Når** storyen er ferdig
**Så** er fargene for lys og mørk modus og de seks temaene CSS-variabler i `app/globals.css`, styrt av `data-tema` og `data-modus` på `<html>`, med pastellblå som standard (UX-DR1, AD-16)
**Og** Poppins med systemskrift som reserve, typografirollene, spacing og rundinger er satt opp som i DESIGN.md (UX-DR2)
**Og** gløden ligger øverst på hver hovedside, og sekundærtekst i glødsonen bruker `text-on-glow` (UX-DR3)

**Gitt** et lite skript i `<head>`, eid av `lib/storage/`
**Når** siden lastes
**Så** settes tema og modus før første tegning, uten blink og uten hydreringsfeil (AD-16)
**Og** «Følg systemet» følger `prefers-color-scheme`

**Gitt** skjermbredden
**Når** den er under 768 px
**Så** vises bunnmeny med Oppgaver, Kalender og Arkiv, og logo, lupe og ⚙ øverst (UX-DR4)
**Og** fra 768 px vises sidemenyen med de samme fanene øverst og Innstillinger nederst
**Og** fra 1024 px (`lg`) er det plass til detaljpanelet på 340 px til høyre (AD-15)
**Og** siden har ikke vannrett rulling ned til 320 px (NFR-10)

**Gitt** rutene i AD-15
**Når** storyen er ferdig
**Så** finnes `/`, `/arkiv` og `/innstillinger`, og fanene peker dit
**Og** Kalender-fanen og ruta `/kalender` finnes ikke før story 5.6 er bygget, slik at appen er ryddig om skive 3 kuttes
**Og** sider som ennå ikke er bygget, viser en nøytral tekst og ingen døde knapper
**Og** valget av komponentbibliotek (egne komponenter eller shadcn/ui) er tatt og skrevet i storyens notater (Deferred i arkitekturen)

**Gitt** tilgjengelighetskravene
**Når** Playwright kjører axe-sjekk på `/`
**Så** er det ingen brudd på WCAG 2.1 AA (NFR-9)
**Og** alle faner har tilgjengelige navn, aktiv fane har `aria-current`, fokusringen er 2 px i `accent-ink`, og trykkflater er minst 44 × 44 px på mobil (UX-DR26)

**Gitt** tonen i EXPERIENCE.md
**Når** storyen er ferdig
**Så** er det skrevet ned i storyens notater, som regel for alle senere stories, at tekster bruker du-form og heiing bare i positive øyeblikk, at personvern, sletting og feil skrives saklig uten emoji, og at faner ikke har badge-tellere (UX-DR27)
**Og** all tekst i appen er på norsk, og appen har ingen analyseverktøy eller tredjepartsskript (NFR-8, NFR-3)

### Story 1.5: Se oppgavene i de smarte listene

*Spor A · Avhenger av 1.3, 1.4*

Som student,
vil jeg se oppgavene mine gruppert i Forfalt, I dag, Denne uken, Senere og Ingen frist,
slik at jeg ser hva som haster uten å sortere selv.

**Akseptansekriterier:**

**Gitt** `kjerne/smarte-lister.ts` med «nå» som parameter
**Når** den får aktive oppgaver
**Så** havner hver oppgave i nøyaktig én liste etter fristen: Forfalt (før i dag), I dag, Denne uken (i morgen til og med søndag), Senere og Ingen frist (FR-20, FR-21)
**Og** uka går mandag–søndag, og søndag er «Denne uken» tom (FR-22)
**Og** fullførte oppgaver er ikke med
**Og** rekkefølgen er nærmeste frist, så prioritet (Høy først), så opprettet (eldste først), og i «Ingen frist» prioritet og så opprettet (FR-24)

**Gitt** KI-testsettet med referansedato 2026-11-02
**Når** Vitest kjører alle 20 oppgavene gjennom `smarte-lister.ts`
**Så** stemmer tidsrommet for 20 av 20 (suksesskriteriet for smarte lister)

**Gitt** Oppgaver-siden
**Når** studenten har oppgaver
**Så** vises gruppene med overskrift og antall, for eksempel «I DAG · 3», og FORFALT øverst i varselfarge med stripe på kortene (UX-DR6, UX-DR7)
**Og** oppgavekortet viser ring, tittel og merkelappene prosjekt, frist og prioritet, med Høy i varselfarge og tekst
**Og** tomme grupper skjules, unntatt «I dag», som da viser «Alt unna i dag 🎉 Nyt kvelden!»
**Og** «Ingen frist (n)» kan felles sammen

**Gitt** at appen ikke har noen oppgaver
**Når** Oppgaver åpnes
**Så** vises «Hei 👋 Skriv inn det første du må huske.» med pil mot «+ Ny oppgave»

**Gitt** at klokka passerer midnatt
**Når** `nå` oppdateres
**Så** flytter oppgavene seg til riktig liste uten omlasting (testes med `page.clock`)

### Story 1.6: Opprette en oppgave

*Spor A · Avhenger av 1.5*

Som student,
vil jeg skrive en oppgave med egne ord og lagre den med én gang,
slik at jeg får den ned før jeg glemmer den.

**Akseptansekriterier:**

**Gitt** Oppgaver på mobil eller nettbrett
**Når** studenten trykker den flytende knappen «+ Ny oppgave»
**Så** åpnes skjemaet som egen side på `?ny=oppgave` med tilbakepil (AD-15, UX-DR9)
**Og** på PC åpnes skjemaet i panelet fra skrivefeltet «+ Ny oppgave … skriv med egne ord» (Enter), med teksten ferdig utfylt, og «N» fokuserer skrivefeltet

**Gitt** skjemaet
**Når** det vises
**Så** har det feltene tekst, frist, prosjekt, etikett (Privat/Skole/Jobb), prioritet (Lav/Middels/Høy, standard Middels) og notater, og hjelpeteksten «Bare oppgaveteksten er påkrevd. Resten kan stå tomt.» (FR-1, FR-4)
**Og** prioritetsvelgeren kan styres med piltaster og har `aria-pressed` og kant i `accent-ink` på valgt (UX-DR10)

**Gitt** at teksten er tom
**Når** studenten trykker Lagre
**Så** vises «Skriv inn hva du skal gjøre» ved feltet, og annet innhold beholdes

**Gitt** at teksten er fylt ut
**Når** studenten trykker Lagre
**Så** lagrer kommandoen `opprettOppgave` oppgaven straks med `crypto.randomUUID()` og `createdAt`, og den vises i riktig smart liste (FR-2, FR-5)
**Og** tomme felt forblir tomme, også etikett og sammendrag (FR-3)
**Og** en oppgave uten frist havner i «Ingen frist»

**Gitt** at studenten har endret noe i skjemaet
**Når** hun trykker tilbakepil eller Esc
**Så** spør appen «Forkaste endringene?», og bare da

### Story 1.7: Se og redigere en oppgave

*Spor A · Avhenger av 1.6*

Som student,
vil jeg åpne en oppgave, se alle feltene og endre dem,
slik at oppgaven alltid stemmer med virkeligheten.

**Akseptansekriterier:**

**Gitt** et oppgavekort
**Når** studenten trykker på kortet
**Så** åpnes oppgavedetaljen på `?oppgave=<id>`: egen side med tilbakepil under 1024 px, og detaljpanel til høyre fra 1024 px (AD-15, UX-DR13)
**Og** detaljen viser tittel, frist, prosjekt, etikett, prioritet, sammendrag og notater, og *Endre* øverst

**Gitt** oppgavedetaljen
**Når** studenten trykker *Endre*
**Så** åpnes skjemaet med alle feltene utfylt og uten velgeren Oppgave/Hendelse
**Og** hun kan endre alle feltene og fjerne fristen helt (FR-6)

**Gitt** at studenten endrer fristen og lagrer
**Når** oppgaven vises
**Så** har den flyttet seg straks til riktig smart liste (FR-23)

**Gitt** en ukjent eller slettet id i `?oppgave=`
**Når** siden åpnes
**Så** vises lista uten detalj og uten feilmelding

**Gitt** tastatur på PC
**Når** studenten bruker Tab, Enter og Esc
**Så** går Tab i leserekkefølge, Enter åpner, og Esc lukker panelet (UX-DR26)

### Story 1.8: Fornavn og lys eller mørk modus

*Spor B · Avhenger av 1.3, 1.4*

Som student,
vil jeg legge inn fornavnet mitt og velge lys eller mørk modus,
slik at appen føles som min.

**Akseptansekriterier:**

**Gitt** Innstillinger → Profil
**Når** studenten skriver fornavnet sitt og lagrer
**Så** viser Oppgaver hilsenen «Hei, Ida 👋» (FR-59)
**Og** fornavnet lagres bare i `profil` i nettleseren og sendes aldri til serveren
**Og** uten fornavn er hilsenen «Hei 👋»

**Gitt** Innstillinger → Utseende
**Når** studenten velger Lys, Mørk eller Følg systemet
**Så** endres modusen med én gang og huskes ved neste oppstart (FR-60)
**Og** Følg systemet er standard

**Gitt** Innstillinger-siden
**Når** den åpnes
**Så** viser den Profil, Utseende og Om appen (versjon og gruppe), og valgt modus har `aria-pressed` og kant eller hake (UX-DR22)
**Og** axe-sjekken på `/innstillinger` gir ingen brudd

## Epic 2: Fullfør, rydd og finn fram

Studenten huker av og angrer, ser Arkiv med 7-dagersregelen, sletter, filtrerer, sorterer og søker, og velger tema og prosjekter. Reserveløsningens nøkkelord bygges og måles mot KI-testsettet (Å-7). Visningen av reserveforslagene kommer i Epic 4.

### Story 2.1: Regelbaserte forslag fra nøkkelord

*Spor D · Avhenger av 1.2*

Som student uten KI,
vil jeg at appen kan foreslå etikett og prioritet ut fra ordene i oppgaven,
slik at jeg får hjelp selv når Claude ikke svarer.

**Akseptansekriterier:**

**Gitt** `kjerne/reserve.ts`
**Når** den får en oppgavetekst
**Så** foreslår den etikett (Privat, Skole eller Jobb) og prioritet (Lav, Middels eller Høy) ut fra nøkkelord, og aldri sammendrag, økter eller frist (FR-16, FR-17)
**Og** nøkkelordlista er bestemt, skrevet i storyens notater og ligger bare i `kjerne/reserve.ts` (Å-7)
**Og** gir ingen nøkkelord treff, foreslås ingen etikett, og prioriteten står som Middels

**Gitt** tabellen kalltype × årsak i AD-8
**Når** `reserve` kalles med en kalltype og en `årsak`
**Så** gir feltforslag bare etikett og prioritet for felt kallet ba om eller som står i `forkastet`
**Og** kall som bare gjelder økter, og `nyTid`, gir ingen forslag
**Og** Vitest dekker alle kombinasjonene

**Gitt** KI-testsettet
**Når** Vitest kjører de 20 tekstene gjennom reserveløsningen
**Så** skrives antall riktige etiketter og prioriteringer i `tests/ki-testsett/README.md` som referanse for KI-målingen i story 4.8. Det finnes ikke noe minstekrav for reserveløsningen

### Story 2.2: Huke av en oppgave og angre

*Spor A · Avhenger av 1.7*

Som student,
vil jeg huke av en oppgave med ett trykk og kunne angre med én gang,
slik at avhuking føles trygt.

**Akseptansekriterier:**

**Gitt** et oppgavekort
**Når** studenten trykker på ringen
**Så** setter kommandoen `fullfør` `oppgave.fullført` til et ISO-tidsstempel, og oppgaven forsvinner fra de smarte listene (FR-7)
**Og** ringen fylles og haken spretter (ca. 300 ms) før kortet glir ut, og ved `prefers-reduced-motion` skjer det uten animasjon (UX-DR8)
**Og** *Fullfør* i oppgavedetaljen gjør det samme

**Gitt** at en oppgave er huket av
**Når** snackbaren «Flyttet til Arkiv · Angre» vises i ca. 5 sekunder
**Så** legger *Angre* oppgaven tilbake der den var (FR-32)
**Og** «Flyttet til Arkiv» annonseres til skjermleser, og *Angre* kan nås med tastatur
**Og** en ny snackbar erstatter den forrige

**Gitt** ringen
**Når** den måles
**Så** er den 20 px med 44 px trykkflate og har navnet «Huk av: <oppgavetekst>»

### Story 2.3: Arkiv med nedtelling

*Spor A · Avhenger av 2.2*

Som student,
vil jeg se fullførte oppgaver i Arkiv en stund og kunne hente dem tilbake,
slik at ingenting går tapt ved et feiltrykk.

**Akseptansekriterier:**

**Gitt** `/arkiv`
**Når** studenten åpner fanen
**Så** vises teksten om at fullførte oppgaver ligger her i 7 dager, og arkivrader med strek over tittelen (FR-29, UX-DR16)
**Og** hver rad viser «Slettes om N dager», regnet av kjernen, og den siste dagen «Slettes i morgen» i varselfarge (FR-31)
**Og** tomt arkiv viser «Ingen fullførte oppgaver ennå – hold på! 💪»

**Gitt** «…»-menyen på en arkivrad
**Når** studenten velger *Gjenopprett*
**Så** blir oppgaven aktiv igjen og havner i den smarte lista som passer fristen (FR-32)

**Gitt** kommandoen `vedlikehold(nå)` ved oppstart og hver time
**Når** det har gått 7 × 24 timer siden siste `fullført`
**Så** sletter `ryddArkiv` oppgaven (FR-30, AD-5)
**Og** gjenåpnes og fullføres en oppgave på nytt, regnes tiden fra siste fullføring
**Og** Vitest tester grensen med fast «nå», og Playwright tester Flyt 5 med `page.clock`

### Story 2.4: Slette en oppgave

*Spor A · Avhenger av 2.3*

Som student,
vil jeg slette en oppgave jeg ikke trenger,
slik at lista bare har det som betyr noe.

**Akseptansekriterier:**

**Gitt** *Slett* i oppgavedetaljen eller *Slett nå* i Arkiv
**Når** studenten trykker
**Så** vises dialogen «Er du sikker? Oppgaven kan ikke gjenopprettes.» (FR-33, FR-34)
**Og** har oppgaven økter, står det «Oppgaven og n økter slettes. Det kan ikke angres.», og kommandoen `slettOppgave` sletter øktene samtidig (AD-4)

**Gitt** dialogkomponenten
**Når** den åpnes
**Så** har den fokusfelle, *Avbryt* har standardfokus, Esc betyr *Avbryt*, og fokus går tilbake til knappen som åpnet den (UX-DR17)
**Og** *Slett* bruker `button-danger`

### Story 2.5: Filtrere og sortere

*Spor D · Avhenger av 1.5*

Som student,
vil jeg filtrere på etikett, prioritet, frist og prosjekt og velge sortering,
slik at jeg ser det viktigste først.

**Akseptansekriterier:**

**Gitt** filterknappene Alle / Skole / Jobb / Privat
**Når** studenten velger én
**Så** vises bare oppgaver med den etiketten, og valgt knapp har pastellfyll, kant, hake og `aria-pressed` (FR-26, UX-DR11)

**Gitt** «☰ Filter»
**Når** studenten velger prioritet, frist (Forfalt / I dag / Denne uken / Senere / Ingen frist) eller prosjekt
**Så** filtreres lista, og aktive filtre vises som knapper med «×» som fjerner dem
**Og** arket kommer nedenfra på mobil og som nedtrekk på PC
**Og** filteret ligger i `visning` i butikken og lagres ikke (AD-17)

**Gitt** at ingen oppgaver passer filteret
**Når** lista vises
**Så** står «Ingen oppgaver med dette filteret.» med knappen *Fjern filter*

**Gitt** «⇅ Frist»
**Når** studenten velger Prioritet eller Nyeste
**Så** sorteres lista etter det, og neste gang lista vises, er sorteringen Frist igjen (FR-25, AD-17)

### Story 2.6: Søke i aktive og fullførte oppgaver

*Spor D · Avhenger av 2.3*

Som student,
vil jeg søke etter en oppgave og se om den er gjort,
slik at jeg slipper å bla i lister og Arkiv.

**Akseptansekriterier:**

**Gitt** lupen øverst (mobil) eller søkefeltet ved filterknappene (PC)
**Når** studenten skriver et ord
**Så** søkes det i tekst, notater, prosjekt og sammendrag i både aktive og fullførte oppgaver (FR-27, FR-28)
**Og** hvert treff vises som oppgavekort med *Aktiv* eller *Fullført* og fristen
**Og** på mobil fyller feltet toppen med *Avbryt*, og Esc eller *Avbryt* lukker søket (UX-DR12)

**Gitt** at søket ikke gir treff
**Når** resultatet vises
**Så** står «Fant ingenting på "<ord>". Sjekk stavingen eller prøv et annet ord.»
**Og** Playwright tester Flyt 6

### Story 2.7 (Bør): Prosjekter i Innstillinger

*Spor B · Avhenger av 1.8*

Som student,
vil jeg se og slette prosjektnavnene jeg har brukt,
slik at gamle navn ikke ligger og roter.

**Akseptansekriterier:**

**Gitt** Innstillinger → Prosjekter
**Når** siden åpnes
**Så** vises alle prosjektnavn som er brukt på oppgaver, regnet ut av kjernen og ikke lagret (FR-61, AD-1, AD-4)
**Og** uten prosjekter står «Prosjekter dukker opp her når du skriver dem på en oppgave.»

**Gitt** søppelbøtta på et prosjekt
**Når** studenten bekrefter «Er du sikker?»
**Så** setter `slettProsjekt(navn)` feltet til tomt på alle oppgaver med navnet
**Og** Skole, Jobb og Privat vises ikke og kan ikke slettes

### Story 2.8 (Bør): Seks fargetemaer

*Spor B · Avhenger av 1.8*

Som student,
vil jeg velge min egen pastellfarge,
slik at appen føles personlig.

**Akseptansekriterier:**

**Gitt** Innstillinger → Utseende
**Når** studenten velger en av de seks fargeprøvene
**Så** byttes aksentfargene med én gang, og valget huskes og settes før første tegning (FR-63, AD-16)
**Og** den valgte prøven har ring i `accent-ink` og hake
**Og** axe-sjekken gir ingen brudd i noen av temaene i lys og mørk modus

## Epic 3: Samtykke og kontroll over egne data

Studenten får KI-valg med demo-advarsel og samtykketekst, Personvern og data, 🔒-bryter, påminnelser, «Slett alle data» og personvernerklæringen. Ingen KI-kall ennå. Fra denne epicen sender appen til `/oppstart` når samtykket mangler (AD-15).

### Story 3.1: Samtykke og fastsatte tekster i kjernen

*Spor C · Avhenger av 1.2*

Som student,
vil jeg at appen har ett sted som avgjør om KI er på, og at tekstene er nøyaktig de som er fastsatt,
slik at personvernet virker likt overalt.

**Akseptansekriterier:**

**Gitt** `kjerne/samtykke.ts`
**Når** storyen er ferdig
**Så** finnes `GJELDENDE_SAMTYKKEVERSJON`, `kiErPå(dokument)` (sann bare ved svar «ja» og gjeldende versjon) og `kanSendes(oppgave, dokument)` (sjekker også 🔒) (AD-12)
**Og** Vitest dekker ja, nei, `null` og gammel tekstversjon

**Gitt** `kjerne/tekster.ts`
**Når** storyen er ferdig
**Så** inneholder den ordrett demo-advarselen, samtykketeksten, KI-påminnelsene, «Hva sendes til KI», Lagring, eksportadvarselen og dialogene for import og «Slett alle data» fra EXPERIENCE.md (UX-DR20, UX-DR21)
**Og** en test sammenligner tekstene med EXPERIENCE.md, slik at avvik oppdages

### Story 3.2: Personvernerklæring ett klikk unna

*Spor B · Avhenger av 1.4, 3.1*

Som student,
vil jeg kunne lese personvernerklæringen fra hvor som helst i appen,
slik at jeg vet hva som skjer med dataene mine.

**Akseptansekriterier:**

**Gitt** `/personvernerklaering`
**Når** den åpnes
**Så** er erklæringen på norsk og sier: at appen er en demo bare for test- eller fiktive data og at gruppen ikke lagrer data; at Anthropic behandler det som sendes i USA, normalt sletter det innen 30 dager og kan lagre flaggede samtaler i inntil 2 år; hvilke data som sendes; at formålet også er planlegging av økter; at det ikke tas automatiske avgjørelser; at reserveløsningen ikke sender noe; at aldersgrensen er 13 år; at fornavn, tema og samtykke bare lagres i nettleseren; og at det som er sendt, ikke kan slettes fra appen (FR-41, NFR-11)
**Og** den nevner ikke behandlingsansvarlig eller SCC

**Gitt** alle skjermbilder
**Når** de vises
**Så** står lenken «Personvernerklæring» nederst på hver side på mobil og nederst i sidemenyen under «Personvern og data» på PC (UX-DR5)

### Story 3.3: Førstegangsoppsett med fornavn og KI-valg

*Spor B · Avhenger av 3.2*

Som ny student,
vil jeg bli spurt om navn og om jeg vil bruke KI, med en ærlig forklaring,
slik at jeg vet hva jeg sier ja eller nei til.

**Akseptansekriterier:**

**Gitt** at `samtykke` er `null`
**Når** appen åpnes på en hvilken som helst rute
**Så** sender rotlayouten til `/oppstart` (AD-15), unntatt personvernerklæringen

**Gitt** side 1 av `/oppstart`
**Når** den vises
**Så** står «Hei! Hva heter du?» med fornavnfelt, hjelpeteksten «Bare for hilsenen. Lagres på denne enheten.», *Fortsett* og *Hopp over* (FR-59, UX-DR19)

**Gitt** side 2
**Når** den vises
**Så** står demo-advarselen øverst som nøytral infoboks, og samtykketeksten ordrett under (FR-35, FR-65)
**Og** *Nei, uten KI* og *Ja, bruk KI* er like store, står side om side, og ingen er forhåndsvalgt
**Og** «Les hele personvernerklæringen» åpner erklæringen uten at oppsettet mistes

**Gitt** at studenten svarer
**Når** hun trykker *Ja* eller *Nei*
**Så** lagres `samtykke` med svar, tidspunkt og tekstversjon, og hun havner på Oppgaver
**Og** tomtilstanden er «Hei, Ida 👋 Skriv inn det første du må huske – KI hjelper deg å sortere.» ved ja og uten siste del ved nei

**Gitt** at `GJELDENDE_SAMTYKKEVERSJON` økes
**Når** appen åpnes
**Så** er KI av til studenten har svart på den nye teksten
**Og** Playwright tester Flyt 3 med axe-sjekk

### Story 3.4: Personvern og data

*Spor B · Avhenger av 3.3*

Som student,
vil jeg se og endre hva som sendes til KI på ett sted,
slik at jeg har kontroll hele tiden.

**Akseptansekriterier:**

**Gitt** `/personvern`, nådd fra Innstillinger og fra sidemenyen på PC
**Når** siden åpnes
**Så** står innholdet i rekkefølgen Demo-advarsel → KI-forslag → Send aldri notater til KI → Send hendelsestitler til KI → Hva sendes til KI → Lagring → Eksporter / Importer → Slett alle data → Personvernerklæring, i to kolonner på PC uten detaljpanel (UX-DR20)
**Og** demo-advarselen vises også når KI er av (FR-65)

**Gitt** bryteren KI-forslag
**Når** den vises
**Så** har den samtykkestatus som undertekst, for eksempel «Godkjent 9.11.2026 (tekst v2)» (FR-36)
**Og** slår studenten den på etter et «Nei», vises samtykketeksten først
**Og** slår hun den av, lagres «nei», og `kiErPå` blir usann (FR-19)

**Gitt** bryterne «Send aldri notater til KI» (standard av) og «Send hendelsestitler til KI» (standard på, med hjelpeteksten «Av: KI ser bare når du er opptatt, ikke hva du skal.»)
**Når** studenten endrer dem
**Så** lagres valget i `innstillinger` (FR-39, FR-58)
**Og** Eksporter og Importer vises bare når story 3.7 er bygget
**Og** bryteren «Send hendelsestitler til KI» vises først når story 5.3 er bygget, fordi den ikke styrer noe uten hendelser. De fastsatte tekstene om hendelser og økter står likevel ordrett

### Story 3.5: 🔒 på oppgaver og KI-påminnelser

*Spor B · Avhenger av 3.4, 1.7*

Som student,
vil jeg kunne holde en oppgave helt utenfor KI og se hva som sendes når jeg skriver,
slik at jeg aldri sender noe uten å vite det.

**Akseptansekriterier:**

**Gitt** oppgaveskjemaet
**Når** studenten slår på «🔒 Ikke send til KI»
**Så** lagres det på oppgaven, og `kanSendes` blir usann for den (FR-38)
**Og** låsikonet vises på kortet og i detaljen med skjermlesertekst «Skjult for KI» (UX-DR21)

**Gitt** at KI er på
**Når** skjemaet og skrivefeltet på PC vises
**Så** står påminnelsen «Teksten og notatene sendes til KI (Claude) for å lage forslag.» under teksten, uten «og notatene» når FR-39 er på, og «Sendes ikke til KI.» når 🔒 er på (FR-37)
**Og** under skrivefeltet bruker teksten `text-on-glow` (UX-DR3)

**Gitt** at KI er av
**Når** skjemaet vises
**Så** vises ingen påminnelse

### Story 3.6: Slett alle data

*Spor B · Avhenger av 3.4*

Som student,
vil jeg kunne slette alt appen har lagret om meg,
slik at ingenting blir liggende igjen på en maskin jeg slutter å bruke.

**Akseptansekriterier:**

**Gitt** «Slett alle data» i Personvern og data
**Når** studenten trykker
**Så** vises dialogen «Slette alle data?» med den fastsatte teksten, *Avbryt* med standardfokus og *Slett alt* i varselfarge
**Og** etter *Slett alt* er oppgaver, hendelser, økter, fornavn, prosjekter, innstillinger, tema og samtykke slettet fra nettleseren, og appen starter på `/oppstart` (FR-40)
**Og** samme handling virker fra feilsiden i story 1.3

### Story 3.7 (Bør): Eksportere og importere data

*Spor B · Avhenger av 3.6*

Som student,
vil jeg flytte dataene mine til en annen PC med en fil,
slik at jeg kan bytte maskin uten å begynne på nytt.

**Akseptansekriterier:**

**Gitt** *Eksporter*
**Når** studenten trykker
**Så** vises advarselen «Fila inneholder alt du har skrevet, også navnet ditt og hendelsene. Lagre den et trygt sted.» før fila lagres, og fila inneholder hele dokumentet (FR-43)

**Gitt** *Importer* og en fil
**Når** studenten bekrefter «Importere data? Importen erstatter alle data i appen. Fortsette?»
**Så** valideres og migreres hele fila før noe endres (AD-3)
**Og** ved suksess erstattes alle data, `samtykke` settes til `null`, `ventendeKall` til `null`, ingen KI-kall startes, og «Importen er fullført.» vises
**Og** ved feil står «Fila kunne ikke leses. Ingen data er endret.»
**Og** Playwright tester Flyt 7 med eksport, import og «Slett alle data»

## Epic 4: KI-forslag til etikett, prioritet og sammendrag

Studenten får KI-forslag per felt etter lagring og godtar eller endrer dem. Uten KI får hun regelbaserte forslag. Epicen bygger hele KI-veien fra kontrakt til KI-boks, måler mot KI-testsettet og avsluttes med brukertest.

### Story 4.1: KI-kontrakt og utdrag

*Spor C · Avhenger av 3.1*

Som student,
vil jeg at KI bare får akkurat det den trenger,
slik at ingenting sendes uten grunn.

**Akseptansekriterier:**

**Gitt** `kjerne/ki-kontrakt.ts`
**Når** storyen er ferdig
**Så** har den zod-skjema for forespørselen (`forslag` med `ønsker` og `utdrag`, `nyTid` med `øktId` og `utdrag`) og svaret (`ok` med `felt`, `økter`, `forkastet`, eller `reserve` med `årsak`) som i AD-6

**Gitt** én ren funksjon i `kjerne/` for utdraget
**Når** den får oppgaven, hendelsene, øktene, innstillingene og «nå»
**Så** tar den med oppgavetekst, frist og notater (ikke når FR-39 er på), aldri fornavnet, og ingenting når oppgaven har 🔒 (FR-15, AD-9)
**Og** hendelser og andre økter tas bare med når forespørselen ønsker økter eller er `nyTid`, for 14 dager fra i dag og aldri etter fristdagen, med tittel bare når FR-58 er på og hendelsen ikke har 🔒
**Og** Vitest dekker hver regel

### Story 4.2: Serverrute med mock-KI

*Spor C · Avhenger av 4.1*

Som utvikler,
vil jeg at `/api/ki` virker med faste mock-svar,
slik at hele KI-veien kan testes uten nøkkel og uten kostnad.

**Akseptansekriterier:**

**Gitt** `app/api/ki/route.ts`
**Når** den får en forespørsel
**Så** valideres den mot kontrakten, og ugyldige forespørsler avvises (AD-6)
**Og** forespørsler der `Host` ikke er `127.0.0.1` eller `localhost`, avvises (AD-11)
**Og** serveren logger aldri innholdet i forespørsler eller svar (NFR-3)

**Gitt** `KI_MOCK=1` og headeren `x-ki-mock`
**Når** ruta kalles
**Så** velger `server/mock.ts` et fast svar fra `tests/ki-testsett/mock/`: `gyldig`, `ugyldig`, `tomt`, `tidsavbrudd` eller `treg-10s`, og `gyldig` uten header (AD-14, NFR-6)
**Og** uten `KI_MOCK` ignoreres headeren
**Og** svaret kontrolleres av kjernen før det returneres: ugyldige felt står i `forkastet` (FR-14), og tomt svar eller tidsavbrudd gir `reserve` med riktig `årsak`

### Story 4.3: Claude-kallet

*Spor C · Avhenger av 4.2*

Som student,
vil jeg at forslagene kommer fra Claude når nøkkelen finnes,
slik at de blir gode.

**Akseptansekriterier:**

**Gitt** `server/claude.ts` med `import 'server-only'`
**Når** ruta kaller Claude
**Så** brukes `claude-sonnet-5-5` med `client.messages.parse`, `zodOutputFormat` og skjemaet fra kontrakten, `output_config: { effort: "low" }`, `maxRetries: 0` og ingen fallback-modell (AD-7)
**Og** systemprompten er på norsk og ligger fast i `server/`
**Og** kallet har en total frist på 13 000 ms og avbrytes når forespørselen lukkes (`request.signal`)

**Gitt** feiltilfellene
**Når** nøkkelen mangler, Claude nekter, eller API-et feiler
**Så** returneres `reserve` med `ingen-nokkel`, `avvist` eller `api-feil`

**Gitt** en ekte nøkkel
**Når** utvikleren kjører ett ekte kall
**Så** er det bekreftet at `effort` virker med modellen, og resultatet står i storyens notater

### Story 4.4: KI-klient med tidsfrist og kallgrense

*Spor C · Avhenger av 4.2*

Som student,
vil jeg at appen aldri venter for lenge på KI og ikke sender for mange kall,
slik at den alltid svarer og kostnaden holdes lav.

**Akseptansekriterier:**

**Gitt** `lib/ki/`
**Når** den kaller `/api/ki`
**Så** er den eneste kode som gjør det, avbryter etter 15 sekunder med `AbortSignal.timeout(15000)` og returnerer `reserve` med `tidsavbrudd` (NFR-12, AD-8)
**Og** den endrer aldri tilstand og importerer ikke butikken

**Gitt** `lib/ki/kallgrense.ts`
**Når** det er sendt 10 kall i løpet av 60 sekunder
**Så** gir neste kall `reserve` med `kallgrense` uten nettverkskall
**Og** grensen ligger i minnet, gjelder per fane og teller også `nyTid`
**Og** Vitest tester vinduet med falsk tid

### Story 4.5: Når KI spørres

*Spor C · Avhenger av 4.4, 1.7*

Som student,
vil jeg at appen henter forslag akkurat når det gir mening, og aldri bruker et gammelt svar,
slik at forslagene passer oppgaven slik den er nå.

**Akseptansekriterier:**

**Gitt** `kjerne/ki-trigger.ts`
**Når** en oppgave lagres
**Så** avgjør én tabell `ønsker.felt` for kallet: ny oppgave eller endret tekst gir feltforslag (FR-8, FR-13), og bare endret frist gir ikke feltforslag (FR-62, første rad)
**Og** det startes ingen kall når `kiErPå` eller `kanSendes` er usann (FR-19, FR-38)
**Og** det startes aldri kall ved oppstart, import eller visning, og én lagring gir høyst ett kall (AD-13, NFR-12)
**Og** tabellen har plass til `ønsker.økter`, som fylles i Epic 6

**Gitt** et kall som er startet
**Når** kommandoen lagrer `oppgave.ventendeKall` med ny id og svaret kommer
**Så** forkaster `mottaKiSvar` svaret uten melding hvis oppgaven er borte, id ikke stemmer eller `kanSendes` er usann
**Og** `ventendeKall` settes til `null` ved oppstart
**Og** Vitest dekker hver rad i tabellen og hvert forkastingstilfelle

### Story 4.6: Godta og endre KI-forslag

*Spor C · Avhenger av 4.5*

Som student,
vil jeg se KI-forslagene på oppgaven og godta eller endre dem med ett trykk,
slik at jeg slipper å sortere selv, men bestemmer alltid.

**Akseptansekriterier:**

**Gitt** at en oppgave er lagret og KI er på
**Når** forslagene hentes
**Så** viser detaljen skeleton «✦ Lager forslag …», og oppgaven er allerede i lista (FR-2)
**Og** med mock `treg-10s` vises oppgaven i lista innen 1 sekund etter «Lagre» (NFR-5)

**Gitt** at forslagene kommer
**Når** KI-boksen vises
**Så** har den «✦ KI-forslag», én rad per felt med *Godta* og *Endre*, *Godta alle* og «Frist: ingen foreslått – legg til selv» (FR-9, FR-11, UX-DR14)
**Og** «3 KI-forslag klare» annonseres med `aria-live="polite"`
**Og** all tekst i boksen bruker `text-primary` eller `accent-ink`

**Gitt** en forslagsrad
**Når** studenten trykker *Godta* eller *Endre*
**Så** settes verdien, eller feltet åpnes for en annen verdi, og forslaget fjernes, og `forslag` blir `null` når alt er besvart (FR-10, AD-12)
**Og** en godtatt verdi har ikke merket «KI-forslag»

**Gitt** ubesvarte forslag
**Når** studenten lukker og åpner appen igjen
**Så** vises de fortsatt, oppgaven har standardverdiene, og kortet har ✦-prikken (FR-12)

**Gitt** at studenten endrer teksten
**Når** nye forslag kommer
**Så** viser hver rad forslaget og nåværende verdi, for eksempel «Prioritet: Høy (nå: Middels)», og den gamle verdien gjelder til hun godtar (FR-13)

### Story 4.7: Regelbaserte forslag når KI ikke svarer

*Spor C · Avhenger av 4.6, 2.1*

Som student,
vil jeg få forslag fra nøkkelord når KI ikke er tilgjengelig,
slik at appen hjelper meg uansett.

**Akseptansekriterier:**

**Gitt** at KI er på
**Når** svaret er `reserve` (ingen nøkkel, tidsavbrudd, tomt, ugyldig, avvist, API-feil eller kallgrense)
**Så** viser KI-boksen etikett og prioritet fra `kjerne/reserve.ts`, med linjen «Forslag basert på nøkkelord – KI var ikke tilgjengelig» ordrett og merket «regelbasert» på hver rad (FR-16, FR-18, UX-DR15)
**Og** det vises ikke sammendrag (FR-17)
**Og** ugyldige enkeltfelt i et ellers gyldig svar får reserveforslag hver for seg (FR-14)

**Gitt** at studenten har sagt nei til KI
**Når** hun lagrer en oppgave
**Så** vises ingen KI-boks og ingen forslag (FR-19)

**Gitt** Playwright med headerne `ugyldig`, `tomt` og `tidsavbrudd`
**Når** testene kjøres
**Så** gir alle tre reserveforslag (NFR-6)
**Og** uten nøkkel virker alle funksjoner unntatt KI-forslag (suksesskriteriet for reserveløsningen)

### Story 4.8: Måle KI-forslagene mot testsettet

*Spor C, med Spor D · Avhenger av 4.3*

Som gruppe,
vil vi måle hvor gode forslagene er og justere prompten,
slik at vi når suksesskriteriene.

**Akseptansekriterier:**

**Gitt** et skript som kjører de 20 tekstene i KI-testsettet gjennom `/api/ki` med ekte nøkkel
**Når** det kjøres
**Så** skriver det antall riktige etiketter og prioriteringer og sammendragene, som må være på norsk (NFR-8), til en resultatfil med dato og promptversjon
**Og** målet er minst 16 av 20 etiketter og minst 14 av 20 prioriteringer

**Gitt** at målet ikke nås
**Når** prompten justeres
**Så** kjøres skriptet på nytt, og hver kjøring noteres i `tests/ki-testsett/README.md`
**Og** prompten sender ikke mer data enn FR-15 tillater (motmålet)

### Story 4.9: Brukertest av oppgaver, KI-forslag og samtykke

*Alle spor · Avhenger av 4.7, 3.3*

Som gruppe,
vil vi teste appen med fem studenter,
slik at vi vet at den er lett å bruke og at samtykket blir forstått.

**Akseptansekriterier:**

**Gitt** et testmanus og fem testbrukere med fiktive data
**Når** hver bruker oppretter en oppgave og endrer et KI-forslag
**Så** noteres om hun klarte det uten hjelp fra gruppen i 5 minutter. Målet er minst 4 av 5

**Gitt** samtykkedialogen
**Når** brukeren har svart
**Så** svarer hun på «Hva sendes til KI?» og «Kan det som er sendt, slettes fra appen?». Målet er minst 4 av 5 riktige på begge (motmålet)
**Og** resultatene og funnene skrives i `docs/`, og funn som må rettes, blir egne oppgaver

### Story 4.10 (Bør): Bytte ut telefonnumre og e-post før sending

*Spor C · Avhenger av 4.1*

Som student,
vil jeg at telefonnumre og e-postadresser byttes ut før teksten sendes til KI,
slik at mindre persondata sendes ved et uhell.

**Akseptansekriterier:**

**Gitt** utdraget fra story 4.1
**Når** oppgavetekst, notater eller hendelsestitler inneholder telefonnumre eller e-postadresser
**Så** byttes de med plassholdere før sending (FR-42)
**Og** Vitest dekker norske telefonnumre med og uten mellomrom og +47, og vanlige e-postadresser

**Gitt** teksten «Hva sendes til KI»
**Når** maskeringen er bygget
**Så** byttes bare delen om telefonnummer ut med «Appen prøver å bytte ut telefonnumre og e-post med plassholdere før sending, men kan ikke garantere at alt blir fanget.»
**Og** advarselen om å ikke skrive navn eller helseopplysninger blir stående, fordi de ikke maskeres (V-4)

## Epic 5: Hendelser og Kalender

Studenten legger inn hendelser og ser oppgaver og hendelser i Kalender. Første story utvider KI-testsettet med planleggingscaser og kan gjøres når som helst, men må være ferdig før skive 3 testes. Skive 3 kuttes først.

### Story 5.1: Planleggingscaser i KI-testsettet

*Spor D · Avhenger av ingenting. Bør gjøres tidlig*

Som gruppe,
vil vi ha faste planleggingscaser med frist og hendelser,
slik at øktforslagene kan sjekkes med regler før skive 3 testes.

**Akseptansekriterier:**

**Gitt** `tests/ki-testsett/`
**Når** storyen er ferdig
**Så** finnes minst 5 planleggingscaser, hver med fast «nå», oppgavetekst, frist og hendelser med dato og klokkeslett (suksesskriteriet for øktforslag)
**Og** minst én case har en nattevakt som slutter neste dag
**Og** minst én case har en hendelse med 🔒 og én kjøres med hendelsestitler av
**Og** README beskriver formatet og at forventet resultat er «minst én økt, og alle økter holder FR-49»

**Gitt** mock-svarene i `tests/ki-testsett/mock/`
**Når** storyen er ferdig
**Så** finnes et gyldig mock-svar med økter og et med én økt som bryter FR-49, til bruk i Epic 6
**Og** gruppa har gått gjennom de forventede svarene sammen (åpent punkt i `issues.md`)

### Story 5.2: Hendelsesregler i kjernen

*Spor D · Avhenger av 1.2*

Som student,
vil jeg at hendelser over midnatt og dagens hendelser blir riktig,
slik at en nattevakt ikke blir feil.

**Akseptansekriterier:**

**Gitt** `kjerne/hendelser.ts`
**Når** en hendelse valideres
**Så** er tittel, dato, start og slutt påkrevd, lik start og slutt er ugyldig, og slutt før start betyr neste dag (FR-44, FR-45)
**Og** visningen blir «21:00 – 07:30 (+1 dag)»

**Gitt** «nå»
**Når** kjernen velger hendelser for «I dag»
**Så** får den dagens hendelser sortert etter starttid, uten de som er over (FR-48)
**Og** Vitest dekker hendelser over midnatt og grensen når en hendelse slutter

### Story 5.3: Legge inn en hendelse

*Spor D · Avhenger av 5.2, 3.5*

Som student,
vil jeg legge inn jobbvakter, kamper og andre faste avtaler,
slik at jeg ser når jeg er opptatt.

**Akseptansekriterier:**

**Gitt** skjemaet Ny
**Når** studenten velger Hendelse i velgeren [Oppgave | Hendelse]
**Så** vises feltene tittel, dato, start og slutt, og teksten beholdes når hun bytter (UX-DR9)
**Og** velgeren vises ikke ved Endre

**Gitt** ugyldige verdier
**Når** studenten lagrer
**Så** vises feilen ved feltet, for eksempel «Slutt må være etter start», og innholdet beholdes

**Gitt** «🔒 Skjul tittel for KI»
**Når** studenten slår den på
**Så** lagres det på hendelsen, og hjelpeteksten «KI får bare vite at du er opptatt kl. <start>–<slutt>, ikke hva du skal.» vises med hendelsens egne klokkeslett (FR-38)

**Gitt** at KI er på
**Når** hendelsesskjemaet vises
**Så** står de fastsatte påminnelsene under tittelen, og «KI ser bare at du er opptatt.» når 🔒 er på eller titler er slått av (FR-37)

**Gitt** Personvern og data
**Når** storyen er ferdig
**Så** vises bryteren «Send hendelsestitler til KI» med standard på (FR-58)

### Story 5.4: Dagens hendelser øverst i «I dag»

*Spor D · Avhenger av 5.3*

Som student,
vil jeg se dagens avtaler øverst i lista,
slik at jeg vet hva dagen inneholder.

**Akseptansekriterier:**

**Gitt** hendelser i dag
**Når** Oppgaver vises
**Så** står de øverst i «I dag», sortert etter starttid, som hendelsesrader uten ring med tid først (FR-48, UX-DR24)
**Og** de teller ikke i gruppeantallet, og vises alltid uansett filter (FR-26)
**Og** de forsvinner når de er over, og hendelser på andre dager vises ikke i listene
**Og** låsikon vises når tittelen er skjult for KI

### Story 5.5: Endre og slette en hendelse

*Spor D · Avhenger av 5.4*

Som student,
vil jeg endre eller slette en hendelse,
slik at kalenderen stemmer når planene endres.

**Akseptansekriterier:**

**Gitt** en hendelsesrad
**Når** studenten trykker
**Så** åpnes hendelsesdetaljen på `?hendelse=<id>` med tittel, dato, start–slutt, låsikon, *Endre* og *Slett* (AD-15, UX-DR24)
**Og** *Endre* åpner skjemaet med feltene utfylt
**Og** *Slett* krever bekreftelse (FR-64)

### Story 5.6: Kalender med månedsvisning

*Spor D · Avhenger av 5.4, 2.5*

Som student,
vil jeg se oppgaver og hendelser i en månedskalender,
slik at jeg ser hvordan uka og måneden går opp.

**Akseptansekriterier:**

**Gitt** bunnmenyen og sidemenyen
**Når** storyen er ferdig
**Så** vises Kalender-fanen mellom Oppgaver og Arkiv og peker til `/kalender`

**Gitt** `/kalender`
**Når** siden åpnes
**Så** vises månedsrutenettet med forrige/neste måned og «I dag», dagens dato i ring og valgt dag med pastell og kant (FR-55, UX-DR25)
**Og** oppgaver vises på fristen, forfalte på opprinnelig dato i varselfarge, og hendelser på sin dag
**Og** på mobil vises prikker (oppgave fylt ink, hendelse muted, forfalt warn), og på PC titler med klokkeslett og «+n til»
**Og** «Ingen frist (n)» er en sammenleggbar seksjon under rutenettet

**Gitt** en dag
**Når** studenten velger den
**Så** står den i `?dag=YYYY-MM-DD`, og dagslista vises under rutenettet (mobil) eller i panelet (PC) med «+ Ny» og dagen ferdig utfylt
**Og** en tom dag viser «Fri dag 🙌», og en tom måned «Ingen planer denne måneden ennå»

**Gitt** filteret fra Oppgaver
**Når** Kalender vises
**Så** gjelder samme filter, og hendelser vises alltid (FR-26, AD-17)

**Gitt** tastatur og skjermleser
**Når** studenten bruker piltastene
**Så** flyttes valgt dag, og hver dag har en tekst som «Onsdag 11. november, 2 oppgaver, 1 hendelse»
**Og** axe-sjekken på `/kalender` gir ingen brudd

### Story 5.7 (Bør): Gjentakende hendelser

*Spor D · Avhenger av 5.5*

Som student,
vil jeg legge inn faste vakter én gang,
slik at jeg slipper å skrive dem inn hver uke.

**Akseptansekriterier:**

**Gitt** hendelsesskjemaet
**Når** studenten velger Gjenta: Hver uke eller Annenhver uke med sluttdato
**Så** folder `kjerne/hendelser.ts: foldUt` serien ut til én hendelse per gang med felles `seriesId` (FR-46, AD-4)
**Og** sluttdato er påkrevd

**Gitt** en hendelse i en serie
**Når** studenten endrer eller sletter den
**Så** spør appen «Bare denne / Denne og alle senere» (FR-47)
**Og** «Denne og alle senere» gir hendelsene fra valgt dato ny `seriesId`, og de tidligere får sluttdato dagen før
**Og** Vitest dekker utfolding og deling av serien

## Epic 6: Økter planlagt med KI

Studenten legger inn økter selv eller godtar øktforslag fra KI rundt hendelsene, huker av økter og ser dem i lister og Kalender. Avsluttes med brukertest for planlegging. Bør-storyene (6.8 og 6.9) kuttes først.

### Story 6.1: Legge til en økt selv

*Spor D · Avhenger av 5.6*

Som student,
vil jeg legge inn når jeg skal jobbe med en oppgave,
slik at jeg ser arbeidet i lista og kalenderen.

**Akseptansekriterier:**

**Gitt** oppgavedetaljen
**Når** studenten trykker «+ Legg til økt» og velger dag og tid
**Så** legges økta i `økter` med `oppgaveId` og `kilde: "manuell"`, uten grensene i FR-49 (FR-51, AD-4)
**Og** knappen vises alltid, også når KI er av eller oppgaven har 🔒

**Gitt** godtatte økter
**Når** listene vises
**Så** står hver økt i lista for sin dato som «Økt n/N – <oppgave>» med tid, der n/N regnes av kjernen (FR-21, UX-DR23)
**Og** øktene teller i gruppeantallet og sorteres med oppgavene etter dato, med øktene først på samme dato etter starttid (FR-24)
**Og** ved sortering på Prioritet eller Nyeste og ved filter følger økta oppgaven sin (FR-25, FR-26)
**Og** en økt som ikke er huket av når dagen er over, står i «Forfalt»
**Og** Kalender viser øktene som hul ring på mobil og med klokkeslett på PC

### Story 6.2: Endre, slette og huke av en økt

*Spor D · Avhenger av 6.1*

Som student,
vil jeg flytte, slette og huke av økter,
slik at planen følger det som faktisk skjer.

**Akseptansekriterier:**

**Gitt** «…»-menyen på en økt i oppgavedetaljen
**Når** studenten velger *Endre tid*
**Så** åpnes samme valg av dag og tid som «+ Legg til økt», og bare den økta endres (FR-64)
**Og** *Slett* gir dialogen «Slette økta? Det kan ikke angres.», og n/N oppdateres

**Gitt** ringen på et øktkort
**Når** studenten huker av
**Så** settes `økt.avhuket`, og økta står med strek over til dagen er over (FR-56)
**Og** oppgaven blir ikke fullført av det

### Story 6.3: Fullføre og slette oppgaver med økter

*Spor D · Avhenger av 6.2*

Som student,
vil jeg at øktene følger oppgaven når jeg fullfører, gjenoppretter eller sletter den,
slik at det ikke ligger igjen løse økter.

**Akseptansekriterier:**

**Gitt** en oppgave med uferdige økter
**Når** studenten huker av oppgaven
**Så** spør appen «Du har n økter igjen. Fullføre likevel?» (FR-57)
**Og** ved ja følger øktene oppgaven til Arkiv og vises ikke i listene, uten at øktene endres (AD-4)

**Gitt** en oppgave i Arkiv
**Når** den gjenopprettes
**Så** kommer øktene tilbake, og passerte økter som ikke er huket av, står i «Forfalt» (FR-32)
**Og** når oppgaven slettes automatisk etter 7 dager, slettes øktene samtidig (FR-30)
**Og** Playwright tester Flyt 5 med økter

### Story 6.4: Øktgrenser i kjernen

*Spor D · Avhenger av 5.2*

Som student,
vil jeg at KI bare kan foreslå økter som faktisk passer,
slik at jeg aldri får en økt midt i en vakt eller rett etter en nattevakt.

**Akseptansekriterier:**

**Gitt** en ren funksjon i `kjerne/` som sjekker ett øktforslag
**Når** den får forslaget, hendelsene, de godtatte øktene, fristen og «nå»
**Så** avvises forslag som er kortere enn 30 minutter eller lengre enn 3 timer, ligger utenfor 07:00–23:00, er i fortiden eller etter fristdagen, overlapper en hendelse eller godtatt økt, eller ligger de første 8 timene etter en hendelse som slutter neste dag (FR-49)
**Og** regelen om nattevakt bruker bare klokkeslett, så den virker uten titler
**Og** mer enn 5 forslag gir bare de 5 første

**Gitt** planleggingscasene fra story 5.1
**Når** Vitest kjører mock-svarene gjennom funksjonen
**Så** godtas det gyldige svaret, og økta som bryter FR-49, avvises

### Story 6.5: KI foreslår økter

*Spor C · Avhenger av 6.4, 4.7, 5.1*

Som student,
vil jeg at KI foreslår når jeg kan jobbe med en oppgave som har frist,
slik at uka går opp uten at jeg må planlegge alt selv.

**Akseptansekriterier:**

**Gitt** `kjerne/ki-trigger.ts`
**Når** en oppgave lagres
**Så** settes `ønsker.økter` bare ved første lagring med frist, når en oppgave uten frist og uten godtatte økter får frist, og ved ny tekst eller ny frist når oppgaven har frist og verken godtatte eller ubesvarte øktforslag (FR-8, FR-13, FR-62, V-2)
**Og** endres fristen mens det finnes ubesvarte øktforslag, forkastes de uten melding og nye hentes ikke, også når teksten endres samtidig (FR-62, V-2)
**Og** oppgaver med godtatte økter får aldri nye øktforslag
**Og** skive 3 bruker samme `forslag`-kall og legger ikke til nye kall (AD-13)
**Og** Vitest dekker hver rad, også tekst og frist endret i samme lagring

**Gitt** et svar med økter
**Når** serveren kontrollerer det
**Så** forkastes økter som bryter FR-49 én og én, og resten returneres (FR-14)
**Og** `mottaKiSvar` forkaster øktforslag hvis fristen er endret siden kallet startet (AD-13)
**Og** reserveløsningen gir aldri økter (FR-17)

**Gitt** planleggingscasene i KI-testsettet og en ekte nøkkel
**Når** skriptet fra story 4.8 kjøres med casene
**Så** holder alle foreslåtte økter FR-49, og hver case får minst én økt (suksesskriteriet for øktforslag)

### Story 6.6: Godta øktforslag

*Spor C · Avhenger av 6.5, 6.1*

Som student,
vil jeg godta, endre eller avvise hver foreslåtte økt,
slik at planen er min.

**Akseptansekriterier:**

**Gitt** øktforslag på en oppgave
**Når** KI-boksen vises
**Så** står de under «✦ Foreslåtte økter» som rader med dag og tid, for eksempel «Man 08:00–10:00», med *Godta* og *Endre* (FR-9, UX-DR23)
**Og** *Godta alle* godtar også øktene
**Og** foreslåtte økter vises ikke i lister og Kalender før de er godtatt (FR-50)

**Gitt** at studenten godtar en økt
**Når** kommandoen kjører
**Så** flyttes den til `økter` med `kilde: "ki"`, etter en ny sjekk mot hendelser og godtatte økter. Kolliderer den, godtas den likevel (FR-50)

**Gitt** `vedlikehold(nå)`
**Når** tiden for et ubesvart øktforslag har passert
**Så** forkastes det uten melding, og er alle forkastet, vises bare «+ Legg til økt» (FR-12)

**Gitt** at KI er av eller oppgaven har 🔒
**Når** detaljen vises
**Så** vises ingen øktforslag, bare «+ Legg til økt» (FR-54)
**Og** Playwright tester Flyt 1 med mock-KI

### Story 6.7: Brukertest av planlegging

*Alle spor · Avhenger av 6.6*

Som gruppe,
vil vi teste hendelser og økter med fem studenter,
slik at vi vet at planleggingen er lett å bruke (V-1).

**Akseptansekriterier:**

**Gitt** testmanuset fra story 4.9, utvidet med planlegging, og fem testbrukere med fiktive data
**Når** hver bruker legger inn en hendelse og godtar en økt
**Så** noteres om hun klarte det uten hjelp fra gruppen i 5 minutter. Målet er minst 4 av 5 (suksesskriteriet for brukervennlighet)
**Og** resultatene skrives i `docs/`, og funn som må rettes, blir egne oppgaver

### Story 6.8 (Bør): Merker på økter som kolliderer eller ligger etter fristen

*Spor D · Avhenger av 6.6*

Som student,
vil jeg se når en økt kolliderer med en hendelse eller ligger etter fristen,
slik at jeg kan flytte den selv.

**Akseptansekriterier:**

**Gitt** en godtatt økt
**Når** den overlapper en hendelse eller ligger etter fristen
**Så** viser øktkortet «⚠ Kolliderer med <tittel>» eller «⚠ Etter fristen» i varselfarge med *Endre tid* (FR-52, UX-DR23)
**Og** merket regnes ut av kjernen og lagres ikke, og det står så lenge tilstanden varer (AD-1, V-3)
**Og** når økta flyttes, hendelsen slettes eller fristen settes senere, forsvinner merket
**Og** uten frist får ingen økt «Etter fristen», og to økter som overlapper hverandre, gir ikke merke (V-3)
**Og** appen endrer aldri økta selv
**Og** Playwright tester Flyt 4 med «Endre tid»

### Story 6.9 (Bør): Foreslå ny tid

*Spor C · Avhenger av 6.8*

Som student,
vil jeg be KI om en ny tid for en økt med merke,
slik at jeg raskt får planen til å gå opp igjen.

**Akseptansekriterier:**

**Gitt** en økt med merke, KI på og oppgave uten 🔒
**Når** studenten trykker *Foreslå ny tid*
**Så** sendes et `nyTid`-kall med utdraget fra AD-9, og KI foreslår én tid innenfor FR-49 som studenten godtar eller endrer (FR-53)
**Og** kallet teller i kallgrensen (AD-8)

**Gitt** at KI ikke svarer, eller kallet gir `reserve`
**Når** resultatet kommer
**Så** står «KI svarte ikke. Flytt økta selv med Endre tid.»

**Gitt** at KI er av eller oppgaven har 🔒
**Når** merket vises
**Så** vises bare *Endre tid* (FR-54)
**Og** Playwright tester Flyt 2 med mock-KI

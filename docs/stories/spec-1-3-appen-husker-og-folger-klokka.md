---
title: 'Story 1.3: Appen husker og følger klokka'
type: 'feature'
created: '2026-11-26'
status: 'done'
baseline_commit: 'b0330fc15bd1cfbe0e1ed4281f9ba4618e98c507'
route: 'dispatch'
story_key: '1-3-appen-husker-og-følger-klokka'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-1-context.md'
  - '{project-root}/docs/stories/spec-1-2-lagringsformat-som-taler-nye-versjoner.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Skjemaet og adapteren fra 1.2 er ikke koblet til appen. Ingenting lastes ved oppstart, ingenting lagres, appen vet ikke hva klokka er, og ødelagte eller for nye data har ingen trygg vei.

**Approach:** Én Zustand-butikk i `lib/store/` som laster dokumentet via `lib/storage/`, lagrer via ett abonnement først etter innlasting, og har `nå` fra `lib/klokke.ts`. En klientkomponent rundt sidene viser skjelett under innlasting, en feilside ved `for-ny`/`ugyldig` og lagringsbanneret når skriving feiler.

## Boundaries & Constraints

**Always:** AD-2, AD-3, AD-5 og AD-10. Bare `lib/storage/` rører localStorage, bare `lib/klokke.ts` leser klokka. Ved `for-ny`/`ugyldig` overskrives det lagrede aldri, heller ikke etter at feilsiden vises. Banneret har teksten «Nettleseren lar ikke appen lagre. Det du skriver nå, forsvinner når du lukker fanen.», står øverst, kan ikke lukkes og vises så lenge feilen varer. Faste tekster ligger i `kjerne/tekster.ts`. Feilsider og sletting skrives saklig uten emoji.

**Feilsidetekst (besluttet av Abhira 2026-11-26):** for ny — tittel «Dataene er lagret av en nyere versjon av dueNext», tekst «Denne versjonen kan ikke lese dem, og ingenting er endret. Last ned dataene som fil, eller slett alt og start på nytt.»; ugyldig — tittel «Appen kan ikke lese dataene dine», tekst «De lagrede dataene er skadet, og ingenting er endret. Last ned dataene som fil før du eventuelt sletter alt.»; knapper «Last ned data» og «Slett alle data». Legges ordrett som egne deltekster med sitatblokk i seksjonen «Personvern og data – fastsatte tekster» i `EXPERIENCE.md` (der tekst-testen leser), med henvisning fra Tilstander-tabellen, og i `kjerne/tekster.ts`.

**Never:** Ingen oppgavekommandoer (1.6), ingen `vedlikehold`/`ryddArkiv` (2.3), ingen `/oppstart` (3.3), ingen ramme, farger eller fonter (1.4), ingen egen dialogkomponent (2.4 — bruk `<dialog>`).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Første start | Tomt lager | Skjelett, så siden; nytt dokument er lagret | N/A |
| Gyldige data | Lagret v1 | Siden vises med dokumentet; ingen skriving ved oppstart | N/A |
| For ny | `schemaVersion: 2` | Feilside med «Last ned data» og «Slett alle data» | Lagret tekst uendret |
| Ugyldig | Ødelagt JSON | Feilside som over | Lagret tekst uendret |
| Last ned | Feilside → «Last ned data» | Fil `duenext-data.json` med rådataene ordrett | N/A |
| Slett fra feilside | Bekreft `SLETT_ALLE_DATA_DIALOG` | Lageret tømmes, appen starter med nytt dokument | Avbryt endrer ingenting |
| Skriving feiler | `setItem` kaster | Banner øverst; appen virker i minnet | Banner borte etter neste vellykkede skriving |
| Lesing feiler | `getItem` kaster | Nytt dokument i minnet, banner, skriving sperret for resten av økta (også etter senere endringer) | N/A |
| Annen fane skriver | `storage`-hendelse for nøkkelen | Dokumentet lastes på nytt, ikke skrevet tilbake | `for-ny`/`ugyldig` gir feilsiden |
| Annen fane sletter alt | `storage`-hendelse, nøkkelen borte | Nytt dokument, som skrives én gang (adapteren skriver tilbake ved `endret`); ingen løkke | N/A |
| Minutt går | 60 s eller fanen blir synlig | `nå` oppdateres | N/A |

</frozen-after-approval>

## Code Map

- `lib/storage/index.ts` -- `lagLagring(hentStorage)` med `les()`/`skriv()`, `LAGRINGSNØKKEL`; utvides med `slettAlt()` og `lyttEtterEndringer(cb)` (lytter på `storage` for nøkkelen eller `key === null`)
- `kjerne/skjema.ts` -- `dokumentSkjema`, `nyttDokument()`, `Dokument`
- `kjerne/tekster.ts` -- Sabrinas fil (spor C) med `SLETT_ALLE_DATA_DIALOG`; banner og feilsidetekst legges til her
- `tests/kjerne/tekster.test.ts` -- testen «tekst uten regel» krever at hver konstant har en regel mot `EXPERIENCE.md`; nye konstanter trenger regel, og teksten må stå i `EXPERIENCE.md`
- `app/layout.tsx` -- serverkomponent; pakk `{children}` i klientkomponenten. Lena endrer samme fil i 1.4, så hold endringen til én linje
- `vitest.config.mts` -- `environment: "node"`; klokke-/DOM-tester bruker `vi.useFakeTimers` og `vi.stubGlobal`
- `zustand` 5.1.0 -- `createStore` fra `zustand/vanilla` + `useStore` fra `zustand`

## Tasks & Acceptance

**Execution:**
- [x] `lib/klokke.ts` -- `startKlokke(settNå)`: kaller straks, så hvert 60. sekund og ved `visibilitychange` til synlig; returnerer stoppfunksjon. `tidsstempel()` gir `new Date().toISOString()` til kommandoer (`createdAt`, `fullført`, samtykke, AD-5). Eneste klokkebruk i appen
- [x] `lib/storage/index.ts` -- `slettAlt()` (`removeItem`, navngitt feil) og `lyttEtterEndringer(cb)` som gir avmeldingsfunksjon
- [x] `lib/store/index.ts` -- `lagButikk({ lagring })` (vanilla) og standardinstans + `useButikk(selektor)`. Tilstand: `status` (`laster`/`klar`/`for-ny`/`ugyldig`), `dokument`, `rå`, `nå: Date | null` (null til `lastInn`), `lagringFeilet`, `skrivingSperret`. Kommandoer: `lastInn()`, `settNå(nå)`, `lastPåNytt()`, `slettAlleData()`. Ett `subscribe` skriver når `dokument` endres og status er `klar`, hopper over dokument som nettopp er lest, skriver aldri når `skrivingSperret`, validerer med `dokumentSkjema` før `skriv` (ugyldig → `console.error`, ingen skriving, `lagringFeilet`). `lastInn` tåler å kjøres to ganger (StrictMode)
- [x] `components/app-tilstand.tsx` -- `'use client'`; starter innlasting, klokke og lytter i `useEffect`; viser skjelett (`aria-busy`), feilside eller banner + `children`
- [x] `components/feilside.tsx`, `components/lagringsbanner.tsx` -- tekster fra `kjerne/tekster.ts`; «Last ned data» via `Blob`; «Slett alle data» via `<dialog>` med `SLETT_ALLE_DATA_DIALOG` og *Avbryt* som standardfokus (kall `focus()` etter `showModal()`); `URL.revokeObjectURL` etter nedlasting
- [x] `app/layout.tsx` -- `<body><AppTilstand>{children}</AppTilstand></body>`
- [x] `docs/ux-designs/.../EXPERIENCE.md`, `kjerne/tekster.ts`, `tests/kjerne/tekster.test.ts` -- banner og feilside som deltekster med sitatblokk i «Personvern og data – fastsatte tekster»; konstantene `LAGRINGSBANNER` og `FEILSIDE` i `BLOKKER` og navnelista i testen; knappen «Slett alle data» gjenbruker eksisterende konstant
- [x] `tests/lib/butikk.test.ts`, `tests/lib/klokke.test.ts` -- Vitest for hver matriserad som ikke trenger nettleser, og at ingenting skrives før `lastInn` er ferdig
- [x] `tests/e2e/lagring.spec.ts` -- Playwright: gyldig dokument lagt inn → omlasting → lageret uendret og `setItem` ikke kalt (tell via `addInitScript`); ødelagt JSON (lagt inn én gang med flagg i `sessionStorage`) gir feilside og uendret lager; kastende `setItem` gir banner

**Acceptance Criteria:**
- Given produksjonskoden (alt utenfor `tests/`), when man søker etter `new Date(` og `Date.now`, then finnes de bare i `lib/klokke.ts`
- Given to faner, when den ene skriver, then laster den andre på nytt uten å skrive tilbake (ingen ping-pong)

## Design Notes

- `AppTilstand` pakker hele `<body>`. Lena (1.4) legger rammen og navigasjonen *inni* `AppTilstand`, under banneret, så banneret alltid står øverst. Under skjelettet vises ingen ramme (kort øyeblikk).
- `lastPåNytt` filtrerer `storage`-hendelser på nøkkelen (eller `key === null`) og `storageArea === localStorage`.
- Feiler `slettAlt()`, blir appen stående på feilsiden med banner.
- Overgangen fra feilside til `klar` etter sletting skriver det nye dokumentet.
- Kjente overganger senere: 2.3 kobler `vedlikehold(nå)` til klokka hver time; 4.5 setter `ventendeKall` til `null` i `lastInn`, som da gir én skriving ved oppstart.

## Implementation Notes

- `lagLagring` tar en valgfri `hentVindu` (standard `window`) slik at `lyttEtterEndringer` kan testes i Node. Filteret på nøkkel/`key === null` og `storageArea` ligger i adapteren.
- `nå` settes av `startKlokke` i samme effekt som `lastInn`; `AppTilstand` viser skjelett til status er ute av `laster` og (ved `klar`) `nå` er satt.
- Med `skrivingSperret` gjør `lastPåNytt` og `slettAlleData` ingenting, siden lageret ikke kan leses.
- `slettAlleData` setter et nytt dokument som abonnementet skriver; `lastInn` gjør ingenting når status ikke er `laster`.
- Testhjelperen `falskStorage` er flyttet til `tests/lib/falsk-storage.ts` (med `kastVedSlett`) og brukes av både lagrings- og butikktesten.
- Banneret har `role="alert"`. Feilsiden har ingen farger/ramme (1.4); knappene har `min-h-11` for 44 px.
- E2E har i tillegg tester for «Last ned data», sletting via dialogen, `for-ny` og to faner.

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Evidens / rute |
|---|---|---|---|---|
| 1 | edge+blind | Annen fane skriver mens denne fanens skriving feilet: banneret forsvinner | low | `anvend` «ok» setter `lagringFeilet` fra lesingen → patch (behold eksisterende feil) |
| 2 | edge+blind | Ulagrede endringer i fanen erstattes når en annen fane skriver | low | AD-3: «Siste skriving vinner» → avvist |
| 3 | edge | Annen fane skriver `for-ny` mens denne har ulagrede endringer | low | Krever nyere app-versjon i annen fane samtidig → avvist |
| 4 | edge+blind | Mislykket sletting viser lagringsbanneret, ikke egen melding | low | Valgt i Design Notes; sjelden → avvist |
| 5 | edge+blind+gap | `revokeObjectURL` rett etter `click()` kan avbryte nedlasting | low | Kjent nettleseroppførsel → patch (`setTimeout`) |
| 6 | edge+blind | Klokka er ikke justert til hele minutter | low | AK krever «hvert minutt»; inntil 59 s forsinkelse → avvist |
| 7 | blind | Knapper, dialog og banner mangler stil og varselfarge på *Slett alt* | low | Farger og fokusring er tokens fra 1.4 → defer til 1.4 |
| 8 | blind | Skjelettet gir skjermlesere ingen tekst | low | Bare `aria-busy` → patch (`role="status"` + «Laster …») |
| 9 | blind | axe kjøres bare på én feiltilstand | low | Flere tilstander kan testes når rammen finnes → defer til 1.4 |
| 10 | blind | Ingen e2e for `lesefeil` | low | Dekket av enhetstester → avvist |
| 11 | blind | Tofanetesten venter ikke på første skriving | low | Siste sjekk ville passert uansett → patch |
| 12 | blind | Banner `y=0`-sjekken er skjør | low | Preflight nullstiller marg; 1.4 legger ramme under banneret → avvist |
| 13 | blind | Ingen komponenttester for `AppTilstand`/`Feilside` | low | Dekket via e2e → avvist |
| 14 | blind | Diffen mangler docs/stories | false | Utelatt med vilje; specen er påstandsfila |
| 15 | blind | `tellSkrivinger` teller også sessionStorage | low | Kan gi falske feil senere → patch |
| 16 | gap | `lesefeil` via `lastPåNytt` fra `klar` er ikke testet | medium | Å bytte til `nyttDokument()` gir grønne tester → patch |
| 17 | gap | `for-ny`/`ugyldig` → `klar` via `lastPåNytt` er ikke testet | medium | Fane kan bli stående på feilsiden uten at test feiler → patch |
| 18 | gap | Banner på feilsiden ved mislykket sletting er ikke testet i UI | medium | Lett å flytte banneret inn i `klar`-grenen i 1.4 → patch |

## Verification

**Commands:**
- `npm test` -- expected: alle tester grønne (kjent unntak på Windows: CRLF-testen i `tekster.test.ts`, se `issues.md`)
- `npm run lint`, `npm run typecheck`, `npm run build` -- expected: ingen feil
- `npm run test:e2e` -- expected: alle grønne på mobil og PC

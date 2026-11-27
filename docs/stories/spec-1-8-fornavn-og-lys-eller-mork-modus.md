---
title: 'Story 1.8: Fornavn og lys eller mørk modus'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: '1be10f031dd8d10bf6f27ce1a8a4984a675799ec'
route: 'dispatch'
story_key: '1-8-fornavn-og-lys-eller-mørk-modus'
review_loop_iteration: 0
context:
  - '{project-root}/docs/stories/epic-1-context.md'
  - '{project-root}/docs/stories/spec-1-4-appens-ramme-navigasjon-og-utseende.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Innstillinger er en plassholder, og Oppgaver har ingen hilsen. Studenten kan verken legge inn fornavnet sitt eller velge lys eller mørk modus, selv om skjemaet (`profil`, `innstillinger.modus`) og temasynken fra 1.4 allerede støtter det.

**Approach:** Bygg Innstillinger med Profil (fornavn med Lagre-knapp), Utseende (Lys / Mørk / Følg systemet som segmentvelger) og Om appen. Legg til kommandoene `settFornavn` og `settModus` i butikken, og vis hilsenen «Hei, Ida 👋» eller «Hei 👋» øverst på Oppgaver.

## Boundaries & Constraints

**Always:** Data endres bare gjennom navngitte kommandoer i `lib/store/` som lager nye objekter (abonnementet oppdager endringer på identitet) og gjør ingenting når status ikke er `klar` eller skrivingen er sperret. Fornavnet trimmes; tomt blir `profil: null`, aldri `""`. Fornavnet lagres bare i `profil` i nettleseren og sendes aldri til serveren. Modus endres med én gang ved klikk (uten Lagre) og følger med til neste oppstart via temaskriptet. Segmentvelgeren har `aria-pressed` og 2 px `accent-ink`-kant på valgt knapp, ikke bare pastellfyll (DESIGN.md:457, :493). Rekkefølgen er Profil → Utseende → Om appen. Du-form, saklig tone. axe gir ingen brudd på `/innstillinger` og `/`.

**Never:** Ingen seksjoner for Prosjekter (2.7), Tema (2.8) eller Personvern og data (3.4), heller ikke plassholdere. Ingen datolinje under hilsenen. Ingen førstegangsoppsett (3.3). Ingen nye felt i skjemaet. Ingen nye tekstkonstanter i `kjerne/tekster.ts` (den er for de fastsatte personverntekstene).

**Besluttet av Lena 2026-11-27:** Om appen viser bare «Versjon {versjon} · Gruppe 43, IBE160», med versjonen fra `package.json`, så det ikke blir for mye informasjon. Ingen navn.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Uten fornavn | `profil: null` | Oppgaver viser «Hei 👋» | N/A |
| Lagre fornavn | «  Ida  » + Lagre | `profil: { fornavn: "Ida" }`; Oppgaver viser «Hei, Ida 👋» | N/A |
| Tømme fornavn | Tomt felt + Lagre | `profil: null`; «Hei 👋» | N/A |
| Bare mellomrom | «   » + Lagre | Som tomt felt | N/A |
| Velge Mørk | Klikk Mørk | `data-modus="mørk"` straks; `aria-pressed="true"` på Mørk; lagret | N/A |
| Neste oppstart | Lagret `modus: "lys"`, OS mørk | Lys fra første tegning | N/A |
| Lagring sperret | `skrivingSperret` | Kommandoene endrer ingenting | Banneret står |

</frozen-after-approval>

## Code Map

- `lib/store/index.ts:21-25,71-106` -- kommandoene; legg til `settFornavn(fornavn: string)` og `settModus(modus)` etter samme mønster; abonnementet (:109) validerer og lagrer
- `kjerne/skjema.ts:101-112,150-152` -- `innstillinger.modus` (`lys`/`mørk`/`system`), `profil: { fornavn: min(1) } | null`
- `components/tema-synk.tsx` -- speiler allerede `innstillinger.modus` til `data-modus`; ingen endring trengs
- `lib/storage/tema-skript.ts` -- leser modus ved oppstart; ingen endring trengs
- `app/innstillinger/page.tsx` -- plassholder (serverkomponent med `metadata`); behold metadata, legg innholdet i en klientkomponent
- `app/page.tsx` -- `<h1 className="text-greeting">Oppgaver</h1>` + tekst; h1 blir hilsenen, `metadata`-tittelen «Oppgaver – dueNext» beholdes
- `package.json:3` -- `version`; importer i serverkomponenten (`resolveJsonModule` er på), ikke i klientkoden
- DESIGN.md `text-field` (:455, label over, hjelpetekst i `meta` under), `segmented-toggle` (:456-457), `button-primary`/`button-secondary`
- EXPERIENCE.md:41-45 (seksjoner), :406 (hjelpetekst «Bare for hilsenen. Lagres på denne enheten.»; vinner over mockupen, E:24), :117 (segmentvelger), :194 (`aria-pressed` + kant)
- Tester som leter etter overskriften «Oppgaver»: `tests/e2e/forside.spec.ts`, `lagring.spec.ts`, `ramme.spec.ts`, `tema.spec.ts` -- må oppdateres når h1 blir hilsenen

## Tasks & Acceptance

**Execution:**
- [x] `lib/store/index.ts` -- `settFornavn` (trim; tomt → `profil: null`) og `settModus`; nye objekter, ingen endring ved `status !== "klar"` eller `skrivingSperret`
- [x] `components/hilsen.tsx` + `app/page.tsx` -- klientkomponent som leser `profil` og viser «Hei, {fornavn} 👋» eller «Hei 👋» som h1 i `greeting`-stil
- [x] `components/innstillinger.tsx` + `app/innstillinger/page.tsx` -- seksjonene Profil (felt «Fornavn», hjelpetekst, Lagre-knapp, kort «Lagret.» i `role="status"` etter lagring), Utseende (segmentvelger Lys / Mørk / Følg systemet) og Om appen (versjon fra `package.json` sendt som prop fra serverkomponenten)
- [x] `tests/e2e/innstillinger.spec.ts` -- hver matriserad; neste oppstart med `reload`; axe på `/innstillinger` i lys og mørk og på `/` med og uten fornavn
- [x] `tests/e2e/*.spec.ts` -- oppdater overskriften «Oppgaver» til hilsenen der testene venter på at siden er klar

**Acceptance Criteria:**
- Given produksjonskoden, when man søker etter `fetch` eller serverkall med fornavnet, then finnes ingen; fornavnet finnes bare i butikken og lageret
- Given Innstillinger, when siden åpnes, then står seksjonene i rekkefølgen Profil, Utseende, Om appen, og ingen andre seksjoner finnes
- Given segmentvelgeren, when man bruker Tab og Enter/mellomrom, then kan alle tre valgene nås og velges med tastaturet, med synlig fokusring

## Implementation Notes

## Spec Change Log

## Review Triage Log

| # | Kilde | Funn | Verdikt | Evidens / rute |
|---|---|---|---|---|
| 1 | gap+blind | Ingen test for at uendret verdi (samme navn, allerede valgt modus) ikke gir ny skriving | medium | Likhetssjekkene i `settFornavn`/`settModus` kan fjernes med grønne tester; ellers skrives samme dokument og andre faner laster på nytt → patch (e2e som teller skrivinger) |
| 2 | blind+edge | «Lagret.» vises selv om `setItem` kaster og banneret sier at navnet forsvinner | medium | `lagre()` sjekker bare `skrivingSperret`, ikke `lagringFeilet`, som abonnementet setter synkront → patch |
| 3 | blind+edge+gap | Feltet beholder gammelt navn når en annen fane endrer det, og Lagre skriver det gamle tilbake | medium | `useState(lagret)` settes bare én gang; `lastPåNytt` oppdaterer butikken mens siden er åpen → patch (synk når lagret navn endres og feltet ikke har ulagrede endringer) |
| 4 | blind+edge | Langt navn uten mellomrom gir vannrett rulling i hilsenen ved 320 px | low | Ingen `maxLength` og ingen `break-words`; direkte retting → patch (`maxLength={50}`, `break-words`) |
| 5 | blind | Knappene ser aktive ut når skrivingen er sperret | low | Banneret (`role="alert"`) forklarer hvorfor; sjelden tilstand → avvist |
| 6 | blind+edge | «Lagret.» annonseres ikke på nytt ved andre lagring uten endring | low | Ingen endring skjer, så det er ingenting nytt å melde; retting krever ekstra tilstand → avvist |
| 7 | blind | Emojien i hilsenen leses opp av skjermlesere | low | Hilsenen «Hei, Ida 👋» er fastsatt i FR-59 og akseptkriteriet → avvist |
| 8 | blind | Akseptkriteriet om ingen serverkall har ingen test | low | Sjekket med `git grep "fetch("` i Verification; ingen treff → avvist |
| 9 | blind | Testhjelpere er kopiert, og en bakgrunnsfarge er hardkodet | low | Ingen feil oppstår; ren rydding → avvist |
| 10 | blind | Fargesjekken i `ramme.spec.ts` treffer nå seksjonsoverskriften på `/innstillinger` | low | Seksjonsoverskriften ligger i glødsonen og skal bruke `text-on-glow`; testen sjekker fortsatt regelen → avvist |
| 11 | edge | Navn med bare usynlige tegn (U+200B) lagres | low | Svært usannsynlig; retting legger til spesialregler → avvist |

## Verification

**Commands:**
- `npm run lint`, `npm run typecheck`, `npm run build` -- expected: ingen feil
- `npm run test:e2e` -- expected: alle grønne på mobil og PC
- `npm test` -- expected: grønt hos noen med Vitest (blokkert av Smart App Control på Lenas maskin; kommandoene testes gjennom e2e)

**Manual checks:**
- Skriv navnet, lagre, gå til Oppgaver: hilsenen vises; bytt modus og last på nytt: modusen står

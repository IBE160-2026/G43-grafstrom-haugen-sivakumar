# Story 2.1: regelbaserte forslag fra nøkkelord

## 2026-11-27 kl. 19:51 — Stine Olsen

### Oppgave
Bygge story 2.1 (spor D) med `bmad-build`: regelbaserte forslag til etikett og prioritet ut fra nøkkelord i `kjerne/reserve.ts`, tabellen kalltype × årsak fra AD-8, og måling mot KI-testsettet.

### Plan
- Spec: [spec-2-1-regelbaserte-forslag-fra-nokkelord.md](../../docs/stories/spec-2-1-regelbaserte-forslag-fra-nokkelord.md). Epic-konteksten [epic-2-context.md](../../docs/stories/epic-2-context.md) ble laget av en underagent.
- Stine valgte en generell nøkkelordliste (alternativ A), ikke tilpasset de 20 testtekstene, så tallet blir en ærlig referanse for 4.8.
- Implementert av en underagent, gjennomgått av tre underagenter (blind, edge case, verifiseringshull), rettet og verifisert.

### Resultat
- `kjerne/reserve.ts`: `nøkkelordforslag`, `reserve`, `RESERVETABELL`, `NØKKELORD`, typene `Årsak`, `Feltnavn`, `Kall`, `Utfall`. `tests/kjerne/reserve.test.ts`: 50 tester.
- KI-testsettet: 19/20 etiketter, 15/20 prioriteringer, skrevet i `tests/ki-testsett/README.md` og låst i testen.
- Gjennomgangen ga fire rettinger: testen låser README-tallene og skriver ut bommene, NFC-normalisering, uttrykk med flere ord må stå nøyaktig, to nye kanttester. Øvrige funn avvist med begrunnelse i specens Review Triage Log.
- `npm test` 229/229, typecheck og lint (uten `studieliste/`) grønne.
- Commit `777156d`. Specen er `done`, story 2.1 står som `review` i sprint-status og venter på Sabrinas gjennomgang. Ikke pushet.

### Åpne punkter
- Sabrina går gjennom story 2.1 (`bmad-walkthrough` eller `bmad-code-review`).
- Si fra til Sabrina at `Årsak` og `Feltnavn` ligger i `kjerne/reserve.ts`; `ki-kontrakt.ts` (4.1) bør importere dem derfra.
- Kjente svakheter i nøkkelordlista til 4.8: bøyninger («husleia», «betalt»), sammensetninger («hjemmeeksamen»), falske treff («arbeidskrav» → Jobb).

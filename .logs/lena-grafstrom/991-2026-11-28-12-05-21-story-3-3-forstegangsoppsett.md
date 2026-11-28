# Story 3.3: førstegangsoppsett

## 2026-11-28 kl. 12:05 — Lena Grafstrøm

### Oppgave
Starte story 3.3 «Førstegangsoppsett med fornavn og KI-valg» (spor B): `/oppstart` med fornavn og KI-valg, lagring av samtykket og omdirigering når `samtykke` er `null`.

### Plan
- `bmad-build`, planleggingssteget. Spec-utkast: [spec-3-3-forstegangsoppsett-med-fornavn-og-ki-valg.md](../../docs/stories/spec-3-3-forstegangsoppsett-med-fornavn-og-ki-valg.md).
- Funn i undersøkelsen: omdirigeringen sender alle eksisterende e2e-tester til `/oppstart`, så alle trenger et besvart samtykke som standard. Tomteksten og kravet om ny tekstversjon trenger `kiErPå`, som hører til 3.1 del 2 (Sabrina) og ikke finnes.

### Resultat
- Lenas beslutninger, skrevet inn i specen: vent på at Sabrina lager `kiErPå` i `kjerne/samtykke.ts` (3.1 del 2); ny tekstversjon gir ingen omdirigering, bare KI av til hun slår den på igjen i Personvern og data (3.4); specen beholdes samlet (~1900 tokens).
- Specen står som `draft` og er ikke godkjent eller implementert. Sprint-status har en kommentar om at 3.3 venter. Commit `a7b4f87`.

### Åpne punkter
- Si fra til Sabrina at 3.3 venter på `kiErPå` i `kjerne/samtykke.ts` (3.1 del 2).
- Når `kiErPå` finnes: kjør `bmad-build` på spec-utkastet for 3.3 og godkjenn det før implementering.

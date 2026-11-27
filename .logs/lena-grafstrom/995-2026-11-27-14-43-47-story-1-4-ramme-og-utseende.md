# Story 1.4: ramme og utseende

## 2026-11-27 kl. 14:43 — Lena Grafstrøm

### Oppgave
Bygge story 1.4 «Appens ramme, navigasjon og utseende» med `bmad-build`: designtokens, Poppins, tema og modus uten blink, ramme med menyer for mobil og PC, sidene `/`, `/arkiv` og `/innstillinger`, og stil på feilside, dialog og lagringsbanner fra 1.3. Abhira venter på 1.4 for å starte 1.5.

### Plan
- Spec: [spec-1-4-appens-ramme-navigasjon-og-utseende.md](../../docs/stories/spec-1-4-appens-ramme-navigasjon-og-utseende.md).
- Lena besluttet: egne komponenter med Tailwind (ikke shadcn/ui), egne SVG-ikoner, beholde hele specen (~1750 tokens).
- Testes med Playwright, fordi Vitest blokkeres av Smart App Control på Lenas maskin.
- Undersøkelse og bygging gjort av subagenter, deretter tre uavhengige gjennomganger (blind, spesialtilfeller, testhull). 21 funn i 18 rader i specens Review Triage Log: 9 rettet, 9 avvist, ingen utsatt.

### Resultat
- Commit `a8fe3eb` (18 filer): tokens for lys/mørk og seks temaer i `app/globals.css`; `lib/storage/tema-skript.ts` setter `data-tema`/`data-modus` før første tegning; `components/tema-synk.tsx` holder dem i takt med butikken; `components/ramme.tsx` og `components/ikoner.tsx` (bunnmeny under 768 px, sidemeny 200 px fra 768 px); nye sider `app/arkiv/` og `app/innstillinger/`; stil på `feilside.tsx` (*Slett alt* i varselfarge) og `lagringsbanner.tsx`; nye tester `tests/e2e/ramme.spec.ts` og `tema.spec.ts`.
- Rettet etter gjennomgang: ukjent tema gir nå begge standardverdier (blå/system); sidetitler «Oppgaver/Arkiv/Innstillinger – dueNext»; tester for tema i annen fane, temafarger, axe på `/innstillinger` i alle temaer, like mørk-blokker, fokusring og lenketelling bare i menyene.
- Verifisert: lint, typecheck og build uten feil; e2e 75 bestått, 7 hoppet over med vilje (bredder kjøres bare i mobil- eller PC-prosjektet); `localStorage` bare i `lib/storage/`.
- Sprint-status: 1.4 står på `review`. Løser punktene fra 1.3 om rammen inni `AppTilstand`, stil på feilside/dialog/banner, axe på banner og dialog, og temaskriptet i `<head>`.

### Åpne punkter
- Abhira går gjennom story 1.4 før den settes til `done` (da kan 1.5 starte).
- Manuelle sjekker er ikke gjort: last inn på nytt med rosa + mørk lagret (ingen blink), og Tab-fokus på mobil og PC i en ekte nettleser.

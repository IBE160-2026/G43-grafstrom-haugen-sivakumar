---
name: dueNext – avvik fra PRD
status: applied
created: 2026-11-11
sources:
  - docs/prds/prd-G43-grafstrom-haugen-sivakumar-2026-11-02/prd.md
  - docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/DESIGN.md
  - docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/EXPERIENCE.md
---

# dueNext – avvik fra PRD

Denne fila samler valgene fra UX-arbeidet ([DESIGN.md](DESIGN.md) og [EXPERIENCE.md](EXPERIENCE.md)) som avviker fra PRD-en. Alle avvikene ble innarbeidet i PRD-en 2026-11-11.

| # | Endring | Berørt i PRD |
|---|---|---|
| 1 | **Hendelser** som egen type med start, slutt og gjentakelse (Ingen / Hver uke / Annenhver uke). Slutt før start = neste dag. Endre/Slett på én forekomst spør «Bare denne / Denne og alle senere». | Ny funksjon. Begreper, F1, F4 |
| 2 | **KI-foreslåtte økter** (enkel variant, ingen automatisk omplanlegging) og **«Foreslå ny tid»** som eget KI-kall. Ingen øktforslag og ingen «Foreslå ny tid» med KI av, KI utilgjengelig eller 🔒. Da finnes bare manuelle økter. | F2, F3, FR-5 presiseres (KI setter fortsatt aldri frist), FR-19, suksesskriterier, KI-testsett |
| 3 | **Mer data til KI:** frist, hendelser (dato, tid og tittel), eksisterende økter som «opptatt», begrenset til en periode fram til fristen | FR-15, FR-35, FR-37, FR-41, motmål |
| 4 | FR-38 «privat» heter **«🔒 Ikke send til KI»** (unngår forveksling med etiketten Privat). Gjelder også hendelser, men med egen etikett **«🔒 Skjul tittel for KI»**, fordi tidspunktet fortsatt sendes. 🔒 betyr ingen KI for oppgaven, heller ikke omplanlegging. | FR-38 |
| 5 | Ny innstilling **«Send hendelsestitler til KI»**, standard på | FR-39 / ny FR |
| 6 | **Økters livssyklus** (EXPERIENCE.md → KI-planlegging): økter i smartlister og gruppeantall, passerte økter i Forfalt, økter følger oppgaven til Arkiv og tilbake, slettes med oppgaven | FR-21, FR-30, FR-32, FR-34 |
| 7 | **Kalender**-visning i appen (ikke integrasjon) | Utenfor scope-lista, F4 |
| 8 | Smartlister: **Forfalt øverst** | FR-20 |
| 9 | «Fullførte» heter **Arkiv** og er egen fane | FR-29 |
| 10 | **Profil** med lokalt fornavn, som aldri sendes til KI eller serveren | F6, personvernerklæring |
| 11 | **Prosjekter** kan slettes i Innstillinger | F1 |
| 12 | **Utseende**: Lys / Mørk / Følg systemet og 6 temaer | Ny |
| 13 | Personvern og data ligger i Innstillinger. Lenken «Personvernerklæring» står nederst på hver side (mobil) og nederst i sidemenyen (PC), se EXPERIENCE.md → Information Architecture. Sidemenyen har også «Personvern og data». | F6, FR-41 |
| 14 | **Filter:** etikett som filterknapper, prioritet, frist og prosjekt i et «☰ Filter»-ark. Kravet er oppfylt; løsningen dokumenteres. | FR-26 |
| 15 | **Sortering:** valgene er Frist (standard) / Prioritet / Nyeste | FR-25 |
| 16 | **Reserveløsningen:** PRD-teksten «Forslag basert på nøkkelord – KI var ikke tilgjengelig» brukes ordrett. I tillegg får hver rad merket «regelbasert». | FR-18 |
| 17 | **Ny samtykketekst** (EXPERIENCE.md → Personvern og data – fastsatte tekster): uttrykkelig samtykke til helseopplysninger, også i hendelser, SCC og Anthropic Ireland, inntil 2 år, lenke til erklæringen, frivillighet og tilbaketrekking. Samtykket lagres med dato og tekstversjon. | FR-35 |
| 18 | **KI-påminnelse** i tre varianter, også for hendelser og skrivefeltet | FR-37 |
| 19 | **Slett alle data** omfatter hendelser, økter, fornavn, tema, prosjekter og samtykke, og appen går til Førstegangsoppsett | FR-40 |
| 20 | **Eksport/import** omfatter hendelser, økter og fornavn. Import **erstatter** alle data etter bekreftelse, og importerte oppgaver sender ingenting til KI før teksten endres. Eksport har advarsel. | FR-43 |
| 21 | Skissens «Navn, telefon og e-post sendes aldri» er forkastet. Teksten er «Skriv ikke navn, telefonnummer eller helseopplysninger – appen fjerner dem ikke automatisk.» til FR-42 eventuelt bygges. FR-42 bør også gjelde hendelsestitler. | FR-42 |
| 22 | **Personvernerklæringen** nevner planlegging som formål, ingen automatiske avgjørelser, at reserveløsningen ikke sender noe, aldersgrense 13 år og lokal lagring av fornavn, tema og samtykke | FR-41 |
| 23 | Serveren logger heller ikke **hendelser og økter** | NFR-3 |
| 24 | Mer data med mulig art. 9-innhold må tas med i overføringsvurderingen og en eventuell DPIA | Å-6 |

# Research: Anthropics lagringstid og trening for API-data

**Dato for research:** 2026-11-02
**Gjelder:** Claude API via vanlig nøkkel fra Claude Console (Commercial Terms), modell Claude Sonnet, brukere i Norge/EØS.
**Metode:** WebSearch/WebFetch mot Anthropics egne sider (privacy.claude.com, support.claude.com, platform.claude.com/docs, anthropic.com/legal). Sekundærkilder er bare brukt for å forklare hvor «7 dager» kom fra.

Merking: **[BEKREFTET]** = lest direkte i Anthropics primærkilde i dag. **[USIKKERT]** = motstridende, uklart eller bare i sekundærkilde.

---

## 1. Kort svar

- **Standard API (oss):** Anthropic sletter input og output fra sine backend-systemer **innen 30 dager**. [BEKREFTET]
- **Trening:** Anthropic **trener ikke** modeller på input/output fra API-et (Commercial Terms). [BEKREFTET]
- **Unntak:** Innhold som flagges av Trust & Safety kan lagres **inntil 2 år** (klassifiseringsscore inntil 7 år), og data kan lagres lenger når loven krever det. [BEKREFTET]
- **«7 dager»:** Står ikke i noen Anthropic-kilde vi fant i dag. [USIKKERT – trolig utdatert eller feil]
- **«Covered Models» (30 dager påkrevd, ingen ZDR):** Gjelder bare Claude Fable 5/5.1 og Mythos 5/5.1, **ikke Sonnet**. [BEKREFTET]
- **Zero Data Retention (ZDR):** Krever egen avtale med Anthropic (salg). Vi har det ikke, og det er ikke realistisk for et studentprosjekt. [BEKREFTET]

---

## 2. Standard API-lagring

**Kilde:** Anthropic Privacy Center, «How long do you store my organization's data?»
URL: https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data
**Datert:** 1. juli 2026 [BEKREFTET]

Sitat:
> "we automatically delete inputs and outputs on our backend within 30 days of receipt or generation"

Unntak nevnt i samme artikkel:
- tjenester med lengre lagring som kunden selv styrer, f.eks. **Files API**
- når kunden og Anthropic har avtalt noe annet, f.eks. **en ZDR-avtale**
- håndheving av bruksreglene (Usage Policy), se punkt 4
- når loven krever det: "as required by law or as necessary to combat violations of our Usage Policy"

Artikkelen viser også til egne regler for Covered Models (punkt 5) og sier at tilbakemeldinger (tommel opp/ned, feilrapporter) lagres i 5 år. Det siste gjelder Claude-appene og ikke vårt API-kall.

### Merknad om en uklar formulering i utviklerdokumentasjonen [USIKKERT]
Siden «API and data retention» (https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) sier:
> "Conversation content (your prompts and Claude's outputs) is not retained by default; the exception is Covered Models, which require 30-day retention."

Setningen står i en del om hvordan *funksjoner* lagrer data, og den samme siden henviser til Privacy Center-artikkelen for «Anthropic's standard retention policies outside these arrangements». Vi legger derfor den mer forsiktige regelen til grunn: **inntil 30 dager**. Det er tryggest å ikke love kortere lagring enn det Privacy Center sier.

---

## 3. Trening

**Kilde 1:** Commercial Terms of Service, https://www.anthropic.com/legal/commercial-terms
**Effective:** 17. juni 2025 [BEKREFTET]
> "Anthropic may not train models on Customer Content from Services."

Customer Content omfatter både Inputs og Outputs. Behandlingen følger Anthropics Data Processing Addendum (DPA), som er en del av avtalen: "Data submitted through the Services will be processed in accordance with the Anthropic Data Processing Addendum". Selve DPA-teksten ble ikke lest i denne researchen. [USIKKERT – DPA ikke sjekket]

**Kilde 2:** Privacy Center, «Is my data used for model training?», https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training
**Datert:** 18. august 2026 [BEKREFTET]
> "By default, we will not use your inputs or outputs from our commercial products" [to train models]

Unntak: tilbakemeldinger eller feilrapporter som brukeren sender selv, eller at kunden aktivt sier ja til å dele data. Ingen av delene skjer i vår app.

**Kilde 3:** platform.claude.com/docs, «API and data retention»:
> "Retained data is never used for model training without your express permission."

---

## 4. Unntak: Trust & Safety og lovkrav

**Kilde:** samme Privacy Center-artikkel (1. juli 2026) [BEKREFTET]
- Samtaler som "flagged by our automated trust and safety systems" kan lagres **inntil 2 år**.
- Klassifiseringsscore fra Trust & Safety kan lagres **inntil 7 år**.
- Data kan lagres lenger "as required by law".

Vi vet ikke hvor ofte vanlige studentnotater blir flagget, men det bør være sjelden. Det må likevel nevnes i personvernerklæringen. [USIKKERT – ingen tall for hvor ofte det skjer]

---

## 5. «Covered Models» (nytt i 2026)

**Kilde:** Support-artikkel «Covered Models», https://support.claude.com/en/articles/15425695 (datert 1. september 2026), og «Data retention practices for Covered Models», https://privacy.claude.com/en/articles/15425996-data-retention-practices-for-covered-models [BEKREFTET]

- Covered Models er **Claude Mythos 5.1, Claude Fable 5.1, Claude Mythos 5 og Claude Fable 5**. Fable 5/Mythos 5 ble utpekt 9. juni 2026, og 5.1-modellene 31. august 2026.
- "Prompts and model completions are retained for at least 30 days and then automatically deleted" (unntatt sikkerhetsundersøkelser og lovkrav).
- ZDR er ikke tilgjengelig for disse modellene.
- "These policies apply only to the models listed on this page": andre modeller beholder de vanlige vilkårene.

**For oss:** Sonnet er **ikke** en Covered Model, så disse reglene gjelder ikke appen. Bytter vi senere til Fable eller Mythos, blir lagringen *minst* 30 dager, og teksten i samtykket må oppdateres.

Release notes (https://platform.claude.com/docs/en/release-notes/overview) bekrefter det samme med oppføringer 9. juni 2026 og 1. september 2026.

---

## 6. Zero Data Retention (ZDR)

**Kilde:** https://platform.claude.com/docs/en/manage-claude/api-and-data-retention [BEKREFTET]
> "Under a ZDR arrangement, Anthropic does not store customer prompts or responses at rest after the API response is returned. To request ZDR for your organization, contact the Anthropic sales team."

- ZDR må slås på per organisasjon av Anthropic. Det følger **ikke** med en vanlig Console-nøkkel.
- Selv med ZDR kan Trust & Safety-flaggede data og data som loven krever, likevel lagres.
- Funksjoner som **ikke** omfattes av ZDR (tabellen på samme side):
  - **Batch API:** "29-day retention; async storage required"
  - **Files API:** "Files retained until explicitly deleted or they reach their configured expiration"
  - **Code execution:** containerdata lagres inntil 30 dager
- **Prompt caching** *er* ZDR-kompatibelt: "Your prompts and Claude's outputs are not stored. KV cache representations and cryptographic hashes are held in memory for the cache TTL and promptly deleted after expiry." (TTL er 5 minutter eller 1 time.)

**For oss:** Vi bruker vanlig `/v1/messages`. Unngå Files API og Batch API hvis vi vil holde lagringen kort og enkel å forklare.

---

## 7. Hvor kom «7 dager» fra? [USIKKERT]

- Noen sekundærkilder (blant annet datastudios.org og andre compliance-blogger) sier at API-lagringen ble kuttet fra 30 til 7 dager 14./15. september 2025.
- Vi fant **ingen** slik opplysning i Anthropics egne kilder:
  - Privacy Center-artikkelen (1. juli 2026) sier 30 dager.
  - Release notes fra 2024 til 2026 nevner ingen endring til 7 dager. Den eneste «7 days»-oppføringen gjelder varsling om utløp av API-nøkler (8. juli 2026).
  - Endringen i september 2025 (https://www.anthropic.com/news/updates-to-our-consumer-terms) gjaldt **forbrukerkontoer** (5 år ved opt-in) og sier uttrykkelig at den ikke gjelder API-et.
- **Konklusjon:** Vi bruker ikke «7 dager». Hvis det en gang har vært en slik regel, er den ikke det Anthropic oppgir i dag.

---

## 8. Endringer 2025–2026 (oversikt)

| Dato | Endring | Påvirker oss? |
|---|---|---|
| 17.06.2025 | Gjeldende Commercial Terms (forbud mot trening på Customer Content) | Ja, gir garantien mot trening |
| Sep 2025 | Nye forbrukervilkår (5 år ved opt-in), gjelder ikke API | Nei |
| 09.06.2026 | Fable 5 / Mythos 5 blir Covered Models (minst 30 dager, ingen ZDR) | Nei (vi bruker Sonnet) |
| 01.07.2026 | Privacy Center-artikkel om lagringstid (30 dager, 2 år ved flagging) | Ja |
| 18.08.2026 | Privacy Center-artikkel om trening oppdatert | Ja |
| 31.08–01.09.2026 | Fable 5.1 / Mythos 5.1 blir Covered Models | Nei |

---

## 9. Forslag til formulering (samtykkedialog og personvernerklæring)

**Kort versjon (samtykkedialog):**
> Oppgaveteksten og notatene dine sendes til KI-tjenesten Claude fra selskapet Anthropic (USA) for å lage svaret. Anthropic bruker ikke dataene til å trene KI-modeller, og sletter dem normalt innen 30 dager.

**Utvidet versjon (personvernerklæring):**
> Oppgaveteksten og notatene dine sendes til Anthropic (USA), som leverer KI-modellen Claude. Anthropic bruker ikke disse dataene til å trene modellene sine, og sletter dem normalt innen 30 dager. Hvis Anthropics automatiske sikkerhetssystemer mistenker brudd på bruksreglene, kan dataene lagres i inntil 2 år, og de kan også lagres lenger hvis loven krever det.

Formuleringen må oppdateres hvis vi bytter til en Covered Model (Fable/Mythos), tar i bruk Files API eller Batch API, eller hvis Anthropic endrer artiklene over. Sjekk kildene på nytt før levering.

---

## 10. Åpne punkter
- Data Processing Addendum (DPA) og overføringsgrunnlag til USA (SCC/DPF) ble ikke lest her. Se GDPR-researchen.
- Den uklare setningen i utviklerdokumentasjonen («not retained by default») mot «innen 30 dager» i Privacy Center. Vi bruker 30 dager som den forsiktige regelen.

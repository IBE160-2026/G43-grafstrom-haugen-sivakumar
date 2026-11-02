# Forskningsgrunnlag: personvern, tillit og dataminimering for dueNext

Dato: 2026-11-02
Formål: Gi PRD-en for dueNext et forskningsbasert grunnlag for krav om personvern, åpenhet og dataminimering. I dueNext sendes oppgavetekst i fritekst til Claude API, som foreslår etikett, prioritet og sammendrag. Appen har ingen innlogging og lagrer data lokalt i nettleseren.

Metode: Søk på nettet (arXiv, ACM DL, USENIX, ACL Anthology, Springer og forfatternes egne sider). Bibliografiske data (forfattere, år, publikasjonskanal og DOI/URL) er sjekket mot minst én primærkilde, for eksempel en forlags- eller konferanseside eller arXiv. Hovedfunnene bygger på sammendrag (abstracts) og på forlags- og konferansesider. Tall som bare stod i sekundærkilder, er utelatt. Ingen fulltekst er lest i sin helhet, så presise tall bør kontrolleres i PDF-en før de siteres i en innlevering.

---

## Tema 1: Personvernrisiko ved å sende brukertekst til en LLM

### 1. Mireshghallah mfl. (2024): Trust No Bot
**Referanse:** Mireshghallah, N., Antoniak, M., More, Y., Choi, Y. & Farnadi, G. (2024). *Trust No Bot: Discovering Personal Disclosures in Human-LLM Conversations in the Wild.* Conference on Language Modeling (COLM 2024). arXiv:2407.11438. https://arxiv.org/abs/2407.11438

**Hovedfunn:** Forfatterne analyserte ekte samtaler mellom brukere og GPT-modeller fra WildChat-datasettet. Personopplysninger (PII) dukker opp i oppgaver der man ikke venter dem, blant annet i 48 % av oversettelsene og 16 % av kodeoppgavene som ble undersøkt. Automatisk PII-deteksjon fant ikke sensitive temaer som helse, seksualitet og rusvaner. Forfatterne anbefaler «nudging» som hjelper brukerne å moderere det de deler, og mer åpenhet fra leverandørene.

**Betydning for dueNext:** Studenter kommer til å skrive ting som «ring legen om depresjonsmedisin» eller «betal husleie til Ola, kontonr …» i oppgavene sine, selv om appen er et enkelt gjøremålsverktøy. Kravet er at dueNext skal anta at fritekst kan inneholde sensitive opplysninger, og vise en kort påminnelse i skrivefeltet (for eksempel «Teksten sendes til Claude, så unngå helseopplysninger og passord»). Maskering basert på regler (se tema 4) er ikke nok alene.

### 2. Zhang mfl. (2024): «It's a Fair Game», or Is It?
**Referanse:** Zhang, Z., Jia, M., Lee, H.-P., Yao, B., Das, S., Lerner, A., Wang, D. & Li, T. (2024). *"It's a Fair Game", or Is It? Examining How Users Navigate Disclosure Risks and Benefits When Using LLM-Based Conversational Agents.* Proceedings of CHI '24, ACM. DOI: 10.1145/3613904.3642385. Preprint: https://arxiv.org/abs/2309.11653

**Hovedfunn:** Studien kombinerer analyse av ekte ChatGPT-samtaler med intervjuer av 19 brukere. Brukerne veier hele tiden personvern mot nytte og bekvemmelighet. Feilaktige mentale modeller og «dark patterns» i grensesnittet gjør at de forstår risikoen dårlig. Menneskelignende samtaleform får dem til å dele mer.

**Betydning for dueNext:** Brukeren må få en korrekt mental modell av hvor teksten går. Grensesnittet bør si eksplisitt at oppgaveteksten sendes til en ekstern KI-tjeneste (Anthropic) og ikke bare lagres lokalt. Appen bør bruke en saklig verktøytone og ikke en «chatbot-venn»-persona som inviterer til å dele mer.

### 3. Carlini mfl. (2021): Extracting Training Data from Large Language Models
**Referanse:** Carlini, N., Tramèr, F., Wallace, E., Jagielski, M., Herbert-Voss, A., Lee, K., Roberts, A., Brown, T., Song, D., Erlingsson, Ú., Oprea, A. & Raffel, C. (2021). *Extracting Training Data from Large Language Models.* 30th USENIX Security Symposium, s. 2633–2650. https://www.usenix.org/conference/usenixsecurity21/presentation/carlini-extracting (arXiv:2012.07805)

**Hovedfunn:** Forfatterne hentet ut hundrevis av ordrette tekstsekvenser fra treningsdataene til GPT-2, blant annet personopplysninger, bare ved å sende spørringer til modellen. Større modeller var mer sårbare enn små.

**Betydning for dueNext:** Studien begrunner hvorfor det betyr noe om leverandøren bruker innsendt tekst til trening, fordi memorert tekst i prinsippet kan lekke senere. Kravet er at dueNext bare bruker API-et med vilkår der kundedata ikke brukes til trening som standard, og at personvernerklæringen sier dette og hvor lenge leverandøren lagrer data. Gruppen må selv sjekke Anthropics gjeldende vilkår, for det er ikke verifisert her.

### 4. Mireshghallah mfl. (2024): Can LLMs Keep a Secret?
**Referanse:** Mireshghallah, N., Kim, H., Zhou, X., Tsvetkov, Y., Sap, M., Shokri, R. & Choi, Y. (2024). *Can LLMs Keep a Secret? Testing Privacy Implications of Language Models via Contextual Integrity Theory.* ICLR 2024 (Spotlight). https://arxiv.org/abs/2310.17884

**Hovedfunn:** Referansetesten ConfAIde bygger på teorien om kontekstuell integritet. Den viser at selv GPT-4 og ChatGPT avslører privat informasjon i sammenhenger der mennesker ikke ville gjort det, i henholdsvis 39 % og 57 % av tilfellene. Lekkasjen fortsetter selv med personvernfremmende instruksjoner og «chain-of-thought».

**Betydning for dueNext:** Vi kan ikke stole på at en instruks i systemprompten som «ikke gjenta personopplysninger» beskytter brukeren. KI-sammendraget kan gjengi sensitive detaljer. Kravet er at personvern håndheves i koden før sending (minimering) og ikke bare i prompten. Brukeren skal også alltid kunne se og redigere sammendraget før det lagres.

---

## Tema 2: Brukeres oppfatning av personvern, tillit og åpenhet

### 5. Wang, Li & Cong (2025): Studenters personvernbekymringer om generativ KI
**Referanse:** Wang, N., Li, Y. & Cong, F. (2025). *University Students' Privacy Concerns Towards Generative Artificial Intelligence.* Journal of Academic Ethics, 23, 2401–2422. DOI: 10.1007/s10805-025-09658-4

**Hovedfunn:** Dette er en kvalitativ studie av universitetsstudenter som bruker APCO-modellen (Antecedents–Privacy Concerns–Outcomes). Studentene bekymrer seg for hvordan data brukes og lagres, og for uautorisert tilgang. Forfatterne knytter bekymringene til hvordan studentene bruker KI-verktøy, til psykisk helse og til ulikhet i utdanningen. (Detaljerte funn er ikke kontrollert i fulltekst.)

**Betydning for dueNext:** Målgruppen er altså bevisst på personvern, og personvern kan bli et konkurransefortrinn. Kravet er at «data lagres bare lokalt, ingen konto» kommuniseres tydelig i onboarding, og at det også er tydelig hvilken del som likevel forlater enheten.

### 6. Kizilcec (2016): How Much Information?
**Referanse:** Kizilcec, R. F. (2016). *How Much Information? Effects of Transparency on Trust in an Algorithmic Interface.* Proceedings of CHI '16, s. 2390–2395. DOI: 10.1145/2858036.2858402

**Hovedfunn:** Et eksperiment med 103 studenter i en Coursera-kontekst (fagfellevurdering av karakterer) viste at et moderat nivå av åpenhet ga mest tillit. For lite forklaring svekket tilliten, og det samme gjorde for mye.

**Betydning for dueNext:** Forklaringen av KI-forslagene bør være kort og ligge i lag: en kort linje («Foreslått av KI ut fra teksten din») og en «Les mer»-lenke. Appen bør ikke vise lange tekniske forklaringer ved hvert forslag.

### 7. Amershi mfl. (2019): Guidelines for Human-AI Interaction
**Referanse:** Amershi, S., Weld, D., Vorvoreanu, M., Fourney, A., Nushi, B., Collisson, P., Suh, J., Iqbal, S., Bennett, P. N., Inkpen, K., Teevan, J., Kikin-Gil, R. & Horvitz, E. (2019). *Guidelines for Human-AI Interaction.* Proceedings of CHI '19. DOI: 10.1145/3290605.3300233

**Hovedfunn:** Artikkelen gir 18 validerte retningslinjer for KI-systemer. Systemet skal blant annet gjøre klart hva det kan og hvor godt det fungerer, støtte effektiv avvisning og korrigering, og gi brukeren global kontroll. Artikkelen fikk Honorable Mention på CHI 2019.

**Betydning for dueNext:** Dette er et direkte grunnlag for kravene om at hvert KI-forslag skal kunne godtas, endres eller avvises med ett klikk, at forslag merkes visuelt som KI-genererte, og at appen har en global innstilling for å slå av KI-forslag helt, slik at den fungerer uten LLM.

---

## Tema 3: Privacy by design, forståelige personvernerklæringer og samtykke

### 8. Schaub mfl. (2015): A Design Space for Effective Privacy Notices
**Referanse:** Schaub, F., Balebako, R., Durity, A. L. & Cranor, L. F. (2015). *A Design Space for Effective Privacy Notices.* Eleventh Symposium on Usable Privacy and Security (SOUPS 2015), USENIX, s. 1–17. https://www.usenix.org/conference/soups2015/proceedings/presentation/schaub

**Hovedfunn:** Tradisjonelle personvernerklæringer blir sjelden lest. Forfatterne foreslår et designrom med dimensjonene tidspunkt (blant annet ved oppstart og «just-in-time»), kanal, modalitet og kontroll. En personvernerklæring er et utgangspunkt og ikke i seg selv et effektivt varsel.

**Betydning for dueNext:** Varselet bør ligge i lag: en kort just-in-time-melding der teksten sendes (ved første KI-forslag), en kort onboarding-skjerm og en full personvernerklæring som er lett å finne. En lang tekst i bunnteksten er ikke nok.

### 9. Balebako mfl. (2015): The Impact of Timing on the Salience of Smartphone App Privacy Notices
**Referanse:** Balebako, R., Schaub, F., Adjerid, I., Acquisti, A. & Cranor, L. F. (2015). *The Impact of Timing on the Salience of Smartphone App Privacy Notices.* Proceedings of the 5th Annual ACM CCS Workshop on Security and Privacy in Smartphones and Mobile Devices (SPSM '15), s. 63–74. DOI: 10.1145/2808117.2808119

**Hovedfunn:** Brukerne husket personvernvarsler klart bedre når varselet ble vist mens de brukte appen, enn når det ble vist i appbutikken før installasjon.

**Betydning for dueNext:** Dette er empirisk støtte for just-in-time-varsling. Informasjonen om at teksten sendes til Claude bør vises i det brukeren første gang ber om eller mottar et KI-forslag, og ikke bare på en velkomstside.

### 10. Nouwens mfl. (2020): Dark Patterns after the GDPR
**Referanse:** Nouwens, M., Liccardi, I., Veale, M., Karger, D. & Kagal, L. (2020). *Dark Patterns after the GDPR: Scraping Consent Pop-ups and Demonstrating their Influence.* Proceedings of CHI '20. DOI: 10.1145/3313831.3376321

**Hovedfunn:** Bare 11,8 % av samtykkeløsningene på de 10 000 største britiske nettstedene oppfylte minimumskravene i europeisk lov. Når «avslå»-knappen ble fjernet fra første nivå, økte samtykket med 22–23 prosentpoeng. Det viser hvor mye designet styrer valget.

**Betydning for dueNext:** Hvis appen ber om samtykke eller aksept for KI-behandling, skal «Ja, bruk KI» og «Nei, uten KI» vises like synlig på samme nivå. Det skal ikke være forhåndsavkrysset, og brukeren skal ikke måtte gjennom flere klikk for å avslå. Appen må fortsatt fungere når brukeren avslår.

### 11. Utz mfl. (2019): (Un)informed Consent
**Referanse:** Utz, C., Degeling, M., Fahl, S., Schaub, F. & Holz, T. (2019). *(Un)informed Consent: Studying GDPR Consent Notices in the Field.* Proceedings of ACM CCS '19. DOI: 10.1145/3319535.3354212. Preprint: https://arxiv.org/abs/1909.02638

**Hovedfunn:** Feltforsøk med over 80 000 brukere viste at plasseringen av samtykkevarselet, typen valg og visuell «nudging» påvirker samtykket sterkt. Forfatterne mener reglene bør spesifisere hvordan samtykke innhentes, og ikke bare kreve samtykke.

**Betydning for dueNext:** Dette støtter kravet om nøytral visuell utforming av personvernvalget og om at valget kan endres senere i innstillingene.

### 12. Hadar mfl. (2018): Privacy by Designers
**Referanse:** Hadar, I., Hasson, T., Ayalon, O., Toch, E., Birnhack, M., Sherman, S. & Balissa, A. (2018). *Privacy by designers: software developers' privacy mindset.* Empirical Software Engineering, 23(1), 259–289. DOI: 10.1007/s10664-017-9517-1

**Hovedfunn:** Intervjuer med 27 utviklere viste at de ofte forstår personvern som informasjonssikkerhet. Derfor velger de policybaserte løsninger fremfor arkitektoniske. Organisasjonens personvernklima og valget av arkitekturmønstre avgjør i praksis hvor godt personvernet blir.

**Betydning for dueNext:** Privacy by design må ligge i arkitekturen og ikke bare i personvernerklæringen. Lokal lagring, ingen konto, ingen egen server som logger prompter, og en minimeringsmodul før API-kall er arkitekturvalg som bør stå som eksplisitte krav i PRD-en. Det gir også grunnlag for en «personvernsjekk» i definition of done for hver brukerhistorie.

---

## Tema 4: Dataminimering før sending til LLM

### 13. Lison mfl. (2021): Anonymisation Models for Text Data
**Referanse:** Lison, P., Pilán, I., Sánchez, D., Batet, M. & Øvrelid, L. (2021). *Anonymisation Models for Text Data: State of the Art, Challenges and Future Directions.* Proceedings of ACL-IJCNLP 2021 (Long Papers), s. 4188–4203. DOI: 10.18653/v1/2021.acl-long.323

**Hovedfunn:** Artikkelen er en oversikt over automatisk anonymisering av tekst, skrevet blant annet av norske forskere ved Norsk Regnesentral og UiO. Den viser at ren sekvensmerking (NER) ikke er nok, og at metodene bør måle risikoen for avsløring eksplisitt. Den peker også på avveiningen mellom personvern og nytten av dataene.

**Betydning for dueNext:** Maskering av navn, telefonnummer, e-post og kontonummer før sending reduserer risikoen, men gir ikke anonymitet. PRD-en bør derfor kalle det «pseudonymisering/minimering» og ikke love «anonymisering». Det må også testes at maskering ikke ødelegger kvaliteten på forslagene. En plassholder som «[PERSON]» bevarer oftest nok mening til at etikett og prioritet blir riktige.

### 14. Chong mfl. (2024): Casper
**Referanse:** Chong, C. J., Hou, C., Yao, Z. & Seyed Talebi, S. M. (2024). *Casper: Prompt Sanitization for Protecting User Privacy in Web-Based Large Language Models.* arXiv:2408.07004 (preprint, NJIT). https://arxiv.org/abs/2408.07004

**Hovedfunn:** Casper er en nettleserutvidelse som renser prompter lokalt før de sendes til en LLM-tjeneste. Den bruker tre lag: et regelbasert filter, gjenkjenning av navngitte enheter med maskinlæring (NER), og en lokal LLM i nettleseren som oppdager sensitive temaer og advarer brukeren. Forfatterne rapporterer høy treffsikkerhet for PII-filtrering og temadeteksjon (rundt 90 %+, men tallene varierer mellom versjonene).

**Betydning for dueNext:** Dette er en direkte arkitekturmal. Trinn 1, som er realistisk for et studentprosjekt, er regex-basert maskering på klientsiden av e-post, telefonnummer, fødselsnummer (11 siffer), kontonummer og URL-er før API-kall. Trinn 2 er en enkel advarsel ved sensitive nøkkelord (helse, diagnose, medisin). Trinn 3, som er valgfritt, er en lokal modell. Det samme regelbaserte laget kan brukes som reserveløsning som foreslår etikett og prioritet ut fra nøkkelord når API-et ikke er tilgjengelig eller KI er slått av. Merk at dette er en preprint uten fagfellevurdering.

---

## Samlede designprinsipper og kravforslag for PRD-en

| # | Prinsipp / krav | Kilder |
|---|---|---|
| P1 | **Anta sensitiv fritekst.** Vis en kort påminnelse i skrivefeltet om at teksten sendes til en ekstern KI, og hva man bør unngå. | 1, 2, 5 |
| P2 | **Minimer i koden før sending.** Regelbasert maskering på klientsiden (e-post, telefon, fødselsnummer, kontonummer, URL) før API-kall. Ikke stol på instrukser i prompten. Kall det pseudonymisering, ikke anonymisering. | 4, 13, 14 |
| P3 | **Just-in-time-varsel i lag.** Kort varsel første gang KI brukes, kort onboarding og full personvernerklæring ett klikk unna. | 8, 9 |
| P4 | **Nøytralt og reversibelt valg.** «Bruk KI» og «Uten KI» skal være like synlige, uten forhåndsvalg, og valget skal kunne endres i innstillinger. Appen skal fungere fullt uten KI. | 7, 10, 11 |
| P5 | **Brukeren har siste ord.** Hvert forslag (etikett, prioritet, sammendrag) merkes som KI-generert og kan godtas, endres eller avvises før lagring. | 2, 4, 7 |
| P6 | **Moderat åpenhet.** Én linje med forklaring og «Les mer», ikke tekniske detaljer ved hvert forslag. | 6 |
| P7 | **Privacy by design i arkitekturen.** Ingen konto, lokal lagring, ingen egen server som logger prompter, bare de nødvendige feltene sendes til API-et, og API-vilkår som utelukker trening på kundedata. | 3, 12 |
| P8 | **Regelbasert reserveløsning.** Klassifisering ut fra nøkkelord når API-et er utilgjengelig eller KI er slått av. Det samme laget brukes til maskering og advarsler om sensitive tema. | 14 |

## Begrensninger
- Hovedfunnene er hentet fra sammendrag og konferanse- og forlagssider, ikke fra full lesing av hver artikkel. Kontroller tallene i PDF-en før de siteres.
- Kilde 14 (Casper) er en preprint uten fagfellevurdering.
- Ingen av kildene studerer akkurat oppgaveapper for studenter. Overføringen til dueNext er gruppens egen tolkning.
- Anthropics gjeldende vilkår for lagring av data og bruk til trening er ikke undersøkt her og må sjekkes separat (se eventuelt egen GDPR- og juss-research).

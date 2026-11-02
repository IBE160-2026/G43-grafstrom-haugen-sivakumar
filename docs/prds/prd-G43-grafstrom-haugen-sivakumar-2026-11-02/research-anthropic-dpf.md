# Faktasjekk: Anthropic, Data Privacy Framework (DPF) og overføring til USA

Sjekket 2. november 2026. Dette er en faktasjekk til PRD-en, **ikke juridisk rådgivning**. Kildene kan endre seg. Sjekk dem på nytt før lansering.

Merking: **[BEKREFTET]** = sett direkte i primærkilde. **[USIKKERT]** = bare sekundærkilder, eller kan ikke verifiseres fullt ut.

## Kort konklusjon

- Anthropic står **ikke** på DPF-listen (verken aktiv eller inaktiv). Overføringen til USA bygger på **EUs standardavtaler (SCC)**, ikke på DPF.
- For EØS-kunder av API-et er avtaleparten **Anthropic Ireland, Limited**. Personopplysningene sendes likevel til servere i USA.
- DPF gjelder i Norge gjennom EØS-avtalen fra 6.7.2024. Anken i Latombe-saken (C-703/25 P) ser ut til å være uavgjort. Det er uansett ikke avgjørende for oss, siden Anthropic ikke bruker DPF.

---

## 1. Er Anthropic DPF-sertifisert?

**[BEKREFTET] Nei.** Jeg søkte i det offisielle DPF-registeret gjennom API-et som deltakersøket på dataprivacyframework.gov bruker (`https://dpfapi.azurewebsites.net/api/participants`, POST med `"Search":"Anthropic"`):

| Søk | Status | Treff |
|---|---|---|
| Anthropic | Active | 0 (av 3 690 aktive) |
| Anthropic | Inactive | 0 (av 3 953 inaktive) |
| Claude | Active | 0 |
| Microsoft / Google / Amazon (kontroll) | Active | 1 hver, så søket virker |

Listen ble sist oppdatert «Monday, November 2, 2026 6:00 AM EST» (endepunktet `/participants/filemodified`).
Offentlig søkeside: https://www.dataprivacyframework.gov/list

**[BEKREFTET] Anthropics egne dokumenter nevner ikke DPF:**
- Personvernerklæringen (gjelder fra 10.9.2026) sier at «your personal data is transferred to our servers in the US». Som overføringsgrunnlag nevner den adekvansbeslutninger (art. 45), standardavtaler (art. 46) og unntak. DPF er ikke nevnt. Behandlingsansvarlig for brukere i EØS, Storbritannia og Sveits er «Anthropic Ireland, Limited». https://www.anthropic.com/legal/privacy
- DPA-en (gjelder fra 24.2.2025) nevner verken DPF eller adekvans for USA. https://www.anthropic.com/legal/data-processing-addendum
- trust.anthropic.com laster innhold med JavaScript, så jeg fikk ikke lest den. **[USIKKERT]** Ingen annen kilde tyder på at det står noe om DPF der.

**[USIKKERT / sannsynligvis feil]** Noen sekundærkilder hevder at Anthropic «deltar i DPF», blant annet compound.law og en blogg med tittelen «Is Claude GDPR Compliant? 2026». Registeret viser at dette ikke stemmer. Ikke bruk disse kildene.

## 2. Hvilket overføringsgrunnlag bruker Anthropic, og hvem er avtaleparten?

**[BEKREFTET] Standardavtaler (SCC), ikke DPF.** Fra DPA-en, https://www.anthropic.com/legal/data-processing-addendum:
- Definisjon: «Module Two (controller to processor) or Module Three (processor to processor) of the Standard Contractual Clauses» (EUs SCC fra 2021).
- SCC-ene er innlemmet ved henvisning («the terms of the SCCs Module Two … and/or Module Three …»).
- For SCC gjelder irsk rett og irske domstoler: «the governing law will be the law of the Republic of Ireland».
- Mottakeren av dataene er «the Anthropic entity that executed the Agreement».
- Det finnes egne tillegg for Storbritannia (UK Addendum) og Sveits.
- I vårt tilfelle er gruppen behandlingsansvarlig og Anthropic Ireland databehandler. Da passer **modul 2** (fra behandlingsansvarlig til databehandler) på overføringen fra oss. Modul 3 dekker videre overføring fra Anthropic Ireland, som databehandler, til Anthropic PBC i USA. **[USIKKERT]** Det er vår tolkning hvilken modul som brukes til hva. DPA-en sier bare «and/or».

**[BEKREFTET] Avtalepart:** Commercial Terms (gjelder fra 17.6.2025) definerer «Anthropic» som «Anthropic Ireland, Limited if Customer resides in the European Economic Area» og «Anthropic, PBC if Customer resides anywhere else». DPA-en er innlemmet ved henvisning: «Data submitted through the Services will be processed in accordance with the Anthropic Data Processing Addendum». https://www.anthropic.com/legal/commercial-terms

**[BEKREFTET]** Anthropics hjelpeside sier at DPA-en med SCC godtas automatisk sammen med Commercial Terms, så det trengs ingen egen signatur: https://privacy.claude.com/en/articles/7996862-how-do-i-view-and-sign-your-data-processing-addendum-dpa

**Følge for oss:** Siden overføringen bygger på SCC, kreves det i praksis en overføringsvurdering (Transfer Impact Assessment, TIA) etter Schrems II. For et studentprosjekt holder det trolig med en kort, dokumentert vurdering. **[USIKKERT]** Hvor omfattende vurderingen må være, er en skjønnsvurdering.

## 3. Status for DPF (2025–2026)

**[BEKREFTET]** EU-domstolens underrett (Tribunal) avviste Latombe-saken (T-553/23) 3.9.2025. Pressemelding: https://curia.europa.eu/site/upload/docs/application/pdf/2025-09/cp250106en.pdf

**[BEKREFTET]** Datatilsynet skrev 3.9.2025: «Det betyr at virksomheter kan fortsette å bruke adekvansbeslutningen som grunnlag for overføring til USA». Tilsynet la til at dommen ikke er endelig, og at «Anbefalingen vår om å tenke beredskap og å ha en strategi for alternative løsninger, gjelder fortsatt». https://www.datatilsynet.no/aktuelt/aktuelle-nyheter-2025/eu-domstolen-opprettholder-adekvansbeslutningen-for-usa/

**[USIKKERT, men samstemte sekundærkilder]** Latombe anket 31.10.2025 til EU-domstolen, sak **C-703/25 P**. Per oktober 2026 er det ikke funnet noen dom, noe forslag til avgjørelse fra generaladvokaten eller noen dato for muntlig forhandling. Jeg fikk ikke verifisert dette direkte i curia.europa.eu, fordi siden lastes dynamisk.
- https://digitalpolicyalert.org/event/35459-latombe-filed-appeal-against-general-court-dismissal-of-challenge-to-european-unionunited-states-data-protection-framework-adequacy-decision-in-latombe-v-commission
- https://secureprivacy.ai/blog/is-the-eu-us-data-privacy-framework-at-risk-the-ftc-ruling-explained-2026

**[BEKREFTET] Datatilsynet sier nå** (artikkel publisert 26.2.2025, sist endret 1.7.2026), https://www.datatilsynet.no/aktuelt/aktuelle-nyheter-2025/informasjon-om-overforinger-til-usa/:
- «Adekvansbeslutningen for USA gjelder imidlertid fortsatt», selv om PCLOB ikke er beslutningsdyktig og det er spørsmål om FTCs uavhengighet.
- «Vi regner med at disse reglene før eller siden vil utfordres i EU-domstolen.»
- «Dersom en adekvansbeslutning oppheves, vil det mest sannsynlig ikke være en overgangsperiode.»
- «Det viktigste rådet til virksomheten din, er å tenke beredskap og ha en plan.»

**[BEKREFTET]** Datatilsynet sier også at adekvansbeslutningen bare gjelder virksomheter som er selvsertifisert og står på DPF-listen. Andre amerikanske virksomheter krever et annet overføringsgrunnlag, for eksempel standardavtaler. https://www.datatilsynet.no/regelverk-og-verktoy/sporsmal-svar/overforing-av-personopplysninger-ut-av-eos/kan-jeg-overfore-personopplysninger-fritt-til-alle-amerikanske-virksomheter/

## 4. Gjelder DPF for Norge på samme måte som i EU?

**[BEKREFTET] Ja, i praksis.** Adekvansbeslutningen (EU) 2023/1795 ble tatt inn i EØS-avtalen vedlegg XI ved EØS-komiteens beslutning nr. 169/2024 av 5.7.2024. Den trådte i kraft i EØS 6.7.2024 og ble kunngjort i EUT L 2024/2568 og EØS-tillegget nr. 76 (17.10.2024).
- https://www.efta.int/eea-lex/32023d1795
- https://eur-lex.europa.eu/eli/dec/2024/2568

**[BEKREFTET]** Det amerikanske justisdepartementet utpekte EU, Island, Liechtenstein og Norge som «qualifying states» etter Executive Order 14086. Det betyr at personer i Norge har samme klageadgang som personer i EU. https://www.govinfo.gov/content/pkg/FR-2023-07-13/html/2023-14848.htm

**[USIKKERT]** Fra 10.7.2023 til 6.7.2024 kan det ha vært en periode der Norge ikke formelt var dekket. Det har ingen betydning for oss nå.

Uansett gjelder dette bare for selskaper som er DPF-sertifisert. Anthropic er ikke det.

---

## Forslag til tekst i personvernerklæringen

> Når du bruker KI-funksjonen, sender vi oppgaveteksten og notatene dine til Anthropic, som lager svaret med KI-modellen Claude. Vi har avtale med Anthropic Ireland Ltd., men dataene behandles på servere i USA. Overføringen er sikret med EUs standardavtaler (standard contractual clauses), fordi Anthropic ikke er med i EU–USA-ordningen Data Privacy Framework.

Valgfri tilleggssetning: «Du finner mer om Anthropics personvern på anthropic.com/legal/privacy.»

## Åpne punkter

- Sjekk DPF-listen og Anthropics DPA på nytt før lansering. Anthropic kan bli sertifisert, eller endre grunnlaget.
- Sjekk status for C-703/25 P direkte på curia.europa.eu.
- Vurder å skrive en kort overføringsvurdering (TIA) og en enkel «exit-plan» i tråd med Datatilsynets råd om beredskap.

 # Product brief: dueNext

 ## Executive summary

 dueNext er en norsk, KI-assistert oppgaveapplikasjon for studenter. Brukeren skriver inn oppgaven med egne ord, og applikasjonen foreslår automatisk etikett, prioritet og et kort sammendrag. Forslagene kan godtas eller endres av brukeren.

 Målet er å samle studie- og hverdagsoppgaver på ett sted og redusere tiden studenten bruker på manuell kategorisering og prioritering. Første versjon skal gi en enkel og oversiktlig arbeidsflyt med oppretting, redigering, fullføring, arkivering og sletting av oppgaver, i tillegg til smarte lister basert på oppgavenes metadata.

 ## Problemet

 Studenter håndterer ofte flere fag, innleveringsfrister, gruppearbeid og private gjøremål samtidig. Oppgavene blir gjerne skrevet ned i ulike verktøy, som Canvas, Teams, egne notater og separate lister. Resultatet er at studenten må bruke tid på å samle, kategorisere og prioritere informasjonen manuelt.

 Dette kan føre til:

 - glemte frister
 - feil prioritering av oppgaver
 - tid brukt på organisering i stedet for gjennomføring
 - manglende oversikt når nye oppgaver kommer til

 En student kan for eksempel ha et gruppemøte onsdag, en programmeringsoppgave med frist fredag og en eksamen uken etter, samtidig som flere mindre gjøremål konkurrerer om oppmerksomheten. Uten en samlet oversikt må studenten selv gjøre denne vurderingen på nytt hver gang oppgavelisten åpnes.

 ## Løsningen

 Brukeren registrerer en oppgave med oppgavetekst, eventuell forfallsdato, prosjekttilknytning og notater. KI analyserer teksten og foreslår nøyaktig tre felt:

 - etikett, for eksempel Skole, Privat eller Gruppearbeid
 - prioritet, for eksempel Lav, Middels eller Høy
 - et kort sammendrag

 Regler håndterer opplysninger som er enkle og forutsigbare, som forfallsdato og tidsrom (for eksempel «I dag», «Denne uken» eller «Senere»), som beregnes ut fra forfallsdatoen. KI brukes når innholdet må tolkes. Denne kombinasjonen skal gi raske og forståelige resultater, samtidig som brukeren beholder kontrollen over egne oppgaver.

 Eksempel:

 > Levere programmeringsoppgave fredag

 Forslag fra KI:

 - Etikett: Skole
 - Prioritet: Høy
 - Sammendrag: Ferdigstille og levere programmeringsoppgaven innen fredag

 Beregnet av regler:

 - Tidsrom: Denne uken

 ## KI-tjeneste

 dueNext bruker Claude API fra Anthropic til KI-forslagene.

 - **Kall fra serveren:** Kallet til Claude gjøres fra serveren i Next.js-appen, aldri fra nettleseren. API-nøkkelen ligger i `.env.local`, som er utelatt fra Git. Repoet inneholder en `.env.example` som viser hvilke variabler som trengs.
 - **Strukturert svar:** Claude skal svare i et fast format med etikett, prioritet og sammendrag. Svaret valideres før det vises. Ugyldige verdier forkastes.
 - **Reserveløsning:** Mangler API-nøkkelen, svarer ikke Claude, eller er svaret ugyldig, bruker appen en enkel regelbasert reserveløsning med nøkkelord og forfallsdato. Brukeren ser at forslaget ikke kommer fra KI. Dermed kan sensor og andre kjøre appen lokalt uten gruppens nøkkel.
 - **Testmodus:** Automatiske tester bruker faste mock-svar i stedet for ekte kall til Claude, slik at de er gratis, raske og gir samme resultat hver gang.
 - **Kostnad:** Hvert forslag er ett kort kall. Gruppen bruker en rimelig Claude-modell og egen nøkkel under utvikling. Hvilken modell, avgjøres i arkitekturdokumentet.
 - **Personvern:** Bare oppgavetekst og notater sendes til Claude. Brukeren får beskjed om dette i appen.

 ## Målgruppe

 ### Primærmålgruppe

 Norske studenter som håndterer oppgaver på tvers av flere fag, prosjekter og deler av hverdagen. Løsningen passer særlig for studenter som opplever at oppgaver og frister er spredt mellom flere steder, eller som bruker mye tid på å finne ut hva de bør gjøre først.

 Brukeren trenger ikke å være teknisk erfaren. Oppgaver skal kunne skrives inn med vanlig språk uten at studenten må velge kategori og prioritet på forhånd.

 ### Sekundærmålgruppe

 Enkeltpersoner og små team som ønsker en enkel oppgaveplanlegger med KI-assistert organisering. Deling mellom brukere inngår ikke i første versjon.

 ## Produktmål

 Produktet skal gjøre det enklere å få oversikt over studiehverdagen, redusere tiden som brukes på organisering og gjøre det raskere å se hvilke oppgaver som bør prioriteres først. KI-en skal fungere som en støtte i planleggingen, mens studenten alltid tar den endelige beslutningen.

 ## Kjerneopplevelse

 Den viktigste arbeidsflyten er:

 1. Brukeren skriver inn en oppgave.
 2. Applikasjonen analyserer oppgaveteksten.
 3. KI foreslår etikett, prioritet og sammendrag.
 4. Brukeren godtar eller endrer forslagene.
 5. Oppgaven vises i relevante smarte lister.

 ## MVP-scope

 ### Innenfor MVP

 - opprette oppgaver
 - redigere oppgaver
 - fullføre og arkivere oppgaver
 - slette oppgaver
 - angi oppgavetekst, forfallsdato, prosjekt og notater
 - KI-forslag til etikett, prioritet og sammendrag
 - godta eller endre KI-forslag
 - filtrere og sortere etter etikett, prioritet og forfallsdato
 - smarte lister basert på oppgavenes metadata
 - lokal lagring uten innlogging, slik at oppgaver er tilgjengelige når brukeren kommer tilbake på samme maskin
 - regelbasert reserveløsning når KI ikke er tilgjengelig

 ### Utenfor MVP

 - innlogging, brukerkontoer og synkronisering mellom enheter (kan legges til som eget trinn hvis det blir tid)
 - automatisk innhenting fra Canvas, Teams eller andre eksterne systemer
 - deling og samarbeid mellom flere brukere
 - mobilapplikasjon
 - avanserte varsler og automatiserte påminnelser
 - full kalenderintegrasjon

 Regler for hvor lenge fullførte oppgaver skal arkiveres, må avklares som en del av MVP-arbeidet. Siden det ikke er innlogging, lagres oppgavene bare lokalt, og ingen brukerdata lagres hos gruppen. Første versjon skal være tydelig på hvilke opplysninger som sendes til KI, og gi brukeren kontroll over egne data.

 ## Hva gjør løsningen annerledes?

 - **Manuell tagging:** Fleksibelt, men tidkrevende og ofte inkonsekvent.
 - **Faste regler og nøkkelord:** Raskt og forutsigbart, men mindre egnet for nye eller komplekse formuleringer.
 - **Generell KI-chatbot:** Kan hjelpe med prioritering, men brukeren må kopiere informasjon inn og overføre resultatet til en oppgaveliste.
 - **dueNext:** KI-forslagene er en integrert del av opprettelsen av oppgaven. Brukeren skriver oppgaven, får forslag til organisering og godkjenner eller korrigerer resultatet i samme arbeidsflyt.

 Produktet bruker derfor KI der den gir en konkret fordel, og regler der de gir mer presise og forutsigbare resultater.

 ## Suksesskriterier

 Produktet regnes som vellykket når:

 - brukeren kan opprette, redigere, fullføre, arkivere og slette oppgaver
 - KI kan foreslå forståelige etiketter, prioriteringer og sammendrag på norsk
 - brukeren enkelt kan godta eller endre forslagene
 - oppgaver kan filtreres og sorteres etter relevante kriterier
 - oppgaver lagres og er tilgjengelige når brukeren kommer tilbake
 - appen fungerer med regelbasert reserveløsning når API-nøkkel mangler eller Claude ikke svarer
 - nye brukere forstår grunnfunksjonene uten opplæring

 KI-forslagene måles mot et fast testsett:

 - Gruppen lager et testsett med 20 norske oppgavetekster, hver med forventet etikett og prioritet. Testsettet lagres i repoet.
 - Målet er at KI-en treffer forventet etikett på minst 16 av 20 og forventet prioritet på minst 14 av 20.
 - Testsettet kjøres på nytt når prompten endres, slik at endringer kan sammenlignes.

 Brukervennlighet måles i en enkel brukertest med minst 5 testbrukere:

 - minst 4 av 5 testbrukere kan opprette en oppgave og endre et KI-forslag uten veiledning

 ## Fremtidig visjon

 Dersom løsningen lykkes, kan den videreutvikles fra en KI-assistert oppgaveliste til en samlet studieassistent. Mulige utvidelser er kalenderintegrasjon, oversikt over møter og avtaler, bedre fristoversikt, deling i team og integrasjon med læringsplattformer som Canvas.

 Over tid kan brukerens korrigeringer og arbeidsmønstre brukes til å gi mer tilpassede forslag. En engelsk versjon kan vurderes etter at den norske versjonen fungerer godt. Den langsiktige visjonen er å samle studentens planlegging på ett sted, slik at mer tid og energi kan brukes på selve arbeidet.

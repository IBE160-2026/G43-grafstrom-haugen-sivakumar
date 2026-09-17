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

 Brukeren registrerer en oppgave med oppgavetekst, eventuell forfallsdato, prosjekttilknytning og notater. KI analyserer teksten og foreslår:

 - etikett, for eksempel Skole, Privat eller Gruppearbeid
 - prioritet, for eksempel Lav, Middels eller Høy
 - et kort sammendrag

 Regler håndterer opplysninger som er enkle og forutsigbare, som forfallsdato og faste kategorier. KI brukes når innholdet må tolkes. Denne kombinasjonen skal gi raske og forståelige resultater, samtidig som brukeren beholder kontrollen over egne oppgaver.

 Eksempel:

 > Levere programmeringsoppgave fredag

 Foreslått organisering:

 - Prioritet: Høy
 - Etikett: Skole
 - Type: Gruppearbeid eller individuell oppgave, avhengig av kontekst
 - Tidsrom: Denne uken
 - Sammendrag: Ferdigstille og levere programmeringsoppgaven innen fredag

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
 - lagring slik at oppgaver er tilgjengelige når brukeren kommer tilbake
 - valgfri innlogging for synkronisering

 ### Utenfor MVP

 - automatisk innhenting fra Canvas, Teams eller andre eksterne systemer
 - deling og samarbeid mellom flere brukere
 - mobilapplikasjon
 - avanserte varsler og automatiserte påminnelser
 - full kalenderintegrasjon

 Personvernvalg og regler for hvor lenge fullførte oppgaver skal arkiveres, må avklares som en del av MVP-arbeidet. Første versjon skal være tydelig på hvilke opplysninger som sendes til KI, og gi brukeren kontroll over egne data.

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
 - nye brukere forstår grunnfunksjonene uten opplæring

 Følgende signaler skal måles i brukertesting:

 - minst 30 prosent reduksjon i tiden brukt på å registrere og organisere en oppgave sammenlignet med manuell kategorisering
 - minst 50 prosent av KI-forslagene til etikett og prioritet beholdes uten endringer
 - minst 80 prosent av testbrukerne kan endre KI-forslag uten veiledning
 - antall oppgaver opprettet og smarte lister åpnet per uke

 ## Fremtidig visjon

 Dersom løsningen lykkes, kan den videreutvikles fra en KI-assistert oppgaveliste til en samlet studieassistent. Mulige utvidelser er kalenderintegrasjon, oversikt over møter og avtaler, bedre fristoversikt, deling i team og integrasjon med læringsplattformer som Canvas.

 Over tid kan brukerens korrigeringer og arbeidsmønstre brukes til å gi mer tilpassede forslag. En engelsk versjon kan vurderes etter at den norske versjonen fungerer godt. Den langsiktige visjonen er å samle studentens planlegging på ett sted, slik at mer tid og energi kan brukes på selve arbeidet.

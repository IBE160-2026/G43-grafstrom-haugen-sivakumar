/**
 * Fastsatte tekster fra «Personvern og data – fastsatte tekster» i EXPERIENCE.md.
 *
 * Tekstene skal brukes ordrett. Komponenter importerer dem herfra og skriver dem
 * aldri selv. `tests/kjerne/tekster.test.ts` sammenligner dem med EXPERIENCE.md.
 *
 * Uthevinger i markdown (`**…**`) er egne felt (for eksempel `tittel`), ikke
 * markdown i strengen. Ren TypeScript: ingen import fra React, Next eller `lib/`.
 */

/**
 * Versjonen av samtykketeksten. Øk den når `SAMTYKKETEKST` endres, slik at
 * tidligere samtykker ikke lenger gjelder. Testen holder en hash av teksten.
 */
export const GJELDENDE_SAMTYKKEVERSJON = 1;

const AVBRYT = "Avbryt";
const IMPORTER = "Importer";

/** Etikettene for 🔒 på oppgaver og hendelser. */
export const LÅS_VALG = {
  oppgave: "🔒 Ikke send til KI",
  hendelse: "🔒 Skjul tittel for KI",
} as const;

/** Demo-advarsel (FR-65). Nøytral infoboks, ikke varselfarge. */
export const DEMO_ADVARSEL = {
  tittel: "Dette er en demo.",
  tekst:
    "Bruk bare test- eller fiktive data, og skriv ikke inn ekte personopplysninger. Når KI er på, kan teksten du skriver, sendes til Claude (Anthropic) i USA.",
} as const;

/**
 * Fastsatt samtykketekst (FR-35).
 *
 * `duBestemmer.deler` er en rekke biter som vises etter hverandre med mellomrom
 * mellom; biter med `uthevet` vises uthevet.
 */
export const SAMTYKKETEKST = {
  overskrift: "Vil du bruke KI?",
  innledning:
    "dueNext kan bruke KI-tjenesten Claude til å foreslå etikett, prioritet og sammendrag, og til å foreslå når du kan jobbe med en oppgave, også en ny tid hvis en økt kolliderer.",
  hvaSendes: {
    tittel: "Dette sendes når KI er på:",
    punkter: [
      "teksten og notatene på oppgavene dine, og fristen",
      "dato og klokkeslett på hendelsene i kalenderen din, og titlene hvis du tillater det (for eksempel «Jobbvakt tor 16–22»), slik at øktene legges utenom dem",
      "tidspunktene for økter du allerede har planlagt, bare som «opptatt»",
    ],
  },
  navnSendesAldri: "Navnet ditt sendes aldri.",
  hvemFårDet: {
    tittel: "Hvem får det:",
    tekst: "Anthropic, selskapet bak Claude. Dataene behandles i USA.",
  },
  hvorLenge: {
    tittel: "Hvor lenge:",
    tekst:
      "Anthropic bruker ikke dataene til å trene KI-modeller. De slettes normalt innen 30 dager, men kan lagres i inntil 2 år hvis en forespørsel flagges for brudd på bruksreglene. Det som er sendt, kan ikke slettes fra appen.",
  },
  duBestemmer: {
    tittel: "Du bestemmer:",
    deler: [
      "Med",
      { uthevet: LÅS_VALG.oppgave },
      "holder du en oppgave helt utenfor. Med",
      { uthevet: LÅS_VALG.hendelse },
      "på en hendelse sendes bare at du er opptatt. Titlene på hendelsene sendes som standard. Du kan slå det av i Innstillinger → Personvern og data.",
    ],
  },
  utenKi:
    "Appen virker fullt ut uten KI. Da fyller du ut feltene og legger inn økter selv. Du kan ombestemme deg når som helst i Innstillinger → Personvern og data.",
  lenke: "Les hele personvernerklæringen",
  knapper: {
    nei: "Nei, uten KI",
    ja: "Ja, bruk KI",
  },
} as const;

/** KI-påminnelser. Vises bare når KI er på. */
export const KI_PÅMINNELSER = {
  /** Bruk `oppgavePåminnelse` for varianten uten notater. */
  oppgave: "Teksten og notatene sendes til KI (Claude) for å lage forslag.",
  hendelse: {
    tekst:
      "Tittel og tid brukes av KI (Claude) når den planlegger økter. Slå på 🔒 hvis tittelen er privat – da sendes bare at du er opptatt.",
    advarsel:
      'Unngå navn på andre og helseopplysninger – bruk 🔒 eller en nøytral tittel som "Avtale".',
  },
  oppgaveLåst: "Sendes ikke til KI.",
  /** Brukes også på alle hendelser når «Send hendelsestitler til KI» er av. */
  hendelseLåst: "KI ser bare at du er opptatt.",
} as const;

/** KI-påminnelsen for en oppgave, uten « og notatene» når notater ikke skal sendes. */
export function oppgavePåminnelse(utenNotater: boolean): string {
  return utenNotater
    ? KI_PÅMINNELSER.oppgave.replace(" og notatene", "")
    : KI_PÅMINNELSER.oppgave;
}

/** Etiketter, hjelpetekst og overskrifter i Personvern og data. */
export const PERSONVERN_VALG = {
  kiForslag: "KI-forslag",
  sendAldriNotater: "Send aldri notater til KI",
  sendHendelsestitler: {
    etikett: "Send hendelsestitler til KI",
    hjelpetekst: "Av: KI ser bare når du er opptatt, ikke hva du skal.",
  },
  samtykkestatus: "Samtykkestatus",
  eksporter: "Eksporter",
  importer: IMPORTER,
  slettAlleData: "Slett alle data",
  hvaSendesTilKi: "Hva sendes til KI",
  lagring: "Lagring",
  personvernerklæring: "Personvernerklæring",
} as const;

/** Innholdet under «Hva sendes til KI». `sendes` vises med ✓, `sendesIkke` med ✕. */
export const HVA_SENDES_TIL_KI = {
  sendes: [
    "Oppgavetekst, notater (kan slås av) og frist",
    "Dato og klokkeslett på hendelser, og tittelen hvis «Send hendelsestitler til KI» er på. Hendelser med 🔒 sendes bare som «opptatt».",
    "Tidspunkter for andre økter, som «opptatt»",
    "Bare hendelser og økter for en begrenset periode fram til fristen",
  ],
  sendesIkke: ["Oppgaver merket 🔒", "Fornavnet ditt"],
  /** Gjelder til FR-42 eventuelt bygges. */
  navnelinje:
    "Skriv ikke navn, telefonnummer eller helseopplysninger – appen fjerner dem ikke automatisk.",
  /** Erstatter `navnelinje` når FR-42 er bygget. */
  navnelinjeFR42:
    "Appen prøver å bytte ut telefonnumre og e-post med plassholdere før sending, men kan ikke garantere at alt blir fanget.",
} as const;

/** Innholdet under «Lagring». */
export const LAGRING = {
  tekst:
    "Alt ligger bare i denne nettleseren. Det som sendes til Anthropic, slettes normalt innen 30 dager, men kan lagres i inntil 2 år hvis det flagges for brudd på bruksreglene.",
} as const;

/** Advarsel før eksportfila lagres. */
export const EKSPORT_ADVARSEL = {
  tekst:
    "Fila inneholder alt du har skrevet, også navnet ditt og hendelsene. Lagre den et trygt sted.",
} as const;

/** Importdialogen med knapper og meldingene etterpå. */
export const IMPORT_DIALOG = {
  tittel: "Importere data?",
  tekst: "Importen erstatter alle data i appen. Fortsette?",
  knapper: {
    avbryt: AVBRYT,
    importer: IMPORTER,
  },
  suksess: "Importen er fullført.",
  feil: "Fila kunne ikke leses. Ingen data er endret.",
} as const;

/** «Slett alle data»-dialogen. *Avbryt* har standardfokus, *Slett alt* varselfarge. */
export const SLETT_ALLE_DATA_DIALOG = {
  tittel: "Slette alle data?",
  tekst:
    "Alle oppgaver, hendelser, økter, navnet ditt og innstillingene slettes fra denne nettleseren, og appen starter på nytt. Det kan ikke angres. Tekst som allerede er sendt til KI, kan ikke slettes herfra – Anthropic sletter den normalt innen 30 dager.",
  knapper: {
    avbryt: AVBRYT,
    slettAlt: "Slett alt",
  },
} as const;

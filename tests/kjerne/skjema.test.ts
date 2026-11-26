import { describe, expect, it } from "vitest";
import {
  dokumentSkjema,
  GJELDENDE_SKJEMAVERSJON,
  hendelseSkjema,
  innstillingerSkjema,
  nyttDokument,
  oppgaveForslagSkjema,
  oppgaveSkjema,
  profilSkjema,
  samtykkeSkjema,
  ventendeKallSkjema,
  øktSkjema,
} from "@/kjerne/skjema";
import { fulltDokument, T } from "./fikstur";

describe("nyttDokument", () => {
  it("validerer mot skjemaet og har standardverdiene", () => {
    const dok = nyttDokument();
    expect(dokumentSkjema.safeParse(dok).success).toBe(true);
    expect(dok).toEqual({
      schemaVersion: GJELDENDE_SKJEMAVERSJON,
      oppgaver: [],
      økter: [],
      hendelser: [],
      innstillinger: {
        modus: "system",
        tema: "blå",
        sendAldriNotater: false,
        sendHendelsestitler: true,
      },
      profil: null,
      samtykke: null,
    });
  });

  it("gir et nytt objekt hver gang", () => {
    expect(nyttDokument()).not.toBe(nyttDokument());
  });
});

describe("dokumentSkjema", () => {
  it("godtar et fullt utfylt dokument", () => {
    expect(dokumentSkjema.safeParse(fulltDokument()).success).toBe(true);
  });

  it("avviser ukjente nøkler på toppnivå", () => {
    expect(dokumentSkjema.safeParse({ ...fulltDokument(), ekstra: 1 }).success).toBe(false);
  });

  it.each(["oppgaver", "økter", "hendelser", "innstillinger", "profil", "samtykke"])(
    "krever samlingen/objektet %s",
    (nøkkel) => {
      const dok: Record<string, unknown> = { ...fulltDokument() };
      delete dok[nøkkel];
      expect(dokumentSkjema.safeParse(dok).success).toBe(false);
    },
  );

  it("avviser annen schemaVersion enn 1", () => {
    expect(dokumentSkjema.safeParse({ ...fulltDokument(), schemaVersion: 2 }).success).toBe(false);
  });
});

describe("oppgaveSkjema", () => {
  const oppgave = () => fulltDokument().oppgaver[0];

  it("godtar minimal oppgave med null-felt", () => {
    expect(
      oppgaveSkjema.safeParse({
        ...oppgave(),
        frist: null,
        prosjekt: null,
        etikett: null,
        sammendrag: null,
        notater: null,
        forslag: null,
        ventendeKall: null,
        fullført: T,
      }).success,
    ).toBe(true);
  });

  it.each<[string, unknown]>([
    ["tekst", ""],
    ["frist", "2026-02-30"],
    ["frist", "26.11.2026"],
    ["prosjekt", ""],
    ["etikett", "Hobby"],
    ["prioritet", "Kjempehøy"],
    ["prioritet", null],
    ["sammendrag", ""],
    ["notater", ""],
    ["skjultForKi", "nei"],
    ["createdAt", "2026-11-26"],
    ["createdAt", "2026-11-26T10:00:00+01:00"],
    ["fullført", "i går"],
    ["fullført", true],
  ])("avviser %s = %j", (felt, verdi) => {
    expect(oppgaveSkjema.safeParse({ ...oppgave(), [felt]: verdi }).success).toBe(false);
  });

  it("avviser ukjent nøkkel (ingen kilde for sammendrag)", () => {
    expect(oppgaveSkjema.safeParse({ ...oppgave(), sammendragKilde: "ki" }).success).toBe(false);
  });
});

describe("oppgaveForslagSkjema", () => {
  it("godtar null og tomme felt", () => {
    expect(oppgaveForslagSkjema.safeParse(null).success).toBe(true);
    expect(oppgaveForslagSkjema.safeParse({ felt: {}, økter: [] }).success).toBe(true);
  });

  it.each<[string, unknown]>([
    ["etikett med prioritetsverdi", { felt: { etikett: { verdi: "Høy", kilde: "ki" } }, økter: [] }],
    ["prioritet med etikettverdi", { felt: { prioritet: { verdi: "Skole", kilde: "ki" } }, økter: [] }],
    ["sammendrag som tall", { felt: { sammendrag: { verdi: 3, kilde: "ki" } }, økter: [] }],
    ["ukjent kilde", { felt: { etikett: { verdi: "Jobb", kilde: "manuell" } }, økter: [] }],
    ["ukjent felt", { felt: { frist: { verdi: "2026-12-01", kilde: "ki" } }, økter: [] }],
    ["manglende økter", { felt: {} }],
    ["øktforslag med sekunder", { felt: {}, økter: [{ id: "f", dato: "2026-11-27", start: "09:00:00", slutt: "10:00" }] }],
    ["øktforslag med ekstra nøkkel", { felt: {}, økter: [{ id: "f", dato: "2026-11-27", start: "09:00", slutt: "10:00", kilde: "ki" }] }],
  ])("avviser %s", (_navn, verdi) => {
    expect(oppgaveForslagSkjema.safeParse(verdi).success).toBe(false);
  });
});

describe("ventendeKallSkjema", () => {
  it("godtar null, forslag og nyTid", () => {
    expect(ventendeKallSkjema.safeParse(null).success).toBe(true);
    expect(ventendeKallSkjema.safeParse({ id: "k", type: "nyTid" }).success).toBe(true);
  });

  it.each<unknown>([
    { id: "k", type: "annet" },
    { id: "k", type: "forslag", frist: T },
    { type: "forslag" },
  ])("avviser %j", (verdi) => {
    expect(ventendeKallSkjema.safeParse(verdi).success).toBe(false);
  });
});

describe("øktSkjema", () => {
  const økt = () => fulltDokument().økter[0];

  it("godtar uavhuket økt fra KI", () => {
    expect(øktSkjema.safeParse({ ...økt(), avhuket: null, kilde: "ki" }).success).toBe(true);
  });

  it.each<[string, unknown]>([
    ["kilde", "regelbasert"],
    ["avhuket", true],
    ["start", "9:00"],
    ["slutt", "24:00"],
    ["dato", "2026-13-01"],
    ["oppgaveId", ""],
  ])("avviser %s = %j", (felt, verdi) => {
    expect(øktSkjema.safeParse({ ...økt(), [felt]: verdi }).success).toBe(false);
  });
});

describe("hendelseSkjema", () => {
  const hendelse = () => fulltDokument().hendelser[0];

  it("godtar enkelthendelse uten serie", () => {
    expect(hendelseSkjema.safeParse({ ...hendelse(), seriesId: null, gjentakelse: null }).success).toBe(true);
  });

  it.each<[string, unknown]>([
    ["tittel", ""],
    ["gjentakelse", { hver: "dag", sluttdato: "2027-01-31" }],
    ["gjentakelse", { hver: "uke" }],
    ["skjulTittelForKi", null],
    ["seriesId", ""],
  ])("avviser %s = %j", (felt, verdi) => {
    expect(hendelseSkjema.safeParse({ ...hendelse(), [felt]: verdi }).success).toBe(false);
  });
});

describe("innstillingerSkjema", () => {
  const inn = () => fulltDokument().innstillinger;

  it.each<[string, unknown]>([
    ["modus", "mørkt"],
    ["tema", "rød"],
    ["sendAldriNotater", "false"],
    ["sendHendelsestitler", undefined],
  ])("avviser %s = %j", (felt, verdi) => {
    expect(innstillingerSkjema.safeParse({ ...inn(), [felt]: verdi }).success).toBe(false);
  });

  it("har ingen stille standardverdi for manglende tema", () => {
    const { tema: _tema, ...uten } = inn();
    void _tema;
    expect(innstillingerSkjema.safeParse(uten).success).toBe(false);
  });
});

describe("profilSkjema og samtykkeSkjema", () => {
  it("godtar null", () => {
    expect(profilSkjema.safeParse(null).success).toBe(true);
    expect(samtykkeSkjema.safeParse(null).success).toBe(true);
  });

  it.each<unknown>([{ fornavn: "" }, {}, { fornavn: "Kari", etternavn: "N" }])(
    "profil avviser %j",
    (verdi) => {
      expect(profilSkjema.safeParse(verdi).success).toBe(false);
    },
  );

  it.each<unknown>([
    { svar: "kanskje", tidspunkt: T, tekstversjon: 1 },
    { svar: "ja", tidspunkt: "nå", tekstversjon: 1 },
    { svar: "nei", tidspunkt: T, tekstversjon: "1" },
    { svar: "nei", tidspunkt: T, tekstversjon: 1.5 },
    { svar: "ja", tidspunkt: T },
  ])("samtykke avviser %j", (verdi) => {
    expect(samtykkeSkjema.safeParse(verdi).success).toBe(false);
  });
});

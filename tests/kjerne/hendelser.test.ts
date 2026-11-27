import { describe, expect, it } from "vitest";
import {
  dagensHendelser,
  erOver,
  type Hendelsesutkast,
  slutterNesteDag,
  validerHendelse,
  visTid,
} from "@/kjerne/hendelser";

const GYLDIG: Hendelsesutkast = {
  tittel: "Vakt",
  dato: "2026-11-03",
  start: "16:00",
  slutt: "21:00",
};

// Mandag 2026-11-02, tirsdag 2026-11-03 og onsdag 2026-11-04.
const MANDAG = "2026-11-02";
const TIRSDAG = "2026-11-03";
const ONSDAG = "2026-11-04";

function h(tittel: string, dato: string, start: string, slutt: string) {
  return { tittel, dato, start, slutt };
}

function tirsdag(t: number, m = 0): Date {
  return new Date(2026, 10, 3, t, m);
}

describe("validerHendelse", () => {
  it("godtar en gyldig hendelse", () => {
    expect(validerHendelse(GYLDIG)).toEqual({ gyldig: true });
  });

  it("godtar en hendelse over midnatt", () => {
    expect(
      validerHendelse({ ...GYLDIG, start: "21:00", slutt: "07:30" }),
    ).toEqual({ gyldig: true });
  });

  it("avviser lik start og slutt", () => {
    expect(
      validerHendelse({ ...GYLDIG, start: "10:00", slutt: "10:00" }),
    ).toEqual({ gyldig: false, feil: { slutt: "lik-start" } });
  });

  it("krever tittel og dato, og tittel med bare mellomrom er tom", () => {
    expect(validerHendelse({ ...GYLDIG, tittel: "  ", dato: "" })).toEqual({
      gyldig: false,
      feil: { tittel: "påkrevd", dato: "påkrevd" },
    });
  });

  it("krever start og slutt", () => {
    expect(validerHendelse({ ...GYLDIG, start: "", slutt: "" })).toEqual({
      gyldig: false,
      feil: { start: "påkrevd", slutt: "påkrevd" },
    });
  });

  it("avviser ugyldig dato og klokkeslett", () => {
    expect(
      validerHendelse({ ...GYLDIG, dato: "2026-02-30", start: "9:00" }),
    ).toEqual({ gyldig: false, feil: { dato: "ugyldig", start: "ugyldig" } });
  });

  it("gir ikke lik-start når et klokkeslett er ugyldig", () => {
    expect(
      validerHendelse({ ...GYLDIG, start: "25:00", slutt: "25:00" }),
    ).toEqual({ gyldig: false, feil: { start: "ugyldig", slutt: "ugyldig" } });
  });
});

describe("slutterNesteDag og visTid", () => {
  it("viser en vanlig hendelse uten (+1 dag)", () => {
    expect(slutterNesteDag(GYLDIG)).toBe(false);
    expect(visTid(GYLDIG)).toBe("16:00 – 21:00");
  });

  it("viser en nattevakt med (+1 dag)", () => {
    const natt = { start: "21:00", slutt: "07:30" };
    expect(slutterNesteDag(natt)).toBe(true);
    expect(visTid(natt)).toBe("21:00 – 07:30 (+1 dag)");
  });
});

describe("erOver", () => {
  const formiddag = h("Møte", TIRSDAG, "10:00", "12:00");

  it("er over når «nå» er lik slutten", () => {
    expect(erOver(formiddag, tirsdag(12))).toBe(true);
  });

  it("er ikke over ett minutt før", () => {
    expect(erOver(formiddag, tirsdag(11, 59))).toBe(false);
  });

  it("regner nattevakt over årsskiftet", () => {
    const nyttår = h("Vakt", "2026-12-31", "23:30", "00:30");
    expect(erOver(nyttår, new Date(2027, 0, 1, 0, 15))).toBe(false);
    expect(erOver(nyttår, new Date(2027, 0, 1, 0, 30))).toBe(true);
  });

  it("regner nattevakt over månedsskiftet", () => {
    const natt = h("Vakt", "2026-11-30", "21:00", "07:30");
    expect(erOver(natt, new Date(2026, 11, 1, 7, 29))).toBe(false);
    expect(erOver(natt, new Date(2026, 11, 1, 7, 30))).toBe(true);
  });

  it("regner nattevakt inn på skuddårsdagen", () => {
    const natt = h("Vakt", "2028-02-28", "21:00", "07:30");
    expect(erOver(natt, new Date(2028, 1, 29, 7, 29))).toBe(false);
    expect(erOver(natt, new Date(2028, 1, 29, 7, 30))).toBe(true);
  });

  it("regner nattevakt fra 28. februar i et vanlig år", () => {
    const natt = h("Vakt", "2027-02-28", "21:00", "07:30");
    expect(erOver(natt, new Date(2027, 2, 1, 7, 29))).toBe(false);
    expect(erOver(natt, new Date(2027, 2, 1, 7, 30))).toBe(true);
  });

  it("regner nattevakt over overgangen til vintertid", () => {
    const natt = h("Vakt", "2026-10-25", "21:00", "07:30");
    expect(erOver(natt, new Date(2026, 9, 26, 7, 29))).toBe(false);
    expect(erOver(natt, new Date(2026, 9, 26, 7, 30))).toBe(true);
  });

  it("regner hendelse som slutter kl. 00:00", () => {
    const kveld = h("Kveld", TIRSDAG, "22:00", "00:00");
    expect(visTid(kveld)).toBe("22:00 – 00:00 (+1 dag)");
    expect(erOver(kveld, tirsdag(23, 59))).toBe(false);
    expect(erOver(kveld, new Date(2026, 10, 4, 0, 0))).toBe(true);
  });
});

describe("dagensHendelser", () => {
  it("tar dagens hendelser sortert etter starttid", () => {
    const tolv = h("Tolv", TIRSDAG, "12:00", "13:00");
    const ni = h("Ni", TIRSDAG, "09:00", "10:00");
    const imorgen = h("I morgen", ONSDAG, "08:00", "09:00");
    expect(dagensHendelser([tolv, imorgen, ni], tirsdag(8))).toEqual([ni, tolv]);
  });

  it("tar ikke med en hendelse som slutter akkurat nå", () => {
    const møte = h("Møte", TIRSDAG, "10:00", "12:00");
    expect(dagensHendelser([møte], tirsdag(12))).toEqual([]);
  });

  it("tar med en hendelse ett minutt før slutt", () => {
    const møte = h("Møte", TIRSDAG, "10:00", "12:00");
    expect(dagensHendelser([møte], tirsdag(11, 59))).toEqual([møte]);
  });

  it("tar med en nattevakt som starter i dag", () => {
    const natt = h("Natt", TIRSDAG, "21:00", "07:30");
    expect(dagensHendelser([natt], tirsdag(22))).toEqual([natt]);
  });

  it("tar med en nattevakt fra i går først i lista", () => {
    const natt = h("Natt", MANDAG, "21:00", "07:30");
    const tidlig = h("Tidlig", TIRSDAG, "00:30", "03:00");
    expect(dagensHendelser([tidlig, natt], tirsdag(2))).toEqual([natt, tidlig]);
  });

  it("tar ikke med en nattevakt fra i går som er over", () => {
    const natt = h("Natt", MANDAG, "21:00", "07:30");
    expect(dagensHendelser([natt], tirsdag(7, 30))).toEqual([]);
  });

  it("tar ikke med en nattevakt fra i forgårs", () => {
    const natt = h("Natt", "2026-11-01", "21:00", "07:30");
    expect(dagensHendelser([natt], tirsdag(2))).toEqual([]);
  });

  it("tar med en nattevakt fra i går over overgangen til sommertid", () => {
    const natt = h("Natt", "2026-03-29", "21:00", "07:30");
    expect(dagensHendelser([natt], new Date(2026, 2, 30, 2, 0))).toEqual([natt]);
  });

  it("tar ikke med en vanlig hendelse fra i går", () => {
    const kveld = h("Kveld", MANDAG, "16:00", "21:00");
    expect(dagensHendelser([kveld], tirsdag(2))).toEqual([]);
  });

  it("tar med en nattevakt fra i går over månedsskiftet", () => {
    const natt = h("Natt", "2026-11-30", "21:00", "07:30");
    expect(dagensHendelser([natt], new Date(2026, 11, 1, 2, 0))).toEqual([natt]);
  });

  it("tar med en nattevakt fra i går over årsskiftet", () => {
    const natt = h("Natt", "2026-12-31", "23:30", "00:30");
    expect(dagensHendelser([natt], new Date(2027, 0, 1, 0, 15))).toEqual([natt]);
  });

  it("endrer ikke lista den får", () => {
    const tolv = h("Tolv", TIRSDAG, "12:00", "13:00");
    const ni = h("Ni", TIRSDAG, "09:00", "10:00");
    const liste = [tolv, ni];
    dagensHendelser(liste, tirsdag(8));
    expect(liste).toEqual([tolv, ni]);
  });
});

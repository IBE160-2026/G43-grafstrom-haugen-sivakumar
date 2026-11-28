import { describe, expect, it } from "vitest";
import { GJELDENDE_SAMTYKKEVERSJON, kanSendes, kiErPå } from "@/kjerne/samtykke";
import { GJELDENDE_SAMTYKKEVERSJON as FRA_TEKSTER } from "@/kjerne/tekster";
import type { Dokument } from "@/kjerne/skjema";
import { T, fulltDokument } from "./fikstur";

const G = GJELDENDE_SAMTYKKEVERSJON;

function medSamtykke(samtykke: Dokument["samtykke"]): Dokument {
  return { ...fulltDokument(), samtykke };
}

const ulåst = { skjultForKi: false };
const låst = { skjultForKi: true };

const kiAv: [string, Dokument][] = [
  ["nei", medSamtykke({ svar: "nei", tidspunkt: T, tekstversjon: G })],
  ["ikke svart", medSamtykke(null)],
  ["gammel tekstversjon", medSamtykke({ svar: "ja", tidspunkt: T, tekstversjon: G - 1 })],
  ["ukjent nyere versjon", medSamtykke({ svar: "ja", tidspunkt: T, tekstversjon: G + 1 })],
];

describe("GJELDENDE_SAMTYKKEVERSJON", () => {
  it("er samme verdi som i kjerne/tekster", () => {
    expect(GJELDENDE_SAMTYKKEVERSJON).toBe(FRA_TEKSTER);
  });
});

describe("kiErPå", () => {
  it("sann ved ja og gjeldende versjon", () => {
    expect(kiErPå(medSamtykke({ svar: "ja", tidspunkt: T, tekstversjon: G }))).toBe(true);
  });

  it("usann ved nei", () => {
    expect(kiErPå(medSamtykke({ svar: "nei", tidspunkt: T, tekstversjon: G }))).toBe(false);
  });

  it("usann når hun ikke har svart", () => {
    expect(kiErPå(medSamtykke(null))).toBe(false);
  });

  it("usann ved gammel tekstversjon", () => {
    expect(kiErPå(medSamtykke({ svar: "ja", tidspunkt: T, tekstversjon: G - 1 }))).toBe(false);
  });

  it("usann ved ukjent nyere versjon", () => {
    expect(kiErPå(medSamtykke({ svar: "ja", tidspunkt: T, tekstversjon: G + 1 }))).toBe(false);
  });

  it("godtar bare samtykkefeltet", () => {
    expect(kiErPå({ samtykke: { svar: "ja", tidspunkt: T, tekstversjon: G } })).toBe(true);
  });
});

describe("kanSendes", () => {
  const på = medSamtykke({ svar: "ja", tidspunkt: T, tekstversjon: G });

  it("sann for ulåst oppgave når KI er på", () => {
    expect(kanSendes(ulåst, på)).toBe(true);
    expect(kanSendes(på.oppgaver[0], på)).toBe(true);
  });

  it("usann for 🔒 når KI er på", () => {
    expect(kanSendes(låst, på)).toBe(false);
  });

  it.each(kiAv)("usann når KI er av (%s), med og uten 🔒", (_navn, dokument) => {
    expect(kanSendes(ulåst, dokument)).toBe(false);
    expect(kanSendes(låst, dokument)).toBe(false);
  });
});

describe("renhet", () => {
  it("endrer ikke argumentene", () => {
    const dokument = fulltDokument();
    const kopi = structuredClone(dokument);
    Object.freeze(dokument);
    Object.freeze(dokument.samtykke);
    const oppgave = Object.freeze(dokument.oppgaver[0]);

    kiErPå(dokument);
    kanSendes(oppgave, dokument);

    expect(dokument).toEqual(kopi);
  });
});

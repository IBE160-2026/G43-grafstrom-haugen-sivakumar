import { describe, expect, it } from "vitest";
import { z } from "zod";
import { MIGRERINGER, migrer, type Migreringstrinn } from "@/kjerne/migrering";
import { dokumentSkjema, nyttDokument, type Dokument } from "@/kjerne/skjema";
import { fulltDokument } from "./fikstur";

function medEndring(endre: (dok: Record<string, unknown>) => void): string {
  const dok = JSON.parse(JSON.stringify(fulltDokument())) as Record<string, unknown>;
  endre(dok);
  return JSON.stringify(dok);
}

describe("migrer", () => {
  it("tomt lager gir nytt dokument som skal skrives", () => {
    expect(migrer(null)).toEqual({ type: "ok", dokument: nyttDokument(), endret: true });
  });

  it("gyldig v1 gis tilbake uendret", () => {
    const dok = fulltDokument();
    expect(migrer(JSON.stringify(dok))).toEqual({ type: "ok", dokument: dok, endret: false });
  });

  it("gyldig nytt dokument i v1 gis tilbake uendret", () => {
    expect(migrer(JSON.stringify(nyttDokument()))).toEqual({
      type: "ok",
      dokument: nyttDokument(),
      endret: false,
    });
  });

  it.each([2, 99])("høyere versjon %i gir for-ny med rådata", (versjon) => {
    const rå = medEndring((d) => {
      d.schemaVersion = versjon;
    });
    expect(migrer(rå)).toEqual({ type: "for-ny", rå });
  });

  it("for-ny selv om resten av dokumentet har en ukjent form", () => {
    const rå = JSON.stringify({ schemaVersion: 2, nyttFelt: [] });
    expect(migrer(rå)).toEqual({ type: "for-ny", rå });
  });

  it.each(["{ikke json", "", "   ", "null", "[]", "42", '"tekst"', "true"])(
    "ødelagt eller ikke-objekt %j gir ugyldig",
    (rå) => {
      expect(migrer(rå)).toEqual({ type: "ugyldig", rå });
    },
  );

  it("feil verdi (prioritet Kjempehøy) gir ugyldig", () => {
    const rå = medEndring((d) => {
      (d.oppgaver as Record<string, unknown>[])[0].prioritet = "Kjempehøy";
    });
    expect(migrer(rå)).toEqual({ type: "ugyldig", rå });
  });

  it("ukjent nøkkel gir ugyldig", () => {
    const rå = medEndring((d) => {
      (d.oppgaver as Record<string, unknown>[])[0].ukjent = true;
    });
    expect(migrer(rå)).toEqual({ type: "ugyldig", rå });
  });

  it("manglende schemaVersion gir ugyldig", () => {
    const rå = medEndring((d) => {
      delete d.schemaVersion;
    });
    expect(migrer(rå)).toEqual({ type: "ugyldig", rå });
  });

  it.each<unknown>([0, -1, 1.5, "1", null, true, "constructor"])(
    "rar versjon %j gir ugyldig",
    (versjon) => {
      const rå = medEndring((d) => {
        d.schemaVersion = versjon;
      });
      expect(migrer(rå)).toEqual({ type: "ugyldig", rå });
    },
  );

  it("uendelig versjon (1e400) gir ugyldig", () => {
    const rå = '{"schemaVersion":1e400}';
    expect(migrer(rå)).toEqual({ type: "ugyldig", rå });
  });

  it("manglende innstillinger.tema gir ugyldig, ingen stille standardverdi", () => {
    const rå = medEndring((d) => {
      delete (d.innstillinger as Record<string, unknown>).tema;
    });
    expect(migrer(rå)).toEqual({ type: "ugyldig", rå });
  });

  it("manglende samling gir ugyldig", () => {
    const rå = medEndring((d) => {
      delete d.hendelser;
    });
    expect(migrer(rå)).toEqual({ type: "ugyldig", rå });
  });

  it("migreringstabellen er tom i versjon 1", () => {
    expect(Object.keys(MIGRERINGER)).toEqual([]);
  });
});

describe("migrer med falsk migreringskjede (v1 → v3)", () => {
  const skjemaV3 = dokumentSkjema.extend({
    schemaVersion: z.literal(3),
  }) as unknown as z.ZodType<Dokument>;
  const tilV2: Migreringstrinn = (d) => ({ ...d, schemaVersion: 2, økter: [] });
  const tilV3: Migreringstrinn = (d) => ({ ...d, schemaVersion: 3 });
  const kjede = { 1: tilV2, 2: tilV3 };
  const rå = JSON.stringify(fulltDokument());

  it("migrerer et eldre dokument og gir ok med endret: true", () => {
    expect(migrer(rå, { migreringer: kjede, gjeldende: 3, skjema: skjemaV3 })).toEqual({
      type: "ok",
      dokument: { ...fulltDokument(), schemaVersion: 3, økter: [] },
      endret: true,
    });
  });

  it("dokument i gjeldende versjon gir endret: false", () => {
    const råV3 = JSON.stringify({ ...fulltDokument(), schemaVersion: 3 });
    expect(migrer(råV3, { migreringer: kjede, gjeldende: 3, skjema: skjemaV3 })).toEqual({
      type: "ok",
      dokument: { ...fulltDokument(), schemaVersion: 3 },
      endret: false,
    });
  });

  it("manglende trinn gir ugyldig", () => {
    expect(migrer(rå, { migreringer: { 1: tilV2 }, gjeldende: 3, skjema: skjemaV3 })).toEqual({
      type: "ugyldig",
      rå,
    });
  });

  it("arvet trinn (ikke eget felt) regnes som manglende", () => {
    const arvet = Object.create({ 1: tilV2, 2: tilV3 }) as Record<number, Migreringstrinn>;
    expect(migrer(rå, { migreringer: arvet, gjeldende: 3, skjema: skjemaV3 })).toEqual({
      type: "ugyldig",
      rå,
    });
  });

  it("trinn som kaster gir ugyldig", () => {
    const kaster: Migreringstrinn = () => {
      throw new Error("feil");
    };
    expect(
      migrer(rå, { migreringer: { 1: tilV2, 2: kaster }, gjeldende: 3, skjema: skjemaV3 }),
    ).toEqual({ type: "ugyldig", rå });
  });

  it("trinn som gir feil schemaVersion gir ugyldig", () => {
    const hopper: Migreringstrinn = (d) => ({ ...d, schemaVersion: 3 });
    expect(
      migrer(rå, { migreringer: { 1: hopper, 2: tilV3 }, gjeldende: 3, skjema: skjemaV3 }),
    ).toEqual({ type: "ugyldig", rå });
  });

  it("migrert dokument som ikke validerer gir ugyldig", () => {
    const ødelegger: Migreringstrinn = (d) => ({ ...d, schemaVersion: 3, ekstra: 1 });
    expect(
      migrer(rå, { migreringer: { 1: tilV2, 2: ødelegger }, gjeldende: 3, skjema: skjemaV3 }),
    ).toEqual({ type: "ugyldig", rå });
  });
});

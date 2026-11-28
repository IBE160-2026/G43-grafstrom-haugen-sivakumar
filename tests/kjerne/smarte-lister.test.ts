import { describe, expect, it } from "vitest";
import type { Oppgave } from "@/kjerne/skjema";
import {
  LISTER,
  fristMerkelapp,
  listeFor,
  sammenlignOppgaver,
  smarteLister,
} from "@/kjerne/smarte-lister";
import testsett from "../ki-testsett/testsett.json";

function oppgave(felt: Partial<Oppgave> & { id: string }): Oppgave {
  return {
    tekst: `Oppgave ${felt.id}`,
    frist: null,
    prosjekt: null,
    etikett: null,
    prioritet: "Middels",
    sammendrag: null,
    notater: null,
    skjultForKi: false,
    createdAt: "2026-11-01T10:00:00.000Z",
    fullført: null,
    forslag: null,
    ventendeKall: null,
    ...felt,
  };
}

/** Lokal tid (TZ er låst til Europe/Oslo i vitest.config.mts). */
function lokal(dato: string, timer = 12, minutter = 0): Date {
  const [år, måned, dag] = dato.split("-").map(Number);
  return new Date(år, måned - 1, dag, timer, minutter);
}

describe("testsettet", () => {
  it("referansedatoen er en mandag", () => {
    expect(testsett.referansedato).toBe("2026-11-02");
    expect(new Date(2026, 10, 2, 12).getDay()).toBe(1);
  });

  it("gir forventet tidsrom for 20 av 20", () => {
    const nå = new Date(2026, 10, 2, 12);
    expect(testsett.oppgaver).toHaveLength(20);
    const treff = testsett.oppgaver.filter(
      (o) => listeFor(o.forfallsdato, nå) === o.forventet.tidsrom,
    );
    expect(treff).toHaveLength(20);
  });
});

describe("listeFor", () => {
  it("grenser sett fra en onsdag", () => {
    const nå = lokal("2026-11-04");
    expect(listeFor("2026-11-03", nå)).toBe("Forfalt");
    expect(listeFor("2026-11-04", nå)).toBe("I dag");
    expect(listeFor("2026-11-05", nå)).toBe("Denne uken");
    expect(listeFor("2026-11-08", nå)).toBe("Denne uken");
    expect(listeFor("2026-11-09", nå)).toBe("Senere");
    expect(listeFor(null, nå)).toBe("Ingen frist");
  });

  it("på søndag er mandagen etter Senere, og Denne uken er tom", () => {
    const nå = lokal("2026-11-08");
    expect(listeFor("2026-11-09", nå)).toBe("Senere");
    expect(fristMerkelapp("2026-11-09", nå)).toBe("i morgen");
    const lister = smarteLister({ oppgaver: [oppgave({ id: "a", frist: "2026-11-09" })] }, nå);
    expect(lister.find((l) => l.liste === "Denne uken")!.antall).toBe(0);
    expect(lister.find((l) => l.liste === "Senere")!.antall).toBe(1);
  });

  it("bruker lokal dato like før og etter midnatt", () => {
    expect(listeFor("2026-11-03", lokal("2026-11-02", 23, 59))).toBe("Denne uken");
    expect(listeFor("2026-11-03", lokal("2026-11-03", 0, 1))).toBe("I dag");
  });

  for (const skifte of ["2026-10-25", "2027-03-28"]) {
    it(`sommertidsskiftet ${skifte} gir riktig dag begge veier`, () => {
      for (const [timer, minutter] of [
        [0, 30],
        [3, 30],
        [23, 30],
      ]) {
        const nå = lokal(skifte, timer, minutter);
        // Skiftet er en søndag.
        expect(listeFor(skifte, nå)).toBe("I dag");
        const dagFør = lokalDatoPluss(skifte, -1);
        const dagEtter = lokalDatoPluss(skifte, 1);
        expect(listeFor(dagFør, nå)).toBe("Forfalt");
        expect(fristMerkelapp(dagFør, nå)).toBe("i går");
        expect(listeFor(dagEtter, nå)).toBe("Senere");
        expect(fristMerkelapp(dagEtter, nå)).toBe("i morgen");
      }
      // Fra lørdagen før og mandagen etter.
      expect(listeFor(skifte, lokal(lokalDatoPluss(skifte, -1), 23, 59))).toBe("Denne uken");
      expect(fristMerkelapp(skifte, lokal(lokalDatoPluss(skifte, -1), 23, 59))).toBe("i morgen");
      expect(listeFor(skifte, lokal(lokalDatoPluss(skifte, 1), 0, 1))).toBe("Forfalt");
    });
  }

  it("årsskiftet sett fra tirsdag 2026-12-29", () => {
    const nå = lokal("2026-12-29");
    expect(listeFor("2027-01-03", nå)).toBe("Denne uken");
    expect(fristMerkelapp("2027-01-03", nå)).toBe("søndag");
    expect(listeFor("2027-01-04", nå)).toBe("Senere");
    expect(fristMerkelapp("2027-01-04", nå)).toBe("4. jan 2027");
  });
});

/** Dato `dager` etter `dato`, regnet med lokal kalender. */
function lokalDatoPluss(dato: string, dager: number): string {
  const d = lokal(dato);
  d.setDate(d.getDate() + dager);
  const tosifret = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${tosifret(d.getMonth() + 1)}-${tosifret(d.getDate())}`;
}

describe("rekkefølge", () => {
  it("frist, så Høy → Middels → Lav, så eldste først", () => {
    const oppgaver = [
      oppgave({ id: "lav", frist: "2026-11-05", prioritet: "Lav" }),
      oppgave({ id: "middels-ny", frist: "2026-11-05", createdAt: "2026-11-03T10:00:00.000Z" }),
      oppgave({ id: "middels-gammel", frist: "2026-11-05", createdAt: "2026-11-01T10:00:00Z" }),
      oppgave({ id: "høy", frist: "2026-11-05", prioritet: "Høy" }),
      oppgave({ id: "tidlig", frist: "2026-11-04", prioritet: "Lav" }),
      oppgave({ id: "uten", frist: null, prioritet: "Høy" }),
    ];
    expect([...oppgaver].sort(sammenlignOppgaver).map((o) => o.id)).toEqual([
      "tidlig",
      "høy",
      "middels-gammel",
      "middels-ny",
      "lav",
      "uten",
    ]);
  });

  it("id skiller når frist, prioritet og createdAt er like", () => {
    const oppgaver = [
      oppgave({ id: "c", frist: "2026-11-05" }),
      oppgave({ id: "b", frist: "2026-11-05" }),
      oppgave({ id: "a", frist: "2026-11-05" }),
    ];
    expect([...oppgaver].sort(sammenlignOppgaver).map((o) => o.id)).toEqual(["a", "b", "c"]);
  });

  it("createdAt sammenlignes som tid, ikke som streng", () => {
    // Som strenger kommer «.500Z» først, men «10:00:00Z» er eldst.
    const oppgaver = [
      oppgave({ id: "a", frist: "2026-11-05", createdAt: "2026-11-01T10:00:00.500Z" }),
      oppgave({ id: "b", frist: "2026-11-05", createdAt: "2026-11-01T10:00:00Z" }),
    ];
    expect([...oppgaver].sort(sammenlignOppgaver).map((o) => o.id)).toEqual(["b", "a"]);
  });

  it("Ingen frist sorteres på prioritet og createdAt", () => {
    const nå = lokal("2026-11-04");
    const lister = smarteLister(
      {
        oppgaver: [
          oppgave({ id: "c", prioritet: "Lav" }),
          oppgave({ id: "b", createdAt: "2026-11-02T10:00:00.000Z" }),
          oppgave({ id: "a", createdAt: "2026-11-01T10:00:00.000Z" }),
        ],
      },
      nå,
    );
    const ingen = lister.find((l) => l.liste === "Ingen frist")!;
    expect(ingen.elementer.map((e) => e.oppgave.id)).toEqual(["a", "b", "c"]);
  });
});

describe("smarteLister", () => {
  it("gir alle fem i fast rekkefølge, også tomme", () => {
    const lister = smarteLister({ oppgaver: [] }, lokal("2026-11-04"));
    expect(lister.map((l) => l.liste)).toEqual([...LISTER]);
    expect(lister.map((l) => l.antall)).toEqual([0, 0, 0, 0, 0]);
  });

  it("utelater fullførte og legger hver aktiv oppgave i nøyaktig én liste", () => {
    const nå = lokal("2026-11-04");
    const oppgaver = [
      oppgave({ id: "ferdig", frist: "2026-11-04", fullført: "2026-11-04T08:00:00.000Z" }),
      oppgave({ id: "f", frist: "2026-11-01" }),
      oppgave({ id: "d", frist: "2026-11-04" }),
      oppgave({ id: "u", frist: "2026-11-06" }),
      oppgave({ id: "s", frist: "2026-12-01" }),
      oppgave({ id: "i", frist: null }),
    ];
    const lister = smarteLister({ oppgaver }, nå);
    expect(lister.map((l) => l.elementer.map((e) => e.oppgave.id))).toEqual([
      ["f"],
      ["d"],
      ["u"],
      ["s"],
      ["i"],
    ]);
    expect(lister.every((l) => l.elementer.every((e) => e.type === "oppgave"))).toBe(true);
    expect(lister.reduce((sum, l) => sum + l.antall, 0)).toBe(5);
  });

  it("endrer ikke rekkefølgen i dokumentet", () => {
    const oppgaver = [oppgave({ id: "b", prioritet: "Lav" }), oppgave({ id: "a", prioritet: "Høy" })];
    smarteLister({ oppgaver }, lokal("2026-11-04"));
    expect(oppgaver.map((o) => o.id)).toEqual(["b", "a"]);
  });
});

describe("fristMerkelapp", () => {
  const onsdag = lokal("2026-11-04");

  it("relative ord og ukedager", () => {
    expect(fristMerkelapp("2026-11-03", onsdag)).toBe("i går");
    expect(fristMerkelapp("2026-11-04", onsdag)).toBeNull();
    expect(fristMerkelapp("2026-11-05", onsdag)).toBe("i morgen");
    expect(fristMerkelapp("2026-11-06", onsdag)).toBe("fredag");
    expect(fristMerkelapp("2026-11-07", onsdag)).toBe("lørdag");
    expect(fristMerkelapp("2026-11-08", onsdag)).toBe("søndag");
    expect(fristMerkelapp(null, onsdag)).toBeNull();
  });

  it("dato for eldre forfalte og resten av Senere", () => {
    expect(fristMerkelapp("2026-11-02", onsdag)).toBe("2. nov");
    expect(fristMerkelapp("2026-11-09", onsdag)).toBe("9. nov");
    expect(fristMerkelapp("2026-11-18", onsdag)).toBe("18. nov");
    expect(fristMerkelapp("2025-12-24", onsdag)).toBe("24. des 2025");
  });

  it("faste månedsforkortelser", () => {
    const måneder = ["jan", "feb", "mars", "apr", "mai", "juni", "juli", "aug", "sep", "okt", "nov", "des"];
    const nå = lokal("2026-01-01");
    måneder.forEach((navn, i) => {
      const dato = `2026-${String(i + 1).padStart(2, "0")}-15`;
      expect(fristMerkelapp(dato, nå)).toBe(`15. ${navn}`);
    });
  });
});

describe("kjerneregler (AD-1)", () => {
  it("smarte-lister.ts bruker ingen klokke, nettleser eller fremmede imports", async () => {
    const { readFile } = await import("node:fs/promises");
    const kilde = await readFile(new URL("../../kjerne/smarte-lister.ts", import.meta.url), "utf8");
    expect(kilde).not.toMatch(/Date\.now/);
    expect(kilde).not.toMatch(/new Date\(\s*\)/);
    expect(kilde).not.toMatch(/\bwindow\b/);
    expect(kilde).not.toMatch(/\bIntl\b/);
    const imports = [...kilde.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]);
    for (const sti of imports) expect(sti).toMatch(/^(\.\/|@\/kjerne\/|zod$)/);
  });
});

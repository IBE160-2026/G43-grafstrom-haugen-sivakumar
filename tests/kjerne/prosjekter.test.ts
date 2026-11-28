import { describe, expect, it } from "vitest";
import { antallMedProsjekt, erFastEtikett, prosjektnavn } from "@/kjerne/prosjekter";
import type { Oppgave } from "@/kjerne/skjema";
import { T } from "./fikstur";

function oppgave(id: string, prosjekt: string | null, fullført: string | null = null): Oppgave {
  return {
    id,
    tekst: `Oppgave ${id}`,
    frist: null,
    prosjekt,
    etikett: null,
    prioritet: "Middels",
    sammendrag: null,
    notater: null,
    skjultForKi: false,
    createdAt: T,
    fullført,
    forslag: null,
    ventendeKall: null,
  };
}

describe("prosjektnavn", () => {
  it("tom liste uten oppgaver eller uten prosjekter", () => {
    expect(prosjektnavn([])).toEqual([]);
    expect(prosjektnavn([oppgave("a", null)])).toEqual([]);
  });

  it("gir hvert navn én gang, også fra fullførte oppgaver", () => {
    expect(
      prosjektnavn([oppgave("a", "IBE160"), oppgave("b", "IBE160"), oppgave("c", "Jobbsøknad", T)]),
    ).toEqual(["IBE160", "Jobbsøknad"]);
  });

  it("sorterer på norsk med æ, ø og å sist", () => {
    expect(
      prosjektnavn([
        oppgave("a", "Åpen dag"),
        oppgave("b", "Øving"),
        oppgave("c", "Ærend"),
        oppgave("d", "zumba"),
        oppgave("e", "bachelor"),
      ]),
    ).toEqual(["bachelor", "zumba", "Ærend", "Øving", "Åpen dag"]);
  });

  it("utelater de faste etikettene Skole, Jobb og Privat", () => {
    expect(
      prosjektnavn([oppgave("a", "Skole"), oppgave("b", "Jobb"), oppgave("c", "Privat"), oppgave("d", "IBE160")]),
    ).toEqual(["IBE160"]);
  });

  it("skiller på store og små bokstaver", () => {
    expect(prosjektnavn([oppgave("a", "ibe160"), oppgave("b", "IBE160")])).toHaveLength(2);
  });
});

describe("antallMedProsjekt", () => {
  it("teller bare oppgaver med akkurat det navnet", () => {
    const oppgaver = [oppgave("a", "IBE160"), oppgave("b", "IBE160", T), oppgave("c", "ibe160"), oppgave("d", null)];
    expect(antallMedProsjekt(oppgaver, "IBE160")).toBe(2);
    expect(antallMedProsjekt(oppgaver, "Finnes ikke")).toBe(0);
  });
});

describe("erFastEtikett", () => {
  it("gjelder bare Skole, Jobb og Privat, nøyaktig skrevet", () => {
    expect(["Skole", "Jobb", "Privat"].every(erFastEtikett)).toBe(true);
    expect(erFastEtikett("skole")).toBe(false);
    expect(erFastEtikett("IBE160")).toBe(false);
  });
});

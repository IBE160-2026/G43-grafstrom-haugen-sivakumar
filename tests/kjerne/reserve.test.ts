import { describe, expect, it } from "vitest";
import {
  type Feltnavn,
  type Kall,
  nøkkelordforslag,
  RESERVETABELL,
  reserve,
  ÅRSAKER,
} from "@/kjerne/reserve";
import { oppgaveForslagSkjema } from "@/kjerne/skjema";
import testsett from "../ki-testsett/testsett.json";

const TREFFTEKST = "Levere oblig i IBE160 i kveld";
const ALLE_FELT: Feltnavn[] = ["etikett", "prioritet", "sammendrag"];

function forslagskall(felt: Feltnavn[], økter = false): Kall {
  return { type: "forslag", ønsker: { felt, økter } };
}

describe("nøkkelordforslag", () => {
  it("foreslår etikett og prioritet ved treff", () => {
    expect(nøkkelordforslag(TREFFTEKST)).toEqual({
      etikett: { verdi: "Skole", kilde: "regelbasert" },
      prioritet: { verdi: "Høy", kilde: "regelbasert" },
    });
  });

  it("gir ingen etikett og Middels uten treff", () => {
    expect(nøkkelordforslag("Ting jeg må huske")).toEqual({
      prioritet: { verdi: "Middels", kilde: "regelbasert" },
    });
  });

  it("gir ingen etikett ved uavgjort", () => {
    // «jobb» (Jobb) og «middag» (Privat): ett treff hver.
    expect(nøkkelordforslag("Middag med jobben").etikett).toBeUndefined();
  });

  it("lar etiketten med flest treff vinne", () => {
    expect(
      nøkkelordforslag("Middag med jobben etter vakt").etikett?.verdi,
    ).toBe("Jobb");
  });

  it("treffer bøyde ord og ser bort fra store bokstaver", () => {
    expect(nøkkelordforslag("EKSAMENSLESING").etikett?.verdi).toBe("Skole");
    expect(nøkkelordforslag("Betale Husleia").etikett?.verdi).toBe("Privat");
    expect(nøkkelordforslag("Ringe Fastlegen").etikett?.verdi).toBe("Privat");
    expect(nøkkelordforslag("Vakter på Jobben").etikett?.verdi).toBe("Jobb");
  });

  it("treffer bare når ordet starter med nøkkelordet", () => {
    // «gave» står inne i «oppgave», ikke i starten.
    expect(nøkkelordforslag("Oppgave").etikett).toBeUndefined();
  });

  it("teller emnekoder som Skole", () => {
    expect(nøkkelordforslag("Lese til mat100").etikett?.verdi).toBe("Skole");
  });

  it("treffer uttrykk med flere ord", () => {
    expect(nøkkelordforslag("Gjøre det I DAG").prioritet.verdi).toBe("Høy");
    expect(nøkkelordforslag("Gjøre det idag").prioritet.verdi).toBe("Middels");
    expect(nøkkelordforslag("Lese når jeg har tid").prioritet.verdi).toBe(
      "Lav",
    );
    expect(nøkkelordforslag("Rydde etter hvert").prioritet.verdi).toBe("Lav");
  });

  it("krever hele ord i uttrykk med flere ord", () => {
    expect(
      nøkkelordforslag("Handle i dagligvarebutikken").prioritet.verdi,
    ).not.toBe("Høy");
  });

  it("treffer også tekst med dekomponerte tegn (NFD)", () => {
    expect(nøkkelordforslag("Søke studielån".normalize("NFD")).etikett?.verdi).toBe(
      "Privat",
    );
    expect(
      nøkkelordforslag("Lese når jeg har tid".normalize("NFD")).prioritet.verdi,
    ).toBe("Lav");
  });

  it("gir ingen etikett og Middels for tom tekst", () => {
    for (const tekst of ["", "   \n\t "]) {
      expect(nøkkelordforslag(tekst)).toEqual({
        prioritet: { verdi: "Middels", kilde: "regelbasert" },
      });
    }
  });

  it("lar Høy vinne over Lav", () => {
    expect(nøkkelordforslag("Kanskje viktig").prioritet.verdi).toBe("Høy");
  });

  it("gir samme svar hver gang for samme tekst", () => {
    const første = nøkkelordforslag(TREFFTEKST);
    for (let i = 0; i < 5; i++) {
      expect(nøkkelordforslag(TREFFTEKST)).toEqual(første);
    }
  });

  it("passer formen til oppgave.forslag.felt", () => {
    expect(
      oppgaveForslagSkjema.safeParse({
        felt: nøkkelordforslag(TREFFTEKST),
        økter: [],
      }).success,
    ).toBe(true);
  });
});

describe("reserve", () => {
  it.each(ÅRSAKER)(
    "forslag med årsak %s gir etikett og prioritet når de er ønsket",
    (årsak) => {
      expect(
        reserve(forslagskall(ALLE_FELT), { type: "reserve", årsak }, TREFFTEKST),
      ).toEqual({
        etikett: { verdi: "Skole", kilde: "regelbasert" },
        prioritet: { verdi: "Høy", kilde: "regelbasert" },
      });
    },
  );

  it.each(ÅRSAKER)("forslag med årsak %s gir bare ønskede felt", (årsak) => {
    expect(
      reserve(forslagskall(["prioritet"]), { type: "reserve", årsak }, TREFFTEKST),
    ).toEqual({ prioritet: { verdi: "Høy", kilde: "regelbasert" } });
    expect(
      reserve(forslagskall(["etikett"]), { type: "reserve", årsak }, TREFFTEKST),
    ).toEqual({ etikett: { verdi: "Skole", kilde: "regelbasert" } });
  });

  it("gir bare prioritet ved tidsavbrudd når bare prioritet er ønsket", () => {
    expect(
      reserve(
        forslagskall(["prioritet"]),
        { type: "reserve", årsak: "tidsavbrudd" },
        TREFFTEKST,
      ),
    ).toEqual({ prioritet: { verdi: "Høy", kilde: "regelbasert" } });
  });

  it.each(ÅRSAKER)("kall med bare økter og årsak %s gir ingenting", (årsak) => {
    expect(
      reserve(forslagskall([], true), { type: "reserve", årsak }, TREFFTEKST),
    ).toEqual({});
  });

  it.each(ÅRSAKER)("nyTid med årsak %s gir ingenting", (årsak) => {
    expect(
      reserve({ type: "nyTid" }, { type: "reserve", årsak }, TREFFTEKST),
    ).toEqual({});
  });

  it("nyTid med ok-svar og forkastede felt gir ingenting", () => {
    expect(
      reserve(
        { type: "nyTid" },
        { type: "ok", forkastet: ALLE_FELT },
        TREFFTEKST,
      ),
    ).toEqual({});
  });

  it("ok-svar gir bare forkastede felt", () => {
    expect(
      reserve(
        forslagskall(ALLE_FELT),
        { type: "ok", forkastet: ["etikett"] },
        TREFFTEKST,
      ),
    ).toEqual({ etikett: { verdi: "Skole", kilde: "regelbasert" } });
    expect(
      reserve(
        forslagskall(ALLE_FELT),
        { type: "ok", forkastet: ["prioritet"] },
        TREFFTEKST,
      ),
    ).toEqual({ prioritet: { verdi: "Høy", kilde: "regelbasert" } });
    expect(
      reserve(forslagskall(ALLE_FELT), { type: "ok", forkastet: [] }, TREFFTEKST),
    ).toEqual({});
  });

  it("ok-svar med forkastet etikett gir ingenting uten treff", () => {
    expect(
      reserve(
        forslagskall(ALLE_FELT),
        { type: "ok", forkastet: ["etikett"] },
        "Ting jeg må huske",
      ),
    ).toEqual({});
  });

  it("foreslår aldri sammendrag", () => {
    for (const årsak of ÅRSAKER) {
      expect(
        reserve(
          forslagskall(["sammendrag"]),
          { type: "reserve", årsak },
          TREFFTEKST,
        ),
      ).toEqual({});
    }
    expect(
      reserve(
        forslagskall(ALLE_FELT),
        { type: "ok", forkastet: ["sammendrag"] },
        TREFFTEKST,
      ),
    ).toEqual({});
  });

  it("gir ingen etikett uten treff, men prioritet Middels", () => {
    expect(
      reserve(
        forslagskall(ALLE_FELT),
        { type: "reserve", årsak: "ingen-nokkel" },
        "Ting jeg må huske",
      ),
    ).toEqual({ prioritet: { verdi: "Middels", kilde: "regelbasert" } });
  });

  it("tabellen dekker alle årsaker og forkastet for begge kalltyper", () => {
    for (const kalltype of ["forslag", "nyTid"] as const) {
      expect(Object.keys(RESERVETABELL[kalltype]).sort()).toEqual(
        [...ÅRSAKER, "forkastet"].sort(),
      );
    }
  });
});

describe("KI-testsettet", () => {
  it("måler reglene mot de 20 testtekstene", () => {
    let etiketter = 0;
    let prioriteter = 0;
    for (const oppgave of testsett.oppgaver) {
      const forslag = nøkkelordforslag(oppgave.tekst);
      const etikett = forslag.etikett?.verdi ?? null;
      if (etikett === oppgave.forventet.etikett) etiketter++;
      else {
        console.log(
          `Bom etikett ${oppgave.id} «${oppgave.tekst}»: forventet ${oppgave.forventet.etikett}, fikk ${etikett ?? "ingen"}`,
        );
      }
      if (forslag.prioritet.verdi === oppgave.forventet.prioritet) prioriteter++;
      else {
        console.log(
          `Bom prioritet ${oppgave.id} «${oppgave.tekst}»: forventet ${oppgave.forventet.prioritet}, fikk ${forslag.prioritet.verdi}`,
        );
      }
    }
    console.log(
      `Reserveløsningen: ${etiketter} av ${testsett.oppgaver.length} riktige etiketter, ${prioriteter} av ${testsett.oppgaver.length} riktige prioriteringer`,
    );
    expect(testsett.oppgaver).toHaveLength(20);
    // Samme tall som i tests/ki-testsett/README.md. Oppdater begge sammen.
    expect(etiketter).toBe(19);
    expect(prioriteter).toBe(15);
  });
});

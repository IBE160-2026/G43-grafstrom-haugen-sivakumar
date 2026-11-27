import { describe, expect, it } from "vitest";
import {
  kontrollerØktforslag,
  MAKS_ØKTER,
  sjekkØktforslag,
  type Øktkontekst,
} from "@/kjerne/okter";
import bryterFr49 from "../ki-testsett/mock/okter-bryter-fr49.json";
import gyldigMock from "../ki-testsett/mock/okter-gyldig.json";
import planleggingscaser from "../ki-testsett/planleggingscaser.json";

// Mandag 2026-11-02 til søndag 2026-11-08, som i planleggingscasene.
const MANDAG = "2026-11-02";
const TIRSDAG = "2026-11-03";
const ONSDAG = "2026-11-04";
const FREDAG = "2026-11-06";

type Case = (typeof planleggingscaser.caser)[number];

/** `"YYYY-MM-DDTHH:mm"` i lokal tid → `Date`. */
function tilDate(nå: string): Date {
  const [dato, tid] = nå.split("T");
  const [år, måned, dag] = dato.split("-").map(Number);
  const [t, m] = tid.split(":").map(Number);
  return new Date(år, måned - 1, dag, t, m);
}

function kase(id: number): Case {
  const c = planleggingscaser.caser.find((x) => x.id === id);
  if (!c) throw new Error(`Fant ikke case ${id}`);
  return c;
}

function kontekstFra(c: Case): Øktkontekst {
  return {
    hendelser: c.hendelser,
    godtatteØkter: c.godtatteØkter,
    frist: c.oppgave.frist,
    nå: tilDate(c.nå),
  };
}

/** Tom uke: «nå» mandag 08:00, frist fredag, ingen hendelser eller økter. */
const TOM: Øktkontekst = {
  hendelser: [],
  godtatteØkter: [],
  frist: FREDAG,
  nå: new Date(2026, 10, 2, 8, 0),
};

function ø(dato: string, start: string, slutt: string) {
  return { dato, start, slutt };
}

describe("sjekkØktforslag", () => {
  it("godtar en gyldig økt (case 1, man. 13:00–15:00)", () => {
    expect(
      sjekkØktforslag(ø(MANDAG, "13:00", "15:00"), kontekstFra(kase(1))),
    ).toEqual({
      ok: true,
    });
  });

  it("avviser for kort og for lang økt med varighet", () => {
    expect(sjekkØktforslag(ø(TIRSDAG, "09:00", "09:25"), TOM)).toEqual({
      ok: false,
      årsak: "varighet",
    });
    expect(sjekkØktforslag(ø(TIRSDAG, "09:00", "12:15"), TOM)).toEqual({
      ok: false,
      årsak: "varighet",
    });
  });

  it("avviser slutt lik eller før start med varighet", () => {
    expect(sjekkØktforslag(ø(TIRSDAG, "09:00", "09:00"), TOM)).toEqual({
      ok: false,
      årsak: "varighet",
    });
    expect(sjekkØktforslag(ø(TIRSDAG, "22:30", "00:30"), TOM)).toEqual({
      ok: false,
      årsak: "varighet",
    });
  });

  it("godtar akkurat 30 min og akkurat 3 t", () => {
    expect(sjekkØktforslag(ø(TIRSDAG, "09:00", "09:30"), TOM).ok).toBe(true);
    expect(sjekkØktforslag(ø(TIRSDAG, "09:00", "12:00"), TOM).ok).toBe(true);
  });

  it("avviser økt utenfor dagtid", () => {
    expect(sjekkØktforslag(ø(TIRSDAG, "06:30", "08:00"), TOM)).toEqual({
      ok: false,
      årsak: "utenfor-dagtid",
    });
    expect(sjekkØktforslag(ø(TIRSDAG, "22:00", "23:30"), TOM)).toEqual({
      ok: false,
      årsak: "utenfor-dagtid",
    });
  });

  it("godtar 07:00–08:00 og 22:00–23:00", () => {
    expect(sjekkØktforslag(ø(TIRSDAG, "07:00", "08:00"), TOM).ok).toBe(true);
    expect(sjekkØktforslag(ø(TIRSDAG, "22:00", "23:00"), TOM).ok).toBe(true);
  });

  it("avviser økt som starter før «nå» med fortid", () => {
    const nå = { ...TOM, nå: new Date(2026, 10, 2, 12, 0) };
    expect(sjekkØktforslag(ø(MANDAG, "11:30", "13:00"), nå)).toEqual({
      ok: false,
      årsak: "fortid",
    });
  });

  it("godtar økt som starter akkurat ved «nå»", () => {
    const nå = { ...TOM, nå: new Date(2026, 10, 2, 12, 0) };
    expect(sjekkØktforslag(ø(MANDAG, "12:00", "13:00"), nå).ok).toBe(true);
  });

  it("avviser økt dagen etter fristen", () => {
    expect(sjekkØktforslag(ø("2026-11-07", "10:00", "12:00"), TOM)).toEqual({
      ok: false,
      årsak: "etter-frist",
    });
  });

  it("godtar økt på fristdagen", () => {
    expect(sjekkØktforslag(ø(FREDAG, "10:00", "12:00"), TOM).ok).toBe(true);
  });

  it("avviser økt inni en forelesning med overlapp-hendelse", () => {
    expect(
      sjekkØktforslag(ø(MANDAG, "10:30", "11:30"), kontekstFra(kase(1))),
    ).toEqual({
      ok: false,
      årsak: "overlapp-hendelse",
    });
  });

  it("godtar økt kant i kant med en hendelse", () => {
    expect(
      sjekkØktforslag(ø(MANDAG, "12:00", "13:00"), kontekstFra(kase(1))).ok,
    ).toBe(true);
  });

  it("avviser økt inn i en nattevakt fra dagen før med overlapp-hendelse", () => {
    // Case 2: nattevakt tir. 21:00–07:30.
    expect(
      sjekkØktforslag(ø(ONSDAG, "07:00", "08:00"), kontekstFra(kase(2))),
    ).toEqual({
      ok: false,
      årsak: "overlapp-hendelse",
    });
  });

  it("avviser økt som overlapper en godtatt økt (case 1, tir. 15:00–16:30)", () => {
    expect(
      sjekkØktforslag(ø(TIRSDAG, "15:00", "16:30"), kontekstFra(kase(1))),
    ).toEqual({
      ok: false,
      årsak: "overlapp-økt",
    });
  });

  it("avviser økt de første 8 timene etter nattevakt (case 2, ons. 09:00–11:00)", () => {
    expect(
      sjekkØktforslag(ø(ONSDAG, "09:00", "11:00"), kontekstFra(kase(2))),
    ).toEqual({
      ok: false,
      årsak: "etter-nattevakt",
    });
  });

  it("avviser økt inne i 8-timersvinduet (case 2, ons. 15:00–16:00)", () => {
    expect(
      sjekkØktforslag(ø(ONSDAG, "15:00", "16:00"), kontekstFra(kase(2))),
    ).toEqual({
      ok: false,
      årsak: "etter-nattevakt",
    });
  });

  it("avviser overlapp med en godtatt økt over midnatt", () => {
    const kontekst = {
      ...TOM,
      godtatteØkter: [ø(TIRSDAG, "22:00", "01:00")],
    };
    expect(sjekkØktforslag(ø(TIRSDAG, "22:00", "23:00"), kontekst)).toEqual({
      ok: false,
      årsak: "overlapp-økt",
    });
  });

  it("gir årsaken fra første regel som brytes", () => {
    expect(sjekkØktforslag(ø(TIRSDAG, "06:00", "06:20"), TOM)).toEqual({
      ok: false,
      årsak: "varighet",
    });
    // Case 1: «nå» man. 08:00, forelesning man. 10:15–12:00.
    const senere = {
      ...kontekstFra(kase(1)),
      nå: new Date(2026, 10, 2, 11, 0),
    };
    expect(sjekkØktforslag(ø(MANDAG, "10:30", "11:30"), senere)).toEqual({
      ok: false,
      årsak: "fortid",
    });
  });

  it("avviser økt en tidligere dag med fortid", () => {
    const nå = { ...TOM, nå: new Date(2026, 10, 3, 8, 0) };
    expect(sjekkØktforslag(ø(MANDAG, "13:00", "15:00"), nå)).toEqual({
      ok: false,
      årsak: "fortid",
    });
  });

  it("godtar økt som starter akkurat 8 t etter nattevakta (ons. 15:30–17:00)", () => {
    expect(
      sjekkØktforslag(ø(ONSDAG, "15:30", "17:00"), kontekstFra(kase(2))).ok,
    ).toBe(true);
  });

  it("bruker bare klokkeslett i nattevaktregelen (case 4, uten titler)", () => {
    const c = kase(4);
    expect(c.sendHendelsestitler).toBe(false);
    const utenTitler = {
      ...kontekstFra(c),
      hendelser: c.hendelser.map(({ dato, start, slutt }) => ({
        dato,
        start,
        slutt,
      })),
    };
    expect(sjekkØktforslag(ø(FREDAG, "09:00", "11:00"), utenTitler)).toEqual({
      ok: false,
      årsak: "etter-nattevakt",
    });
  });

  // Eksempeløkta per case i tests/ki-testsett/README.md («Casene»).
  const eksempler: Record<number, ReturnType<typeof ø>> = {
    1: ø(MANDAG, "13:00", "15:00"),
    2: ø(MANDAG, "14:00", "16:00"),
    3: ø(TIRSDAG, "09:30", "11:30"),
    4: ø(ONSDAG, "09:00", "11:00"),
    5: ø(TIRSDAG, "07:00", "08:00"),
    6: ø(FREDAG, "10:30", "11:30"),
  };

  it.each(planleggingscaser.caser.map((c) => [c.id, c] as const))(
    "godtar eksempeløkta i README for case %i",
    (id, c) => {
      expect(eksempler[id]).toBeDefined();
      expect(sjekkØktforslag(eksempler[id], kontekstFra(c))).toEqual({
        ok: true,
      });
    },
  );
});

describe("kontrollerØktforslag", () => {
  it("beholder alle tre øktene i okter-gyldig.json mot case 1", () => {
    const økter = gyldigMock.svar.økter;
    const resultat = kontrollerØktforslag(
      økter,
      kontekstFra(kase(gyldigMock.planleggingscase)),
    );
    expect(resultat.beholdt).toEqual(økter);
    expect(resultat.forkastet).toEqual([]);
  });

  it("forkaster onsdagsøkta i okter-bryter-fr49.json mot case 2", () => {
    const [mandag, onsdag, torsdag] = bryterFr49.svar.økter;
    const resultat = kontrollerØktforslag(
      bryterFr49.svar.økter,
      kontekstFra(kase(bryterFr49.planleggingscase)),
    );
    expect(resultat.beholdt).toEqual([mandag, torsdag]);
    expect(resultat.forkastet).toEqual([
      { forslag: onsdag, årsak: "etter-nattevakt" },
    ]);
  });

  const sju = [
    ø(MANDAG, "09:00", "10:00"),
    ø(MANDAG, "10:00", "11:00"),
    ø(MANDAG, "11:00", "12:00"),
    ø(TIRSDAG, "09:00", "10:00"),
    ø(TIRSDAG, "10:00", "11:00"),
    ø(ONSDAG, "09:00", "10:00"),
    ø(ONSDAG, "10:00", "11:00"),
  ];

  it("beholder de 5 første av 7 gyldige og gir resten for-mange", () => {
    const resultat = kontrollerØktforslag(sju, TOM);
    expect(MAKS_ØKTER).toBe(5);
    expect(resultat.beholdt).toEqual(sju.slice(0, 5));
    expect(resultat.forkastet).toEqual([
      { forslag: sju[5], årsak: "for-mange" },
      { forslag: sju[6], årsak: "for-mange" },
    ]);
  });

  it("gir et ugyldig forslag etter 5 gyldige sin egen årsak", () => {
    const fem = sju.slice(0, 5);
    const forKort = ø(TIRSDAG, "13:00", "13:10");
    const resultat = kontrollerØktforslag([...fem, forKort], TOM);
    expect(resultat.beholdt).toEqual(fem);
    expect(resultat.forkastet).toEqual([
      { forslag: forKort, årsak: "varighet" },
    ]);
  });

  it("forkaster ugyldige først og beholder så 5 gyldige", () => {
    const forKort = ø(MANDAG, "13:00", "13:10");
    const forTidlig = ø(TIRSDAG, "06:00", "07:30");
    const fem = sju.slice(0, 5);
    const resultat = kontrollerØktforslag([forKort, forTidlig, ...fem], TOM);
    expect(resultat.beholdt).toEqual(fem);
    expect(resultat.forkastet).toEqual([
      { forslag: forKort, årsak: "varighet" },
      { forslag: forTidlig, årsak: "utenfor-dagtid" },
    ]);
  });

  it("gir forslagene tilbake uendret, med ekstra felt", () => {
    const medId = { id: "a", ...ø(MANDAG, "09:00", "10:00") };
    const resultat = kontrollerØktforslag([medId], TOM);
    expect(resultat.beholdt[0]).toBe(medId);
  });
});

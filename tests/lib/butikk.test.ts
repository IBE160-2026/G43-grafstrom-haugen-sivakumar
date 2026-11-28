// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { nyttDokument, type Dokument } from "@/kjerne/skjema";
import { LAGRINGSNØKKEL, lagLagring } from "@/lib/storage";
import { lagButikk } from "@/lib/store";
import { fulltDokument } from "../kjerne/fikstur";
import { falskStorage } from "./falsk-storage";

function oppsett(start: Record<string, string> = {}) {
  const s = falskStorage(start);
  const butikk = lagButikk({ lagring: lagLagring(() => s) });
  return { s, butikk };
}

/** En endring av dokumentet, slik en kommando ville gjort den. */
function endre(dokument: Dokument | null): Dokument {
  return { ...(dokument ?? nyttDokument()), profil: { fornavn: "Ida" } };
}

const FOR_NY = JSON.stringify({ ...fulltDokument(), schemaVersion: 2 });
const ØDELAGT = "{ikke json";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("før innlasting", () => {
  it("starter i laster uten dokument og uten nå", () => {
    const { butikk } = oppsett();
    expect(butikk.getState()).toMatchObject({
      status: "laster",
      dokument: null,
      nå: null,
      lagringFeilet: false,
      skrivingSperret: false,
    });
  });

  it("skriver ingenting før lastInn er ferdig", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.setState({ dokument: nyttDokument() });
    expect(s.skrivinger).toEqual([]);
    expect(s.data.get(LAGRINGSNØKKEL)).toBe(JSON.stringify(fulltDokument()));
  });
});

describe("lastInn", () => {
  it("første start: nytt dokument lagres én gang", () => {
    const { s, butikk } = oppsett();
    butikk.getState().lastInn();
    expect(butikk.getState()).toMatchObject({ status: "klar", dokument: nyttDokument() });
    expect(s.skrivinger).toEqual([[LAGRINGSNØKKEL, JSON.stringify(nyttDokument())]]);
  });

  it("gyldige data: ingen skriving ved oppstart", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.getState().lastInn();
    expect(butikk.getState()).toMatchObject({
      status: "klar",
      dokument: fulltDokument(),
      lagringFeilet: false,
    });
    expect(s.skrivinger).toEqual([]);
  });

  it("tåler å kjøres to ganger (StrictMode)", () => {
    const { s, butikk } = oppsett();
    butikk.getState().lastInn();
    const dokument = butikk.getState().dokument;
    butikk.getState().lastInn();
    expect(butikk.getState().dokument).toBe(dokument);
    expect(s.skrivinger).toHaveLength(1);
  });

  it.each([
    ["for-ny", FOR_NY],
    ["ugyldig", ØDELAGT],
  ])("%s gir feilsiden og lar det lagrede stå", (status, rå) => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: rå });
    butikk.getState().lastInn();
    expect(butikk.getState()).toMatchObject({ status, dokument: null, rå });

    // Heller ikke en endring etter at feilsiden vises, skriver noe.
    butikk.setState({ dokument: nyttDokument() });
    expect(s.skrivinger).toEqual([]);
    expect(s.data.get(LAGRINGSNØKKEL)).toBe(rå);
  });

  it("lesing feiler: nytt dokument i minnet, banner og sperret skriving", () => {
    const { s, butikk } = oppsett();
    s.kastVedLes = true;
    butikk.getState().lastInn();
    expect(butikk.getState()).toMatchObject({
      status: "klar",
      dokument: nyttDokument(),
      lagringFeilet: true,
      skrivingSperret: true,
    });

    // Også senere endringer lar lageret være.
    s.kastVedLes = false;
    butikk.setState({ dokument: endre(butikk.getState().dokument) });
    butikk.setState({ dokument: endre(butikk.getState().dokument) });
    expect(s.skrivinger).toEqual([]);
    expect(butikk.getState().lagringFeilet).toBe(true);

    butikk.getState().lastPåNytt();
    butikk.getState().slettAlleData();
    expect(s.skrivinger).toEqual([]);
  });

  it("tilbakeskriving som feiler gir banner", () => {
    const { s, butikk } = oppsett();
    s.kastVedSkriv = true;
    butikk.getState().lastInn();
    expect(butikk.getState()).toMatchObject({ status: "klar", lagringFeilet: true });
  });
});

describe("lagring via abonnementet", () => {
  it("skriver når dokumentet endres", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.getState().lastInn();
    const endret = endre(butikk.getState().dokument);
    butikk.setState({ dokument: endret });
    expect(s.skrivinger).toEqual([[LAGRINGSNØKKEL, JSON.stringify(endret)]]);
  });

  it("skriver ikke når annet enn dokumentet endres", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.getState().lastInn();
    butikk.getState().settNå(new Date(0));
    expect(s.skrivinger).toEqual([]);
  });

  it("skriving feiler: banner, og borte etter neste vellykkede skriving", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.getState().lastInn();

    s.kastVedSkriv = true;
    const iMinnet = endre(butikk.getState().dokument);
    butikk.setState({ dokument: iMinnet });
    expect(butikk.getState().lagringFeilet).toBe(true);
    expect(butikk.getState().dokument).toBe(iMinnet);

    s.kastVedSkriv = false;
    butikk.setState({ dokument: { ...iMinnet, profil: null } });
    expect(butikk.getState().lagringFeilet).toBe(false);
    expect(s.skrivinger).toHaveLength(1);
  });

  it("ugyldig dokument skrives ikke, logges og gir banner", () => {
    const feil = vi.spyOn(console, "error").mockImplementation(() => {});
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.getState().lastInn();
    const ugyldig = { ...nyttDokument(), profil: { fornavn: 42 } } as unknown as Dokument;
    butikk.setState({ dokument: ugyldig });
    expect(s.skrivinger).toEqual([]);
    expect(feil).toHaveBeenCalledTimes(1);
    expect(butikk.getState().lagringFeilet).toBe(true);
  });
});

describe("settNå", () => {
  it("setter nå", () => {
    const { butikk } = oppsett();
    const nå = new Date("2026-11-26T10:00:00.000Z");
    butikk.getState().settNå(nå);
    expect(butikk.getState().nå).toBe(nå);
  });
});

describe("lastPåNytt (annen fane)", () => {
  it("annen fane skriver: dokumentet lastes på nytt og skrives ikke tilbake", () => {
    const { s, butikk } = oppsett();
    butikk.getState().lastInn();
    s.skrivinger.length = 0;

    s.data.set(LAGRINGSNØKKEL, JSON.stringify(fulltDokument()));
    butikk.getState().lastPåNytt();
    expect(butikk.getState().dokument).toEqual(fulltDokument());
    expect(s.skrivinger).toEqual([]);
  });

  it("annen fane sletter alt: nytt dokument skrives én gang, ingen løkke", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.getState().lastInn();

    s.data.clear();
    butikk.getState().lastPåNytt();
    expect(butikk.getState()).toMatchObject({ status: "klar", dokument: nyttDokument() });
    expect(s.skrivinger).toEqual([[LAGRINGSNØKKEL, JSON.stringify(nyttDokument())]]);

    // Den andre fanen får en hendelse for skrivingen og laster uten å skrive.
    butikk.getState().lastPåNytt();
    expect(s.skrivinger).toHaveLength(1);
  });

  it.each([
    ["for-ny", FOR_NY],
    ["ugyldig", ØDELAGT],
  ])("annen fane skriver %s: feilsiden uten skriving", (status, rå) => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.getState().lastInn();
    s.data.set(LAGRINGSNØKKEL, rå);
    butikk.getState().lastPåNytt();
    expect(butikk.getState()).toMatchObject({ status, rå, dokument: null });
    expect(s.skrivinger).toEqual([]);
  });

  it("annen fane skriver etter feilet skriving: banneret blir stående", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.getState().lastInn();
    s.kastVedSkriv = true;
    butikk.setState({ dokument: endre(butikk.getState().dokument) });
    expect(butikk.getState().lagringFeilet).toBe(true);

    s.kastVedSkriv = false;
    s.data.set(LAGRINGSNØKKEL, JSON.stringify(nyttDokument()));
    butikk.getState().lastPåNytt();
    expect(butikk.getState()).toMatchObject({ dokument: nyttDokument(), lagringFeilet: true });

    // Borte etter neste vellykkede skriving.
    butikk.setState({ dokument: endre(butikk.getState().dokument) });
    expect(butikk.getState().lagringFeilet).toBe(false);
  });

  it("lesefeil når appen er klar: beholder dokumentet, sperrer skriving", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(fulltDokument()) });
    butikk.getState().lastInn();
    const endret = endre(butikk.getState().dokument);
    butikk.setState({ dokument: endret });
    s.skrivinger.length = 0;

    s.kastVedLes = true;
    butikk.getState().lastPåNytt();
    expect(butikk.getState()).toMatchObject({
      status: "klar",
      dokument: endret,
      lagringFeilet: true,
      skrivingSperret: true,
    });
    expect(s.skrivinger).toEqual([]);
  });

  it.each([
    ["for-ny", FOR_NY],
    ["ugyldig", ØDELAGT],
  ])("fra %s til klar når en annen fane skriver gyldige data", (_status, rå) => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: rå });
    butikk.getState().lastInn();
    s.data.set(LAGRINGSNØKKEL, JSON.stringify(fulltDokument()));
    butikk.getState().lastPåNytt();
    expect(butikk.getState()).toMatchObject({
      status: "klar",
      rå: null,
      dokument: fulltDokument(),
    });
    expect(s.skrivinger).toEqual([]);
  });

  it.each([
    ["for-ny", FOR_NY],
    ["ugyldig", ØDELAGT],
  ])("fra %s til klar når en annen fane tømmer lageret: én skriving", (_status, rå) => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: rå });
    butikk.getState().lastInn();
    s.data.clear();
    butikk.getState().lastPåNytt();
    expect(butikk.getState()).toMatchObject({ status: "klar", rå: null, dokument: nyttDokument() });
    expect(s.skrivinger).toEqual([[LAGRINGSNØKKEL, JSON.stringify(nyttDokument())]]);
  });

  it("gjør ingenting før innlasting", () => {
    const { s, butikk } = oppsett();
    butikk.getState().lastPåNytt();
    expect(butikk.getState().status).toBe("laster");
    expect(s.skrivinger).toEqual([]);
  });
});

describe("slettAlleData", () => {
  it("fra feilsiden: tømmer lageret og starter med nytt dokument som lagres", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: ØDELAGT });
    butikk.getState().lastInn();
    butikk.getState().slettAlleData();
    expect(butikk.getState()).toMatchObject({
      status: "klar",
      dokument: nyttDokument(),
      rå: null,
      lagringFeilet: false,
    });
    expect(s.skrivinger).toEqual([[LAGRINGSNØKKEL, JSON.stringify(nyttDokument())]]);
  });

  it("sletting som feiler: står på feilsiden med banner", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: FOR_NY });
    butikk.getState().lastInn();
    s.kastVedSlett = true;
    butikk.getState().slettAlleData();
    expect(butikk.getState()).toMatchObject({ status: "for-ny", lagringFeilet: true });
    expect(s.data.get(LAGRINGSNØKKEL)).toBe(FOR_NY);
    expect(s.skrivinger).toEqual([]);
  });
});

describe("settTema", () => {
  it("bytter tema med nye objekter og lagrer", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(nyttDokument()) });
    butikk.getState().lastInn();
    const før = butikk.getState().dokument!;
    butikk.getState().settTema("rosa");
    const etter = butikk.getState().dokument!;
    expect(etter.innstillinger.tema).toBe("rosa");
    expect(etter).not.toBe(før);
    expect(etter.innstillinger).not.toBe(før.innstillinger);
    expect(før.innstillinger.tema).toBe("blå");
    expect(JSON.parse(s.data.get(LAGRINGSNØKKEL)!).innstillinger.tema).toBe("rosa");
  });

  it("samme tema skriver ingenting", () => {
    const { s, butikk } = oppsett({ [LAGRINGSNØKKEL]: JSON.stringify(nyttDokument()) });
    butikk.getState().lastInn();
    butikk.getState().settTema("blå");
    expect(s.skrivinger).toEqual([]);
  });

  it("gjør ingenting før innlasting eller med sperret skriving", () => {
    const { s, butikk } = oppsett();
    butikk.getState().settTema("gul");
    expect(butikk.getState().dokument).toBeNull();
    s.kastVedLes = true;
    butikk.getState().lastInn();
    butikk.getState().settTema("gul");
    expect(butikk.getState().dokument!.innstillinger.tema).toBe("blå");
    expect(s.skrivinger).toEqual([]);
  });
});

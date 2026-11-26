// @vitest-environment node
import { describe, expect, it } from "vitest";
import { nyttDokument } from "@/kjerne/skjema";
import { LAGRINGSNØKKEL, lagLagring, lagring } from "@/lib/storage";
import { fulltDokument } from "../kjerne/fikstur";

type FalskStorage = Storage & {
  data: Map<string, string>;
  skrivinger: [string, string][];
  kastVedLes: boolean;
  kastVedSkriv: boolean;
};

function falskStorage(start: Record<string, string> = {}): FalskStorage {
  const data = new Map(Object.entries(start));
  const storage: FalskStorage = {
    data,
    skrivinger: [],
    kastVedLes: false,
    kastVedSkriv: false,
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    key: (i) => [...data.keys()][i] ?? null,
    getItem(nøkkel) {
      if (storage.kastVedLes) throw new Error("SecurityError");
      return data.get(nøkkel) ?? null;
    },
    setItem(nøkkel, verdi) {
      if (storage.kastVedSkriv) throw new Error("QuotaExceededError");
      storage.skrivinger.push([nøkkel, verdi]);
      data.set(nøkkel, verdi);
    },
    removeItem: (nøkkel) => {
      data.delete(nøkkel);
    },
  };
  return storage;
}

describe("lagLagring().les", () => {
  it("bruker nøkkelen duenext", () => {
    expect(LAGRINGSNØKKEL).toBe("duenext");
  });

  it("tomt lager gir nytt dokument som skrives tilbake", () => {
    const s = falskStorage();
    const resultat = lagLagring(() => s).les();
    expect(resultat).toEqual({ type: "ok", dokument: nyttDokument(), lagringFeilet: false });
    expect(s.skrivinger).toEqual([[LAGRINGSNØKKEL, JSON.stringify(nyttDokument())]]);
  });

  it("gyldig v1 leses uten å skrive", () => {
    const dok = fulltDokument();
    const s = falskStorage({ [LAGRINGSNØKKEL]: JSON.stringify(dok) });
    expect(lagLagring(() => s).les()).toEqual({ type: "ok", dokument: dok, lagringFeilet: false });
    expect(s.skrivinger).toEqual([]);
  });

  it("for-ny gir rådata tilbake og skriver aldri", () => {
    const rå = JSON.stringify({ ...fulltDokument(), schemaVersion: 2 });
    const s = falskStorage({ [LAGRINGSNØKKEL]: rå });
    expect(lagLagring(() => s).les()).toEqual({ type: "for-ny", rå });
    expect(s.skrivinger).toEqual([]);
    expect(s.data.get(LAGRINGSNØKKEL)).toBe(rå);
  });

  it.each(["{ikke json", JSON.stringify({ schemaVersion: 1 })])(
    "ugyldig %j gir rådata tilbake og skriver aldri",
    (rå) => {
      const s = falskStorage({ [LAGRINGSNØKKEL]: rå });
      expect(lagLagring(() => s).les()).toEqual({ type: "ugyldig", rå });
      expect(s.skrivinger).toEqual([]);
      expect(s.data.get(LAGRINGSNØKKEL)).toBe(rå);
    },
  );

  it("getItem som kaster gir lesefeil og ingen skriving", () => {
    const s = falskStorage();
    s.kastVedLes = true;
    expect(lagLagring(() => s).les()).toEqual({ type: "lesefeil" });
    expect(s.skrivinger).toEqual([]);
  });

  it("hentStorage som kaster gir lesefeil", () => {
    const lag = lagLagring(() => {
      throw new Error("blokkert");
    });
    expect(lag.les()).toEqual({ type: "lesefeil" });
  });

  it("tilbakeskriving som feiler gir dokumentet med lagringFeilet", () => {
    const s = falskStorage();
    s.kastVedSkriv = true;
    expect(lagLagring(() => s).les()).toEqual({
      type: "ok",
      dokument: nyttDokument(),
      lagringFeilet: true,
    });
  });
});

describe("lagLagring().skriv", () => {
  it("skriver dokumentet som JSON under nøkkelen", () => {
    const s = falskStorage();
    const dok = fulltDokument();
    expect(lagLagring(() => s).skriv(dok)).toEqual({ ok: true });
    expect(s.data.get(LAGRINGSNØKKEL)).toBe(JSON.stringify(dok));
  });

  it("setItem som kaster gir lagring-feilet", () => {
    const s = falskStorage();
    s.kastVedSkriv = true;
    expect(lagLagring(() => s).skriv(nyttDokument())).toEqual({
      ok: false,
      feil: "lagring-feilet",
    });
  });

  it("hentStorage som kaster gir lagring-feilet", () => {
    const lag = lagLagring(() => {
      throw new Error("blokkert");
    });
    expect(lag.skriv(nyttDokument())).toEqual({ ok: false, feil: "lagring-feilet" });
  });

  it("skrevet dokument leses tilbake likt", () => {
    const s = falskStorage();
    const lag = lagLagring(() => s);
    lag.skriv(fulltDokument());
    expect(lag.les()).toEqual({ type: "ok", dokument: fulltDokument(), lagringFeilet: false });
  });
});

describe("standardinstansen", () => {
  it("kan importeres uten window og gir navngitte feil i stedet for å kaste", () => {
    expect(typeof window).toBe("undefined");
    expect(lagring.les()).toEqual({ type: "lesefeil" });
    expect(lagring.skriv(nyttDokument())).toEqual({ ok: false, feil: "lagring-feilet" });
  });
});

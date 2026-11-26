// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { nyttDokument } from "@/kjerne/skjema";
import { LAGRINGSNØKKEL, lagLagring, lagring, type Vindu } from "@/lib/storage";
import { fulltDokument } from "../kjerne/fikstur";
import { falskStorage } from "./falsk-storage";

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

describe("lagLagring().slettAlt", () => {
  it("fjerner nøkkelen og lar andre nøkler stå", () => {
    const s = falskStorage({ [LAGRINGSNØKKEL]: "{ikke json", annen: "x" });
    expect(lagLagring(() => s).slettAlt()).toEqual({ ok: true });
    expect(s.data.has(LAGRINGSNØKKEL)).toBe(false);
    expect(s.data.get("annen")).toBe("x");
  });

  it("removeItem som kaster gir sletting-feilet", () => {
    const s = falskStorage({ [LAGRINGSNØKKEL]: "{ikke json" });
    s.kastVedSlett = true;
    expect(lagLagring(() => s).slettAlt()).toEqual({ ok: false, feil: "sletting-feilet" });
    expect(s.data.get(LAGRINGSNØKKEL)).toBe("{ikke json");
  });
});

/** Lager en `storage`-hendelse. Node har ikke `StorageEvent`. */
function storageHendelse(key: string | null, storageArea: Storage): Event {
  return Object.assign(new Event("storage"), { key, storageArea });
}

describe("lagLagring().lyttEtterEndringer", () => {
  function oppsett() {
    const s = falskStorage();
    const vindu = new EventTarget();
    const cb = vi.fn();
    const avmeld = lagLagring(
      () => s,
      () => vindu as unknown as Vindu,
    ).lyttEtterEndringer(cb);
    return { s, vindu, cb, avmeld };
  }

  it("kaller tilbake for nøkkelen og for tømt lager", () => {
    const { s, vindu, cb } = oppsett();
    vindu.dispatchEvent(storageHendelse(LAGRINGSNØKKEL, s));
    vindu.dispatchEvent(storageHendelse(null, s));
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("overser andre nøkler og andre lagre", () => {
    const { s, vindu, cb } = oppsett();
    vindu.dispatchEvent(storageHendelse("annen", s));
    vindu.dispatchEvent(storageHendelse(LAGRINGSNØKKEL, falskStorage()));
    expect(cb).not.toHaveBeenCalled();
  });

  it("avmelding stopper lyttingen", () => {
    const { s, vindu, cb, avmeld } = oppsett();
    avmeld();
    vindu.dispatchEvent(storageHendelse(LAGRINGSNØKKEL, s));
    expect(cb).not.toHaveBeenCalled();
  });

  it("blokkert lager gir en avmelding som ikke kaster", () => {
    const avmeld = lagLagring(() => {
      throw new Error("blokkert");
    }).lyttEtterEndringer(() => {});
    expect(() => avmeld()).not.toThrow();
  });
});

describe("standardinstansen", () => {
  it("kan importeres uten window og gir navngitte feil i stedet for å kaste", () => {
    expect(typeof window).toBe("undefined");
    expect(lagring.les()).toEqual({ type: "lesefeil" });
    expect(lagring.skriv(nyttDokument())).toEqual({ ok: false, feil: "lagring-feilet" });
    expect(lagring.slettAlt()).toEqual({ ok: false, feil: "sletting-feilet" });
    expect(() => lagring.lyttEtterEndringer(() => {})()).not.toThrow();
  });
});

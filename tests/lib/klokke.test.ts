// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TAKT_MS, startKlokke, tidsstempel } from "@/lib/klokke";

type FalskDokument = EventTarget & { visibilityState: DocumentVisibilityState };

let dok: FalskDokument;

function bliSynlig(tilstand: DocumentVisibilityState) {
  dok.visibilityState = tilstand;
  dok.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-26T10:00:00.000Z"));
  dok = Object.assign(new EventTarget(), { visibilityState: "visible" as const });
  vi.stubGlobal("document", dok);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("startKlokke", () => {
  it("setter nå straks", () => {
    const settNå = vi.fn();
    startKlokke(settNå);
    expect(settNå).toHaveBeenCalledTimes(1);
    expect(settNå.mock.calls[0][0].toISOString()).toBe("2026-11-26T10:00:00.000Z");
  });

  it("oppdaterer nå hvert minutt", () => {
    const settNå = vi.fn();
    startKlokke(settNå);
    vi.advanceTimersByTime(TAKT_MS - 1);
    expect(settNå).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1);
    expect(settNå).toHaveBeenCalledTimes(2);
    expect(settNå.mock.calls[1][0].toISOString()).toBe("2026-11-26T10:01:00.000Z");
    vi.advanceTimersByTime(TAKT_MS);
    expect(settNå).toHaveBeenCalledTimes(3);
  });

  it("oppdaterer nå når fanen blir synlig, ikke når den skjules", () => {
    const settNå = vi.fn();
    startKlokke(settNå);
    bliSynlig("hidden");
    expect(settNå).toHaveBeenCalledTimes(1);
    vi.setSystemTime(new Date("2026-11-26T15:30:00.000Z"));
    bliSynlig("visible");
    expect(settNå).toHaveBeenCalledTimes(2);
    expect(settNå.mock.calls[1][0].toISOString()).toBe("2026-11-26T15:30:00.000Z");
  });

  it("stoppfunksjonen stopper takt og synlighetslytter", () => {
    const settNå = vi.fn();
    const stopp = startKlokke(settNå);
    stopp();
    vi.advanceTimersByTime(TAKT_MS * 5);
    bliSynlig("visible");
    expect(settNå).toHaveBeenCalledTimes(1);
  });
});

describe("tidsstempel", () => {
  it("gir ISO-tidsstempel i UTC", () => {
    expect(tidsstempel()).toBe("2026-11-26T10:00:00.000Z");
  });
});

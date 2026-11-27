import { describe, expect, it } from "vitest";
import { lokalDato, lokaltKlokkeslett, tilMinutter } from "@/kjerne/tid";

describe("lokalDato", () => {
  it("gir YYYY-MM-DD med ledende nuller", () => {
    expect(lokalDato(new Date(2026, 10, 3, 8, 5))).toBe("2026-11-03");
  });

  it("bruker lokal dato like før midnatt", () => {
    expect(lokalDato(new Date(2026, 10, 3, 23, 59))).toBe("2026-11-03");
  });

  it("håndterer månedsskifte", () => {
    expect(lokalDato(new Date(2026, 10, 30, 23, 59))).toBe("2026-11-30");
    expect(lokalDato(new Date(2026, 11, 1, 0, 0))).toBe("2026-12-01");
  });

  it("håndterer årsskifte", () => {
    expect(lokalDato(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
    expect(lokalDato(new Date(2027, 0, 1, 0, 0))).toBe("2027-01-01");
  });
});

describe("lokaltKlokkeslett", () => {
  it("gir HH:mm med ledende nuller", () => {
    expect(lokaltKlokkeslett(new Date(2026, 10, 3, 7, 5))).toBe("07:05");
  });

  it("gir 00:00 ved midnatt og 23:59 like før", () => {
    expect(lokaltKlokkeslett(new Date(2026, 10, 3, 0, 0))).toBe("00:00");
    expect(lokaltKlokkeslett(new Date(2026, 10, 3, 23, 59))).toBe("23:59");
  });
});

describe("tilMinutter", () => {
  it("gir forskjellen i minutter innenfor samme dag", () => {
    expect(
      tilMinutter("2026-11-03", "15:30") - tilMinutter("2026-11-03", "07:00"),
    ).toBe(510);
  });

  it("går over midnatt, månedsskifte og årsskifte", () => {
    expect(
      tilMinutter("2026-11-04", "00:00") - tilMinutter("2026-11-03", "23:00"),
    ).toBe(60);
    expect(
      tilMinutter("2026-12-01", "00:00") - tilMinutter("2026-11-30", "00:00"),
    ).toBe(1440);
    expect(
      tilMinutter("2027-01-01", "00:30") - tilMinutter("2026-12-31", "23:30"),
    ).toBe(60);
  });

  it("regner veggklokke, så sommertidsskiftet ikke spiller inn", () => {
    // Natt til 2027-03-28 går klokka fra 02:00 til 03:00 i Europe/Oslo.
    expect(
      tilMinutter("2027-03-28", "00:00") - tilMinutter("2027-03-27", "00:00"),
    ).toBe(1440);
  });
});

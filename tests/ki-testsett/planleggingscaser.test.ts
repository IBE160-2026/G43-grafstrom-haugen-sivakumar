// Sjekker bare form og dekning. FR-49 kontrolleres ikke her — den regelen
// hører til `kjerne/` i story 6.4 (AD-1). Mock-svarene er kontrollert for hånd
// mot FR-49, se README.

import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  etikettSkjema,
  hendelseSkjema,
  innstillingerSkjema,
  prioritetSkjema,
  øktForslagSkjema,
} from "@/kjerne/skjema";
import planleggingscaser from "./planleggingscaser.json";
import bryterFr49 from "./mock/okter-bryter-fr49.json";
import gyldig from "./mock/okter-gyldig.json";
import testsett from "./testsett.json";

const FORVENTET = "Minst én økt, og alle økter holder FR-49";
/** Uka starter på referansedatoen i `testsett.json` (mandag 2026-11-02). */
const UKESTART = testsett.referansedato;
const UKESLUTT = "2026-11-08";

const dato = z.iso.date();
/** `YYYY-MM-DDTHH:mm` i lokal tid uten sone (AD-5). */
const nå = z.iso
  .datetime({ local: true, precision: -1 })
  // `local: true` godtar fortsatt «Z», så sonen avvises eksplisitt.
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);

const hendelse = hendelseSkjema.pick({
  tittel: true,
  dato: true,
  start: true,
  slutt: true,
  skjulTittelForKi: true,
});
const økt = øktForslagSkjema.omit({ id: true });

const caseSkjema = z.strictObject({
  id: z.number().int().positive(),
  beskrivelse: z.string().min(1),
  nå,
  oppgave: z.strictObject({ tekst: z.string().min(1), frist: dato }),
  hendelser: z.array(hendelse),
  godtatteØkter: z.array(økt),
  sendHendelsestitler: innstillingerSkjema.shape.sendHendelsestitler,
});

const filSkjema = z.strictObject({
  beskrivelse: z.string().min(1),
  referansedato: dato,
  forventet: z.literal(FORVENTET),
  caser: z.array(caseSkjema).min(5),
});

const mockSkjema = z.strictObject({
  planleggingscase: z.number().int().positive(),
  svar: z.strictObject({
    felt: z.strictObject({
      etikett: etikettSkjema,
      prioritet: prioritetSkjema,
      sammendrag: z.string().min(1),
    }),
    økter: z.array(økt).min(1),
  }),
});

const fil = filSkjema.parse(planleggingscaser);
const caser = fil.caser;

function iUka(d: string): boolean {
  return d >= UKESTART && d <= UKESLUTT;
}

describe("planleggingscaser.json", () => {
  it("har riktig format og minst 5 caser", () => {
    expect(filSkjema.safeParse(planleggingscaser).success).toBe(true);
    expect(caser.length).toBeGreaterThanOrEqual(5);
  });

  it("har samme referansedato som testsett.json", () => {
    expect(fil.referansedato).toBe(testsett.referansedato);
  });

  it("har unike id-er", () => {
    const ider = caser.map((c) => c.id);
    expect(new Set(ider).size).toBe(ider.length);
  });

  it.each(caser)("case $id: fristen er ikke før dagen for «nå»", (c) => {
    expect(c.oppgave.frist >= c.nå.slice(0, 10)).toBe(true);
  });

  it.each(caser)("case $id: alle datoer ligger i uka 2026-11-02–08", (c) => {
    const datoer = [
      c.nå.slice(0, 10),
      c.oppgave.frist,
      ...c.hendelser.map((h) => h.dato),
      ...c.godtatteØkter.map((ø) => ø.dato),
    ];
    for (const d of datoer) expect(iUka(d), d).toBe(true);
  });

  it.each(caser)("case $id: ingen hendelse har lik start og slutt", (c) => {
    for (const h of c.hendelser) expect(h.start).not.toBe(h.slutt);
  });

  it("dekker nattevakt, 🔒 og hendelsestitler av", () => {
    expect(caser.some((c) => c.hendelser.some((h) => h.slutt < h.start))).toBe(
      true,
    );
    expect(
      caser.some((c) => c.hendelser.some((h) => h.skjulTittelForKi)),
    ).toBe(true);
    expect(caser.some((c) => !c.sendHendelsestitler)).toBe(true);
    expect(
      caser.some(
        (c) =>
          !c.sendHendelsestitler &&
          c.hendelser.some((h) => h.slutt < h.start),
      ),
    ).toBe(true);
  });

  it("dekker godtatte økter, frist i morgen og frist i dag", () => {
    expect(caser.some((c) => c.godtatteØkter.length > 0)).toBe(true);
    expect(caser.some((c) => c.oppgave.frist === nesteDag(c.nå))).toBe(true);
    expect(caser.some((c) => c.oppgave.frist === c.nå.slice(0, 10))).toBe(
      true,
    );
  });
});

/** Dagen etter datoen i «nå», som `YYYY-MM-DD`. */
function nesteDag(nåVerdi: string): string {
  const d = new Date(`${nåVerdi.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

describe("mock-svar med økter", () => {
  it.each([
    ["okter-gyldig.json", gyldig],
    ["okter-bryter-fr49.json", bryterFr49],
  ])("%s har riktig form og peker på en case som finnes", (_navn, mock) => {
    const m = mockSkjema.parse(mock);
    expect(caser.some((c) => c.id === m.planleggingscase)).toBe(true);
  });

  it.each([
    ["okter-gyldig.json", gyldig],
    ["okter-bryter-fr49.json", bryterFr49],
  ])("%s har økter mellom «nå» og fristen i casen", (_navn, mock) => {
    const m = mockSkjema.parse(mock);
    const c = caser.find((k) => k.id === m.planleggingscase);
    expect(c).toBeDefined();
    if (!c) return;
    for (const ø of m.svar.økter) {
      expect(iUka(ø.dato), ø.dato).toBe(true);
      expect(ø.dato >= c.nå.slice(0, 10), ø.dato).toBe(true);
      expect(ø.dato <= c.oppgave.frist, ø.dato).toBe(true);
    }
  });

  it("det gyldige svaret gjelder case 1 og bryter-svaret en case med nattevakt", () => {
    expect(gyldig.planleggingscase).toBe(1);
    const nattevaktcase = caser.find(
      (c) => c.id === bryterFr49.planleggingscase,
    );
    expect(nattevaktcase?.hendelser.some((h) => h.slutt < h.start)).toBe(true);
  });
});

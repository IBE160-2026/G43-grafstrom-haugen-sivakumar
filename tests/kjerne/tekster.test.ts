import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as tekster from "@/kjerne/tekster";
import {
  GJELDENDE_SAMTYKKEVERSJON,
  SAMTYKKETEKST,
  oppgavePåminnelse,
} from "@/kjerne/tekster";

const EXPERIENCE_STI = fileURLToPath(
  new URL(
    "../../docs/ux-designs/ux-G43-grafstrom-haugen-sivakumar-2026-11-09/EXPERIENCE.md",
    import.meta.url,
  ),
);
/**
 * Gjør CRLF (og enslig CR) om til LF. Git på Windows sjekker ofte ut med CRLF
 * (`core.autocrlf`), og reglene under regner med `\n`.
 */
function lf(tekst: string): string {
  return tekst.replace(/\r\n?/g, "\n");
}

const EXPERIENCE = lf(readFileSync(EXPERIENCE_STI, "utf8"));

const SEKSJON = "## Personvern og data – fastsatte tekster";

/**
 * SHA-256 av `JSON.stringify(SAMTYKKETEKST)` for hver samtykkeversjon.
 * Endres samtykketeksten, må `GJELDENDE_SAMTYKKEVERSJON` økes og hashen legges inn her.
 */
const SAMTYKKEHASHER: Record<number, string> = {
  1: "61701637ee082132783d8b78906cbc5321c816e15302b13d69a3f2983bdfbb34",
};

type Avvik = { sti: string; tekst: string };

/** Slår sammen mellomrom. Brukes bare på EXPERIENCE.md-siden. */
function mellomrom(tekst: string): string {
  return tekst.replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Blokker: hvert felt sammenlignes med sitt eget segment i sitatblokken.
// ---------------------------------------------------------------------------

type Segmenttype = "fet" | "tekst" | "knapp" | "lenke" | "punkt" | "✓" | "✕";
type Segment = { type: Segmenttype; tekst: string };

/** Konstanter (stiprefiks) som sammenlignes med sitatblokken i en deltekst. */
const BLOKKER: Record<string, string> = {
  DEMO_ADVARSEL: "Demo-advarsel (FR-65)",
  SAMTYKKETEKST: "Fastsatt samtykketekst (FR-35)",
  HVA_SENDES_TIL_KI: "Hva sendes til KI",
  LAGRING: "Lagring",
  EKSPORT_ADVARSEL: "Eksport (advarsel før lagring av fila)",
  IMPORT_DIALOG: "Import (dialog)",
  SLETT_ALLE_DATA_DIALOG: "Slett alle data (dialog)",
  LAGRINGSBANNER: "Lagringsbanner",
  FEILSIDE: "Feilside (data kan ikke leses)",
};

/** Hvilken segmenttype et blokkfelt skal ha i markdown. */
function forventetType(sti: string): Segmenttype {
  if (sti.startsWith("HVA_SENDES_TIL_KI.sendes[")) return "✓";
  if (sti.startsWith("HVA_SENDES_TIL_KI.sendesIkke[")) return "✕";
  if (sti.startsWith("SAMTYKKETEKST.hvaSendes.punkter[")) return "punkt";
  if (/\.knapper\./.test(sti)) return "knapp";
  if (sti.endsWith(".lenke")) return "lenke";
  if (/\.(tittel|overskrift|uthevet)$/.test(sti)) return "fet";
  return "tekst";
}

/** Deler sitatblokken i segmenter: linje, punkt, utheving, knapp eller lenke. */
function blokksegmenter(deltekst: string): Segment[] {
  const segmenter: Segment[] = [];
  const linjer = deltekst
    .split("\n")
    .filter((linje) => linje.trimStart().startsWith(">"))
    .map((linje) => linje.replace(/^\s*>\s?/, "").trim())
    .filter(Boolean);
  for (const linje of linjer) {
    const punkt = /^([-✓✕])\s+(.*)$/.exec(linje);
    if (punkt) {
      const type = punkt[1] === "-" ? "punkt" : (punkt[1] as "✓" | "✕");
      segmenter.push({ type, tekst: mellomrom(punkt[2]) });
      continue;
    }
    linje.split(/(\*\*.+?\*\*)/).forEach((del) => {
      const fet = /^\*\*(.+)\*\*$/.exec(del);
      if (fet) {
        const knapp = /^\[\s*(.+?)\s*\]$/.exec(fet[1]);
        segmenter.push(
          knapp ? { type: "knapp", tekst: knapp[1] } : { type: "fet", tekst: mellomrom(fet[1]) },
        );
        return;
      }
      const tekst = mellomrom(del);
      if (!tekst) return;
      const lenke = /^\[(.+)\]$/.exec(tekst);
      segmenter.push(lenke ? { type: "lenke", tekst: lenke[1] } : { type: "tekst", tekst });
    });
  }
  return segmenter;
}

/** Sammenligner felt og segmenter parvis. Melder første avvik. */
function sjekkBlokk(felt: Avvik[], segmenter: Segment[]): Avvik[] {
  for (let i = 0; i < Math.max(felt.length, segmenter.length); i++) {
    const f = felt[i];
    const s = segmenter[i];
    if (!f) {
      return [{ sti: felt[felt.length - 1].sti, tekst: `(ekstra i EXPERIENCE.md: ${s.tekst})` }];
    }
    if (!s || s.type !== forventetType(f.sti) || s.tekst !== f.tekst) return [f];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Enheter: hver sti er knyttet til én bestemt enhet i sin deltekst.
// ---------------------------------------------------------------------------

type Finn = (deltekst: string) => string | undefined;

function fang(mønster: RegExp, gruppe = 1): Finn {
  return (deltekst) => mønster.exec(deltekst)?.[gruppe];
}

function listepunkter(deltekst: string): string[] {
  return deltekst.split("\n").filter((linje) => linje.startsWith("- "));
}

/** Første **…** i listepunkt nummer `n`, eventuelt del `del` av en «A / B / C»-etikett. */
function fetIPunkt(n: number, del?: number): Finn {
  return (deltekst) => {
    const fet = /\*\*(.+?)\*\*/.exec(listepunkter(deltekst)[n] ?? "")?.[1];
    return del === undefined ? fet : fet?.split(" / ")[del];
  };
}

/** Første «…» i listepunkt nummer `n`. */
function sitatIPunkt(n: number): Finn {
  return (deltekst) => /«([^«»]+)»/.exec(listepunkter(deltekst)[n] ?? "")?.[1];
}

const KNAPPER = /Knapper: \*([^*]+)\* \/ \*([^*]+)\*/;

const ENHETER: Record<string, { deltekst: string; finn: Finn }> = {
  "LÅS_VALG.oppgave": {
    deltekst: "Fastsatt samtykketekst (FR-35)",
    finn: fang(/Med \*\*([^*]+)\*\* holder du/),
  },
  "LÅS_VALG.hendelse": {
    deltekst: "Fastsatt samtykketekst (FR-35)",
    finn: fang(/Med \*\*([^*]+)\*\* på en hendelse/),
  },
  "KI_PÅMINNELSER.oppgave": { deltekst: "KI-påminnelser", finn: fang(/^- Oppgave: «([^«»]+)»/m) },
  "KI_PÅMINNELSER.hendelse.tekst": {
    deltekst: "KI-påminnelser",
    finn: fang(/^- Hendelse: «([^«»]+)»/m),
  },
  "KI_PÅMINNELSER.hendelse.advarsel": {
    deltekst: "KI-påminnelser",
    finn: fang(/^- Hendelse: «[^«»]+» og «([^«»]+)»/m),
  },
  "KI_PÅMINNELSER.oppgaveLåst": { deltekst: "KI-påminnelser", finn: fang(/«([^«»]+)» \(oppgave\)/) },
  "KI_PÅMINNELSER.hendelseLåst": {
    deltekst: "KI-påminnelser",
    finn: fang(/«([^«»]+)» \(hendelse\)/),
  },
  "PERSONVERN_VALG.kiForslag": { deltekst: "Innhold i Personvern og data", finn: fetIPunkt(0) },
  "PERSONVERN_VALG.sendAldriNotater": {
    deltekst: "Innhold i Personvern og data",
    finn: fetIPunkt(1),
  },
  "PERSONVERN_VALG.sendHendelsestitler.etikett": {
    deltekst: "Innhold i Personvern og data",
    finn: fetIPunkt(2),
  },
  "PERSONVERN_VALG.sendHendelsestitler.hjelpetekst": {
    deltekst: "Innhold i Personvern og data",
    finn: sitatIPunkt(2),
  },
  "PERSONVERN_VALG.samtykkestatus": { deltekst: "Innhold i Personvern og data", finn: fetIPunkt(3) },
  "PERSONVERN_VALG.eksporter": { deltekst: "Innhold i Personvern og data", finn: fetIPunkt(4, 0) },
  "PERSONVERN_VALG.importer": { deltekst: "Innhold i Personvern og data", finn: fetIPunkt(4, 1) },
  "PERSONVERN_VALG.slettAlleData": {
    deltekst: "Innhold i Personvern og data",
    finn: fetIPunkt(4, 2),
  },
  "PERSONVERN_VALG.hvaSendesTilKi": { deltekst: "Hva sendes til KI", finn: fang(/^\*\*([^*]+)\*\*/) },
  "PERSONVERN_VALG.lagring": { deltekst: "Lagring", finn: fang(/^\*\*([^*]+)\*\*/) },
  "PERSONVERN_VALG.personvernerklæring": {
    deltekst: "Innhold i Personvern og data",
    finn: sitatIPunkt(5),
  },
  "HVA_SENDES_TIL_KI.navnelinjeFR42": {
    deltekst: "Lagring",
    finn: fang(/Da byttes den til: «([^«»]+)»/),
  },
  "IMPORT_DIALOG.knapper.avbryt": { deltekst: "Import (dialog)", finn: fang(KNAPPER, 1) },
  "IMPORT_DIALOG.knapper.importer": { deltekst: "Import (dialog)", finn: fang(KNAPPER, 2) },
  "IMPORT_DIALOG.suksess": { deltekst: "Import (dialog)", finn: fang(/Suksess: «([^«»]+)»/) },
  "IMPORT_DIALOG.feil": { deltekst: "Import (dialog)", finn: fang(/Feil: «([^«»]+)»/) },
  "SLETT_ALLE_DATA_DIALOG.knapper.avbryt": {
    deltekst: "Slett alle data (dialog)",
    finn: fang(KNAPPER, 1),
  },
  "SLETT_ALLE_DATA_DIALOG.knapper.slettAlt": {
    deltekst: "Slett alle data (dialog)",
    finn: fang(KNAPPER, 2),
  },
};

// ---------------------------------------------------------------------------
// Seksjon og deltekster
// ---------------------------------------------------------------------------

/** Henter seksjonen med de fastsatte tekstene, til neste `## `-overskrift. */
function hentSeksjon(markdown: string): string {
  const linjer = markdown.split("\n");
  const start = linjer.findIndex((linje) => linje.trim() === SEKSJON);
  if (start === -1) {
    throw new Error(`Fant ikke overskriften «${SEKSJON}» i EXPERIENCE.md.`);
  }
  const slutt = linjer.findIndex((linje, i) => i > start && linje.startsWith("## "));
  return linjer.slice(start + 1, slutt === -1 ? undefined : slutt).join("\n");
}

/** Deler seksjonen i deltekster etter linjene som begynner med en utheving. */
function delSeksjon(seksjon: string): Map<string, string> {
  const deltekster = new Map<string, string>();
  let navn: string | null = null;
  let linjer: string[] = [];
  const lagre = () => {
    if (navn === null) return;
    if (deltekster.has(navn)) {
      throw new Error(`Deltteksten «${navn}» står to ganger i EXPERIENCE.md.`);
    }
    deltekster.set(navn, linjer.join("\n"));
  };
  for (const linje of seksjon.split("\n")) {
    const overskrift = /^\*\*(.+?)\*\*/.exec(linje);
    if (overskrift) {
      lagre();
      navn = overskrift[1];
      linjer = [];
    }
    linjer.push(linje);
  }
  lagre();
  return deltekster;
}

/** Samler alle strenger rekursivt med sti, i rekkefølge. */
function samleStrenger(verdi: unknown, sti: string, ut: Avvik[] = []): Avvik[] {
  if (typeof verdi === "string") {
    ut.push({ sti, tekst: verdi });
  } else if (Array.isArray(verdi)) {
    verdi.forEach((v, i) => samleStrenger(v, `${sti}[${i}]`, ut));
  } else if (verdi !== null && typeof verdi === "object") {
    for (const [nøkkel, v] of Object.entries(verdi)) {
      samleStrenger(v, sti ? `${sti}.${nøkkel}` : nøkkel, ut);
    }
  }
  return ut;
}

function blokkFor(sti: string): string | undefined {
  return Object.keys(BLOKKER).find(
    (rot) => sti === rot || sti.startsWith(`${rot}.`) || sti.startsWith(`${rot}[`),
  );
}

/** Returnerer hver fastsatt streng som avviker fra EXPERIENCE.md. */
function finnAvvik(markdown: string, konstanter: Record<string, unknown> = tekster): Avvik[] {
  const deltekster = delSeksjon(hentSeksjon(lf(markdown)));
  const avvik: Avvik[] = [];
  const blokkfelt = new Map<string, Avvik[]>();
  const sett = new Set<string>();

  for (const [navn, verdi] of Object.entries(konstanter)) {
    if (typeof verdi === "function" || typeof verdi === "number") continue;
    for (const streng of samleStrenger(verdi, navn)) {
      sett.add(streng.sti);
      const enhet = ENHETER[streng.sti];
      const blokk = blokkFor(streng.sti);
      if (enhet) {
        const deltekst = deltekster.get(enhet.deltekst);
        const funnet = deltekst === undefined ? undefined : enhet.finn(deltekst);
        if (funnet === undefined || mellomrom(funnet) !== streng.tekst) avvik.push(streng);
      } else if (blokk) {
        blokkfelt.set(blokk, [...(blokkfelt.get(blokk) ?? []), streng]);
      } else {
        avvik.push(streng); // ingen regel
      }
    }
  }

  for (const sti of Object.keys(ENHETER)) {
    if (!sett.has(sti)) avvik.push({ sti, tekst: "(mangler i tekster.ts)" });
  }

  for (const [rot, navn] of Object.entries(BLOKKER)) {
    const felt = blokkfelt.get(rot);
    const deltekst = deltekster.get(navn);
    if (!felt) {
      avvik.push({ sti: rot, tekst: "(mangler i tekster.ts)" });
    } else if (deltekst === undefined) {
      avvik.push(...felt);
    } else {
      avvik.push(...sjekkBlokk(felt, blokksegmenter(deltekst)));
    }
  }

  return avvik;
}

// ---------------------------------------------------------------------------
// Tester
// ---------------------------------------------------------------------------

function medEndring(markdown: string, fra: string, til: string): string {
  expect(markdown).toContain(fra);
  return markdown.replace(fra, til);
}

function stier(avvik: Avvik[]): string[] {
  return avvik.map((a) => a.sti);
}

type Objekt = { [nøkkel: string]: unknown };

/** Dyp kopi av konstantene som testene kan endre. */
function kopi(): Objekt {
  return Object.fromEntries(
    Object.entries(tekster).map(([navn, verdi]) => [
      navn,
      typeof verdi === "function" ? verdi : structuredClone(verdi),
    ]),
  );
}

function hent(k: Objekt, sti: string): Objekt {
  return sti.split(".").reduce((o, nøkkel) => o[nøkkel] as Objekt, k);
}

describe("fastsatte tekster", () => {
  it("er ordrett like EXPERIENCE.md", () => {
    expect(finnAvvik(EXPERIENCE)).toEqual([]);
  });

  it("dekker alle tekstene story 3.1 og 1.3 nevner", () => {
    expect(Object.keys(tekster).sort()).toEqual(
      [
        "DEMO_ADVARSEL",
        "EKSPORT_ADVARSEL",
        "FEILSIDE",
        "GJELDENDE_SAMTYKKEVERSJON",
        "HVA_SENDES_TIL_KI",
        "IMPORT_DIALOG",
        "KI_PÅMINNELSER",
        "LAGRING",
        "LAGRINGSBANNER",
        "LÅS_VALG",
        "PERSONVERN_VALG",
        "SAMTYKKETEKST",
        "SLETT_ALLE_DATA_DIALOG",
        "oppgavePåminnelse",
      ].sort(),
    );
  });

  it("feiler med tydelig melding når seksjonen mangler", () => {
    const uten = EXPERIENCE.replace(SEKSJON, "## Noe annet");
    expect(() => finnAvvik(uten)).toThrow(/Personvern og data – fastsatte tekster/);
  });

  it("feiler med tydelig melding når en deltekst står to ganger", () => {
    const md = medEndring(EXPERIENCE, "**Lagring**\n", "**Lagring**\n\n**Lagring**\n");
    expect(() => finnAvvik(md)).toThrow(/«Lagring» står to ganger/);
  });

  it("tåler CRLF-linjeskift fra Windows", () => {
    expect(EXPERIENCE).not.toContain("\r");
    const crlf = EXPERIENCE.replace(/\n/g, "\r\n");
    expect(lf(crlf)).toBe(EXPERIENCE);
    expect(finnAvvik(crlf)).toEqual([]);
    const dobbel = medEndring(crlf, "**Lagring**\r\n", "**Lagring**\r\n\r\n**Lagring**\r\n");
    expect(() => finnAvvik(dobbel)).toThrow(/«Lagring» står to ganger/);
    const endret = medEndring(crlf, "Anthropic, selskapet bak", "Anthropic, firmaet bak");
    expect(stier(finnAvvik(endret))).toEqual(["SAMTYKKETEKST.hvemFårDet.tekst"]);
  });

  describe("oppdager avvik i EXPERIENCE.md", () => {
    it("ett ord endret", () => {
      const md = medEndring(EXPERIENCE, "Anthropic, selskapet bak", "Anthropic, firmaet bak");
      expect(stier(finnAvvik(md))).toEqual(["SAMTYKKETEKST.hvemFårDet.tekst"]);
    });

    it("en setning fjernet", () => {
      const md = medEndring(
        EXPERIENCE,
        "bruksreglene. Det som er sendt, kan ikke slettes fra appen.",
        "bruksreglene.",
      );
      expect(stier(finnAvvik(md))).toEqual(["SAMTYKKETEKST.hvorLenge.tekst"]);
    });

    it("en setning lagt til", () => {
      const md = medEndring(
        EXPERIENCE,
        "hvis det flagges for brudd på bruksreglene.",
        "hvis det flagges for brudd på bruksreglene. Ingenting lagres på serveren.",
      );
      expect(stier(finnAvvik(md))).toEqual(["LAGRING.tekst"]);
    });

    it("en endret knapp", () => {
      const md = medEndring(
        EXPERIENCE,
        "Knapper: *Avbryt* / *Importer*",
        "Knapper: *Avbryt* / *Importér*",
      );
      expect(stier(finnAvvik(md))).toEqual(["IMPORT_DIALOG.knapper.importer"]);
    });
  });

  describe("oppdager avvik i konstantene", () => {
    it("avkortet tekst", () => {
      const k = kopi();
      hent(k, "SAMTYKKETEKST.hvorLenge").tekst = SAMTYKKETEKST.hvorLenge.tekst.replace(
        " Det som er sendt, kan ikke slettes fra appen.",
        "",
      );
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["SAMTYKKETEKST.hvorLenge.tekst"]);
    });

    it("manglende blokkfelt", () => {
      const k = kopi();
      delete hent(k, "SAMTYKKETEKST").navnSendesAldri;
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["SAMTYKKETEKST.hvemFårDet.tittel"]);
    });

    it("manglende enhetsfelt", () => {
      const k = kopi();
      delete hent(k, "IMPORT_DIALOG").feil;
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["IMPORT_DIALOG.feil"]);
    });

    it("ombyttede knapper i samtykket", () => {
      const k = kopi();
      hent(k, "SAMTYKKETEKST").knapper = {
        nei: SAMTYKKETEKST.knapper.ja,
        ja: SAMTYKKETEKST.knapper.nei,
      };
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["SAMTYKKETEKST.knapper.nei"]);
    });

    it.each([
      ["IMPORT_DIALOG", "suksess", "feil"],
      ["KI_PÅMINNELSER", "oppgaveLåst", "hendelseLåst"],
      ["SLETT_ALLE_DATA_DIALOG.knapper", "avbryt", "slettAlt"],
    ])("ombyttede enheter i %s: %s og %s", (rot, a, b) => {
      const k = kopi();
      const o = hent(k, rot);
      [o[a], o[b]] = [o[b], o[a]];
      expect(stier(finnAvvik(EXPERIENCE, k)).sort()).toEqual([`${rot}.${a}`, `${rot}.${b}`].sort());
    });

    it("felt satt til en annen enhet i samme deltekst", () => {
      const k = kopi();
      hent(k, "PERSONVERN_VALG").kiForslag = "Samtykkestatus";
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["PERSONVERN_VALG.kiForslag"]);
    });

    it("kort etikett som bare stemmer et annet sted i seksjonen", () => {
      const k = kopi();
      hent(k, "IMPORT_DIALOG.knapper").importer = "Slett alt";
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["IMPORT_DIALOG.knapper.importer"]);
    });

    it("punkt flyttet fra ✕ til ✓", () => {
      const k = kopi();
      const o = hent(k, "HVA_SENDES_TIL_KI");
      const [flyttet, ...resten] = o.sendesIkke as string[];
      o.sendes = [...(o.sendes as string[]), flyttet];
      o.sendesIkke = resten;
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["HVA_SENDES_TIL_KI.sendes[4]"]);
    });

    it("setning flyttet inn i punktlisten", () => {
      const k = kopi();
      const o = hent(k, "SAMTYKKETEKST");
      const hvaSendes = o.hvaSendes as Objekt;
      hvaSendes.punkter = [...(hvaSendes.punkter as string[]), o.navnSendesAldri];
      delete o.navnSendesAldri;
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["SAMTYKKETEKST.hvaSendes.punkter[3]"]);
    });

    it("utheving gjort om til vanlig tekst", () => {
      const k = kopi();
      const duBestemmer = hent(k, "SAMTYKKETEKST.duBestemmer");
      const deler = [...(duBestemmer.deler as unknown[])];
      deler[1] = (deler[1] as { uthevet: string }).uthevet;
      duBestemmer.deler = deler;
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["SAMTYKKETEKST.duBestemmer.deler[1]"]);
    });

    it("markdown eller doble mellomrom i en konstant", () => {
      const k = kopi();
      hent(k, "LAGRING").tekst = `*${(hent(k, "LAGRING").tekst as string).replace(" ", "  ")}*`;
      hent(k, "PERSONVERN_VALG").lagring = "**Lagring**";
      expect(stier(finnAvvik(EXPERIENCE, k)).sort()).toEqual(
        ["LAGRING.tekst", "PERSONVERN_VALG.lagring"].sort(),
      );
    });

    it("tekst uten regel", () => {
      const k = { ...kopi(), NY_TEKST: { tekst: "Hei" } };
      expect(stier(finnAvvik(EXPERIENCE, k))).toEqual(["NY_TEKST.tekst"]);
    });
  });
});

describe("oppgavePåminnelse", () => {
  it("med notater", () => {
    expect(oppgavePåminnelse(false)).toBe(
      "Teksten og notatene sendes til KI (Claude) for å lage forslag.",
    );
  });

  it("uten notater", () => {
    expect(oppgavePåminnelse(true)).toBe("Teksten sendes til KI (Claude) for å lage forslag.");
  });
});

describe("GJELDENDE_SAMTYKKEVERSJON", () => {
  it("hører til den gjeldende samtykketeksten", () => {
    const hash = createHash("sha256").update(JSON.stringify(SAMTYKKETEKST)).digest("hex");
    expect(
      hash,
      `SAMTYKKETEKST er endret. Øk GJELDENDE_SAMTYKKEVERSJON i kjerne/tekster.ts og legg inn den nye hashen for versjonen i SAMTYKKEHASHER.`,
    ).toBe(SAMTYKKEHASHER[GJELDENDE_SAMTYKKEVERSJON]);
  });
});

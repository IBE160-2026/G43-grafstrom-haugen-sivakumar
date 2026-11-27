import type { z } from "zod";
import type {
  etikettSkjema,
  OppgaveForslag,
  prioritetSkjema,
} from "./skjema";

/**
 * Reserveløsningen (AD-8, FR-16–18): regelbaserte forslag til etikett og
 * prioritet ut fra nøkkelord i oppgaveteksten, og tabellen kalltype × årsak
 * som avgjør hvilke felt som får forslag.
 *
 * Ren TypeScript: ingen import fra React, Next eller `lib/`. Ingen klokke,
 * tilfeldighet eller tilstand, så samme tekst gir alltid samme svar.
 *
 * `Årsak` og `Feltnavn` defineres her fordi `kjerne/ki-kontrakt.ts` (4.1) ikke
 * finnes ennå. 4.1 bør importere dem herfra, slik at det bare finnes én liste.
 */

type Etikett = z.infer<typeof etikettSkjema>;
type Prioritet = z.infer<typeof prioritetSkjema>;

/** Årsakene i et `reserve`-svar fra `/api/ki` (AD-6). */
export const ÅRSAKER = [
  "ingen-nokkel",
  "tidsavbrudd",
  "tomt",
  "ugyldig",
  "avvist",
  "api-feil",
  "kallgrense",
] as const;

export type Årsak = (typeof ÅRSAKER)[number];

/** Feltene et forslagskall kan be om (AD-6). */
export type Feltnavn = "etikett" | "prioritet" | "sammendrag";

/** Formen til `oppgave.forslag.felt` i skjemaet. */
export type Feltforslag = NonNullable<OppgaveForslag>["felt"];

/** Kallet som ble gjort. */
export type Kall =
  | {
      type: "forslag";
      ønsker: { felt: readonly Feltnavn[]; økter: boolean };
    }
  | { type: "nyTid" };

/** Utfallet av kallet: reserve med årsak, eller `ok` med forkastede felt. */
export type Utfall =
  | { type: "reserve"; årsak: Årsak }
  | { type: "ok"; forkastet: readonly Feltnavn[] };

/**
 * Hvilke felt reserveløsningen fyller:
 * - `ønsket`: feltene kallet ba om
 * - `forkastet`: feltene i `forkastet` fra et `ok`-svar
 * - `ingen`: ingen forslag
 *
 * Uansett regel får bare etikett og prioritet forslag, aldri sammendrag,
 * frist eller økter (FR-17).
 */
export type Reserveregel = "ønsket" | "forkastet" | "ingen";

/** Tabellen kalltype × årsak (AD-8). Én kilde for visning og flyt i 4.7. */
export const RESERVETABELL = {
  forslag: {
    "ingen-nokkel": "ønsket",
    tidsavbrudd: "ønsket",
    tomt: "ønsket",
    ugyldig: "ønsket",
    avvist: "ønsket",
    "api-feil": "ønsket",
    kallgrense: "ønsket",
    forkastet: "forkastet",
  },
  nyTid: {
    "ingen-nokkel": "ingen",
    tidsavbrudd: "ingen",
    tomt: "ingen",
    ugyldig: "ingen",
    avvist: "ingen",
    "api-feil": "ingen",
    kallgrense: "ingen",
    forkastet: "ingen",
  },
} as const satisfies Record<
  Kall["type"],
  Record<Årsak | "forkastet", Reserveregel>
>;

/**
 * Nøkkelordene (Å-7). Et nøkkelord treffer når et ord i teksten starter med
 * det, uten forskjell på store og små bokstaver. Uttrykk med flere ord må stå
 * etter hverandre, og hvert ord må stå nøyaktig slik.
 */
export const NØKKELORD = {
  etikett: {
    Skole: [
      "eksamen",
      "innlevering",
      "oblig",
      "forelesning",
      "seminar",
      "kollokvie",
      "pensum",
      "kapittel",
      "lærebok",
      "gruppeprosjekt",
      "gruppearbeid",
      "canvas",
      "emne",
      "repeter",
      "skole",
      "studiet",
    ],
    Jobb: [
      "jobb",
      "sjef",
      "vakt",
      "ekstravakt",
      "timelist",
      "lønn",
      "kollega",
      "kunde",
      "personalmøte",
      "arbeid",
      "skift",
      "turnus",
    ],
    Privat: [
      "husleie",
      "regning",
      "betale",
      "handle",
      "middag",
      "lege",
      "fastlege",
      "tannlege",
      "trening",
      "vaske",
      "rydde",
      "klær",
      "bursdag",
      "gave",
      "mamma",
      "pappa",
      "familie",
      "venn",
      "studielån",
      "lånekassen",
      "busskort",
      "frisør",
    ],
  },
  prioritet: {
    Høy: [
      "eksamen",
      "levere",
      "innlevering",
      "frist",
      "haster",
      "viktig",
      "i dag",
      "i kveld",
      "betale",
      "husleie",
      "går ut",
    ],
    Lav: [
      "kanskje",
      "en gang",
      "etter hvert",
      "når jeg har tid",
      "sjekke",
      "rydde",
      "vaske",
    ],
  },
} as const satisfies {
  etikett: Record<Etikett, readonly string[]>;
  prioritet: Record<Exclude<Prioritet, "Middels">, readonly string[]>;
};

/** Emnekoder som IBE160 eller MAT1001 teller som Skole. */
const EMNEKODE = /^\p{L}{2,4}\d{3,4}$/u;

function tilOrd(tekst: string): string[] {
  return tekst
    .normalize("NFC")
    .toLocaleLowerCase("nb")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((ord) => ord.length > 0);
}

/** Om nøkkelordet treffer med start i ord nummer `i`. */
function treffer(ord: readonly string[], i: number, nøkkelord: string): boolean {
  const deler = nøkkelord.split(" ");
  if (i + deler.length > ord.length) return false;
  if (deler.length === 1) return ord[i].startsWith(nøkkelord);
  return deler.every((del, j) => ord[i + j] === del);
}

/** Antall ord i teksten der minst ett av nøkkelordene treffer. */
function antallTreff(ord: readonly string[], nøkkelord: readonly string[]): number {
  let antall = 0;
  for (let i = 0; i < ord.length; i++) {
    if (nøkkelord.some((n) => treffer(ord, i, n))) antall++;
  }
  return antall;
}

function foreslåEtikett(ord: readonly string[]): Etikett | null {
  const treff = (Object.keys(NØKKELORD.etikett) as Etikett[]).map(
    (etikett) => {
      let antall = antallTreff(ord, NØKKELORD.etikett[etikett]);
      if (etikett === "Skole") {
        antall += ord.filter((o) => EMNEKODE.test(o)).length;
      }
      return { etikett, antall };
    },
  );
  const høyest = Math.max(...treff.map((t) => t.antall));
  if (høyest === 0) return null;
  const vinnere = treff.filter((t) => t.antall === høyest);
  // Uavgjort gir ingen etikett.
  return vinnere.length === 1 ? vinnere[0].etikett : null;
}

function foreslåPrioritet(ord: readonly string[]): Prioritet {
  // Høy vinner over Lav når begge treffer.
  if (antallTreff(ord, NØKKELORD.prioritet.Høy) > 0) return "Høy";
  if (antallTreff(ord, NØKKELORD.prioritet.Lav) > 0) return "Lav";
  return "Middels";
}

/** Etikett når reglene finner en, og alltid en prioritet. */
export type Nøkkelordforslag = {
  etikett?: NonNullable<Feltforslag["etikett"]>;
  prioritet: NonNullable<Feltforslag["prioritet"]>;
};

/**
 * Regelbaserte forslag til etikett og prioritet ut fra oppgaveteksten.
 * Uten treff: ingen etikett, og prioriteten foreslås som Middels.
 */
export function nøkkelordforslag(
  tekst: string,
): Nøkkelordforslag {
  const ord = tilOrd(tekst);
  const etikett = foreslåEtikett(ord);
  return {
    ...(etikett ? { etikett: { verdi: etikett, kilde: "regelbasert" } } : {}),
    prioritet: { verdi: foreslåPrioritet(ord), kilde: "regelbasert" },
  };
}

/**
 * Feltforslagene reserveløsningen gir for et kall og utfallet av det, etter
 * `RESERVETABELL`. Bare etikett og prioritet kan få forslag. Gir et tomt
 * objekt når ingen felt skal ha forslag.
 */
export function reserve(kall: Kall, utfall: Utfall, tekst: string): Feltforslag {
  const regel: Reserveregel =
    RESERVETABELL[kall.type][
      utfall.type === "ok" ? "forkastet" : utfall.årsak
    ];
  const felt: readonly Feltnavn[] =
    regel === "ingen"
      ? []
      : regel === "forkastet"
        ? utfall.type === "ok"
          ? utfall.forkastet
          : []
        : kall.type === "forslag"
          ? kall.ønsker.felt
          : [];

  const forslag = nøkkelordforslag(tekst);
  const resultat: Feltforslag = {};
  if (felt.includes("etikett") && forslag.etikett) {
    resultat.etikett = forslag.etikett;
  }
  if (felt.includes("prioritet")) {
    resultat.prioritet = forslag.prioritet;
  }
  return resultat;
}

import type { Oppgave } from "./skjema";
import { dagnummer, lokalDato, ukedag } from "./tid";

/**
 * De fem smarte listene (FR-20–24, AD-1, AD-5). Ren TypeScript: «nå» kommer
 * alltid inn som parameter, og listene regnes ut hver gang og lagres aldri.
 * Uka går mandag–søndag, og alle dager regnes på lokal dato (`YYYY-MM-DD`).
 */

/** Listene i fast rekkefølge. */
export const LISTER = ["Forfalt", "I dag", "Denne uken", "Senere", "Ingen frist"] as const;

export type Liste = (typeof LISTER)[number];

/**
 * Et element i en liste. 6.1 legger til `{ type: "økt", … }` (teller i
 * `antall`), og 5.4 legger hendelser øverst i «I dag» uten å telle.
 */
export type Listeelement = { type: "oppgave"; oppgave: Oppgave };

export type SmartListe = {
  liste: Liste;
  elementer: Listeelement[];
  /** Antallet i overskriften. */
  antall: number;
};

/** Dager fra lokal dato i `nå` til `frist`. Negativt når fristen er passert. */
function dagerTil(frist: string, nå: Date): number {
  return dagnummer(frist) - dagnummer(lokalDato(nå));
}

/** Dager fra `nå` til søndag samme uke (0 på søndag). */
function dagerTilSøndag(nå: Date): number {
  return 6 - ukedag(lokalDato(nå));
}

/** Hvilken liste en oppgave med `frist` hører til, sett fra `nå`. */
export function listeFor(frist: string | null, nå: Date): Liste {
  if (frist === null) return "Ingen frist";
  const dager = dagerTil(frist, nå);
  if (dager < 0) return "Forfalt";
  if (dager === 0) return "I dag";
  if (dager <= dagerTilSøndag(nå)) return "Denne uken";
  return "Senere";
}

const PRIORITETSRANG: Record<Oppgave["prioritet"], number> = { Høy: 0, Middels: 1, Lav: 2 };

/**
 * Standardrekkefølgen: frist stigende (uten frist sist), så prioritet
 * Høy → Middels → Lav, så `createdAt` eldste først. ID til slutt, så
 * rekkefølgen alltid er den samme. Brukes også av sorteringen i 2.5.
 */
export function sammenlignOppgaver(a: Oppgave, b: Oppgave): number {
  if (a.frist !== b.frist) {
    if (a.frist === null) return 1;
    if (b.frist === null) return -1;
    return a.frist < b.frist ? -1 : 1;
  }
  const prioritet = PRIORITETSRANG[a.prioritet] - PRIORITETSRANG[b.prioritet];
  if (prioritet !== 0) return prioritet;
  const opprettet = Date.parse(a.createdAt) - Date.parse(b.createdAt);
  if (opprettet !== 0) return opprettet;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/**
 * Alle fem listene i fast rekkefølge, også de tomme. Fullførte oppgaver er
 * utelatt, og hver aktiv oppgave ligger i nøyaktig én liste. Tar et objekt
 * så økter (6.1) og hendelser (5.4) kan legges til.
 */
export function smarteLister({ oppgaver }: { oppgaver: readonly Oppgave[] }, nå: Date): SmartListe[] {
  const grupper = new Map<Liste, Oppgave[]>(LISTER.map((liste) => [liste, []]));
  for (const oppgave of oppgaver) {
    if (oppgave.fullført !== null) continue;
    grupper.get(listeFor(oppgave.frist, nå))!.push(oppgave);
  }
  return LISTER.map((liste) => {
    const elementer = grupper
      .get(liste)!
      .sort(sammenlignOppgaver)
      .map((oppgave): Listeelement => ({ type: "oppgave", oppgave }));
    return { liste, elementer, antall: elementer.length };
  });
}

const UKEDAGER = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"] as const;
const MÅNEDER = [
  "jan", "feb", "mars", "apr", "mai", "juni",
  "juli", "aug", "sep", "okt", "nov", "des",
] as const;

/**
 * Fristmerkelappen på kortet. Relative ord vinner over dato: «i går»,
 * ingen merkelapp i dag (overskriften sier det), «i morgen» (også i Senere på
 * søndag), ukedag resten av uka, ellers «18. nov» med år når året ikke er det
 * samme som i `nå`. Ingen frist gir ingen merkelapp. Skrives ut her, uten
 * språk-API-er, så resultatet ikke avhenger av nettleserens språk.
 */
export function fristMerkelapp(frist: string | null, nå: Date): string | null {
  if (frist === null) return null;
  const dager = dagerTil(frist, nå);
  if (dager === 0) return null;
  if (dager === -1) return "i går";
  if (dager === 1) return "i morgen";
  if (dager > 1 && dager <= dagerTilSøndag(nå)) return UKEDAGER[ukedag(frist)];
  const [år, måned, dag] = frist.split("-").map(Number);
  const dato = `${dag}. ${MÅNEDER[måned - 1]}`;
  return år === nå.getFullYear() ? dato : `${dato} ${år}`;
}

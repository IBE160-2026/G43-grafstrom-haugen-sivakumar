import { slutterNesteDag } from "./hendelser";
import type { Hendelse, Økt, ØktForslag } from "./skjema";
import { lokalDato, lokaltKlokkeslett, tilMinutter } from "./tid";

/**
 * Øktgrensene for KI-forslag (AD-1, AD-5, FR-49): sjekker ett øktforslag og
 * kontrollerer en hel liste. Samme regel brukes av serveren (6.5) og ved
 * godtak (6.6).
 *
 * Ren TypeScript: ingen import fra React, Next eller `lib/`. «Nå» kommer inn
 * som parameter. Tidene regnes som veggklokkeminutter (`tilMinutter`), og
 * intervallene er halvåpne `[start, slutt)`, så kant i kant er ikke overlapp.
 * Nattevaktregelen bruker bare klokkeslett, aldri titler.
 *
 * Forutsetninger: forslag, hendelser og økter er validert med skjemaene
 * (gyldig `YYYY-MM-DD` og `HH:mm`, AD-6/AD-7). Ved godtak (6.6) skal økta som
 * sjekkes på nytt, ikke være med i `godtatteØkter`.
 */

/** Årsakene i rekkefølgen reglene sjekkes. Første brudd gir årsaken. */
export const ØKTÅRSAKER = [
  "varighet",
  "utenfor-dagtid",
  "fortid",
  "etter-frist",
  "overlapp-hendelse",
  "overlapp-økt",
  "etter-nattevakt",
] as const;

export type Øktårsak = (typeof ØKTÅRSAKER)[number];

/** Årsak i kontrollen av en liste: også `for-mange` for overskytende forslag. */
export type Kontrollårsak = Øktårsak | "for-mange";

/** Høyst så mange forslag beholdes. */
export const MAKS_ØKTER = 5;

const MIN_VARIGHET = 30;
const MAKS_VARIGHET = 3 * 60;
const DAGTID_START = "07:00";
const DAGTID_SLUTT = "23:00";
/** Ingen økt de første 8 timene etter en hendelse som slutter neste dag. */
const HVILE_ETTER_NATT = 8 * 60;
const MINUTTER_PER_DØGN = 24 * 60;

type DatertTidsrom = Pick<ØktForslag, "dato" | "start" | "slutt">;

export type Øktkontekst = {
  hendelser: readonly Pick<Hendelse, "dato" | "start" | "slutt">[];
  godtatteØkter: readonly Pick<Økt, "dato" | "start" | "slutt">[];
  /** Fristdagen (`YYYY-MM-DD`). */
  frist: string;
  nå: Date;
};

export type Sjekkresultat = { ok: true } | { ok: false; årsak: Øktårsak };

export type Kontrollresultat<T> = {
  beholdt: T[];
  forkastet: { forslag: T; årsak: Kontrollårsak }[];
};

type Intervall = { start: number; slutt: number };

/** Halvåpent intervall i veggklokkeminutter. Slutt før start betyr neste dag. */
function intervall(t: DatertTidsrom): Intervall {
  const start = tilMinutter(t.dato, t.start);
  const slutt =
    tilMinutter(t.dato, t.slutt) + (slutterNesteDag(t) ? MINUTTER_PER_DØGN : 0);
  return { start, slutt };
}

function overlapper(a: Intervall, b: Intervall): boolean {
  return a.start < b.slutt && b.start < a.slutt;
}

/** Sjekker ett øktforslag mot FR-49. */
export function sjekkØktforslag(
  forslag: DatertTidsrom,
  kontekst: Øktkontekst,
): Sjekkresultat {
  const start = tilMinutter(forslag.dato, forslag.start);
  const slutt = tilMinutter(forslag.dato, forslag.slutt);
  const varighet = slutt - start;

  // Slutt ≤ start gir varighet ≤ 0, og dermed også `varighet`.
  if (varighet < MIN_VARIGHET || varighet > MAKS_VARIGHET) {
    return { ok: false, årsak: "varighet" };
  }
  if (
    start < tilMinutter(forslag.dato, DAGTID_START) ||
    slutt > tilMinutter(forslag.dato, DAGTID_SLUTT)
  ) {
    return { ok: false, årsak: "utenfor-dagtid" };
  }
  const nå = tilMinutter(
    lokalDato(kontekst.nå),
    lokaltKlokkeslett(kontekst.nå),
  );
  if (start < nå) return { ok: false, årsak: "fortid" };
  if (forslag.dato > kontekst.frist) return { ok: false, årsak: "etter-frist" };

  const økt: Intervall = { start, slutt };
  if (kontekst.hendelser.some((h) => overlapper(økt, intervall(h)))) {
    return { ok: false, årsak: "overlapp-hendelse" };
  }
  if (kontekst.godtatteØkter.some((g) => overlapper(økt, intervall(g)))) {
    return { ok: false, årsak: "overlapp-økt" };
  }
  const etterNatt = kontekst.hendelser.some((h) => {
    if (!slutterNesteDag(h)) return false;
    const { slutt: hvileStart } = intervall(h);
    return overlapper(økt, {
      start: hvileStart,
      slutt: hvileStart + HVILE_ETTER_NATT,
    });
  });
  if (etterNatt) return { ok: false, årsak: "etter-nattevakt" };

  return { ok: true };
}

/**
 * Kontrollerer en liste med forslag: forkaster ugyldige én og én, og beholder
 * så de første `MAKS_ØKTER` gyldige i rekkefølgen fra svaret. Overskytende
 * gyldige får `for-mange`. Forslagene gis tilbake uendret. Overlapp mellom
 * forslagene sjekkes ikke.
 */
export function kontrollerØktforslag<T extends DatertTidsrom>(
  forslag: readonly T[],
  kontekst: Øktkontekst,
): Kontrollresultat<T> {
  const beholdt: T[] = [];
  const forkastet: Kontrollresultat<T>["forkastet"] = [];
  for (const f of forslag) {
    const resultat = sjekkØktforslag(f, kontekst);
    if (!resultat.ok) forkastet.push({ forslag: f, årsak: resultat.årsak });
    else if (beholdt.length >= MAKS_ØKTER)
      forkastet.push({ forslag: f, årsak: "for-mange" });
    else beholdt.push(f);
  }
  return { beholdt, forkastet };
}

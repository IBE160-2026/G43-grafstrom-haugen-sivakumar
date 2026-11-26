import { migrer } from "@/kjerne/migrering";
import type { Dokument } from "@/kjerne/skjema";

/** Den ene localStorage-nøkkelen hele dokumentet ligger under. */
export const LAGRINGSNØKKEL = "duenext";

export type LesResultat =
  | { type: "ok"; dokument: Dokument; lagringFeilet: boolean }
  | { type: "for-ny"; rå: string }
  | { type: "ugyldig"; rå: string }
  | { type: "lesefeil" };

export type SkrivResultat = { ok: true } | { ok: false; feil: "lagring-feilet" };

export type Lagring = {
  les(): LesResultat;
  skriv(dokument: Dokument): SkrivResultat;
};

/**
 * Lager en lagringsadapter rundt en `Storage`. `hentStorage` kalles først ved
 * bruk og inni try/catch, så blokkert eller manglende lagring gir navngitte
 * feil i stedet for unntak. Ved `for-ny`, `ugyldig` og `lesefeil` skrives aldri noe.
 */
export function lagLagring(hentStorage: () => Storage): Lagring {
  function skriv(dokument: Dokument): SkrivResultat {
    try {
      hentStorage().setItem(LAGRINGSNØKKEL, JSON.stringify(dokument));
      return { ok: true };
    } catch {
      return { ok: false, feil: "lagring-feilet" };
    }
  }

  function les(): LesResultat {
    let rå: string | null;
    try {
      rå = hentStorage().getItem(LAGRINGSNØKKEL);
    } catch {
      return { type: "lesefeil" };
    }

    const resultat = migrer(rå);
    if (resultat.type !== "ok") {
      return resultat;
    }

    const lagringFeilet = resultat.endret ? !skriv(resultat.dokument).ok : false;
    return { type: "ok", dokument: resultat.dokument, lagringFeilet };
  }

  return { les, skriv };
}

/** Standardinstansen. Slår opp `window.localStorage` først ved bruk. */
export const lagring: Lagring = lagLagring(() => window.localStorage);

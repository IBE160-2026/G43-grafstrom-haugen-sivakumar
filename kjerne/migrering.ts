import { dokumentSkjema, GJELDENDE_SKJEMAVERSJON, nyttDokument } from "./skjema";
import type { Dokument } from "./skjema";
import type { z } from "zod";

/** Ett migreringstrinn fra versjon `n` til `n + 1`. */
export type Migreringstrinn = (
  dokument: Record<string, unknown>,
) => Record<string, unknown>;

/**
 * Trinn nøklet på versjonen de migrerer fra. Tom i versjon 1.
 * Et trinn fra versjon `n` skal returnere et dokument med `schemaVersion: n + 1`.
 */
export const MIGRERINGER: Readonly<Record<number, Migreringstrinn>> = {};

export type MigreringsResultat =
  | { type: "ok"; dokument: Dokument; endret: boolean }
  | { type: "for-ny"; rå: string }
  | { type: "ugyldig"; rå: string };

function erObjekt(verdi: unknown): verdi is Record<string, unknown> {
  return typeof verdi === "object" && verdi !== null && !Array.isArray(verdi);
}

function erGyldigVersjon(verdi: unknown): verdi is number {
  return typeof verdi === "number" && Number.isInteger(verdi) && verdi >= 1;
}

/**
 * Gjør det lagrede rådokumentet om til et gyldig dokument i gjeldende versjon.
 * Kaster aldri: forventede feil returneres som `for-ny` eller `ugyldig`.
 * `endret` er sann når dokumentet er nytt eller migrert og bør skrives tilbake.
 * Det valgfrie andre argumentet finnes for å teste migreringskjeden.
 */
export function migrer(
  rå: string | null,
  {
    migreringer = MIGRERINGER,
    gjeldende = GJELDENDE_SKJEMAVERSJON,
    skjema = dokumentSkjema,
  }: {
    migreringer?: Readonly<Record<number, Migreringstrinn>>;
    gjeldende?: number;
    skjema?: z.ZodType<Dokument>;
  } = {},
): MigreringsResultat {
  if (rå === null) {
    return { type: "ok", dokument: nyttDokument(), endret: true };
  }

  const ugyldig: MigreringsResultat = { type: "ugyldig", rå };

  let tolket: unknown;
  try {
    tolket = JSON.parse(rå);
  } catch {
    return ugyldig;
  }

  if (!erObjekt(tolket) || !erGyldigVersjon(tolket.schemaVersion)) {
    return ugyldig;
  }

  const fraVersjon = tolket.schemaVersion;
  if (fraVersjon > gjeldende) {
    return { type: "for-ny", rå };
  }

  let dokument: Record<string, unknown> = tolket;
  try {
    for (let versjon = fraVersjon; versjon < gjeldende; versjon++) {
      const trinn = Object.hasOwn(migreringer, versjon)
        ? migreringer[versjon]
        : undefined;
      if (!trinn) return ugyldig;
      const neste = trinn(dokument);
      if (!erObjekt(neste) || neste.schemaVersion !== versjon + 1) return ugyldig;
      dokument = neste;
    }
  } catch {
    return ugyldig;
  }

  const validert = skjema.safeParse(dokument);
  if (!validert.success) {
    return ugyldig;
  }

  return {
    type: "ok",
    dokument: validert.data,
    endret: fraVersjon < gjeldende,
  };
}

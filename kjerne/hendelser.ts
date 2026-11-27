import { hendelseSkjema, type Hendelse } from "./skjema";
import { lokalDato, lokaltKlokkeslett } from "./tid";

/**
 * Hendelsesreglene (AD-1, AD-5, FR-44, FR-45, FR-48): validering av et
 * hendelsesutkast, visning av klokkeslett med «(+1 dag)» og utvalget av
 * dagens hendelser ut fra «nå».
 *
 * Ren TypeScript: ingen import fra React, Next eller `lib/`. «Nå» kommer inn
 * som parameter, og ingen funksjon leser klokka. Datoer er `YYYY-MM-DD` og
 * klokkeslett `HH:mm` i lokal tid. Slutt før start betyr neste dag.
 *
 * Valideringen gir feilkoder, ikke tekster. Tekstene hører til skjemaet (5.3).
 */

/** Feltene valideringen sjekker. */
export const HENDELSESFELT = ["tittel", "dato", "start", "slutt"] as const;

export type Hendelsesfelt = (typeof HENDELSESFELT)[number];

/** Feilkodene valideringen kan gi. */
export const HENDELSESFEIL = ["påkrevd", "ugyldig", "lik-start"] as const;

export type Hendelsesfeil = (typeof HENDELSESFEIL)[number];

/** Et utkast fra skjemaet: alle felt som strenger, før en `Hendelse` finnes. */
export type Hendelsesutkast = Record<Hendelsesfelt, string>;

export type Valideringsresultat =
  | { gyldig: true }
  | { gyldig: false; feil: Partial<Record<Hendelsesfelt, Hendelsesfeil>> };

/** Tidsfeltene reglene under trenger. */
type Tidsrom = Pick<Hendelse, "start" | "slutt">;
type DatertTidsrom = Pick<Hendelse, "dato" | "start" | "slutt">;

const datoformat = hendelseSkjema.shape.dato;
const klokkeslettformat = hendelseSkjema.shape.start;

/**
 * Validerer et hendelsesutkast. Tittel med bare mellomrom regnes som tom.
 * Lik start og slutt er ugyldig (`slutt`: `lik-start`). Slutt før start er
 * gyldig og betyr at hendelsen slutter neste dag. Tittelen gis ikke tilbake
 * trimmet, så kalleren trimmer tittelen før lagring.
 */
export function validerHendelse(utkast: Hendelsesutkast): Valideringsresultat {
  const feil: Partial<Record<Hendelsesfelt, Hendelsesfeil>> = {};

  if (utkast.tittel.trim() === "") feil.tittel = "påkrevd";

  if (utkast.dato === "") feil.dato = "påkrevd";
  else if (!datoformat.safeParse(utkast.dato).success) feil.dato = "ugyldig";

  for (const felt of ["start", "slutt"] as const) {
    if (utkast[felt] === "") feil[felt] = "påkrevd";
    else if (!klokkeslettformat.safeParse(utkast[felt]).success) {
      feil[felt] = "ugyldig";
    }
  }

  if (!feil.start && !feil.slutt && utkast.start === utkast.slutt) {
    feil.slutt = "lik-start";
  }

  return Object.keys(feil).length === 0 ? { gyldig: true } : { gyldig: false, feil };
}

/** Om hendelsen slutter neste dag (slutt før start). */
export function slutterNesteDag(h: Tidsrom): boolean {
  return h.slutt < h.start;
}

/** `"HH:mm – HH:mm"`, med ` (+1 dag)` når hendelsen slutter neste dag. */
export function visTid(h: Tidsrom): string {
  const tid = `${h.start} – ${h.slutt}`;
  return slutterNesteDag(h) ? `${tid} (+1 dag)` : tid;
}

/**
 * Datoen `dager` dager fra `dato`. Regner med lokal midnatt, ikke med 24 t,
 * så sommertid ikke slår feil.
 */
function leggTilDager(dato: string, dager: number): string {
  const [år, måned, dag] = dato.split("-").map(Number);
  return lokalDato(new Date(år, måned - 1, dag + dager));
}

/** Slutten som `"YYYY-MM-DDTHH:mm"`. */
function sluttTidspunkt(h: DatertTidsrom): string {
  const dato = slutterNesteDag(h) ? leggTilDager(h.dato, 1) : h.dato;
  return `${dato}T${h.slutt}`;
}

/** Om hendelsen er over: «nå» er lik eller senere enn slutten (minuttnivå). */
export function erOver(h: DatertTidsrom, nå: Date): boolean {
  const nåTidspunkt = `${lokalDato(nå)}T${lokaltKlokkeslett(nå)}`;
  return nåTidspunkt >= sluttTidspunkt(h);
}

/**
 * Dagens hendelser: hendelser med dagens dato som ikke er over, pluss
 * hendelser fra i går som slutter neste dag og ikke er over ennå. Sortert
 * etter starttid, så nattevakter fra i går står først.
 */
export function dagensHendelser<T extends DatertTidsrom>(
  hendelser: readonly T[],
  nå: Date,
): T[] {
  const idag = lokalDato(nå);
  const igår = leggTilDager(idag, -1);
  return hendelser
    .filter(
      (h) =>
        (h.dato === idag || (h.dato === igår && slutterNesteDag(h))) &&
        !erOver(h, nå),
    )
    .sort((a, b) => {
      const ka = `${a.dato}T${a.start}`;
      const kb = `${b.dato}T${b.start}`;
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });
}

import type { Dokument, Oppgave } from "./skjema";
import { GJELDENDE_SAMTYKKEVERSJON } from "./tekster";

/**
 * Samtykke til KI (FR-63, AD-12). `kiErPå` og `kanSendes` er de eneste stedene
 * som avgjør om KI brukes. Butikken, `lib/ki/` og UI kaller dem og gjentar
 * aldri logikken. Ren TypeScript uten klokke: funksjonene endrer ikke det de får.
 */

/** Versjonen av samtykketeksten. Eneste kilde er `kjerne/tekster.ts`. */
export { GJELDENDE_SAMTYKKEVERSJON };

/**
 * Om KI er på: bare når svaret er «ja» og tekstversjonen er akkurat den
 * gjeldende. Ikke svart, «nei», en gammel eller en ukjent nyere versjon gir av.
 */
export function kiErPå(dokument: Pick<Dokument, "samtykke">): boolean {
  const { samtykke } = dokument;
  return (
    samtykke !== null &&
    samtykke.svar === "ja" &&
    samtykke.tekstversjon === GJELDENDE_SAMTYKKEVERSJON
  );
}

/**
 * Om noe fra oppgaven kan sendes til KI: KI må være på, og oppgaven kan ikke
 * ha 🔒. Notatvalget, hendelsestitler, fullførte oppgaver og importerte oppgaver
 * avgjøres andre steder.
 */
export function kanSendes(
  oppgave: Pick<Oppgave, "skjultForKi">,
  dokument: Pick<Dokument, "samtykke">,
): boolean {
  return kiErPå(dokument) && !oppgave.skjultForKi;
}

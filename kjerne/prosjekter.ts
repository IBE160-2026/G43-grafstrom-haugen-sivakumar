import { etikettSkjema, type Oppgave } from "./skjema";

/**
 * Prosjektnavnene i Innstillinger → Prosjekter (FR-61, AD-1, AD-4). Regnes ut
 * av oppgavene hver gang og lagres aldri. Ren TypeScript uten klokke.
 */

/** Skole, Jobb og Privat er faste etiketter og vises aldri som prosjekter. */
const FASTE_ETIKETTER: ReadonlySet<string> = new Set(etikettSkjema.options);

/** Om navnet er en av de faste etikettene, som verken vises eller kan slettes. */
export function erFastEtikett(navn: string): boolean {
  return FASTE_ETIKETTER.has(navn);
}

/** Sorterer på norsk, så æ, ø og å kommer sist. Språket er fast, ikke nettleserens. */
const NORSK = new Intl.Collator("nb");

/**
 * Alle prosjektnavn som er brukt på oppgaver, også fullførte: unike, sortert
 * alfabetisk på norsk, uten de faste etikettene.
 */
export function prosjektnavn(oppgaver: readonly Oppgave[]): string[] {
  const navn = new Set<string>();
  for (const oppgave of oppgaver) {
    if (oppgave.prosjekt !== null && !erFastEtikett(oppgave.prosjekt)) {
      navn.add(oppgave.prosjekt);
    }
  }
  return [...navn].sort(NORSK.compare);
}

/** Hvor mange oppgaver som har akkurat dette prosjektnavnet. */
export function antallMedProsjekt(oppgaver: readonly Oppgave[], navn: string): number {
  return oppgaver.filter((oppgave) => oppgave.prosjekt === navn).length;
}

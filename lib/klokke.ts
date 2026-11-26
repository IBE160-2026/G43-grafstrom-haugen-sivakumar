/**
 * Eneste kode i appen som leser klokka (AD-5). Alt annet bruker `nå` fra
 * butikken eller `tidsstempel()` herfra.
 */

/** Hvor ofte `nå` oppdateres. */
export const TAKT_MS = 60_000;

/**
 * Setter `nå` straks, så hvert minutt og hver gang fanen blir synlig igjen.
 * Returnerer en funksjon som stopper takten.
 */
export function startKlokke(settNå: (nå: Date) => void): () => void {
  const tikk = () => settNå(new Date());
  const vedSynlighet = () => {
    if (document.visibilityState === "visible") tikk();
  };

  tikk();
  const intervall = setInterval(tikk, TAKT_MS);
  document.addEventListener("visibilitychange", vedSynlighet);

  return () => {
    clearInterval(intervall);
    document.removeEventListener("visibilitychange", vedSynlighet);
  };
}

/** Tidsstempel i ISO UTC for `createdAt`, `fullført`, `avhuket` og samtykke. */
export function tidsstempel(): string {
  return new Date().toISOString();
}

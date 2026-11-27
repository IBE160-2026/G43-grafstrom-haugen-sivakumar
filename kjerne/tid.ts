/**
 * Felles tidshjelpere (AD-5): gjør en `Date` om til lokal dato og lokalt
 * klokkeslett. Brukes av hendelsene (5.x), og senere av 1.5 og 6.4.
 *
 * Ren TypeScript uten klokke: «nå» kommer alltid inn som parameter. Bruker de
 * lokale getterne, aldri UTC, slik at datoen stemmer med det brukeren ser.
 */

function tosifret(tall: number): string {
  return String(tall).padStart(2, "0");
}

/** Lokal dato som `YYYY-MM-DD`. */
export function lokalDato(nå: Date): string {
  return `${nå.getFullYear()}-${tosifret(nå.getMonth() + 1)}-${tosifret(nå.getDate())}`;
}

/** Lokalt klokkeslett som `HH:mm`. */
export function lokaltKlokkeslett(nå: Date): string {
  return `${tosifret(nå.getHours())}:${tosifret(nå.getMinutes())}`;
}

/**
 * Veggklokkeminutter for `dato` (`YYYY-MM-DD`) og `klokkeslett` (`HH:mm`).
 * Regner med `Date.UTC`, så dagskifter går av seg selv og tidssonen ikke
 * spiller inn. Bare forskjeller mellom to verdier har mening.
 */
export function tilMinutter(dato: string, klokkeslett: string): number {
  const [år, måned, dag] = dato.split("-").map(Number);
  const [timer, minutter] = klokkeslett.split(":").map(Number);
  return Date.UTC(år, måned - 1, dag, timer, minutter) / 60_000;
}

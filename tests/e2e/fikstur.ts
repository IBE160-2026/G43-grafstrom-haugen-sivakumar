import { test as base } from "@playwright/test";
import { nyttDokument, type Dokument } from "@/kjerne/skjema";
import { GJELDENDE_SAMTYKKEVERSJON } from "@/kjerne/samtykke";

export { expect, type Page } from "@playwright/test";

/**
 * Et besvart KI-valg («nei»). Uten svar sender appen til `/oppstart` (3.3,
 * AD-15), så testene som ikke handler om oppsettet starter med dette.
 */
export const SVART: NonNullable<Dokument["samtykke"]> = {
  svar: "nei",
  tidspunkt: "2026-11-01T10:00:00.000Z",
  tekstversjon: GJELDENDE_SAMTYKKEVERSJON,
};

/** Dokumentet med besvart KI-valg, hvis det ikke allerede har et. */
export function besvart(dokument: Dokument): Dokument {
  return { ...dokument, samtykke: dokument.samtykke ?? SVART };
}

/**
 * Playwright-testen for appen. Som standard legges et nytt dokument med
 * besvart KI-valg i lageret før appen starter, men bare når lageret er tomt,
 * så tester som legger inn egne data bestemmer selv. Tester av første
 * oppstart slår det av med `test.use({ medSamtykke: false })`.
 */
export const test = base.extend<{ medSamtykke: boolean }>({
  medSamtykke: [true, { option: true }],
  // På konteksten, så også sider fra `context.newPage()` får det.
  context: async ({ context, medSamtykke }, bruk) => {
    if (medSamtykke) {
      await context.addInitScript(
        ([nøkkel, verdi]) => {
          try {
            // Bare første gang i hver fane, så tester som tømmer lageret og
            // laster på nytt ser det appen selv skrev.
            if (sessionStorage.getItem("samtykke-lagt-inn")) return;
            sessionStorage.setItem("samtykke-lagt-inn", "1");
            if (localStorage.getItem(nøkkel) === null) localStorage.setItem(nøkkel, verdi);
          } catch {
            // Blokkert lager: appen viser banneret, og testen avgjør resten.
          }
        },
        ["duenext", JSON.stringify(besvart(nyttDokument()))] as const,
      );
    }
    await bruk(context);
  },
});

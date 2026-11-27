"use client";

import { useLayoutEffect } from "react";
import { useButikk } from "@/lib/store";

type Attributter = { tema: string | null; modus: string | null };

/**
 * Det temaskriptet satte før React startet. Leses når modulen lastes, altså
 * før hydrering, så StrictMode-remounten i dev (som nullstiller attributtene
 * på <html>) ikke rekker å fjerne dem.
 */
const fraSkriptet: Attributter | null =
  typeof document === "undefined"
    ? null
    : {
        tema: document.documentElement.getAttribute("data-tema"),
        modus: document.documentElement.getAttribute("data-modus"),
      };

function sett(navn: "data-tema" | "data-modus", verdi: string | null) {
  if (verdi === null) return;
  if (document.documentElement.getAttribute(navn) !== verdi) {
    document.documentElement.setAttribute(navn, verdi);
  }
}

/**
 * Holder `data-tema`/`data-modus` på <html> i takt med butikken. Etter
 * innlasting er `dokument.innstillinger` kilden; før det (og på feilsiden)
 * settes det skriptet valgte på nytt. Tegner ingenting.
 */
export function TemaSynk() {
  const tema = useButikk((s) => s.dokument?.innstillinger.tema ?? null);
  const modus = useButikk((s) => s.dokument?.innstillinger.modus ?? null);

  useLayoutEffect(() => {
    sett("data-tema", tema ?? fraSkriptet?.tema ?? null);
    sett("data-modus", modus ?? fraSkriptet?.modus ?? null);
  }, [tema, modus]);

  return null;
}

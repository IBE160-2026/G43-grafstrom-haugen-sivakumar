"use client";

import { useEffect, type ReactNode } from "react";
import { Feilside } from "@/components/feilside";
import { Lagringsbanner } from "@/components/lagringsbanner";
import { startKlokke } from "@/lib/klokke";
import { lagring } from "@/lib/storage";
import { butikk, useButikk } from "@/lib/store";

/**
 * Laster dokumentet, starter klokka og lytter etter andre faner. Viser
 * skjelett under innlasting, feilside når dataene ikke kan leses, og
 * lagringsbanneret øverst når lagringen feiler (AD-3, AD-5, AD-10).
 */
export function AppTilstand({ children }: { children: ReactNode }) {
  const status = useButikk((s) => s.status);
  const rå = useButikk((s) => s.rå);
  const harNå = useButikk((s) => s.nå !== null);
  const lagringFeilet = useButikk((s) => s.lagringFeilet);

  useEffect(() => {
    const { lastInn, settNå, lastPåNytt } = butikk.getState();
    lastInn();
    const stoppKlokke = startKlokke(settNå);
    const stoppLytter = lagring.lyttEtterEndringer(lastPåNytt);
    return () => {
      stoppKlokke();
      stoppLytter();
    };
  }, []);

  if (status === "laster" || (status === "klar" && !harNå)) {
    return (
      <div role="status" aria-busy="true" className="p-6">
        <span className="sr-only">Laster …</span>
        <div className="h-8 w-40 animate-pulse rounded bg-current opacity-10" />
        <div className="mt-4 h-4 w-64 max-w-full animate-pulse rounded bg-current opacity-10" />
      </div>
    );
  }

  return (
    <>
      {lagringFeilet && <Lagringsbanner />}
      {status === "klar" ? children : <Feilside type={status} rå={rå ?? ""} />}
    </>
  );
}

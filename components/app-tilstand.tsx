"use client";

import { useEffect, type ReactNode } from "react";
import { Feilside } from "@/components/feilside";
import { Lagringsbanner } from "@/components/lagringsbanner";
import { Ramme } from "@/components/ramme";
import { TemaSynk } from "@/components/tema-synk";
import { startKlokke } from "@/lib/klokke";
import { lagring } from "@/lib/storage";
import { butikk, useButikk } from "@/lib/store";

/**
 * Laster dokumentet, starter klokka og lytter etter andre faner. Viser
 * skjelett under innlasting, feilside når dataene ikke kan leses, og
 * lagringsbanneret øverst når lagringen feiler (AD-3, AD-5, AD-10). Rammen
 * med menyene ligger rundt sidene, under banneret.
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

  const laster = status === "laster" || (status === "klar" && !harNå);

  return (
    <>
      <TemaSynk />
      {laster ? (
        <div role="status" aria-busy="true" className="p-6">
          <span className="sr-only">Laster …</span>
          <div className="h-8 w-40 animate-pulse rounded-sm bg-border-hairline" />
          <div className="mt-4 h-4 w-64 max-w-full animate-pulse rounded-sm bg-border-hairline" />
        </div>
      ) : (
        <>
          {lagringFeilet && <Lagringsbanner />}
          {status === "klar" ? (
            <Ramme>{children}</Ramme>
          ) : (
            <Feilside type={status} rå={rå ?? ""} />
          )}
        </>
      )}
    </>
  );
}

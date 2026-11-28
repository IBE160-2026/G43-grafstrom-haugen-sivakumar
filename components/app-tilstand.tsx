"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Feilside } from "@/components/feilside";
import { Lagringsbanner } from "@/components/lagringsbanner";
import { Ramme } from "@/components/ramme";
import { TemaSynk } from "@/components/tema-synk";
import { startKlokke } from "@/lib/klokke";
import { OPPSTART, PERSONVERNERKLÆRING } from "@/lib/ruter";
import { lagring } from "@/lib/storage";
import { butikk, useButikk } from "@/lib/store";

/**
 * Hvor appen må sende studenten før siden kan vises (AD-15): til `/oppstart`
 * så lenge KI-valget ikke er besvart, unntatt fra personvernerklæringen, og
 * bort fra `/oppstart` når det er besvart. `null` betyr at siden kan vises.
 */
function omdirigering(stinavn: string, harSvart: boolean): string | null {
  if (!harSvart && stinavn !== OPPSTART && stinavn !== PERSONVERNERKLÆRING) return OPPSTART;
  if (harSvart && stinavn === OPPSTART) return "/";
  return null;
}

function Skjelett() {
  return (
    <div role="status" aria-busy="true" className="p-6">
      <span className="sr-only">Laster …</span>
      <div className="h-8 w-40 animate-pulse rounded-sm bg-border-hairline" />
      <div className="mt-4 h-4 w-64 max-w-full animate-pulse rounded-sm bg-border-hairline" />
    </div>
  );
}

/**
 * Laster dokumentet, starter klokka og lytter etter andre faner. Viser
 * skjelett under innlasting og mens appen omdirigerer, feilside når dataene
 * ikke kan leses, og lagringsbanneret øverst når lagringen feiler (AD-3,
 * AD-5, AD-10, AD-15). Rammen med menyene ligger rundt sidene, under
 * banneret; førstegangsoppsettet er en helside uten ramme.
 */
export function AppTilstand({ children }: { children: ReactNode }) {
  const status = useButikk((s) => s.status);
  const rå = useButikk((s) => s.rå);
  const harNå = useButikk((s) => s.nå !== null);
  const lagringFeilet = useButikk((s) => s.lagringFeilet);
  const harSvart = useButikk((s) => s.dokument !== null && s.dokument.samtykke !== null);
  const stinavn = usePathname();
  const router = useRouter();

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
  const mål = status === "klar" && !laster ? omdirigering(stinavn, harSvart) : null;

  useEffect(() => {
    if (mål !== null) router.replace(mål);
  }, [mål, router]);

  return (
    <>
      <TemaSynk />
      {laster || mål !== null ? (
        <Skjelett />
      ) : (
        <>
          {lagringFeilet && <Lagringsbanner />}
          {status !== "klar" ? (
            <Feilside type={status} rå={rå ?? ""} />
          ) : stinavn === OPPSTART ? (
            children
          ) : (
            <Ramme>{children}</Ramme>
          )}
        </>
      )}
    </>
  );
}

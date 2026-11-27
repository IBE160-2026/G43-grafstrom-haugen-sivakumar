"use client";

import { useButikk } from "@/lib/store";

/** «Hei, Ida 👋», eller «Hei 👋» uten fornavn. Overskriften på Oppgaver. */
export function Hilsen() {
  const fornavn = useButikk((s) => s.dokument?.profil?.fornavn ?? null);
  return <h1 className="text-greeting break-words">{fornavn ? `Hei, ${fornavn} 👋` : "Hei 👋"}</h1>;
}

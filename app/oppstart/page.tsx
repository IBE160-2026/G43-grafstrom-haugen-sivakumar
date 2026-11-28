import type { Metadata } from "next";
import { Oppstart } from "@/components/oppstart";
import { SAMTYKKETEKST } from "@/kjerne/tekster";

/** `?steg=2` gir KI-valget; alt annet (også en liste) gir steg 1. */
async function lesSteg(searchParams: PageProps<"/oppstart">["searchParams"]): Promise<1 | 2> {
  const { steg } = await searchParams;
  const verdi = Array.isArray(steg) ? steg[0] : steg;
  return verdi === "2" ? 2 : 1;
}

/**
 * Egen tittel per steg, så skjermlesere får beskjed når steget byttes
 * (Next leser opp den nye sidetittelen ved navigering).
 */
export async function generateMetadata({
  searchParams,
}: PageProps<"/oppstart">): Promise<Metadata> {
  return { title: (await lesSteg(searchParams)) === 2 ? SAMTYKKETEKST.overskrift : "Velkommen" };
}

/**
 * Førstegangsoppsettet (FR-35, FR-59, FR-65). Steget står i adressen
 * (`?steg=2`), så studenten kommer tilbake til KI-valget etter å ha lest
 * personvernerklæringen.
 */
export default async function OppstartSide({ searchParams }: PageProps<"/oppstart">) {
  return <Oppstart steg={await lesSteg(searchParams)} />;
}

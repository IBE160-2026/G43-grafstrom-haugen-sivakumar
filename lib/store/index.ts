import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { dokumentSkjema, nyttDokument, type Dokument } from "@/kjerne/skjema";
import { lagring as standardLagring, type Lagring, type LesResultat } from "@/lib/storage";

export type Status = "laster" | "klar" | "for-ny" | "ugyldig";

export type Tilstand = {
  status: Status;
  /** Dokumentet i minnet. `null` før innlasting og på feilsiden. */
  dokument: Dokument | null;
  /** Rådataene som ikke kunne leses (`for-ny`/`ugyldig`), for nedlasting. */
  rå: string | null;
  /** Settes av `lib/klokke.ts` ved oppstart og hvert minutt. Lagres ikke. */
  nå: Date | null;
  /** Viser lagringsbanneret. */
  lagringFeilet: boolean;
  /** Lesingen feilet: ingenting skrives resten av økta. */
  skrivingSperret: boolean;

  lastInn(): void;
  settNå(nå: Date): void;
  /** Leser dokumentet på nytt etter at en annen fane har skrevet. */
  lastPåNytt(): void;
  slettAlleData(): void;
};

export type Butikk = StoreApi<Tilstand>;

/**
 * Lager butikken. Lagring skjer bare i abonnementet nederst (AD-2), og først
 * når innlastingen er ferdig (AD-10).
 */
export function lagButikk({ lagring }: { lagring: Lagring }): Butikk {
  /** Dokumentet som nettopp er lest. Det skrives ikke tilbake. */
  let sistLest: Dokument | null = null;

  const butikk = createStore<Tilstand>()((set, get) => {
    function anvend(resultat: LesResultat) {
      switch (resultat.type) {
        case "ok":
          sistLest = resultat.dokument;
          set({
            status: "klar",
            dokument: resultat.dokument,
            rå: null,
            lagringFeilet:
              get().skrivingSperret || get().lagringFeilet || resultat.lagringFeilet,
          });
          return;
        case "lesefeil": {
          const { status, dokument } = get();
          const nytt = status === "klar" && dokument ? dokument : nyttDokument();
          sistLest = nytt;
          set({
            status: "klar",
            dokument: nytt,
            rå: null,
            lagringFeilet: true,
            skrivingSperret: true,
          });
          return;
        }
        case "for-ny":
        case "ugyldig":
          set({ status: resultat.type, dokument: null, rå: resultat.rå });
          return;
      }
    }

    return {
      status: "laster",
      dokument: null,
      rå: null,
      nå: null,
      lagringFeilet: false,
      skrivingSperret: false,

      lastInn() {
        // Kjører bare én gang, også når StrictMode kjører effekten to ganger.
        if (get().status !== "laster") return;
        anvend(lagring.les());
      },

      settNå(nå) {
        set({ nå });
      },

      lastPåNytt() {
        const { status, skrivingSperret } = get();
        // Før innlasting finnes ingenting å laste på nytt, og med sperret
        // skriving kan lageret ikke leses.
        if (status === "laster" || skrivingSperret) return;
        anvend(lagring.les());
      },

      slettAlleData() {
        if (get().skrivingSperret) return;
        if (!lagring.slettAlt().ok) {
          set({ lagringFeilet: true });
          return;
        }
        // Det nye dokumentet skrives av abonnementet.
        set({ status: "klar", dokument: nyttDokument(), rå: null });
      },
    };
  });

  butikk.subscribe((tilstand, forrige) => {
    const { dokument, status, skrivingSperret } = tilstand;
    if (dokument === forrige.dokument) return;
    if (status !== "klar" || dokument === null) return;
    if (dokument === sistLest) return;
    if (skrivingSperret) return;

    const sjekk = dokumentSkjema.safeParse(dokument);
    if (!sjekk.success) {
      console.error("Dokumentet er ugyldig og ble ikke lagret.", sjekk.error);
      butikk.setState({ lagringFeilet: true });
      return;
    }

    const feilet = !lagring.skriv(dokument).ok;
    if (feilet !== butikk.getState().lagringFeilet) {
      butikk.setState({ lagringFeilet: feilet });
    }
  });

  return butikk;
}

/** Appens butikk. */
export const butikk = lagButikk({ lagring: standardLagring });

/** Leser en verdi fra butikken i en komponent. */
export function useButikk<T>(selektor: (tilstand: Tilstand) => T): T {
  return useStore(butikk, selektor);
}

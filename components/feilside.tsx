"use client";

import { useRef } from "react";
import { FEILSIDE, SLETT_ALLE_DATA_DIALOG } from "@/kjerne/tekster";
import { butikk } from "@/lib/store";

const FILNAVN = "duenext-data.json";
const KNAPP = "min-h-11 rounded-full px-5 text-body font-medium";
/** button-secondary: kortflate og `border-input`. */
const SEKUNDÆR = `${KNAPP} border border-border-input bg-surface-raised text-text-primary`;
/** button-danger: `warn`-fyll med tekst i kortfargen. */
const FARE = `${KNAPP} bg-warn text-surface-raised`;

/** Lagrer rådataene ordrett som fil. */
function lastNed(rå: string) {
  const url = URL.createObjectURL(new Blob([rå], { type: "application/json" }));
  const lenke = document.createElement("a");
  lenke.href = url;
  lenke.download = FILNAVN;
  document.body.append(lenke);
  lenke.click();
  lenke.remove();
  // Utsatt, så nedlastingen rekker å starte i alle nettlesere.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** Vises når dataene er fra en nyere versjon eller skadet. Endrer aldri det lagrede selv. */
export function Feilside({ type, rå }: { type: "for-ny" | "ugyldig"; rå: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const avbryt = useRef<HTMLButtonElement>(null);
  const tekst = type === "for-ny" ? FEILSIDE.forNy : FEILSIDE.ugyldig;

  function åpneDialog() {
    dialog.current?.showModal();
    avbryt.current?.focus();
  }

  function slettAlt() {
    dialog.current?.close();
    butikk.getState().slettAlleData();
  }

  return (
    <main className="mx-auto max-w-xl px-margin-mobile py-8 md:px-margin-desktop md:py-12">
      <h1 className="text-greeting">{tekst.tittel}</h1>
      <p className="mt-2">{tekst.tekst}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className={SEKUNDÆR} onClick={() => lastNed(rå)}>
          {FEILSIDE.knapper.lastNed}
        </button>
        <button type="button" className={SEKUNDÆR} onClick={åpneDialog}>
          {FEILSIDE.knapper.slettAlleData}
        </button>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="slett-tittel"
        className="m-auto w-[calc(100%-2*var(--margin-mobile))] max-w-md rounded-xl bg-surface-raised p-6 text-text-primary shadow-dialog backdrop:bg-black/50"
      >
        <h2 id="slett-tittel" className="text-title">
          {SLETT_ALLE_DATA_DIALOG.tittel}
        </h2>
        <p className="mt-2">{SLETT_ALLE_DATA_DIALOG.tekst}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            ref={avbryt}
            type="button"
            className={SEKUNDÆR}
            onClick={() => dialog.current?.close()}
          >
            {SLETT_ALLE_DATA_DIALOG.knapper.avbryt}
          </button>
          <button type="button" className={FARE} onClick={slettAlt}>
            {SLETT_ALLE_DATA_DIALOG.knapper.slettAlt}
          </button>
        </div>
      </dialog>
    </main>
  );
}

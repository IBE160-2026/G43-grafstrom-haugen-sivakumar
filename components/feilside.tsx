"use client";

import { useRef } from "react";
import { FEILSIDE, SLETT_ALLE_DATA_DIALOG } from "@/kjerne/tekster";
import { butikk } from "@/lib/store";

const FILNAVN = "duenext-data.json";
const KNAPP = "min-h-11 px-4";

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
    <main className="p-6">
      <h1 className="text-2xl font-semibold">{tekst.tittel}</h1>
      <p className="mt-2">{tekst.tekst}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className={KNAPP} onClick={() => lastNed(rå)}>
          {FEILSIDE.knapper.lastNed}
        </button>
        <button type="button" className={KNAPP} onClick={åpneDialog}>
          {FEILSIDE.knapper.slettAlleData}
        </button>
      </div>

      <dialog ref={dialog} aria-labelledby="slett-tittel" className="p-6">
        <h2 id="slett-tittel" className="text-xl font-semibold">
          {SLETT_ALLE_DATA_DIALOG.tittel}
        </h2>
        <p className="mt-2">{SLETT_ALLE_DATA_DIALOG.tekst}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            ref={avbryt}
            type="button"
            className={KNAPP}
            onClick={() => dialog.current?.close()}
          >
            {SLETT_ALLE_DATA_DIALOG.knapper.avbryt}
          </button>
          <button type="button" className={KNAPP} onClick={slettAlt}>
            {SLETT_ALLE_DATA_DIALOG.knapper.slettAlt}
          </button>
        </div>
      </dialog>
    </main>
  );
}

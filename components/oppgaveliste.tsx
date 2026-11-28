"use client";

import { useId, useMemo, useState } from "react";
import { PilNedIkon } from "@/components/ikoner";
import { Oppgavekort } from "@/components/oppgavekort";
import { fristMerkelapp, smarteLister, type SmartListe } from "@/kjerne/smarte-lister";
import { useButikk } from "@/lib/store";

/**
 * De smarte listene på Oppgaver (FR-20–24). Listene regnes ut av kjernen fra
 * dokumentet og `nå`, og følger klokka uten omlasting. Tomme grupper skjules,
 * unntatt «I dag». Lista ligger på `bg-surface-base` under glødsonen, så
 * dempet tekst og varselfarge aldri står på gløden.
 */
export function Oppgaveliste() {
  // Hver verdi for seg: en selektor som lager nye objekter gir evig rendering.
  const oppgaver = useButikk((s) => s.dokument?.oppgaver ?? null);
  const nå = useButikk((s) => s.nå);
  const lister = useMemo(
    () => (oppgaver && nå ? smarteLister({ oppgaver }, nå) : null),
    [oppgaver, nå],
  );

  if (!lister || !nå) return null;

  if (lister.every((l) => l.antall === 0)) {
    return <p className="mt-1 text-text-on-glow">Skriv inn det første du må huske.</p>;
  }

  // Overgangen (`before:`) fyller mellomrommet over flaten og toner gløden ut
  // mot `surface-base`, så kanten ikke synes. Den ligger over den første
  // overskriften, så overskrifter og kort står alltid på opak flate.
  return (
    <div className="relative -mx-margin-mobile mt-6 bg-surface-base px-margin-mobile pt-4 pb-2 before:pointer-events-none before:absolute before:inset-x-0 before:bottom-full before:h-6 before:bg-linear-to-b before:from-transparent before:to-surface-base md:-mx-margin-desktop md:px-margin-desktop">
      {lister
        .filter((l) => l.antall > 0 || l.liste === "I dag")
        .map((l) =>
          l.liste === "Ingen frist" ? (
            <IngenFrist key={l.liste} gruppe={l} nå={nå} />
          ) : (
            <div key={l.liste} className="mt-6 first:mt-0">
              <h2
                className={`section-label mb-2 ${l.liste === "Forfalt" ? "text-warn" : "text-text-muted"}`}
              >
                {l.liste} · {l.antall}
              </h2>
              {l.antall === 0 ? (
                <p className="text-meta text-text-muted">Alt unna i dag 🎉 Nyt kvelden!</p>
              ) : (
                <Kort gruppe={l} nå={nå} />
              )}
            </div>
          ),
        )}
    </div>
  );
}

function Kort({ gruppe, nå, id, hidden }: { gruppe: SmartListe; nå: Date; id?: string; hidden?: boolean }) {
  return (
    <ul id={id} hidden={hidden} className="flex flex-col gap-1.5">
      {gruppe.elementer.map(({ oppgave }) => (
        <li key={oppgave.id}>
          <Oppgavekort
            oppgave={oppgave}
            frist={fristMerkelapp(oppgave.frist, nå)}
            forfalt={gruppe.liste === "Forfalt"}
          />
        </li>
      ))}
    </ul>
  );
}

/** «Ingen frist» kan felles sammen. Åpen som standard, og valget lagres ikke. */
function IngenFrist({ gruppe, nå }: { gruppe: SmartListe; nå: Date }) {
  const [åpen, settÅpen] = useState(true);
  const id = useId();
  return (
    <div className="mt-6 first:mt-0">
      <h2 className="section-label text-text-muted">
        <button
          type="button"
          aria-expanded={åpen}
          aria-controls={id}
          onClick={() => settÅpen((v) => !v)}
          className="-ml-1 flex min-h-11 items-center gap-1 rounded-sm px-1 uppercase"
        >
          {gruppe.liste} · {gruppe.antall}
          <PilNedIkon className={`size-4 transition-transform ${åpen ? "" : "-rotate-90"}`} />
        </button>
      </h2>
      <Kort gruppe={gruppe} nå={nå} id={id} hidden={!åpen} />
    </div>
  );
}

import { LåsIkon } from "@/components/ikoner";
import type { Oppgave } from "@/kjerne/skjema";

/**
 * Oppgavekortet (`task-card`): ring, tittel, sammendrag med «✦» og
 * merkelappene prosjekt, frist og prioritet. Ringen er bare dekor til
 * avhukingen kommer i 2.2, og kortet blir klikkbart i 1.7.
 */
export function Oppgavekort({
  oppgave,
  frist,
  forfalt,
}: {
  oppgave: Oppgave;
  /** Fristmerkelappen fra `fristMerkelapp`, eller `null` når den ikke vises. */
  frist: string | null;
  forfalt: boolean;
}) {
  const merkelapper: { type: "prosjekt" | "frist" | "prioritet"; navn: string; tekst: string; høy?: boolean }[] = [];
  if (oppgave.prosjekt) merkelapper.push({ type: "prosjekt", navn: "Prosjekt", tekst: oppgave.prosjekt });
  if (frist) merkelapper.push({ type: "frist", navn: "Frist", tekst: frist });
  merkelapper.push({
    type: "prioritet",
    navn: "Prioritet",
    tekst: oppgave.prioritet,
    høy: oppgave.prioritet === "Høy",
  });

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-border-hairline bg-surface-raised p-3 ${
        forfalt ? "border-l-4 border-l-warn" : ""
      }`}
    >
      <span aria-hidden="true" className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-accent-ink" />
      <div className="min-w-0 flex-1">
        <p className="text-task-title break-words">
          {oppgave.tekst}
          {oppgave.skjultForKi && (
            <>
              {" "}
              <LåsIkon className="inline size-3.5 align-[-1px] text-text-muted" />
              <span className="sr-only">Skjult for KI</span>
            </>
          )}
        </p>
        {oppgave.sammendrag && (
          <p className="mt-0.5 truncate text-meta text-accent-ink">
            <span aria-hidden="true">✦ </span>
            {oppgave.sammendrag}
          </p>
        )}
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {merkelapper.map(({ type, navn, tekst, høy }) => (
            <li
              key={type}
              className={`rounded-sm border bg-surface-base px-1.5 py-px text-tag ${
                høy ? "border-warn text-warn" : "border-border-hairline text-text-muted"
              }`}
            >
              <span className="sr-only">{navn}: </span>
              {tekst}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

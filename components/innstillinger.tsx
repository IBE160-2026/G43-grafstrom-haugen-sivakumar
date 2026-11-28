"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { HakeIkon, SøppelbøtteIkon } from "@/components/ikoner";
import { antallMedProsjekt, prosjektnavn } from "@/kjerne/prosjekter";
import { innstillingerSkjema, type Innstillinger as InnstillingerData } from "@/kjerne/skjema";
import { butikk, useButikk } from "@/lib/store";

const MODUSER: readonly { verdi: InnstillingerData["modus"]; navn: string }[] = [
  { verdi: "lys", navn: "Lys" },
  { verdi: "mørk", navn: "Mørk" },
  { verdi: "system", navn: "Følg systemet" },
];

/** Seksjon med overskrift i `section-label` og innhold på kortflate. */
function Seksjon({ tittel, children }: { tittel: string; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="mt-6">
      <h2 id={id} className="section-label text-text-on-glow">
        {tittel}
      </h2>
      <div className="mt-2 rounded-lg border border-border-hairline bg-surface-raised p-4">
        {children}
      </div>
    </section>
  );
}

/** Fornavnet til hilsenen. Lagres først ved Lagre. */
function Profil() {
  const lagret = useButikk((s) => s.dokument?.profil?.fornavn ?? "");
  const [utkast, settUtkast] = useState(lagret);
  const [forrigeLagret, settForrigeLagret] = useState(lagret);
  const [bekreftet, settBekreftet] = useState(false);
  const felt = useId();
  const hjelp = useId();

  // Endrer en annen fane navnet, følger feltet med så lenge det ikke har ulagrede endringer.
  if (lagret !== forrigeLagret) {
    settForrigeLagret(lagret);
    if (utkast === forrigeLagret) settUtkast(lagret);
  }

  function lagre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { settFornavn, skrivingSperret } = butikk.getState();
    // Med sperret skriving endrer kommandoen ingenting, og banneret forklarer hvorfor.
    if (skrivingSperret) return;
    settFornavn(utkast);
    const etter = butikk.getState();
    settUtkast(etter.dokument?.profil?.fornavn ?? "");
    // Feilet skrivingen, forklarer banneret at navnet forsvinner.
    settBekreftet(!etter.lagringFeilet);
  }

  return (
    <form onSubmit={lagre}>
      <label htmlFor={felt} className="block text-meta text-text-primary">
        Fornavn
      </label>
      <input
        id={felt}
        type="text"
        autoComplete="given-name"
        maxLength={50}
        aria-describedby={hjelp}
        value={utkast}
        onChange={(e) => {
          settUtkast(e.target.value);
          settBekreftet(false);
        }}
        className="mt-1 block min-h-11 w-full rounded-md border border-border-input bg-surface-raised px-3 text-body text-text-primary"
      />
      <p id={hjelp} className="mt-1 text-meta text-text-muted">
        Bare for hilsenen. Lagres på denne enheten.
      </p>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          className="min-h-11 rounded-full bg-accent px-5 text-body font-medium text-text-on-pastel"
        >
          Lagre
        </button>
        <p role="status" className="text-meta text-text-muted">
          {bekreftet ? "Lagret." : ""}
        </p>
      </div>
    </form>
  );
}

/** Lys / Mørk / Følg systemet. Endres med én gang, uten Lagre. */
function Modusvelger() {
  const modus = useButikk((s) => s.dokument?.innstillinger.modus ?? "system");
  const etikett = useId();

  return (
    <>
      <p id={etikett} className="text-meta text-text-primary">
        Modus
      </p>
      <div
        role="group"
        aria-labelledby={etikett}
        className="mt-1 flex w-full rounded-full border border-border-input bg-surface-raised p-1"
      >
        {MODUSER.map(({ verdi, navn }) => {
          const valgt = verdi === modus;
          return (
            <button
              key={verdi}
              type="button"
              aria-pressed={valgt}
              onClick={() => butikk.getState().settModus(verdi)}
              className={`min-h-11 min-w-0 flex-auto rounded-full border-2 px-2 text-body leading-tight ${
                valgt
                  ? "border-accent-ink bg-accent font-medium text-text-on-pastel"
                  : "border-transparent text-text-primary"
              }`}
            >
              {navn}
            </button>
          );
        })}
      </div>
    </>
  );
}

/** Navnene på temaene. Rekkefølgen kommer fra skjemaet. */
const TEMANAVN: Record<InnstillingerData["tema"], string> = {
  blå: "Blå",
  oransje: "Oransje",
  lilla: "Lilla",
  gul: "Gul",
  grønn: "Grønn",
  rosa: "Rosa",
};

/**
 * Seks runde fargeprøver (`theme-swatch`, 36 px, trykkflate 44 px). Hver prøve
 * har `data-tema`, så fargen kommer fra temaets CSS-token. Den valgte har ring
 * i `accent-ink` og hake. Endres med én gang, uten Lagre.
 */
function Temavelger() {
  const valgt = useButikk((s) => s.dokument?.innstillinger.tema ?? "blå");
  const etikett = useId();

  return (
    <>
      <p id={etikett} className="mt-4 text-meta text-text-primary">
        Tema
      </p>
      <div role="group" aria-labelledby={etikett} className="mt-1 flex flex-wrap gap-1">
        {innstillingerSkjema.shape.tema.options.map((tema) => {
          const erValgt = tema === valgt;
          return (
            <button
              key={tema}
              type="button"
              aria-pressed={erValgt}
              aria-label={TEMANAVN[tema]}
              onClick={() => butikk.getState().settTema(tema)}
              className="flex size-11 items-center justify-center rounded-full"
            >
              <span
                data-tema={tema}
                className={`flex size-9 items-center justify-center rounded-full border border-border-input bg-(--tema-pastell) text-text-on-pastel ${
                  erValgt ? "ring-2 ring-accent-ink ring-offset-2 ring-offset-surface-raised" : ""
                }`}
              >
                {erValgt && <HakeIkon className="size-5" />}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

const KNAPP = "min-h-11 rounded-full px-5 text-body font-medium";
/** button-secondary og button-danger, som i dialogen på feilsiden. */
const SEKUNDÆR = `${KNAPP} border border-border-input bg-surface-raised text-text-primary`;
const FARE = `${KNAPP} bg-warn text-surface-raised`;

/**
 * Prosjektnavnene som er brukt på oppgaver (FR-61), regnet ut av kjernen og
 * aldri lagret. Søppelbøtta spør «Er du sikker?» før navnet fjernes fra alle
 * oppgavene. Skole, Jobb og Privat er faste etiketter og vises ikke.
 */
function Prosjekter() {
  const oppgaver = useButikk((s) => s.dokument?.oppgaver ?? null);
  const navn = useMemo(() => (oppgaver ? prosjektnavn(oppgaver) : []), [oppgaver]);
  const [valgt, settValgt] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const avbryt = useRef<HTMLButtonElement>(null);
  const tittel = useId();

  useEffect(() => {
    if (valgt === null || dialog.current?.open) return;
    dialog.current?.showModal();
    avbryt.current?.focus();
  }, [valgt]);

  // Raden som hadde fokus forsvinner ved sletting. Fokus flyttes da til
  // søppelbøtta på naborada, eller til lista når den blir tom.
  const liste = useRef<HTMLDivElement>(null);
  const fokusEtter = useRef<string | null>(null);

  useEffect(() => {
    if (fokusEtter.current === null) return;
    const mål = fokusEtter.current;
    fokusEtter.current = null;
    const knapp = [...(liste.current?.querySelectorAll("button") ?? [])].find(
      (k) => k.getAttribute("aria-label") === `Slett ${mål}`,
    );
    (knapp ?? liste.current)?.focus();
  }, [navn]);

  function slett() {
    if (valgt !== null) {
      const i = navn.indexOf(valgt);
      const før = butikk.getState().dokument;
      butikk.getState().slettProsjekt(valgt);
      // Med sperret skriving endres ingenting, og fokus går tilbake til søppelbøtta.
      if (butikk.getState().dokument !== før) {
        fokusEtter.current = navn[i + 1] ?? navn[i - 1] ?? "";
      }
    }
    dialog.current?.close();
  }

  const antall = valgt !== null && oppgaver ? antallMedProsjekt(oppgaver, valgt) : 0;

  return (
    <>
      <div ref={liste} tabIndex={-1}>
        {navn.length === 0 ? (
          <p className="text-body text-text-muted">
            Prosjekter dukker opp her når du skriver dem på en oppgave.
          </p>
        ) : (
          <ul className="-my-1">
            {navn.map((prosjekt) => (
              <li
                key={prosjekt}
                className="flex min-h-11 items-center gap-3 border-b border-border-hairline last:border-b-0"
              >
                <span className="min-w-0 flex-1 text-body break-words text-text-primary">
                  {prosjekt}
                </span>
                <button
                  type="button"
                  aria-label={`Slett ${prosjekt}`}
                  onClick={() => settValgt(prosjekt)}
                  className="-mr-2.5 flex size-11 shrink-0 items-center justify-center rounded-full text-text-muted hover:text-text-primary"
                >
                  <SøppelbøtteIkon className="size-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <dialog
        ref={dialog}
        aria-labelledby={tittel}
        onClose={() => settValgt(null)}
        className="m-auto w-[calc(100%-2*var(--margin-mobile))] max-w-md rounded-xl bg-surface-raised p-6 text-text-primary shadow-dialog backdrop:bg-black/50"
      >
        <h2 id={tittel} className="text-title">
          Er du sikker?
        </h2>
        <p className="mt-2">
          Prosjektet «{valgt}» fjernes fra {antall} {antall === 1 ? "oppgave" : "oppgaver"}.
          Oppgavene beholdes.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            ref={avbryt}
            type="button"
            className={SEKUNDÆR}
            onClick={() => dialog.current?.close()}
          >
            Avbryt
          </button>
          <button type="button" className={FARE} onClick={slett}>
            Slett
          </button>
        </div>
      </dialog>
    </>
  );
}

/** Innstillinger: Profil, Utseende, Prosjekter og Om appen. */
export function Innstillinger({ versjon }: { versjon: string }) {
  return (
    <>
      <h1 className="text-greeting">Innstillinger</h1>
      <div className="max-w-xl">
        <Seksjon tittel="Profil">
          <Profil />
        </Seksjon>
        <Seksjon tittel="Utseende">
          <Modusvelger />
          <Temavelger />
        </Seksjon>
        <Seksjon tittel="Prosjekter">
          <Prosjekter />
        </Seksjon>
        <Seksjon tittel="Om appen">
          <p className="text-body text-text-primary">Versjon {versjon} · Gruppe 43, IBE160</p>
        </Seksjon>
      </div>
    </>
  );
}

"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { HakeIkon } from "@/components/ikoner";
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

/** Innstillinger: Profil, Utseende og Om appen. */
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
        <Seksjon tittel="Om appen">
          <p className="text-body text-text-primary">Versjon {versjon} · Gruppe 43, IBE160</p>
        </Seksjon>
      </div>
    </>
  );
}

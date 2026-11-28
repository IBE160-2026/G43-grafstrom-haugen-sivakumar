"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Logo } from "@/components/ramme";
import { DEMO_ADVARSEL, SAMTYKKETEKST } from "@/kjerne/tekster";
import type { Samtykke } from "@/kjerne/skjema";
import { OPPSTART, PERSONVERNERKLÆRING } from "@/lib/ruter";
import { butikk, useButikk } from "@/lib/store";

const KNAPP = "min-h-11 rounded-full px-5 text-body font-medium";
/** button-primary: pastell og `text-on-pastel`. */
const PRIMÆR = `${KNAPP} bg-accent text-text-on-pastel`;
/** button-secondary: kortflate og `border-input`. */
const SEKUNDÆR = `${KNAPP} border border-border-input bg-surface-raised text-text-primary`;

/** To prikker øverst, og «Steg 1 av 2» for skjermlesere. */
function Steg({ nr }: { nr: 1 | 2 }) {
  return (
    <div className="flex gap-1.5">
      <span className="sr-only">Steg {nr} av 2</span>
      {[1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`h-1.5 w-6 rounded-full ${i <= nr ? "bg-accent-ink" : "bg-border-input"}`}
        />
      ))}
    </div>
  );
}

/** Helside med glød (`onboarding-page`): ett spørsmål, knappene nederst. */
function Side({ nr, children }: { nr: 1 | 2; children: ReactNode }) {
  return (
    <div className="glod min-h-dvh">
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-margin-mobile pt-8 pb-8">
        <Steg nr={nr} />
        {children}
      </main>
    </div>
  );
}

/** Steg 1: fornavn til hilsenen. Lagres ved Fortsett, ikke ved Hopp over. */
function Fornavn() {
  const router = useRouter();
  const lagret = useButikk((s) => s.dokument?.profil?.fornavn ?? "");
  const [utkast, settUtkast] = useState(lagret);
  const felt = useId();
  const hjelp = useId();

  function fortsett(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    butikk.getState().settFornavn(utkast);
    router.push(`${OPPSTART}?steg=2`);
  }

  return (
    <Side nr={1}>
      <Logo className="mt-8" />
      <h1 className="mt-6 text-greeting">Hei! Hva heter du?</h1>
      <form onSubmit={fortsett} className="mt-6 flex flex-1 flex-col">
        <label htmlFor={felt} className="block text-meta text-text-primary">
          Fornavn
        </label>
        <input
          id={felt}
          type="text"
          autoComplete="given-name"
          aria-describedby={hjelp}
          value={utkast}
          onChange={(e) => settUtkast(e.target.value)}
          className="mt-1 block min-h-11 w-full rounded-md border border-border-input bg-surface-raised px-3 text-body text-text-primary"
        />
        <p id={hjelp} className="mt-1 text-meta text-text-on-glow">
          Bare for hilsenen. Lagres på denne enheten.
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-8">
          <button type="submit" className={PRIMÆR}>
            Fortsett
          </button>
          <button
            type="button"
            onClick={() => router.push(`${OPPSTART}?steg=2`)}
            className={`${KNAPP} text-text-primary`}
          >
            Hopp over
          </button>
        </div>
      </form>
    </Side>
  );
}

/** Steg 2: demo-advarselen og samtykketeksten ordrett, og Ja/Nei like store. */
function KiValg() {
  const tittel = useId();
  const { overskrift, innledning, hvaSendes, navnSendesAldri, hvemFårDet, hvorLenge } =
    SAMTYKKETEKST;

  // `AppTilstand` er eneste sted som omdirigerer (AD-15): med et svar sender
  // den bort fra `/oppstart` til Oppgaver.
  function svar(valg: NonNullable<Samtykke>["svar"]) {
    butikk.getState().settSamtykke(valg);
  }

  return (
    <Side nr={2}>
      <h1 id={tittel} className="mt-6 text-greeting">
        {overskrift}
      </h1>

      {/* Nøytral infoboks, ikke varselfarge (FR-65). */}
      <div
        role="note"
        className="mt-4 rounded-lg border border-border-hairline bg-surface-raised p-4 text-body text-text-primary"
      >
        <strong>{DEMO_ADVARSEL.tittel}</strong> {DEMO_ADVARSEL.tekst}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border-hairline bg-surface-raised p-4 text-body text-text-primary">
        <p>{innledning}</p>
        <div>
          <p>
            <strong>{hvaSendes.tittel}</strong>
          </p>
          <ul className="list-disc pl-5">
            {hvaSendes.punkter.map((punkt) => (
              <li key={punkt}>{punkt}</li>
            ))}
          </ul>
        </div>
        <p>{navnSendesAldri}</p>
        <p>
          <strong>{hvemFårDet.tittel}</strong> {hvemFårDet.tekst}
        </p>
        <p>
          <strong>{hvorLenge.tittel}</strong> {hvorLenge.tekst}
        </p>
        <p>
          <strong>{SAMTYKKETEKST.duBestemmer.tittel}</strong>{" "}
          {SAMTYKKETEKST.duBestemmer.deler.map((del, i) => (
            <span key={i}>
              {i > 0 && " "}
              {typeof del === "string" ? del : <strong>{del.uthevet}</strong>}
            </span>
          ))}
        </p>
        <p>{SAMTYKKETEKST.utenKi}</p>
        <Link
          href={PERSONVERNERKLÆRING}
          className="flex min-h-11 items-center self-start text-accent-ink underline"
        >
          {SAMTYKKETEKST.lenke}
        </Link>
      </div>

      {/* Like store, side om side, ingen forhåndsvalgt og ingen primær. */}
      <div role="group" aria-labelledby={tittel} className="mt-6 grid grid-cols-2 gap-3">
        <button type="button" className={SEKUNDÆR} onClick={() => svar("nei")}>
          {SAMTYKKETEKST.knapper.nei}
        </button>
        <button type="button" className={SEKUNDÆR} onClick={() => svar("ja")}>
          {SAMTYKKETEKST.knapper.ja}
        </button>
      </div>
    </Side>
  );
}

/** Førstegangsoppsettet på `/oppstart`. Vises bare når KI-valget ikke er besvart. */
export function Oppstart({ steg }: { steg: 1 | 2 }) {
  return steg === 1 ? <Fornavn /> : <KiValg />;
}

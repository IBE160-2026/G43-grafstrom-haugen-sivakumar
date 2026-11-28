import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  DEMO_ADVARSEL,
  HVA_SENDES_TIL_KI,
  LAGRING,
  PERSONVERN_VALG,
  SAMTYKKETEKST,
} from "@/kjerne/tekster";

export const metadata: Metadata = { title: PERSONVERN_VALG.personvernerklæring };

/** Del av erklæringen: overskrift i `section-label` og innhold på kortflate. */
function Del({ tittel, children }: { tittel: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="section-label text-text-on-glow">{tittel}</h2>
      <div className="mt-2 flex flex-col gap-3 rounded-lg border border-border-hairline bg-surface-raised p-4 text-body">
        {children}
      </div>
    </section>
  );
}

function Punkter({ punkter }: { punkter: readonly string[] }) {
  return (
    <ul className="list-disc pl-5">
      {punkter.map((punkt) => (
        <li key={punkt}>{punkt}</li>
      ))}
    </ul>
  );
}

/**
 * Personvernerklæringen (FR-41). Ordlyden er ikke fastsatt i EXPERIENCE.md;
 * fakta som står i `kjerne/tekster.ts` hentes derfra, så de ikke glir fra
 * samtykketeksten og Personvern og data. Nevner ikke behandlingsansvarlig
 * eller SCC (NFR-11).
 */
export default function Personvernerklaering() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-greeting">{PERSONVERN_VALG.personvernerklæring}</h1>
      <p className="mt-1 text-text-on-glow">Her står hva dueNext gjør med det du skriver.</p>

      <Del tittel="Dette er en demo">
        <p>
          <strong>{DEMO_ADVARSEL.tittel}</strong> {DEMO_ADVARSEL.tekst}
        </p>
        <p>
          Gruppen som har laget appen, lagrer ingen data om deg. Appen har ingen innlogging og
          ingen egen database. Før appen kan brukes med ekte data, må personvernet vurderes på
          nytt, og denne erklæringen oppdateres.
        </p>
      </Del>

      <Del tittel="Hva appen lagrer">
        <p>
          Appen lagrer oppgavene, hendelsene og øktene dine, fornavnet ditt, temaet og
          samtykkevalget ditt. Gruppen får ingenting av dette.
        </p>
        <p>{LAGRING.tekst}</p>
      </Del>

      <Del tittel="Når KI er på">
        <p>
          KI er av til du sier ja. Sier du ja, sendes deler av det du skriver til KI-tjenesten
          Claude. Formålet er å foreslå etikett, prioritet og sammendrag, og å planlegge når du
          kan jobbe med oppgavene dine, også en ny tid hvis en økt kolliderer. Du kan slå KI av
          når som helst.
        </p>
        <div>
          <p>Dette sendes:</p>
          <Punkter punkter={HVA_SENDES_TIL_KI.sendes} />
        </div>
        <div>
          <p>Dette sendes ikke:</p>
          <Punkter punkter={HVA_SENDES_TIL_KI.sendesIkke} />
        </div>
        <p>{HVA_SENDES_TIL_KI.navnelinje}</p>
      </Del>

      <Del tittel="Hvem får det og hvor lenge">
        <p>{SAMTYKKETEKST.hvemFårDet.tekst}</p>
        <p>
          {SAMTYKKETEKST.hvorLenge.tekst} Anthropic kan også lagre data lenger hvis loven krever
          det.
        </p>
      </Del>

      <Del tittel="Du bestemmer">
        <p>
          Appen tar ingen automatiske avgjørelser om deg. KI kommer bare med forslag, og ingenting
          endres før du selv godtar det.
        </p>
        <p>
          Når KI er av eller ikke svarer, foreslår appen etikett og prioritet ut fra ord i teksten.
          Denne reserveløsningen sender ingenting.
        </p>
      </Del>

      <Del tittel="Aldersgrense">
        <p>Du må være minst 13 år for å bruke dueNext.</p>
      </Del>
    </div>
  );
}

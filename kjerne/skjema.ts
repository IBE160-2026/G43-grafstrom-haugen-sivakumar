import { z } from "zod";

/**
 * Det låste dokumentskjemaet (AD-4, AD-12). Skjemaet sjekker bare form:
 * alle objekter er strenge, ingen standardverdier (de settes i `nyttDokument()`)
 * og ingen regler på tvers av felt — de hører til kjernefunksjonene.
 */

export const GJELDENDE_SKJEMAVERSJON = 1;

const id = z.string().min(1);
/** `YYYY-MM-DD`, avviser ugyldige datoer som 2026-02-30. */
const dato = z.iso.date();
/** `HH:mm` i lokal tid. */
const klokkeslett = z.iso.time({ precision: -1 });
/** ISO-tidsstempel i UTC. */
const tidsstempel = z.iso.datetime();
/** Valgfri tekst: aldri tom streng, ellers `null`. */
const valgfriTekst = z.string().min(1).nullable();

export const etikettSkjema = z.enum(["Privat", "Skole", "Jobb"]);
export const prioritetSkjema = z.enum(["Lav", "Middels", "Høy"]);
export const forslagskildeSkjema = z.enum(["ki", "regelbasert"]);

export const øktForslagSkjema = z.strictObject({
  id,
  dato,
  start: klokkeslett,
  slutt: klokkeslett,
});

export const oppgaveForslagSkjema = z
  .strictObject({
    felt: z.strictObject({
      etikett: z
        .strictObject({ verdi: etikettSkjema, kilde: forslagskildeSkjema })
        .optional(),
      prioritet: z
        .strictObject({ verdi: prioritetSkjema, kilde: forslagskildeSkjema })
        .optional(),
      sammendrag: z
        .strictObject({ verdi: z.string().min(1), kilde: forslagskildeSkjema })
        .optional(),
    }),
    økter: z.array(øktForslagSkjema),
  })
  .nullable();

export const ventendeKallSkjema = z
  .strictObject({
    id,
    type: z.enum(["forslag", "nyTid"]),
  })
  .nullable();

export const oppgaveSkjema = z.strictObject({
  id,
  tekst: z.string().min(1),
  frist: dato.nullable(),
  prosjekt: valgfriTekst,
  etikett: etikettSkjema.nullable(),
  prioritet: prioritetSkjema,
  sammendrag: valgfriTekst,
  notater: valgfriTekst,
  skjultForKi: z.boolean(),
  createdAt: tidsstempel,
  fullført: tidsstempel.nullable(),
  forslag: oppgaveForslagSkjema,
  ventendeKall: ventendeKallSkjema,
});

export const øktSkjema = z.strictObject({
  id,
  oppgaveId: id,
  dato,
  start: klokkeslett,
  slutt: klokkeslett,
  kilde: z.enum(["ki", "manuell"]),
  avhuket: tidsstempel.nullable(),
  createdAt: tidsstempel,
});

export const hendelseSkjema = z.strictObject({
  id,
  tittel: z.string().min(1),
  dato,
  start: klokkeslett,
  // Slutt før start betyr neste dag, så ingen rekkefølgesjekk her.
  slutt: klokkeslett,
  skjulTittelForKi: z.boolean(),
  seriesId: id.nullable(),
  gjentakelse: z
    .strictObject({
      hver: z.enum(["uke", "annenhver-uke"]),
      sluttdato: dato,
    })
    .nullable(),
  createdAt: tidsstempel,
});

export const innstillingerSkjema = z.strictObject({
  modus: z.enum(["lys", "mørk", "system"]),
  tema: z.enum(["blå", "oransje", "lilla", "gul", "grønn", "rosa"]),
  sendAldriNotater: z.boolean(),
  sendHendelsestitler: z.boolean(),
});

export const profilSkjema = z
  .strictObject({
    fornavn: z.string().min(1),
  })
  .nullable();

export const samtykkeSkjema = z
  .strictObject({
    svar: z.enum(["ja", "nei"]),
    tidspunkt: tidsstempel,
    tekstversjon: z.number().int().nonnegative(),
  })
  .nullable();

export const dokumentSkjema = z.strictObject({
  schemaVersion: z.literal(GJELDENDE_SKJEMAVERSJON),
  oppgaver: z.array(oppgaveSkjema),
  økter: z.array(øktSkjema),
  hendelser: z.array(hendelseSkjema),
  innstillinger: innstillingerSkjema,
  profil: profilSkjema,
  samtykke: samtykkeSkjema,
});

export type ØktForslag = z.infer<typeof øktForslagSkjema>;
export type OppgaveForslag = z.infer<typeof oppgaveForslagSkjema>;
export type VentendeKall = z.infer<typeof ventendeKallSkjema>;
export type Oppgave = z.infer<typeof oppgaveSkjema>;
export type Økt = z.infer<typeof øktSkjema>;
export type Hendelse = z.infer<typeof hendelseSkjema>;
export type Innstillinger = z.infer<typeof innstillingerSkjema>;
export type Profil = z.infer<typeof profilSkjema>;
export type Samtykke = z.infer<typeof samtykkeSkjema>;
export type Dokument = z.infer<typeof dokumentSkjema>;

/** Et tomt dokument med standardverdiene. Bruker ingen klokke. */
export function nyttDokument(): Dokument {
  return {
    schemaVersion: GJELDENDE_SKJEMAVERSJON,
    oppgaver: [],
    økter: [],
    hendelser: [],
    innstillinger: {
      modus: "system",
      tema: "blå",
      sendAldriNotater: false,
      sendHendelsestitler: true,
    },
    profil: null,
    samtykke: null,
  };
}

import type { Dokument } from "@/kjerne/skjema";

export const T = "2026-11-26T10:00:00.000Z";

export function fulltDokument(): Dokument {
  return {
    schemaVersion: 1,
    oppgaver: [
      {
        id: "o1",
        tekst: "Les kapittel 3",
        frist: "2026-12-01",
        prosjekt: "IBE160",
        etikett: "Skole",
        prioritet: "Høy",
        sammendrag: "Les og noter",
        notater: null,
        skjultForKi: false,
        createdAt: T,
        fullført: null,
        forslag: {
          felt: {
            etikett: { verdi: "Skole", kilde: "ki" },
            prioritet: { verdi: "Middels", kilde: "regelbasert" },
            sammendrag: { verdi: "Kort", kilde: "ki" },
          },
          økter: [{ id: "f1", dato: "2026-11-27", start: "09:00", slutt: "10:30" }],
        },
        ventendeKall: { id: "k1", type: "forslag" },
      },
    ],
    økter: [
      {
        id: "ø1",
        oppgaveId: "o1",
        dato: "2026-11-27",
        start: "09:00",
        slutt: "10:30",
        kilde: "manuell",
        avhuket: T,
        createdAt: T,
      },
    ],
    hendelser: [
      {
        id: "h1",
        tittel: "Forelesning",
        dato: "2026-11-28",
        start: "23:00",
        slutt: "01:00",
        skjulTittelForKi: true,
        seriesId: "s1",
        gjentakelse: { hver: "annenhver-uke", sluttdato: "2027-01-31" },
        createdAt: T,
      },
    ],
    innstillinger: {
      modus: "mørk",
      tema: "grønn",
      sendAldriNotater: true,
      sendHendelsestitler: false,
    },
    profil: { fornavn: "Kari" },
    samtykke: { svar: "ja", tidspunkt: T, tekstversjon: 1 },
  };
}

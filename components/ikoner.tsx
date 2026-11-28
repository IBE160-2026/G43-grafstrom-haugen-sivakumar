import type { SVGProps } from "react";

/** Små linjeikoner som farges med `currentColor`. Dekorative: teksten ved siden av gir navnet. */
function Ikon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** ☰ Oppgaver */
export function OppgaverIkon(props: SVGProps<SVGSVGElement>) {
  return (
    <Ikon {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Ikon>
  );
}

/** Arkivboks */
export function ArkivIkon(props: SVGProps<SVGSVGElement>) {
  return (
    <Ikon {...props}>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
      <path d="M10 13h4" />
    </Ikon>
  );
}

/** ⚙ Innstillinger */
export function InnstillingerIkon(props: SVGProps<SVGSVGElement>) {
  return (
    <Ikon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Ikon>
  );
}

/** 🔒 Skjult for KI */
export function LåsIkon(props: SVGProps<SVGSVGElement>) {
  return (
    <Ikon {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Ikon>
  );
}

/** ⌄ Pil ned, for å felle sammen */
export function PilNedIkon(props: SVGProps<SVGSVGElement>) {
  return (
    <Ikon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Ikon>
  );
}

/** ✓ Hake, for valgt fargeprøve */
export function HakeIkon(props: SVGProps<SVGSVGElement>) {
  return (
    <Ikon {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Ikon>
  );
}

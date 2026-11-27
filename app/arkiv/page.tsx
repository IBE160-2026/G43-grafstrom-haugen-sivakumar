import type { Metadata } from "next";

export const metadata: Metadata = { title: "Arkiv" };

export default function Arkiv() {
  return (
    <>
      <h1 className="text-greeting">Arkiv</h1>
      <p className="mt-1 text-text-on-glow">Fullførte oppgaver kommer snart.</p>
    </>
  );
}

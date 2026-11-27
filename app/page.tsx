import type { Metadata } from "next";

// Malen i layouten gjelder ikke sider i samme segment, så tittelen er satt helt.
export const metadata: Metadata = { title: { absolute: "Oppgaver – dueNext" } };

export default function Oppgaver() {
  return (
    <>
      <h1 className="text-greeting">Oppgaver</h1>
      <p className="mt-1 text-text-on-glow">Oppgavene dine kommer snart.</p>
    </>
  );
}

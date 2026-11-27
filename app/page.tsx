import type { Metadata } from "next";
import { Hilsen } from "@/components/hilsen";

// Malen i layouten gjelder ikke sider i samme segment, så tittelen er satt helt.
export const metadata: Metadata = { title: { absolute: "Oppgaver – dueNext" } };

export default function Oppgaver() {
  return (
    <>
      <Hilsen />
      <p className="mt-1 text-text-on-glow">Oppgavene dine kommer snart.</p>
    </>
  );
}

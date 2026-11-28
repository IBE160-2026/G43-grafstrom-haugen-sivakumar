import type { Metadata } from "next";
import { Hilsen } from "@/components/hilsen";
import { Oppgaveliste } from "@/components/oppgaveliste";

// Malen i layouten gjelder ikke sider i samme segment, så tittelen er satt helt.
export const metadata: Metadata = { title: { absolute: "Oppgaver – dueNext" } };

export default function Oppgaver() {
  return (
    <>
      <Hilsen />
      <Oppgaveliste />
    </>
  );
}

import type { Metadata } from "next";
import pakke from "@/package.json";
import { Innstillinger as InnstillingerSkjerm } from "@/components/innstillinger";

export const metadata: Metadata = { title: "Innstillinger" };

export default function Innstillinger() {
  // Versjonen leses her på serveren, så package.json ikke havner i klientkoden.
  return <InnstillingerSkjerm versjon={pakke.version} />;
}

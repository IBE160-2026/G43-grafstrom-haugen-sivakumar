import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppTilstand } from "@/components/app-tilstand";
import { TEMA_SKRIPT } from "@/lib/storage/tema-skript";
import "./globals.css";

// Poppins er ikke variabel, så vektene må oppgis. Systemskrift er reserve (globals.css).
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: { template: "%s – dueNext", default: "dueNext" },
  description: "Norsk oppgaveapp for studenter",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nb" className={poppins.variable} suppressHydrationWarning>
      <head>
        {/* Setter tema og modus før første tegning (ingen blink). */}
        <script dangerouslySetInnerHTML={{ __html: TEMA_SKRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <AppTilstand>{children}</AppTilstand>
      </body>
    </html>
  );
}

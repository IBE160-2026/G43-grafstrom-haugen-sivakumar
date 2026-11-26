import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dueNext",
  description: "Norsk oppgaveapp for studenter",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

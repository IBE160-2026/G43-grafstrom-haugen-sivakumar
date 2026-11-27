import type { Metadata } from "next";

export const metadata: Metadata = { title: "Innstillinger" };

export default function Innstillinger() {
  return (
    <>
      <h1 className="text-greeting">Innstillinger</h1>
      <p className="mt-1 text-text-on-glow">Innstillingene kommer snart.</p>
    </>
  );
}

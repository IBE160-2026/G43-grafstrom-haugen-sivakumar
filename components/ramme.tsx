"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { ArkivIkon, InnstillingerIkon, OppgaverIkon } from "@/components/ikoner";

type Fane = {
  href: "/" | "/arkiv" | "/innstillinger";
  navn: string;
  Ikon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** Hovedfanene. Kalender kommer i story 5.6. */
const FANER: readonly Fane[] = [
  { href: "/", navn: "Oppgaver", Ikon: OppgaverIkon },
  { href: "/arkiv", navn: "Arkiv", Ikon: ArkivIkon },
];

const INNSTILLINGER: Fane = { href: "/innstillinger", navn: "Innstillinger", Ikon: InnstillingerIkon };

function erAktiv(stinavn: string, href: Fane["href"]) {
  return href === "/" ? stinavn === "/" : stinavn === href || stinavn.startsWith(`${href}/`);
}

/** «due**Next**», med «Next» i `accent-ink`. */
function Logo({ className = "" }: { className?: string }) {
  return (
    <p className={`text-title ${className}`}>
      due<span className="text-accent-ink">Next</span>
    </p>
  );
}

function SidemenyLenke({ fane, aktiv }: { fane: Fane; aktiv: boolean }) {
  const { Ikon } = fane;
  return (
    <Link
      href={fane.href}
      aria-current={aktiv ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-body ${
        aktiv ? "bg-accent font-semibold text-text-on-pastel" : "text-text-muted hover:text-text-primary"
      }`}
    >
      <Ikon className="size-5 shrink-0" />
      {fane.navn}
    </Link>
  );
}

/**
 * Appens ramme rundt sidene. Under `md` (768 px): toppfelt med logo og ⚙ og
 * bunnmeny med fanene. Fra `md`: sidemeny på 200 px med fanene øverst og
 * Innstillinger nederst. Hovedflaten har glød øverst og er bred nok til at
 * en side kan legge detaljpanelet (`w-panel`, 340 px) ved siden av lista fra `lg`.
 */
export function Ramme({ children }: { children: ReactNode }) {
  const stinavn = usePathname();
  const innstillingerAktiv = erAktiv(stinavn, INNSTILLINGER.href);

  return (
    <>
      <div className="min-h-dvh md:flex">
        <nav
          aria-label="Hovedmeny"
          className="sticky top-0 hidden h-dvh w-sidebar shrink-0 flex-col border-r border-border-hairline bg-surface-raised px-3 py-5 md:flex"
        >
          <Logo className="px-3 pb-4" />
          <ul className="flex flex-col gap-1">
            {FANER.map((fane) => (
              <li key={fane.href}>
                <SidemenyLenke fane={fane} aktiv={erAktiv(stinavn, fane.href)} />
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            <SidemenyLenke fane={INNSTILLINGER} aktiv={innstillingerAktiv} />
          </div>
        </nav>

        <div className="glod flex min-w-0 flex-1 flex-col">
          <header className="flex items-center px-margin-mobile pt-2 md:hidden">
            <Logo />
            <Link
              href={INNSTILLINGER.href}
              aria-label={INNSTILLINGER.navn}
              aria-current={innstillingerAktiv ? "page" : undefined}
              className={`-mr-2.5 ml-auto flex size-11 items-center justify-center rounded-full ${
                innstillingerAktiv ? "text-accent-ink" : "text-text-on-glow"
              }`}
            >
              <InnstillingerIkon className="size-6" />
            </Link>
          </header>
          <main className="flex-1 px-margin-mobile pt-3 pb-24 md:px-margin-desktop md:pt-6 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      <nav
        aria-label="Hovedmeny"
        className="fixed inset-x-0 bottom-0 z-10 border-t border-border-hairline bg-surface-raised pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="flex">
          {FANER.map(({ href, navn, Ikon }) => {
            const aktiv = erAktiv(stinavn, href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={aktiv ? "page" : undefined}
                  className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-tag ${
                    aktiv ? "font-semibold text-accent-ink" : "text-text-muted"
                  }`}
                >
                  <Ikon className="size-5" />
                  {navn}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

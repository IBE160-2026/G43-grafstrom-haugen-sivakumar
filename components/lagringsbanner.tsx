import { LAGRINGSBANNER } from "@/kjerne/tekster";

/** Står øverst og kan ikke lukkes. Vises så lenge lagringen feiler. */
export function Lagringsbanner() {
  return (
    <div
      role="alert"
      className="rounded-md border-2 border-warn bg-surface-raised px-4 py-3 text-text-primary"
    >
      {LAGRINGSBANNER.tekst}
    </div>
  );
}

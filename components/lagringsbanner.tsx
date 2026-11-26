import { LAGRINGSBANNER } from "@/kjerne/tekster";

/** Står øverst og kan ikke lukkes. Vises så lenge lagringen feiler. */
export function Lagringsbanner() {
  return (
    <div role="alert" className="px-4 py-3">
      {LAGRINGSBANNER.tekst}
    </div>
  );
}

import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./fikstur";
import { fulltDokument } from "../kjerne/fikstur";

const NØKKEL = "duenext";
const ØDELAGT = "{ikke json";

/** Teller kall til `localStorage.setItem` i `window.__skrivinger`. */
async function tellSkrivinger(page: Page) {
  await page.addInitScript(() => {
    const vindu = window as unknown as { __skrivinger: number };
    vindu.__skrivinger = 0;
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (this: Storage, ...args: [string, string]) {
      if (this === localStorage && args[0] === "duenext") vindu.__skrivinger++;
      return original.apply(this, args);
    };
  });
}

/** Legger rådata i lageret én gang per økt, før appen starter. */
async function leggInnÉnGang(page: Page, rå: string) {
  await page.addInitScript(
    ([nøkkel, verdi]) => {
      if (sessionStorage.getItem("lagt-inn")) return;
      localStorage.setItem(nøkkel, verdi);
      sessionStorage.setItem("lagt-inn", "1");
    },
    [NØKKEL, rå] as const,
  );
}

function lagret(page: Page) {
  return page.evaluate((nøkkel) => localStorage.getItem(nøkkel), NØKKEL);
}

test("gyldige data leses uten å skrive", async ({ page }) => {
  const rå = JSON.stringify(fulltDokument());
  await leggInnÉnGang(page, rå);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();

  await tellSkrivinger(page);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __skrivinger: number }).__skrivinger)).toBe(0);
  expect(await lagret(page)).toBe(rå);
});

test("ødelagte data gir feilside og lar lageret stå", async ({ page }) => {
  await leggInnÉnGang(page, ØDELAGT);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Appen kan ikke lese dataene dine" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Last ned data" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Slett alle data" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Appen kan ikke lese dataene dine" })).toBeVisible();
  expect(await lagret(page)).toBe(ØDELAGT);

  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test("data fra nyere versjon gir egen feilside", async ({ page }) => {
  const rå = JSON.stringify({ ...fulltDokument(), schemaVersion: 2 });
  await leggInnÉnGang(page, rå);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Dataene er lagret av en nyere versjon av dueNext" }),
  ).toBeVisible();
  expect(await lagret(page)).toBe(rå);
});

test("Last ned data gir rådataene ordrett", async ({ page }) => {
  await leggInnÉnGang(page, ØDELAGT);
  await page.goto("/");
  const nedlasting = page.waitForEvent("download");
  await page.getByRole("button", { name: "Last ned data" }).click();
  const fil = await nedlasting;
  expect(fil.suggestedFilename()).toBe("duenext-data.json");
  expect(await readFile(await fil.path(), "utf8")).toBe(ØDELAGT);
});

test("Slett alle data fra feilsiden: Avbryt endrer ingenting, Slett alt starter på nytt", async ({
  page,
}) => {
  await leggInnÉnGang(page, ØDELAGT);
  await page.goto("/");

  await page.getByRole("button", { name: "Slett alle data" }).click();
  const dialog = page.getByRole("dialog", { name: "Slette alle data?" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Avbryt" })).toBeFocused();
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
  await dialog.getByRole("button", { name: "Avbryt" }).click();
  await expect(dialog).toBeHidden();
  expect(await lagret(page)).toBe(ØDELAGT);

  await page.getByRole("button", { name: "Slett alle data" }).click();
  await dialog.getByRole("button", { name: "Slett alt" }).click();
  // Alt er slettet, også KI-valget, så appen starter på førstegangsoppsettet (3.3).
  await expect(page).toHaveURL(/\/oppstart$/);
  await expect(page.getByRole("heading", { level: 1, name: "Hei! Hva heter du?" })).toBeVisible();
  const nytt = JSON.parse((await lagret(page)) ?? "null");
  expect(nytt).toMatchObject({ schemaVersion: 1, oppgaver: [] });
});

test.describe("første start med full kvote", () => {
  // Tomt lager, så appen må skrive og feiler. Uten KI-valg er det oppsettet som vises.
  test.use({ medSamtykke: false });

  test("setItem som kaster gir lagringsbanneret øverst", async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException("Kvoten er full", "QuotaExceededError");
      };
    });
    await page.goto("/");
    const banner = page.getByRole("alert").filter({ hasText: "Nettleseren lar ikke appen lagre." });
    await expect(banner).toHaveText(
      "Nettleseren lar ikke appen lagre. Det du skriver nå, forsvinner når du lukker fanen.",
    );
    const overskrift = page.getByRole("heading", { level: 1, name: /^Hei/ });
    await expect(overskrift).toBeVisible();
    const bannerBoks = await banner.boundingBox();
    const overskriftBoks = await overskrift.boundingBox();
    expect(bannerBoks!.y).toBeLessThan(overskriftBoks!.y);
    expect(bannerBoks!.y).toBe(0);

    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });
});

test("to faner: den andre laster på nytt uten å skrive tilbake", async ({ context }) => {
  const a = await context.newPage();
  const b = await context.newPage();
  await a.goto("/");
  await expect(a.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  await tellSkrivinger(b);
  await b.addInitScript(() => {
    const vindu = window as unknown as { __hendelser: number };
    vindu.__hendelser = 0;
    window.addEventListener("storage", () => vindu.__hendelser++);
  });
  await b.goto("/");
  await expect(b.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  const skrivingerIB = () =>
    b.evaluate(() => (window as unknown as { __skrivinger: number }).__skrivinger);
  expect(await skrivingerIB()).toBe(0);

  // Gyldig skriving i A: B laster uten å skrive.
  await a.evaluate(
    ([nøkkel, verdi]) => localStorage.setItem(nøkkel, verdi),
    [NØKKEL, JSON.stringify(fulltDokument())] as const,
  );
  await expect.poll(() => b.evaluate(() => (window as unknown as { __hendelser: number }).__hendelser)).toBe(1);
  await expect(b.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  // TemaSynk følger det nye dokumentet (fulltDokument: grønn og mørk).
  await expect(b.locator("html")).toHaveAttribute("data-tema", "grønn");
  await expect(b.locator("html")).toHaveAttribute("data-modus", "mørk");
  expect(await skrivingerIB()).toBe(0);

  // Skriving fra nyere versjon i A: B viser feilsiden, som viser at B lastet på nytt.
  const forNy = JSON.stringify({ ...fulltDokument(), schemaVersion: 2 });
  await a.evaluate(([nøkkel, verdi]) => localStorage.setItem(nøkkel, verdi), [NØKKEL, forNy] as const);
  await expect(
    b.getByRole("heading", { name: "Dataene er lagret av en nyere versjon av dueNext" }),
  ).toBeVisible();
  expect(await skrivingerIB()).toBe(0);
  expect(await lagret(a)).toBe(forNy);
});

test("sletting som feiler gir banner på feilsiden", async ({ page }) => {
  await leggInnÉnGang(page, ØDELAGT);
  await page.addInitScript(() => {
    Storage.prototype.removeItem = () => {
      throw new DOMException("Blokkert", "SecurityError");
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Slett alle data" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Slett alt" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Nettleseren lar ikke appen lagre." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Appen kan ikke lese dataene dine" })).toBeVisible();
  expect(await lagret(page)).toBe(ØDELAGT);
});

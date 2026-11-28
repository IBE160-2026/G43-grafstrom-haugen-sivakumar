import { expect, test, type Page } from "./fikstur";
import { HVA_SENDES_TIL_KI } from "../../kjerne/tekster";

const RUTER = ["/", "/arkiv", "/innstillinger", "/personvernerklaering"] as const;

/** Den synlige lenken (den andre er skjult med `display: none` på denne bredden). */
const lenke = (page: Page) => page.getByRole("link", { name: "Personvernerklæring", exact: true });

async function åpne(page: Page, rute: string) {
  await page.goto(rute);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

for (const rute of RUTER) {
  test(`${rute} har én synlig lenke med trykkflate på minst 44 px`, async ({ page }) => {
    await åpne(page, rute);
    await expect(lenke(page)).toHaveCount(1);
    await expect(lenke(page)).toBeVisible();
    const boks = (await lenke(page).boundingBox())!;
    expect(boks.height).toBeGreaterThanOrEqual(44);
    expect(boks.width).toBeGreaterThanOrEqual(44);
    if (rute === "/personvernerklaering") {
      await expect(lenke(page)).toHaveAttribute("aria-current", "page");
    } else {
      await expect(lenke(page)).not.toHaveAttribute("aria-current");
    }
  });
}

test.describe("mobil", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobil", "Mobilbredder testes i mobilprosjektet");
  });

  for (const rute of RUTER) {
    test(`${rute}: lenken står nederst på siden, under glødsonen og over bunnmenyen`, async ({ page }) => {
      await åpne(page, rute);
      await expect(page.getByRole("navigation", { name: "Hovedmeny" }).getByRole("link", { name: "Personvernerklæring" })).toHaveCount(0);
      const main = page.locator("main");
      await expect(main.getByRole("link", { name: "Personvernerklæring" })).toBeVisible();

      const l = (await lenke(page).boundingBox())!;
      // Gløden tones ut over 70 % av 340 px.
      expect(l.y).toBeGreaterThan(340);
      // Lenken er det siste i innholdet.
      const sistErLenken = await main.evaluate(
        (el) => el.lastElementChild?.textContent === "Personvernerklæring",
      );
      expect(sistErLenken).toBe(true);
    });
  }

  test("på en kort side står lenken likevel nederst i vinduet", async ({ page }) => {
    await åpne(page, "/arkiv");
    const høyde = page.viewportSize()!.height;
    const l = (await lenke(page).boundingBox())!;
    const meny = (await page.getByRole("navigation", { name: "Hovedmeny" }).boundingBox())!;
    expect(l.y + l.height).toBeLessThanOrEqual(meny.y);
    expect(l.y).toBeGreaterThan(høyde / 2);
  });
});

test.describe("PC", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "pc", "Bredere skjermer testes i PC-prosjektet");
  });

  for (const rute of RUTER) {
    test(`${rute}: lenken står nederst i sidemenyen under Innstillinger`, async ({ page }) => {
      await åpne(page, rute);
      const meny = page.getByRole("navigation", { name: "Hovedmeny" });
      await expect(meny.getByRole("link", { name: "Personvernerklæring" })).toBeVisible();
      await expect(page.locator("main").getByRole("link", { name: "Personvernerklæring" })).toBeHidden();
      const innstillinger = (await meny.getByRole("link", { name: "Innstillinger" }).boundingBox())!;
      const l = (await lenke(page).boundingBox())!;
      expect(l.y).toBeGreaterThanOrEqual(innstillinger.y + innstillinger.height);
    });
  }
});

test("lenken åpner erklæringen", async ({ page }) => {
  await åpne(page, "/");
  await lenke(page).click();
  await expect(page).toHaveURL(/\/personvernerklaering$/);
  await expect(page).toHaveTitle("Personvernerklæring – dueNext");
  await expect(page.getByRole("heading", { level: 1, name: "Personvernerklæring" })).toBeVisible();
});

test("erklæringen dekker FR-41 og nevner ikke behandlingsansvarlig eller SCC", async ({ page }) => {
  await åpne(page, "/personvernerklaering");
  const main = page.locator("main");

  // Hver del er en overskrift.
  for (const del of [
    "Dette er en demo",
    "Hva appen lagrer",
    "Når KI er på",
    "Hvem får det og hvor lenge",
    "Du bestemmer",
    "Aldersgrense",
  ]) {
    await expect(main.getByRole("heading", { level: 2, name: del })).toBeVisible();
  }

  const tekst = (await main.innerText()).toLowerCase();
  for (const påkrevd of [
    "test- eller fiktive data",
    "lagrer ingen data",
    "dataene behandles i usa",
    "30 dager",
    "2 år",
    "kan ikke slettes fra appen",
    "planlegge",
    "ingen automatiske avgjørelser",
    "reserveløsningen sender ingenting",
    "13 år",
    "fornavnet ditt, temaet og samtykkevalget ditt",
    "bare i denne nettleseren",
    ...HVA_SENDES_TIL_KI.sendes,
    ...HVA_SENDES_TIL_KI.sendesIkke,
    HVA_SENDES_TIL_KI.navnelinje,
  ]) {
    expect(tekst, påkrevd).toContain(påkrevd.toLowerCase());
  }
  expect(tekst).not.toContain("behandlingsansvarlig");
  expect(tekst).not.toMatch(/\bscc\b/);
});

test("feilsiden erstatter rammen, så lenken vises ikke der", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("duenext", "{ikke json"));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Appen kan ikke lese dataene dine" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Personvernerklæring" })).toHaveCount(0);
});

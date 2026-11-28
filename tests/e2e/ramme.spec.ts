import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const meny = (page: Page) => page.getByRole("navigation", { name: "Hovedmeny" });

async function ingenVannrettRulling(page: Page) {
  const { scrollBredde, klientBredde } = await page.evaluate(() => ({
    scrollBredde: document.documentElement.scrollWidth,
    klientBredde: document.documentElement.clientWidth,
  }));
  expect(scrollBredde).toBeLessThanOrEqual(klientBredde);
}

test.describe("mobil", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobil", "Mobilbredder testes i mobilprosjektet");
  });

  for (const bredde of [320, 412]) {
    test(`bunnmeny og toppfelt ved ${bredde} px`, async ({ page }) => {
      await page.setViewportSize({ width: bredde, height: 800 });
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();

      // Bare én meny er synlig, og den ligger nederst.
      await expect(meny(page)).toHaveCount(1);
      const boks = (await meny(page).boundingBox())!;
      expect(boks.y + boks.height).toBeCloseTo(800, 0);
      expect(boks.width).toBe(bredde);

      await expect(page.getByRole("link", { name: "Innstillinger" })).toBeVisible();
      await ingenVannrettRulling(page);

      // Trykkflater ≥ 44 × 44 px.
      const lenker = page.locator("nav, header").getByRole("link");
      const antall = await lenker.count();
      expect(antall).toBe(3);
      for (let i = 0; i < antall; i++) {
        const b = (await lenker.nth(i).boundingBox())!;
        expect(b.width).toBeGreaterThanOrEqual(44);
        expect(b.height).toBeGreaterThanOrEqual(44);
      }
    });
  }

  test("aria-current følger ruta i bunnmenyen", async ({ page }) => {
    await page.goto("/");
    const oppgaver = meny(page).getByRole("link", { name: "Oppgaver" });
    const arkiv = meny(page).getByRole("link", { name: "Arkiv" });
    await expect(oppgaver).toHaveAttribute("aria-current", "page");
    await expect(arkiv).not.toHaveAttribute("aria-current");

    await arkiv.click();
    await expect(page).toHaveURL(/\/arkiv$/);
    await expect(page.getByRole("heading", { name: "Arkiv" })).toBeVisible();
    await expect(arkiv).toHaveAttribute("aria-current", "page");
    await expect(oppgaver).not.toHaveAttribute("aria-current");

    const innstillinger = page.getByRole("link", { name: "Innstillinger" });
    await innstillinger.click();
    await expect(page).toHaveURL(/\/innstillinger$/);
    await expect(innstillinger).toHaveAttribute("aria-current", "page");
    await expect(arkiv).not.toHaveAttribute("aria-current");
  });
});

test.describe("nettbrett og PC", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "pc", "Bredere skjermer testes i PC-prosjektet");
  });

  for (const bredde of [768, 1023, 1280]) {
    test(`sidemeny på 200 px ved ${bredde} px`, async ({ page }) => {
      await page.setViewportSize({ width: bredde, height: 800 });
      await page.goto("/");
      await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();

      await expect(meny(page)).toHaveCount(1);
      const boks = (await meny(page).boundingBox())!;
      expect(boks.x).toBe(0);
      expect(boks.width).toBe(200);
      expect(boks.height).toBe(800);

      // Innstillinger ligger nederst i sidemenyen.
      const innstillinger = (await meny(page).getByRole("link", { name: "Innstillinger" }).boundingBox())!;
      expect(innstillinger.y).toBeGreaterThan(600);
      await ingenVannrettRulling(page);
    });
  }

  test("aria-current følger ruta i sidemenyen", async ({ page }) => {
    await page.goto("/arkiv");
    const arkiv = meny(page).getByRole("link", { name: "Arkiv" });
    await expect(arkiv).toHaveAttribute("aria-current", "page");
    await meny(page).getByRole("link", { name: "Innstillinger" }).click();
    await expect(page).toHaveURL(/\/innstillinger$/);
    await expect(meny(page).getByRole("link", { name: "Innstillinger" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(arkiv).not.toHaveAttribute("aria-current");
  });
});

test("ingen Kalender-fane, lupe eller ny oppgave-knapp", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  await expect(page.getByText("Kalender")).toHaveCount(0);
  // Next sin dev-verktøyknapp ligger i en egen shadow root utenfor appen.
  const app = page.locator("main, nav, header");
  await expect(app.getByRole("button")).toHaveCount(0);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /ny oppgave/i })).toHaveCount(0);
});

for (const [rute, tittel, sidetittel] of [
  ["/", /^Hei/, "Oppgaver – dueNext"],
  ["/arkiv", "Arkiv", "Arkiv – dueNext"],
  ["/innstillinger", "Innstillinger", "Innstillinger – dueNext"],
] as const) {
  test(`${rute} har tittel, glød og ingen axe-brudd`, async ({ page }) => {
    await page.goto(rute);
    await expect(page).toHaveTitle(sidetittel);
    await expect(page.getByRole("heading", { level: 1, name: tittel })).toBeVisible();
    const glød = await page
      .locator("main")
      .evaluate((el) => getComputedStyle(el.parentElement!).backgroundImage);
    expect(glød).toContain("radial-gradient");
    // Sekundærteksten i glødsonen bruker text-on-glow.
    const farger = await page.locator("main :is(p, h2)").first().evaluate((el) => {
      const prøve = document.createElement("span");
      prøve.style.color = "var(--text-on-glow)";
      document.body.append(prøve);
      const forventet = getComputedStyle(prøve).color;
      prøve.remove();
      return { faktisk: getComputedStyle(el).color, forventet };
    });
    expect(farger.faktisk).toBe(farger.forventet);
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });
}

test("fokusringen er 2 px accent-ink med 2 px avstand", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  const menylenke = page.locator("nav a:focus, header a:focus");
  for (let i = 0; i < 10 && (await menylenke.count()) === 0; i++) {
    await page.keyboard.press("Tab");
  }
  await expect(menylenke).toHaveCount(1);
  const ring = await menylenke.evaluate((el) => {
    const stil = getComputedStyle(el);
    const prøve = document.createElement("span");
    prøve.style.color = "var(--accent-ink)";
    document.body.append(prøve);
    const forventet = getComputedStyle(prøve).color;
    prøve.remove();
    return {
      bredde: stil.outlineWidth,
      stil: stil.outlineStyle,
      avstand: stil.outlineOffset,
      farge: stil.outlineColor,
      forventet,
    };
  });
  expect(ring).toMatchObject({ bredde: "2px", stil: "solid", avstand: "2px" });
  expect(ring.farge).toBe(ring.forventet);
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import type { Innstillinger } from "@/kjerne/skjema";
import { innstillingerSkjema, nyttDokument } from "@/kjerne/skjema";

const NØKKEL = "duenext";
const MØRK_BAKGRUNN = "rgb(21, 22, 26)"; // surface-base-dark #15161A
const LYS_BAKGRUNN = "rgb(247, 247, 245)"; // surface-base #F7F7F5

type Vindu = { __vedBody?: { tema: string | null; modus: string | null } };

/**
 * Noterer `data-tema`/`data-modus` i det `<body>` dukker opp, altså etter
 * skriptet i `<head>` og før React har hydrert noe.
 */
async function noterFørsteTegning(page: Page) {
  await page.addInitScript(() => {
    const observatør = new MutationObserver(() => {
      if (!document.body) return;
      const html = document.documentElement;
      (window as unknown as Vindu).__vedBody = {
        tema: html.getAttribute("data-tema"),
        modus: html.getAttribute("data-modus"),
      };
      observatør.disconnect();
    });
    observatør.observe(document, { childList: true, subtree: true });
  });
}

function førsteTegning(page: Page) {
  return page.evaluate(() => (window as unknown as Vindu).__vedBody);
}

async function leggInn(page: Page, rå: string) {
  await page.addInitScript(([nøkkel, verdi]) => localStorage.setItem(nøkkel, verdi), [NØKKEL, rå] as const);
}

function dokumentMed(innstillinger: Partial<Innstillinger>) {
  const dokument = nyttDokument();
  return JSON.stringify({ ...dokument, innstillinger: { ...dokument.innstillinger, ...innstillinger } });
}

/** Samler hydreringsfeil fra konsollen. */
function samleHydreringsfeil(page: Page) {
  const feil: string[] = [];
  page.on("console", (melding) => {
    if (melding.type() === "error" && /hydrat/i.test(melding.text())) feil.push(melding.text());
  });
  page.on("pageerror", (e) => {
    if (/hydrat/i.test(e.message)) feil.push(e.message);
  });
  return feil;
}

const html = (page: Page) => page.locator("html");
const bakgrunn = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test("første start: blå og system før første tegning", async ({ page }) => {
  const feil = samleHydreringsfeil(page);
  await noterFørsteTegning(page);
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  expect(await førsteTegning(page)).toEqual({ tema: "blå", modus: "system" });
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  await expect(html(page)).toHaveAttribute("data-tema", "blå");
  await expect(html(page)).toHaveAttribute("data-modus", "system");
  expect(await bakgrunn(page)).toBe(LYS_BAKGRUNN);
  expect(feil).toEqual([]);
});

test("lagret rosa og mørk gjelder fra første tegning og etter hydrering", async ({ page }) => {
  const feil = samleHydreringsfeil(page);
  await leggInn(page, dokumentMed({ tema: "rosa", modus: "mørk" }));
  await noterFørsteTegning(page);
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  expect(await førsteTegning(page)).toEqual({ tema: "rosa", modus: "mørk" });
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  await expect(html(page)).toHaveAttribute("data-tema", "rosa");
  await expect(html(page)).toHaveAttribute("data-modus", "mørk");
  expect(await bakgrunn(page)).toBe(MØRK_BAKGRUNN);
  expect(feil).toEqual([]);
});

test("system følger et mørkt operativsystem", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  await expect(html(page)).toHaveAttribute("data-modus", "system");
  expect(await bakgrunn(page)).toBe(MØRK_BAKGRUNN);
});

test("lys modus overstyrer et mørkt operativsystem", async ({ page }) => {
  await leggInn(page, dokumentMed({ modus: "lys" }));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  expect(await bakgrunn(page)).toBe(LYS_BAKGRUNN);
});

for (const [navn, rå] of [
  ["ødelagt JSON", "{ikke json"],
  ["ukjent tema", dokumentMed({ tema: "turkis" as Innstillinger["tema"], modus: "mørk" })],
] as const) {
  test(`${navn} gir standardverdiene og feilsiden med stil`, async ({ page }) => {
    await leggInn(page, rå);
    await noterFørsteTegning(page);
    await page.goto("/");
    expect(await førsteTegning(page)).toEqual({ tema: "blå", modus: "system" });
    await expect(page.getByRole("heading", { name: "Appen kan ikke lese dataene dine" })).toBeVisible();
    await expect(html(page)).toHaveAttribute("data-tema", "blå");
    const fare = await page.getByRole("button", { name: "Slett alle data" }).evaluate(
      (el) => getComputedStyle(el).borderRadius,
    );
    expect(fare).toBe("9999px");
  });
}

test("blokkert lager gir standardverdiene", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Blokkert", "SecurityError");
    };
  });
  await noterFørsteTegning(page);
  await page.goto("/");
  expect(await førsteTegning(page)).toEqual({ tema: "blå", modus: "system" });
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  await expect(html(page)).toHaveAttribute("data-tema", "blå");
  await expect(html(page)).toHaveAttribute("data-modus", "system");
});

/** Pastellfargene fra DESIGN.md. */
const PASTELL: Record<Innstillinger["tema"], string> = {
  blå: "#a9cbf2",
  oransje: "#f9c9a2",
  lilla: "#cdbbee",
  gul: "#f5e39e",
  grønn: "#b6e2c4",
  rosa: "#f5bfd4",
};

const egenskap = (page: Page, navn: string) =>
  page.evaluate(
    (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim().toLowerCase(),
    navn,
  );

test.describe("axe i alle temaer", () => {
  for (const tema of innstillingerSkjema.shape.tema.options) {
    for (const modus of ["lys", "mørk"] as const) {
      test(`${tema} / ${modus}`, async ({ page }) => {
        await leggInn(page, dokumentMed({ tema, modus }));
        for (const [rute, tittel] of [
          ["/", /^Hei/],
          ["/innstillinger", "Innstillinger"],
        ] as const) {
          await page.goto(rute);
          await expect(page.getByRole("heading", { level: 1, name: tittel })).toBeVisible();
          await expect(html(page)).toHaveAttribute("data-tema", tema);
          expect(await egenskap(page, "--tema-pastell")).toBe(PASTELL[tema]);
          const axe = await new AxeBuilder({ page }).analyze();
          expect(axe.violations).toEqual([]);
        }
      });
    }
  }
});

/** Egenskapene som settes i begge mørke blokker i globals.css. */
const MØRKE_EGENSKAPER = [
  "--surface-base",
  "--surface-raised",
  "--text-primary",
  "--text-muted",
  "--text-on-glow",
  "--border-hairline",
  "--border-subtle",
  "--border-input",
  "--warn",
  "--snackbar-bg",
  "--snackbar-text",
  "--accent-ink",
  "--snackbar-action",
  "--glow",
  "--ai-box-mix",
];

test("mørk modus og system med mørkt operativsystem gir like verdier", async ({ page }) => {
  const les = () =>
    page.evaluate((navn) => {
      const stil = getComputedStyle(document.documentElement);
      return Object.fromEntries(navn.map((n) => [n, stil.getPropertyValue(n).trim()]));
    }, MØRKE_EGENSKAPER);

  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
  await page.evaluate(() => document.documentElement.setAttribute("data-modus", "mørk"));
  const mørk = await les();

  await page.evaluate(() => document.documentElement.setAttribute("data-modus", "system"));
  await page.emulateMedia({ colorScheme: "dark" });
  const system = await les();

  expect(mørk["--surface-base"]?.toLowerCase()).toBe("#15161a");
  expect(system).toEqual(mørk);
});

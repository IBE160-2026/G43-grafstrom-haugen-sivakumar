import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import pakke from "../../package.json";
import { nyttDokument, type Dokument } from "@/kjerne/skjema";

const NØKKEL = "duenext";

/** Legger dokumentet i lageret én gang per økt, før appen starter. */
async function leggInnÉnGang(page: Page, dokument: Dokument) {
  await page.addInitScript(
    ([nøkkel, verdi]) => {
      if (sessionStorage.getItem("lagt-inn")) return;
      localStorage.setItem(nøkkel, verdi);
      sessionStorage.setItem("lagt-inn", "1");
    },
    [NØKKEL, JSON.stringify(dokument)] as const,
  );
}

async function lagret(page: Page): Promise<Dokument | null> {
  const rå = await page.evaluate((nøkkel) => localStorage.getItem(nøkkel), NØKKEL);
  return rå === null ? null : JSON.parse(rå);
}

const html = (page: Page) => page.locator("html");
const fornavn = (page: Page) => page.getByRole("textbox", { name: "Fornavn" });
const lagre = (page: Page) => page.getByRole("button", { name: "Lagre" });
const modus = (page: Page, navn: "Lys" | "Mørk" | "Følg systemet") =>
  page.getByRole("group", { name: "Modus" }).getByRole("button", { name: navn });

async function åpneInnstillinger(page: Page) {
  await page.goto("/innstillinger");
  await expect(page.getByRole("heading", { level: 1, name: "Innstillinger" })).toBeVisible();
}

/** Går til Oppgaver via menyen, uten å laste siden på nytt. */
async function tilOppgaver(page: Page) {
  await page.getByRole("navigation", { name: "Hovedmeny" }).getByRole("link", { name: "Oppgaver" }).click();
  await expect(page).toHaveURL(/\/$/);
}

async function ingenAxeBrudd(page: Page) {
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
}

test("seksjonene står i rekkefølgen Profil, Utseende, Om appen", async ({ page }) => {
  await åpneInnstillinger(page);
  await expect(page.locator("main h2")).toHaveText(["Profil", "Utseende", "Om appen"]);
  await expect(page.locator("main section")).toHaveCount(3);
  await expect(page.getByText(`Versjon ${pakke.version} · Gruppe 43, IBE160`)).toBeVisible();
  await expect(page.getByText("Bare for hilsenen. Lagres på denne enheten.")).toBeVisible();
  for (const navn of ["Prosjekter", "Tema", "Personvern og data"]) {
    await expect(page.getByRole("heading", { name: navn, exact: true })).toHaveCount(0);
  }
});

test("uten fornavn viser Oppgaver «Hei 👋»", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Hei 👋", exact: true })).toBeVisible();
  expect((await lagret(page))?.profil).toBeNull();
});

test("fornavnet trimmes, lagres og vises i hilsenen", async ({ page }) => {
  await åpneInnstillinger(page);
  await fornavn(page).fill("  Ida  ");
  await lagre(page).click();
  await expect(page.getByRole("status").filter({ hasText: "Lagret." })).toBeVisible();
  await expect(fornavn(page)).toHaveValue("Ida");
  expect((await lagret(page))?.profil).toEqual({ fornavn: "Ida" });

  await tilOppgaver(page);
  await expect(page.getByRole("heading", { level: 1, name: "Hei, Ida 👋" })).toBeVisible();

  // Også etter ny oppstart.
  await page.reload();
  await expect(page.getByRole("heading", { level: 1, name: "Hei, Ida 👋" })).toBeVisible();
});

for (const [navn, verdi] of [
  ["tomt felt", ""],
  ["bare mellomrom", "   "],
] as const) {
  test(`${navn} gir profil: null og «Hei 👋»`, async ({ page }) => {
    await leggInnÉnGang(page, { ...nyttDokument(), profil: { fornavn: "Ida" } });
    await åpneInnstillinger(page);
    await expect(fornavn(page)).toHaveValue("Ida");
    await fornavn(page).fill(verdi);
    await lagre(page).click();
    await expect(page.getByRole("status").filter({ hasText: "Lagret." })).toBeVisible();
    expect((await lagret(page))?.profil).toBeNull();

    await tilOppgaver(page);
    await expect(page.getByRole("heading", { level: 1, name: "Hei 👋", exact: true })).toBeVisible();
  });
}

test("Mørk gjelder straks, er valgt og lagret", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await åpneInnstillinger(page);
  await expect(modus(page, "Følg systemet")).toHaveAttribute("aria-pressed", "true");

  await modus(page, "Mørk").click();
  await expect(html(page)).toHaveAttribute("data-modus", "mørk");
  await expect(modus(page, "Mørk")).toHaveAttribute("aria-pressed", "true");
  await expect(modus(page, "Lys")).toHaveAttribute("aria-pressed", "false");
  await expect(modus(page, "Følg systemet")).toHaveAttribute("aria-pressed", "false");
  expect((await lagret(page))?.innstillinger.modus).toBe("mørk");

  // Valgt knapp har 2 px kant i accent-ink, ikke bare pastellfyll.
  const kant = await modus(page, "Mørk").evaluate((el) => {
    const prøve = document.createElement("span");
    prøve.style.color = "var(--accent-ink)";
    document.body.append(prøve);
    const forventet = getComputedStyle(prøve).color;
    prøve.remove();
    const stil = getComputedStyle(el);
    return { bredde: stil.borderTopWidth, farge: stil.borderTopColor, forventet };
  });
  expect(kant.bredde).toBe("2px");
  expect(kant.farge).toBe(kant.forventet);
});

test("lagret lys modus gjelder fra første tegning ved neste oppstart, også med mørkt OS", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await åpneInnstillinger(page);
  await modus(page, "Lys").click();
  await expect(html(page)).toHaveAttribute("data-modus", "lys");

  // Noterer modusen i det <body> dukker opp, før React har hydrert.
  await page.addInitScript(() => {
    const observatør = new MutationObserver(() => {
      if (!document.body) return;
      (window as unknown as { __modus: string | null }).__modus =
        document.documentElement.getAttribute("data-modus");
      observatør.disconnect();
    });
    observatør.observe(document, { childList: true, subtree: true });
  });
  await page.reload();
  expect(await page.evaluate(() => (window as unknown as { __modus: string | null }).__modus)).toBe("lys");
  await expect(page.getByRole("heading", { level: 1, name: "Innstillinger" })).toBeVisible();
  await expect(modus(page, "Lys")).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
    "rgb(247, 247, 245)",
  );
});

test("med sperret skriving endrer kommandoene ingenting, og banneret står", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("Blokkert", "SecurityError");
    };
  });
  await åpneInnstillinger(page);
  const banner = page.getByRole("alert").filter({ hasText: "Nettleseren lar ikke appen lagre." });
  await expect(banner).toBeVisible();

  await modus(page, "Mørk").click();
  await expect(modus(page, "Følg systemet")).toHaveAttribute("aria-pressed", "true");
  await expect(modus(page, "Mørk")).toHaveAttribute("aria-pressed", "false");
  await expect(html(page)).toHaveAttribute("data-modus", "system");

  await fornavn(page).fill("Ida");
  await lagre(page).click();
  await expect(page.getByRole("status").filter({ hasText: "Lagret." })).toHaveCount(0);

  await tilOppgaver(page);
  await expect(page.getByRole("heading", { level: 1, name: "Hei 👋", exact: true })).toBeVisible();
  await expect(banner).toBeVisible();
});

test("modusvelgeren kan brukes med tastaturet", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await åpneInnstillinger(page);
  await lagre(page).focus();

  await page.keyboard.press("Tab");
  await expect(modus(page, "Lys")).toBeFocused();
  const ring = await modus(page, "Lys").evaluate((el) => {
    const stil = getComputedStyle(el);
    return { bredde: stil.outlineWidth, stil: stil.outlineStyle };
  });
  expect(ring).toEqual({ bredde: "2px", stil: "solid" });
  await page.keyboard.press("Enter");
  await expect(html(page)).toHaveAttribute("data-modus", "lys");

  await page.keyboard.press("Tab");
  await expect(modus(page, "Mørk")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(html(page)).toHaveAttribute("data-modus", "mørk");

  await page.keyboard.press("Tab");
  await expect(modus(page, "Følg systemet")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(html(page)).toHaveAttribute("data-modus", "system");
  await expect(modus(page, "Følg systemet")).toHaveAttribute("aria-pressed", "true");
});

test("Innstillinger har ingen vannrett rulling ved 320 px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await åpneInnstillinger(page);
  const { scrollBredde, klientBredde } = await page.evaluate(() => ({
    scrollBredde: document.documentElement.scrollWidth,
    klientBredde: document.documentElement.clientWidth,
  }));
  expect(scrollBredde).toBeLessThanOrEqual(klientBredde);
});

for (const valgt of ["Lys", "Mørk"] as const) {
  test(`axe på /innstillinger med ${valgt} valgt`, async ({ page }) => {
    await åpneInnstillinger(page);
    await modus(page, valgt).click();
    await expect(modus(page, valgt)).toHaveAttribute("aria-pressed", "true");
    await fornavn(page).fill("Ida");
    await lagre(page).click();
    await expect(page.getByRole("status").filter({ hasText: "Lagret." })).toBeVisible();
    await ingenAxeBrudd(page);
  });
}

for (const [navn, profil, hilsen] of [
  ["uten fornavn", null, "Hei 👋"],
  ["med fornavn", { fornavn: "Ida" }, "Hei, Ida 👋"],
] as const) {
  test(`axe på / ${navn}`, async ({ page }) => {
    await leggInnÉnGang(page, { ...nyttDokument(), profil });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: hilsen, exact: true })).toBeVisible();
    await ingenAxeBrudd(page);
  });
}

test("uendret modus og fornavn gir ingen ny skriving", async ({ page }) => {
  await leggInnÉnGang(page, { ...nyttDokument(), profil: { fornavn: "Ida" } });
  await page.addInitScript(() => {
    const vindu = window as unknown as { __skrivinger: number };
    vindu.__skrivinger = 0;
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (this: Storage, ...args: [string, string]) {
      if (this === localStorage && args[0] === "duenext") vindu.__skrivinger++;
      return original.apply(this, args);
    };
  });
  await åpneInnstillinger(page);
  const skrivinger = () => page.evaluate(() => (window as unknown as { __skrivinger: number }).__skrivinger);
  const før = await skrivinger();

  await expect(modus(page, "Følg systemet")).toHaveAttribute("aria-pressed", "true");
  await modus(page, "Følg systemet").click();
  await expect(fornavn(page)).toHaveValue("Ida");
  await lagre(page).click();
  await expect(page.getByRole("status").filter({ hasText: "Lagret." })).toBeVisible();
  expect(await skrivinger()).toBe(før);
});

test("setItem som kaster: Lagre gir ikke «Lagret.», og banneret står", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Kvoten er full", "QuotaExceededError");
    };
  });
  await åpneInnstillinger(page);
  await fornavn(page).fill("Ida");
  await lagre(page).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Nettleseren lar ikke appen lagre." }),
  ).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "Lagret." })).toHaveCount(0);
});

test("feltet følger et nytt navn lagret i en annen fane", async ({ context }) => {
  const a = await context.newPage();
  const b = await context.newPage();
  await åpneInnstillinger(b);
  await expect(fornavn(b)).toHaveValue("");

  await åpneInnstillinger(a);
  await fornavn(a).fill("Ida");
  await lagre(a).click();
  await expect(a.getByRole("status").filter({ hasText: "Lagret." })).toBeVisible();

  await expect(fornavn(b)).toHaveValue("Ida");
});

test("et langt fornavn uten mellomrom gir ingen vannrett rulling ved 320 px", async ({ page }) => {
  const langt = "A".repeat(50);
  await leggInnÉnGang(page, { ...nyttDokument(), profil: { fornavn: langt } });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: `Hei, ${langt} 👋` })).toBeVisible();
  const { scrollBredde, klientBredde } = await page.evaluate(() => ({
    scrollBredde: document.documentElement.scrollWidth,
    klientBredde: document.documentElement.clientWidth,
  }));
  expect(scrollBredde).toBeLessThanOrEqual(klientBredde);
});

const tema = (page: Page, navn: string) =>
  page.getByRole("group", { name: "Tema" }).getByRole("button", { name: navn, exact: true });

test("temavelgeren har seks prøver i egen pastell, og blå er valgt som standard", async ({ page }) => {
  await åpneInnstillinger(page);
  const PASTELL: Record<string, string> = {
    Blå: "rgb(169, 203, 242)",
    Oransje: "rgb(249, 201, 162)",
    Lilla: "rgb(205, 187, 238)",
    Gul: "rgb(245, 227, 158)",
    Grønn: "rgb(182, 226, 196)",
    Rosa: "rgb(245, 191, 212)",
  };
  await expect(page.getByRole("group", { name: "Tema" }).getByRole("button")).toHaveCount(6);
  for (const [navn, farge] of Object.entries(PASTELL)) {
    const knapp = tema(page, navn);
    const boks = (await knapp.boundingBox())!;
    expect(boks.width).toBeGreaterThanOrEqual(44);
    expect(boks.height).toBeGreaterThanOrEqual(44);
    const prøve = knapp.locator("span");
    await expect(prøve).toHaveCSS("background-color", farge);
    await expect(prøve).toHaveCSS("width", "36px");
    await expect(prøve).toHaveCSS("height", "36px");
    await expect(knapp).toHaveAttribute("aria-pressed", navn === "Blå" ? "true" : "false");
  }
});

test("Rosa gjelder straks, har ring og hake, er lagret og gjelder fra første tegning", async ({ page }) => {
  await åpneInnstillinger(page);
  await tema(page, "Rosa").click();
  await expect(html(page)).toHaveAttribute("data-tema", "rosa");
  await expect(tema(page, "Rosa")).toHaveAttribute("aria-pressed", "true");
  await expect(tema(page, "Blå")).toHaveAttribute("aria-pressed", "false");
  expect((await lagret(page))?.innstillinger.tema).toBe("rosa");

  // Bare den valgte prøven har hake og ring i accent-ink.
  await expect(tema(page, "Rosa").locator("svg")).toBeVisible();
  await expect(page.getByRole("group", { name: "Tema" }).locator("svg")).toHaveCount(1);
  const ring = await tema(page, "Rosa").locator("span").evaluate((el) => {
    const prøve = document.createElement("span");
    prøve.style.color = "var(--accent-ink)";
    document.body.append(prøve);
    const forventet = getComputedStyle(prøve).color;
    prøve.remove();
    return { skygge: getComputedStyle(el).boxShadow, forventet };
  });
  expect(ring.skygge).toContain(ring.forventet);

  await page.addInitScript(() => {
    const observatør = new MutationObserver(() => {
      if (!document.body) return;
      (window as unknown as { __tema: string | null }).__tema =
        document.documentElement.getAttribute("data-tema");
      observatør.disconnect();
    });
    observatør.observe(document, { childList: true, subtree: true });
  });
  await page.reload();
  expect(await page.evaluate(() => (window as unknown as { __tema: string | null }).__tema)).toBe("rosa");
  await expect(tema(page, "Rosa")).toHaveAttribute("aria-pressed", "true");

  // Aksentfargen følger med til Oppgaver uten omlasting.
  await tema(page, "Grønn").click();
  await tilOppgaver(page);
  await expect(html(page)).toHaveAttribute("data-tema", "grønn");
});

import AxeBuilder from "@axe-core/playwright";
import { besvart, expect, test, type Page } from "./fikstur";
import { nyttDokument, type Oppgave } from "../../kjerne/skjema";

test.use({ timezoneId: "Europe/Oslo" });

const NØKKEL = "duenext";

function oppgave(felt: Partial<Oppgave> & { id: string; tekst: string }): Oppgave {
  return {
    frist: null,
    prosjekt: null,
    etikett: null,
    prioritet: "Middels",
    sammendrag: null,
    notater: null,
    skjultForKi: false,
    createdAt: "2026-11-01T10:00:00.000Z",
    fullført: null,
    forslag: null,
    ventendeKall: null,
    ...felt,
  };
}

/** Legger dokumentet i lageret og låser klokka før appen starter. */
async function start(page: Page, oppgaver: Oppgave[], tid: string) {
  const dokument = besvart({ ...nyttDokument(), oppgaver });
  await page.clock.install({ time: new Date(tid) });
  await page.addInitScript(
    ([nøkkel, verdi]) => localStorage.setItem(nøkkel, verdi),
    [NØKKEL, JSON.stringify(dokument)] as const,
  );
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
}

const overskrifter = (page: Page) => page.getByRole("heading", { level: 2 });

/** Kortene under en gruppeoverskrift. */
function kort(page: Page, overskrift: string) {
  return page
    .getByRole("heading", { level: 2, name: overskrift })
    .locator("xpath=following-sibling::ul[1]")
    .locator(":scope > li");
}

/** Tittelen på hvert kort under overskriften. */
function titler(page: Page, overskrift: string) {
  return kort(page, overskrift).locator("p.text-task-title");
}

// Onsdag 4. november 2026 kl. 12 i Oslo.
const ONSDAG = "2026-11-04T12:00:00+01:00";

const OPPGAVER: Oppgave[] = [
  oppgave({ id: "f1", tekst: "Levere refleksjonsnotat", frist: "2026-11-03", prosjekt: "IBE160", prioritet: "Høy" }),
  oppgave({ id: "d1", tekst: "Lese kapittel 4", frist: "2026-11-04", sammendrag: "Les to kapitler før eksamen" }),
  oppgave({ id: "d2", tekst: "Svare veileder", frist: "2026-11-04", prioritet: "Høy" }),
  oppgave({ id: "u1", tekst: "Kjøpe gave", frist: "2026-11-06", prioritet: "Lav", createdAt: "2026-11-03T10:00:00.000Z" }),
  oppgave({ id: "u2", tekst: "Vaske bilen", frist: "2026-11-06", prioritet: "Lav", createdAt: "2026-11-02T10:00:00.000Z" }),
  oppgave({ id: "s1", tekst: "Eksamen i statistikk", frist: "2027-01-04", prioritet: "Høy" }),
  oppgave({ id: "i1", tekst: "Vaske klær", skjultForKi: true, prioritet: "Lav" }),
  oppgave({ id: "x1", tekst: "Allerede gjort", frist: "2026-11-04", fullført: "2026-11-04T08:00:00.000Z" }),
];

test("grupper, rekkefølge, antall og merkelapper", async ({ page }) => {
  await start(page, OPPGAVER, ONSDAG);

  await expect(overskrifter(page)).toHaveText([
    "Forfalt · 1",
    "I dag · 2",
    "Denne uken · 2",
    "Senere · 1",
    "Ingen frist · 1",
  ]);
  // Store bokstaver kommer fra CSS, kildeteksten er «I dag».
  await expect(page.getByRole("heading", { name: "I dag · 2" })).toHaveCSS("text-transform", "uppercase");

  await expect(titler(page, "I dag · 2")).toHaveText(["Svare veileder", "Lese kapittel 4"]);
  await expect(titler(page, "Denne uken · 2")).toHaveText(["Vaske bilen", "Kjøpe gave"]);
  await expect(page.getByText("Allerede gjort")).toHaveCount(0);

  // Merkelapper som tekst.
  await expect(kort(page, "Forfalt · 1").first().getByRole("listitem")).toHaveText(["Prosjekt: IBE160", "Frist: i går", "Prioritet: Høy"]);
  await expect(kort(page, "I dag · 2").first().getByRole("listitem")).toHaveText(["Prioritet: Høy"]);
  await expect(kort(page, "Denne uken · 2").first().getByRole("listitem")).toHaveText(["Frist: fredag", "Prioritet: Lav"]);
  await expect(kort(page, "Senere · 1").first().getByRole("listitem")).toHaveText(["Frist: 4. jan 2027", "Prioritet: Høy"]);
  await expect(kort(page, "I dag · 2").nth(1)).toContainText("✦ Les to kapitler før eksamen");
  await expect(kort(page, "Ingen frist · 1").first()).toContainText("Skjult for KI");

  // Ringen er dekor, og ingen knapper på kortene.
  await expect(kort(page, "I dag · 2").first().getByRole("button")).toHaveCount(0);

  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test("forfalte kort har stripe i varselfargen, og FORFALT står i samme farge", async ({ page }) => {
  await start(page, OPPGAVER, ONSDAG);
  const forfalt = kort(page, "Forfalt · 1").first().locator(":scope > div");
  await expect(forfalt).toHaveCSS("border-left-width", "4px");
  const vanlig = kort(page, "I dag · 2").first().locator(":scope > div");
  await expect(vanlig).toHaveCSS("border-left-width", "1px");

  const stripe = await forfalt.evaluate((el) => getComputedStyle(el).borderLeftColor);
  await expect(page.getByRole("heading", { name: "Forfalt · 1" })).toHaveCSS("color", stripe);
  const høy = kort(page, "Forfalt · 1").first().getByRole("listitem").filter({ hasText: "Høy" });
  await expect(høy).toHaveCSS("color", stripe);
  // Bare «Høy» har varselfarge.
  const prosjekt = kort(page, "Forfalt · 1").first().getByRole("listitem").filter({ hasText: "IBE160" });
  await expect(prosjekt).not.toHaveCSS("color", stripe);
  const lav = kort(page, "Denne uken · 2").first().getByRole("listitem").filter({ hasText: "Lav" });
  await expect(lav).not.toHaveCSS("color", stripe);
});

test("lista ligger på bakgrunnsflaten under hilsenen", async ({ page }) => {
  await start(page, OPPGAVER, ONSDAG);
  const flate = overskrifter(page).first().locator("xpath=../..");
  const bakgrunn = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await expect(flate).toHaveCSS("background-color", bakgrunn);
});

test("Ingen frist kan felles sammen", async ({ page }) => {
  await start(page, OPPGAVER, ONSDAG);
  const knapp = page.getByRole("button", { name: "Ingen frist · 1" });
  await expect(knapp).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Vaske klær")).toBeVisible();
  await knapp.click();
  await expect(knapp).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByText("Vaske klær")).toBeHidden();
  await knapp.click();
  await expect(page.getByText("Vaske klær")).toBeVisible();
});

test("tom «I dag» vises med heiing, andre tomme grupper skjules", async ({ page }) => {
  await start(page, [oppgave({ id: "s", tekst: "Langt frem", frist: "2026-12-01" })], ONSDAG);
  await expect(overskrifter(page)).toHaveText(["I dag · 0", "Senere · 1"]);
  await expect(page.getByText("Alt unna i dag 🎉 Nyt kvelden!")).toBeVisible();
});

test("helt tom app viser bare hilsenen og oppfordringen", async ({ page }) => {
  await start(page, [oppgave({ id: "x", tekst: "Gjort", fullført: "2026-11-01T10:00:00.000Z" })], ONSDAG);
  await expect(page.getByText("Skriv inn det første du må huske.")).toBeVisible();
  await expect(overskrifter(page)).toHaveCount(0);
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test("ved midnatt flytter oppgaven til I dag uten omlasting", async ({ page }) => {
  await start(
    page,
    [oppgave({ id: "m", tekst: "Lese til i morgen", frist: "2026-11-03" })],
    "2026-11-02T23:59:30+01:00",
  );
  await expect(overskrifter(page)).toHaveText(["I dag · 0", "Denne uken · 1"]);
  await expect(kort(page, "Denne uken · 1").first().getByRole("listitem")).toHaveText(["Frist: i morgen", "Prioritet: Middels"]);

  // Takten er 60 s fra oppstart: spol godt forbi 00:00.
  await page.clock.runFor(120_000);
  await expect(overskrifter(page)).toHaveText(["I dag · 1"]);
  await expect(titler(page, "I dag · 1")).toHaveText(["Lese til i morgen"]);
});

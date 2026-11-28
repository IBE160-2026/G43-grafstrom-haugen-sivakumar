import AxeBuilder from "@axe-core/playwright";
import { GJELDENDE_SAMTYKKEVERSJON } from "@/kjerne/samtykke";
import { nyttDokument, type Dokument } from "@/kjerne/skjema";
import { DEMO_ADVARSEL, SAMTYKKETEKST } from "@/kjerne/tekster";
import { expect, test, type Page } from "./fikstur";

// Disse testene handler om første oppstart: lageret starter tomt.
test.use({ medSamtykke: false });

const NØKKEL = "duenext";

async function lagret(page: Page): Promise<Dokument | null> {
  const rå = await page.evaluate((nøkkel) => localStorage.getItem(nøkkel), NØKKEL);
  return rå === null ? null : JSON.parse(rå);
}

async function leggInn(page: Page, dokument: Dokument) {
  await page.addInitScript(
    ([nøkkel, verdi]) => {
      if (sessionStorage.getItem("lagt-inn")) return;
      localStorage.setItem(nøkkel, verdi);
      sessionStorage.setItem("lagt-inn", "1");
    },
    [NØKKEL, JSON.stringify(dokument)] as const,
  );
}

async function ingenAxeBrudd(page: Page) {
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
}

const steg1 = (page: Page) => page.getByRole("heading", { level: 1, name: "Hei! Hva heter du?" });
const steg2 = (page: Page) => page.getByRole("heading", { level: 1, name: SAMTYKKETEKST.overskrift });
const knapp = (page: Page, navn: string) => page.getByRole("button", { name: navn, exact: true });

test("første oppstart sender til steg 1 fra hvilken som helst rute, uten menyer", async ({ page }) => {
  await page.goto("/arkiv");
  await expect(page).toHaveURL(/\/oppstart$/);
  await expect(steg1(page)).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Fornavn" })).toBeVisible();
  await expect(page.getByText("Bare for hilsenen. Lagres på denne enheten.")).toBeVisible();
  await expect(knapp(page, "Fortsett")).toBeVisible();
  await expect(knapp(page, "Hopp over")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Hovedmeny" })).toHaveCount(0);
  await expect(page).toHaveTitle("Velkommen – dueNext");
  await ingenAxeBrudd(page);
});

test("personvernerklæringen kan leses uten å ha svart", async ({ page }) => {
  await page.goto("/personvernerklaering");
  await expect(page.getByRole("heading", { level: 1, name: "Personvernerklæring" })).toBeVisible();
  await expect(page).toHaveURL(/\/personvernerklaering$/);
});

test("Flyt 3 med ja: fornavnet trimmes, samtykket lagres, og Oppgaver har KI-teksten", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Fornavn" }).fill("  Ida  ");
  await knapp(page, "Fortsett").click();
  await expect(page).toHaveURL(/\/oppstart\?steg=2$/);
  await expect(steg2(page)).toBeVisible();
  expect((await lagret(page))?.profil).toEqual({ fornavn: "Ida" });
  await ingenAxeBrudd(page);

  await knapp(page, SAMTYKKETEKST.knapper.ja).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Hei, Ida 👋" })).toBeVisible();
  await expect(
    page.getByText("Skriv inn det første du må huske – KI hjelper deg å sortere."),
  ).toBeVisible();
  const samtykke = (await lagret(page))?.samtykke;
  expect(samtykke).toMatchObject({ svar: "ja", tekstversjon: GJELDENDE_SAMTYKKEVERSJON });
  expect(Date.parse(samtykke!.tidspunkt)).not.toBeNaN();
});

test("Flyt 3 med nei og Hopp over: ingen profil, og tomteksten uten KI-delen", async ({ page }) => {
  await page.goto("/");
  await knapp(page, "Hopp over").click();
  await expect(steg2(page)).toBeVisible();
  expect((await lagret(page))?.profil).toBeNull();

  await knapp(page, SAMTYKKETEKST.knapper.nei).click();
  await expect(page.getByRole("heading", { level: 1, name: "Hei 👋", exact: true })).toBeVisible();
  await expect(page.getByText("Skriv inn det første du må huske.", { exact: true })).toBeVisible();
  await expect(page.getByText(/KI hjelper deg å sortere/)).toHaveCount(0);
  expect((await lagret(page))?.samtykke?.svar).toBe("nei");
});

test("steg 2: demo-advarselen er nøytral, samtykketeksten står ordrett, og Ja/Nei er like", async ({
  page,
}) => {
  await page.goto("/oppstart?steg=2");
  const advarsel = page.getByRole("note");
  await expect(advarsel).toHaveText(`${DEMO_ADVARSEL.tittel} ${DEMO_ADVARSEL.tekst}`);
  const farger = await advarsel.evaluate((el) => {
    const prøve = document.createElement("span");
    prøve.style.color = "var(--warn)";
    document.body.append(prøve);
    const warn = getComputedStyle(prøve).color;
    prøve.remove();
    const stil = getComputedStyle(el);
    return { warn, tekst: stil.color, kant: stil.borderTopColor };
  });
  expect(farger.tekst).not.toBe(farger.warn);
  expect(farger.kant).not.toBe(farger.warn);

  // Demo-advarselen står over samtykketeksten.
  const advarselBoks = (await advarsel.boundingBox())!;
  const innledning = page.getByText(SAMTYKKETEKST.innledning);
  expect((await innledning.boundingBox())!.y).toBeGreaterThan(advarselBoks.y);
  for (const tekst of [
    ...SAMTYKKETEKST.hvaSendes.punkter,
    SAMTYKKETEKST.navnSendesAldri,
    SAMTYKKETEKST.hvemFårDet.tekst,
    SAMTYKKETEKST.hvorLenge.tekst,
    SAMTYKKETEKST.utenKi,
  ]) {
    await expect(page.getByText(tekst, { exact: false })).toBeVisible();
  }

  const nei = knapp(page, SAMTYKKETEKST.knapper.nei);
  const ja = knapp(page, SAMTYKKETEKST.knapper.ja);
  const [n, j] = [(await nei.boundingBox())!, (await ja.boundingBox())!];
  expect(n.width).toBeCloseTo(j.width, 0);
  expect(n.height).toBeCloseTo(j.height, 0);
  expect(n.y).toBeCloseTo(j.y, 0);
  expect(n.height).toBeGreaterThanOrEqual(44);
  for (const k of [nei, ja]) {
    await expect(k).not.toHaveAttribute("aria-pressed");
    await expect(k).not.toBeFocused();
  }
  // Samme stil på begge, så ingen ser forhåndsvalgt ut.
  expect(await nei.getAttribute("class")).toBe(await ja.getAttribute("class"));
});

test("fra steg 2 til erklæringen og tilbake står hun på steg 2 med fornavnet", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Fornavn" }).fill("Ida");
  await knapp(page, "Fortsett").click();
  await expect(steg2(page)).toBeVisible();

  await page.getByRole("link", { name: SAMTYKKETEKST.lenke }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Personvernerklæring" })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/oppstart\?steg=2$/);
  await expect(steg2(page)).toBeVisible();
  expect((await lagret(page))?.profil).toEqual({ fornavn: "Ida" });
});

test("har hun svart, sendes /oppstart til Oppgaver", async ({ page }) => {
  await leggInn(page, {
    ...nyttDokument(),
    samtykke: { svar: "nei", tidspunkt: "2026-11-01T10:00:00.000Z", tekstversjon: GJELDENDE_SAMTYKKEVERSJON },
  });
  await page.goto("/oppstart");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1, name: /^Hei/ })).toBeVisible();
});

test("ja på en eldre tekstversjon: ingen omdirigering, men KI er av", async ({ page }) => {
  await leggInn(page, {
    ...nyttDokument(),
    samtykke: {
      svar: "ja",
      tidspunkt: "2026-11-01T10:00:00.000Z",
      tekstversjon: GJELDENDE_SAMTYKKEVERSJON - 1,
    },
  });
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText("Skriv inn det første du må huske.", { exact: true })).toBeVisible();
});

test("lagring som feiler: svaret gjelder i økta, og banneret forklarer", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Kvoten er full", "QuotaExceededError");
    };
  });
  await page.goto("/");
  const banner = page.getByRole("alert").filter({ hasText: "Nettleseren lar ikke appen lagre." });
  await expect(banner).toBeVisible();
  await knapp(page, "Hopp over").click();
  await knapp(page, SAMTYKKETEKST.knapper.ja).click();
  await expect(page.getByRole("heading", { level: 1, name: "Hei 👋", exact: true })).toBeVisible();
  await expect(banner).toBeVisible();
});

test("menyene og siden vises aldri før omdirigeringen til oppsettet", async ({ page }) => {
  // Noterer om hovedmenyen eller Arkiv-overskriften dukker opp i DOM-en, også for ett øyeblikk.
  await page.addInitScript(() => {
    const vindu = window as unknown as { __sett: boolean };
    vindu.__sett = false;
    new MutationObserver(() => {
      if (document.querySelector('nav[aria-label="Hovedmeny"], main h1')?.textContent?.match(/Oppgaver|Arkiv/)) {
        vindu.__sett = true;
      }
    }).observe(document, { childList: true, subtree: true });
  });
  await page.goto("/arkiv");
  await expect(steg1(page)).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __sett: boolean }).__sett)).toBe(false);
});

test("steg 2 har egen sidetittel, så skjermlesere hører at steget byttes", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Velkommen – dueNext");
  await knapp(page, "Hopp over").click();
  await expect(steg2(page)).toBeVisible();
  await expect(page).toHaveTitle(`${SAMTYKKETEKST.overskrift} – dueNext`);
});

test("?steg gitt to ganger gir likevel steg 2", async ({ page }) => {
  await page.goto("/oppstart?steg=2&steg=2");
  await expect(steg2(page)).toBeVisible();
});

import { expect, test } from "@playwright/test";

test("forsiden er på norsk og viser hilsenen", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('html[lang="nb"]')).toHaveCount(1);
  await expect(page).toHaveTitle("Oppgaver – dueNext");
  await expect(page.getByRole("heading", { level: 1, name: "Hei 👋" })).toBeVisible();
  await expect(page.getByText("Skriv inn det første du må huske.")).toBeVisible();
});

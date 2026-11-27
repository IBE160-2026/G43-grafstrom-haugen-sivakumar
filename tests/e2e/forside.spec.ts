import { expect, test } from "@playwright/test";

test("forsiden er på norsk og viser Oppgaver", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('html[lang="nb"]')).toHaveCount(1);
  await expect(page).toHaveTitle("Oppgaver – dueNext");
  await expect(page.getByRole("heading", { level: 1, name: "Oppgaver" })).toBeVisible();
  await expect(page.getByText("Oppgavene dine kommer snart.")).toBeVisible();
});

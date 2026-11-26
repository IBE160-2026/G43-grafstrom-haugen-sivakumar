import { expect, test } from "@playwright/test";

test("forsiden er på norsk", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('html[lang="nb"]')).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "dueNext" })).toBeVisible();
});

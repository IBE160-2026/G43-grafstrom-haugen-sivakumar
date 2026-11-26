import { defineConfig, devices } from "@playwright/test";

// Egen port og KI_MOCK=1, slik at e2e-testene aldri treffer en vanlig
// dev-server som bruker ekte Claude.
export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3001",
  },
  projects: [
    { name: "mobil", use: { ...devices["Pixel 7"] } },
    { name: "pc", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev -- -p 3001",
    url: "http://127.0.0.1:3001",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { KI_MOCK: "1" },
  },
});

import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// AD-5: appen tolker tid i Europe/Oslo, og testene må kunne gå over
// sommertidsskifter. Låses her så resultatet ikke avhenger av maskinen.
process.env.TZ = "Europe/Oslo";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});

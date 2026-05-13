import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

process.env.TMPDIR ??= "/tmp";
process.env.TEMP ??= process.env.TMPDIR;
process.env.TMP ??= process.env.TMPDIR;

export default defineConfig({
  cacheDir: "node_modules/.cache/vitest",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});

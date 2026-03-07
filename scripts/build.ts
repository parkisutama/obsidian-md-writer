/// <reference types="bun-types" />

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { build } from "./lib/build";

await build({
  entrypoints: { main: "main.ts" },
  outDir: "dist",
  format: "cjs",
  stripDebug: true,
});

// Copy dist to Obsidian plugin dir if .env exists
const envPath = resolve(import.meta.dir, "../.env");
const envFile = Bun.file(envPath);
if (await envFile.exists()) {
  const envText = await envFile.text();
  const match = envText.match(/^OBSIDIAN_PLUGIN_DIR=(.+)$/m);
  if (match) {
    const pluginDir = match[1].trim();
    const distDir = resolve(import.meta.dir, "..", "dist");
    const files = ["main.js", "styles.css", "manifest.json"];

    if (!existsSync(pluginDir)) {
      mkdirSync(pluginDir, { recursive: true });
    }

    for (const file of files) {
      const src = resolve(distDir, file);
      if (existsSync(src)) {
        copyFileSync(src, resolve(pluginDir, file));
      }
    }
    console.log(`Deployed to ${pluginDir}`);
  }
}

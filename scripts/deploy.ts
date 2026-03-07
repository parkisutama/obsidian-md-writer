/// <reference types="bun-types" />

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(import.meta.dir, "../.env");
const envFile = Bun.file(envPath);

if (!(await envFile.exists())) {
  console.error(
    "Missing .env file. Create one with OBSIDIAN_PLUGIN_DIR=<path>"
  );
  process.exit(1);
}

const envText = await envFile.text();
const match = envText.match(/^OBSIDIAN_PLUGIN_DIR=(.+)$/m);
if (!match) {
  console.error("OBSIDIAN_PLUGIN_DIR not found in .env");
  process.exit(1);
}

const pluginDir = match[1].trim();
const distDir = resolve(import.meta.dir, "../dist");

const files = ["main.js", "styles.css", "manifest.json"];

for (const file of files) {
  const src = resolve(distDir, file);
  if (!existsSync(src)) {
    console.error(`Missing dist/${file} — run the build first`);
    process.exit(1);
  }
}

if (!existsSync(pluginDir)) {
  mkdirSync(pluginDir, { recursive: true });
  console.log(`Created ${pluginDir}`);
}

for (const file of files) {
  const src = resolve(distDir, file);
  const dest = resolve(pluginDir, file);
  copyFileSync(src, dest);
  console.log(`Copied dist/${file} → ${dest}`);
}

console.log("Done!");

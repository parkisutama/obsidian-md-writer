/// <reference types="bun-types" />

import { mkdirSync } from "node:fs";
import builtins from "builtin-modules";
import { compile as sassCompile } from "sass";

export interface BuildOptions {
  entrypoints?: {
    main?: string;
    styles?: string;
  };
  format?: "cjs" | "esm";
  outDir?: string;
  rootDir?: string;
  srcDir?: string;
  stripDebug?: boolean;
}

export async function build({
  rootDir = ".",
  srcDir = "src",
  entrypoints: { main = "main.ts", styles = "styles/index.scss" } = {},
  outDir = "dist",
  format = "cjs",
  stripDebug = false,
}: BuildOptions = {}) {
  // Create outdir
  mkdirSync(`${rootDir}/${outDir}`, { recursive: true });

  // Build scss
  console.log("Building styles");
  const scssResult = sassCompile(`${rootDir}/${srcDir}/${styles}`, {
    style: "compressed",
  });
  await Bun.write(`${rootDir}/${outDir}/styles.css`, scssResult.css);

  // Build js
  console.log("Building main");
  await Bun.build({
    entrypoints: [`${rootDir}/${srcDir}/${main}`],
    outdir: `${rootDir}/${outDir}`,
    minify: true,
    target: "browser",
    format,
    drop: stripDebug ? ["console"] : [],
    external: [
      "obsidian",
      "electron",
      "@electron/remote",
      "@codemirror/autocomplete",
      "@codemirror/collab",
      "@codemirror/commands",
      "@codemirror/language",
      "@codemirror/lint",
      "@codemirror/search",
      "@codemirror/state",
      "@codemirror/view",
      "@lezer/common",
      "@lezer/highlight",
      "@lezer/lr",
      ...builtins,
    ],
  });
}

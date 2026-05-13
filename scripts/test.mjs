import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["exec", "vitest", "run"], {
  env: {
    ...process.env,
    TEMP: "/tmp",
    TMP: "/tmp",
    TMPDIR: "/tmp",
  },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);

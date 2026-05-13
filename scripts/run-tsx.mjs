import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Missing tsx entrypoint.");
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--import", "tsx", ...args], {
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

import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  assertNonEmptyFile,
  verifyArtifacts,
} from "../scripts/lib/artifact-verification";

const originalCwd = process.cwd();

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function createArtifactFixture({
  distManifestVersion = "1.2.3",
  packageVersion = "1.2.3",
  versions = { "1.2.3": "1.11.0" },
}: {
  distManifestVersion?: string;
  packageVersion?: string;
  versions?: Record<string, string>;
} = {}): string {
  const dir = mkdtempSync(join(tmpdir(), "md-writer-artifacts-"));
  mkdirSync(join(dir, "dist"));
  writeFileSync(join(dir, "dist", "main.js"), "console.log('built');\n");
  writeFileSync(join(dir, "dist", "styles.css"), ".md-writer {}\n");
  writeJson(join(dir, "dist", "manifest.json"), {
    version: distManifestVersion,
  });
  writeJson(join(dir, "package.json"), {
    version: packageVersion,
  });
  writeJson(join(dir, "versions.json"), versions);
  return dir;
}

afterEach(() => {
  process.chdir(originalCwd);
});

describe("artifact verification", () => {
  it("accepts the required non-empty plugin artifacts", () => {
    process.chdir(createArtifactFixture());

    expect(verifyArtifacts()).toBe("1.2.3");
  });

  it("rejects an empty artifact", () => {
    const dir = createArtifactFixture();
    writeFileSync(join(dir, "dist", "styles.css"), "");
    process.chdir(dir);

    expect(() => verifyArtifacts()).toThrow("dist/styles.css is empty");
  });

  it("rejects a manifest version mismatch", () => {
    process.chdir(createArtifactFixture({ distManifestVersion: "1.2.4" }));

    expect(() => verifyArtifacts()).toThrow(
      "dist/manifest.json version 1.2.4 does not match package.json version 1.2.3"
    );
  });

  it("rejects a missing versions.json entry", () => {
    process.chdir(createArtifactFixture({ versions: {} }));

    expect(() => verifyArtifacts()).toThrow(
      "versions.json is missing key 1.2.3"
    );
  });

  it("rejects a missing file directly", () => {
    process.chdir(createArtifactFixture());

    expect(() => assertNonEmptyFile("dist/missing.js")).toThrow(
      "dist/missing.js is missing"
    );
  });
});

import { existsSync, readFileSync, statSync } from "node:fs";

interface ManifestJson {
  version: string;
}

interface PackageJson {
  version: string;
}

type VersionsJson = Record<string, string>;

function readJsonFile<T>(path: string): T {
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${path} is not valid JSON: ${message}`);
  }
}

export function assertNonEmptyFile(path: string): void {
  if (!existsSync(path)) {
    throw new Error(`${path} is missing.`);
  }

  const stats = statSync(path);
  if (!stats.isFile()) {
    throw new Error(`${path} is not a file.`);
  }

  if (stats.size === 0) {
    throw new Error(`${path} is empty.`);
  }
}

export function verifyArtifacts(): string {
  assertNonEmptyFile("dist/main.js");
  assertNonEmptyFile("dist/styles.css");
  assertNonEmptyFile("dist/manifest.json");

  const packageJson = readJsonFile<PackageJson>("package.json");
  const manifest = readJsonFile<ManifestJson>("dist/manifest.json");
  const versions = readJsonFile<VersionsJson>("versions.json");

  if (manifest.version !== packageJson.version) {
    throw new Error(
      `dist/manifest.json version ${manifest.version} does not match package.json version ${packageJson.version}.`
    );
  }

  if (!Object.hasOwn(versions, packageJson.version)) {
    throw new Error(`versions.json is missing key ${packageJson.version}.`);
  }

  return packageJson.version;
}

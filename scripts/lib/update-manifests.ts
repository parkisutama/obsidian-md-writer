/// <reference types="bun-types" />

export async function updateManifests(
  targetVersion: string,
  minAppVersion: string,
  outDir = "."
) {
  console.log("Reading manifest");
  const manifest = await Bun.file("manifest.json").json();

  const manifestOutPath = `${outDir}/manifest.json`;
  console.log(`Updating ${manifestOutPath}`);
  manifest.version = targetVersion;
  manifest.minAppVersion = minAppVersion;
  await Bun.write(manifestOutPath, JSON.stringify(manifest, null, 2));

  return { targetVersion, minAppVersion };
}

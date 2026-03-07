/// <reference types="bun-types" />

import { generateCiArtefacts } from "./lib/generate-ci-artefacts";

await generateCiArtefacts("dist");

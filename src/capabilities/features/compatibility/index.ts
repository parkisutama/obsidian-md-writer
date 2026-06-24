import type TypewriterModeLib from "@/lib";
import GFMAnchorCompatibility from "./gfm-anchor-compatibility";

export default function getCompatibilityFeatures(tm: TypewriterModeLib) {
  return Object.fromEntries(
    [new GFMAnchorCompatibility(tm)].map((feature) => [
      feature.getSettingKey(),
      feature,
    ])
  );
}

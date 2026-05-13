import type TypewriterModeLib from "@/lib";
import FoldPersistEnabled from "./fold-persist-enabled";

export default function getFoldPersistFeatures(tm: TypewriterModeLib) {
  return Object.fromEntries(
    [new FoldPersistEnabled(tm)].map((feature) => [
      feature.getSettingKey(),
      feature,
    ])
  );
}

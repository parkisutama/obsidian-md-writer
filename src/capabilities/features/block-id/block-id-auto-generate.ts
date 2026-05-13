import { FeatureToggle } from "@/capabilities/base/feature-toggle";

export default class BlockIdAutoGenerate extends FeatureToggle {
  readonly settingKey = "blockId.isAutoGenerateOnFoldEnabled" as const;
  protected settingTitle = "Auto-generate on fold";
  protected settingDesc =
    "Automatically generate a block ID when a list item is folded, if it does not already have one.";
}

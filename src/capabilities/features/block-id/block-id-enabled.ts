import { FeatureToggle } from "@/capabilities/base/feature-toggle";

export default class BlockIdEnabled extends FeatureToggle {
  readonly settingKey = "blockId.isBlockIdEnabled" as const;
  protected settingTitle = "Enable block IDs";
  protected settingDesc =
    "Allow generating stable block IDs for list items, enabling block linking and fold persistence.";
}

import { FeatureToggle } from "@/capabilities/base/feature-toggle";

export default class FoldPersistEnabled extends FeatureToggle {
  readonly settingKey = "foldPersist.isFoldPersistEnabled" as const;
  protected settingTitle = "Persist fold state";
  protected settingDesc =
    "Remember which list items are folded when you close and reopen a file.";
}

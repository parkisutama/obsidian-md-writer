import { FeatureToggle } from "@/capabilities/base/feature-toggle";

export default class WarnLongLine extends FeatureToggle {
  readonly settingKey = "maxChars.isWarnLongLineEnabled" as const;
  protected override toggleClass = "ptm-warn-long-line";
  override isToggleClassPersistent = true;
  protected settingTitle = "Warn when line exceeds character limit";
  protected settingDesc =
    "Highlights lines that exceed the specified character limit — useful for keeping lines short for Git diffs";
}

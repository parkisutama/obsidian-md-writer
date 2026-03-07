import { FeatureToggle } from "@/capabilities/base/feature-toggle";

export default class OutlinerBreadcrumbs extends FeatureToggle {
  readonly settingKey = "outliner.isOutlinerBreadcrumbsEnabled" as const;
  protected settingTitle = "Show breadcrumb navigation";
  protected settingDesc =
    "Displays a clickable breadcrumb bar at the top of the editor when focused on a section, showing parent headings and list items.";

  override enable() {
    super.enable();
    this.tm.reconfigureOutliner();
  }

  override disable() {
    super.disable();
    this.tm.reconfigureOutliner();
  }
}

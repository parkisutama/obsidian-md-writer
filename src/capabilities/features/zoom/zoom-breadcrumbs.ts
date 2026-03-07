import { FeatureToggle } from "@/capabilities/base/feature-toggle";

export default class ZoomBreadcrumbs extends FeatureToggle {
  readonly settingKey = "zoom.isZoomBreadcrumbsEnabled" as const;
  protected settingTitle = "Show breadcrumb navigation";
  protected settingDesc =
    "Displays a clickable breadcrumb bar at the top of the editor when zoomed in, showing parent headings and list items.";

  override enable() {
    super.enable();
    this.tm.reconfigureZoom();
  }

  override disable() {
    super.disable();
    this.tm.reconfigureZoom();
  }
}

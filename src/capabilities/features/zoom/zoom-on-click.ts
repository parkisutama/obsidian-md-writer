import { FeatureToggle } from "@/capabilities/base/feature-toggle";

export default class ZoomOnClick extends FeatureToggle {
  readonly settingKey = "zoom.isZoomOnClickEnabled" as const;
  protected override toggleClass = "ptm-zoom-on-click";
  protected settingTitle = "Zoom on bullet click";
  protected settingDesc = "Click list bullets to zoom into that list item.";

  override enable() {
    super.enable();
    this.tm.reconfigureZoom();
  }

  override disable() {
    super.disable();
    this.tm.reconfigureZoom();
  }
}

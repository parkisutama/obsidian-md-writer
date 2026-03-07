import { FeatureToggle } from "@/capabilities/base/feature-toggle";

export default class ZoomEnabled extends FeatureToggle {
  readonly settingKey = "zoom.isZoomEnabled" as const;
  protected settingTitle = "Enable zoom";
  protected settingDesc =
    "Allows zooming into headings and list items to focus on a single section. Use Cmd/Ctrl+. to zoom in and Cmd/Ctrl+Shift+. to zoom out.";

  override enable() {
    super.enable();
    this.tm.reconfigureZoom();
  }

  override disable() {
    super.disable();
    this.tm.reconfigureZoom();
  }
}

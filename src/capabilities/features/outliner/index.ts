import type TypewriterModeLib from "@/lib";
import OutlinerBreadcrumbs from "./outliner-breadcrumbs";
import OutlinerEnabled from "./outliner-enabled";
import OutlinerOnClick from "./outliner-on-click";

export default function getOutlinerFeatures(tm: TypewriterModeLib) {
  return Object.fromEntries(
    [
      new OutlinerEnabled(tm),
      new OutlinerOnClick(tm),
      new OutlinerBreadcrumbs(tm),
    ].map((feature) => [feature.getSettingKey(), feature])
  );
}

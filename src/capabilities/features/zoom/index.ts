import type TypewriterModeLib from "@/lib";
import ZoomBreadcrumbs from "./zoom-breadcrumbs";
import ZoomEnabled from "./zoom-enabled";
import ZoomOnClick from "./zoom-on-click";

export default function getZoomFeatures(tm: TypewriterModeLib) {
  return Object.fromEntries(
    [new ZoomEnabled(tm), new ZoomOnClick(tm), new ZoomBreadcrumbs(tm)].map(
      (feature) => [feature.getSettingKey(), feature]
    )
  );
}

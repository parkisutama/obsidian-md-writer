import { Compartment, type Extension } from "@codemirror/state";
import type { ZoomSettings } from "@/capabilities/settings";
import { getBreadcrumbExtension } from "./breadcrumb-panel";
import { calculateRangeForZooming } from "./calculate-range";
import { createClickOnBulletHandler } from "./click-on-bullet";
import { createBoundaryViolationDetector } from "./detect-boundary-violation";
import {
  limitSelectionOnZoomIn,
  limitSelectionWhenZoomedIn,
} from "./limit-selection";
import { getZoomExtension } from "./zoom-state-field";
import { dispatchZoomIn, dispatchZoomOut } from "./zoom-utils";

const zoomCoreCmpt = new Compartment();
const zoomClickCmpt = new Compartment();
const zoomBreadcrumbCmpt = new Compartment();

function buildCoreExtension(enabled: boolean): Extension {
  if (!enabled) {
    return [];
  }
  return [
    getZoomExtension(),
    limitSelectionOnZoomIn,
    limitSelectionWhenZoomedIn,
    createBoundaryViolationDetector((view) => {
      dispatchZoomOut(view);
    }),
  ];
}

function buildClickExtension(
  enabled: boolean,
  zoomEnabled: boolean
): Extension {
  if (!(enabled && zoomEnabled)) {
    return [];
  }
  return createClickOnBulletHandler((view, pos) => {
    const range = calculateRangeForZooming(view.state, pos);
    if (range) {
      dispatchZoomIn(view, range.from, range.to);
    }
  });
}

function buildBreadcrumbExtension(
  enabled: boolean,
  zoomEnabled: boolean
): Extension {
  if (!(enabled && zoomEnabled)) {
    return [];
  }
  return getBreadcrumbExtension();
}

export function createZoomExtension(settings: ZoomSettings): Extension {
  return [
    zoomCoreCmpt.of(buildCoreExtension(settings.isZoomEnabled)),
    zoomClickCmpt.of(
      buildClickExtension(settings.isZoomOnClickEnabled, settings.isZoomEnabled)
    ),
    zoomBreadcrumbCmpt.of(
      buildBreadcrumbExtension(
        settings.isZoomBreadcrumbsEnabled,
        settings.isZoomEnabled
      )
    ),
  ];
}

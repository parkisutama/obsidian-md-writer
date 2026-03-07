import { Compartment, type Extension } from "@codemirror/state";
import type { OutlinerSettings } from "@/capabilities/settings";
import { getBreadcrumbExtension } from "./breadcrumb-panel";
import { calculateOutlinerRange } from "./calculate-range";
import { createClickOnBulletHandler } from "./click-on-bullet";
import { createBoundaryViolationDetector } from "./detect-boundary-violation";
import {
  limitSelectionOnOutlinerFocus,
  limitSelectionWhenOutlinerFocused,
} from "./limit-selection";
import { getOutlinerExtension } from "./state-field";
import { dispatchOutlinerFocus, dispatchOutlinerUnfocus } from "./utils";

const outlinerCoreCmpt = new Compartment();
const outlinerClickCmpt = new Compartment();
const outlinerBreadcrumbCmpt = new Compartment();

function buildCoreExtension(enabled: boolean): Extension {
  if (!enabled) {
    return [];
  }
  return [
    getOutlinerExtension(),
    limitSelectionOnOutlinerFocus,
    limitSelectionWhenOutlinerFocused,
    createBoundaryViolationDetector((view) => {
      dispatchOutlinerUnfocus(view);
    }),
  ];
}

function buildClickExtension(
  enabled: boolean,
  outlinerEnabled: boolean
): Extension {
  if (!(enabled && outlinerEnabled)) {
    return [];
  }
  return createClickOnBulletHandler((view, pos) => {
    const range = calculateOutlinerRange(view.state, pos);
    if (range) {
      dispatchOutlinerFocus(view, range.from, range.to);
    }
  });
}

function buildBreadcrumbExtension(
  enabled: boolean,
  outlinerEnabled: boolean
): Extension {
  if (!(enabled && outlinerEnabled)) {
    return [];
  }
  return getBreadcrumbExtension();
}

export function createOutlinerExtension(settings: OutlinerSettings): Extension {
  return [
    outlinerCoreCmpt.of(buildCoreExtension(settings.isOutlinerEnabled)),
    outlinerClickCmpt.of(
      buildClickExtension(
        settings.isOutlinerOnClickEnabled,
        settings.isOutlinerEnabled
      )
    ),
    outlinerBreadcrumbCmpt.of(
      buildBreadcrumbExtension(
        settings.isOutlinerBreadcrumbsEnabled,
        settings.isOutlinerEnabled
      )
    ),
  ];
}

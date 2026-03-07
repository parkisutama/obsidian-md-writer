import { Compartment, type Extension } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import type { OutlinerSettings } from "@/capabilities/settings";
import { getBreadcrumbExtension } from "./breadcrumb-panel";
import { createClickOnBulletHandler } from "./click-on-bullet";
import { createBoundaryViolationDetector } from "./detect-boundary-violation";
import {
  limitSelectionOnOutlinerFocus,
  limitSelectionWhenOutlinerFocused,
} from "./limit-selection";
import { getOutlinerExtension } from "./state-field";
import { dispatchOutlinerUnfocus } from "./utils";

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
  outlinerEnabled: boolean,
  onFocus: (view: EditorView, pos: number) => void
): Extension {
  if (!(enabled && outlinerEnabled)) {
    return [];
  }
  return createClickOnBulletHandler((view, pos) => {
    onFocus(view, pos);
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

export function createOutlinerExtension(
  settings: OutlinerSettings,
  onFocus: (view: EditorView, pos: number) => void
): Extension {
  return [
    outlinerCoreCmpt.of(buildCoreExtension(settings.isOutlinerEnabled)),
    outlinerClickCmpt.of(
      buildClickExtension(
        settings.isOutlinerOnClickEnabled,
        settings.isOutlinerEnabled,
        onFocus
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

import {
  EditorSelection,
  EditorState,
  type Transaction,
} from "@codemirror/state";
import { isZoomInEffect, type ZoomInEffect } from "./effects";
import { getVisibleRange } from "./zoom-utils";

function calculateLimitedSelection(
  selection: EditorSelection,
  from: number,
  to: number
): EditorSelection | null {
  const main = selection.main;
  const newSel = EditorSelection.range(
    Math.min(Math.max(main.anchor, from), to),
    Math.min(Math.max(main.head, from), to),
    main.goalColumn
  );
  const shouldUpdate =
    selection.ranges.length > 1 ||
    newSel.anchor !== main.anchor ||
    newSel.head !== main.head;
  return shouldUpdate ? EditorSelection.create([newSel]) : null;
}

export const limitSelectionOnZoomIn = EditorState.transactionFilter.of(
  (tr: Transaction) => {
    const effect = tr.effects.find<ZoomInEffect>(isZoomInEffect);
    if (!effect) {
      return tr;
    }

    const newSelection = calculateLimitedSelection(
      tr.newSelection,
      effect.value.from,
      effect.value.to
    );
    if (!newSelection) {
      return tr;
    }

    return [tr, { selection: newSelection }];
  }
);

export const limitSelectionWhenZoomedIn = EditorState.transactionFilter.of(
  (tr: Transaction) => {
    if (!(tr.selection && tr.isUserEvent("select"))) {
      return tr;
    }

    const range = getVisibleRange(tr.state);
    if (!range) {
      return tr;
    }

    const newSelection = calculateLimitedSelection(
      tr.newSelection,
      range.from,
      range.to
    );
    if (!newSelection) {
      return tr;
    }

    return [tr, { selection: newSelection }];
  }
);

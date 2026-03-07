import type { EditorState, RangeSet, RangeValue } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { outlinerFocusEffect, outlinerUnfocusEffect } from "./effects";
import { outlinerStateField } from "./state-field";

function rangeSetToArray<T extends RangeValue>(
  rs: RangeSet<T>
): Array<{ from: number; to: number }> {
  const res: Array<{ from: number; to: number }> = [];
  const i = rs.iter();
  while (i.value !== null) {
    res.push({ from: i.from, to: i.to });
    i.next();
  }
  return res;
}

export function getHiddenRanges(
  state: EditorState
): Array<{ from: number; to: number }> {
  return rangeSetToArray(state.field(outlinerStateField));
}

export function getVisibleRange(
  state: EditorState
): { from: number; to: number } | null {
  const hidden = getHiddenRanges(state);

  if (hidden.length === 1) {
    const [a] = hidden;
    if (a.from === 0) {
      return { from: a.to + 1, to: state.doc.length };
    }
    return { from: 0, to: a.from - 1 };
  }

  if (hidden.length === 2) {
    const [a, b] = hidden;
    return { from: a.to + 1, to: b.from - 1 };
  }

  return null;
}

export function isOutlinerFocused(state: EditorState): boolean {
  return getVisibleRange(state) !== null;
}

export function dispatchOutlinerFocus(
  view: EditorView,
  from: number,
  to: number
): void {
  view.dispatch({ effects: [outlinerFocusEffect.of({ from, to })] });
  view.dispatch({
    effects: [
      EditorView.scrollIntoView(view.state.selection.main, { y: "start" }),
    ],
  });
}

export function dispatchOutlinerUnfocus(view: EditorView): void {
  view.dispatch({ effects: [outlinerUnfocusEffect.of()] });
  view.dispatch({
    effects: [
      EditorView.scrollIntoView(view.state.selection.main, { y: "center" }),
    ],
  });
}

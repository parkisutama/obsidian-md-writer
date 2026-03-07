import { foldable } from "@codemirror/language";
import type { EditorState } from "@codemirror/state";

const LIST_ITEM_RE = /^\s*([-*+]|\d+\.)\s+/;

export function calculateOutlinerRange(
  state: EditorState,
  pos: number
): { from: number; to: number } | null {
  const line = state.doc.lineAt(pos);
  const foldRange = foldable(state, line.from, line.to);

  if (!foldRange && LIST_ITEM_RE.test(line.text)) {
    return { from: line.from, to: line.to };
  }

  if (!foldRange) {
    return null;
  }

  return { from: line.from, to: foldRange.to };
}

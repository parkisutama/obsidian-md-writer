import { EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

function isBulletPoint(e: HTMLElement): boolean {
  return (
    e instanceof HTMLSpanElement &&
    (e.classList.contains("list-bullet") ||
      e.classList.contains("cm-formatting-list"))
  );
}

export function createClickOnBulletHandler(
  onBulletClick: (view: EditorView, pos: number) => void
) {
  return EditorView.domEventHandlers({
    click: (e: MouseEvent, view: EditorView) => {
      if (!(e.target instanceof HTMLElement && isBulletPoint(e.target))) {
        return;
      }

      const pos = view.posAtDOM(e.target);
      const line = view.state.doc.lineAt(pos);

      // Move cursor to line end before zooming
      view.dispatch({
        selection: EditorSelection.cursor(line.to),
      });

      onBulletClick(view, pos);
    },
  });
}

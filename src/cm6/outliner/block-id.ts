import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";

const BLOCK_ID_LINE_RE = / \^[\w-]+$/;

/** ViewPlugin that hides block IDs in Live Preview via Decoration.replace() */
export const blockIdHiderPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView): DecorationSet {
      const ranges: Array<{ from: number; to: number }> = [];
      const doc = view.state.doc;

      for (const { from, to } of view.visibleRanges) {
        let pos = from;
        while (pos <= to) {
          const line = doc.lineAt(pos);
          const match = line.text.match(BLOCK_ID_LINE_RE);
          if (match && match.index !== undefined) {
            const idStart = line.from + match.index;
            ranges.push({ from: idStart, to: line.to });
          }
          pos = line.to + 1;
        }
      }

      return Decoration.set(
        ranges.map((r) => Decoration.replace({}).range(r.from, r.to)),
        true
      );
    }
  },
  { decorations: (v) => v.decorations }
);

/** Generate a new block ID string in the format ol-XXXXX */
export function generateBlockId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "ol-";
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/** Insert a block ID on the current line if none exists, returns the ID */
export function insertBlockId(view: EditorView): string {
  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);

  // Check if line already has a block ID
  const existing = line.text.match(BLOCK_ID_LINE_RE);
  if (existing) {
    return existing[0].trim().slice(1); // Return existing ID without ^
  }

  const newId = generateBlockId();
  view.dispatch({
    changes: {
      from: line.to,
      insert: ` ^${newId}`,
    },
  });
  return newId;
}

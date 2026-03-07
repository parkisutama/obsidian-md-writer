import { foldable } from "@codemirror/language";
import { type Extension, StateEffect, StateField } from "@codemirror/state";
import { type EditorView, showPanel } from "@codemirror/view";
import { editorViewField, type MarkdownView } from "obsidian";

interface BreadcrumbState {
  breadcrumbs: Array<{ title: string; pos: number | null }>;
  onNavigate: (view: EditorView, pos: number | null) => void;
}

const showBreadcrumbEffect = StateEffect.define<BreadcrumbState>();
const hideBreadcrumbEffect = StateEffect.define<void>();

const breadcrumbField = StateField.define<BreadcrumbState | null>({
  create: () => null,
  update: (currentValue, tr) => {
    let result = currentValue;
    for (const e of tr.effects) {
      if (e.is(showBreadcrumbEffect)) {
        result = e.value;
      }
      if (e.is(hideBreadcrumbEffect)) {
        result = null;
      }
    }
    return result;
  },
  provide: (f) =>
    showPanel.from(f, (state) => {
      if (!state) {
        return null;
      }
      return (view) => ({
        top: true,
        dom: renderBreadcrumbs(view.dom.ownerDocument, {
          breadcrumbs: state.breadcrumbs,
          onClick: (pos) => state.onNavigate(view, pos),
        }),
      });
    }),
});

const HEADING_RE = /^#+\s/;
const LIST_ITEM_RE = /^([-+*]|\d+\.)\s/;

function cleanTitle(text: string): string {
  return text.trim().replace(HEADING_RE, "").replace(LIST_ITEM_RE, "").trim();
}

function collectBreadcrumbs(
  state: import("@codemirror/state").EditorState,
  pos: number
): Array<{ title: string; pos: number | null }> {
  const fileInfo = state.field(editorViewField);
  const docTitle =
    (fileInfo as unknown as MarkdownView).getDisplayText?.() ?? "Document";
  const crumbs: Array<{ title: string; pos: number | null }> = [
    { title: docTitle, pos: null },
  ];

  const posLine = state.doc.lineAt(pos);

  for (let i = 1; i < posLine.number; i++) {
    const line = state.doc.line(i);
    const f = foldable(state, line.from, line.to);
    if (f && f.to > posLine.from) {
      crumbs.push({ title: cleanTitle(line.text), pos: line.from });
    }
  }

  crumbs.push({ title: cleanTitle(posLine.text), pos: posLine.from });
  return crumbs;
}

function renderBreadcrumbs(
  doc: Document,
  ctx: {
    breadcrumbs: Array<{ title: string; pos: number | null }>;
    onClick: (pos: number | null) => void;
  }
): HTMLElement {
  const header = doc.createElement("div");
  header.classList.add("ptm-outliner-header");

  for (let i = 0; i < ctx.breadcrumbs.length; i++) {
    if (i > 0) {
      const delim = doc.createElement("span");
      delim.classList.add("ptm-outliner-delimiter");
      delim.innerText = ">";
      header.append(delim);
    }

    const crumb = ctx.breadcrumbs[i];
    const link = doc.createElement("a");
    link.classList.add("ptm-outliner-title");
    link.dataset.pos = String(crumb.pos);
    link.appendChild(doc.createTextNode(crumb.title));
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.currentTarget as HTMLAnchorElement;
      const posStr = target.dataset.pos;
      ctx.onClick(posStr === "null" ? null : Number(posStr));
    });
    header.appendChild(link);
  }

  return header;
}

export function getBreadcrumbExtension(): Extension {
  return breadcrumbField;
}

export function showBreadcrumbs(
  view: EditorView,
  pos: number,
  onNavigate: (view: EditorView, pos: number | null) => void
): void {
  const breadcrumbs = collectBreadcrumbs(view.state, pos);
  view.dispatch({
    effects: [showBreadcrumbEffect.of({ breadcrumbs, onNavigate })],
  });
}

export function hideBreadcrumbs(view: EditorView): void {
  view.dispatch({ effects: [hideBreadcrumbEffect.of()] });
}

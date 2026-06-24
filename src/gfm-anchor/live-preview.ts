import { type EditorView, ViewPlugin } from "@codemirror/view";
import type { App, TFile } from "obsidian";
import { editorInfoField, editorLivePreviewField } from "obsidian";
import { rewriteAnchorForPreview } from "./reading-mode";

const ANCHOR_SELECTOR = 'a.internal-link, a[data-href*="#"], a[href^="#"]';

export function createLivePreviewPlugin(app: App, isEnabled: () => boolean) {
  return ViewPlugin.fromClass(
    class {
      private view: EditorView;
      private rafId = 0;

      constructor(view: EditorView) {
        this.view = view;
        this.scheduleRewrite();
      }

      update(): void {
        this.scheduleRewrite();
      }

      destroy(): void {
        window.cancelAnimationFrame(this.rafId);
      }

      private scheduleRewrite(): void {
        window.cancelAnimationFrame(this.rafId);
        this.rafId = window.requestAnimationFrame(() => {
          try {
            this.rewriteAnchors();
          } catch (error: unknown) {
            console.warn(
              "[md-writer] GFM anchor Live Preview rewrite failed",
              error
            );
          }
        });
      }

      private rewriteAnchors(): void {
        if (!(isEnabled() && isLivePreview(this.view))) {
          return;
        }

        const file = getFileFromView(this.view);
        if (!file) {
          return;
        }

        const anchors = Array.from(
          this.view.contentDOM.querySelectorAll<HTMLAnchorElement>(
            ANCHOR_SELECTOR
          )
        );

        for (const anchor of anchors) {
          rewriteAnchorForPreview(app, anchor, file.path);
        }
      }
    },
    {
      eventHandlers: {
        mouseover(event: MouseEvent, view: EditorView) {
          if (!(isEnabled() && isLivePreview(view))) {
            return;
          }

          const target = event.target;
          if (!(target instanceof HTMLElement)) {
            return;
          }

          const anchor = target.closest<HTMLAnchorElement>(ANCHOR_SELECTOR);
          const file = getFileFromView(view);
          if (!(anchor && file)) {
            return;
          }

          rewriteAnchorForPreview(app, anchor, file.path);
        },
      },
    }
  );
}

function getFileFromView(view: EditorView): TFile | null {
  try {
    return view.state.field(editorInfoField).file;
  } catch {
    return null;
  }
}

function isLivePreview(view: EditorView): boolean {
  try {
    return view.state.field(editorLivePreviewField);
  } catch {
    return false;
  }
}

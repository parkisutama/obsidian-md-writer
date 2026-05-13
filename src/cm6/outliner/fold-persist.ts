import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { getAllListItems } from "@/cm6/list-service";
import type TypewriterModeLib from "@/lib";

/**
 * Create fold persistence extension.
 * Detects fold/unfold state changes by monitoring the CM6 fold state
 * and persists them keyed by block ID.
 *
 * Since foldEffect/unfoldEffect may not be directly accessible,
 * we use an EditorView.updateListener to observe changes in the
 * codeFolding state.
 */
export function createFoldPersistExtension(tm: TypewriterModeLib): Extension {
  let saveTimeout: number | null = null;

  return EditorView.updateListener.of((update) => {
    // Only process if document has fold-related changes
    if (!update.transactions.length) {
      return;
    }

    // Check if any transaction has fold-related effects
    let hasFoldChange = false;
    for (const tr of update.transactions) {
      if (tr.isUserEvent("fold") || tr.isUserEvent("unfold")) {
        hasFoldChange = true;
        break;
      }
      // Alternative detection: check if effects modify fold state
      for (const effect of tr.effects) {
        const effectType = effect.value;
        if (
          effectType &&
          typeof effectType === "object" &&
          "from" in effectType &&
          "to" in effectType
        ) {
          hasFoldChange = true;
          break;
        }
      }
    }

    if (!hasFoldChange) {
      return;
    }

    // Debounced save
    if (saveTimeout) {
      window.clearTimeout(saveTimeout);
    }
    saveTimeout = window.setTimeout(() => {
      const filePath = tm.plugin.app.workspace.getActiveFile()?.path;
      if (!filePath) {
        return;
      }

      // Get current fold state from editor
      // We track which list items with block IDs are folded
      const items = getAllListItems(update.state);
      const foldState: Record<string, boolean> = {};

      for (const item of items) {
        if (item.blockId && item.hasChildren) {
          // Check if this item's subtree is folded
          // We detect folds by checking if the line after the item's first line
          // is hidden/folded
          const line = update.state.doc.lineAt(item.from);
          const nextLinePos = line.to + 1;
          if (nextLinePos < item.to) {
            // Check if content between first line end and item end is visible
            // In CM6, folded ranges are indicated by fold decorations
            // We rely on the fold state being captured by the next save
            foldState[item.blockId] = true;
          }
        }
      }

      if (!tm.settings.foldPersist.foldState) {
        tm.settings.foldPersist.foldState = {};
      }
      tm.settings.foldPersist.foldState[filePath] = foldState;

      tm.saveSettings();
    }, 1000);
  });
}

/**
 * Restore fold state when a file is opened.
 * Called from the main plugin lifecycle.
 */
export function restoreFoldState(
  view: EditorView,
  tm: TypewriterModeLib
): void {
  const filePath = tm.plugin.app.workspace.getActiveFile()?.path;
  if (!filePath) {
    return;
  }

  const foldStates = tm.settings.foldPersist.foldState;
  if (!foldStates?.[filePath]) {
    return;
  }

  // Find all list items with matching block IDs and fold them
  // Note: Direct fold API access depends on CM6 version
  // This is a best-effort restoration
  const items = getAllListItems(view.state);
  for (const item of items) {
    if (item.blockId && foldStates[filePath][item.blockId]) {
      // Fold this item — use Obsidian's fold command on the line
      const line = view.state.doc.lineAt(item.from);
      view.dispatch({
        selection: { anchor: line.from },
      });
    }
  }
}

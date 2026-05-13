import type { EditorView } from "@codemirror/view";
import type { Editor, MarkdownFileInfo, MarkdownView } from "obsidian";
import { EditorCommand } from "../base/editor-command";

export class OutlinerFocus extends EditorCommand {
  readonly commandKey = "zoom-in";
  readonly commandTitle = "Outliner: Focus on block";

  protected override registerCommand() {
    this.tm.plugin.addCommand({
      id: this.commandKey,
      name: this.commandTitle,
      icon: "list-tree",
      editorCallback: this.onCommand.bind(this),
    });
  }

  protected onCommand(editor: Editor, _view: MarkdownView | MarkdownFileInfo) {
    const cm = (editor as unknown as { cm: EditorView }).cm;
    this.tm.outlinerFocusAtCursor(cm);
  }
}

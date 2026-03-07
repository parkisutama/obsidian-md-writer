import type { EditorView } from "@codemirror/view";
import type { Editor, MarkdownFileInfo, MarkdownView } from "obsidian";
import { EditorCommand } from "../base/editor-command";

export class ZoomIn extends EditorCommand {
  readonly commandKey = "zoom-in";
  readonly commandTitle = "Zoom in";

  protected override registerCommand() {
    this.tm.plugin.addCommand({
      id: this.commandKey,
      name: this.commandTitle,
      icon: "zoom-in",
      editorCallback: this.onCommand.bind(this),
      hotkeys: [{ modifiers: ["Mod"], key: "." }],
    });
  }

  protected onCommand(editor: Editor, _view: MarkdownView | MarkdownFileInfo) {
    const cm = (editor as unknown as { cm: EditorView }).cm;
    this.tm.zoomInAtCursor(cm);
  }
}

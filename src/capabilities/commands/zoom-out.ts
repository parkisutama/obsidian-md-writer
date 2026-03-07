import type { EditorView } from "@codemirror/view";
import type { Editor, MarkdownFileInfo, MarkdownView } from "obsidian";
import { EditorCommand } from "../base/editor-command";

export class ZoomOut extends EditorCommand {
  readonly commandKey = "zoom-out";
  readonly commandTitle = "Zoom out the entire document";

  protected override registerCommand() {
    this.tm.plugin.addCommand({
      id: this.commandKey,
      name: this.commandTitle,
      icon: "zoom-out",
      editorCallback: this.onCommand.bind(this),
      hotkeys: [{ modifiers: ["Mod", "Shift"], key: "." }],
    });
  }

  protected onCommand(editor: Editor, _view: MarkdownView | MarkdownFileInfo) {
    const cm = (editor as unknown as { cm: EditorView }).cm;
    this.tm.zoomOut(cm);
  }
}

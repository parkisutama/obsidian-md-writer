import { Command } from "@/capabilities/base/command";
import type { WritingMode } from "@/capabilities/settings";
import type TypewriterModeLib from "@/lib";

export const WRITING_MODES: Array<{ mode: WritingMode; label: string }> = [
  { mode: "idea", label: "Idea mode" },
  { mode: "writing", label: "Writing mode" },
  { mode: "editing", label: "Editing mode" },
  { mode: "none", label: "None (manual)" },
];

export default class SetWritingModeCommand extends Command {
  private readonly _commandKey: string;
  private readonly _commandTitle: string;
  private readonly mode: WritingMode;

  constructor(tm: TypewriterModeLib, mode: WritingMode, label: string) {
    super(tm);
    this.mode = mode;
    this._commandKey = `set-writing-mode-${mode}`;
    this._commandTitle = `Set Writing Mode: ${label}`;
  }

  get commandKey(): string {
    return this._commandKey;
  }

  get commandTitle(): string {
    return this._commandTitle;
  }

  protected onCommand(): void {
    this.tm.settings.writingMode.activeMode = this.mode;
    if (this.mode !== "none") {
      const preset = this.tm.settings.writingMode.presets[this.mode];
      const feature = this.tm.features.writingModes["writingMode.activeMode"];
      if (
        feature &&
        typeof (
          feature as unknown as { applyPreset?: (preset: unknown) => void }
        ).applyPreset === "function"
      ) {
        (
          feature as unknown as { applyPreset: (preset: unknown) => void }
        ).applyPreset(preset);
      }
    }
    this.tm.saveSettings();
  }
}

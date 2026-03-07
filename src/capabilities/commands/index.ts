import type TypewriterModeLib from "@/lib";
import type { AbstractCommand } from "../base/abstract-command";
import { MoveTypewriterDown, MoveTypewriterUp } from "./move-typewriter";
import { OutlinerFocus } from "./outliner-focus";
import { OutlinerUnfocus } from "./outliner-unfocus";
import SetWritingModeCommand, { WRITING_MODES } from "./set-writing-mode";
import { ToggleDimming } from "./toggle-dimming";
import { ToggleHemingwayMode } from "./toggle-hemingway-mode";
import { TogglePlugin } from "./toggle-plugin";
import { ToggleShowWhitespace } from "./toggle-show-whitespace";
import { ToggleTypewriter } from "./toggle-typewriter";
import { ToggleTypewriterAndDimming } from "./toggle-typewriter-and-dimming";
import { WritingFocusCommand } from "./writing-focus";

export function getCommands(
  tm: TypewriterModeLib
): Record<string, AbstractCommand> {
  return Object.fromEntries(
    [
      new TogglePlugin(tm),
      new ToggleTypewriter(tm),
      new ToggleDimming(tm),
      new ToggleTypewriterAndDimming(tm),
      new MoveTypewriterUp(tm),
      new MoveTypewriterDown(tm),
      new WritingFocusCommand(tm),
      new ToggleHemingwayMode(tm),
      new ToggleShowWhitespace(tm),
      new OutlinerFocus(tm),
      new OutlinerUnfocus(tm),
      ...WRITING_MODES.map(
        ({ mode, label }) => new SetWritingModeCommand(tm, mode, label)
      ),
    ].map((cmd) => [cmd.commandKey, cmd])
  );
}

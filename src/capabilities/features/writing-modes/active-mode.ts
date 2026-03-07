import type { SettingGroup } from "obsidian";
import { Feature } from "@/capabilities/base/feature";
import type { WritingMode, WritingModePreset } from "@/capabilities/settings";

export default class WritingModeActive extends Feature {
  readonly settingKey = "writingMode.activeMode" as const;

  registerSetting(settingGroup: SettingGroup): void {
    const currentMode = this.tm.settings.writingMode.activeMode;

    settingGroup.addSetting((setting) =>
      setting
        .setName("Active writing mode")
        .setDesc(
          "Select a writing mode to activate its feature preset. Choose None to manage features manually."
        )
        .setClass("typewriter-mode-setting")
        .addDropdown((dropdown) => {
          dropdown
            .addOption("none", "None")
            .addOption("idea", "Idea")
            .addOption("writing", "Writing")
            .addOption("editing", "Editing")
            .setValue(currentMode)
            .onChange((newValue) => {
              this.setSettingValue(newValue as WritingMode);
              this.applyMode(newValue as WritingMode);
              this.tm.saveSettings().catch((error) => {
                console.error("Failed to save settings:", error);
              });
            });
        })
    );
  }

  override load() {
    // Don't apply mode on load — features load their own saved state
  }

  applyMode(mode: WritingMode) {
    if (mode === "none") {
      return;
    }

    const preset = this.tm.settings.writingMode.presets[mode];
    this.applyPreset(preset);
  }

  applyPreset(preset: WritingModePreset) {
    const featureMap: Array<{
      key: string;
      settingKey: string;
      enabled: boolean;
    }> = [
      {
        key: "outliner",
        settingKey: "outliner.isOutlinerEnabled",
        enabled: preset.outliner,
      },
      {
        key: "hemingwayMode",
        settingKey: "hemingwayMode.isHemingwayModeEnabled",
        enabled: preset.hemingwayMode,
      },
      {
        key: "writingFocus",
        settingKey: "writingFocus.doesWritingFocusShowVignette",
        enabled: preset.writingFocus,
      },
      {
        key: "typewriter",
        settingKey: "typewriter.isTypewriterScrollEnabled",
        enabled: preset.typewriter,
      },
      {
        key: "dimming",
        settingKey: "dimming.isDimUnfocusedEnabled",
        enabled: preset.dimming,
      },
      {
        key: "currentLine",
        settingKey: "currentLine.isHighlightCurrentLineEnabled",
        enabled: preset.currentLine,
      },
      {
        key: "showWhitespace",
        settingKey: "showWhitespace.isShowWhitespaceEnabled",
        enabled: preset.showWhitespace,
      },
      {
        key: "maxChar",
        settingKey: "maxChars.isMaxCharsPerLineEnabled",
        enabled: preset.maxChars,
      },
    ];

    for (const entry of featureMap) {
      const category = this.tm.features[entry.key];
      if (!category) {
        continue;
      }

      const feature = category[entry.settingKey];
      if (feature && "toggle" in feature) {
        (feature as { toggle: (value: boolean) => void }).toggle(entry.enabled);
      }
    }
  }
}

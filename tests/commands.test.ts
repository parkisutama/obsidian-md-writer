import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS } from "@/capabilities/settings";

vi.mock("obsidian", () => ({
  ItemView: class ItemView {},
  Notice: class Notice {
    readonly message: string;

    constructor(message: string) {
      this.message = message;
    }
  },
  Platform: {
    isMobile: false,
  },
}));

const featureToggle = {
  getSettingValue: () => false,
  toggle: vi.fn(),
};

const createFeatureGroup = () =>
  new Proxy<Record<string, unknown>>(
    {},
    {
      get: () => featureToggle,
    }
  );

describe("command registration", () => {
  it("does not register duplicate Obsidian command ids", async () => {
    const registeredIds: string[] = [];
    const { getCommands } = await import("@/capabilities/commands");
    const tm = {
      features: {
        dimming: createFeatureGroup(),
        general: createFeatureGroup(),
        hemingwayMode: createFeatureGroup(),
        showWhitespace: createFeatureGroup(),
        typewriter: createFeatureGroup(),
        writingModes: createFeatureGroup(),
      },
      plugin: {
        addCommand: ({ id }: { id: string }) => {
          registeredIds.push(id);
        },
        addRibbonIcon: vi.fn(),
        app: {
          workspace: {
            containerEl: {
              hasClass: () => false,
              removeClass: vi.fn(),
              toggleClass: vi.fn(),
            },
            getActiveViewOfType: () => null,
            leftSplit: {
              collapse: vi.fn(),
              collapsed: false,
              expand: vi.fn(),
            },
            rightSplit: {
              collapse: vi.fn(),
              collapsed: false,
              expand: vi.fn(),
            },
          },
        },
      },
      saveSettings: vi.fn(),
      settings: structuredClone(DEFAULT_SETTINGS),
    };

    const commands = Object.values(getCommands(tm as never));
    const commandKeys = commands.map((command) => command.commandKey);

    for (const command of commands) {
      command.load();
    }

    expect(new Set(commandKeys).size).toBe(commandKeys.length);
    expect(new Set(registeredIds).size).toBe(registeredIds.length);
    expect(registeredIds.length).toBeGreaterThan(commandKeys.length);
  });

  it("activates a writing mode through the command palette command", async () => {
    const callbacks = new Map<string, () => void>();
    const applyMode = vi.fn();
    const { getCommands } = await import("@/capabilities/commands");
    const tm = {
      features: {
        dimming: createFeatureGroup(),
        general: createFeatureGroup(),
        hemingwayMode: createFeatureGroup(),
        showWhitespace: createFeatureGroup(),
        typewriter: createFeatureGroup(),
        writingModes: {
          "writingMode.activeMode": { applyMode },
        },
      },
      plugin: {
        addCommand: ({
          callback,
          id,
        }: {
          callback: () => void;
          id: string;
        }) => {
          callbacks.set(id, callback);
        },
        addRibbonIcon: vi.fn(),
        app: {
          workspace: {
            containerEl: {
              hasClass: () => false,
              removeClass: vi.fn(),
              toggleClass: vi.fn(),
            },
            getActiveViewOfType: () => null,
            leftSplit: {
              collapse: vi.fn(),
              collapsed: false,
              expand: vi.fn(),
            },
            rightSplit: {
              collapse: vi.fn(),
              collapsed: false,
              expand: vi.fn(),
            },
          },
        },
      },
      saveSettings: vi.fn().mockResolvedValue(undefined),
      settings: structuredClone(DEFAULT_SETTINGS),
    };

    for (const command of Object.values(getCommands(tm as never))) {
      command.load();
    }

    callbacks.get("set-writing-mode-writing")?.();

    expect(applyMode).toHaveBeenCalledWith("writing");
    expect(tm.saveSettings).toHaveBeenCalled();
  });

  it("applies preset features when activating a writing mode", async () => {
    const toggles = {
      currentLine: vi.fn(),
      dimming: vi.fn(),
      hemingwayMode: vi.fn(),
      maxChar: vi.fn(),
      outliner: vi.fn(),
      showWhitespace: vi.fn(),
      typewriter: vi.fn(),
      writingFocus: vi.fn(),
    };
    const { default: WritingModeActive } = await import(
      "@/capabilities/features/writing-modes/active-mode"
    );
    const tm = {
      features: {
        currentLine: {
          "currentLine.isHighlightCurrentLineEnabled": {
            toggle: toggles.currentLine,
          },
        },
        dimming: {
          "dimming.isDimUnfocusedEnabled": { toggle: toggles.dimming },
        },
        hemingwayMode: {
          "hemingwayMode.isHemingwayModeEnabled": {
            toggle: toggles.hemingwayMode,
          },
        },
        maxChar: {
          "maxChars.isMaxCharsPerLineEnabled": { toggle: toggles.maxChar },
        },
        outliner: {
          "outliner.isOutlinerEnabled": { toggle: toggles.outliner },
        },
        showWhitespace: {
          "showWhitespace.isShowWhitespaceEnabled": {
            toggle: toggles.showWhitespace,
          },
        },
        typewriter: {
          "typewriter.isTypewriterScrollEnabled": {
            toggle: toggles.typewriter,
          },
        },
      },
      commands: {
        "writing-focus": {
          setWritingFocusEnabled: toggles.writingFocus,
        },
      },
      settings: structuredClone(DEFAULT_SETTINGS),
    };

    new WritingModeActive(tm as never).applyMode("editing");

    expect(tm.settings.writingMode.activeMode).toBe("editing");
    expect(toggles.outliner).toHaveBeenCalledWith(false);
    expect(toggles.hemingwayMode).toHaveBeenCalledWith(false);
    expect(toggles.typewriter).toHaveBeenCalledWith(false);
    expect(toggles.dimming).toHaveBeenCalledWith(false);
    expect(toggles.currentLine).toHaveBeenCalledWith(true);
    expect(toggles.showWhitespace).toHaveBeenCalledWith(true);
    expect(toggles.maxChar).toHaveBeenCalledWith(true);
    expect(toggles.writingFocus).toHaveBeenCalledWith(false);
  });

  it("keeps live feature states unchanged when switching to manual mode", async () => {
    const toggle = vi.fn();
    const { default: WritingModeActive } = await import(
      "@/capabilities/features/writing-modes/active-mode"
    );
    const tm = {
      features: {
        outliner: {
          "outliner.isOutlinerEnabled": { toggle },
        },
      },
      settings: structuredClone(DEFAULT_SETTINGS),
    };

    new WritingModeActive(tm as never).applyMode("none");

    expect(tm.settings.writingMode.activeMode).toBe("none");
    expect(toggle).not.toHaveBeenCalled();
  });

  it("disables managed feature states when switching to normal mode", async () => {
    const toggles = {
      currentLine: vi.fn(),
      dimming: vi.fn(),
      hemingwayMode: vi.fn(),
      maxChar: vi.fn(),
      outliner: vi.fn(),
      showWhitespace: vi.fn(),
      typewriter: vi.fn(),
      writingFocus: vi.fn(),
    };
    const { default: WritingModeActive } = await import(
      "@/capabilities/features/writing-modes/active-mode"
    );
    const tm = {
      features: {
        currentLine: {
          "currentLine.isHighlightCurrentLineEnabled": {
            toggle: toggles.currentLine,
          },
        },
        dimming: {
          "dimming.isDimUnfocusedEnabled": { toggle: toggles.dimming },
        },
        hemingwayMode: {
          "hemingwayMode.isHemingwayModeEnabled": {
            toggle: toggles.hemingwayMode,
          },
        },
        maxChar: {
          "maxChars.isMaxCharsPerLineEnabled": { toggle: toggles.maxChar },
        },
        outliner: {
          "outliner.isOutlinerEnabled": { toggle: toggles.outliner },
        },
        showWhitespace: {
          "showWhitespace.isShowWhitespaceEnabled": {
            toggle: toggles.showWhitespace,
          },
        },
        typewriter: {
          "typewriter.isTypewriterScrollEnabled": {
            toggle: toggles.typewriter,
          },
        },
      },
      commands: {
        "writing-focus": {
          setWritingFocusEnabled: toggles.writingFocus,
        },
      },
      settings: structuredClone(DEFAULT_SETTINGS),
    };

    new WritingModeActive(tm as never).applyMode("normal");

    expect(tm.settings.writingMode.activeMode).toBe("normal");
    expect(toggles.outliner).toHaveBeenCalledWith(false);
    expect(toggles.hemingwayMode).toHaveBeenCalledWith(false);
    expect(toggles.typewriter).toHaveBeenCalledWith(false);
    expect(toggles.dimming).toHaveBeenCalledWith(false);
    expect(toggles.currentLine).toHaveBeenCalledWith(false);
    expect(toggles.showWhitespace).toHaveBeenCalledWith(false);
    expect(toggles.maxChar).toHaveBeenCalledWith(false);
    expect(toggles.writingFocus).toHaveBeenCalledWith(false);
  });
});

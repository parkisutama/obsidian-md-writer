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
});

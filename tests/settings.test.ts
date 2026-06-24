import type { Vault } from "obsidian";
import { describe, expect, it, vi } from "vitest";
import {
  applyStartupMigrations,
  DEFAULT_SETTINGS,
  getSettingByPath,
  setSettingByPath,
  type TypewriterModeSettings,
} from "@/capabilities/settings";

const createVault = (cursorPositions?: Record<string, unknown>) =>
  ({
    adapter: {
      exists: vi.fn().mockResolvedValue(cursorPositions !== undefined),
      read: vi.fn().mockResolvedValue(JSON.stringify(cursorPositions ?? {})),
    },
  }) as unknown as Vault;

describe("settings defaults and migrations", () => {
  it("keeps typed dotted-path access in sync with defaults", () => {
    const settings = structuredClone(DEFAULT_SETTINGS);

    expect(
      getSettingByPath(settings, "typewriter.isTypewriterScrollEnabled")
    ).toBe(true);

    setSettingByPath(settings, "typewriter.typewriterOffset", 0.42);

    expect(getSettingByPath(settings, "typewriter.typewriterOffset")).toBe(
      0.42
    );
  });

  it("migrates legacy flat settings and cursor positions", async () => {
    const migrated = await applyStartupMigrations(
      {
        isTypewriterScrollEnabled: false,
        typewriterOffset: 0.65,
        isDimUnfocusedEnabled: true,
        version: "1.1.0",
      },
      createVault({ "Draft.md": { ch: 4, line: 2 } }),
      ".obsidian/plugins/md-writer"
    );

    expect(migrated.general.version).toBe("1.1.0");
    expect(migrated.typewriter.isTypewriterScrollEnabled).toBe(false);
    expect(migrated.typewriter.typewriterOffset).toBe(0.65);
    expect(migrated.dimming.isDimUnfocusedEnabled).toBe(true);
    expect(migrated.restoreCursorPosition.cursorPositions).toEqual({
      "Draft.md": { ch: 4, line: 2 },
    });
    expect(migrated.showWhitespace).toEqual(DEFAULT_SETTINGS.showWhitespace);
  });

  it("deep-merges modern settings with newly introduced defaults", async () => {
    const migrated = await applyStartupMigrations(
      {
        general: {
          ...DEFAULT_SETTINGS.general,
          version: "1.2.0",
        },
        typewriter: {
          ...DEFAULT_SETTINGS.typewriter,
          typewriterOffset: 0.25,
        },
      } satisfies Partial<TypewriterModeSettings>,
      createVault(),
      ".obsidian/plugins/md-writer"
    );

    expect(migrated.general.version).toBe("1.2.0");
    expect(migrated.typewriter.typewriterOffset).toBe(0.25);
    expect(migrated.outliner).toEqual(DEFAULT_SETTINGS.outliner);
    expect(migrated.blockId).toEqual(DEFAULT_SETTINGS.blockId);
  });

  it("deep-merges writing mode presets with newly introduced defaults", async () => {
    const migrated = await applyStartupMigrations(
      {
        general: {
          ...DEFAULT_SETTINGS.general,
          version: "1.2.0",
        },
        writingMode: {
          activeMode: "writing",
          presets: {
            idea: {
              currentLine: false,
              dimming: false,
              hemingwayMode: true,
              maxChars: false,
              outliner: false,
              showWhitespace: false,
              typewriter: false,
            },
            writing: {
              currentLine: false,
              dimming: false,
              hemingwayMode: false,
              maxChars: false,
              outliner: false,
              showWhitespace: false,
              typewriter: false,
            },
            editing: {
              currentLine: true,
              dimming: false,
              hemingwayMode: false,
              maxChars: true,
              outliner: false,
              showWhitespace: true,
              typewriter: false,
            },
          },
        },
      } as Partial<TypewriterModeSettings>,
      createVault(),
      ".obsidian/plugins/md-writer"
    );

    expect(migrated.writingMode.activeMode).toBe("writing");
    expect(migrated.writingMode.presets.writing.hemingwayMode).toBe(false);
    expect(migrated.writingMode.presets.idea.outliner).toBe(false);
    expect(migrated.writingMode.presets.idea.writingFocus).toBe(true);
    expect(migrated.writingMode.presets.writing.writingFocus).toBe(true);
    expect(migrated.writingMode.presets.editing.writingFocus).toBe(false);
    expect(migrated.writingMode.presets.normal).toEqual({
      currentLine: false,
      dimming: false,
      hemingwayMode: false,
      maxChars: false,
      outliner: false,
      showWhitespace: false,
      typewriter: false,
      writingFocus: false,
    });
  });
});

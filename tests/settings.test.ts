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
});

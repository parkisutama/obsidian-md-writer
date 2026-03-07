import type { Vault } from "obsidian";
import {
  CURRENT_LINE_HIGHLIGHT_STYLE,
  type CurrentLineHighlightStyle,
  DIM_UNFOCUSED_EDITORS_BEHAVIOR,
  DIM_UNFOCUSED_MODE,
  type DimUnfocusedEditorsBehavior,
  type DimUnfocusedMode,
  ENABLED_PLATFORMS,
  type EnabledPlatforms,
  WRITING_FOCUS_VIGNETTE_STYLE,
  type WritingFocusVignetteStyle,
} from "./constants";

export interface GeneralSettings {
  enabledPlatforms: EnabledPlatforms;
  isAnnounceUpdatesEnabled: boolean;
  isOnlyActivateAfterFirstInteractionEnabled: boolean;
  isPluginActivated: boolean;
  version: string | null;
}

export interface TypewriterSettings {
  isOnlyMaintainTypewriterOffsetWhenReachedEnabled: boolean;
  isTypewriterOnlyUseCommandsEnabled: boolean;
  isTypewriterScrollEnabled: boolean;
  typewriterOffset: number;
}

export interface KeepLinesAboveAndBelowSettings {
  isKeepLinesAboveAndBelowEnabled: boolean;
  linesAboveAndBelow: number;
}

export interface MaxCharsSettings {
  isMaxCharsPerLineEnabled: boolean;
  isWarnLongLineEnabled: boolean;
  maxCharsPerLine: number;
  warnLongLineChars: number;
}

export interface DimmingSettings {
  dimmedOpacity: number;
  dimUnfocusedEditorsBehavior: DimUnfocusedEditorsBehavior;
  dimUnfocusedMode: DimUnfocusedMode;
  isDimHighlightListParentEnabled: boolean;
  isDimTableAsOneEnabled: boolean;
  isDimUnfocusedEnabled: boolean;
  isPauseDimUnfocusedWhileScrollingEnabled: boolean;
  isPauseDimUnfocusedWhileSelectingEnabled: boolean;
}

export interface CurrentLineSettings {
  "currentLineHighlightColor-dark": string;
  "currentLineHighlightColor-light": string;
  currentLineHighlightStyle: CurrentLineHighlightStyle;
  currentLineHighlightUnderlineThickness: number;
  fadeLinesIntensity: number;
  isFadeLinesEnabled: boolean;
  isHighlightCurrentLineEnabled: boolean;
  isHighlightCurrentLineOnlyInFocusedEditorEnabled: boolean;
  isPauseCurrentLineHighlightWhileScrollingEnabled: boolean;
  isPauseCurrentLineHighlightWhileSelectingEnabled: boolean;
}

export interface WritingFocusSettings {
  doesWritingFocusShowHeader: boolean;
  doesWritingFocusShowStatusBar: boolean;
  doesWritingFocusShowVignette: boolean;
  isWritingFocusFullscreen: boolean;
  writingFocusFontSize: number;
  writingFocusVignetteStyle: WritingFocusVignetteStyle;
}

export interface RestoreCursorPositionSettings {
  cursorPositions: Record<string, unknown>;
  isRestoreCursorPositionEnabled: boolean;
}

export interface HemingwayModeSettings {
  hemingwayModeStatusBarText: string;
  isAllowBackspaceInHemingwayModeEnabled: boolean;
  isHemingwayModeEnabled: boolean;
  isShowHemingwayModeStatusBarEnabled: boolean;
}

export interface ShowWhitespaceSettings {
  isShowSpacesEnabled: boolean;
  isShowStrictLineBreakEnabled: boolean;
  isShowTabsEnabled: boolean;
  isShowTrailingEnabled: boolean;
  isShowWhitespaceEnabled: boolean;
}

export interface OutlinerSettings {
  isOutlinerBreadcrumbsEnabled: boolean;
  isOutlinerEnabled: boolean;
  isOutlinerOnClickEnabled: boolean;
}

export interface TypewriterModeSettings {
  currentLine: CurrentLineSettings;
  dimming: DimmingSettings;
  general: GeneralSettings;
  hemingwayMode: HemingwayModeSettings;
  keepLinesAboveAndBelow: KeepLinesAboveAndBelowSettings;
  maxChars: MaxCharsSettings;
  outliner: OutlinerSettings;
  restoreCursorPosition: RestoreCursorPositionSettings;
  showWhitespace: ShowWhitespaceSettings;
  typewriter: TypewriterSettings;
  writingFocus: WritingFocusSettings;
}

// Typesafe dotted-path type for accessing nested settings
// e.g. "typewriter.isTypewriterScrollEnabled", "general.version"
export type SettingsPath = {
  [C in keyof TypewriterModeSettings]: `${C & string}.${keyof TypewriterModeSettings[C] & string}`;
}[keyof TypewriterModeSettings];

export type SettingValueAtPath<P extends SettingsPath> =
  P extends `${infer C}.${infer K}`
    ? C extends keyof TypewriterModeSettings
      ? K extends keyof TypewriterModeSettings[C]
        ? TypewriterModeSettings[C][K]
        : never
      : never
    : never;

export function getSettingByPath<P extends SettingsPath>(
  settings: TypewriterModeSettings,
  path: P
): SettingValueAtPath<P> {
  const dot = path.indexOf(".");
  const category = path.slice(0, dot) as keyof TypewriterModeSettings;
  const key = path.slice(dot + 1);
  return settings[category][key as never] as SettingValueAtPath<P>;
}

export function setSettingByPath<P extends SettingsPath>(
  settings: TypewriterModeSettings,
  path: P,
  value: SettingValueAtPath<P>
): void {
  const dot = path.indexOf(".");
  const category = path.slice(0, dot) as keyof TypewriterModeSettings;
  const key = path.slice(dot + 1);
  // @ts-expect-error
  settings[category][key] = value;
}

export const DEFAULT_SETTINGS: TypewriterModeSettings = {
  general: {
    version: null,
    isAnnounceUpdatesEnabled: true,
    isPluginActivated: true,
    isOnlyActivateAfterFirstInteractionEnabled: false,
    enabledPlatforms: ENABLED_PLATFORMS.BOTH,
  },
  typewriter: {
    isTypewriterScrollEnabled: true,
    isOnlyMaintainTypewriterOffsetWhenReachedEnabled: false,
    isTypewriterOnlyUseCommandsEnabled: false,
    typewriterOffset: 0.5,
  },
  keepLinesAboveAndBelow: {
    isKeepLinesAboveAndBelowEnabled: false,
    linesAboveAndBelow: 5,
  },
  maxChars: {
    isMaxCharsPerLineEnabled: false,
    isWarnLongLineEnabled: false,
    maxCharsPerLine: 64,
    warnLongLineChars: 120,
  },
  dimming: {
    isDimUnfocusedEnabled: false,
    isDimHighlightListParentEnabled: false,
    isDimTableAsOneEnabled: true,
    dimUnfocusedMode: DIM_UNFOCUSED_MODE.PARAGRAPHS,
    dimUnfocusedEditorsBehavior: DIM_UNFOCUSED_EDITORS_BEHAVIOR.DIM,
    dimmedOpacity: 0.25,
    isPauseDimUnfocusedWhileScrollingEnabled: true,
    isPauseDimUnfocusedWhileSelectingEnabled: true,
  },
  currentLine: {
    isHighlightCurrentLineEnabled: true,
    isFadeLinesEnabled: false,
    fadeLinesIntensity: 0.5,
    isHighlightCurrentLineOnlyInFocusedEditorEnabled: false,
    isPauseCurrentLineHighlightWhileScrollingEnabled: false,
    isPauseCurrentLineHighlightWhileSelectingEnabled: false,
    currentLineHighlightStyle: CURRENT_LINE_HIGHLIGHT_STYLE.BOX,
    currentLineHighlightUnderlineThickness: 1,
    "currentLineHighlightColor-dark": "#444",
    "currentLineHighlightColor-light": "#ddd",
  },
  writingFocus: {
    doesWritingFocusShowHeader: false,
    doesWritingFocusShowStatusBar: false,
    doesWritingFocusShowVignette: true,
    isWritingFocusFullscreen: true,
    writingFocusVignetteStyle: WRITING_FOCUS_VIGNETTE_STYLE.BOX,
    writingFocusFontSize: 0,
  },
  restoreCursorPosition: {
    isRestoreCursorPositionEnabled: false,
    cursorPositions: {},
  },
  hemingwayMode: {
    isHemingwayModeEnabled: false,
    isAllowBackspaceInHemingwayModeEnabled: false,
    isShowHemingwayModeStatusBarEnabled: true,
    hemingwayModeStatusBarText: "Hemingway",
  },
  showWhitespace: {
    isShowWhitespaceEnabled: false,
    isShowSpacesEnabled: true,
    isShowTabsEnabled: true,
    isShowTrailingEnabled: true,
    isShowStrictLineBreakEnabled: true,
  },
  outliner: {
    isOutlinerEnabled: true,
    isOutlinerOnClickEnabled: true,
    isOutlinerBreadcrumbsEnabled: true,
  },
};

// Legacy flat settings structure for migration
interface LegacyTypewriterModeSettings {
  "currentLineHighlightColor-dark": string;
  "currentLineHighlightColor-light": string;
  currentLineHighlightStyle: CurrentLineHighlightStyle;
  currentLineHighlightUnderlineThickness: number;
  dimmedOpacity: number;
  dimUnfocusedEditorsBehavior: DimUnfocusedEditorsBehavior;
  dimUnfocusedMode: DimUnfocusedMode;
  doesWritingFocusShowHeader: boolean;
  doesWritingFocusShowStatusBar: boolean;
  doesWritingFocusShowVignette: boolean;
  fadeLinesIntensity: number;
  hemingwayModeStatusBarText: string;
  isAllowBackspaceInHemingwayModeEnabled: boolean;
  isAnnounceUpdatesEnabled: boolean;
  isDimHighlightListParentEnabled: boolean;
  isDimTableAsOneEnabled: boolean;
  isDimUnfocusedEnabled: boolean;
  isFadeLinesEnabled: boolean;
  isHemingwayModeEnabled: boolean;
  isHighlightCurrentLineEnabled: boolean;
  isHighlightCurrentLineOnlyInFocusedEditorEnabled: boolean;
  isKeepLinesAboveAndBelowEnabled: boolean;
  isMaxCharsPerLineEnabled: boolean;
  isOnlyActivateAfterFirstInteractionEnabled: boolean;
  isOnlyMaintainTypewriterOffsetWhenReachedEnabled: boolean;
  isPauseDimUnfocusedWhileScrollingEnabled: boolean;
  isPauseDimUnfocusedWhileSelectingEnabled: boolean;
  isPluginActivated: boolean;
  isRestoreCursorPositionEnabled: boolean;
  isShowHemingwayModeStatusBarEnabled: boolean;
  isTypewriterOnlyUseCommandsEnabled: boolean;
  isTypewriterScrollEnabled: boolean;
  isWritingFocusFullscreen: boolean;
  linesAboveAndBelow: number;
  maxCharsPerLine: number;
  typewriterOffset: number;
  version: string | null;
  writingFocusFontSize: number;
  writingFocusVignetteStyle: WritingFocusVignetteStyle;
}

// Migration function to convert legacy flat settings to new grouped settings
function migrateGeneralSettings(legacy: Partial<LegacyTypewriterModeSettings>) {
  return {
    version: legacy.version ?? DEFAULT_SETTINGS.general.version,
    isAnnounceUpdatesEnabled:
      legacy.isAnnounceUpdatesEnabled ??
      DEFAULT_SETTINGS.general.isAnnounceUpdatesEnabled,
    isPluginActivated:
      legacy.isPluginActivated ?? DEFAULT_SETTINGS.general.isPluginActivated,
    isOnlyActivateAfterFirstInteractionEnabled:
      legacy.isOnlyActivateAfterFirstInteractionEnabled ??
      DEFAULT_SETTINGS.general.isOnlyActivateAfterFirstInteractionEnabled,
    enabledPlatforms: DEFAULT_SETTINGS.general.enabledPlatforms,
  };
}

function migrateTypewriterSettings(
  legacy: Partial<LegacyTypewriterModeSettings>
) {
  return {
    isTypewriterScrollEnabled:
      legacy.isTypewriterScrollEnabled ??
      DEFAULT_SETTINGS.typewriter.isTypewriterScrollEnabled,
    isOnlyMaintainTypewriterOffsetWhenReachedEnabled:
      legacy.isOnlyMaintainTypewriterOffsetWhenReachedEnabled ??
      DEFAULT_SETTINGS.typewriter
        .isOnlyMaintainTypewriterOffsetWhenReachedEnabled,
    isTypewriterOnlyUseCommandsEnabled:
      legacy.isTypewriterOnlyUseCommandsEnabled ??
      DEFAULT_SETTINGS.typewriter.isTypewriterOnlyUseCommandsEnabled,
    typewriterOffset:
      legacy.typewriterOffset ?? DEFAULT_SETTINGS.typewriter.typewriterOffset,
  };
}

function migrateDimmingSettings(legacy: Partial<LegacyTypewriterModeSettings>) {
  return {
    isDimUnfocusedEnabled:
      legacy.isDimUnfocusedEnabled ??
      DEFAULT_SETTINGS.dimming.isDimUnfocusedEnabled,
    isDimHighlightListParentEnabled:
      legacy.isDimHighlightListParentEnabled ??
      DEFAULT_SETTINGS.dimming.isDimHighlightListParentEnabled,
    isDimTableAsOneEnabled:
      legacy.isDimTableAsOneEnabled ??
      DEFAULT_SETTINGS.dimming.isDimTableAsOneEnabled,
    dimUnfocusedMode:
      legacy.dimUnfocusedMode ?? DEFAULT_SETTINGS.dimming.dimUnfocusedMode,
    dimUnfocusedEditorsBehavior:
      legacy.dimUnfocusedEditorsBehavior ??
      DEFAULT_SETTINGS.dimming.dimUnfocusedEditorsBehavior,
    dimmedOpacity:
      legacy.dimmedOpacity ?? DEFAULT_SETTINGS.dimming.dimmedOpacity,
    isPauseDimUnfocusedWhileScrollingEnabled:
      legacy.isPauseDimUnfocusedWhileScrollingEnabled ??
      DEFAULT_SETTINGS.dimming.isPauseDimUnfocusedWhileScrollingEnabled,
    isPauseDimUnfocusedWhileSelectingEnabled:
      legacy.isPauseDimUnfocusedWhileSelectingEnabled ??
      DEFAULT_SETTINGS.dimming.isPauseDimUnfocusedWhileSelectingEnabled,
  };
}

function migrateCurrentLineSettings(
  legacy: Partial<LegacyTypewriterModeSettings>
) {
  return {
    isHighlightCurrentLineEnabled:
      legacy.isHighlightCurrentLineEnabled ??
      DEFAULT_SETTINGS.currentLine.isHighlightCurrentLineEnabled,
    isFadeLinesEnabled:
      legacy.isFadeLinesEnabled ??
      DEFAULT_SETTINGS.currentLine.isFadeLinesEnabled,
    fadeLinesIntensity:
      legacy.fadeLinesIntensity ??
      DEFAULT_SETTINGS.currentLine.fadeLinesIntensity,
    isHighlightCurrentLineOnlyInFocusedEditorEnabled:
      legacy.isHighlightCurrentLineOnlyInFocusedEditorEnabled ??
      DEFAULT_SETTINGS.currentLine
        .isHighlightCurrentLineOnlyInFocusedEditorEnabled,
    isPauseCurrentLineHighlightWhileScrollingEnabled:
      DEFAULT_SETTINGS.currentLine
        .isPauseCurrentLineHighlightWhileScrollingEnabled,
    isPauseCurrentLineHighlightWhileSelectingEnabled:
      DEFAULT_SETTINGS.currentLine
        .isPauseCurrentLineHighlightWhileSelectingEnabled,
    currentLineHighlightStyle:
      legacy.currentLineHighlightStyle ??
      DEFAULT_SETTINGS.currentLine.currentLineHighlightStyle,
    currentLineHighlightUnderlineThickness:
      legacy.currentLineHighlightUnderlineThickness ??
      DEFAULT_SETTINGS.currentLine.currentLineHighlightUnderlineThickness,
    "currentLineHighlightColor-dark":
      legacy["currentLineHighlightColor-dark"] ??
      DEFAULT_SETTINGS.currentLine["currentLineHighlightColor-dark"],
    "currentLineHighlightColor-light":
      legacy["currentLineHighlightColor-light"] ??
      DEFAULT_SETTINGS.currentLine["currentLineHighlightColor-light"],
  };
}

function migrateWritingFocusSettings(
  legacy: Partial<LegacyTypewriterModeSettings>
) {
  return {
    doesWritingFocusShowHeader:
      legacy.doesWritingFocusShowHeader ??
      DEFAULT_SETTINGS.writingFocus.doesWritingFocusShowHeader,
    doesWritingFocusShowVignette:
      legacy.doesWritingFocusShowVignette ??
      DEFAULT_SETTINGS.writingFocus.doesWritingFocusShowVignette,
    doesWritingFocusShowStatusBar:
      legacy.doesWritingFocusShowStatusBar ??
      DEFAULT_SETTINGS.writingFocus.doesWritingFocusShowStatusBar,
    isWritingFocusFullscreen:
      legacy.isWritingFocusFullscreen ??
      DEFAULT_SETTINGS.writingFocus.isWritingFocusFullscreen,
    writingFocusVignetteStyle:
      legacy.writingFocusVignetteStyle ??
      DEFAULT_SETTINGS.writingFocus.writingFocusVignetteStyle,
    writingFocusFontSize:
      legacy.writingFocusFontSize ??
      DEFAULT_SETTINGS.writingFocus.writingFocusFontSize,
  };
}

function migrateHemingwaySettings(
  legacy: Partial<LegacyTypewriterModeSettings>
) {
  return {
    isHemingwayModeEnabled:
      legacy.isHemingwayModeEnabled ??
      DEFAULT_SETTINGS.hemingwayMode.isHemingwayModeEnabled,
    isAllowBackspaceInHemingwayModeEnabled:
      legacy.isAllowBackspaceInHemingwayModeEnabled ??
      DEFAULT_SETTINGS.hemingwayMode.isAllowBackspaceInHemingwayModeEnabled,
    isShowHemingwayModeStatusBarEnabled:
      legacy.isShowHemingwayModeStatusBarEnabled ??
      DEFAULT_SETTINGS.hemingwayMode.isShowHemingwayModeStatusBarEnabled,
    hemingwayModeStatusBarText:
      legacy.hemingwayModeStatusBarText ??
      DEFAULT_SETTINGS.hemingwayMode.hemingwayModeStatusBarText,
  };
}

function migrateSettings(
  legacy: Partial<LegacyTypewriterModeSettings>
): TypewriterModeSettings {
  return {
    general: migrateGeneralSettings(legacy),
    typewriter: migrateTypewriterSettings(legacy),
    keepLinesAboveAndBelow: {
      isKeepLinesAboveAndBelowEnabled:
        legacy.isKeepLinesAboveAndBelowEnabled ??
        DEFAULT_SETTINGS.keepLinesAboveAndBelow.isKeepLinesAboveAndBelowEnabled,
      linesAboveAndBelow:
        legacy.linesAboveAndBelow ??
        DEFAULT_SETTINGS.keepLinesAboveAndBelow.linesAboveAndBelow,
    },
    maxChars: {
      isMaxCharsPerLineEnabled:
        legacy.isMaxCharsPerLineEnabled ??
        DEFAULT_SETTINGS.maxChars.isMaxCharsPerLineEnabled,
      maxCharsPerLine:
        legacy.maxCharsPerLine ?? DEFAULT_SETTINGS.maxChars.maxCharsPerLine,
      isWarnLongLineEnabled: DEFAULT_SETTINGS.maxChars.isWarnLongLineEnabled,
      warnLongLineChars: DEFAULT_SETTINGS.maxChars.warnLongLineChars,
    },
    dimming: migrateDimmingSettings(legacy),
    currentLine: migrateCurrentLineSettings(legacy),
    writingFocus: migrateWritingFocusSettings(legacy),
    restoreCursorPosition: {
      isRestoreCursorPositionEnabled:
        legacy.isRestoreCursorPositionEnabled ??
        DEFAULT_SETTINGS.restoreCursorPosition.isRestoreCursorPositionEnabled,
      cursorPositions: {},
    },
    hemingwayMode: migrateHemingwaySettings(legacy),
    showWhitespace: { ...DEFAULT_SETTINGS.showWhitespace },
    outliner: { ...DEFAULT_SETTINGS.outliner },
  };
}

// Migration function to copy cursor positions from old file to settings
// Only needed when coming from pre-v1.2.0 (legacy flat format)
async function migrateCursorPositions(
  settings: TypewriterModeSettings,
  vault: Vault,
  manifestDir: string
): Promise<TypewriterModeSettings> {
  const oldFilePath = `${manifestDir}/cursor-positions.json`;

  try {
    if (await vault.adapter.exists(oldFilePath)) {
      const data = await vault.adapter.read(oldFilePath);
      const cursorPositions = JSON.parse(data);
      settings.restoreCursorPosition.cursorPositions = cursorPositions;
      console.debug(
        "Migrated cursor positions from cursor-positions.json to data.json"
      );
    }
  } catch (error) {
    console.error("Failed to migrate cursor positions:", error);
  }

  return settings;
}

// Apply all startup migrations in a single pass, version-gated via the general.version key.
// Cursor position migration (from cursor-positions.json) is only needed for pre-v1.2.0 data
// which is identified by the absence of the top-level "general" key.
export async function applyStartupMigrations(
  rawData:
    | Partial<LegacyTypewriterModeSettings>
    | Partial<TypewriterModeSettings>,
  vault: Vault,
  manifestDir: string
): Promise<TypewriterModeSettings> {
  const isLegacyFormat = !("general" in rawData);

  // Cursor positions migration only needed when coming from pre-v1.2.0 (legacy flat format).
  // Since v1.2.0 cursor positions are stored directly in data.json.
  if (isLegacyFormat) {
    const settings = migrateSettings(
      rawData as Partial<LegacyTypewriterModeSettings>
    );
    return await migrateCursorPositions(settings, vault, manifestDir);
  }

  // Deep-merge with defaults so new settings groups get their defaults
  // when existing users upgrade
  const settings = rawData as Partial<TypewriterModeSettings> & {
    zoom?: {
      isZoomEnabled?: boolean;
      isZoomOnClickEnabled?: boolean;
      isZoomBreadcrumbsEnabled?: boolean;
    };
  };

  // Migrate zoom → outliner (introduced when zoom was renamed to outliner)
  if ("zoom" in settings && !("outliner" in settings) && settings.zoom) {
    const z = settings.zoom;
    (settings as Record<string, unknown>).outliner = {
      isOutlinerEnabled:
        z.isZoomEnabled ?? DEFAULT_SETTINGS.outliner.isOutlinerEnabled,
      isOutlinerOnClickEnabled:
        z.isZoomOnClickEnabled ??
        DEFAULT_SETTINGS.outliner.isOutlinerOnClickEnabled,
      isOutlinerBreadcrumbsEnabled:
        z.isZoomBreadcrumbsEnabled ??
        DEFAULT_SETTINGS.outliner.isOutlinerBreadcrumbsEnabled,
    };
    (settings as Record<string, unknown>).zoom = undefined;
  }

  const merged: TypewriterModeSettings = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(DEFAULT_SETTINGS) as Array<
    keyof TypewriterModeSettings
  >) {
    if (settings[key] !== undefined) {
      // @ts-expect-error — merging category objects
      merged[key] = { ...DEFAULT_SETTINGS[key], ...settings[key] };
    }
  }
  return merged;
}

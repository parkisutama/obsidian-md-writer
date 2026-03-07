import type { Extension } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { Notice, type Plugin } from "obsidian";
import type { PerWindowProps } from "@/cm6/per-window-props";
import createTypewriterModeViewPlugin from "@/cm6/plugin";
import { createShowWhitespaceExtension } from "@/cm6/show-whitespace";
import { createWarnLongLineExtension } from "@/cm6/warn-long-line";
import { createZoomExtension } from "@/cm6/zoom";
import { hideBreadcrumbs, showBreadcrumbs } from "@/cm6/zoom/breadcrumb-panel";
import { calculateRangeForZooming } from "@/cm6/zoom/calculate-range";
import { dispatchZoomIn, dispatchZoomOut } from "@/cm6/zoom/zoom-utils";
import TypewriterModeSettingTab from "@/components/settings-tab";
import type { AbstractCommand } from "./capabilities/base/abstract-command";
import type { Feature } from "./capabilities/base/feature";
import { getCommands } from "./capabilities/commands";
import { getFeatures } from "./capabilities/features";
import type RestoreCursorPosition from "./capabilities/features/restore-cursor-position/restore-cursor-position";
import {
  applyStartupMigrations,
  DEFAULT_SETTINGS,
  type TypewriterModeSettings,
} from "./capabilities/settings";

export default class TypewriterModeLib {
  readonly plugin: Plugin;
  private readonly loadData: () => Promise<TypewriterModeSettings>;
  private readonly saveData: (
    settings: TypewriterModeSettings
  ) => Promise<void>;

  settings: TypewriterModeSettings = DEFAULT_SETTINGS;

  perWindowProps: PerWindowProps = {
    cssVariables: {},
    bodyClasses: [],
    bodyAttrs: {},
    allBodyClasses: [],
    persistentBodyClasses: [],
  };

  private editorExtensions: Extension[];

  readonly features: Record<string, Record<string, Feature>>;
  readonly commands: Record<string, AbstractCommand>;

  constructor(
    plugin: Plugin,
    loadData: () => Promise<TypewriterModeSettings>,
    saveData: (settings: TypewriterModeSettings) => Promise<void>
  ) {
    this.plugin = plugin;
    this.loadData = loadData;
    this.saveData = saveData;

    // Features must be loaded first!
    this.features = getFeatures(this);
    this.commands = getCommands(this);

    this.editorExtensions = [
      createTypewriterModeViewPlugin(this),
      createShowWhitespaceExtension(),
      createZoomExtension(this.settings.zoom),
      createWarnLongLineExtension(this),
    ];
  }

  async load() {
    await this.loadSettings();
    await this.saveSettings(); // if default settings were loaded

    this.loadPerWindowProps();
    this.loadEditorExtension();
  }

  loadPerWindowProps() {
    let allBodyClasses: string[] = [];
    for (const category of Object.values(this.features)) {
      for (const feature of Object.values(category)) {
        feature.load();
        console.debug(feature.settingKey, feature.getBodyClasses());
        allBodyClasses = allBodyClasses.concat(feature.getBodyClasses());
      }
    }
    console.debug("allBodyClasses", allBodyClasses);
    this.perWindowProps.allBodyClasses = allBodyClasses;
    for (const command of Object.values(this.commands)) {
      command.load();
    }
  }

  getRestoreCursorPositionFeature(): RestoreCursorPosition {
    return this.features.restoreCursorPosition[
      "restoreCursorPosition.isRestoreCursorPositionEnabled"
    ] as RestoreCursorPosition;
  }

  loadEditorExtension() {
    this.plugin.registerEditorExtension(this.editorExtensions);
  }

  loadSettingsTab() {
    this.plugin.addSettingTab(
      new TypewriterModeSettingTab(this.plugin.app, this)
    );
  }

  unload() {
    for (const category of Object.values(this.features)) {
      for (const feature of Object.values(category)) {
        feature.disable();
      }
    }
  }

  async loadSettings() {
    const manifestDir = this.plugin.manifest.dir;
    if (!manifestDir) {
      console.error(
        "Typewriter Mode: Unable to determine plugin manifest directory."
      );
      return;
    }

    const rawData = await this.loadData();
    this.settings = await applyStartupMigrations(
      rawData ?? {},
      this.plugin.app.vault,
      manifestDir
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.plugin.app.workspace.updateOptions();
  }

  setCSSVariable(property: string, value: string) {
    this.perWindowProps.cssVariables[property] = value;
  }

  reconfigureZoom() {
    this.editorExtensions[2] = createZoomExtension(this.settings.zoom);
    this.plugin.app.workspace.updateOptions();
  }

  zoomInAtCursor(view: EditorView) {
    const config = {
      foldHeading: true,
      foldIndent: true,
      ...(
        this.plugin.app.vault as unknown as {
          config: Record<string, unknown>;
        }
      ).config,
    };

    if (!(config.foldHeading && config.foldIndent)) {
      new Notice(
        'To use zoom, enable "Fold heading" and "Fold indent" in Settings → Editor'
      );
      return;
    }

    this.zoomToPosition(view, view.state.selection.main.head);
  }

  zoomToPosition(view: EditorView, pos: number) {
    const range = calculateRangeForZooming(view.state, pos);
    if (!range) {
      return;
    }

    dispatchZoomIn(view, range.from, range.to);

    if (this.settings.zoom.isZoomBreadcrumbsEnabled) {
      const navigateCallback = (v: EditorView, crumbPos: number | null) => {
        if (crumbPos === null) {
          this.zoomOut(v);
        } else {
          this.zoomToPosition(v, crumbPos);
        }
      };
      showBreadcrumbs(view, range.from, navigateCallback);
    }
  }

  zoomOut(view: EditorView) {
    hideBreadcrumbs(view);
    dispatchZoomOut(view);
  }
}

import { type App, Plugin, type PluginManifest } from "obsidian";
import type { TypewriterModeSettings } from "./capabilities/settings";
import TypewriterModeLib from "./lib";

export default class TypewriterModePlugin extends Plugin {
  private readonly tm: TypewriterModeLib;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.tm = new TypewriterModeLib(
      this,
      async () => await this.loadData(),
      async (settings: TypewriterModeSettings) => await this.saveData(settings)
    );
  }

  override async onload() {
    await this.tm.load();

    this.tm.loadSettingsTab();
  }
  override onunload() {
    this.tm.unload();
  }
}

import type { App } from "obsidian";
import {
  Component,
  MarkdownRenderer,
  PluginSettingTab,
  SettingGroup,
} from "obsidian";
import type TypewriterModeLib from "@/lib";
import fundingText from "@/texts/Funding.md" with { type: "text" };

interface TabDefinition {
  id: string;
  label: string;
  render: (container: HTMLElement) => void;
}

export default class TypewriterModeSettingTab extends PluginSettingTab {
  override icon = "type-outline";

  private tm: TypewriterModeLib;
  private activeTab = "general";

  constructor(app: App, tm: TypewriterModeLib) {
    super(app, tm.plugin);
    this.tm = tm;
  }

  private registerFeaturesInGroup(
    group: SettingGroup,
    features: Record<string, { registerSetting: (group: SettingGroup) => void }>
  ) {
    for (const feature of Object.values(features)) {
      feature.registerSetting(group);
    }
  }

  private getTabs(): TabDefinition[] {
    return [
      {
        id: "general",
        label: "General",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(group, this.tm.features.general);
        },
      },
      {
        id: "typewriter",
        label: "Typewriter",
        render: (container) => {
          const group = new SettingGroup(container);
          if (
            this.tm.settings.keepLinesAboveAndBelow
              .isKeepLinesAboveAndBelowEnabled
          ) {
            group.addSetting((setting) =>
              setting.setName(
                'Not available if "keep lines above and below" is activated'
              )
            );
          }
          this.registerFeaturesInGroup(group, this.tm.features.typewriter);
        },
      },
      {
        id: "keepLines",
        label: "Keep Lines",
        render: (container) => {
          const group = new SettingGroup(container);
          if (this.tm.settings.typewriter.isTypewriterScrollEnabled) {
            group.addSetting((setting) =>
              setting.setName(
                "Not available if typewriter scrolling is activated"
              )
            );
          }
          this.registerFeaturesInGroup(
            group,
            this.tm.features.keepAboveAndBelow
          );
        },
      },
      {
        id: "currentLine",
        label: "Current Line",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(group, this.tm.features.currentLine);
        },
      },
      {
        id: "maxChar",
        label: "Line Width",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(group, this.tm.features.maxChar);
        },
      },
      {
        id: "dimming",
        label: "Dimming",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(group, this.tm.features.dimming);
        },
      },
      {
        id: "writingFocus",
        label: "Writing Focus",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(group, this.tm.features.writingFocus);
        },
      },
      {
        id: "hemingway",
        label: "Hemingway",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(group, this.tm.features.hemingwayMode);
        },
      },
      {
        id: "whitespace",
        label: "Whitespace",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(group, this.tm.features.showWhitespace);
        },
      },
      {
        id: "zoom",
        label: "Zoom",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(group, this.tm.features.zoom);
        },
      },
      {
        id: "cursor",
        label: "Cursor",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(
            group,
            this.tm.features.restoreCursorPosition
          );
        },
      },
      {
        id: "about",
        label: "About",
        render: (container) => {
          const group = new SettingGroup(container);
          this.registerFeaturesInGroup(group, this.tm.features.updates);
          const fundingDiv = container.createDiv();
          MarkdownRenderer.render(
            this.app,
            fundingText,
            fundingDiv,
            this.app.vault.getRoot().path,
            new Component()
          );
        },
      },
    ];
  }

  display(): void {
    this.containerEl.empty();
    this.containerEl.addClass("tm-settings");

    const tabs = this.getTabs();

    const tabBar = this.containerEl.createDiv({ cls: "tm-settings-tab-bar" });
    const contentEl = this.containerEl.createDiv({
      cls: "tm-settings-content",
    });

    const renderTab = (tabId: string) => {
      this.activeTab = tabId;
      contentEl.empty();

      for (const btn of tabBar.querySelectorAll(".tm-settings-tab")) {
        btn.classList.toggle(
          "is-active",
          btn.getAttribute("data-tab-id") === tabId
        );
      }

      const tab = tabs.find((t) => t.id === tabId);
      if (tab) {
        tab.render(contentEl);
      }
    };

    for (const tab of tabs) {
      const tabBtn = tabBar.createDiv({
        cls: "tm-settings-tab",
        text: tab.label,
      });
      tabBtn.setAttribute("data-tab-id", tab.id);
      tabBtn.addEventListener("click", () => renderTab(tab.id));
    }

    const activeTabExists = tabs.some((t) => t.id === this.activeTab);
    renderTab(activeTabExists ? this.activeTab : tabs[0].id);
  }
}

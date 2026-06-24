// ADAPTED FROM https://github.com/ryanpcmcquen/obsidian-focus-mode

import { ItemView, Platform } from "obsidian";
import type TypewriterModeLib from "@/lib";

export class WritingFocus {
  private readonly tm: TypewriterModeLib;

  constructor(tm: TypewriterModeLib) {
    this.tm = tm;
  }

  private focusModeActive = false;

  private readonly maximizedClass = "ptm-maximized";
  private readonly focusModeClass = "ptm-focus-mode";
  private readonly hiddenWorkspaceSplitClass = "ptm-writing-focus-hidden-split";

  private leftSplitCollapsed = false;
  private rightSplitCollapsed = false;

  private prevWasFullscreen = false;

  private startFullscreen() {
    // Native electron fullscreen is not supported on mobile
    if (Platform.isMobile) {
      return;
    }

    const currentWindow = window.electron.remote.getCurrentWindow();
    this.prevWasFullscreen = currentWindow.isFullScreen();
    currentWindow.setFullScreen(true);

    const onLeaveFullScreen = () => {
      this.onExitFullscreenWritingFocus();
      currentWindow.off("leave-full-screen", onLeaveFullScreen);
    };

    currentWindow.on("leave-full-screen", onLeaveFullScreen);
  }

  private exitFullscreen() {
    // Native electron fullscreen is not supported on mobile
    if (Platform.isMobile) {
      return;
    }

    // Do not exit fullscreen if writing focus was started in fullscreen
    if (this.prevWasFullscreen) {
      return;
    }

    const currentWindow = window.electron.remote.getCurrentWindow();
    currentWindow.setFullScreen(false);
  }

  private onExitFullscreenWritingFocus() {
    if (this.focusModeActive) {
      this.disableFocusModeForView();
    }
  }

  private storeSplitsValues() {
    this.leftSplitCollapsed = this.tm.plugin.app.workspace.leftSplit.collapsed;
    this.rightSplitCollapsed =
      this.tm.plugin.app.workspace.rightSplit.collapsed;
  }

  private collapseSplits() {
    this.tm.plugin.app.workspace.leftSplit.collapse();
    this.tm.plugin.app.workspace.rightSplit.collapse();
  }

  private restoreSplits() {
    if (!this.leftSplitCollapsed) {
      this.tm.plugin.app.workspace.leftSplit.expand();
    }
    if (!this.rightSplitCollapsed) {
      this.tm.plugin.app.workspace.rightSplit.expand();
    }
  }

  private removeExtraneousClasses() {
    if (
      this.tm.plugin.app.workspace.containerEl.hasClass(this.maximizedClass)
    ) {
      this.tm.plugin.app.workspace.containerEl.removeClass(this.maximizedClass);
    }
    if (document.body.classList.contains(this.focusModeClass)) {
      document.body.classList.remove(this.focusModeClass);
    }
    this.resetWorkspaceSplitVisibility();
  }

  private updateWorkspaceSplitVisibility() {
    Array.from(
      document.querySelectorAll(`.${this.focusModeClass} .workspace-split`)
    ).forEach((node) => {
      const workspaceSplit = node as HTMLElement;
      const hasActiveKids = workspaceSplit.querySelector(".mod-active");
      workspaceSplit.classList.toggle(
        this.hiddenWorkspaceSplitClass,
        !hasActiveKids
      );
    });
  }

  private resetWorkspaceSplitVisibility() {
    Array.from(document.querySelectorAll(".workspace-split")).forEach(
      (node) => {
        node.classList.remove(this.hiddenWorkspaceSplitClass);
      }
    );
  }

  private enableFocusModeForView() {
    this.focusModeActive = true;

    if (!document.body.classList.contains(this.focusModeClass)) {
      this.storeSplitsValues();
    }

    this.collapseSplits();

    this.tm.plugin.app.workspace.containerEl.toggleClass(
      this.maximizedClass,
      !this.tm.plugin.app.workspace.containerEl.hasClass(this.maximizedClass)
    );

    document.body.classList.toggle(
      this.focusModeClass,
      !document.body.classList.contains(this.focusModeClass)
    );

    if (document.body.classList.contains(this.focusModeClass)) {
      this.updateWorkspaceSplitVisibility();
    }

    if (this.tm.settings.writingFocus.isWritingFocusFullscreen) {
      this.startFullscreen();
    }
  }

  private disableFocusModeForView() {
    this.removeExtraneousClasses();

    if (document.body.classList.contains(this.focusModeClass)) {
      document.body.classList.remove(this.focusModeClass);
    }

    this.restoreSplits();
    this.resetWorkspaceSplitVisibility();

    if (this.tm.settings.writingFocus.isWritingFocusFullscreen) {
      this.exitFullscreen();
    }

    this.focusModeActive = false;
  }

  enableFocusMode() {
    const view = this.tm.plugin.app.workspace.getActiveViewOfType(ItemView);
    if (!view || view?.getViewType() === "empty") {
      return;
    }
    this.enableFocusModeForView();
  }

  disableFocusMode() {
    const view = this.tm.plugin.app.workspace.getActiveViewOfType(ItemView);
    if (!view || view?.getViewType() === "empty") {
      return;
    }
    this.disableFocusModeForView();
  }

  toggleFocusMode() {
    this.focusModeActive ? this.disableFocusMode() : this.enableFocusMode();
  }
}

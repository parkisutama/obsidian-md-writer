# MD Writer

MD Writer is a specialized environment designed for high-precision drafting and structural focus. This version modifies the original Typewriter Mode to integrate advanced outliner capabilities and visual structural aids, creating a workflow optimized for both long-form prose and complex technical note-taking.

## Features

**Typewriter Scrolling**: The active line remains fixed at a specific vertical position on the screen. Alternatively, use *Keep Lines Above and Below* to always maintain a set number of context lines around the cursor.

**Outliner Zoom** (Logseq-style): Focus on specific list items and their children for deep thinking, inspired by Obsidian Zoom. Supports breadcrumb navigation and zoom-on-bullet-click.

**Show Whitespace**: Visualize spaces, tabs, trailing spaces, and two-space strict line breaks to maintain precise Markdown formatting.

**Hemingway Mode**: Write forwards only by disabling the ability to edit previous text. Optionally allow backspace and display a status bar indicator.

**Current Line Highlighting**: Visual emphasis on the active row with customizable styles (box, underline, background), colors, and fade intensity for surrounding lines.

**Focus Dimming**: Unfocused paragraphs or sentences are dimmed to reduce distraction. Supports paragraph and sentence granularity, with configurable opacity and pause-on-scroll/select.

**Line Width**: Limit the maximum number of characters per line to constrain the editor area for better readability. Separately, warn when a line exceeds a configurable character limit — useful for keeping lines short for clean Git diffs.

**Writing Focus**: Distraction-free fullscreen writing mode with optional vignette overlay, custom font size, and togglable header/status bar.

**Cursor Persistence**: Automatically restores your exact cursor position when reopening files.

## Installation

### Manual

1. Download the latest release of this modified plugin.
2. Extract the folder to your vault's plugins directory: `<vault>/.obsidian/plugins/obsidian-writer/`.
3. Force reload Obsidian (**Ctrl/Cmd+P** → "Reload app without saving").

---

## Modification Note

This version of the plugin is tailored for a specific workflow that is not available in the default [Typewriter Mode](https://github.com/davisriedel/obsidian-typewriter-mode). It combines the ergonomic benefits of typewriter scrolling with the structural control of whitespace visualization and the hierarchical focus of Logseq-style zooming.

## Acknowledgements

This plugin is a fork and modification of the original [Typewriter Mode](https://github.com/davisriedel/obsidian-typewriter-mode) by [Davis Riedel (davisriedel)](https://github.com/davisriedel), licensed under the MIT License. The build infrastructure is derived from [bun-obsidian-plugin-build-scripts](https://github.com/davisriedel/bun-obsidian-plugin-build-scripts), also by Davis Riedel and also MIT-licensed. The Rust-based tooling (Grass SCSS compiler, Just command runner, WASM build pipeline) from those original projects has been replaced with cross-platform Node.js/npm alternatives (sass, npm scripts) for Windows compatibility.

**Originally from Typewriter Mode:**

This plugin started as a fork of the incredible [Typewriter Scroll](https://github.com/deathau/cm-typewriter-scroll-obsidian) plugin by [deathau](https://github.com/deathau). It was turned into a separate plugin because many new features were added, breaking changes were introduced, and the code was completely restructured to make it more extensible.

The sentence highlighting was derived from [Focus Active Sentence](https://github.com/artisticat1/focus-active-sentence) by [artisticat1](https://github.com/artisticat1).

The writing focus was derived from [Obsidian Focus Mode](https://github.com/ryanpcmcquen/obsidian-focus-mode) by [ryanpcmcquen](https://github.com/ryanpcmcquen).

The restore cursor position feature was derived from [Remember Cursor Position](https://github.com/dy-sh/obsidian-remember-cursor-position) by [dy-sh](https://github.com/dy-sh).

The hemingway mode feature was derived from [Obsidian Hemingway Mode](https://github.com/jobedom/obsidian-hemingway-mode) by [jobedom](https://github.com/jobedom).

**Additional features in this modification:**

- [Show Whitespace](https://github.com/deathau/cm-show-whitespace-obsidian) by [deathau](https://github.com/deathau)
- [Obsidian Zoom](https://github.com/vslinko/obsidian-zoom) by [vslinko](https://github.com/vslinko)

Many thanks to the developers of these fantastic plugins. Please also consider supporting them.

## License

The plugin is licensed under the MIT license.

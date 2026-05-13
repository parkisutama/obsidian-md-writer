# MD Writer

MD Writer is a specialized Obsidian editor environment for high-precision drafting and structural focus. It combines typewriter scrolling, whitespace visualization, and outliner-centric navigation into a workflow for long-form prose and complex technical notes.

## Features

**Typewriter Scrolling**: The active line remains fixed at a specific vertical position on the screen. Alternatively, use *Keep Lines Above and Below* to always maintain a set number of context lines around the cursor.

**Outliner Zoom** (Logseq-style): Focus on specific headings or list items and their children for deep thinking, inspired by Obsidian Zoom. Designed to pair with the sidebar outline and zoom-on-bullet-click without adding an in-editor breadcrumb bar.

**Show Whitespace**: Visualize spaces, tabs, trailing spaces, and two-space strict line breaks to maintain precise Markdown formatting.

**Hemingway Mode**: Write forwards only by disabling the ability to edit previous text. Optionally allow backspace and display a status bar indicator.

**Current Line Highlighting**: Visual emphasis on the active row with customizable styles (box, underline, background), colors, and fade intensity for surrounding lines.

**Focus Dimming**: Unfocused paragraphs or sentences are dimmed to reduce distraction. Supports paragraph and sentence granularity, with configurable opacity and pause-on-scroll/select.

**Line Width**: Limit the maximum number of characters per line to constrain the editor area for better readability. Separately, warn when a line exceeds a configurable character limit — useful for keeping lines short for clean Git diffs.

**Writing Focus**: Distraction-free fullscreen writing mode with optional vignette overlay, custom font size, and togglable header/status bar.

**Cursor Persistence**: Automatically restores your exact cursor position when reopening files.

## Installation

### Manual installation

1. Download the latest release of MD Writer.
2. Extract the folder to your vault's plugins directory: `<vault>/.obsidian/plugins/md-writer/`.
3. Open the command palette and run `Reload app without saving`.

---

## Positioning

MD Writer follows a different product direction from the original [Typewriter Mode](https://github.com/davisriedel/obsidian-typewriter-mode). The codebase keeps the ergonomic foundation of typewriter scrolling while expanding into whitespace-aware editing and outliner-focused navigation.

## Acknowledgements

MD Writer descends from the original [Typewriter Mode](https://github.com/davisriedel/obsidian-typewriter-mode) by [Davis Riedel (davisriedel)](https://github.com/davisriedel), licensed under the MIT License. The build infrastructure was originally derived from [bun-obsidian-plugin-build-scripts](https://github.com/davisriedel/bun-obsidian-plugin-build-scripts), also by Davis Riedel and also MIT-licensed, and has since been migrated to a standard pnpm + esbuild toolchain.

**Inherited and adapted features:**

This plugin started as a fork of the incredible [Typewriter Scroll](https://github.com/deathau/cm-typewriter-scroll-obsidian) plugin by [deathau](https://github.com/deathau). It was turned into a separate plugin because many new features were added, breaking changes were introduced, and the code was completely restructured to make it more extensible.

The sentence highlighting was derived from [Focus Active Sentence](https://github.com/artisticat1/focus-active-sentence) by [artisticat1](https://github.com/artisticat1).

The writing focus was derived from [Obsidian Focus Mode](https://github.com/ryanpcmcquen/obsidian-focus-mode) by [ryanpcmcquen](https://github.com/ryanpcmcquen).

The restore cursor position feature was derived from [Remember Cursor Position](https://github.com/dy-sh/obsidian-remember-cursor-position) by [dy-sh](https://github.com/dy-sh).

The hemingway mode feature was derived from [Obsidian Hemingway Mode](https://github.com/jobedom/obsidian-hemingway-mode) by [jobedom](https://github.com/jobedom).

**Additional features in this modification:**

- [Show Whitespace](https://github.com/deathau/cm-show-whitespace-obsidian) by [deathau](https://github.com/deathau)
- [Obsidian Zoom](https://github.com/vslinko/obsidian-zoom) by [vslinko](https://github.com/vslinko)

Many thanks to the developers of these fantastic plugins. Please also consider supporting them.

## Privacy and network use

MD Writer stores its settings and cursor-position history in the plugin data file managed by Obsidian.

If update announcements are enabled, MD Writer sends a read-only request to the GitHub Releases API for this repository to fetch release notes after an update. The plugin does not send vault content or note text over the network.

## License

The plugin is licensed under the MIT license.

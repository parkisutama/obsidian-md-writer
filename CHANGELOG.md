# Changelog

## 1.0.1

### Added

- Add a normal writing mode preset and command coverage for writing mode changes.
- Add release workflow documentation for commit, push, QA, and GitHub release steps.
- Add Obsidian plugin audit documentation and release planning notes.

### Changed

- Improve the development watcher so source changes rebuild and redeploy during local development.
- Move pnpm build approvals to `pnpm-workspace.yaml` to match current pnpm configuration behavior.
- Simplify Writing Focus by removing the vignette styling path.

### Fixed

- Restore cursor positions per editor view instead of applying one shared position too broadly.
- Use the active Obsidian document or editor owner document for popout-window compatibility.

## 1.0.0

Initial release of MD Writer.

- Typewriter scrolling
- Whitespace visualization
- Outliner zoom focus
- Dimming / focus mode
- Hemingway mode
- Writing focus
- Cursor position restore
- Max characters per line

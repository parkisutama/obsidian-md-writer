# Development

**You are welcome to open issues and contribute to this project!**

## Prerequisites

1. Install `Bun`: <https://bun.sh/>

## Setup

1. Fork this repo and clone your fork
2. Install dependencies with `bun install`

## Building and Testing

1. Build and Setup Test Vault
   - Build with `bun run build`
   - Use `bun run dev` to build and update test vault in one step
   - Use `bun run debug` to enable `console.debug` statements _(all other commands strip these)_
   - Deploy to a custom Obsidian vault with `bun run deploy` _(requires a `.env` file with `OBSIDIAN_PLUGIN_DIR=<path>`)_

2. Test in Obsidian
   - Open the test vault in Obsidian
   - If the test vault is already opened, _force reload_ Obsidian to see changes

## Code Quality

| Command | Description |
| --------- | ------------- |
| `bun run check` | Run all checks (typecheck + lint + stylelint + markdownlint) |
| `bun run typecheck` | TypeScript type check |
| `bun run lint` | Biome lint & format (auto-fix) |
| `bun run lint:styles` | SCSS linting (auto-fix) |
| `bun run lint:md` | Markdown linting (auto-fix) |

A pre-commit hook via [Lefthook](https://github.com/evilmartians/lefthook) runs `bun run check` automatically.

## Releasing

- `bun run release` — Run all checks, then create a release (tag + GitHub release)
- `bun run ci` — CI build (used in GitHub Actions)

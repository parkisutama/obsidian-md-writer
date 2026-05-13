# Development

**You are welcome to open issues and contribute to this project!**

## Prerequisites

1. Install [Node.js](https://nodejs.org/) (v22+)
2. Install [pnpm](https://pnpm.io/): `npm install -g pnpm`

## Setup

1. Fork this repo and clone your fork
2. Install dependencies with `pnpm install`

## Building and Testing

1. Build and Setup Test Vault
   - Build with `pnpm run build`
   - Use `pnpm run dev` to build, update the test vault, and deploy to the
     configured Obsidian plugin folder in one step
   - Use `pnpm run debug` to enable `console.debug` statements _(all other commands strip these)_
   - Deploy the current `dist` output to a custom Obsidian vault with
     `pnpm run deploy` _(requires a `.env` file with
     `OBSIDIAN_VAULT_PLUGIN_PATH=<path>`)_

2. Test in Obsidian
   - Open the test vault in Obsidian
   - If the test vault is already opened, _force reload_ Obsidian to see changes

## Code Quality

| Command | Description |
| --------- | ------------- |
| `pnpm run check` | Run all checks (typecheck + lint + stylelint + markdownlint) |
| `pnpm run typecheck` | TypeScript type check |
| `pnpm run lint` | Biome lint & format (auto-fix) |
| `pnpm run lint:styles` | SCSS linting (auto-fix) |
| `pnpm run lint:md` | Markdown linting (auto-fix) |

A pre-commit hook via [Lefthook](https://github.com/evilmartians/lefthook) runs `pnpm run check` automatically.

## Releasing

- `pnpm run release` — Run all checks, then create a release (tag + GitHub release)
- `pnpm run ci` — CI build (used in GitHub Actions)

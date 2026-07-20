# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

Quartz v5 is a static site generator for digital gardens. It reads Markdown files and produces a full static site with SPA navigation, search, graph view, and more.

### Processing Pipeline

```
content/*.md → [parse] → [filter] → [emit] → public/
```

1. **Parse** (`quartz/processors/parse.ts`) — Two-phase: text→Markdown AST (via `remark-parse` + transformer plugins), then Markdown→HTML AST (via `remark-rehype` + transformer plugins). Supports parallel worker threads via `workerpool`.
2. **Filter** (`quartz/processors/filter.ts`) — Runs each file through all filter plugins, keeping only those where `shouldPublish` returns true.
3. **Emit** (`quartz/processors/emit.ts`) — Runs all emitter plugins in order: ComponentResources first (generates hashed CSS/JS), then PageTypeDispatcher (generates virtual pages), then all remaining emitters in parallel.

Incremental rebuilds in watch mode go through the same phases but reuse existing content in the `contentMap` and emit only changed files via `partialEmit`.

### Plugin System

Four plugin types, loaded from `quartz.config.yaml`:

- **Transformers** — Transform markdown and HTML ASTs (e.g., syntax highlighting, LaTeX, callouts). Provide `markdownPlugins(ctx)` and/or `htmlPlugins(ctx)` returning unified-compatible remark/rehype plugins, plus optional `textTransform(ctx, src)`.
- **Filters** — Control which pages get published. Provide `shouldPublish(ctx, content)`.
- **Emitters** — Write output files. Provide `emit(ctx, content, resources)` (async generator or Promise<FilePath[]>), and optionally `partialEmit()` for incremental rebuilds.
- **PageTypes** — Define page rendering for matched content. Provide `match({slug, fileData, cfg})`, `layout` (string keyed into per-page-type layout overrides), `body` (a Preact component constructor), optional `generate()` for virtual pages (tag pages, folder listings, etc.), optional `frame`, and optional `treeTransforms`.

Plugins are loaded by `quartz/plugins/loader/index.ts` — resolved from npm packages or git sources (`github:org/repo`), with manifests declaring name, version, category, and required Quartz version. The `quartz.plugins.json` / `quartz.config.yaml` file serves as both plugin manifest and configuration.

### Build System

- **CLI entry**: `quartz/bootstrap-cli.mjs` (Node >= 22 required)
- **Build**: `esbuild` compiles `quartz/build.ts` + all TS/TSX into a cached bundle at `.quartz-cache/transpiled-build.mjs`, then the built code is dynamically imported to execute the actual build.
- **Dev server**: `npx quartz build --serve` starts an HTTP server on port 8080 with WebSocket-based hot-reload on port 3001. Watches both content files (via chokidar in build.ts) and source code files (via chokidar in handlers.js for hard rebuilds on code changes).
- **Content directory**: `content/` by default, configured via `--directory`/`-d`.
- **Output directory**: `public/` by default, configured via `--output`/`-o`.

### Components & Layout

Components are **Preact** (not React), using `preact-render-to-string` for SSR.

- **Component types**: `QuartzComponent` is a function `(props: QuartzComponentProps) => any` with optional static props: `displayName`, `css`, `beforeDOMLoaded`, `afterDOMLoaded`.
- **Layout slots**: Each page type defines which components appear in which layout region — `head`, `header`, `beforeBody`, `pageBody`, `afterBody`, `left`, `right`, `footer`.
- **Frames**: Wrapper components (`DefaultFrame`, `FullWidthFrame`, `MinimalFrame`) that control the outer page structure (sidebar layout, content width). Configured via `frame` on page types or per-page-type layout overrides.
- **Component Registry** (`quartz/components/registry.ts`): Manages component registration, instantiation with caching, and option overrides from community plugins.
- **SPA**: Client-side navigation via `micromorph` (DOM diffing/patching) with inline scripts.
- **i18n**: 30+ locale files in `quartz/i18n/locales/`, UI translations throughout.

### Page Type Dispatcher

The `PageTypeDispatcher` emitter (`quartz/plugins/pageTypes/dispatcher.ts`) orchestrates all page type plugins in three phases:
1. Generate virtual pages (tag pages, folder pages, bases pages, 404 page)
2. Match and render regular pages against page types
3. Emit virtual pages

All virtual page data is available during transclusion resolution, enabling cross-page embeds.

### Configuration

Two configuration layers:
- **`quartz.config.yaml`** (or `quartz.config.default.yaml`, or legacy `quartz.plugins.json`) — Main configuration file. Contains `configuration:` (title, theme, analytics, locale, etc.) and `plugins:` (list of plugin sources with options). Loaded by `quartz/plugins/loader/config-loader.ts`.
- **`quartz.lock.json`** — Plugin lockfile pinning specific commit SHAs for git-sourced plugins.

### External Plugin Management

Community plugins are installed from GitHub repos via `quartz/plugins/loader/gitLoader.ts`:
- Installed to `.quartz/plugins/<name>/`
- Pinned by commit SHA in `quartz.lock.json`
- Can include components, layouts, and frames
- CLI commands: `npx quartz plugin add`, `remove`, `install`, `enable`, `disable`, `config`, `list`, `prune`
- TUI available via `npx quartz tui` (requires Bun runtime)

### Key Directories

| Path | Purpose |
|------|---------|
| `quartz/build.ts` | Main build orchestrator (file discovery, incremental rebuilds) |
| `quartz/bootstrap-cli.mjs` | CLI entry point (yargs-based command definitions) |
| `quartz/cli/handlers.js` | CLI command implementations (create, build, upgrade, sync) |
| `quartz/cli/plugin-git-handlers.js` | Plugin management CLI commands |
| `quartz/plugins/loader/` | Plugin resolution, git fetching, config loading |
| `quartz/plugins/pageTypes/` | Page type dispatcher and matchers |
| `quartz/plugins/emitters/` | Built-in emitters (ComponentResources, Assets, Static) |
| `quartz/components/` | Preact components (Head, Flex, Spacer, page layouts) |
| `quartz/components/pages/` | 404 page component |
| `quartz/components/frames/` | Page frame components (default, full-width, minimal) |
| `quartz/components/scripts/` | Client-side scripts (SPA router, popover, search) |
| `quartz/styles/` | SCSS files (base, callouts, syntax highlighting, variables, custom) |
| `quartz/processors/` | Processing pipeline (parse, filter, emit) |
| `quartz/util/` | Utilities (path, file trie, theme, resources, perf, logging) |
| `quartz/i18n/` | Internationalization (30+ locales) |
| `quartz/cfg.ts` | Type definitions for GlobalConfiguration and layout |
| `content/` | User's markdown content |

## Commands

```bash
# Build the site
npx quartz build

# Build with dev server and hot reload
npx quartz build --serve

# Build to a custom output directory
npx quartz build --output dist

# Build with verbose logging
npx quartz build -v

# Build with specific concurrency
npx quartz build --concurrency 4

# Initialize a new Quartz project
npx quartz create

# Sync content with git (commit, pull, push)
npx quartz sync

# Upgrade Quartz framework
npx quartz upgrade

# Plugin management
npx quartz plugin add github:org/repo    # Install a community plugin
npx quartz plugin remove <name>          # Remove a plugin
npx quartz plugin list                   # List installed plugins
npx quartz plugin install                # Install all plugins from lockfile
npx quartz plugin enable <name>          # Enable a plugin in config
npx quartz plugin disable <name>         # Disable a plugin in config

# Type-check and format check
npm run check

# Format code
npm run format

# Run tests (Node.js built-in test runner via tsx)
npm run test

# Run a single test file
npx tsx --test quartz/util/path.test.ts
```

## Tests

Tests use Node.js's built-in test runner with `tsx` as the loader:
- Test files are colocated as `*.test.ts`/`*.test.js` next to source files
- Run all: `npm run test`
- Run one: `npx tsx --test quartz/util/path.test.ts`
- Uses `node:test` and `node:assert` (no Jest/Vitest)
- Pattern: `import test, { describe, beforeEach, afterEach, mock } from "node:test"`

## Key Conventions

- TypeScript with strict mode, JSX via Preact (`jsxImportSource: "preact"`)
- File naming: `.inline.ts`/`.inline.js` for scripts inlined into HTML, `.scss` for styles
- All source code lives in `quartz/` — `content/` is user-owned markdown
- CLI handlers in plain JS (`.js`), core library code in TypeScript (`.ts`/`.tsx`)
- External plugin packages are imported via dynamic `import()` after git clone

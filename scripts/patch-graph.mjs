// Patch graph plugin: decodeURIComponent for Chinese URL slugs
// Runs after `npm install` / `npx quartz plugin install` to fix getFullSlugFromUrl
//
// Since the upstream v5 merge, plugins are installed from npm
// (@quartz-community/graph) instead of git clones under .quartz/plugins.
// This patch targets node_modules and verifies the installed npm version.
//
// SAFETY: This patch depends on the minified function name `we` which is
// specific to @quartz-community/graph@0.1.0. If the plugin is updated, the
// minified name will likely change and this patch will fail. The script
// enforces failure (exit code 1) when the pattern is not found in existing
// files, so the issue is caught at build time rather than silently skipped.

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const PLUGIN_PKG = "@quartz-community/graph"
const EXPECTED_VERSION = "0.1.0"

const targets = [
  "node_modules/@quartz-community/graph/dist/index.js",
  "node_modules/@quartz-community/graph/dist/components/index.js",
]

// Pattern: minified function that reads window.location.pathname for slug matching.
// The function name `we` is esbuild's minified output and is tied to the specific
// plugin version. If the pattern changes, update OLD and verify against the new
// plugin source.
const OLD = "function we(){let u=window.location.pathname"
const NEW = "function we(){let u=decodeURIComponent(window.location.pathname)"

// Also try a regex fallback for resilience against minor minification changes
const OLD_REGEX = /function\s+\w+\(\)\s*\{\s*let\s+\w+\s*=\s*window\.location\.pathname/

function checkVersion() {
  const pkgPath = resolve(root, "node_modules", PLUGIN_PKG, "package.json")
  if (!existsSync(pkgPath)) {
    console.warn(`[patch-graph] Warning: ${PLUGIN_PKG} not installed, skipping version check`)
    return
  }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
  if (pkg.version !== EXPECTED_VERSION) {
    console.warn(
      `[patch-graph] Warning: graph plugin version mismatch.` +
        `\n  Expected: ${EXPECTED_VERSION}` +
        `\n  Actual:   ${pkg.version}` +
        `\n  The minified function name may have changed. Verify patch compatibility.`,
    )
  }
}

let patched = 0
let failed = 0
let skipped = 0

checkVersion()

for (const rel of targets) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) {
    console.log(`[patch-graph] Skipping ${rel} - not found`)
    skipped++
    continue
  }
  let src = readFileSync(abs, "utf-8")
  if (src.includes(NEW)) {
    console.log(`[patch-graph] Already patched: ${rel}`)
    patched++
    continue
  }
  const count = src.split(OLD).length - 1
  if (count === 0) {
    // Try regex fallback for minor minification changes
    const regexMatch = src.match(OLD_REGEX)
    if (regexMatch) {
      const matched = regexMatch[0]
      const regexNew = matched.replace(
        "window.location.pathname",
        "decodeURIComponent(window.location.pathname)",
      )
      src = src.replaceAll(matched, regexNew)
      writeFileSync(abs, src, "utf-8")
      console.log(`[patch-graph] Patched via regex fallback: ${rel}`)
      patched++
      continue
    }

    // File exists but pattern not found - this is a failure
    console.error(
      `[patch-graph] ERROR: Pattern not found in ${rel}.` +
        `\n  The plugin may have been updated. Check the minified output and update the pattern.`,
    )
    failed++
    continue
  }
  src = src.replaceAll(OLD, NEW)
  writeFileSync(abs, src, "utf-8")
  console.log(`[patch-graph] Patched ${count} occurrence(s) in ${rel}`)
  patched++
}

if (failed > 0) {
  console.error(`[patch-graph] FAILED: ${failed} file(s) could not be patched.`)
  process.exit(1)
}

if (patched === 0 && skipped === targets.length) {
  console.log("[patch-graph] Nothing to patch (all targets missing).")
} else {
  console.log(`[patch-graph] Done. ${patched} file(s) updated, ${skipped} skipped.`)
}

// Patch search plugin: Chinese localization for "no results" text
// Runs after `npm install` / `npx quartz plugin install` to fix hardcoded English strings
//
// Since the upstream v5 merge, plugins are installed from npm
// (@quartz-community/search) instead of git clones under .quartz/plugins.
// This patch targets node_modules and verifies the installed npm version.
//
// SAFETY: This patch depends on exact string literals in the search plugin's
// compiled output. If the plugin is updated, the strings may change. The
// script enforces failure (exit code 1) when strings are not found in
// existing files.

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"

const root = resolve(import.meta.dirname, "..")

const PLUGIN_PKG = "@quartz-community/search"
const EXPECTED_MAJOR = 1

const targets = [
  "node_modules/@quartz-community/search/dist/components/index.js",
  "node_modules/@quartz-community/search/dist/index.js",
]

// Patterns to replace - both exact and regex fallback
const REPLACEMENTS = [
  { exact: '"No results."', regex: /"No results\."/, replacement: '"没有结果。"' },
  {
    exact: '"Try another search term?"',
    regex: /"Try another search term\?"/,
    replacement: '"请尝试其他搜索词。"',
  },
]

function checkVersion() {
  const pkgPath = resolve(root, "node_modules", PLUGIN_PKG, "package.json")
  if (!existsSync(pkgPath))
    throw new Error(`[patch-search] Required plugin is missing: ${PLUGIN_PKG}`)
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
  if (Number(pkg.version.split(".")[0]) !== EXPECTED_MAJOR)
    throw new Error(
      `[patch-search] Unsupported ${PLUGIN_PKG} version ${pkg.version}; expected major ${EXPECTED_MAJOR}`,
    )
}

let patched = 0
let failed = 0

checkVersion()

for (const rel of targets) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) {
    console.error(`[patch-search] ERROR: Required target is missing: ${rel}`)
    failed++
    continue
  }
  let src = readFileSync(abs, "utf-8")

  // Check if already patched
  if (src.includes("没有结果") && src.includes("请尝试其他搜索词。")) {
    console.log(`[patch-search] Already patched: ${rel}`)
    patched++
    continue
  }

  const before = src
  let changed = false

  for (const { exact, regex, replacement } of REPLACEMENTS) {
    if (src.includes(replacement)) {
      continue
    } else if (src.includes(exact)) {
      src = src.replaceAll(exact, replacement)
      changed = true
    } else {
      // Try regex fallback (e.g., for escaped quotes or minor variations)
      if (regex.test(src)) {
        src = src.replace(regex, replacement)
        changed = true
      }
    }
  }

  if (!changed && !(src.includes("没有结果") && src.includes("请尝试其他搜索词。"))) {
    // File exists but no patterns matched - this is a failure
    console.error(
      `[patch-search] ERROR: No matching strings found in ${rel}.` +
        `\n  Expected to find: ${REPLACEMENTS.map((r) => r.exact).join(", ")}` +
        `\n  The plugin may have been updated. Check the compiled output.`,
    )
    failed++
    continue
  }

  writeFileSync(abs, src, "utf-8")
  console.log(`[patch-search] Patched ${rel}`)
  patched++
}

if (failed > 0) {
  console.error(`[patch-search] FAILED: ${failed} file(s) could not be patched.`)
  process.exit(1)
}

if (patched === 0) {
  console.log("[patch-search] Nothing to patch.")
} else {
  console.log(`[patch-search] Done. ${patched} file(s) updated.`)
}

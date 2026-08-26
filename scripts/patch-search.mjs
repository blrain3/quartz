// Patch search plugin: Chinese localization for "no results" text
// Runs after `npx quartz plugin install` to fix hardcoded English strings
//
// SAFETY: This patch depends on exact string literals in the search plugin's
// compiled output at commit 0f4c1a2. If the plugin is updated, the strings
// may change. The script enforces failure (exit code 1) when strings are not
// found in existing files.

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"

const root = resolve(import.meta.dirname, "..")

const EXPECTED_COMMIT = "0f4c1a233cd03a0f562e13636b89b7708f8e2698"
const PLUGIN_NAME = "search"

const targets = [
  ".quartz/plugins/search/dist/components/index.js",
  ".quartz/plugins/search/dist/index.js",
]

// Patterns to replace - both exact and regex fallback
const REPLACEMENTS = [
  { exact: '"No results."', regex: /"No results\."/, replacement: '"没有结果。"' },
  { exact: '"Try another search term?"', regex: /"Try another search term\?"/, replacement: '"请尝试其他搜索词。"' },
]

function checkLockVersion() {
  const lockPath = resolve(root, "quartz.lock.json")
  if (!existsSync(lockPath)) {
    console.warn(`[patch-search] Warning: quartz.lock.json not found, skipping version check`)
    return
  }
  const lock = JSON.parse(readFileSync(lockPath, "utf-8"))
  const entry = lock.plugins?.[PLUGIN_NAME]
  if (!entry) {
    console.warn(`[patch-search] Warning: ${PLUGIN_NAME} not in lockfile, skipping version check`)
    return
  }
  if (entry.commit !== EXPECTED_COMMIT) {
    console.warn(
      `[patch-search] Warning: search plugin commit mismatch.` +
      `\n  Expected: ${EXPECTED_COMMIT}` +
      `\n  Actual:   ${entry.commit}` +
      `\n  The string literals may have changed. Verify patch compatibility.`,
    )
  }
}

let patched = 0
let failed = 0

checkLockVersion()

for (const rel of targets) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) {
    console.log(`[patch-search] Skipping ${rel} - not found`)
    continue
  }
  let src = readFileSync(abs, "utf-8")

  // Check if already patched
  if (src.includes("没有结果")) {
    console.log(`[patch-search] Already patched: ${rel}`)
    patched++
    continue
  }

  const before = src
  let changed = false

  for (const { exact, regex, replacement } of REPLACEMENTS) {
    if (src.includes(exact)) {
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

  if (!changed) {
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

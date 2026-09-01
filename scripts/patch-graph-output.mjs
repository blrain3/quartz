// Patch built postscript-*.js: wrap window.location.pathname in decodeURIComponent
// for the graph's getFullSlugFromUrl equivalent.
// Targets only the pattern: ;let p=window.location.pathname;return p.endsWith("/")
// which uniquely identifies the slug-from-URL function in postscript.js.
// This runs after `npx quartz build` via the `postbuild` npm script.
//
// Since the upstream v5 merge, the graph plugin comes from npm
// (@quartz-community/graph) instead of a git clone tracked in quartz.lock.json.
//
// SAFETY: This pattern is specific to @quartz-community/graph@0.1.0.
// If the plugin is updated, the minified output may change. The script will
// log a warning but will not fail the build (postscript is a build artifact
// and the graph plugin is currently disabled).

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs"
import { resolve } from "path"

const root = resolve(import.meta.dirname, "..")

const PLUGIN_PKG = "@quartz-community/graph"
const EXPECTED_VERSION = "0.1.0"

function checkVersion() {
  const pkgPath = resolve(root, "node_modules", PLUGIN_PKG, "package.json")
  if (!existsSync(pkgPath)) {
    console.warn(
      `[patch-graph-output] Warning: ${PLUGIN_PKG} not installed, skipping version check`,
    )
    return
  }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
  if (pkg.version !== EXPECTED_VERSION) {
    console.warn(
      `[patch-graph-output] Warning: graph plugin version mismatch.` +
        `\n  Expected: ${EXPECTED_VERSION}` +
        `\n  Actual:   ${pkg.version}` +
        `\n  The postscript pattern may have changed.`,
    )
  }
}

// Find the hashed postscript file
let postscript = null
const files = readdirSync(resolve(root, "public"))
for (const f of files) {
  if (f.startsWith("postscript-") && f.endsWith(".js")) {
    postscript = resolve(root, "public", f)
    break
  }
}

// Fallback: unhashed postscript.js (local dev build)
if (!postscript) {
  const fallback = resolve(root, "public", "postscript.js")
  try {
    readFileSync(fallback)
    postscript = fallback
  } catch {
    /* not found */
  }
}

if (!postscript) {
  console.log("[patch-graph-output] No postscript file found in public/. Skipping.")
  process.exit(0)
}

checkVersion()

let src = readFileSync(postscript, "utf-8")
let count = 0

// Replace only window.location.pathname;return p.endsWith("/")
// This is the signature of getFullSlugFromUrl (minified).
// Other location.pathname uses (SPA nav comparisons) are left untouched.
const OLD = 'window.location.pathname;return p.endsWith("/'
const NEW = 'decodeURIComponent(window.location.pathname);return p.endsWith("/'

// Regex fallback for minor minification changes
const OLD_REGEX = /window\.location\.pathname;return\s+\w+\.endsWith\("\/"/

if (src.includes(NEW)) {
  console.log(`[patch-graph-output] Already patched: ${postscript}`)
  process.exit(0)
}

let idx = src.indexOf(OLD)
while (idx !== -1) {
  count++
  src = src.slice(0, idx) + NEW + src.slice(idx + OLD.length)
  idx = src.indexOf(OLD)
}

// Try regex fallback if exact match found nothing
if (count === 0) {
  const regexMatch = src.match(OLD_REGEX)
  if (regexMatch) {
    const matched = regexMatch[0]
    const regexNew = matched.replace(
      "window.location.pathname",
      "decodeURIComponent(window.location.pathname)",
    )
    src = src.replace(matched, regexNew)
    count = 1
  }
}

writeFileSync(postscript, src, "utf-8")

if (count > 0) {
  console.log(`[patch-graph-output] Patched ${count} occurrence(s) in ${postscript}`)
} else {
  console.log(
    `[patch-graph-output] Pattern not found in ${postscript}. Already patched or graph code changed?`,
  )
}

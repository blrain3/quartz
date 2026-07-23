// 🩹 Patch built postscript-*.js: wrap window.location.pathname in decodeURIComponent
// for the graph's getFullSlugFromUrl equivalent.
// Targets only the pattern: ;let p=window.location.pathname;return p.endsWith("/")
// which uniquely identifies the slug-from-URL function in postscript.js.
// This runs after `npx quartz build` — the build is already done.

import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

const root = resolve(import.meta.dirname, "..")

// Find the hashed postscript file
let postscript = null
const { readdirSync } = await import("fs")
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
  try { readFileSync(fallback); postscript = fallback } catch { /* not found */ }
}

if (!postscript) {
  console.log("[patch-graph-output] No postscript file found in public/. Skipping.")
  process.exit(0)
}

let src = readFileSync(postscript, "utf-8")
let count = 0

// Replace only window.location.pathname;return p.endsWith("/")
// This is the signature of getFullSlugFromUrl (minified).
// Other location.pathname uses (SPA nav comparisons) are left untouched.
const OLD = "window.location.pathname;return p.endsWith(\"/"
const NEW = "decodeURIComponent(window.location.pathname);return p.endsWith(\"/"

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

writeFileSync(postscript, src, "utf-8")

if (count > 0) {
  console.log(`[patch-graph-output] ✅ Patched ${count} occurrence(s) in ${postscript}`)
} else {
  console.log(`[patch-graph-output] Pattern not found in ${postscript}. Already patched or graph code changed?`)
}

// 🩹 Patch graph plugin: decodeURIComponent for Chinese URL slugs
// Runs after `npx quartz plugin install` to fix getFullSlugFromUrl

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const targets = [
  ".quartz/plugins/graph/dist/index.js",
  ".quartz/plugins/graph/dist/components/index.js",
]

const OLD = "function we(){let u=window.location.pathname"
const NEW = "function we(){let u=decodeURIComponent(window.location.pathname)"

let patched = 0
for (const rel of targets) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) {
    console.log(`[patch-graph] Skipping ${rel} — not found`)
    continue
  }
  let src = readFileSync(abs, "utf-8")
  if (src.includes(NEW)) {
    console.log(`[patch-graph] Already patched: ${rel}`)
    continue
  }
  const count = src.split(OLD).length - 1
  if (count === 0) {
    console.log(`[patch-graph] No match in ${rel}, skipping`)
    continue
  }
  src = src.replaceAll(OLD, NEW)
  writeFileSync(abs, src, "utf-8")
  console.log(`[patch-graph] ✅ Patched ${count} occurrence(s) in ${rel}`)
  patched++
}

if (patched === 0) {
  console.log("[patch-graph] Nothing to patch.")
} else {
  console.log(`[patch-graph] Done. ${patched} file(s) updated.`)
}

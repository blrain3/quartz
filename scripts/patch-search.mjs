// 🩹 Patch search plugin: Chinese localization for "no results" text
// Runs after `npx quartz plugin install` to fix hardcoded English strings

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"

const root = resolve(import.meta.dirname, "..")

const targets = [
  ".quartz/plugins/search/dist/components/index.js",
  ".quartz/plugins/search/dist/index.js",
]

let patched = 0
for (const rel of targets) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) {
    console.log(`[patch-search] Skipping ${rel} — not found`)
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
  src = src.replaceAll('"No results."', '"没有结果。"')
  src = src.replaceAll('"Try another search term?"', '"请尝试其他搜索词。"')

  if (src === before) {
    console.log(`[patch-search] No matches in ${rel}, skipping`)
    continue
  }

  writeFileSync(abs, src, "utf-8")
  console.log(`[patch-search] ✅ Patched ${rel}`)
  patched++
}

if (patched === 0) {
  console.log("[patch-search] Nothing to patch.")
} else {
  console.log(`[patch-search] Done. ${patched} file(s) updated.`)
}

// 🩹 Patch footer component: set Chinese author text
// Targets both dist/index.js and dist/components/index.js

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"

const root = resolve(import.meta.dirname, "..")

const targets = [
  ".quartz/plugins/footer/dist/index.js",
  ".quartz/plugins/footer/dist/components/index.js",
]

let patched = 0
for (const rel of targets) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) {
    console.log(`[patch-footer] Skipping ${rel} — not found`)
    continue
  }
  let src = readFileSync(abs, "utf-8")

  // Case 1: Default plugin with i18n-based "Created with" + version + year + links
  const OLD_I18N = `i18n(cfg?.locale ?? "en-US").components.footer.createdWith`
  const NEW_TEXT = `"由 blrain 基于"`
  if (src.includes(OLD_I18N)) {
    src = src.replace(OLD_I18N, NEW_TEXT)
    writeFileSync(abs, src, "utf-8")
    console.log(`[patch-footer] ✅ Patched ${rel} (i18n → Chinese)`)
    patched++
    continue
  }

  // Case 2: Previously patched with "Created by blrain with "
  const OLD_TEXT1 = `"Created by blrain with "`
  if (src.includes(OLD_TEXT1)) {
    src = src.replace(OLD_TEXT1, `"由 blrain 基于 "`)
    writeFileSync(abs, src, "utf-8")
    console.log(`[patch-footer] ✅ Patched ${rel} ("Created by" → "由 blrain 基于 ")`)
    patched++
    continue
  }

  // Case 3: Previously patched with "create by blrain with "
  const OLD_TEXT2 = `"create by blrain with "`
  if (src.includes(OLD_TEXT2)) {
    src = src.replace(OLD_TEXT2, `"由 blrain 基于 "`)
    writeFileSync(abs, src, "utf-8")
    console.log(`[patch-footer] ✅ Patched ${rel} ("create by" → "由 blrain 基于 ")`)
    patched++
    continue
  }

  // Case 4: Already has the Chinese text
  if (src.includes(`"由 blrain 基于"`)) {
    console.log(`[patch-footer] Already up-to-date: ${rel}`)
    patched++
    continue
  }

  console.log(`[patch-footer] No matching pattern in ${rel} — skipping`)
}

if (patched === 0) {
  console.log("[patch-footer] Nothing to patch.")
} else {
  console.log(`[patch-footer] Done. ${patched} file(s) updated.`)
}

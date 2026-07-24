// 🩹 Patch footer component: set "blrain 2026" text
// Runs after `npm run install-plugins`

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"

const root = resolve(import.meta.dirname, "..")

const targets = [
  ".quartz/plugins/footer/dist/components/index.js",
  ".quartz/plugins/footer/dist/index.js",
]

const OLD_SNIPPETS = [
  // Image + Chinese text + Quartz link
  `"由 blrain 基于 "`,
  // Image + English text + Quartz link
  `"create by blrain with "`,
  `"Created by blrain with "`,
  `"Created by blrain with"`,
]

const NEW_FOOTER = `u2("footer", { class: \`\${displayClass ?? ""}\`, children: [
      /* @__PURE__ */ u2("p", { children: ["blrain 2026"] })
    ] })`

let patched = 0
for (const rel of targets) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) {
    console.log(`[patch-footer] Skipping ${rel} — not found`)
    continue
  }
  let src = readFileSync(abs, "utf-8")

  // Check if already patched
  if (src.includes('"blrain 2026"')) {
    console.log(`[patch-footer] Already up-to-date: ${rel}`)
    patched++
    continue
  }

  // Find the footer u2() block and replace it
  const idx = src.indexOf('u2("footer"')
  if (idx < 0) {
    console.log(`[patch-footer] No footer component in ${rel} — skipping`)
    continue
  }

  // Check if it contains any of our known patterns
  const hasKnownContent = OLD_SNIPPETS.some((s) => src.includes(s))
  if (!hasKnownContent && !src.includes("i18n(cfg")) {
    console.log(`[patch-footer] Unknown footer content in ${rel} — skipping`)
    continue
  }

  // Simple line-based approach: find the u2("footer" block and its matching closing ] })
  const before = src.slice(0, idx)
  const after = src.slice(idx)
  const endIdx = after.indexOf("] })")
  if (endIdx < 0) {
    console.log(`[patch-footer] Cannot find end of footer block in ${rel} — skipping`)
    continue
  }
  // Find the right closing ] }) - need to account for nested brackets
  let depth = 0
  let foundEnd = -1
  for (let i = 0; i < after.length; i++) {
    if (after[i] === "{" || after[i] === "[") depth++
    else if (after[i] === "}" || after[i] === "]") {
      depth--
      if (depth === 0 && after[i] === "]" && after[i + 1] === " " && after[i + 2] === "}") {
        foundEnd = i + 2 // include })
        break
      }
    }
  }
  if (foundEnd < 0) {
    console.log(`[patch-footer] Cannot find balanced end of footer block in ${rel} — skipping`)
    continue
  }

  const newSrc = before + NEW_FOOTER + after.slice(foundEnd + 1)
  writeFileSync(abs, newSrc, "utf-8")
  console.log(`[patch-footer] ✅ Patched ${rel}`)
  patched++
}

if (patched === 0) {
  console.log("[patch-footer] Nothing to patch.")
} else {
  console.log(`[patch-footer] Done. ${patched} file(s) updated.`)
}

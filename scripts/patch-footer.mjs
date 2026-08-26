// Patch footer component: set "blrain 2026" text
// Runs after `npm run install-plugins`
//
// SAFETY: This patch depends on the minified function name `u2` which is
// specific to the footer plugin at commit 6ed6192. If the plugin is updated,
// the minified name will likely change and this patch will fail. The script
// enforces failure (exit code 1) when the footer block is not found.

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"

const root = resolve(import.meta.dirname, "..")

const EXPECTED_COMMIT = "6ed61928d3c0178d7cef972ebcbca6a206a2f065"
const PLUGIN_NAME = "footer"

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
  // Previously patched variants
  `"blrain 2026"`,
  `"blrain \\\\xA9 ", year`,
  `"blrain \\xA9 ", year`,
  `blrain © ", year`,
]

const NEW_FOOTER = `u2("footer", { class: \`\${displayClass ?? ""}\`, children: [
      /* @__PURE__ */ u2("p", { children: ["blrain 2026"] })
    ] })`

// Regex fallback: match any minified function call for footer component
const FOOTER_REGEX = /\w+\("footer",\s*\{[^}]*class:[^}]*children:\s*\[/

function checkLockVersion() {
  const lockPath = resolve(root, "quartz.lock.json")
  if (!existsSync(lockPath)) {
    console.warn(`[patch-footer] Warning: quartz.lock.json not found, skipping version check`)
    return
  }
  const lock = JSON.parse(readFileSync(lockPath, "utf-8"))
  const entry = lock.plugins?.[PLUGIN_NAME]
  if (!entry) {
    console.warn(`[patch-footer] Warning: ${PLUGIN_NAME} not in lockfile, skipping version check`)
    return
  }
  if (entry.commit !== EXPECTED_COMMIT) {
    console.warn(
      `[patch-footer] Warning: footer plugin commit mismatch.` +
      `\n  Expected: ${EXPECTED_COMMIT}` +
      `\n  Actual:   ${entry.commit}` +
      `\n  The minified function name may have changed. Verify patch compatibility.`,
    )
  }
}

let patched = 0
let failed = 0

checkLockVersion()

for (const rel of targets) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) {
    console.log(`[patch-footer] Skipping ${rel} - not found`)
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
    // Try regex fallback for different minified function names
    const regexMatch = src.match(FOOTER_REGEX)
    if (regexMatch) {
      const matched = regexMatch[0]
      // Find the balanced end of this block
      const startIdx = src.indexOf(matched)
      const after = src.slice(startIdx)
      let depth = 0
      let foundEnd = -1
      for (let i = 0; i < after.length; i++) {
        if (after[i] === "{" || after[i] === "[") depth++
        else if (after[i] === "}" || after[i] === "]") {
          depth--
          if (depth === 0 && after[i] === "]" && after[i + 1] === " " && after[i + 2] === "}") {
            foundEnd = i + 2
            break
          }
        }
      }
      if (foundEnd >= 0) {
        const before = src.slice(0, startIdx)
        src = before + NEW_FOOTER + after.slice(foundEnd + 1)
        writeFileSync(abs, src, "utf-8")
        console.log(`[patch-footer] Patched via regex fallback: ${rel}`)
        patched++
        continue
      }
    }

    console.error(
      `[patch-footer] ERROR: No footer component in ${rel}.` +
      `\n  The plugin may have been updated. Check the minified output.`,
    )
    failed++
    continue
  }

  // Check if it contains any of our known patterns or blrain reference
  const hasKnownContent = OLD_SNIPPETS.some((s) => src.includes(s))
  const hasBlrainRef = src.includes("blrain")
  if (!hasKnownContent && !hasBlrainRef && !src.includes("i18n(cfg")) {
    console.error(
      `[patch-footer] ERROR: Unknown footer content in ${rel}.` +
      `\n  The plugin may have been updated. Check the minified output.`,
    )
    failed++
    continue
  }

  // Simple line-based approach: find the u2("footer" block and its matching closing ] })
  const before = src.slice(0, idx)
  const after = src.slice(idx)
  const endIdx = after.indexOf("] })")
  if (endIdx < 0) {
    console.error(`[patch-footer] ERROR: Cannot find end of footer block in ${rel}.`)
    failed++
    continue
  }
  // Find the right closing ] }) - need to account for nested brackets
  // The footer block looks like: u2("footer", { ... children: [ ... ] })
  // Track depth of {/[ vs }/]. When depth returns to 0, we've closed the outer }.
  let depth = 0
  let foundEnd = -1
  for (let i = 0; i < after.length; i++) {
    if (after[i] === "{" || after[i] === "[") depth++
    else if (after[i] === "}" || after[i] === "]") {
      depth--
      // When depth reaches 0, we've closed the outermost } of the u2() call
      if (depth === 0) {
        foundEnd = i // include the closing } (or ])
        // Check if followed by ) to include the closing paren of u2()
        if (after[i + 1] === ")") {
          foundEnd = i + 1
        }
        break
      }
    }
  }
  if (foundEnd < 0) {
    console.error(`[patch-footer] ERROR: Cannot find balanced end of footer block in ${rel}.`)
    failed++
    continue
  }

  const newSrc = before + NEW_FOOTER + after.slice(foundEnd + 1)
  writeFileSync(abs, newSrc, "utf-8")
  console.log(`[patch-footer] Patched ${rel}`)
  patched++
}

if (failed > 0) {
  console.error(`[patch-footer] FAILED: ${failed} file(s) could not be patched.`)
  process.exit(1)
}

if (patched === 0) {
  console.log("[patch-footer] Nothing to patch.")
} else {
  console.log(`[patch-footer] Done. ${patched} file(s) updated.`)
}

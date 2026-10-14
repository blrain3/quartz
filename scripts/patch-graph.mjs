// Patch only Graph 1.0.0's native outer resolver; keep the inner reader unchanged.
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { parse } from "yaml"
import {
  graphRuntimeFunction,
  nativeGraphPathFunction,
  legacyGraphPathFunction,
} from "./graph-path.mjs"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const plugin = "@quartz-community/graph"
const config = parse(readFileSync(resolve(root, "quartz.config.yaml"), "utf8"))
if (!config.plugins?.some((p) => p.source === plugin && p.enabled !== false)) {
  console.log(`[patch-graph] ${plugin} disabled; skipping.`)
  process.exit(0)
}
const pkgPath = resolve(root, "node_modules", plugin, "package.json")
if (!existsSync(pkgPath)) throw new Error(`[patch-graph] Required package missing: ${pkgPath}`)
const version = JSON.parse(readFileSync(pkgPath, "utf8")).version
if (version !== "1.0.0") throw new Error(`[patch-graph] Expected ${plugin}@1.0.0, found ${version}`)
const targets = ["dist/index.js", "dist/components/index.js"].map((p) =>
  resolve(root, "node_modules", plugin, p),
)
const originalOuter = /function u\(\)\{var o=we\(\),a=Hu\(\);return[^{}]*,o\}/g
const count = (src, literal) => src.split(literal).length - 1
const changes = []
for (const file of targets) {
  if (!existsSync(file)) throw new Error(`[patch-graph] Required target missing: ${file}`)
  const original = readFileSync(file, "utf8")
  let src = original
  const legacyCount = count(src, legacyGraphPathFunction)
  if (legacyCount > 1) throw new Error(`[patch-graph] Ambiguous legacy resolver: ${file}`)
  if (legacyCount === 1) src = src.replace(legacyGraphPathFunction, nativeGraphPathFunction)
  if (count(src, nativeGraphPathFunction) !== 1)
    throw new Error(`[patch-graph] Required native pathname reader not found exactly once: ${file}`)
  const patchedCount = count(src, graphRuntimeFunction)
  const matches = [...src.matchAll(originalOuter)]
  if (patchedCount === 1 && matches.length === 0) {
    changes.push({ file, original, src })
    continue
  }
  if (patchedCount !== 0 || matches.length !== 1)
    throw new Error(`[patch-graph] Expected one native outer resolver: ${file}`)
  src = src.replace(originalOuter, graphRuntimeFunction)
  changes.push({ file, original, src })
}
// Validate both targets before writing either, including partial-match failures.
for (const { file, original, src } of changes) {
  if (src !== original) writeFileSync(file, src, "utf8")
  console.log(`[patch-graph] Verified single-layer resolver: ${file}`)
}

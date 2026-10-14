// Validate the Graph module emitted by the full v5 build lifecycle.
// The prebuild patch owns normalization; do not rewrite content-hashed output.
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { resolve, dirname, relative, isAbsolute } from "node:path"
import { parse } from "yaml"
import { graphRuntimeFunction, nativeGraphPathFunction } from "./graph-path.mjs"

const root = resolve(import.meta.dirname, "..")
const plugin = "@quartz-community/graph"
const config = parse(readFileSync(resolve(root, "quartz.config.yaml"), "utf8"))
if (!config.plugins?.some((p) => p.source === plugin && p.enabled !== false)) {
  console.log(`[patch-graph-output] ${plugin} disabled; skipping.`)
  process.exit(0)
}
const publicDir = resolve(root, "public")
if (!existsSync(publicDir)) throw new Error("[patch-graph-output] public/ is missing")
const entries = readdirSync(publicDir).filter((f) => /^postscript(?:-.*)?\.js$/.test(f))
if (entries.length !== 1)
  throw new Error(`[patch-graph-output] Expected one postscript entry; found ${entries.length}`)

const seen = new Set()
const graphModules = []
function inspect(file) {
  const rel = relative(publicDir, file)
  if (rel.startsWith("..") || isAbsolute(rel))
    throw new Error(`[patch-graph-output] Import escapes public/: ${file}`)
  if (seen.has(file)) return
  seen.add(file)
  const src = readFileSync(file, "utf8")
  if (src.includes("global-graph-icon")) graphModules.push({ file, src })
  for (const match of src.matchAll(/import\(\s*["'](\.\.?\/[^"']+)["']\s*\)/g))
    inspect(resolve(dirname(file), match[1]))
}
inspect(resolve(publicDir, entries[0]))
if (graphModules.length !== 1)
  throw new Error(
    `[patch-graph-output] Expected one reachable Graph module; found ${graphModules.length}`,
  )
const { file, src } = graphModules[0]
if (
  src.split(graphRuntimeFunction).length - 1 !== 1 ||
  src.split(nativeGraphPathFunction).length - 1 !== 1
)
  throw new Error(
    `[patch-graph-output] Graph module lacks the exact normalized slug resolver: ${file}`,
  )
console.log(`[patch-graph-output] Verified reachable, base-path-aware Graph module: ${file}`)

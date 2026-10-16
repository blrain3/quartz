import fs from "node:fs"
import { pathToFileURL } from "node:url"

// Inspect resolved versions, not PR titles or permissive manifest ranges.
export function majorChanges(before, after) {
  if (!before.packages || !after.packages) throw new Error("Expected npm package-lock packages")
  const changes = []
  for (const [name, pkg] of Object.entries(after.packages)) {
    if (!name || !before.packages[name]) continue
    const old = before.packages[name].version
    if (old === pkg.version) continue
    const a = /^(\d+)\.\d+\.\d+(?:[-+].*)?$/.exec(old ?? "")
    const b = /^(\d+)\.\d+\.\d+(?:[-+].*)?$/.exec(pkg.version ?? "")
    if (!a || !b) throw new Error(`Cannot classify changed version for ${name}`)
    if (a[1] !== b[1]) changes.push({ name, before: old, after: pkg.version })
  }
  return changes
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [before, after] = process.argv.slice(2)
  if (!before || !after) throw new Error("Usage: check-lockfile-majors.mjs BEFORE AFTER")
  const changes = majorChanges(
    JSON.parse(fs.readFileSync(before)),
    JSON.parse(fs.readFileSync(after)),
  )
  console.log(JSON.stringify(changes, null, 2))
  if (changes.length) process.exitCode = 1
}

import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

// Inspect resolved versions, not PR titles or permissive manifest ranges.
export function majorChanges(before, after) {
  if (!before.packages || !after.packages) throw new Error("Expected npm package-lock packages")
  const changes = []
  const identity = (name, pkg) => pkg.name ?? name.split("node_modules/").at(-1)
  const oldByIdentity = new Map()
  for (const [name, pkg] of Object.entries(before.packages)) {
    if (!name) continue
    const id = identity(name, pkg)
    oldByIdentity.set(id, [...(oldByIdentity.get(id) ?? []), pkg.version])
  }
  const major = (version, name) => {
    const match = /^(\d+)\.\d+\.\d+(?:[-+].*)?$/.exec(version ?? "")
    if (!match) throw new Error(`Cannot classify changed version for ${name}`)
    return match[1]
  }
  for (const [name, pkg] of Object.entries(after.packages)) {
    if (!name) continue
    const id = identity(name, pkg)
    const previous = before.packages[name]
    const sameIdentity = previous && identity(name, previous) === id
    const versions = sameIdentity ? [previous.version] : oldByIdentity.get(id)
    if (!versions || versions.every((v) => v === pkg.version)) continue
    const target = major(pkg.version, name)
    // An unrelated installed major must not mask a consumer upgrade after hoisting.
    // Reject ambiguous relocations conservatively rather than guessing consumers.
    if (versions.some((v) => major(v, name) !== target)) {
      changes.push({ name, before: versions.join(", "), after: pkg.version })
    }
  }
  // Removed nested copies can expose an unchanged ancestor with a different major.
  for (const [name, pkg] of Object.entries(before.packages)) {
    if (!name || after.packages[name]) continue
    const installedName = name.split("node_modules/").at(-1)
    let dir = name.slice(0, name.lastIndexOf("node_modules/")).replace(/\/$/, "")
    for (;;) {
      const replacement = (dir ? `${dir}/` : "") + `node_modules/${installedName}`
      const next = after.packages[replacement]
      if (next) {
        if (changes.some((change) => change.name === replacement)) break
        if (
          identity(replacement, next) === identity(name, pkg) &&
          next.version !== pkg.version &&
          major(next.version, replacement) !== major(pkg.version, name)
        ) {
          changes.push({ name, before: pkg.version, after: next.version, replacement })
        }
        break
      }
      if (!dir) break
      const parent = path.posix.dirname(dir)
      dir = parent === "." ? "" : parent
    }
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

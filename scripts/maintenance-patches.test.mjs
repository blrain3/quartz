import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, resolve } from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import test from "node:test"

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const node = process.execPath

function fixture(scriptName, packages) {
  const root = mkdtempSync(resolve(tmpdir(), "quartz-patch-test-"))
  mkdirSync(resolve(root, "scripts"), { recursive: true })
  writeFileSync(resolve(root, "scripts", scriptName), readFileSync(resolve(scriptsDir, scriptName)))
  for (const [relativePath, value] of Object.entries(packages)) {
    const target = resolve(root, "node_modules", relativePath)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, value)
  }
  return root
}

function run(root, scriptName) {
  return spawnSync(node, [resolve(root, "scripts", scriptName)], { encoding: "utf8" })
}

test("search patch changes both Chinese strings, reruns cleanly, and rejects missing targets", () => {
  const original = '"No results." "Try another search term?"'
  const packages = {
    "@quartz-community/search/package.json": JSON.stringify({ version: "1.0.0" }),
    "@quartz-community/search/dist/index.js": original,
    "@quartz-community/search/dist/components/index.js": original,
  }
  const root = fixture("patch-search.mjs", packages)
  try {
    assert.equal(run(root, "patch-search.mjs").status, 0)
    for (const file of ["dist/index.js", "dist/components/index.js"]) {
      const output = readFileSync(
        resolve(root, "node_modules/@quartz-community/search", file),
        "utf8",
      )
      assert.match(output, /没有结果。/)
      assert.match(output, /请尝试其他搜索词。/)
    }
    assert.equal(run(root, "patch-search.mjs").status, 0)
    rmSync(resolve(root, "node_modules/@quartz-community/search/dist/components/index.js"))
    assert.notEqual(run(root, "patch-search.mjs").status, 0)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("folder-page removes tags, reruns cleanly, and rejects mismatched source", () => {
  const root = fixture("patch-folder-tags.mjs", {
    "@quartz-community/folder-page/package.json": JSON.stringify({ version: "1.0.0" }),
    "@quartz-community/folder-page/dist/index.js": "const tags = page.frontmatter?.tags ?? [];",
  })
  try {
    assert.equal(run(root, "patch-folder-tags.mjs").status, 0)
    assert.match(
      readFileSync(
        resolve(root, "node_modules/@quartz-community/folder-page/dist/index.js"),
        "utf8",
      ),
      /const tags = \[\];/,
    )
    assert.equal(run(root, "patch-folder-tags.mjs").status, 0)
    writeFileSync(
      resolve(root, "node_modules/@quartz-community/folder-page/dist/index.js"),
      "const tags = page.tags;",
    )
    assert.notEqual(run(root, "patch-folder-tags.mjs").status, 0)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

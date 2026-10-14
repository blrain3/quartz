import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, resolve } from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import test from "node:test"
import {
  graphPathToSlug,
  graphRuntimeFunction,
  nativeGraphPathFunction,
  legacyGraphPathFunction,
} from "./graph-path.mjs"
import { runInNewContext } from "node:vm"

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const node = process.execPath

function fixture(scriptName, packages) {
  const root = mkdtempSync(resolve(tmpdir(), "quartz-patch-test-"))
  mkdirSync(resolve(root, "scripts"), { recursive: true })
  mkdirSync(resolve(root, "node_modules"), { recursive: true })
  symlinkSync(
    resolve(scriptsDir, "../node_modules/yaml"),
    resolve(root, "node_modules/yaml"),
    "dir",
  )
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

test("search patch rejects a partial translation without writing it", () => {
  const partial = '"No results." 已翻译但缺少第二句'
  const root = fixture("patch-search.mjs", {
    "@quartz-community/search/package.json": JSON.stringify({ version: "1.0.0" }),
    "@quartz-community/search/dist/index.js": partial,
    "@quartz-community/search/dist/components/index.js": partial,
  })
  try {
    assert.notEqual(run(root, "patch-search.mjs").status, 0)
    for (const file of ["dist/index.js", "dist/components/index.js"]) {
      assert.equal(
        readFileSync(resolve(root, "node_modules/@quartz-community/search", file), "utf8"),
        partial,
      )
    }
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

test("404 home link stays at root or follows a normalized project base path", () => {
  const root = fixture("patch-404-home.mjs", {})
  const outputPath = resolve(root, "public", "404.html")
  mkdirSync(dirname(outputPath), { recursive: true })
  const original = '<a href="/">返回首页</a>'
  try {
    writeFileSync(outputPath, original)
    assert.equal(run(root, "patch-404-home.mjs").status, 0)
    assert.equal(readFileSync(outputPath, "utf8"), original)

    assert.equal(
      spawnSync(node, [resolve(root, "scripts", "patch-404-home.mjs")], {
        encoding: "utf8",
        env: { ...process.env, QUARTZ_BASE_PATH: "/quartz" },
      }).status,
      0,
    )
    assert.equal(readFileSync(outputPath, "utf8"), '<a href="/quartz/">返回首页</a>')

    assert.equal(
      spawnSync(node, [resolve(root, "scripts", "patch-404-home.mjs")], {
        encoding: "utf8",
        env: { ...process.env, QUARTZ_BASE_PATH: "/quartz/" },
      }).status,
      0,
    )
    assert.equal(readFileSync(outputPath, "utf8"), '<a href="/quartz/">返回首页</a>')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("404 home patch rejects missing or unmatched output", () => {
  const root = fixture("patch-404-home.mjs", {})
  const outputPath = resolve(root, "public", "404.html")
  mkdirSync(dirname(outputPath), { recursive: true })
  try {
    assert.notEqual(run(root, "patch-404-home.mjs").status, 0)
    writeFileSync(outputPath, '<a href="/">Home</a>')
    assert.notEqual(run(root, "patch-404-home.mjs").status, 0)
    writeFileSync(outputPath, '<a href="/">返回首页</a><a href="/">返回首页</a>')
    assert.notEqual(run(root, "patch-404-home.mjs").status, 0)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("graph pathname normalization matches Chinese nodes at root and under a base path", () => {
  assert.equal(
    graphPathToSlug("/%E6%8A%80%E6%9C%AF/%E7%BD%91%E7%AB%99/%E4%B8%AD%E6%96%87%20URL", "/"),
    "技术/网站/中文 URL",
  )
  assert.equal(
    graphPathToSlug("/quartz/%E6%8A%80%E6%9C%AF/%E7%BD%91%E7%AB%99", "/quartz/"),
    "技术/网站",
  )
  assert.equal(graphPathToSlug("/quartz", "/quartz/"), "")
  assert.equal(graphPathToSlug("/quartzier/a", "/quartz/"), "quartzier/a")
})

function graphOutputFixture() {
  const root = fixture("patch-graph-output.mjs", {})
  writeFileSync(
    resolve(root, "scripts/graph-path.mjs"),
    readFileSync(resolve(scriptsDir, "graph-path.mjs")),
  )
  writeFileSync(
    resolve(root, "quartz.config.yaml"),
    'plugins:\n  - source: "@quartz-community/graph"\n    enabled: true\n',
  )
  mkdirSync(resolve(root, "public/static/scripts"), { recursive: true })
  return root
}

test("graph output verifies the reachable split module without changing hashed assets", () => {
  const root = graphOutputFixture()
  const entry = resolve(root, "public/postscript-test.js")
  const graph = resolve(root, "public/static/scripts/graph-test.js")
  const loader = 'await import("./static/scripts/graph-test.js")'
  const script = `${nativeGraphPathFunction};${graphRuntimeFunction};document.querySelector(".global-graph-icon")`
  try {
    writeFileSync(entry, loader)
    writeFileSync(graph, script)
    // Unreferenced files cannot stand in for the module actually loaded.
    writeFileSync(resolve(root, "public/static/scripts/orphan.js"), "global-graph-icon")
    assert.equal(run(root, "patch-graph-output.mjs").status, 0)
    assert.equal(run(root, "patch-graph-output.mjs").status, 0)
    assert.equal(readFileSync(entry, "utf8"), loader)
    assert.equal(readFileSync(graph, "utf8"), script)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("graph output rejects missing, unreachable, unpatched and ambiguous modules", () => {
  const root = graphOutputFixture()
  const entry = resolve(root, "public/postscript-test.js")
  const graph = resolve(root, "public/static/scripts/graph-test.js")
  try {
    assert.notEqual(run(root, "patch-graph-output.mjs").status, 0)
    writeFileSync(entry, "unrelated()")
    writeFileSync(
      graph,
      `${nativeGraphPathFunction};${graphRuntimeFunction};document.querySelector('.global-graph-icon')`,
    )
    assert.notEqual(run(root, "patch-graph-output.mjs").status, 0)
    writeFileSync(entry, 'await import("./static/scripts/missing.js")')
    assert.notEqual(run(root, "patch-graph-output.mjs").status, 0)
    writeFileSync(entry, 'await import("./static/scripts/graph-test.js")')
    const unpatched =
      'function we(){let u=decodeURI(window.location.pathname);return u.endsWith("/")&&(u=u.slice(0,-1)),u.startsWith("/")&&(u=u.slice(1)),u}'
    writeFileSync(
      graph,
      `${unpatched};document.querySelector('.global-graph-icon');function unrelated(){return document.body.dataset.basepath||"/"}`,
    )
    assert.notEqual(run(root, "patch-graph-output.mjs").status, 0)
    writeFileSync(
      graph,
      `${nativeGraphPathFunction};${graphRuntimeFunction};document.querySelector('.global-graph-icon')`,
    )
    writeFileSync(
      resolve(root, "public/static/scripts/second.js"),
      `${nativeGraphPathFunction};${graphRuntimeFunction};document.querySelector('.global-graph-icon')`,
    )
    writeFileSync(
      entry,
      'await import("./static/scripts/graph-test.js");await import("./static/scripts/second.js")',
    )
    assert.notEqual(run(root, "patch-graph-output.mjs").status, 0)
    writeFileSync(entry, 'await import("../../outside.js")')
    assert.notEqual(run(root, "patch-graph-output.mjs").status, 0)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
const nativeOuter = String.raw`function u(){var o=we(),a=Hu();return a&&o.startsWith(a.replace(/^\//,""))&&(o=o.slice(a.replace(/^\//,"").length),o.startsWith("/")&&(o=o.slice(1))),o}`

function runtimeSlug(source, pathname, basepath) {
  return runInNewContext(source + ";u()", {
    window: { location: { pathname } },
    document: { body: { dataset: { basepath } }, querySelector: () => null },
  })
}

function graphPackageFixture(source) {
  const root = fixture("patch-graph.mjs", {
    "@quartz-community/graph/package.json": JSON.stringify({ version: "1.0.0" }),
    "@quartz-community/graph/dist/index.js": source,
    "@quartz-community/graph/dist/components/index.js": source,
  })
  writeFileSync(
    resolve(root, "scripts/graph-path.mjs"),
    readFileSync(resolve(scriptsDir, "graph-path.mjs")),
  )
  writeFileSync(
    resolve(root, "quartz.config.yaml"),
    'plugins:\n  - source: "@quartz-community/graph"\n    enabled: true\n',
  )
  return root
}

test("Graph runtime removes the base once, including slugs that begin with the repository name", () => {
  const hu = "function Hu(){return document.body.dataset.basepath}"
  const previous = `${legacyGraphPathFunction};${hu};${nativeOuter}`
  assert.equal(runtimeSlug(previous, "/quartz/quartz/a", "/quartz"), "a")
  assert.equal(runtimeSlug(previous, "/quartz/quartzier/a", "/quartz"), "ier/a")
  const root = graphPackageFixture(previous + ';document.querySelector(".global-graph-icon")')
  try {
    assert.equal(run(root, "patch-graph.mjs").status, 0)
    const file = resolve(root, "node_modules/@quartz-community/graph/dist/index.js")
    const actual = readFileSync(file, "utf8")
    for (const [path, base, expected] of [
      ["/quartz/quartz/a", "/quartz", "quartz/a"],
      ["/quartz/quartzier/a", "/quartz", "quartzier/a"],
      ["/quartz", "/quartz", ""],
      ["/quartz/", "/quartz/", ""],
      ["/quartz/%E5%BD%B1%E8%AF%84/a", "/quartz", "影评/a"],
      ["/%E5%BD%B1%E8%AF%84/a", "", "影评/a"],
      ["/a%2Fb", "", "a%2Fb"],
    ])
      assert.equal(runtimeSlug(actual, path, base), expected)
    assert.equal(run(root, "patch-graph.mjs").status, 0)
    assert.equal(readFileSync(file, "utf8"), actual)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test("Graph prebuild ignores unrelated markers and rejects partial targets before any write", () => {
  const source = `${nativeGraphPathFunction};function Hu(){return document.body.dataset.basepath};${nativeOuter};function unrelated(){return document.body.dataset.basepath||"/"}`
  const root = graphPackageFixture(source)
  const first = resolve(root, "node_modules/@quartz-community/graph/dist/index.js")
  const second = resolve(root, "node_modules/@quartz-community/graph/dist/components/index.js")
  try {
    writeFileSync(second, "unmatched()")
    assert.notEqual(run(root, "patch-graph.mjs").status, 0)
    assert.equal(readFileSync(first, "utf8"), source)
    writeFileSync(second, source)
    assert.equal(run(root, "patch-graph.mjs").status, 0)
    assert.ok(readFileSync(first, "utf8").includes(graphRuntimeFunction))
    rmSync(second)
    assert.notEqual(run(root, "patch-graph.mjs").status, 0)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

// 移除文件夹页（folder-page 插件）条目上的标签渲染。
//
// 背景：站点是 minimal 风格，不需要标签。文章页的标签条（tag-list 组件）和
// 元数据面板的 tags（note-properties）都能通过 quartz.config.yaml 关掉，
// 但 @quartz-community/folder-page 把标签渲染写死在代码里，没有任何选项：
//
//   const tags = page.frontmatter?.tags ?? [];
//   ... <ul class="tags">{tags.map(tag => <a href={`tags/${tag}`}>...)}</ul>
//
// 而 tag-page（/tags/ 索引页）已在配置里禁用。如果不处理，文件夹页会留下
// 一堆指向 /tags/* 的死链。
//
// 做法：把 `const tags = ...` 改成 `const tags = []`，标签 ul 渲染为空。
// 只改一行，对压缩/版本变动最不敏感。
//
// 若插件升级后这里报 warning，说明源码变了，需要重新定位这一行。

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve } from "path"

const PLUGIN_PKG = "@quartz-community/folder-page"

const TARGET = resolve(
  import.meta.dirname,
  "..",
  "node_modules",
  "@quartz-community",
  "folder-page",
  "dist",
  "index.js",
)

const OLD = "const tags = page.frontmatter?.tags ?? [];"
const NEW = "const tags = [];"

const packagePath = resolve(import.meta.dirname, "..", "node_modules", PLUGIN_PKG, "package.json")
if (!existsSync(packagePath))
  throw new Error(`[patch-folder-tags] Required plugin is missing: ${PLUGIN_PKG}`)
const version = JSON.parse(readFileSync(packagePath, "utf-8")).version
if (Number(version.split(".")[0]) !== 1)
  throw new Error(
    `[patch-folder-tags] Unsupported ${PLUGIN_PKG} version ${version}; expected major 1`,
  )
if (!existsSync(TARGET))
  throw new Error(`[patch-folder-tags] Required target is missing: ${TARGET}`)

const src = readFileSync(TARGET, "utf-8")

if (!src.includes(OLD)) {
  if (src.includes(NEW)) {
    console.log("[patch-folder-tags] 已打过补丁，跳过。")
  } else {
    console.error(
      "[patch-folder-tags] ERROR: expected tag source or patched source was not found in folder-page dist/index.js",
    )
    process.exit(1)
  }
  process.exit(0)
}

writeFileSync(TARGET, src.replace(OLD, NEW), "utf-8")
console.log("[patch-folder-tags] 已移除文件夹页的标签渲染。")

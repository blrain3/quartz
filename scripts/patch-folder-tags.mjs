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

if (!existsSync(TARGET)) {
  console.log("[patch-folder-tags] folder-page 未安装，跳过。")
  process.exit(0)
}

const src = readFileSync(TARGET, "utf-8")

if (!src.includes(OLD)) {
  if (src.includes(NEW)) {
    console.log("[patch-folder-tags] 已打过补丁，跳过。")
  } else {
    console.warn(
      "[patch-folder-tags] ⚠️ 未找到目标代码 —— folder-page 可能已更新。\n" +
        "  文件夹页会重新出现指向 /tags/* 的死链（tag-page 已禁用）。\n" +
        "  请检查 node_modules/@quartz-community/folder-page/dist/index.js " +
        "里 tags 的渲染逻辑并更新本脚本。",
    )
  }
  process.exit(0)
}

writeFileSync(TARGET, src.replace(OLD, NEW), "utf-8")
console.log("[patch-folder-tags] 已移除文件夹页的标签渲染。")

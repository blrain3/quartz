// 自托管 Google Fonts 抓取脚本
//
// 背景：Quartz 内置的 cdnCaching:false 虽然也会下载字体，但它是服务端 fetch，
// 不带浏览器 User-Agent，Google 会返回「单文件 TTF + 无 unicode-range」的版本
// （Noto Sans SC 一个文件 11MB）。这里带 UA 请求，拿到的才是 woff2 + unicode-range
// 分片版本，浏览器只下载当前页面实际用到的分片。
//
// 产物：
//   quartz/static/fonts/*.woff2   —— 字体文件（Quartz 会自动复制到 public/static/）
//   quartz/styles/_fonts.scss     —— @font-face 声明，被 custom.scss 引入
//
// 用法：node scripts/fetch-fonts.mjs
// 字体有变动（改字体名/字重）后重跑一次即可。

import { mkdirSync, writeFileSync, rmSync, readdirSync, statSync } from "fs"
import { resolve, basename } from "path"

const ROOT = resolve(import.meta.dirname, "..")
const FONT_DIR = resolve(ROOT, "quartz", "static", "fonts")
const SCSS_FILE = resolve(ROOT, "quartz", "styles", "_fonts.scss")

// 与 quartz.config.yaml 的 theme.typography 保持一致
const FAMILIES = [
  "Schibsted Grotesk:wght@400;700",
  "Noto Sans SC:ital,wght@0,400;0,600;1,400;1,600",
  "IBM Plex Mono:wght@400;600",
]

// 现代浏览器的 UA —— 决定 Google 返回 woff2 还是 TTF
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

const cssUrl =
  "https://fonts.googleapis.com/css2?" +
  FAMILIES.map((f) => `family=${f}`).join("&") +
  "&display=swap"

async function main() {
  console.log(`[fetch-fonts] 请求 CSS: ${cssUrl}`)
  const cssRes = await fetch(cssUrl, { headers: { "User-Agent": UA } })
  if (!cssRes.ok) {
    throw new Error(`获取 Google Fonts CSS 失败: ${cssRes.status} ${cssRes.statusText}`)
  }
  let css = await cssRes.text()

  const faces = (css.match(/@font-face/g) || []).length
  const woff2 = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]*\.woff2/g) || [])]
  console.log(`[fetch-fonts] @font-face: ${faces}，唯一 woff2 文件: ${woff2.length}`)

  if (faces === 0 || woff2.length === 0) {
    throw new Error("没拿到 woff2 —— 可能 UA 失效或 Google 返回了 TTF，中止。")
  }

  // 重建字体目录
  rmSync(FONT_DIR, { recursive: true, force: true })
  mkdirSync(FONT_DIR, { recursive: true })

  // 下载 + 改写 URL（/static/fonts/<file>.woff2 走本站）
  let total = 0
  const names = new Map()
  for (const url of woff2) {
    const res = await fetch(url, { headers: { "User-Agent": UA } })
    if (!res.ok) throw new Error(`下载字体失败: ${url} (${res.status})`)
    const buf = Buffer.from(await res.arrayBuffer())
    const name = basename(new URL(url).pathname)
    if (names.has(name)) throw new Error(`文件名冲突: ${name}`)
    names.set(name, url)
    writeFileSync(resolve(FONT_DIR, name), buf)
    total += buf.length
    css = css.split(url).join(`/static/fonts/${name}`)
  }

  writeFileSync(SCSS_FILE, css.trim() + "\n", "utf-8")

  const files = readdirSync(FONT_DIR)
  console.log(
    `[fetch-fonts] 完成：${files.length} 个字体文件，共 ${(total / 1024 / 1024).toFixed(2)} MB`,
  )
  console.log(`[fetch-fonts] 输出：quartz/static/fonts/ , quartz/styles/_fonts.scss`)
}

main().catch((e) => {
  console.error(`[fetch-fonts] 失败：${e.message}`)
  process.exit(1)
})

// 把仓库根目录的 _headers 复制到构建输出目录，供 Cloudflare Workers 静态资源读取。
//
// Workers 会在静态资源目录（wrangler.jsonc 里的 assets.directory = "public"）根部
// 寻找名为 _headers 的文件，用它覆盖默认响应头。public/ 每次构建都被清空重建，
// 所以必须在 build 之后复制。
//
// 该文件只对 Cloudflare 生效；GitHub Pages 会忽略它（最多作为一个普通文件可访问）。

import { copyFileSync, existsSync } from "fs"
import { resolve } from "path"

const ROOT = resolve(import.meta.dirname, "..")
const SRC = resolve(ROOT, "_headers")
const DEST = resolve(ROOT, "public", "_headers")

if (!existsSync(SRC)) {
  console.log("[copy-headers] 未找到根目录 _headers，跳过。")
  process.exit(0)
}

if (!existsSync(resolve(ROOT, "public"))) {
  console.log("[copy-headers] public/ 不存在，跳过。")
  process.exit(0)
}

copyFileSync(SRC, DEST)
console.log("[copy-headers] 已复制 _headers → public/_headers")

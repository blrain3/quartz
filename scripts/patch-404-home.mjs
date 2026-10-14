// Keep Quartz's generated 404 return-home link inside a project subpath.
// QUARTZ_BASE_PATH is also used by the build for page resource paths, but the
// built-in 404 component derives this link from baseUrl instead.

import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..")
const output = resolve(root, "public", "404.html")
const configuredBasePath = process.env.QUARTZ_BASE_PATH ?? "/"

if (!configuredBasePath.startsWith("/") || /[?#]/.test(configuredBasePath)) {
  throw new Error(`[patch-404-home] Invalid QUARTZ_BASE_PATH: ${configuredBasePath}`)
}

const normalizedBasePath =
  configuredBasePath === "/" ? "/" : `/${configuredBasePath.split("/").filter(Boolean).join("/")}/`

let html
try {
  html = readFileSync(output, "utf8")
} catch (error) {
  throw new Error(`[patch-404-home] Required build output is missing: ${output}`, { cause: error })
}

const anchorPattern = /<a href="([^"]*)">返回首页<\/a>/g
const matches = [...html.matchAll(anchorPattern)]
if (matches.length !== 1) {
  throw new Error(
    `[patch-404-home] Expected one return-home anchor in ${output}; found ${matches.length}`,
  )
}

const [anchor, currentHref] = matches[0]
if (currentHref !== "/" && currentHref !== normalizedBasePath) {
  throw new Error(
    `[patch-404-home] Unexpected return-home href ${JSON.stringify(currentHref)} in ${output}`,
  )
}

if (currentHref !== normalizedBasePath) {
  writeFileSync(
    output,
    html.replace(anchor, anchor.replace('href="/"', `href="${normalizedBasePath}"`)),
  )
  console.log(`[patch-404-home] Updated return-home link to ${normalizedBasePath} in ${output}`)
} else {
  console.log(`[patch-404-home] Return-home link already targets ${normalizedBasePath}`)
}

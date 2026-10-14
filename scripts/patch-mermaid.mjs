// Patch the obsidian-flavored-markdown plugin so mermaid can parse the colors it is given.
//
// Why: the plugin feeds mermaid the *raw text* of nine CSS custom properties, e.g.
//   window.getComputedStyle(document.documentElement).getPropertyValue("--tertiary")
// On this site several of those properties are declared with calc() inside hsl(),
// for example `--tertiary: hsl(201, 17%, calc(50% - 8%))`. getPropertyValue returns
// that text verbatim; mermaid's color parser then throws
//   Unsupported color format: "hsl( 201, 17%, calc(50% - 8%) )"
// and the diagram never renders. Resolving each value through a probe element lets the
// browser compute the used color (`rgb(...)`), which mermaid accepts.
//
// SAFETY: anchored to the exact minified expression shipped by
// @quartz-community/obsidian-flavored-markdown@1.0.0. The script errors when the
// anchor is missing or ambiguous, and recognises its own previous output.

import { readFileSync, writeFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

const PLUGIN_PKG = "@quartz-community/obsidian-flavored-markdown"
const EXPECTED_MAJOR = 1
const TARGET = `node_modules/${PLUGIN_PKG}/dist/index.js`

const MARKER = "/*q-mermaid-resolve*/"

const OLD =
  "let r=H.reduce((i,d)=>(i[d]=window.getComputedStyle(document.documentElement).getPropertyValue(d),i),{})"

const NEW =
  "let r=function(){" +
  MARKER +
  'var p=document.createElement("span");p.setAttribute("aria-hidden","true");' +
  'p.setAttribute("style","position:absolute;left:-9999px;top:0;visibility:hidden");' +
  "document.documentElement.appendChild(p);" +
  "var base=getComputedStyle(document.documentElement)," +
  "o=H.reduce(function(i,d){" +
  'if(d==="--codeFont"){i[d]=base.getPropertyValue(d);return i}' +
  'p.style.color="transparent";p.style.color="var("+d+")";' +
  "var c=getComputedStyle(p).color;" +
  'i[d]=c&&c!=="transparent"?c:base.getPropertyValue(d);return i},{});' +
  "p.remove();return o}()"

function count(haystack, needle) {
  return haystack.split(needle).length - 1
}

const abs = resolve(root, TARGET)
if (!existsSync(abs)) throw new Error(`[patch-mermaid] missing ${TARGET}; run npm install first`)

const pkgPath = resolve(root, "node_modules", PLUGIN_PKG, "package.json")
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
if (Number(pkg.version.split(".")[0]) !== EXPECTED_MAJOR)
  throw new Error(
    `[patch-mermaid] Unsupported ${PLUGIN_PKG} version ${pkg.version}; expected major ${EXPECTED_MAJOR}`,
  )

let src = readFileSync(abs, "utf-8")

if (count(src, MARKER) > 0) {
  console.log(`[patch-mermaid] Already patched: ${TARGET}`)
  process.exit(0)
}

const hits = count(src, OLD)
if (hits !== 1)
  throw new Error(
    `[patch-mermaid] Expected exactly one theme-variable anchor in ${TARGET}, found ${hits}. ` +
      "The plugin output changed; update OLD/NEW before building.",
  )

src = src.replace(OLD, NEW)
writeFileSync(abs, src)
console.log(`[patch-mermaid] Patched theme-variable resolution in ${TARGET}`)

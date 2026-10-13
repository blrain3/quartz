import assert from "node:assert/strict"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import * as sass from "sass"
import test from "node:test"

const stylesDir = resolve(dirname(fileURLToPath(import.meta.url)), "../quartz/styles")
const css = sass.compile(resolve(stylesDir, "custom.scss")).css

test("closed mobile explorer cannot intercept pointer hits during its exit transition", () => {
  const closedMobilePanel =
    /@media all and \(\(max-width: 800px\)\)\s*\{\s*\.explorer\.nav-files-container\.collapsed\s*>\s*\.explorer-content\s*\{\s*pointer-events:\s*none;\s*\}\s*\}/
  assert.ok(
    closedMobilePanel.test(css),
    "compiled mobile CSS must disable hits on the closed panel",
  )
})

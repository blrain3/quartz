import assert from "node:assert/strict"
import test from "node:test"
import { majorChanges } from "./check-lockfile-majors.mjs"

const lock = (version, extra = {}) => ({
  packages: { "": { version: "5.0.0" }, "node_modules/example": { version }, ...extra },
})

test("accepts patch and minor upgrades", () => {
  assert.deepEqual(majorChanges(lock("10.1.0"), lock("10.2.1")), [])
})

test("rejects grouped major upgrades and downgrades regardless of title", () => {
  assert.equal(majorChanges(lock("10.29.8"), lock("11.0.1")).length, 1)
  assert.equal(majorChanges(lock("11.0.1"), lock("10.29.8")).length, 1)
})

test("checks nested dependency resolutions", () => {
  const path = "node_modules/plugin/node_modules/example"
  assert.equal(
    majorChanges(
      lock("10.1.0", { [path]: { version: "1.0.0" } }),
      lock("10.1.0", { [path]: { version: "2.0.0" } }),
    ).length,
    1,
  )
})

test("fails closed on missing package maps and unclassifiable changed versions", () => {
  assert.throws(() => majorChanges({}, lock("1.0.0")))
  assert.throws(() => majorChanges(lock("git+https://example.invalid/x"), lock("1.0.0")))
})

test("allows unchanged non-semver entries and newly added dependencies", () => {
  assert.deepEqual(
    majorChanges(
      lock("workspace:*"),
      lock("workspace:*", { "node_modules/new": { version: "2.0.0" } }),
    ),
    [],
  )
})

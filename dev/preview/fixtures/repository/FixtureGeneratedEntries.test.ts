import { lstatSync, mkdtempSync, readFileSync, readlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";

import { expandPattern, writeGeneratedEntries } from "./FixtureGeneratedEntries.ts";

it("expands every range of a pattern, padded to the first number's width", () => {
  expect(expandPattern("README.md")).toEqual(["README.md"]);
  expect(expandPattern("pkg-{00..02}/file_{8..10}.ts")).toEqual([
    "pkg-00/file_8.ts",
    "pkg-00/file_9.ts",
    "pkg-00/file_10.ts",
    "pkg-01/file_8.ts",
    "pkg-01/file_9.ts",
    "pkg-01/file_10.ts",
    "pkg-02/file_8.ts",
    "pkg-02/file_9.ts",
    "pkg-02/file_10.ts",
  ]);
  expect(expandPattern("packages/pkg-{00..39}/src/module-{00..24}/file_{000..049}.ts")).toHaveLength(50_000);
});

it("writes files and symlinks and leaves submodules for the index", () => {
  const checkout = mkdtempSync(join(tmpdir(), "fixture-generated-"));
  try {
    const submodules = writeGeneratedEntries(checkout, [
      { files: "lib/deep dir/a&b <c>.txt", content: "text\n" },
      { symlink: "linked-lib", target: "lib" },
      { submodule: "vendor/docs", commit: "0123456789abcdef0123456789abcdef01234567" },
    ]);
    expect(readFileSync(join(checkout, "lib/deep dir/a&b <c>.txt"), "utf8")).toBe("text\n");
    expect(lstatSync(join(checkout, "linked-lib")).isSymbolicLink()).toBe(true);
    expect(readlinkSync(join(checkout, "linked-lib"))).toBe("lib");
    expect(submodules).toEqual([{ path: "vendor/docs", commit: "0123456789abcdef0123456789abcdef01234567" }]);
  } finally {
    rmSync(checkout, { recursive: true, force: true });
  }
});

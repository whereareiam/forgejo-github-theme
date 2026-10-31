import { mkdirSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import type { FixtureGeneratedEntry } from "../model/FixtureHistory.ts";

const RANGE = /\{(\d+)\.\.(\d+)\}/;

/** Expands each `{first..last}` range of a path pattern, padding numbers to the width of `first`. */
export function expandPattern(pattern: string): string[] {
  const match = RANGE.exec(pattern);
  if (!match) return [pattern];
  const [range, first, last] = match;
  const before = pattern.slice(0, match.index);
  const after = expandPattern(pattern.slice(match.index + range.length));
  const paths: string[] = [];
  for (let number = Number(first); number <= Number(last); number++) {
    const value = String(number).padStart(first.length, "0");
    for (const rest of after) paths.push(`${before}${value}${rest}`);
  }
  return paths;
}

/** Writes a commit's generated files and symlinks into the checkout and returns the submodules to stage after them. */
export function writeGeneratedEntries(
  checkout: string,
  entries: readonly FixtureGeneratedEntry[]
): { readonly path: string; readonly commit: string }[] {
  const submodules: { path: string; commit: string }[] = [];
  for (const entry of entries) {
    if ("files" in entry)
      for (const path of expandPattern(entry.files)) {
        mkdirSync(dirname(join(checkout, path)), { recursive: true });
        writeFileSync(join(checkout, path), entry.content);
      }
    else if ("symlink" in entry) {
      mkdirSync(dirname(join(checkout, entry.symlink)), { recursive: true });
      symlinkSync(entry.target, join(checkout, entry.symlink));
    } else submodules.push({ path: entry.submodule, commit: entry.commit });
  }
  return submodules;
}

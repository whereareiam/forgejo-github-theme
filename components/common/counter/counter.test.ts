import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const read = (file: string) => readFileSync(join(root, file), "utf8");
const files = (directory: string, extension: string) =>
  readdirSync(join(root, directory), { recursive: true })
    .map(file => `${directory}/${String(file)}`)
    .filter(file => file.endsWith(extension));

it("renders every count pill through the shared counter", () => {
  const pills = ["profile-nav-count", "github-release-asset-count", "diff-filter-count", "issue-state-count"];
  const sources = [...files("templates", ".tmpl"), ...files("public/assets/js", ".js")].map(read).join("\n");
  for (const pill of pills) {
    const uses = sources.match(new RegExp(`"[^"]*\\b${pill}\\b[^"]*"`, "g")) ?? [];
    expect(uses.length, `no use of ${pill}`).toBeGreaterThan(0);
    for (const use of uses) expect(use).toContain("theme-counter");
  }
});

it("keeps one segmented switch and one boxed empty state", () => {
  const templates = files("templates", ".tmpl").map(read).join("\n");
  expect(templates).not.toMatch(/github-(release|tags)-switch/);
  expect(templates.match(/class="theme-switch"/g)).toHaveLength(2);
  for (const box of templates.match(/class="[^"]*\b(profile-empty|github-release-empty)\b[^"]*"/g) ?? [])
    expect(box).toContain("theme-empty");
});

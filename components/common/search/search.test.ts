import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const component = "components/common/search/search.tmpl";

const templates = ["templates", "components"].flatMap(directory =>
  readdirSync(join(root, directory), { recursive: true })
    .map(file => `${directory}/${String(file)}`)
    .filter(file => file.endsWith(".tmpl"))
);

describe("shared search field", () => {
  it("is the only template that writes a search input", () => {
    const own = templates.filter(file => /type="search"/.test(readFileSync(join(root, file), "utf8")));
    expect(own).toEqual([component]);
  });

  it("renders every kind from one field", () => {
    const source = readFileSync(join(root, component), "utf8");
    expect(source.match(/<input /g)).toHaveLength(1);
    expect(source).toContain('eq .Kind "icon"');
    expect(source).toContain('eq .Kind "plain"');
    expect(source).toContain("theme-search-submit");
  });
});

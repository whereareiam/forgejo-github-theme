import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const script = readFileSync(new URL("../public/assets/js/repo-wiki.js", import.meta.url), "utf8");

function fixture(names: string[]) {
  let onInput: (event: { target: { id: string; value: string } }) => void = () => {};
  const rows = names.map(name => ({ hidden: false, querySelector: () => ({ textContent: name }) }));
  const empty = { hidden: true };
  const pages = {
    addEventListener: (_name: string, listener: typeof onInput) => (onInput = listener),
    querySelector: () => empty,
    querySelectorAll: () => rows,
  };
  runInNewContext(script, { document: { querySelector: () => pages } });
  const type = (value: string, id = "wiki-pages-filter") => onInput({ target: { id, value } });
  const visible = () => rows.flatMap((row, index) => (row.hidden ? [] : [names[index]]));
  return { empty, type, visible };
}

describe("wiki pages filter", () => {
  it("keeps the pages whose name contains the text, ignoring case and spaces around it", () => {
    const f = fixture(["Home", "Getting Started", "Deployment"]);
    f.type(" START ");
    expect(f.visible()).toEqual(["Getting Started"]);
    expect(f.empty.hidden).toBe(true);
    f.type("");
    expect(f.visible()).toEqual(["Home", "Getting Started", "Deployment"]);
  });

  it("says there are no results when nothing matches, and ignores other fields", () => {
    const f = fixture(["Home"]);
    f.type("zzz");
    expect(f.visible()).toEqual([]);
    expect(f.empty.hidden).toBe(false);
    f.type("home", "wiki-search");
    expect(f.visible()).toEqual([]);
  });
});

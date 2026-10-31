import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./owners.js", import.meta.url), "utf8");

type Listener = (event: Record<string, unknown>) => void;
type Row = {
  href: string;
  attributes: Map<string, string>;
  image: { src: string; removed: boolean; remove: () => void };
  name: { textContent: string };
  setAttribute: (name: string, value: string) => void;
  querySelector: (selector: string) => unknown;
};

function row(): Row {
  const image = { src: "", removed: false, remove: () => (image.removed = true) };
  const node: Row = {
    href: "",
    attributes: new Map(),
    image,
    name: { textContent: "" },
    setAttribute: (name, value) => node.attributes.set(name, value),
    querySelector: selector => (selector === "img" ? image : node.name),
  };
  return node;
}

function entry(name: string, link: string, avatar?: string) {
  return {
    dataset: { themeOrganization: name, themeOrganizationLink: link },
    querySelector: () => (avatar ? { getAttribute: () => avatar } : undefined),
  };
}

function fixture(entries: ReturnType<typeof entry>[], ok = true) {
  const listeners = new Map<string, Listener>();
  const added: Row[] = [];
  const message = { hidden: true };
  const switcher = {
    dataset: { url: "/user/settings/organization", current: "/acme" } as Record<string, string>,
    attributes: new Set(["aria-busy"]),
    querySelector: (selector: string) =>
      selector === "template" ? { content: { firstElementChild: { cloneNode: () => row() } } } : message,
    before: (...rows: Row[]) => added.push(...rows),
    removeAttribute: (name: string) => switcher.attributes.delete(name),
  };
  const fetch = vi.fn(async () => ({ ok, text: async () => "<html></html>" }));
  class DOMParser {
    parseFromString() {
      return { querySelectorAll: () => entries };
    }
  }
  runInNewContext(script, {
    document: { addEventListener: (name: string, fn: Listener) => listeners.set(name, fn) },
    fetch,
    DOMParser,
    String,
  });
  const open = () => listeners.get("toggle")?.({ target: { open: true, querySelector: () => switcher } });
  const settle = () => new Promise(resolve => setTimeout(resolve, 0));
  return { added, message, switcher, fetch, open, settle };
}

describe("owner switcher", () => {
  it("loads the signed-in user's organizations when the menu opens and checks the owner shown", async () => {
    const f = fixture([entry("acme", "/acme", "/avatars/acme"), entry("globex", "/globex")]);
    await f.settle();
    expect(f.fetch).not.toHaveBeenCalled();
    f.open();
    await f.settle();
    expect(f.fetch).toHaveBeenCalledWith("/user/settings/organization", expect.anything());
    expect(f.added.map(item => [item.href, item.name.textContent])).toEqual([
      ["/acme", "acme"],
      ["/globex", "globex"],
    ]);
    expect(f.added[0].attributes.get("aria-current")).toBe("true");
    expect(f.added[1].attributes.has("aria-current")).toBe(false);
    expect(f.added[0].image.src).toBe("/avatars/acme");
    expect(f.added[1].image.removed).toBe(true);
    expect(f.switcher.attributes.has("aria-busy")).toBe(false);
  });

  it("loads once and never links outside the site", async () => {
    const f = fixture([entry("evil", "https://evil.example/x")]);
    f.open();
    await f.settle();
    f.open();
    await f.settle();
    expect(f.fetch).toHaveBeenCalledOnce();
    expect(f.added.map(item => item.href)).toEqual(["#"]);
  });

  it("reports a failed load and tries again on the next opening", async () => {
    const f = fixture([], false);
    f.open();
    await f.settle();
    expect(f.message.hidden).toBe(false);
    expect(f.added).toHaveLength(0);
    f.open();
    await f.settle();
    expect(f.fetch).toHaveBeenCalledTimes(2);
  });
});

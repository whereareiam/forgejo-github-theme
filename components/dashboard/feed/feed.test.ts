import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./feed.js", import.meta.url), "utf8");
const DAY = 86400000;

type Node = { className: string; textContent: string; dataset: Record<string, string>; remove?: () => void };

function fixture(ages: number[], nextAges: number[] = []) {
  const nodes: Node[] = [];
  const item = (age: number): Node => ({
    className: "theme-feed-item",
    textContent: "",
    dataset: { time: String(Math.floor((Date.now() - age) / 1000)) },
  });
  const insertBefore = (target: Node, heading: Node) => {
    heading.remove = () => nodes.splice(nodes.indexOf(heading), 1);
    nodes.splice(nodes.indexOf(target), 0, heading);
  };
  const withBefore = (node: Node) =>
    Object.assign(node, { before: (heading: Node) => insertBefore(node, heading) }) as Node & {
      before: (heading: Node) => void;
    };
  nodes.push(...ages.map(age => withBefore(item(age))));
  const list = {
    querySelectorAll: (selector: string) =>
      nodes.filter(node => node.className === (selector === ".theme-feed-day" ? "theme-feed-day" : "theme-feed-item")),
    append: (...added: Node[]) => nodes.push(...added.map(withBefore)),
  };
  const older = {
    href: "/?page=2",
    attributes: new Map<string, string>(),
    textContent: "Load older activity",
    removed: false,
    getAttribute(name: string) {
      return this.attributes.get(name) ?? null;
    },
    setAttribute(name: string, value: string) {
      this.attributes.set(name, value);
    },
    removeAttribute(name: string) {
      this.attributes.delete(name);
    },
    remove() {
      this.removed = true;
    },
  };
  let click: ((event: unknown) => Promise<void>) | undefined;
  const text = { error: "Network error" };
  const feed = {
    querySelector: (selector: string) =>
      ({ "[data-theme-feed-list]": list, "[data-theme-feed-text]": { dataset: text } })[selector],
    addEventListener: (_: string, fn: (event: unknown) => Promise<void>) => (click = fn),
    dispatchEvent: vi.fn(),
  };
  const nextPage = {
    querySelector: (selector: string) =>
      selector === "[data-theme-feed]"
        ? { querySelectorAll: () => nextAges.map(item), querySelector: () => null }
        : null,
  };
  const fetch = vi.fn(async () => ({ ok: true, text: async () => "" }));
  runInNewContext(script, {
    document: {
      documentElement: { lang: "en-US" },
      querySelectorAll: () => [feed],
      createElement: () => ({ className: "", textContent: "", dataset: {}, setAttribute() {} }),
    },
    fetch,
    DOMParser: class {
      parseFromString() {
        return nextPage;
      }
    },
    CustomEvent: class {},
    Date,
    Number,
    Math,
    Intl,
  });
  const headings = () => nodes.filter(node => node.className === "theme-feed-day").map(node => node.textContent);
  const loadOlder = () =>
    click?.({ target: { closest: () => older }, button: 0, preventDefault() {} }) ?? Promise.resolve();
  return { headings, nodes, older, fetch, loadOlder };
}

describe("Home's activity feed", () => {
  it("puts a heading before each day group: today, this week, last week and older weeks, worded in the page language", () => {
    const f = fixture([1000, 3 * DAY, 4 * DAY, 9 * DAY, 30 * DAY]);
    expect(f.headings()).toEqual(["Today", "This week", "Last week", "4 weeks ago"]);
    expect(f.nodes.map(node => node.className)).toEqual([
      "theme-feed-day",
      "theme-feed-item",
      "theme-feed-day",
      "theme-feed-item",
      "theme-feed-item",
      "theme-feed-day",
      "theme-feed-item",
      "theme-feed-day",
      "theme-feed-item",
    ]);
  });

  it("appends the next page in place and regroups, dropping the link after the last page", async () => {
    const f = fixture([3 * DAY], [9 * DAY, 30 * DAY]);
    await f.loadOlder();
    expect(f.fetch).toHaveBeenCalledWith("/?page=2", expect.anything());
    expect(f.headings()).toEqual(["This week", "Last week", "4 weeks ago"]);
    expect(f.older.removed).toBe(true);
  });
});

import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("../public/assets/js/repo-source-browser.js", import.meta.url), "utf8");
const cleanup = readFileSync(new URL("../public/assets/js/repo-source-tree-cache.js", import.meta.url), "utf8");

const origin = "http://localhost:3000";
const source = "/alex/monorepo/src/branch/main";
const commit = "/alex/monorepo/src/commit/0123abcd";

type Listener = (event: Record<string, unknown>) => void;

// Just enough of the DOM for the tree: children, attributes, classes and the selectors the script queries.
class FakeElement {
  children: FakeElement[] = [];
  parent: FakeElement | null = null;
  attributes = new Map<string, string>();
  classes = new Set<string>();
  dataset: Record<string, string> = {};
  listeners = new Map<string, Listener[]>();
  hidden = false;
  textContent = "";
  title = "";
  href = "";
  scrollTop = 0;
  content?: unknown;
  focus = vi.fn();
  classList = {
    add: (name: string) => this.classes.add(name),
    remove: (name: string) => this.classes.delete(name),
    contains: (name: string) => this.classes.has(name),
    toggle: (name: string, force = !this.classes.has(name)) => {
      if (force) this.classes.add(name);
      else this.classes.delete(name);
      return force;
    },
  };

  readonly tag: string;

  constructor(tag = "div") {
    this.tag = tag;
  }

  set className(value: string) {
    this.classes = new Set(value.split(" ").filter(Boolean));
  }
  get tabIndex() {
    return Number(this.attributes.get("tabindex") ?? -1);
  }
  set tabIndex(value: number) {
    this.attributes.set("tabindex", String(value));
  }
  get firstElementChild() {
    return this.children[0] ?? null;
  }
  get nextElementSibling() {
    const siblings = this.parent?.children ?? [];
    return siblings[siblings.indexOf(this) + 1] ?? null;
  }
  setAttribute(name: string, value: unknown) {
    if (name.startsWith("data-"))
      this.dataset[name.slice(5).replace(/-(\w)/g, (_, letter) => letter.toUpperCase())] = String(value);
    else this.attributes.set(name, String(value));
  }
  getAttribute(name: string) {
    if (name.startsWith("data-"))
      return this.dataset[name.slice(5).replace(/-(\w)/g, (_, letter) => letter.toUpperCase())] ?? null;
    return this.attributes.get(name) ?? null;
  }
  hasAttribute(name: string) {
    return this.getAttribute(name) !== null;
  }
  append(...nodes: FakeElement[]) {
    for (const node of nodes) {
      node.parent = this;
      this.children.push(node);
    }
  }
  replaceChildren(...nodes: FakeElement[]) {
    this.children = [];
    this.append(...nodes);
  }
  replaceWith(node: FakeElement) {
    const siblings = this.parent!.children;
    siblings[siblings.indexOf(this)] = node;
    node.parent = this.parent;
  }
  cloneNode() {
    return new FakeElement(this.tag);
  }
  addEventListener(name: string, listener: Listener) {
    this.listeners.set(name, [...(this.listeners.get(name) ?? []), listener]);
  }
  getBoundingClientRect() {
    return { top: 0, bottom: 0, height: 0 };
  }
  contains(node: unknown) {
    for (let current = node as FakeElement | null; current; current = current.parent) if (current === this) return true;
    return false;
  }
  matches(selector: string): boolean {
    return selector.split(",").some(part => {
      const single = part.trim();
      const attribute = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(single);
      if (attribute)
        return attribute[2] === undefined
          ? this.hasAttribute(attribute[1])
          : this.getAttribute(attribute[1]) === attribute[2];
      return single.startsWith(".") && this.classes.has(single.slice(1));
    });
  }
  closest(selector: string) {
    for (let current: FakeElement | null = this; current; current = current.parent)
      if (current.matches(selector)) return current;
    return null;
  }
  querySelectorAll(selector: string): FakeElement[] {
    return this.children.flatMap(child => [
      ...(child.matches(selector) ? [child] : []),
      ...child.querySelectorAll(selector),
    ]);
  }
  querySelector(selector: string) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
  // A click on a row's disclosure: the row's listener sees the disclosure as the target.
  click(target: FakeElement = this) {
    const event = { target, defaultPrevented: false, preventDefault: () => (event.defaultPrevented = true) };
    for (let current: FakeElement | null = this; current; current = current.parent)
      current.listeners.get("click")?.forEach(listener => listener(event));
    return event;
  }
}

// An in-memory IndexedDB with the calls the tree makes; results arrive in order on later tasks, as in a browser.
function fakeIndexedDB() {
  const databases = new Map<string, Map<string, Map<string, Record<string, unknown>>>>();
  const later = (request: Record<string, unknown>, result: unknown) =>
    setTimeout(() => {
      request.result = result;
      (request.onsuccess as ((event: unknown) => void) | undefined)?.({ target: request });
    });
  const store = (records: Map<string, Record<string, unknown>>) => ({
    get: (key: string) => {
      const request: Record<string, unknown> = {};
      later(request, records.get(key));
      return request;
    },
    put: (value: Record<string, unknown>) => {
      records.set(value.key as string, value);
      return {};
    },
    count: () => {
      const request: Record<string, unknown> = {};
      later(request, records.size);
      return request;
    },
    delete: (key: string) => records.delete(key),
    index: () => ({
      openKeyCursor: () => {
        const request: Record<string, unknown> = {};
        const keys = [...records.values()].sort((a, b) => Number(a.time) - Number(b.time)).map(value => value.key);
        const next = (index: number) =>
          later(request, index < keys.length ? { primaryKey: keys[index], continue: () => next(index + 1) } : null);
        next(0);
        return request;
      },
    }),
  });
  return {
    databases,
    open: (name: string) => {
      const request: Record<string, unknown> = {};
      setTimeout(() => {
        if (!databases.has(name)) {
          databases.set(name, new Map([["lists", new Map()]]));
          request.result = { createObjectStore: () => ({ createIndex: () => {} }) };
          (request.onupgradeneeded as (() => void) | undefined)?.();
        }
        later(request, {
          transaction: () => ({ objectStore: () => store(databases.get(name)!.get("lists")!) }),
          close: () => {},
        });
      });
      return request;
    },
  };
}

const settle = async () => {
  for (let i = 0; i < 20; i++) await new Promise(resolve => setTimeout(resolve));
};

const entry = (path: string, directory = false) => {
  const span = new FakeElement("span");
  span.dataset = { path, directory: String(directory) };
  return span;
};

// The entries a page lists: the root and each folder on its path.
const pathEntries = (currentPath: string) => {
  const entries = [entry("packages", true), entry("README.md")];
  if (currentPath.startsWith("packages"))
    entries.push(entry("packages/app", true), entry("packages/lib", true), entry("packages/README.md"));
  if (currentPath.startsWith("packages/app")) entries.push(entry("packages/app/index.ts"));
  return entries;
};

const fullList = ["README.md", "packages/README.md", "packages/app/index.ts", "packages/lib/util.ts", ""].join("\n");

function fixture({
  currentPath = "packages/app",
  entries = pathEntries(currentPath),
  indexedDB = fakeIndexedDB(),
  fail = false,
  viewer = "7",
} = {}) {
  const tree = new FakeElement("nav");
  tree.dataset = { sourceUrl: source, currentPath, commitUrl: commit, viewer };
  const root = new FakeElement();
  root.setAttribute("role", "tree");
  const status = new FakeElement();
  status.setAttribute("role", "status");
  status.dataset = { error: "Network error" };
  tree.append(status, root);
  const container = new FakeElement();
  container.append(tree);
  const data = new FakeElement("template");
  data.content = { children: entries };
  const icon = () => {
    const template = new FakeElement("template");
    template.content = { firstElementChild: new FakeElement("svg") };
    return template;
  };
  const elements: Record<string, FakeElement> = {
    "repo-source-tree": tree,
    "repo-source-browser": container,
    "repo-source-tree-data": data,
  };
  const fetch = vi.fn(async (url: string) => {
    if (fail) throw new TypeError("Failed to fetch");
    return { ok: true, url, text: async () => fullList };
  });
  const document = {
    activeElement: null as FakeElement | null,
    getElementById: (id: string) => elements[id] ?? (id.startsWith("repo-tree-") ? icon() : null),
    createElement: (tag: string) => new FakeElement(tag),
    addEventListener: () => {},
  };
  const storage = () => {
    const values = new Map<string, string>();
    return {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
  };
  runInNewContext(script, {
    document,
    location: { href: `${origin}${source}/${currentPath}` },
    URL,
    fetch,
    DOMParser: class {
      parseFromString(text: string) {
        return {
          getElementById: (id: string) => (id === "repo-source-tree-list" ? { content: { textContent: text } } : null),
        };
      }
    },
    indexedDB,
    matchMedia: () => ({ matches: false, addEventListener: () => {} }),
    sessionStorage: storage(),
    localStorage: storage(),
    innerHeight: 800,
    addEventListener: () => {},
  });
  const row = (path: string) => root.querySelector(`[data-path="${path}"]`);
  const children = (path: string) =>
    row(path)!
      .nextElementSibling!.children.filter(child => child.matches('[role="treeitem"]'))
      .map(child => child.dataset.path);
  const disclose = (path: string) => row(path)!.click(row(path)!.querySelector("[data-tree-disclosure]")!);
  return { tree, root, status, fetch, indexedDB, row, children, disclose };
}

describe("repository file tree", () => {
  it("shows the folders on the page's path while the page is parsed", () => {
    const f = fixture();
    expect(f.status.hidden).toBe(true);
    expect(
      f.root.children.filter(child => child.matches('[role="treeitem"]')).map(child => child.dataset.path)
    ).toEqual(["packages", "README.md"]);
    expect(f.children("packages")).toEqual(["packages/app", "packages/lib", "packages/README.md"]);
    expect(f.children("packages/app")).toEqual(["packages/app/index.ts"]);
    expect(f.row("packages/app")!.classes.has("selected")).toBe(true);
  });

  it("fetches the commit's full list once from the deepest folder on the path and keeps it for this viewer", async () => {
    const f = fixture();
    await settle();
    expect(f.fetch).toHaveBeenCalledTimes(1);
    expect(f.fetch.mock.calls[0][0]).toBe(`${commit}/packages/app?source-tree=list`);
    f.disclose("packages/lib");
    expect(f.children("packages/lib")).toEqual(["packages/lib/util.ts"]);
    const lists = f.indexedDB.databases.get("repo-source-tree:7")!.get("lists")!;
    expect(lists.get(commit)?.list).toBe(fullList);
  });

  it("reads the full list from this viewer's copy instead of fetching it again", async () => {
    const indexedDB = fakeIndexedDB();
    fixture({ indexedDB });
    await settle();
    const f = fixture({ indexedDB, currentPath: "packages" });
    await settle();
    expect(f.fetch).not.toHaveBeenCalled();
    f.disclose("packages/lib");
    expect(f.children("packages/lib")).toEqual(["packages/lib/util.ts"]);
    // Another viewer in the same browser does not see it.
    const other = fixture({ indexedDB, viewer: "8" });
    await settle();
    expect(other.fetch).toHaveBeenCalledTimes(1);
  });

  it("keeps the lists of the last ten commits only", async () => {
    const indexedDB = fakeIndexedDB();
    const lists = new Map<string, Record<string, unknown>>();
    for (let i = 0; i < 10; i++)
      lists.set(`/alex/monorepo/src/commit/old${i}`, { key: `/alex/monorepo/src/commit/old${i}`, list: "", time: i });
    indexedDB.databases.set("repo-source-tree:7", new Map([["lists", lists]]));
    fixture({ indexedDB });
    await settle();
    expect(lists.size).toBe(10);
    expect(lists.has("/alex/monorepo/src/commit/old0")).toBe(false);
    expect(lists.has(commit)).toBe(true);
  });

  it("needs no list when the page lists every folder", async () => {
    const f = fixture({ currentPath: "", entries: [entry("README.md"), entry("LICENSE")] });
    await settle();
    expect(f.fetch).not.toHaveBeenCalled();
  });

  it("opens a folder it knows nothing about as a page when the list cannot be read", async () => {
    const f = fixture({ fail: true });
    await settle();
    expect(f.disclose("packages/lib").defaultPrevented).toBe(false);
    expect(f.disclose("packages/app").defaultPrevented).toBe(true);
    expect(f.row("packages/app")!.getAttribute("aria-expanded")).toBe("false");
  });

  it("adds the folders of a page opened in place until the full list arrives", async () => {
    const f = fixture({ fail: true, currentPath: "packages" });
    await settle();
    f.tree.listeners.get("repo-source:navigate")![0]({
      detail: { path: "packages/app", entries: { content: { children: pathEntries("packages/app") } } },
    });
    expect(f.row("packages/app")!.classes.has("selected")).toBe(true);
    expect(f.children("packages/app")).toEqual(["packages/app/index.ts"]);
  });
});

describe("file tree cache cleanup", () => {
  async function run(viewer: string, names: string[]) {
    const deleted: string[] = [];
    runInNewContext(cleanup, {
      document: { currentScript: { dataset: { viewer } } },
      indexedDB: {
        databases: async () => names.map(name => ({ name })),
        deleteDatabase: (name: string) => deleted.push(name),
      },
    });
    await settle();
    return deleted;
  }

  it("deletes every other viewer's lists, and a signed-in viewer's once nobody is signed in", async () => {
    const names = ["repo-source-tree:7", "repo-source-tree:8", "repo-source-tree", "unrelated"];
    expect(await run("7", names)).toEqual(["repo-source-tree:8", "repo-source-tree"]);
    expect(await run("0", names)).toEqual(["repo-source-tree:7", "repo-source-tree:8", "repo-source-tree"]);
  });

  it("loads on every page with the navbar, told who is signed in", () => {
    const assets = readFileSync(new URL("../templates/base/component_assets.tmpl", import.meta.url), "utf8");
    expect(assets).toContain(
      '<script src="{{AssetUrlPrefix}}/js/repo-source-tree-cache.js" data-viewer="{{if .IsSigned}}{{.SignedUser.ID}}{{else}}0{{end}}" defer></script>'
    );
  });

  it("does nothing where IndexedDB cannot list its databases", () => {
    expect(() =>
      runInNewContext(cleanup, { document: { currentScript: { dataset: { viewer: "7" } } }, indexedDB: {} })
    ).not.toThrow();
  });
});

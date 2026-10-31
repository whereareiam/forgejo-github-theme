import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("../public/assets/js/repo-source-navigation.js", import.meta.url), "utf8");

const origin = "http://localhost:3000";
const source = "/acme/design-system/src/branch/main";

type Listener = (event: Record<string, unknown>) => void;

// A link of the file tree, the folder list or the breadcrumb, reduced to what the script reads.
function link(href: string, { kind = ".item-directory", directoryIcon = false, target = "", cell = false } = {}) {
  const icon = directoryIcon ? {} : null;
  return {
    href: `${origin}${href}`,
    target,
    matches: (selector: string) => selector.split(",").some(part => part.trim() === kind),
    hasAttribute: () => false,
    closest: (selector: string) => (selector === ".repo-file-cell.name" && cell ? { querySelector: () => icon } : null),
    querySelector: () => (cell ? null : icon),
  };
}

// The entries of the folders on the fetched page's path, which the tree adds until it has the full list.
const entries = { content: { children: [] } };

// The page Forgejo answers with: a folder listing, unless it shows a README or a file.
function page({ path = "src/components/avatar", listing = true, needsPageLoad = false, sourceUrl = source } = {}) {
  const content = {
    querySelector: (selector: string) => {
      if (selector === "#repo-files-table") return listing ? {} : null;
      if (selector.includes("#readme")) return needsPageLoad ? {} : null;
      return null;
    },
    querySelectorAll: () => [],
  };
  return {
    content,
    title: `${path} at main`,
    getElementById: (id: string) =>
      id === "repo-source-tree"
        ? {
            dataset: { sourceUrl, currentPath: path },
            querySelector: (selector: string) => (selector === "#repo-source-tree-data" ? entries : null),
          }
        : null,
    querySelector: (selector: string) =>
      selector === '[role="main"]'
        ? { getAttribute: () => `${path} label` }
        : selector.includes(".repo-source-main")
          ? content
          : null,
  };
}

function fixture({ response = page(), ok = true, fail = false, pathname = `${source}/src/components` } = {}) {
  const documentListeners = new Map<string, Listener>();
  const windowListeners = new Map<string, Listener>();
  const location = {
    origin,
    pathname,
    search: "",
    hash: "",
    get href() {
      return `${origin}${this.pathname}${this.search}${this.hash}`;
    },
    assign: vi.fn(),
    reload: vi.fn(),
  };
  const history = {
    state: null as Record<string, unknown> | null,
    scrollRestoration: "auto",
    replaceState: vi.fn((state: Record<string, unknown>) => (history.state = state)),
    pushState: vi.fn((state: Record<string, unknown>, _title: string, url: URL) => {
      history.state = state;
      location.pathname = url.pathname;
    }),
  };
  const main = { replaceWith: vi.fn() };
  const attributes = new Map<string, string>();
  const container = {
    contains: () => true,
    querySelector: () => main,
    querySelectorAll: () => [],
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    removeAttribute: (name: string) => attributes.delete(name),
  };
  const tree = { dataset: { sourceUrl: source, currentPath: "src/components" }, dispatchEvent: vi.fn() };
  const fetch = vi.fn(async (url: string) => {
    if (fail) throw new TypeError("Failed to fetch");
    return { ok, url, text: async () => "<html>" };
  });
  const document = {
    title: "src/components at main",
    getElementById: (id: string) => ({ "repo-source-browser": container, "repo-source-tree": tree })[id] ?? null,
    querySelector: () => ({ setAttribute: vi.fn() }),
    addEventListener: (name: string, listener: Listener) => documentListeners.set(name, listener),
    adoptNode: (node: unknown) => node,
    createElement: vi.fn(),
  };
  class DOMParser {
    parseFromString() {
      return response;
    }
  }
  const scrollTo = vi.fn();
  runInNewContext(script, {
    window: { fetch, DOMParser },
    fetch,
    DOMParser,
    document,
    location,
    history,
    URL,
    AbortController,
    CustomEvent: class {
      type: string;
      init: { detail: unknown };
      constructor(type: string, init: { detail: unknown }) {
        this.type = type;
        this.init = init;
      }
    },
    scrollY: 120,
    scrollTo,
    addEventListener: (name: string, listener: Listener) => windowListeners.set(name, listener),
  });
  const click = (target: ReturnType<typeof link>, event: Record<string, unknown> = {}) => {
    const preventDefault = vi.fn();
    documentListeners.get("click")?.({
      defaultPrevented: false,
      button: 0,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      altKey: false,
      target: { closest: () => target },
      preventDefault,
      ...event,
    });
    return preventDefault;
  };
  const settle = () => new Promise(resolve => setTimeout(resolve));
  const popstate = () => windowListeners.get("popstate")?.({});
  return { attributes, click, document, fetch, history, location, main, popstate, scrollTo, settle, tree };
}

describe("repository file tree navigation", () => {
  it("opens a folder in place: swaps the main content, pushes the URL and moves the tree selection", async () => {
    const f = fixture();
    const prevent = f.click(link(`${source}/src/components/avatar`));
    expect(prevent).toHaveBeenCalled();
    expect(f.attributes.get("aria-busy")).toBe("true");
    await f.settle();
    expect(f.fetch).toHaveBeenCalledWith(`${origin}${source}/src/components/avatar`, expect.anything());
    expect(f.history.replaceState).toHaveBeenCalledWith({ scrollY: 120 }, "");
    expect(f.history.pushState).toHaveBeenCalledWith({ scrollY: 0 }, "", expect.any(URL));
    expect(f.location.pathname).toBe(`${source}/src/components/avatar`);
    expect(f.document.title).toBe("src/components/avatar at main");
    expect(f.main.replaceWith).toHaveBeenCalled();
    expect(f.tree.dispatchEvent.mock.calls[0][0]).toMatchObject({
      type: "repo-source:navigate",
      init: { detail: { path: "src/components/avatar", entries } },
    });
    expect(f.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(f.attributes.has("aria-busy")).toBe(false);
    expect(f.location.assign).not.toHaveBeenCalled();
  });

  it("treats folder rows of the list, the parent link and the breadcrumb like tree folders", async () => {
    for (const target of [
      link(`${source}/src`, { kind: ".parent-link" }),
      link(`${source}/src`, { kind: ".repo-path a" }),
      link(`${source}/src/components/badge`, { kind: "", cell: true, directoryIcon: true }),
    ]) {
      const f = fixture();
      expect(f.click(target)).toHaveBeenCalled();
    }
  });

  it("leaves files, new tabs, other targets and other repositories to the browser", () => {
    const f = fixture();
    const file = link(`${source}/src/components/Button.tsx`, { kind: ".item-file" });
    const folder = link(`${source}/src/components/avatar`);
    expect(f.click(file)).not.toHaveBeenCalled();
    expect(f.click(link(`${source}/README.md`, { kind: "", cell: true }))).not.toHaveBeenCalled();
    expect(f.click(folder, { ctrlKey: true })).not.toHaveBeenCalled();
    expect(f.click(folder, { metaKey: true })).not.toHaveBeenCalled();
    expect(f.click(folder, { shiftKey: true })).not.toHaveBeenCalled();
    expect(f.click(folder, { button: 1 })).not.toHaveBeenCalled();
    expect(f.click(folder, { defaultPrevented: true })).not.toHaveBeenCalled();
    expect(f.click(link(`${source}/src`, { target: "_blank" }))).not.toHaveBeenCalled();
    expect(f.click(link("/acme/other/src/branch/main/src"))).not.toHaveBeenCalled();
    expect(f.click(link(source))).not.toHaveBeenCalled();
    expect(f.fetch).not.toHaveBeenCalled();
  });

  it("loads the page normally when the folder needs Forgejo's scripts, is not a listing or cannot be fetched", async () => {
    for (const options of [
      { response: page({ needsPageLoad: true }) },
      { response: page({ listing: false }) },
      { response: page({ sourceUrl: "/acme/design-system/src/branch/dev" }) },
      { ok: false },
      { fail: true },
    ]) {
      const f = fixture(options);
      f.click(link(`${source}/src/components/avatar`));
      await f.settle();
      expect(f.location.assign).toHaveBeenCalledWith(`${origin}${source}/src/components/avatar`);
      expect(f.history.pushState).not.toHaveBeenCalled();
      expect(f.main.replaceWith).not.toHaveBeenCalled();
    }
  });

  it("shows the folder of a history entry in place, restoring its scroll position", async () => {
    const f = fixture();
    f.click(link(`${source}/src/components/avatar`));
    await f.settle();
    f.location.pathname = `${source}/src/components`;
    f.history.state = { scrollY: 120 };
    f.popstate();
    await f.settle();
    expect(f.fetch).toHaveBeenLastCalledWith(`${origin}${source}/src/components`, expect.anything());
    expect(f.history.pushState).toHaveBeenCalledTimes(1);
    expect(f.scrollTo).toHaveBeenLastCalledWith(0, 120);
  });

  it("ignores hash changes and reloads history entries it cannot show in place", async () => {
    const f = fixture({ response: page({ listing: false }) });
    f.location.hash = "#L10";
    f.popstate();
    expect(f.fetch).not.toHaveBeenCalled();
    f.location.pathname = `${source}/src/components/Button.tsx`;
    f.popstate();
    await f.settle();
    expect(f.location.reload).toHaveBeenCalled();
    f.location.pathname = "/acme/design-system";
    f.popstate();
    expect(f.location.reload).toHaveBeenCalledTimes(2);
  });
});

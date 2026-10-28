import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./sidebar.js", import.meta.url), "utf8");

type Listener = (event: Record<string, unknown>) => void;

function events() {
  const listeners = new Map<string, Listener[]>();
  return {
    addEventListener(name: string, callback: Listener, options?: { signal?: AbortSignal }) {
      listeners.set(name, [...(listeners.get(name) ?? []), callback]);
      options?.signal?.addEventListener("abort", () =>
        listeners.set(
          name,
          (listeners.get(name) ?? []).filter(listener => listener !== callback)
        )
      );
    },
    emit: (name: string, event = {}) => listeners.get(name)?.forEach(listener => listener(event)),
    count: (name: string) => listeners.get(name)?.length ?? 0,
  };
}

class Element {}

function sidebarPage() {
  const control = () => ({ ...events(), setAttribute: vi.fn(), focus: vi.fn() });
  const expand = control();
  const collapse = control();
  const classes = new Set<string>();
  const aside = { top: 65, style: { setProperty: vi.fn() }, getBoundingClientRect: () => ({ top: aside.top }) };
  const page = Object.assign(new Element(), {
    ...events(),
    isConnected: true,
    parentElement: {},
    dataset: { themeSidebar: "org_repositories_sidebar_collapsed" },
    matches: (selector: string) => selector === "[data-theme-sidebar]",
    classList: { toggle: (name: string, value: boolean) => (value ? classes.add(name) : classes.delete(name)) },
    querySelectorAll: () => [expand, collapse],
    querySelector: (selector: string) =>
      selector === ":scope > .theme-sidebar" ? aside : selector.includes("expand") ? expand : collapse,
  });
  return { page, expand, collapse, classes, aside };
}

function fixture({ mobile = false, stored = "false", storageBlocked = false, replaceable = false } = {}) {
  const media = { ...events(), matches: mobile };
  const storage = {
    getItem: vi.fn(() => {
      if (storageBlocked) throw new Error("Storage disabled");
      return stored;
    }),
    setItem: vi.fn(),
  };
  const { page, expand, collapse, classes, aside } = sidebarPage();
  const document = {
    ...events(),
    querySelectorAll: () => [page],
    querySelector: (selector: string) => (replaceable && selector.startsWith("#notification_div") ? page : null),
  };
  const observers: { target: unknown; options: unknown; callback: (records: unknown[]) => void }[] = [];
  runInNewContext(script, {
    document,
    Element,
    AbortController,
    MutationObserver: class {
      callback: (records: unknown[]) => void;
      constructor(callback: (records: unknown[]) => void) {
        this.callback = callback;
      }
      observe(target: unknown, options: unknown) {
        observers.push({ target, options, callback: this.callback });
      }
    },
    matchMedia: () => media,
    localStorage: storage,
    requestAnimationFrame: (callback: () => void) => (callback(), 1),
  });
  // Clicks reach the page, which finds the toggle the event came from.
  const click = (control: unknown) => page.emit("click", { target: { closest: () => control } });
  return { media, storage, page, expand, collapse, classes, click, aside, document, observers };
}

describe("shared theme components", () => {
  it("runs the sidebar down to the footer instead of stopping above Forgejo's footer spacing", () => {
    const css = readFileSync(new URL("./sidebar.css", import.meta.url), "utf8");
    expect(css).toMatch(
      /\.full\.height:has\(> \.page-content\.theme-sidebar-layout\[data-theme-sidebar\]\) \{\s*padding-bottom: 0;/
    );
  });

  it("fits the sidebar beneath the navbar so its collapse toggle stays in view, and refits while scrolling", () => {
    const f = fixture();
    expect(f.aside.style.setProperty).toHaveBeenLastCalledWith("--theme-sidebar-offset", "65px");
    f.aside.top = -120;
    f.document.emit("scroll");
    expect(f.aside.style.setProperty).toHaveBeenLastCalledWith("--theme-sidebar-offset", "0px");
  });

  it("restores the desktop sidebar preference and moves focus to the available toggle", () => {
    const f = fixture({ stored: "true" });
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
    f.click(f.expand);
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
    expect(f.collapse.focus).toHaveBeenCalled();
    expect(f.expand.setAttribute).toHaveBeenLastCalledWith("aria-expanded", "true");
    expect(f.storage.setItem).toHaveBeenCalledWith("org_repositories_sidebar_collapsed", "false");
    f.click(f.collapse);
    expect(f.expand.focus).toHaveBeenCalled();
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
  });

  it("starts collapsed on mobile and never overwrites the desktop preference there", () => {
    const f = fixture({ mobile: true });
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
    f.click(f.expand);
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
    expect(f.storage.setItem).not.toHaveBeenCalled();
    f.media.matches = false;
    f.media.emit("change");
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
  });

  it("remains usable when storage is blocked", () => {
    const f = fixture({ storageBlocked: true });
    f.click(f.collapse);
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
  });

  it("only watches for a replaced page where Forgejo replaces one, and only its parent", () => {
    expect(fixture().observers).toEqual([]);
    const f = fixture({ replaceable: true });
    expect(f.observers).toEqual([
      { target: f.page.parentElement, options: { childList: true }, callback: expect.any(Function) },
    ]);
  });

  it("sets up a replaced notifications page and drops the listeners of the page it replaced", () => {
    const f = fixture({ replaceable: true });
    expect(f.document.count("scroll")).toBe(1);
    expect(f.media.count("change")).toBe(1);
    const next = sidebarPage();
    f.page.isConnected = false;
    f.observers[0].callback([{ addedNodes: [{}, next.page] }]);
    expect(f.document.count("scroll")).toBe(1);
    expect(f.media.count("change")).toBe(1);
    expect(f.page.count("click")).toBe(0);
    next.page.emit("click", { target: { closest: () => next.collapse } });
    expect(next.classes.has("theme-sidebar-collapsed")).toBe(true);
  });
});

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

type Box = { top: number; bottom: number };

/** "On this page": links to sections whose boxes the test moves, in a sidebar list 400px tall. */
function sections(boxes: Box[], hash = "") {
  const list = { scrollTop: 0, getBoundingClientRect: () => ({ top: 100, bottom: 500 }) };
  const links = boxes.map((_, index) => {
    const classes = new Set<string>();
    const attributes = new Map<string, string>();
    return {
      hash: `#release-${index}`,
      classes,
      attributes,
      classList: { toggle: (name: string, value: boolean) => (value ? classes.add(name) : classes.delete(name)) },
      setAttribute: (name: string, value: string) => attributes.set(name, value),
      removeAttribute: (name: string) => attributes.delete(name),
      getBoundingClientRect: () => ({ top: 120 + index * 32, bottom: 152 + index * 32 }),
    };
  });
  const nav = {
    ...events(),
    querySelectorAll: () => links,
    closest: () => list,
  };
  const targets = boxes.map(box => ({ getBoundingClientRect: () => box }));
  const getElementById = (id: string) => targets[Number(id.replace("release-", ""))] ?? null;
  const active = () => links.filter(link => link.classes.has("active")).map(link => link.hash);
  return { nav, links, list, boxes, getElementById, active, hash };
}

function sidebarPage(outline?: ReturnType<typeof sections>) {
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
      selector === "[data-theme-sidebar-outline]"
        ? (outline?.nav ?? null)
        : selector === ":scope > .theme-sidebar"
          ? aside
          : selector.includes("expand")
            ? expand
            : collapse,
  });
  return { page, expand, collapse, classes, aside };
}

function fixture({
  mobile = false,
  stored = "false",
  storageBlocked = false,
  replaceable = false,
  outline,
}: {
  mobile?: boolean;
  stored?: string;
  storageBlocked?: boolean;
  replaceable?: boolean;
  outline?: ReturnType<typeof sections>;
} = {}) {
  const media = { ...events(), matches: mobile };
  const storage = {
    getItem: vi.fn(() => {
      if (storageBlocked) throw new Error("Storage disabled");
      return stored;
    }),
    setItem: vi.fn(),
  };
  const { page, expand, collapse, classes, aside } = sidebarPage(outline);
  const document = {
    ...events(),
    querySelectorAll: () => [page],
    querySelector: (selector: string) => (replaceable && selector.startsWith("#notification_div") ? page : null),
    getElementById: (id: string) => outline?.getElementById(id) ?? null,
  };
  const observers: { target: unknown; options: unknown; callback: (records: unknown[]) => void }[] = [];
  const window = events();
  runInNewContext(script, {
    ...window,
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
    location: { hash: outline?.hash ?? "" },
    innerHeight: 800,
    matchMedia: () => media,
    localStorage: storage,
    // Runs the frame at once; it returns no handle, so the next scroll schedules another frame.
    requestAnimationFrame: (callback: () => void) => (callback(), 0),
  });
  // Clicks reach the page, which finds the toggle the event came from.
  const click = (control: unknown) =>
    page.emit("click", {
      target: { closest: (selector: string) => (selector === "[data-theme-sidebar-toggle]" ? control : null) },
    });
  // A click on an "On this page" entry reaches its nav first, then the page.
  const follow = (link: unknown) => {
    const event = { target: { closest: (selector: string) => (selector.endsWith("a") ? link : null) } };
    outline?.nav.emit("click", event);
    page.emit("click", event);
  };
  return { media, storage, page, expand, collapse, classes, click, follow, aside, document, observers };
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

  it("marks the section in view in On this page as the window scrolls", () => {
    const outline = sections([
      { top: 200, bottom: 600 },
      { top: 624, bottom: 1000 },
      { top: 1024, bottom: 1400 },
    ]);
    const f = fixture({ outline });
    expect(outline.active()).toEqual(["#release-0"]);
    expect(outline.links[0].attributes.get("aria-current")).toBe("location");
    // The first release has scrolled up until less than 80px of it is left in view.
    outline.boxes[0].bottom = 60;
    outline.boxes[1].top = 84;
    outline.boxes[1].bottom = 460;
    f.document.emit("scroll");
    expect(outline.active()).toEqual(["#release-1"]);
    expect(outline.links[0].attributes.has("aria-current")).toBe(false);
  });

  it("keeps a followed entry marked while its section starts in view, then tracks the scroll again", () => {
    const outline = sections([
      { top: -900, bottom: -500 },
      { top: -476, bottom: 300 },
      { top: 324, bottom: 500 },
    ]);
    const f = fixture({ outline });
    expect(outline.active()).toEqual(["#release-1"]);
    // The last release is short and at the end of the page, so following it cannot scroll it to the top.
    f.follow(outline.links[2]);
    f.document.emit("scroll");
    expect(outline.active()).toEqual(["#release-2"]);
    outline.boxes[2].top = -20;
    outline.boxes[1].bottom = 120;
    f.document.emit("scroll");
    expect(outline.active()).toEqual(["#release-1"]);
  });

  it("scrolls a marked entry into the sidebar's own list when the list is longer than the window", () => {
    const boxes = Array.from({ length: 20 }, (_, index) => ({ top: index * 400 - 7000, bottom: index * 400 - 6600 }));
    const outline = sections(boxes);
    fixture({ outline });
    // Entry 17 is in view (its bottom is below the reading line); its link sits at 664-696px, below the list's 500px.
    expect(outline.active()).toEqual(["#release-17"]);
    expect(outline.list.scrollTop).toBe(196);
  });

  it("keeps the mark while the open sidebar hides the sections on a phone", () => {
    const outline = sections([
      { top: -500, bottom: -100 },
      { top: -76, bottom: 300 },
    ]);
    const f = fixture({ outline });
    expect(outline.active()).toEqual(["#release-1"]);
    for (const box of outline.boxes) Object.assign(box, { top: 0, bottom: 0 });
    f.document.emit("scroll");
    expect(outline.active()).toEqual(["#release-1"]);
  });

  it("closes the open sidebar on a phone when an On this page entry is followed", () => {
    const outline = sections([{ top: 200, bottom: 600 }]);
    const f = fixture({ mobile: true, outline });
    f.click(f.expand);
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
    f.follow(outline.links[0]);
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
    expect(f.storage.setItem).not.toHaveBeenCalled();
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

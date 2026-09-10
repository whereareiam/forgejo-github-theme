import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("../public/assets/js/navbar-drawer.js", import.meta.url), "utf8");

type DrawerEvent = {
  target?: unknown;
  clientX?: number;
  clientY?: number;
  key?: string;
  shiftKey?: boolean;
  preventDefault?: () => void;
};

function events() {
  const listeners = new Map<string, ((event: DrawerEvent) => void)[]>();
  return {
    addEventListener(name: string, listener: (event: DrawerEvent) => void) {
      listeners.set(name, [...(listeners.get(name) ?? []), listener]);
    },
    emit(name: string, event: DrawerEvent = {}) {
      for (const listener of listeners.get(name) ?? []) listener(event);
    },
  };
}

function fixture() {
  const attributes = new Map<string, string>();
  const classes = new Set<string>();
  const closeButton = events();
  const toggle = { ...events(), setAttribute: attributes.set.bind(attributes), focus: vi.fn() };
  const media = { ...events(), matches: true };
  const window = events();
  const details = { open: true };
  const first = { tabIndex: 0, matches: () => false, getClientRects: () => [{}], focus: vi.fn() };
  const last = { ...first, focus: vi.fn() };
  let open = false;
  const drawerEvents = events();
  const drawer = {
    ...drawerEvents,
    dataset: {} as Record<string, string>,
    get open() {
      return open;
    },
    showModal: vi.fn(() => {
      open = true;
    }),
    close() {
      open = false;
      drawerEvents.emit("close");
    },
    querySelector: () => closeButton,
    querySelectorAll: (selector: string) => (selector === "details[open]" ? [details] : [first, last]),
    getBoundingClientRect: () => ({ left: 0, top: 0, right: 320, bottom: 800 }),
  };
  const end = { before: vi.fn() };
  const customLink = { nodeType: 1, textContent: "Custom link", nextSibling: end };
  const slot = { hidden: true, append: vi.fn() };
  const elements: Record<string, unknown> = {
    "navbar-drawer": drawer,
    "navbar-drawer-toggle": toggle,
    "navbar-extra-links-start": { nextSibling: customLink },
    "navbar-extra-links-end": end,
    "navbar-drawer-extra-links": slot,
  };
  const context = {
    document: {
      activeElement: first,
      getElementById: (id: string) => elements[id],
      documentElement: { classList: { add: classes.add.bind(classes), remove: classes.delete.bind(classes) } },
    },
    matchMedia: () => media,
    window,
  };
  runInNewContext(script, context);
  return {
    drawer,
    toggle,
    closeButton,
    media,
    window,
    attributes,
    classes,
    details,
    customLink,
    end,
    slot,
    context,
    first,
    last,
  };
}

describe("mobile navigation drawer", () => {
  it("opens once as a modal and restores focus, scroll, and disclosure state on close", () => {
    const f = fixture();
    f.toggle.emit("click");
    f.toggle.emit("click");
    expect(f.drawer.showModal).toHaveBeenCalledTimes(1);
    expect(f.attributes.get("aria-expanded")).toBe("true");
    expect(f.classes.has("navbar-drawer-open")).toBe(true);

    f.closeButton.emit("click");
    expect(f.drawer.open).toBe(false);
    expect(f.attributes.get("aria-expanded")).toBe("false");
    expect(f.classes.has("navbar-drawer-open")).toBe(false);
    expect(f.details.open).toBe(false);
    expect(f.toggle.focus).toHaveBeenCalledOnce();
  });

  it("only dismisses gestures that begin and end on the backdrop", () => {
    const f = fixture();
    f.toggle.emit("click");
    f.drawer.emit("pointerdown", { target: f.drawer, clientX: 100, clientY: 100 });
    f.drawer.emit("click", { target: f.drawer, clientX: 350, clientY: 100 });
    expect(f.drawer.open).toBe(true);
    f.drawer.emit("pointerdown", { target: f.drawer, clientX: 350, clientY: 100 });
    f.drawer.emit("click", { target: f.drawer, clientX: 350, clientY: 100 });
    expect(f.drawer.open).toBe(false);
  });

  it("cycles keyboard focus across the first and last available drawer controls", () => {
    const f = fixture();
    const preventDefault = vi.fn();
    f.toggle.emit("click");
    f.drawer.emit("keydown", { key: "Tab", shiftKey: true, preventDefault });
    expect(f.last.focus).toHaveBeenCalledOnce();
    f.context.document.activeElement = f.last;
    f.drawer.emit("keydown", { key: "Tab", shiftKey: false, preventDefault });
    expect(f.first.focus).toHaveBeenCalledOnce();
    expect(preventDefault).toHaveBeenCalledTimes(2);
  });

  it("closes when crossing to desktop and does not reopen there", () => {
    const f = fixture();
    f.toggle.emit("click");
    f.media.matches = false;
    f.media.emit("change");
    f.toggle.emit("click");
    expect(f.drawer.open).toBe(false);
    expect(f.drawer.showModal).toHaveBeenCalledTimes(1);
    expect(f.classes.has("navbar-drawer-open")).toBe(false);
    expect(f.toggle.focus).not.toHaveBeenCalled();
  });

  it("moves existing custom links into the drawer and restores the same nodes", () => {
    const f = fixture();
    f.toggle.emit("click");
    expect(f.slot.hidden).toBe(false);
    expect(f.slot.append).toHaveBeenCalledWith(f.customLink);
    f.drawer.close();
    expect(f.end.before).toHaveBeenCalledWith(f.customLink);
  });

  it("cleans up before leaving the page and ignores duplicate script initialization", () => {
    const f = fixture();
    runInNewContext(script, f.context);
    f.toggle.emit("click");
    f.window.emit("pagehide");
    expect(f.drawer.open).toBe(false);
    expect(f.drawer.showModal).toHaveBeenCalledOnce();
    expect(f.classes.has("navbar-drawer-open")).toBe(false);
  });
});

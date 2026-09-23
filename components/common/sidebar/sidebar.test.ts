import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./sidebar.js", import.meta.url), "utf8");

function events() {
  const listeners = new Map<string, (event: Record<string, unknown>) => void>();
  return {
    addEventListener: (name: string, callback: (event: Record<string, unknown>) => void) =>
      listeners.set(name, callback),
    emit: (name: string, event = {}) => listeners.get(name)?.(event),
  };
}

function fixture({ mobile = false, stored = "false", storageBlocked = false } = {}) {
  const media = { ...events(), matches: mobile };
  const storage = {
    getItem: vi.fn(() => {
      if (storageBlocked) throw new Error("Storage disabled");
      return stored;
    }),
    setItem: vi.fn(),
  };
  const control = () => ({ ...events(), setAttribute: vi.fn(), focus: vi.fn() });
  const expand = control();
  const collapse = control();
  const classes = new Set<string>();
  const page = {
    dataset: { themeSidebar: "org_repositories_sidebar_collapsed" },
    classList: { toggle: (name: string, value: boolean) => (value ? classes.add(name) : classes.delete(name)) },
    querySelectorAll: () => [expand, collapse],
    querySelector: (selector: string) => (selector.includes("expand") ? expand : collapse),
  };
  const document = {
    ...events(),
    querySelectorAll: () => [page],
  };
  runInNewContext(script, { document, matchMedia: () => media, localStorage: storage });
  return { media, storage, expand, collapse, classes };
}

describe("shared theme components", () => {
  it("restores the desktop sidebar preference and moves focus to the available toggle", () => {
    const f = fixture({ stored: "true" });
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
    f.expand.emit("click");
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
    expect(f.collapse.focus).toHaveBeenCalled();
    expect(f.expand.setAttribute).toHaveBeenLastCalledWith("aria-expanded", "true");
    expect(f.storage.setItem).toHaveBeenCalledWith("org_repositories_sidebar_collapsed", "false");
    f.collapse.emit("click");
    expect(f.expand.focus).toHaveBeenCalled();
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
  });

  it("starts collapsed on mobile and never overwrites the desktop preference there", () => {
    const f = fixture({ mobile: true });
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
    f.expand.emit("click");
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
    expect(f.storage.setItem).not.toHaveBeenCalled();
    f.media.matches = false;
    f.media.emit("change");
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(false);
  });

  it("remains usable when storage is blocked", () => {
    const f = fixture({ storageBlocked: true });
    f.collapse.emit("click");
    expect(f.classes.has("theme-sidebar-collapsed")).toBe(true);
  });
});

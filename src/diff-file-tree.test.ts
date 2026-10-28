import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("../public/assets/js/diff-file-tree.js", import.meta.url), "utf8");

type Listener = (event: Record<string, unknown>) => void;

function element(...initial: string[]) {
  const classes = new Set(initial);
  const attributes = new Map<string, string>();
  const listeners = new Map<string, Listener[]>();
  return {
    classes,
    attributes,
    children: [],
    dataset: { showText: "Show file tree", hideText: "Hide file tree" },
    classList: {
      add: (name: string) => classes.add(name),
      remove: (name: string) => classes.delete(name),
      contains: (name: string) => classes.has(name),
      toggle: (name: string, force = !classes.has(name)) => (force ? classes.add(name) : classes.delete(name), force),
    },
    getAttribute: (name: string) => attributes.get(name) ?? null,
    setAttribute: (name: string, value: unknown) => attributes.set(name, String(value)),
    addEventListener: (name: string, listener: Listener) =>
      listeners.set(name, [...(listeners.get(name) ?? []), listener]),
    emit: (name: string, event: Record<string, unknown> = {}) =>
      listeners.get(name)?.forEach(listener => listener(event)),
    append: vi.fn(),
    replaceChildren: vi.fn(),
    querySelector: () => null,
    querySelectorAll: () => [],
  };
}

// The template sets the first state before paint: the tree is shown, or the container is marked as without it.
function fixture({ phone = false, treeVisible = true } = {}) {
  const tree = element(...(treeVisible ? [] : ["tw-hidden"]));
  const container = element("diff-has-file-tree", ...(treeVisible ? [] : ["diff-file-tree-hidden"]));
  const toggle = element();
  const media = { ...element(), matches: phone };
  const observers: { target: unknown; callback: () => void }[] = [];
  const elements: Record<string, unknown> = {
    "diff-file-tree": tree,
    "diff-tree-filter": element(),
    "diff-container": container,
  };
  const selectors: Record<string, unknown> = {
    ".diff-tree-options .theme-menu-popover": element(),
    ".diff-tree-empty": element(),
    ".diff-toggle-file-tree-button": toggle,
  };
  runInNewContext(script, {
    window: {},
    document: {
      activeElement: null,
      getElementById: (id: string) => elements[id] ?? null,
      querySelector: (selector: string) => selectors[selector] ?? null,
      querySelectorAll: () => [],
      createElement: () => element(),
      createTextNode: () => ({}),
    },
    matchMedia: () => media,
    requestAnimationFrame: () => 1,
    MutationObserver: class {
      callback: () => void;
      constructor(callback: () => void) {
        this.callback = callback;
      }
      observe(target: unknown) {
        observers.push({ target, callback: this.callback });
      }
    },
  });
  // Forgejo's own toggle shows and hides the tree with tw-hidden.
  const forgejoToggles = () => {
    tree.classList.toggle("tw-hidden");
    for (const observer of observers) if (observer.target === tree) observer.callback();
  };
  return { tree, container, toggle, media, forgejoToggles };
}

describe("diff file tree toggle", () => {
  it("keeps the layout and the toggle in step with the tree on desktop", () => {
    const f = fixture();
    expect(f.toggle.classes.has("active")).toBe(true);
    expect(f.toggle.attributes.get("aria-expanded")).toBe("true");
    f.forgejoToggles();
    expect(f.container.classes.has("diff-file-tree-hidden")).toBe(true);
    expect(f.toggle.classes.has("active")).toBe(false);
    expect(f.toggle.attributes.get("aria-label")).toBe("Show file tree");
    f.forgejoToggles();
    expect(f.container.classes.has("diff-file-tree-hidden")).toBe(false);
    expect(f.toggle.classes.has("active")).toBe(true);
  });

  it("shows the toggle active on phones only while the tree is open above the files", () => {
    const f = fixture({ phone: true, treeVisible: false });
    expect(f.toggle.classes.has("active")).toBe(false);
    const event = { stopImmediatePropagation: vi.fn() };
    f.toggle.emit("click", event);
    // Forgejo's own handler then shows the tree, which must not mark the toggle again.
    expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    f.forgejoToggles();
    expect(f.container.classes.has("diff-mobile-tree-open")).toBe(true);
    expect(f.toggle.classes.has("active")).toBe(true);
    f.toggle.emit("click", event);
    expect(event.stopImmediatePropagation).toHaveBeenCalledOnce();
    expect(f.container.classes.has("diff-mobile-tree-open")).toBe(false);
    expect(f.toggle.classes.has("active")).toBe(false);
    expect(f.container.classes.has("diff-file-tree-hidden")).toBe(false);
  });
});

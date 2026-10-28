import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("../public/assets/js/repo-release-editor.js", import.meta.url), "utf8");
type Event = { type?: string; key?: string; target?: unknown; preventDefault?: () => void };

function events() {
  const listeners = new Map<string, ((event: Event) => void)[]>();
  const sent: Event[] = [];
  return {
    sent,
    addEventListener(name: string, listener: (event: Event) => void) {
      listeners.set(name, [...(listeners.get(name) ?? []), listener]);
    },
    emit(name: string, event: Event = {}) {
      for (const listener of listeners.get(name) ?? []) listener(event);
    },
    dispatchEvent(event: Event) {
      sent.push(event);
    },
  };
}

function element(dataset: Record<string, string> = {}) {
  const attributes = new Map<string, string>();
  return {
    dataset,
    hidden: false,
    textContent: "",
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    removeAttribute: (name: string) => attributes.delete(name),
    hasAttribute: (name: string) => attributes.has(name),
  };
}

function fixture(value = "") {
  const summary = { focus: vi.fn() };
  const details = { ...events(), open: false, querySelector: () => summary };
  const label = element();
  const createText = element();
  const create = { ...element({ template: "Create tag %s" }), hidden: true, querySelector: () => createText };
  const tags = ["v2.0.0-rc.1", "v1.2.0", "v1.1.0"].map(tag => {
    const row = { ...element({ tag }), closest: (): unknown => row };
    return row;
  });
  const picker = {
    ...events(),
    dataset: { emptyLabel: "Tag name" },
    querySelector: (selector: string) =>
      ({
        ".theme-dropdown": details,
        "[data-theme-dropdown-label]": label,
        ".theme-release-tag-create": create,
      })[selector],
    querySelectorAll: () => tags,
  };
  const input = { ...events(), value, focus: vi.fn(), closest: () => picker };
  const document = { getElementById: (id: string) => (id === "tag-name" ? input : null) };
  class KeyboardEvent {
    type: string;
    constructor(type: string) {
      this.type = type;
    }
  }
  runInNewContext(script, { document, KeyboardEvent });
  return { input, picker, details, summary, label, create, createText, tags };
}

describe("release tag menu", () => {
  it("filters the tags and offers to create a name that is not one of them", () => {
    const f = fixture();
    expect(f.label.textContent).toBe("Tag name");
    expect(f.create.hidden).toBe(true);
    f.input.value = "v1.";
    f.input.emit("input");
    expect(f.tags.map(tag => tag.hidden)).toEqual([true, false, false]);
    expect(f.create.hidden).toBe(false);
    expect(f.createText.textContent).toBe("Create tag v1.");
    expect(f.label.textContent).toBe("v1.");
    // Forgejo's own handler listens for keyup only; typing and pasting both reach it.
    expect(f.input.sent.map(event => event.type)).toEqual(["keyup"]);
    f.input.value = "v1.2.0";
    f.input.emit("input");
    expect(f.create.hidden).toBe(true);
    expect(f.tags[1].hasAttribute("aria-current")).toBe(true);
  });

  it("fills Forgejo's tag field from a picked tag", () => {
    const f = fixture();
    f.picker.emit("click", { target: f.tags[2] });
    expect(f.input.value).toBe("v1.1.0");
    expect(f.input.sent.map(event => event.type)).toEqual(["keyup"]);
    expect(f.label.textContent).toBe("v1.1.0");
    expect(f.summary.focus).toHaveBeenCalled();
  });

  it("keeps Enter in the menu and opens the menu for the browser's required message", () => {
    const f = fixture("v1.3");
    expect(f.label.textContent).toBe("v1.3");
    f.details.open = true;
    const preventDefault = vi.fn();
    f.input.emit("keydown", { key: "Enter", preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(f.details.open).toBe(false);
    f.input.emit("invalid");
    expect(f.details.open).toBe(true);
    f.details.emit("toggle");
    expect(f.input.focus).toHaveBeenCalled();
  });
});

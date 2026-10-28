import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./editor.js", import.meta.url), "utf8");

type Listener = (event: Record<string, unknown>) => void;
type Field = { willValidate: boolean; valid: boolean; inDialog: boolean; reportValidity: () => boolean };

type Control = { focus: () => void; getClientRects: () => unknown[] };

function fixture({ invokers = true, error = false, fields = [] as Field[], refused = [] as Control[] } = {}) {
  const listeners = new Map<string, Listener>();
  const docListeners = new Map<string, Listener>();
  const formListeners = new Map<string, Listener>();
  const observers: (() => void)[] = [];
  const commit = { disabled: false };
  const openers = [{ disabled: false }];
  const form = {
    elements: fields.map(field => ({ ...field, checkValidity: () => field.valid })),
    addEventListener: (name: string, fn: Listener) => formListeners.set(name, fn),
  };
  const dialog = {
    open: false,
    closest: () => form,
    contains: (element: { inDialog: boolean }) => element.inDialog,
    querySelector: (selector: string) => (selector === ".field.error" && error ? {} : null),
    querySelectorAll: () => refused,
    addEventListener: (name: string, fn: Listener) => listeners.set(name, fn),
    showModal: vi.fn(() => (dialog.open = true)),
    close: vi.fn(() => (dialog.open = false)),
  };
  const document = {
    getElementById: (id: string) => ({ "theme-commit-dialog": dialog, "commit-button": commit })[id],
    querySelectorAll: () => openers,
    addEventListener: (name: string, fn: Listener) => docListeners.set(name, fn),
  };
  class MutationObserver {
    constructor(callback: () => void) {
      observers.push(callback);
    }
    observe() {}
  }
  const HTMLButtonElement = function () {};
  if (invokers) HTMLButtonElement.prototype = { commandForElement: null } as never;
  runInNewContext(script, { document, MutationObserver, HTMLButtonElement, Array, Boolean });
  const mutate = () => observers.forEach(callback => callback());
  return { listeners, docListeners, formListeners, commit, openers, dialog, mutate };
}

const pathField = (valid: boolean): Field => ({
  willValidate: true,
  valid,
  inDialog: false,
  reportValidity: vi.fn(() => valid),
});

describe("file editor commit dialog", () => {
  it("keeps Commit changes… disabled while Forgejo's commit button is", () => {
    const f = fixture();
    f.commit.disabled = true;
    f.mutate();
    expect(f.openers[0].disabled).toBe(true);
    f.commit.disabled = false;
    f.mutate();
    expect(f.openers[0].disabled).toBe(false);
  });

  it("reports a missing file name on the page instead of opening the dialog", () => {
    const path = pathField(false);
    const f = fixture({ fields: [path, { ...pathField(false), inDialog: true }] });
    const event = { command: "show-modal", preventDefault: vi.fn() };
    f.listeners.get("command")!(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(path.reportValidity).toHaveBeenCalled();
  });

  it("lets the dialog open when the fields outside it are valid, whatever is inside it", () => {
    const f = fixture({ fields: [pathField(true), { ...pathField(false), inDialog: true }] });
    const event = { command: "show-modal", preventDefault: vi.fn() };
    f.listeners.get("command")!(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
    f.listeners.get("command")!({ command: "close", preventDefault: event.preventDefault });
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("opens the dialog when Forgejo returns the form with a refused field, focusing the shown one", () => {
    const hidden = { focus: vi.fn(), getClientRects: () => [] };
    const shown = { focus: vi.fn(), getClientRects: () => [{}] };
    expect(fixture({ error: true, refused: [hidden, shown] }).dialog.showModal).toHaveBeenCalled();
    expect(hidden.focus).not.toHaveBeenCalled();
    expect(shown.focus).toHaveBeenCalled();
    expect(fixture().dialog.showModal).not.toHaveBeenCalled();
  });

  it("opens the dialog instead of committing when Enter submits the form from the file name", () => {
    const f = fixture({ fields: [pathField(true)] });
    const enter = { preventDefault: vi.fn() };
    f.formListeners.get("submit")!(enter);
    expect(enter.preventDefault).toHaveBeenCalled();
    expect(f.dialog.showModal).toHaveBeenCalledTimes(1);
    const commit = { preventDefault: vi.fn() };
    f.formListeners.get("submit")!(commit);
    expect(commit.preventDefault).not.toHaveBeenCalled();
    expect(f.dialog.showModal).toHaveBeenCalledTimes(1);
  });

  it("opens and closes the dialog itself in browsers without command buttons", () => {
    const f = fixture({ invokers: false, fields: [pathField(true)] });
    const button = (command: string, disabled = false) => ({
      target: { closest: () => ({ disabled, getAttribute: () => command }) },
    });
    expect(fixture().docListeners.has("click")).toBe(false);
    f.docListeners.get("click")!(button("show-modal", true));
    expect(f.dialog.showModal).not.toHaveBeenCalled();
    f.docListeners.get("click")!(button("show-modal"));
    expect(f.dialog.showModal).toHaveBeenCalledTimes(1);
    f.docListeners.get("click")!(button("close"));
    expect(f.dialog.close).toHaveBeenCalled();
  });
});

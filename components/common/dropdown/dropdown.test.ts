import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./dropdown.js", import.meta.url), "utf8");
function fixture() {
  const listeners = new Map<string, (event: Record<string, unknown>) => void>();
  const makeMenu = () => {
    const summary = { focus: vi.fn() };
    const panel = { style: { translate: "" }, getBoundingClientRect: () => ({ left: 16, right: 316 }) };
    const inside = { closest: () => null };
    const menu = {
      open: false,
      contains: (target: unknown) => target === inside,
      querySelector: (selector: string) => (selector === "summary" ? summary : panel),
      matches: () => menu.open,
    };
    return { menu, summary, inside, panel };
  };
  const first = makeMenu();
  const second = makeMenu();
  const document = {
    documentElement: { clientWidth: 390 },
    addEventListener: (name: string, callback: (event: Record<string, unknown>) => void) =>
      listeners.set(name, callback),
    querySelectorAll: () => [first.menu, second.menu].filter(menu => menu.open),
  };
  runInNewContext(script, { document, window: document });
  return { first, second, emit: (name: string, event: Record<string, unknown>) => listeners.get(name)?.(event) };
}

describe("shared dropdown variants", () => {
  it("keeps a multiple-choice menu open for inside clicks and dismisses it outside without stealing focus", () => {
    const f = fixture();
    f.first.menu.open = true;
    f.emit("click", { target: f.first.inside });
    expect(f.first.menu.open).toBe(true);
    f.emit("click", { target: { closest: () => null } });
    expect(f.first.menu.open).toBe(false);
    expect(f.first.summary.focus).not.toHaveBeenCalled();
  });
  it("closes on Escape or the close action and returns focus to the trigger", () => {
    const f = fixture();
    f.first.menu.open = true;
    f.emit("keydown", { key: "Escape" });
    expect(f.first.menu.open).toBe(false);
    expect(f.first.summary.focus).toHaveBeenCalledOnce();
    f.first.menu.open = true;
    const close = { closest: () => f.first.menu };
    f.emit("click", { target: { closest: (selector: string) => (selector.includes("close") ? close : null) } });
    expect(f.first.menu.open).toBe(false);
    expect(f.first.summary.focus).toHaveBeenCalledTimes(2);
  });
  it("closes the previous menu when another is opened from the keyboard", () => {
    const f = fixture();
    f.first.menu.open = true;
    f.second.menu.open = true;
    f.emit("toggle", { target: f.second.menu });
    expect(f.first.menu.open).toBe(false);
    expect(f.second.menu.open).toBe(true);
    expect(f.first.summary.focus).not.toHaveBeenCalled();
  });
  it("keeps popovers inside the viewport at either screen edge", () => {
    const f = fixture();
    f.first.menu.open = true;
    f.first.panel.getBoundingClientRect = () => ({ left: -90, right: 210 });
    f.emit("toggle", { target: f.first.menu });
    expect(f.first.panel.style.translate).toBe("106px 0");
    f.first.panel.getBoundingClientRect = () => ({ left: 300, right: 600 });
    f.emit("resize", {});
    expect(f.first.panel.style.translate).toBe("-226px 0");
  });
  it("closes a single-choice menu on selection and returns focus", () => {
    const f = fixture();
    f.first.menu.open = true;
    const input = {
      type: "radio",
      checked: true,
      closest: (selector: string) => (selector.includes("single") ? f.first.menu : null),
    };
    f.emit("change", { target: input });
    expect(f.first.menu.open).toBe(false);
    expect(f.first.summary.focus).toHaveBeenCalledOnce();
  });
  it("closes action menus without cancelling the action", () => {
    const f = fixture();
    f.first.menu.open = true;
    const action = { disabled: false, closest: () => f.first.menu };
    f.emit("click", { target: { closest: (selector: string) => (selector.includes("actions") ? action : null) } });
    expect(f.first.menu.open).toBe(false);
  });
});

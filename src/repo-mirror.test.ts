import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("../public/assets/js/repo-mirror.js", import.meta.url), "utf8");
type InputEvent = { pointerType?: string; relatedTarget?: unknown; target?: unknown; key?: string };

function events() {
  const listeners = new Map<string, ((event: InputEvent) => void)[]>();
  return {
    addEventListener(name: string, listener: (event: InputEvent) => void) {
      listeners.set(name, [...(listeners.get(name) ?? []), listener]);
    },
    emit(name: string, event: InputEvent = {}) {
      for (const listener of listeners.get(name) ?? []) listener(event);
    },
  };
}

function fixture() {
  const summary = { ...events(), focus: vi.fn() };
  const link = {};
  const panel = { style: { translate: "", maxWidth: "" }, getBoundingClientRect: () => ({ left: -100, right: 240 }) };
  const details = {
    ...events(),
    open: false,
    contains: (element: unknown) => element === summary || element === link,
    querySelector: (selector: string) => (selector === "summary" ? summary : panel),
  };
  const document = {
    ...events(),
    activeElement: null as unknown,
    documentElement: { clientWidth: 390 },
    querySelectorAll: () => [details],
  };
  const window = events();
  runInNewContext(script, { document, window });
  return { details, summary, link, panel, document, window };
}

describe("mirror badge disclosure", () => {
  it("opens on mouse hover, stays open while the source link is focused, and closes on exit", () => {
    const f = fixture();
    f.details.emit("pointerenter", { pointerType: "mouse" });
    expect(f.details.open).toBe(true);
    expect(f.panel.style.maxWidth).toBe("358px");
    expect(f.panel.style.translate).toBe("116px 0");
    f.document.activeElement = f.link;
    f.details.emit("pointerleave");
    expect(f.details.open).toBe(true);
    f.document.activeElement = null;
    f.details.emit("focusout", { relatedTarget: null });
    expect(f.details.open).toBe(false);
  });

  it("leaves the first touch tap to the native summary toggle", () => {
    const f = fixture();
    f.details.emit("pointerenter", { pointerType: "touch" });
    f.summary.emit("pointerdown");
    f.document.emit("pointerup", { target: f.summary });
    // Touch browsers focus between pointerup and the default click action.
    f.details.emit("focusin");
    expect(f.details.open).toBe(false);
    f.document.emit("click", { target: f.summary });
    // The browser's default click toggles details after focus.
    f.details.open = true;
    f.details.emit("toggle");
    expect(f.panel.style.translate).toBe("116px 0");
    f.document.emit("pointerdown", { target: {} });
    expect(f.details.open).toBe(false);
  });

  it("opens on keyboard focus and dismisses with Escape without reopening on focus restoration", () => {
    const f = fixture();
    f.document.activeElement = f.summary;
    f.details.emit("focusin");
    expect(f.details.open).toBe(true);
    f.document.activeElement = f.link;
    f.summary.focus.mockImplementation(() => f.details.emit("focusin"));
    f.document.emit("keydown", { key: "Escape" });
    expect(f.details.open).toBe(false);
    expect(f.summary.focus).toHaveBeenCalledOnce();
    f.details.emit("focusout", { relatedTarget: null });
    f.details.emit("focusin");
    expect(f.details.open).toBe(true);
  });

  it("repositions an open panel when the viewport changes", () => {
    const f = fixture();
    f.details.emit("focusin");
    f.panel.getBoundingClientRect = () => ({ left: 200, right: 540 });
    f.window.emit("resize");
    expect(f.panel.style.translate).toBe("-166px 0");
  });

  it("keeps native mirror address sanitization, visibility precedence and relative sync time", () => {
    const template = readFileSync(new URL("../templates/repo/mirror_badge.tmpl", import.meta.url), "utf8");
    const header = readFileSync(new URL("../templates/repo/header.tmpl", import.meta.url), "utf8");
    expect(header).toContain('{{if $.PullMirror}}\n\t\t\t\t\t\t{{template "repo/mirror_badge" $}}');
    expect(header).not.toContain('ctx.Locale.Tr "repo.mirror_from"');
    expect(template).toContain("MirrorRemoteAddress .Context .PullMirror");
    expect(template).toContain('href="{{$address.Address}}"');
    expect(template).toContain(
      '{{if .Repository.IsPrivate}}{{ctx.Locale.Tr "repo.desc.private"}}{{else if .Repository.Owner.Visibility.IsPrivate}}'
    );
    expect(template).toContain('{{ctx.Locale.Tr "repo.desc.internal"}}');
    expect(template).toContain('{{ctx.Locale.Tr "settings.visibility.public"}}{{end}} mirror');
    expect(template).toContain("{{if .PullMirror.UpdatedUnix}}");
    expect(template).toContain("{{DateUtils.TimeSince .PullMirror.UpdatedUnix}}");
    expect(template).toContain("{{AssetUrlPrefix}}/css/repo-mirror.css");
    expect(template).toContain("{{AssetUrlPrefix}}/js/repo-mirror.js");
  });
});

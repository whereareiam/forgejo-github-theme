import { describe, expect, it } from "vitest";

import {
  formatChangeReport,
  formatDiffSize,
  formatDriftReport,
  parseDriftArguments,
  parseForgejoVersion,
  parseNumstat,
} from "./templateDrift.ts";

describe("parseForgejoVersion", () => {
  it("names the release tag with or without the v", () => {
    expect(parseForgejoVersion("17.0.0")).toEqual({ version: "17.0.0", tag: "v17.0.0" });
    expect(parseForgejoVersion("v17.1.2")).toEqual({ version: "17.1.2", tag: "v17.1.2" });
    expect(parseForgejoVersion("18.0.0-rc0")).toEqual({ version: "18.0.0-rc0", tag: "v18.0.0-rc0" });
  });

  it("rejects anything that is not a full release", () => {
    for (const input of ["17", "17.0", "latest", "v17.0.0-", "17.0.0-rootless/x", ""]) {
      expect(() => parseForgejoVersion(input)).toThrow(/not a Forgejo release/);
    }
  });
});

describe("parseDriftArguments", () => {
  it("compares against the pinned release by default", () => {
    expect(parseDriftArguments([], "17.0.0")).toEqual({ base: { version: "17.0.0", tag: "v17.0.0" } });
  });

  it("takes a second release to compare Forgejo's changes", () => {
    const { base, next } = parseDriftArguments(["17.0.0", "17.1.0"], "16.0.0");
    expect(base.tag).toBe("v17.0.0");
    expect(next?.tag).toBe("v17.1.0");
  });

  it("refuses more than two releases", () => {
    expect(() => parseDriftArguments(["1.0.0", "2.0.0", "3.0.0"], "17.0.0")).toThrow(/Usage/);
  });
});

describe("parseNumstat", () => {
  it("reads the lines added and removed", () => {
    expect(parseNumstat("12\t3\ta.tmpl => b.tmpl\n")).toEqual({ added: 12, removed: 3 });
  });

  it("reads no output as identical files", () => {
    expect(parseNumstat("")).toEqual({ added: 0, removed: 0 });
  });

  it("fails on binary files and several files", () => {
    expect(() => parseNumstat("-\t-\ta.png\n")).toThrow(/Unexpected/);
    expect(() => parseNumstat("1\t2\ta\n3\t4\tb\n")).toThrow(/Unexpected/);
  });
});

describe("formatDiffSize", () => {
  it("shows the lines added and removed", () => {
    expect(formatDiffSize({ added: 4, removed: 0 })).toBe("+4 -0");
    expect(formatDiffSize({ added: 0, removed: 0 })).toBe("identical");
  });
});

describe("formatDriftReport", () => {
  it("lists the largest overrides first, then the theme's own templates", () => {
    const report = formatDriftReport(parseForgejoVersion("17.0.0"), [
      { path: "repo/home.tmpl", size: { added: 2, removed: 1 } },
      { path: "user/profile_empty.tmpl" },
      { path: "base/head_navbar.tmpl", size: { added: 120, removed: 80 } },
      { path: "repo/header.tmpl", size: { added: 0, removed: 0 } },
    ]);
    expect(report).toBe(
      [
        "3 templates overriding Forgejo v17.0.0, by lines the theme added and removed:",
        "   +120 -80  base/head_navbar.tmpl",
        "      +2 -1  repo/home.tmpl",
        "  identical  repo/header.tmpl",
        "",
        "1 template without a file in Forgejo v17.0.0; check that none replaces a renamed one:",
        "  user/profile_empty.tmpl",
      ].join("\n")
    );
  });
});

describe("formatChangeReport", () => {
  const base = parseForgejoVersion("17.0.0");
  const next = parseForgejoVersion("17.1.0");

  it("summarises the changes and prints Forgejo's diffs", () => {
    const report = formatChangeReport(base, next, [
      { path: "repo/home.tmpl", kind: "changed", size: { added: 1, removed: 1 }, diff: "-old\n+new\n" },
      { path: "repo/gone.tmpl", kind: "removed" },
    ]);
    expect(report).toBe(
      [
        "Forgejo v17.0.0..v17.1.0 changed 2 templates the theme overrides:",
        "  removed  repo/gone.tmpl",
        "    +1 -1  repo/home.tmpl",
        "",
        "-old\n+new",
      ].join("\n")
    );
  });

  it("says when nothing needs porting", () => {
    expect(formatChangeReport(base, next, [])).toBe(
      "Forgejo v17.0.0..v17.1.0 changed none of the overridden templates."
    );
  });
});

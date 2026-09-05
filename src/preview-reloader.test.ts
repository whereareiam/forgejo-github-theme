import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { PreviewConfig } from "../dev/preview/config/PreviewConfig.ts";
import { AutoLoginTemplate } from "../dev/preview/auth/AutoLoginTemplate.ts";
import { PreviewReloader } from "../dev/preview/theme/PreviewReloader.ts";

const directories: string[] = [];
afterEach(() => directories.splice(0).forEach(directory => rmSync(directory, { recursive: true, force: true })));

describe("local preview reload", () => {
  it("versions both auto-theme imports and scripts without changing source templates, and publishes only when ready", () => {
    const root = mkdtempSync(join(tmpdir(), "theme-preview-"));
    directories.push(root);
    mkdirSync(join(root, "dist"));
    mkdirSync(join(root, "templates", "repo"), { recursive: true });
    const template = '<script src="{{AssetUrlPrefix}}/js/diff-view.js" defer></script>';
    writeFileSync(join(root, "templates", "repo", "commit.tmpl"), template);
    writeFileSync(
      join(root, "dist", "theme-github-auto.css"),
      '@import "./theme-github-dark.css" (prefers-color-scheme: dark);\n@import "./theme-github-light.css" (prefers-color-scheme: light);'
    );
    const config = new PreviewConfig(root, { FORGEJO_PREVIEW_AUTO_LOGIN: "false" });
    const reload = new PreviewReloader(config);
    new AutoLoginTemplate(config).prepare();
    reload.prepare();
    expect(existsSync(join(root, "dist", "preview-revision.json"))).toBe(false);
    reload.publish();
    const first = JSON.parse(readFileSync(join(root, "dist", "preview-revision.json"), "utf8")).revision;
    const css = readFileSync(join(root, "dist", "theme-github-auto.css"), "utf8");
    expect(css).toContain(`theme-github-dark.css?preview=${first}`);
    expect(css).toContain(`theme-github-light.css?preview=${first}`);
    expect(readFileSync(join(root, "templates", "repo", "commit.tmpl"), "utf8")).toBe(template);
    expect(readFileSync(join(config.generatedTemplatesDirectory, "repo", "commit.tmpl"), "utf8")).toContain(
      `diff-view.js?preview=${first}`
    );
    expect(readFileSync(config.autoLoginTemplateFile, "utf8")).toContain('cache: "no-store"');
    new AutoLoginTemplate(config).prepare();
    reload.prepare();
    expect(JSON.parse(readFileSync(join(root, "dist", "preview-revision.json"), "utf8")).revision).toBe(first);
    reload.publish();
    const second = JSON.parse(readFileSync(join(root, "dist", "preview-revision.json"), "utf8")).revision;
    expect(second).not.toBe(first);
    expect(readFileSync(join(root, "dist", "theme-github-auto.css"), "utf8")).not.toContain(first);
  });
});

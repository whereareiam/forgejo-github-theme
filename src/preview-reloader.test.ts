import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { PreviewConfig } from "../dev/preview/config/PreviewConfig.ts";
import { CommandRunner } from "../dev/preview/CommandRunner.ts";
import { AutoLoginTemplate } from "../dev/preview/auth/AutoLoginTemplate.ts";
import { ForgejoCompose } from "../dev/preview/forgejo/ForgejoCompose.ts";
import { PreviewReloader } from "../dev/preview/theme/PreviewReloader.ts";
import { ThemeSynchronizer } from "../dev/preview/theme/ThemeSynchronizer.ts";

const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const directories: string[] = [];
afterEach(() => directories.splice(0).forEach(directory => rmSync(directory, { recursive: true, force: true })));

/** A dist/forgejo as `bun bundle` leaves it, with content versions on the imports and links. */
const project = () => {
  const root = mkdtempSync(join(tmpdir(), "theme-preview-"));
  directories.push(root);
  const files = {
    "dist/forgejo/templates/repo/commit.tmpl":
      '<script src="{{AssetUrlPrefix}}/js/diff-view.js?v=0123456789" defer></script>\n<link rel="stylesheet" href="{{AssetUrlPrefix}}/css/site-footer.css?v=abcdef0123">',
    "dist/forgejo/templates/base/head_style.tmpl":
      '<link rel="stylesheet" href="{{AssetUrlPrefix}}/css/theme-{{ThemeName .SignedUser | PathEscape}}.css?v={{AssetVersion}}-fedcba9876">',
    "dist/forgejo/public/assets/css/theme-github-auto.css":
      '@import "./theme-github-dark.css?v=1111111111" (prefers-color-scheme: dark);\n@import "./theme-github-light.css?v=2222222222" (prefers-color-scheme: light);',
    "dist/forgejo/public/assets/css/theme-github-dark.css": ":root{}",
    "dist/forgejo/public/assets/js/diff-view.js": "export {};",
  };
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
  }
  const config = new PreviewConfig(root, { FORGEJO_PREVIEW_AUTO_LOGIN: "false" });
  const synchronizer = new ThemeSynchronizer(config, new ForgejoCompose(config, new CommandRunner(root)));
  const reloader = new PreviewReloader(config);
  const prepare = () => {
    new AutoLoginTemplate(config).prepare();
    synchronizer.stage();
    reloader.prepare();
  };
  const staged = (file: string) => readFileSync(join(config.generatedAssetsDirectory, file), "utf8");
  const template = (file: string) => readFileSync(join(config.generatedTemplatesDirectory, file), "utf8");
  const revision = () => JSON.parse(staged("css/preview-revision.json")).revision as string;
  return { root, files, config, reloader, prepare, staged, template, revision };
};

describe("local preview reload", () => {
  it("stamps its own copy of the build and leaves dist as `bun bundle` wrote it", () => {
    const { root, files, config, reloader, prepare, staged, revision } = project();
    prepare();
    reloader.publish();
    for (const [file, content] of Object.entries(files))
      expect(readFileSync(join(root, file), "utf8"), file).toBe(content);
    expect(existsSync(join(root, "dist/forgejo/public/assets/css/preview-revision.json"))).toBe(false);
    expect(staged("css/theme-github-dark.css")).toBe(":root{}");
    expect(staged("js/diff-view.js")).toBe("export {};");
    expect(staged("css/theme-github-auto.css")).toContain(`theme-github-dark.css?v=1111111111&preview=${revision()}"`);
    expect(readFileSync(config.autoLoginTemplateFile, "utf8")).toContain('cache: "no-store"');
  });

  it("joins the preview revision to the content version as one query", () => {
    const { reloader, prepare, staged, template, revision } = project();
    prepare();
    reloader.publish();
    const first = revision();
    expect(template("repo/commit.tmpl")).toContain(`/js/diff-view.js?v=0123456789&preview=${first}"`);
    expect(template("repo/commit.tmpl")).toContain(`/css/site-footer.css?v=abcdef0123&preview=${first}"`);
    expect(template("base/head_style.tmpl")).toContain(`.css?v={{AssetVersion}}-fedcba9876&preview=${first}"`);
    const urls = [
      ...staged("css/theme-github-auto.css").matchAll(/@import "([^"]+)"/g),
      ...template("repo/commit.tmpl").matchAll(/(?:src|href)="([^"]+)"/g),
    ].map(([, url]) => url);
    expect(urls).toHaveLength(4);
    for (const url of urls) expect(url.split("?"), url).toHaveLength(2);
  });

  it("publishes a new revision only when ready and drops the previous one and its files", () => {
    const { config, reloader, prepare, staged, template, revision } = project();
    expect(() => revision()).toThrow();
    prepare();
    expect(() => revision()).toThrow();
    reloader.publish();
    const first = revision();
    writeFileSync(join(config.generatedAssetsDirectory, "css/removed.css"), "");
    prepare();
    expect(() => revision()).toThrow();
    expect(existsSync(join(config.generatedAssetsDirectory, "css/removed.css"))).toBe(false);
    reloader.publish();
    const second = revision();
    expect(second).not.toBe(first);
    expect(staged("css/theme-github-auto.css")).not.toContain(first);
    expect(template("repo/commit.tmpl")).not.toContain(first);
  });

  it("mounts the staged copy and generated templates into Forgejo, never dist", () => {
    const config = new PreviewConfig(ROOT_DIR);
    const compose = readFileSync(config.composeFile, "utf8");
    const mounts = Object.fromEntries(
      [...compose.matchAll(/^\s+- (\.{1,2}\/\S+):(\/var\/lib\/gitea\/custom\/\S+):ro$/gm)].map(
        ([, host, container]) => [container, resolve(dirname(config.composeFile), host)]
      )
    );
    expect(mounts).toEqual({
      "/var/lib/gitea/custom/public/assets/css": join(config.generatedAssetsDirectory, "css"),
      "/var/lib/gitea/custom/public/assets/js": join(config.generatedAssetsDirectory, "js"),
      "/var/lib/gitea/custom/templates": config.generatedTemplatesDirectory,
    });
    expect(compose).not.toContain("dist/");
    expect(relative(ROOT_DIR, config.generatedAssetsDirectory).startsWith("dev/.generated/")).toBe(true);
  });
});

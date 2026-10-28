/*!
 * Copyright (c) https://github.com/lutinglt
 *
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const PREFIX = "theme-github-";

// ============================================================================
// #4: 构建产物基本验证
// ============================================================================

/** 从 theme.config.ts 推导的预期主题文件名 */
const EXPECTED_THEME_FILES = [
  // default
  `${PREFIX}dark.css`,
  `${PREFIX}light.css`,
  `${PREFIX}soft-dark.css`,
  `${PREFIX}auto.css`,
  // colorblind
  `${PREFIX}colorblind-dark.css`,
  `${PREFIX}colorblind-light.css`,
  `${PREFIX}colorblind-auto.css`,
  // tritanopia
  `${PREFIX}tritanopia-dark.css`,
  `${PREFIX}tritanopia-light.css`,
  `${PREFIX}tritanopia-auto.css`,
  // pink
  `${PREFIX}pink-dark.css`,
  `${PREFIX}pink-light.css`,
  `${PREFIX}pink-soft-dark.css`,
  `${PREFIX}pink-auto.css`,
  // gitea
  `${PREFIX}gitea-dark.css`,
  `${PREFIX}gitea-light.css`,
  `${PREFIX}gitea-auto.css`,
  // catppuccin
  `${PREFIX}catppuccin-mocha.css`,
  `${PREFIX}catppuccin-latte.css`,
  `${PREFIX}catppuccin-frappe.css`,
  `${PREFIX}catppuccin-macchiato.css`,
  `${PREFIX}catppuccin-auto.css`,
  // high contrast
  `${PREFIX}high-contrast-dark.css`,
  `${PREFIX}high-contrast-light.css`,
  `${PREFIX}high-contrast-soft-dark.css`,
  `${PREFIX}high-contrast-auto.css`,
  // high contrast colorblind
  `${PREFIX}high-contrast-colorblind-dark.css`,
  `${PREFIX}high-contrast-colorblind-light.css`,
  `${PREFIX}high-contrast-colorblind-auto.css`,
  // high contrast tritanopia
  `${PREFIX}high-contrast-tritanopia-dark.css`,
  `${PREFIX}high-contrast-tritanopia-light.css`,
  `${PREFIX}high-contrast-tritanopia-auto.css`,
];

/** auto 主题文件名列表 */
const AUTO_THEME_FILES = EXPECTED_THEME_FILES.filter(f => f.includes("-auto-") || f.endsWith("-auto.css"));

/** 非 auto 主题文件名列表 */
const SOLID_THEME_FILES = EXPECTED_THEME_FILES.filter(f => !AUTO_THEME_FILES.includes(f));

describe("构建产物基本验证", () => {
  // 确保有构建产物
  try {
    const hasCss = fs.existsSync(DIST_DIR) && fs.readdirSync(DIST_DIR).some(f => f.endsWith(".css"));
    if (!hasCss) {
      execSync("bun run bundle", { cwd: ROOT_DIR, stdio: "pipe" });
    }
  } catch {
    execSync("bun run bundle", { cwd: ROOT_DIR, stdio: "pipe" });
  }

  it("dist 目录存在且包含主题文件", () => {
    expect(fs.existsSync(DIST_DIR)).toBe(true);
    const files = fs.readdirSync(DIST_DIR).filter(f => f.endsWith(".css"));
    expect(files.length, "dist 目录中应有 CSS 主题文件").toBeGreaterThan(0);
  });

  it("所有预期主题文件都存在", () => {
    const actualFiles = new Set(fs.readdirSync(DIST_DIR).filter(f => f.endsWith(".css")));
    for (const expected of EXPECTED_THEME_FILES) {
      expect(actualFiles.has(expected), `缺少预期主题文件: ${expected}`).toBe(true);
    }
  });

  it("无多余主题文件", () => {
    const actualFiles = fs.readdirSync(DIST_DIR).filter(f => f.endsWith(".css"));
    const expectedSet = new Set(EXPECTED_THEME_FILES);
    const pageStyles = new Set(fs.readdirSync(path.join(ROOT_DIR, "public")).filter(f => f.endsWith(".css")));
    const extra = actualFiles.filter(f => !expectedSet.has(f) && !pageStyles.has(f));
    expect(extra, `存在多余主题文件: ${extra.join(", ")}`).toEqual([]);
  });
});

it("ships component stylesheets unchanged with valid CSS and a template reference", async () => {
  const { transform } = await import("lightningcss");
  const templates = fs
    .readdirSync(path.join(ROOT_DIR, "templates"), { recursive: true })
    .filter(file => String(file).endsWith(".tmpl"))
    .map(file => fs.readFileSync(path.join(ROOT_DIR, "templates", String(file)), "utf-8"))
    .join("\n");
  const sources = [
    ...fs
      .readdirSync(path.join(ROOT_DIR, "public"))
      .filter(name => name.endsWith(".css"))
      .map(name => [name, name]),
    ...fs
      .readdirSync(path.join(ROOT_DIR, "components"), { recursive: true })
      .filter(file => String(file).endsWith(".css"))
      .map(file => [`components/${String(file)}`, `components/${String(file)}`]),
    ...["organization.css", "profile-subpages.css", "user-profile.css"].map(name => [name, `components/pages/${name}`]),
  ];
  const output = path.join(DIST_DIR, "forgejo", "public", "assets", "css");
  for (const [source, asset] of sources) {
    const code = fs.readFileSync(path.join(output, asset));
    const original = source.startsWith("components/")
      ? fs.readFileSync(path.join(ROOT_DIR, source))
      : source.startsWith("organization") || source.startsWith("profile-") || source.startsWith("user-profile")
        ? fs.readFileSync(path.join(ROOT_DIR, "styles/pages", source))
        : fs.readFileSync(path.join(ROOT_DIR, "public", source));
    expect(code.equals(original), `changed component asset: ${asset}`).toBe(true);
    expect(() => transform({ code, filename: asset })).not.toThrow();
    expect(templates).toContain(`/css/${asset}`);
  }
});

it("stamps every template asset link with the hash of the shipped file", async () => {
  const { createHash } = await import("node:crypto");
  const output = path.join(DIST_DIR, "forgejo");
  const links = fs
    .readdirSync(path.join(output, "templates"), { recursive: true })
    .filter(file => String(file).endsWith(".tmpl"))
    .flatMap(file => [
      ...fs
        .readFileSync(path.join(output, "templates", String(file)), "utf-8")
        .matchAll(/\{\{AssetUrlPrefix\}\}\/((?:css|js)\/[^"?]+)(\?v=[0-9a-f]+)?"/g),
    ]);
  expect(links.length).toBeGreaterThan(0);
  for (const [, asset, version] of links) {
    const file = path.join(output, "public", "assets", asset);
    expect(fs.existsSync(file), `template links a missing asset: ${asset}`).toBe(true);
    const hash = createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    expect(version, `unversioned asset link: ${asset}`).toBe(`?v=${hash.slice(0, 10)}`);
  }
});

it("defines the colour variables Forgejo 17 only sets in its own themes", () => {
  // Forgejo 17 reads these without a fallback (.text.green, Actions runner status, image diffs...). Undefined, the
  // coloured status icons all turned white.
  const required = [
    "--color-thin-green",
    "--color-thin-red",
    "--color-thin-purple",
    "--color-thin-violet",
    "--color-thin-orange",
    "--color-thin-blue",
    "--color-indicator-offline",
    "--color-indicator-idle",
    "--color-indicator-active",
    "--checkerboard-color-1",
    "--checkerboard-color-2",
    "--fancy-card-bg",
    "--color-light-mimic-enabled",
  ];
  // Auto themes only import a light and a dark file.
  const themes = fs.readdirSync(DIST_DIR).filter(name => /^theme-.+\.css$/.test(name) && !name.endsWith("-auto.css"));
  expect(themes.length).toBeGreaterThan(0);
  for (const theme of themes) {
    const css = fs.readFileSync(path.join(DIST_DIR, theme), "utf-8");
    for (const variable of required) expect(css, `${theme} defines ${variable}`).toContain(`${variable}:`);
  }
});

it("colours the plain stylesheets with variables every theme defines", () => {
  // The release page took GitHub's dark palette literally, so light, colorblind and catppuccin themes showed dark
  // rows, and a --github-* variable no theme sets only ever shows its hard-coded dark fallback.
  const stylesheets = ["styles", "components", "public"].flatMap(dir =>
    fs
      .readdirSync(path.join(ROOT_DIR, dir), { recursive: true })
      .map(String)
      .filter(file => file.endsWith(".css"))
      .map(file => path.join(dir, file))
  );
  const themes = fs.readdirSync(DIST_DIR).filter(name => /^theme-.+\.css$/.test(name) && !name.endsWith("-auto.css"));
  expect(themes.length).toBeGreaterThan(0);
  const themeCss = themes.map(theme => [theme, fs.readFileSync(path.join(DIST_DIR, theme), "utf-8")] as const);
  for (const file of stylesheets) {
    const css = fs.readFileSync(path.join(ROOT_DIR, file), "utf-8");
    for (const [, variable] of css.matchAll(/var\((--github-[\w-]+)/g)) {
      for (const [theme, output] of themeCss)
        expect(output, `${theme} defines ${variable} (${file})`).toContain(`${variable}:`);
    }
  }
  const releases = fs.readFileSync(path.join(ROOT_DIR, "styles/pages/releases.css"), "utf-8");
  expect(releases).not.toMatch(/#[\da-f]{3,8}\b|rgba?\(/i);
});

it("resets Fomantic's will-change on dropdown menus and modals", () => {
  // will-change keeps the element on its own GPU layer; at a fractional position its text renders blurry.
  for (const file of ["styles/public/dropdown/dropdown.ts", "styles/public/modal.ts"]) {
    expect(fs.readFileSync(path.join(ROOT_DIR, file), "utf-8"), file).toContain("will-change: auto;");
  }
});

it("keeps :has() off elements that wrap a whole page", () => {
  // Chrome re-evaluates a :has() whenever its subtree changes. On an element that wraps the page, a folded diff file,
  // an opened comment editor or a selected line in a large file restyles every element on the page.
  const output = path.join(DIST_DIR, "forgejo", "public", "assets", "css");
  const pageWrapper =
    /(?:^|[\s,{}>~+(])(?:body|html|:root|\.page-content|\.ui\.container|#diff-container)(?:[.#[:][^\s,{}>~+]*)?:has\(/m;
  const files = fs
    .readdirSync(output, { recursive: true })
    .map(String)
    .filter(file => file.endsWith(".css"));
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) {
    const match = fs.readFileSync(path.join(output, file), "utf-8").match(pageWrapper);
    expect(match?.[0], `${file} puts :has() on a page wrapper`).toBeUndefined();
  }
});

it("versions the theme stylesheet link and the auto themes' imports", async () => {
  const { createHash } = await import("node:crypto");
  const version = (...files: string[]) => {
    const hash = createHash("sha256");
    for (const file of files) hash.update(fs.readFileSync(file));
    return hash.digest("hex").slice(0, 10);
  };
  const themeFiles = fs
    .readdirSync(DIST_DIR)
    .filter(name => /^theme-.+\.css$/.test(name))
    .sort()
    .map(name => path.join(DIST_DIR, name));

  const headStyle = fs.readFileSync(path.join(DIST_DIR, "forgejo", "templates", "base", "head_style.tmpl"), "utf-8");
  expect(headStyle).toContain('href="{{AssetUrlPrefix}}/css/index.css?v={{AssetVersion}}"');
  expect(headStyle).toContain(
    `href="{{AssetUrlPrefix}}/css/theme-{{ThemeName .SignedUser | PathEscape}}.css?v={{AssetVersion}}-${version(...themeFiles)}"`
  );

  const autoThemes = themeFiles.filter(file => file.endsWith("-auto.css"));
  expect(autoThemes.length).toBeGreaterThan(0);
  for (const file of autoThemes) {
    const imports = [...fs.readFileSync(file, "utf-8").matchAll(/@import "\.\/([^"?]+)(\?v=[0-9a-f]+)?"/g)];
    expect(imports.length, path.basename(file)).toBeGreaterThan(0);
    for (const [, imported, query] of imports)
      expect(query, `${path.basename(file)} imports ${imported}`).toBe(`?v=${version(path.join(DIST_DIR, imported))}`);
    expect(fs.readFileSync(path.join(DIST_DIR, "forgejo", "public", "assets", "css", path.basename(file)))).toEqual(
      fs.readFileSync(file)
    );
  }
});

describe("非 auto 主题 CSS 内容验证", () => {
  for (const fileName of SOLID_THEME_FILES) {
    describe(fileName, () => {
      let css: string;

      beforeAll(() => {
        css = fs.readFileSync(path.join(DIST_DIR, fileName), "utf-8");
      });

      it("文件非空", () => {
        expect(css.length, `${fileName} 不应为空文件`).toBeGreaterThan(0);
      });

      it("包含 Gitea 主题元信息 (--is-dark-theme 或 color-scheme)", () => {
        const hasMeta = css.includes("--is-dark-theme") || css.includes("color-scheme");
        expect(hasMeta, `${fileName} 应包含主题元信息`).toBe(true);
      });

      it("包含 --color-primary 变量", () => {
        expect(css, `${fileName} 应包含 --color-primary 变量`).toMatch(/--color-primary\b/);
      });

      it("包含 --color-body 变量", () => {
        expect(css, `${fileName} 应包含 --color-body 变量`).toMatch(/--color-body\b/);
      });

      it("包含 --color-text 变量", () => {
        expect(css, `${fileName} 应包含 --color-text 变量`).toMatch(/--color-text\b/);
      });

      it("不包含 vanilla-extract 调试标识", () => {
        expect(css, `${fileName} 不应包含 _ve_ 调试标识`).not.toMatch(/_ve_/);
      });

      it("hex 颜色均为小写格式", () => {
        const hexColors = css.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
        const upperHex = hexColors.filter(c => /[A-F]/.test(c));
        expect(upperHex, `${fileName} 中存在大写 hex 颜色: ${upperHex.slice(0, 5).join(", ")}`).toEqual([]);
      });
    });
  }
});

describe("Forgejo 15 native integration", () => {
  const requiredSelectors = [
    "--color-selection-bg",
    ".repository-tab-nav.page-content.repository",
    ".repo-about-modal-overlay",
    ".repo-code-navigation",
    ".button.primary:not(.ui)",
    ".total-contributions",
    ".vch__legend",
    ".codemirror-container",
  ];

  const requiredTemplates = [
    "base/head_navbar.tmpl",
    "base/head_navbar_icons.tmpl",
    "base/navbar_drawer.tmpl",
    "base/navbar_create_items.tmpl",
    "repo/commit_message_subject.tmpl",
    "repo/commit_page.tmpl",
    "repo/diff/box.tmpl",
    "repo/commits_list.tmpl",
    "repo/global_header.tmpl",
    "repo/header.tmpl",
    "repo/home.tmpl",
    "repo/home_header.tmpl",
    "repo/empty.tmpl",
    "repo/home_sidebar_bottom.tmpl",
    "repo/home_sidebar_top.tmpl",
    "repo/view_content.tmpl",
    "repo/view_list.tmpl",
    "user/dashboard/dashboard.tmpl",
    "user/heatmap.tmpl",
    "user/auth/signup.tmpl",
    "user/auth/signup_inner.tmpl",
  ];

  const unsupportedSelectorFamilies = [
    ".items-with-main",
    ".heatmap-grid",
    ".heatmap-legend-svg",
    ".branch-selector-dropdown",
    ".small-menu-items",
    ".context-user-switch",
    ".action-view-right-panel",
    ".repo-view-container",
    ".clone-panel-popup",
    ".workflow-graph",
    ".clone-panel-tab",
    ".ellipsis-text-items",
    ".comment-text-line",
    ".avatar-with-link",
    ".issue-sidebar-combo",
    ".item-secondary-info",
    ".fixed-text",
    ".empty-list",
    ".flex-divided-list",
    ".list-item-large-title",
    ".list-item-secondary-bar",
    ".list-item-title-progress",
    ".scope-middle",
    ".clear-selection",
    ".items-full-width",
    ".code-editor-container",
    ".navbar-admin-badge",
    ".theme-menu-item",
    ".signin-passkey",
    ".avatar-stack-names",
    ".gitea-vscode",
    ".gitea-vscodium",
  ];

  it("does not download release assets to show them", () => {
    // Every fetch of an asset counts as a download in Forgejo and transfers the whole file.
    const releases = fs.readFileSync(path.join(ROOT_DIR, "public", "assets", "js", "repo-releases.js"), "utf-8");
    const list = fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "release", "list.tmpl"), "utf-8");
    expect(releases).not.toContain("arrayBuffer");
    expect(releases).not.toContain("crypto.subtle");
    expect(list).not.toContain("data-digest-url");
  });

  it("includes Forgejo-native rules in the standard theme output", () => {
    const css = fs.readFileSync(path.join(DIST_DIR, `${PREFIX}light.css`), "utf-8");

    for (const selector of requiredSelectors) {
      expect(css, `Forgejo theme output should contain ${selector}`).toContain(selector);
    }
  });

  it("uses GitHub's font lists and serves no font files, as GitHub's repository pages do", () => {
    const css = fs.readFileSync(path.join(DIST_DIR, `${PREFIX}light.css`), "utf-8");

    expect(css).toContain('--fonts-proportional:"Mona Sans VF", -apple-system, BlinkMacSystemFont');
    expect(css).toContain('--fonts-monospace:"Monaspace Neon", ui-monospace, SFMono-Regular');
    expect(css).not.toContain("@font-face");
    expect(fs.existsSync(path.join(DIST_DIR, "assets", "fonts"))).toBe(false);
  });

  it("matches GitHub's measured repository navigation geometry", () => {
    const header = fs.readFileSync(path.join(ROOT_DIR, "styles", "templates", "repo", "header.ts"), "utf-8");
    const secondaryMenu = fs.readFileSync(
      path.join(ROOT_DIR, "styles", "public", "menu", "secondary_menu.ts"),
      "utf-8"
    );
    const navbarTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "base", "head_navbar.tmpl"), "utf-8");
    const navbarStyle = fs.readFileSync(path.join(ROOT_DIR, "styles", "components", "navbar.ts"), "utf-8");

    expect(header).toContain("height: 52px;");
    expect(header).toContain("padding-top: 16px;");
    expect(header).toContain("border-bottom: 0;");
    // GitHub: the menu button, 12px, a bare 32px logo, 8px, "owner / repo" with a repository icon and no avatar.
    expect(navbarStyle).toContain("&#navbar-logo {");
    expect(navbarStyle).toContain("min-width: 32px;");
    expect(navbarTemplate.indexOf('id="navbar-drawer-toggle"')).toBeLessThan(
      navbarTemplate.indexOf('id="navbar-logo"')
    );
    expect(header).toContain("height: 48px;");
    expect(header).toContain("gap: 8px;");
    expect(header).toContain("margin: 0 7px;");
    expect(header).toContain(".repository-navbar-breadcrumb > a.repository-navbar-name");
    expect(header).toContain("margin: 0 0 8px !important;");
    expect(header).toContain("padding: 6px 8px !important;");
    expect(header).toContain("line-height: 21px;");
    expect(header).toContain("bottom: -8px;");
    expect(secondaryMenu).toContain(".overflow-menu-items {\n      gap: 8px;");
    expect(navbarTemplate).not.toContain("{{ctx.AvatarUtils.Avatar .Owner 16}}");
    expect(navbarTemplate).toContain("{{svg $repoIcon 16}}");
  });

  it("keeps code in rendered titles small and tight to the text, as GitHub does", () => {
    const css = fs.readFileSync(path.join(DIST_DIR, `${PREFIX}light.css`), "utf-8");
    expect(css).toContain("code.inline-code-block{border-radius:6px;padding:2px 4px;font-size:.9em;line-height:1}");
  });

  it("offers GitHub's repository switcher beside the repository name", () => {
    const navbar = fs.readFileSync(path.join(ROOT_DIR, "templates", "base", "head_navbar.tmpl"), "utf-8");
    const items = fs.readFileSync(path.join(ROOT_DIR, "templates", "base", "navbar_repository_switcher.tmpl"), "utf-8");
    const header = fs.readFileSync(path.join(ROOT_DIR, "styles", "templates", "repo", "header.ts"), "utf-8");

    // The caret follows the name and opens the owner's repositories, loaded only when the menu opens.
    expect(navbar.indexOf('class="repository-navbar-switcher"')).toBeGreaterThan(
      navbar.indexOf("repository-navbar-name")
    );
    expect(navbar).toContain('"Items" "base/navbar_repository_switcher"');
    expect(items).toContain('"components/repository/picker/picker"');
    expect(items).toContain('"Exclusive" true');
    expect(items).toContain('"Current" .Repository.ID');
    expect(items).toContain('"Lazy" true');
    expect(header).toContain("#navbar .repository-navbar-switcher");
    expect(header).toContain("width: 320px;");
  });

  it("ships the mobile drawer assets and keeps its toggle independent of Forgejo's inline menu", () => {
    const navbar = fs.readFileSync(path.join(ROOT_DIR, "templates", "base", "head_navbar.tmpl"), "utf-8");
    expect(navbar).toContain('id="navbar-drawer-toggle" aria-controls="navbar-drawer" aria-haspopup="dialog"');
    expect(navbar).not.toContain('id="navbar-expand-toggle"');
    expect(navbar).toContain('href="{{AssetUrlPrefix}}/css/navbar-drawer.css"');
    expect(navbar).toContain('src="{{AssetUrlPrefix}}/js/navbar-drawer.js"');
    for (const asset of ["navbar-drawer.css", "assets/js/navbar-drawer.js"]) {
      expect(fs.readFileSync(path.join(DIST_DIR, asset), "utf-8")).toBe(
        fs.readFileSync(path.join(ROOT_DIR, "public", asset), "utf-8")
      );
    }
  });

  it("names the current page after the logo as GitHub does, keeping Explore in the drawer", () => {
    const navbar = fs.readFileSync(path.join(ROOT_DIR, "templates", "base", "head_navbar.tmpl"), "utf-8");
    const drawer = fs.readFileSync(path.join(ROOT_DIR, "templates", "base", "navbar_drawer.tmpl"), "utf-8");
    for (const [flag, label] of [
      ["PageIsDashboard", "dashboard"],
      ["PageIsIssues", "issues"],
      ["PageIsPulls", "pull_requests"],
      ["PageIsUserSettings", "settings"],
      ["PageIsAdmin", "admin_panel"],
      ["PageIsExplore", "explore"],
    ])
      expect(navbar).toMatch(
        new RegExp(`\\.${flag}\\}\\}\\s*<a class="item navbar-context-title[^>]*>{{ctx\\.Locale\\.Tr "${label}"}}`)
      );
    expect(navbar).toContain('<span class="item navbar-context-title not-mobile">{{.Title}}</span>');
    expect(navbar).not.toContain("profile-navbar-name");
    expect(drawer).toContain('{{ctx.Locale.Tr "explore"}}');
  });

  it("does not emit selector families from the newer Gitea markup", () => {
    const css = fs.readFileSync(path.join(DIST_DIR, `${PREFIX}light.css`), "utf-8");

    for (const selector of unsupportedSelectorFamilies) {
      expect(css, `Forgejo theme output should not contain ${selector}`).not.toContain(selector);
    }
  });

  it("matches GitHub notification segment sizing without applying the subscriptions switch", () => {
    const compactMenu = fs.readFileSync(path.join(ROOT_DIR, "styles", "public", "menu", "compact_menu.ts"), "utf-8");
    const notification = fs.readFileSync(path.join(ROOT_DIR, "styles", "components", "notification.ts"), "utf-8");

    expect(compactMenu).toContain(".page-content.user.notification:not(#notification_div) > .ui.container {");
    expect(compactMenu).not.toContain(".ui.container:has(");
    expect(compactMenu).not.toContain(".page-content.user.notification > .ui.container,");
    expect(notification).toContain("--switch-item-min-height: 32px;");
    expect(notification).toContain("background: light-dark(");
    expect(notification).toContain("${themeVars.github.controlTrack.bgColor.rest},");
    expect(notification).toContain("${themeVars.color.menu}");
    expect(notification).toContain("gap: 0;");
    expect(notification).toContain("height: 32px;");
    expect(notification).toContain("padding: 4px 12px;");
    expect(notification).toContain("${themeVars.github.controlKnob.bgColor.rest},");
    expect(notification).toContain("${themeVars.color.hover.self}");
    expect(notification).toContain("font-weight: 600;");
  });

  it("keeps header and clone interactions aligned with GitHub controls", () => {
    const navbar = fs.readFileSync(path.join(ROOT_DIR, "styles", "components", "navbar.ts"), "utf-8");
    const notification = fs.readFileSync(path.join(ROOT_DIR, "styles", "components", "notification.ts"), "utf-8");
    const repoContentStyle = fs.readFileSync(
      path.join(ROOT_DIR, "styles", "templates", "repo", "view_content.ts"),
      "utf-8"
    );
    const repoContentTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "view_content.tmpl"), "utf-8");

    expect(navbar).toContain("> .item {\n        border-radius: ${otherThemeVars.border.radius};");
    expect(navbar).toContain(".navbar-right:not(:has(.user-menu)) {\n      gap: 8px;");
    expect(navbar).toContain("> a.item {\n        align-items: center;");
    expect(notification).toContain("text-decoration: none;");
    expect(repoContentTemplate).toContain('class="repo-code-navigation"');
    expect(repoContentTemplate).toContain('class="repo-code-body"');
    expect(repoContentTemplate).toContain('svg "octicon-terminal" 16');
    expect(repoContentStyle).toContain("border-radius: 12px;");
    expect(repoContentStyle).toContain("width: min(400px, calc(100vw - 32px));");
    expect(repoContentStyle).toContain("grid-template-rows: 32px 32px auto;");
    expect(repoContentStyle).toContain("border-radius: ${otherThemeVars.border.radius} !important;");
    expect(repoContentStyle).toContain("font-size: 14px;");
    expect(repoContentStyle).toContain("padding: 0 !important;");
    expect(repoContentStyle).toContain(".repo-code-actions > li > a:hover");
  });

  it("shows the repository title row only on the code home, as GitHub does", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, "templates", ...parts), "utf-8");

    expect(read("repo", "header.tmpl")).not.toContain("<");
    expect(read("repo", "home.tmpl")).toContain('{{template "repo/home_header" .}}');
    expect(read("repo", "empty.tmpl")).toContain('{{template "repo/home_header" .}}');
    for (const page of [
      ["repo", "release", "list.tmpl"],
      ["repo", "tag", "list.tmpl"],
      ["repo", "diff", "compare.tmpl"],
    ])
      expect(read(...page)).not.toContain('template "repo/header"');
  });

  it("lists labels and milestones in the issue sidebar layout with the shared box list", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, ...parts), "utf-8");
    const sidebar = read("templates", "repo", "issue", "sidebar.tmpl");
    expect(sidebar).toContain('{{if $isMilestonePage}}active{{end}}" href="{{.RepoLink}}/milestones"');
    expect(sidebar).toContain('{{if .PageIsLabels}}active{{end}}" href="{{.RepoLink}}/labels"');
    for (const page of ["labels.tmpl", "milestones.tmpl", "milestone_issues.tmpl", "milestone_new.tmpl"]) {
      const template = read("templates", "repo", "issue", page);
      expect(template, page).toContain('{{template "repo/issue/sidebar" .}}');
      expect(template, page).not.toContain('template "repo/issue/navbar"');
    }
    expect(read("templates", "repo", "issue", "milestones.tmpl")).toContain(
      'template "components/repository/milestone/list"'
    );
    expect(read("templates", "user", "dashboard", "milestones.tmpl")).toContain(
      'template "components/repository/milestone/list"'
    );
    expect(read("templates", "repo", "issue", "labels", "label_list.tmpl")).toContain(
      'template "components/repository/label/list"'
    );
    expect(read("templates", "repo", "issue", "milestone_issues.tmpl")).toContain('"themeList" "issues"');
    // The project, milestone and label lists share GitHub's Box list and its Open/Closed tabs.
    for (const list of [
      ["components", "project", "list", "list.tmpl"],
      ["components", "repository", "milestone", "list.tmpl"],
      ["components", "repository", "label", "list.tmpl"],
    ])
      expect(read(...list)).toContain('class="theme-box-list');
    expect(read("components", "repository", "label", "actions.tmpl")).toContain("edit-label-button");
    expect(read("templates", "base", "component_assets.tmpl")).toContain(
      "/css/components/common/box-list/box-list.css"
    );
  });

  it("shows the repository history as GitHub's Commits page grouped by day", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, ...parts), "utf-8");
    const commits = read("templates", "repo", "commits.tmpl");
    expect(commits).toContain('{{ctx.Locale.Tr "repo.commits.commits"}}');
    expect(commits).not.toContain('template "repo/sub_menu"');
    expect(commits).toContain('"Items" "repo/commits_search_scope"');
    for (const list of [
      ["templates", "repo", "commits_list.tmpl"],
      ["templates", "repo", "pulls", "commits_list.tmpl"],
    ])
      expect(read(...list)).toContain('template "components/repository/commit-groups/commit-groups"');
    expect(read("components", "repository", "commit-groups", "commit-groups.tmpl")).toContain(
      '<article class="theme-commit-group">'
    );
    expect(fs.existsSync(path.join(ROOT_DIR, "public", "pull-commits.css"))).toBe(false);
    expect(read("templates", "base", "component_assets.tmpl")).toContain("/css/components/pages/commits.css");
  });

  it("lists branches in GitHub's branch tables with Forgejo's branch actions", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, ...parts), "utf-8");
    const page = read("templates", "repo", "branch", "list.tmpl");
    expect(page).not.toContain('template "repo/sub_menu"');
    expect(page).toContain('"Default" .DefaultBranchBranch');
    expect(page).toContain('id="create-branch-modal"');
    expect(page).toContain('id="rename-branch-modal"');
    const row = read("components", "repository", "branch", "row.tmpl");
    expect(row).toContain("delete-button delete-branch-button");
    expect(row).toContain("restore-branch-button");
    expect(row).toContain('class="theme-branch-name"');
    const actions = read("components", "repository", "branch", "actions.tmpl");
    expect(actions).toContain("show-create-branch-modal");
    expect(actions).toContain("show-rename-branch-modal");
    expect(read("styles", "components", "issues", "issue.ts")).toContain(".theme-branch-name {");
  });

  it("shares GitHub's nav list between settings and Insights", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, ...parts), "utf-8");
    for (const navbar of [
      ["templates", "repo", "navbar.tmpl"],
      ["templates", "repo", "settings", "navbar.tmpl"],
      ["templates", "user", "settings", "navbar.tmpl"],
      ["templates", "org", "settings", "navbar.tmpl"],
      ["templates", "admin", "navbar.tmpl"],
    ])
      expect(read(...navbar)).toContain('class="ui fluid vertical menu theme-nav-list"');
    expect(read("components", "common", "nav-list", "nav-list.css")).toContain(".ui.vertical.menu.theme-nav-list {");
    expect(read("components", "common", "settings", "settings.css")).not.toContain("& > .item.active");
    expect(read("templates", "repo", "activity.tmpl")).toContain("flex-container github-insights");
  });

  it("names and orders a person's profile tabs as GitHub does, with GitHub's search and empty-state copy", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, ...parts), "utf-8");
    const tabs = read("templates", "user", "overview", "header.tmpl");
    // Overview, Repositories, Projects, Packages, Stars; Forgejo's own tabs after them.
    const order = ["?tab=repositories", "/-/projects", "/-/packages", "?tab=stars", "/-/code", "?tab=activity"].map(t =>
      tabs.indexOf(t)
    );
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(tabs).toContain('{{svg "octicon-star"}} Stars');
    // The profile's funding links open from a Sponsor-style button beside Follow.
    const avatar = read("templates", "shared", "user", "profile_big_avatar.tmpl");
    expect(avatar).toContain('command="show-modal" commandfor="funding-modal"');
    expect(avatar).toContain('{{template "shared/funding" .}}');
    const search = read("templates", "user", "profile_repository_search.tmpl");
    expect(search).toContain('"Find a repository…"');
    expect(search).toContain('"Search starred repositories"');
    expect(search).toContain(">Search</button>");
    const packages = read("components", "package", "list", "list.tmpl");
    expect(packages).toContain('class="theme-package-list-header"');
    expect(packages.indexOf('name="type"')).toBeLessThan(packages.indexOf('"components/common/search/search"'));
    expect(read("components", "project", "list", "list.tmpl")).toContain("There aren't any projects yet");
  });

  it("matches GitHub's personal settings: the centred column, the header, key buttons, plain empty lines and org settings", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, ...parts), "utf-8");
    const head = read("templates", "user", "settings", "layout_head.tmpl");
    expect(head).toContain('"Subtitle" "Your personal account"');
    expect(head).toContain('"LinkLabel" "Go to your personal profile"');
    const css = read("components", "common", "settings", "settings.css");
    expect(css).toContain(
      ".page-content.user.settings > .ui.container:is(.theme-settings-context-container, .theme-settings) {"
    );
    expect(css).toContain("max-width: 980px !important;");
    expect(read("templates", "user", "settings", "keys_ssh.tmpl")).toContain("New SSH key");
    expect(read("templates", "user", "settings", "keys_gpg.tmpl")).toContain("New GPG key");
    for (const file of [
      ["templates", "user", "settings", "keys_ssh.tmpl"],
      ["templates", "shared", "blocked_users_list.tmpl"],
    ])
      expect(read(...file), file.join("/")).toContain('"Plain" true');
    expect(read("components", "common", "settings", "blankslate.tmpl")).toContain(
      'class="theme-settings-blankslate-plain"'
    );
    // GitHub's Edit on the picture: Upload a photo opens the hidden file field, which sends itself as the custom picture.
    const profile = read("templates", "user", "settings", "profile.tmpl");
    expect(profile).toContain('"Label" "Edit" "Small" true "NoCaret" true "Items" "user/settings/avatar_menu"');
    expect(profile).toContain('<input type="hidden" name="source" value="local">');
    expect(profile).toContain("event.target.form.requestSubmit()");
    const menu = read("templates", "user", "settings", "avatar_menu.tmpl");
    expect(menu).toContain('<label class="theme-dropdown-action" for="new-avatar">Upload a photo…</label>');
    expect(menu).toContain('form="avatar-gravatar-form"');
    expect(menu).toContain("Remove photo");
    // The Gravatar choice sends the address typed under the picture, not only the stored one.
    expect(profile).toContain('<form id="avatar-gravatar-form" class="ui form theme-avatar-gravatar"');
    expect(profile).toContain('<input id="gravatar" name="gravatar" value="{{.SignedUser.AvatarEmail}}"');
    expect(profile).not.toContain('<input type="hidden" name="gravatar"');
    // Section titles sit inside their fieldset, not on its border, and the picture's title matches them.
    const settingsCss = read("components", "common", "settings", "settings.css");
    expect(settingsCss).toMatch(/fieldset > legend \{\s*float: left;\s*width: 100%;\s*border: 0;/);
    expect(settingsCss).toContain("& .theme-settings-aside > h3 {");
    expect(read("components", "common", "nav-list", "nav-list.css")).toMatch(
      /& summary > \.svg:first-child \{\s*flex: none;\s*margin: 0;/
    );
    expect(read("components", "common", "dropdown", "dropdown.tmpl")).toContain("{{if not .NoCaret}}");
    const orgs = read("templates", "user", "settings", "organization.tmpl");
    expect(orgs).toContain("{{if .IsOwnedBy ctx $.SignedUser.ID}}");
    expect(orgs).toContain('href="{{.OrganisationLink}}/settings"');
  });

  it("lists a repository's packages like a user's or an organization's", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, ...parts), "utf-8");
    expect(read("templates", "repo", "packages.tmpl")).toContain('{{template "components/package/list/list" .}}');
    expect(read("templates", "user", "profile_packages.tmpl")).toContain(
      '{{template "components/package/list/list" .}}'
    );
    // Forgejo's flash message is a classless div; the old list rule boxed it into a stray line.
    expect(read("styles", "components", "repo", "packages.ts")).not.toContain("div:not([class])");
    expect(read("scripts", "assembleForgejo.ts")).toContain('readdirSync(join(root, "components"))');
    expect(
      fs.existsSync(
        path.join(DIST_DIR, "forgejo", "public", "assets", "css", "components", "package", "list", "list.css")
      )
    ).toBe(true);
  });

  it("gives the create pages GitHub's page heading and the settings form groups", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, ...parts), "utf-8");
    const form = read("components", "common", "form", "form.css");
    expect(form).toContain(".page-content.new:is(.repo, .org, .migrate, .fork, .milestone)");
    expect(form).toContain(".inline.field > label:first-child:empty");
    expect(read("components", "common", "settings", "settings.css")).not.toContain("& .ui.checkbox {");
    const create = read("styles", "pages", "create.css");
    expect(create).toContain(".page-content.new:is(.repo, .org, .migrate, .fork) .ui.form > .ui.top.attached.header");
    expect(create).toContain(".page-content.repository.new.migrate .migrate-entries");
    // The theme's boxed create pages are gone, and its rules use Forgejo's classes, not Gitea's new-repo.
    expect(read("styles", "public", "attached.ts")).not.toContain("new.migrate");
    expect(read("styles", "components", "newrepo.ts")).toContain(".page-content.repository.new.repo {");
  });

  it("shows the issue's branch as GitHub's Development section, last in both issue sidebars", () => {
    const read = (...parts: string[]) =>
      fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "issue", ...parts), "utf-8");
    const field = read("view_content", "sidebar", "branch_selector_field.tmpl");
    expect(field).toContain("<strong>Development</strong>");
    expect(field).toContain('<span class="text branch-name gt-ellipsis">');
    expect(field).not.toContain('<div class="divider"></div>');
    const form = read("new_form.tmpl");
    const order = [
      "sidebar/assignees",
      "labels_selector_field",
      "select-project dropdown",
      "select-milestone dropdown",
      "sidebar/branch_selector_field",
    ].map(part => form.indexOf(part));
    expect(order.every(index => index > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("joins the file editor's tabs and find button to the editor as GitHub's box header", () => {
    const style = fs.readFileSync(path.join(ROOT_DIR, "styles", "components", "repo", "repo_file_view.ts"), "utf-8");
    expect(style).toContain("#editor-bar ~ .ui.bottom.tab.segment {");
    expect(style).toContain("background: ${themeVars.color.box.header};");
  });

  it("lists forks in a box and shows GitHub's empty state without them", () => {
    const forks = fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "forks.tmpl"), "utf-8");
    expect(forks).toContain('<li class="theme-box-list-row theme-fork-row">');
    expect(forks).toContain("No one has forked this repository yet");
  });

  it("heads organization settings with the settings context, as personal settings", () => {
    const layout = fs.readFileSync(path.join(ROOT_DIR, "templates", "org", "settings", "layout_head.tmpl"), "utf-8");
    expect(layout).not.toContain('template "org/header"');
    expect(layout).toContain('template "components/common/settings/context"');
  });

  it("shows subscriptions and watched repositories in the notifications sidebar layout", () => {
    const read = (...parts: string[]) =>
      fs.readFileSync(path.join(ROOT_DIR, "templates", "user", "notification", ...parts), "utf-8");
    expect(read("notification_div.tmpl")).toContain('template "user/notification/sidebar"');
    const subscriptions = read("notification_subscriptions.tmpl");
    expect(subscriptions).toContain('template "user/notification/sidebar" dict "Data" . "Current" $current');
    expect(subscriptions).toContain('"Items" "user/notification/subscriptions_sort"');
    expect(read("sidebar.tmpl")).toContain('href="{{AppSubUrl}}/notifications/watching"');
  });

  it("gives a team GitHub's sidebar and underline tabs without Forgejo's teal button", () => {
    const read = (...parts: string[]) =>
      fs.readFileSync(path.join(ROOT_DIR, "templates", "org", "team", ...parts), "utf-8");
    const sidebar = read("sidebar.tmpl");
    expect(sidebar).not.toContain("teal");
    expect(sidebar).toContain('class="ui button theme-control theme-team-settings"');
    expect(read("navbar.tmpl")).toContain('<span class="theme-counter theme-counter-tab">{{.Team.NumMembers}}</span>');
  });

  it("keeps Forgejo's organization blocks: team privacy, invitations, empty members and funding", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, "templates", "org", ...parts), "utf-8");
    // Only a team's members and the owners see who is in it; everyone else gets its description.
    const teams = read("team", "teams.tmpl");
    const gate = "{{if or (index $.DoerIsMember .ID) $.IsOrganizationOwner}}";
    const members = teams.indexOf('{{template "shared/user/avatarlink" dict "user" .}}');
    expect(members).toBeGreaterThan(teams.lastIndexOf(gate, members));
    expect(teams.lastIndexOf(gate, members)).toBeGreaterThan(teams.indexOf('{{ctx.Locale.Tr "view"}}'));
    expect(teams.slice(members)).toContain('{{ctx.Locale.Tr "org.teams.no_desc"}}');
    const home = read("home.tmpl");
    expect(home).toContain("{{if .Invite}}");
    expect(home).toContain('href="{{AppSubUrl}}/org/invite/{{.Invite.Token}}">{{ctx.Locale.Tr "org.view_invite"}}</a>');
    expect(read("member", "members.tmpl")).toMatch(
      /\{\{else\}\}\s*<div class="theme-empty theme-empty-compact">[\s\S]*?org\.members\.no_public_members/
    );
    const header = read("header.tmpl");
    expect(header).toContain('{{template "shared/donation_button" .}}');
    expect(header).toContain('{{template "shared/funding" .}}');
  });

  it("lays out password recovery and activation like sign-in", () => {
    for (const page of ["forgot_passwd.tmpl", "reset_passwd.tmpl", "activate.tmpl"]) {
      const template = fs.readFileSync(path.join(ROOT_DIR, "templates", "user", "auth", page), "utf-8");
      expect(template, page).toContain('<div class="registration-panel">');
      expect(template, page).toContain('<img class="signin-logo"');
      expect(template, page).not.toContain("ui middle very relaxed page grid");
    }
  });

  it("lays out Home as GitHub's dashboard and shares its context with the dashboard lists", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, ...parts), "utf-8");
    const home = read("templates", "user", "dashboard", "dashboard.tmpl");
    expect(home).toContain('{{template "components/dashboard/context/context" dict "Data" . "Page" ""}}');
    expect(home).toContain('{{template "components/dashboard/context/pages" dict "Data" . "Current" "home"}}');
    expect(home).toContain('template "components/repository/picker/picker"');
    expect(home).not.toContain('template "user/heatmap"');
    expect(home).not.toContain('template "user/dashboard/repolist"');
    // The feed in day groups beside the work rail; the profile keeps Forgejo's own feed.
    expect(home).toContain('{{template "components/dashboard/feed/feed" .}}');
    expect(home).toContain('{{template "components/dashboard/work/work" .}}');
    expect(home).not.toContain('template "user/dashboard/feeds"');
    const work = read("components", "dashboard", "work", "work.tmpl");
    // The rail keeps its column while it loads, unless it was empty last time.
    expect(work).toContain('aria-busy="true">');
    expect(work).toContain('localStorage.getItem(rail.dataset.key) === "empty"');
    expect(read("components", "dashboard", "work", "panel.tmpl")).toContain(" hidden>");
    expect(read("components", "repository", "milestone", "list.tmpl")).toContain('data-due="{{.DeadlineString}}"');
    for (const page of ["issues.tmpl", "milestones.tmpl"]) {
      const list = read("templates", "user", "dashboard", page);
      expect(list, page).toContain('template "components/dashboard/context/context"');
      expect(list, page).toContain('template "components/dashboard/context/pages"');
    }
    // The switch menu needs the template context: the page's Context has no avatar helper.
    expect(read("components", "dashboard", "context", "context.tmpl")).toContain('"Data" (dict "Context" ctx ');
    expect(fs.existsSync(path.join(ROOT_DIR, "templates", "user", "dashboard", "navbar.tmpl"))).toBe(false);
  });

  it("matches GitHub's repository About, visibility, and code-search details", () => {
    const headerStyle = fs.readFileSync(path.join(ROOT_DIR, "styles", "templates", "repo", "header.ts"), "utf-8");
    const headerTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "home_header.tmpl"), "utf-8");
    const repoContentStyle = fs.readFileSync(
      path.join(ROOT_DIR, "styles", "templates", "repo", "view_content.ts"),
      "utf-8"
    );
    const sidebarTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "home_sidebar_top.tmpl"), "utf-8");

    expect(sidebarTemplate).toContain("No description, website, or topics provided.");
    expect(sidebarTemplate).not.toContain('ctx.Locale.Tr "repo.no_desc"');
    expect(headerTemplate).toContain("repository-visibility-label");
    expect(headerStyle).toContain("> .ui.label.repository-visibility-label");
    expect(repoContentStyle).toContain(".repo-home-sidebar-top > .repo-about-block");
    expect(repoContentStyle).toContain(".repo-about-block > .repo-about-heading");
    expect(repoContentStyle).toContain("> .repo-description.no-description");
    expect(repoContentStyle).toContain("font-style: italic;");
    expect(sidebarTemplate).toContain('name="topics" type="text" value="{{StringUtils.Join .Topics ","}}"');
    expect(repoContentStyle).toContain('input:is([name="description"], [name="website"], [name="topics"])');
    expect(repoContentStyle).toContain("> .ui.dropdown.selection");
    expect(repoContentStyle).toContain("border-radius: 0 !important;");
  });

  it("matches GitHub's latest-commit row while preserving Forgejo commit data", () => {
    const repoFilesStyle = fs.readFileSync(
      path.join(ROOT_DIR, "styles", "components", "repo", "repo_files.ts"),
      "utf-8"
    );
    const repoSidebarStyle = fs.readFileSync(
      path.join(ROOT_DIR, "styles", "components", "repo", "repo_sidebar.ts"),
      "utf-8"
    );
    const viewListStyle = fs.readFileSync(path.join(ROOT_DIR, "styles", "templates", "repo", "view_list.ts"), "utf-8");
    const viewListTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "view_list.tmpl"), "utf-8");
    const latestCommitTemplate = fs.readFileSync(
      path.join(ROOT_DIR, "templates", "repo", "latest_commit_row.tmpl"),
      "utf-8"
    );
    const commitsListTemplate = fs.readFileSync(
      path.join(ROOT_DIR, "components", "repository", "commit-groups", "commit-groups.tmpl"),
      "utf-8"
    );
    const commitSubjectTemplate = fs.readFileSync(
      path.join(ROOT_DIR, "templates", "repo", "commit_message_subject.tmpl"),
      "utf-8"
    );

    expect(latestCommitTemplate).toContain('class="repo-latest-commit-row"');
    expect(latestCommitTemplate).toContain('<h2 class="sr-only">Latest commit</h2>');
    expect(latestCommitTemplate).toContain('class="repo-latest-commit-primary"');
    expect(latestCommitTemplate).toContain('class="repo-latest-commit-avatar" tabindex="0"');
    expect(latestCommitTemplate).toContain('class="repo-latest-commit-author-card"');
    expect(latestCommitTemplate).toContain('printf "author:%s" $latestCommitAuthorName');
    expect(latestCommitTemplate).toContain('QueryEscape (printf "author:%s" $latestCommitAuthorName)');
    expect(latestCommitTemplate).toContain('class="repo-latest-commit-actions"');
    expect(latestCommitTemplate).toContain('{{printf "%.7s" .LatestCommit.ID.String}}');
    expect(latestCommitTemplate).toContain(
      "{{if and .LatestCommit.Signature .LatestCommitVerification .LatestCommitVerification.Verified}}"
    );
    expect(latestCommitTemplate).toContain('template "repo/shabox_badge"');
    expect(latestCommitTemplate).toContain('template "repo/commit_statuses"');
    expect(latestCommitTemplate).toContain('template "repo/commit_message_subject"');
    expect(commitsListTemplate).toContain('template "repo/commit_list_item"');
    expect(fs.readFileSync(path.join(ROOT_DIR, "templates/repo/commit_list_item.tmpl"), "utf-8")).toContain(
      'template "repo/commit_message_subject"'
    );
    expect(commitSubjectTemplate).toContain('StringUtils.Cut .Summary " (#"');
    expect(commitSubjectTemplate).toContain('"class=\\"ref-issue\\""');
    expect(commitSubjectTemplate).toContain(
      "{{- RenderCommitMessageLinkSubject .Context $subject .CommitLink .Metas}} ({{$renderedReference}})"
    );
    expect(viewListTemplate).not.toContain('{{template "repo/latest_commit" .}}');
    expect(viewListTemplate).toContain('template "repo/latest_commit_row"');
    expect(viewListStyle).toContain("min-height: 52px;");
    expect(viewListStyle).toContain(".repo-latest-commit-row");
    expect(viewListStyle).toContain(".repo-latest-commit-row > .sr-only");
    expect(viewListStyle).toContain("clip: rect(0, 0, 0, 0);");
    expect(viewListStyle).toContain("min-height: 44px;");
    expect(viewListStyle).toContain("flex: 0 0 28px;");
    expect(viewListStyle.replace(/\s+/g, " ")).toContain(".repo-latest-commit-message > .message-wrapper a:hover");
    expect(viewListStyle).toContain("color: ${themeVars.github.fgColor.accent};");
    expect(viewListStyle).toContain(".repo-latest-commit-attribution:has(");
    expect(viewListStyle).toContain("margin-left: 8px;");
    expect(viewListStyle).toContain("#repo-files-table .repo-file-cell.name > svg");
    expect(viewListStyle).toContain("color: ${themeVars.color.text.light.num1};");
    expect(viewListStyle).toContain("text-transform: capitalize;");
    // GitHub's language legend: 12px between entries, an 8px dot 8px before the name, 4px before the share.
    expect(repoSidebarStyle).toContain(".language-stats-details {");
    expect(repoSidebarStyle).toContain("gap: 3px 12px;");
    expect(repoSidebarStyle).toContain("margin-right: 8px;");
    expect(repoSidebarStyle).toContain("margin-right: 4px;");
    expect(repoFilesStyle).not.toContain("&.repo-file-last-commit");
  });

  it("ports the Forgejo commit page to GitHub's header, metadata card, and diff layout", () => {
    const commitPageStyle = fs.readFileSync(
      path.join(ROOT_DIR, "styles", "templates", "repo", "commit_page.ts"),
      "utf-8"
    );
    const commitPageTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "commit_page.tmpl"), "utf-8");

    expect(commitPageTemplate).toContain('class="page-content repository diff commit-page"');
    expect(commitPageTemplate).toContain('id="commit-title">Commit <code>{{printf "%.7s" .CommitID}}');
    expect(commitPageTemplate).toContain('class="commit-attribution"');
    expect(commitPageTemplate).toContain('class="commit-card"');
    expect(commitPageTemplate).toContain('class="commit-meta-row"');
    expect(commitPageTemplate).toContain('class="commit-stats-row"');
    expect(commitPageTemplate).toContain('data-clipboard-text="{{.CommitID}}"');
    expect(commitPageTemplate).toContain("{{if and .Commit.Signature .Verification.Verified}}");
    expect(commitPageTemplate).toContain('template "repo/diff/box"');
    expect(commitPageTemplate).not.toContain('template "repo/commit_header"');
    const diffBoxTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "diff", "box.tmpl"), "utf-8");
    expect(diffBoxTemplate).toContain('class="diff-file-tree-panel not-mobile"');
    expect(diffBoxTemplate).toContain('class="diff-file-tree-scroll"');
    expect(diffBoxTemplate).toContain('class="diff-file-tree-controls"');
    expect(diffBoxTemplate).toContain('id="diff-file-tree"');
    expect(diffBoxTemplate).toContain('id="diff-content-container"');
    expect(diffBoxTemplate).toContain('class="diff-detail-box diff-box diff-content-controls"');
    expect(diffBoxTemplate).toContain('class="diff-content-controls-left"');
    expect(diffBoxTemplate).toContain('class="diff-content-controls-right diff-detail-actions button-row"');
    expect(diffBoxTemplate).toContain('class="diff-content-body"');
    expect(diffBoxTemplate).toContain(
      "const diffTreeVisible = localStorage?.getItem('diff_file_tree_visible') !== 'false';"
    );
    const diffViewStyle = fs.readFileSync(path.join(ROOT_DIR, "styles", "components", "repo", "diff_view.ts"), "utf8");
    expect(diffViewStyle).toContain("min-height: 40px;");
    expect(commitPageStyle).not.toContain("repository-content-header");
    expect(diffBoxTemplate).toContain('template "repo/diff/file_header"');
    expect(commitPageTemplate).toContain('template "repo/diff/change_summary"');
    // Forgejo's signature details, which commit_header shows below the commit, as a row of the card.
    expect(commitPageTemplate).toContain('class="commit-signature-row {{$signClass}}"');
    expect(commitPageTemplate).toContain('ctx.Locale.Tr "repo.commits.signed_by_untrusted_user_unmatched"');
    expect(commitPageTemplate).toContain("{{.Verification.SigningKey.PaddedKeyID}}");
    expect(commitPageTemplate).toContain("{{.Verification.SigningSSHKey.Fingerprint}}");
    expect(commitPageStyle).toContain(".commit-signature-row.sign-warning .commit-signature-icon");
  });

  it("opens every show-modal target as a <dialog>, which Forgejo 17's show-modal calls showModal() on", () => {
    // Targets a theme template triggers but Forgejo's own, unchanged templates render.
    const upstreamDialogs = new Set(["push-mirror-edit-modal"]);
    const templates = ["templates", "components"].flatMap(dir =>
      fs
        .readdirSync(path.join(ROOT_DIR, dir), { recursive: true })
        .map(String)
        .filter(file => file.endsWith(".tmpl"))
        .map(file => fs.readFileSync(path.join(ROOT_DIR, dir, file), "utf-8"))
    );
    const source = templates.join("\n");
    // Template ids such as "edit-project-column-modal-{{.ID}}" are compared up to their first action.
    const idPrefix = (id: string) => id.split("{{")[0];
    const dialogIds = [...source.matchAll(/<dialog\b[^>]*\bid="([^"]+)"/g)].map(match => idPrefix(match[1]));
    const modalIds = [...source.matchAll(/<div\b[^>]*\bclass="[^"]*\bmodal\b[^"]*"[^>]*\bid="([^"]+)"/g)].map(match =>
      idPrefix(match[1])
    );
    const targets = templates.flatMap(template =>
      [...template.matchAll(/<[a-z]+\b[^>]*\bshow-modal\b[^>]*>/g)].flatMap(match =>
        [...match[0].matchAll(/\bdata-modal="#([^"]+)"/g)].map(target => idPrefix(target[1]))
      )
    );

    expect(targets).toContain("cherry-pick-modal");
    expect(targets).toContain("delete-note-modal");
    for (const target of new Set(targets)) {
      if (upstreamDialogs.has(target)) continue;
      expect(modalIds, `#${target} is a Fomantic modal`).not.toContain(target);
      expect(dialogIds, `#${target} has no <dialog>`).toContain(target);
    }
  });

  it("keeps the adapted repository and commit layouts bounded at phone breakpoints", () => {
    const headerStyle = fs.readFileSync(path.join(ROOT_DIR, "styles", "templates", "repo", "header.ts"), "utf-8");
    const homeStyle = fs.readFileSync(path.join(ROOT_DIR, "styles", "templates", "repo", "home.ts"), "utf-8");
    const viewContentStyle = fs.readFileSync(
      path.join(ROOT_DIR, "styles", "templates", "repo", "view_content.ts"),
      "utf-8"
    );
    const viewListStyle = fs.readFileSync(path.join(ROOT_DIR, "styles", "templates", "repo", "view_list.ts"), "utf-8");
    const commitPageStyle = fs.readFileSync(
      path.join(ROOT_DIR, "styles", "templates", "repo", "commit_page.ts"),
      "utf-8"
    );

    for (const style of [headerStyle, homeStyle, viewContentStyle, viewListStyle, commitPageStyle]) {
      expect(style).toContain("@media (max-width: 767.98px)");
    }

    // GitHub keeps its 16px gutter on phones and drops the tab icons there.
    expect(headerStyle).not.toContain("padding-left: 8px;");
    expect(headerStyle).toContain(".overflow-menu-items > .item > svg {");
    expect(headerStyle).toContain(".repo-buttons");
    expect(viewContentStyle).toContain("> .repo-button-row-left");
    expect(viewContentStyle).toContain("> .repo-button-row-right");
    expect(viewContentStyle).toContain("width: 100%;");
    expect(viewContentStyle).toContain("max-height: calc(100vh - 48px);");
    expect(homeStyle).toContain("grid-template-columns: 100%;");
    expect(viewListStyle).toContain("max-width: none;");
    expect(commitPageStyle).toContain("overflow-x: auto;");
    expect(commitPageStyle).toContain(".commit-meta-row");
    expect(commitPageStyle).toContain("flex-direction: column;");
  });

  it("keeps the issue list filters in a sideways scrolling row on phones, as GitHub does", () => {
    const overviewStyle = fs.readFileSync(
      path.join(ROOT_DIR, "styles", "components", "issues", "issue_overview.ts"),
      "utf-8"
    );
    const phone = overviewStyle.slice(overviewStyle.indexOf("@media (max-width: 767.98px)"));
    const filters = ["repo/issue/filters.tmpl", "user/dashboard/issues.tmpl"].map(template =>
      fs.readFileSync(path.join(ROOT_DIR, "templates", template), "utf-8")
    );

    expect(phone).not.toMatch(/#issue-filters > \.issue-list-toolbar-right \{\s*display: none;/);
    expect(phone).toMatch(
      /#issue-filters > \.issue-list-toolbar-right \{[^}]*max-width: none;[^}]*overflow-x: auto;[^}]*scrollbar-width: none;/
    );
    expect(phone).toMatch(/#issue-filters > \.issue-list-toolbar-right > \.ui\.menu \{[^}]*flex-wrap: nowrap;/);
    // A menu inside the scrolling row escapes its clipping as a sheet fixed to the screen.
    expect(phone).toMatch(/\.issue-list-toolbar-right \.ui\.dropdown > \.menu \{[^}]*position: fixed;/);
    for (const template of filters) {
      expect(template).toContain('<div class="issue-list-toolbar-right">');
      expect(template).not.toContain("issue-mobile-filter-toggle");
    }
  });

  it("keeps adapted templates in the standard template tree", () => {
    for (const template of requiredTemplates) {
      expect(fs.existsSync(path.join(ROOT_DIR, "templates", template)), `missing template: ${template}`).toBe(true);
    }
  });

  it("passes the heatmap every locale string Forgejo's heatmap.js reads", () => {
    const heatmapTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "user", "heatmap.tmpl"), "utf-8");

    expect(heatmapTemplate).toContain("data-heatmap-data");
    for (const key of [
      "total-contributions",
      "contributions-zero",
      "contributions-format",
      "contributions-one",
      "contributions-few",
      "more",
      "less",
    ])
      expect(heatmapTemplate).toContain(`data-locale-${key}=`);
  });

  it("renders the navbar stopwatch as Forgejo's stopwatch.js expects", () => {
    const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT_DIR, "templates", ...parts), "utf-8");
    const navbar = read("base", "head_navbar.tmpl");
    const icons = read("base", "head_navbar_icons.tmpl");
    const drawer = read("base", "navbar_drawer.tmpl");

    // One trigger, rendered while no stopwatch runs so a stopwatch started in another tab can show it.
    expect(navbar.match(/"Stopwatch" true/g)).toHaveLength(1);
    expect(icons).toContain(
      'class="item active-stopwatch-trigger {{$itemExtraClass}}{{if not $data.ActiveStopwatch}} tw-hidden{{end}}"'
    );
    // A tooltip on the trigger would replace the popup in its tippy, as upstream avoids too.
    expect(icons).toContain('data-tippy-content="{{ctx.Locale.Tr "active_stopwatch"}}"');
    expect(navbar).toContain("{{if and .IsSigned (not .HideNavbarLinks) EnableTimetracking}}");
    for (const name of [
      "active-stopwatch-popup",
      "stopwatch-link",
      "stopwatch-issue",
      "stopwatch-commit",
      "stopwatch-cancel",
    ])
      expect(navbar).toContain(`class="${name}`);
    expect(navbar).toContain('stopwatch-time tw-m-0" data-seconds="{{.ActiveStopwatch.Seconds}}"');
    expect(drawer).toContain('{{if and EnableTimetracking .ActiveStopwatch}}<a href="{{.ActiveStopwatch.IssueLink}}">');
  });

  it("links the documentation through AppDocsURL", () => {
    const templates = ["templates", "components"].flatMap(dir =>
      fs
        .readdirSync(path.join(ROOT_DIR, dir), { recursive: true, encoding: "utf-8" })
        .filter(file => file.endsWith(".tmpl"))
        .map(file => path.join(ROOT_DIR, dir, file))
    );

    for (const file of templates)
      expect(fs.readFileSync(file, "utf-8"), path.relative(ROOT_DIR, file)).not.toContain("forgejo.org/docs");
  });

  it("matches GitHub's sign-in form structure", () => {
    const signInTemplate = fs.readFileSync(
      path.join(ROOT_DIR, "templates", "user", "auth", "signin_inner.tmpl"),
      "utf-8"
    );
    const oauthTemplate = fs.readFileSync(
      path.join(ROOT_DIR, "templates", "user", "auth", "oauth_container.tmpl"),
      "utf-8"
    );

    expect(signInTemplate).toContain("signin-field-label");
    expect(signInTemplate).toContain("signin-logo");
    expect(signInTemplate).toContain('role="heading" aria-level="1"');
    expect(signInTemplate).toContain("Sign in to {{AppDisplayName}}");
    expect(signInTemplate).not.toContain('class="required field');
    // Forgejo's Remember this device: the session outlives the browser only when it is checked.
    expect(signInTemplate).toContain('<input name="remember" type="checkbox"> {{ctx.Locale.Tr "auth.remember_me"}}');
    expect(signInTemplate).toContain('href="{{AppSubUrl}}/user/forgot_password"');
    expect(oauthTemplate).toContain("Continue with {{$provider.DisplayName}}");
    expect(oauthTemplate).not.toContain("sign_in_with_provider");
  });

  it("keeps registration form and account-linking contracts while sharing the auth presentation", () => {
    const auth = path.join(ROOT_DIR, "templates", "user", "auth");
    const page = fs.readFileSync(path.join(auth, "signup.tmpl"), "utf-8");
    const form = fs.readFileSync(path.join(auth, "signup_inner.tmpl"), "utf-8");
    expect(page).toContain('{{template "user/auth/signup_inner" .}}');
    expect(form).toContain('action="{{.SignUpLink}}" method="post"');
    for (const field of ["user_name", "email", "password", "retype"]) {
      expect(form).toContain(`name="${field}"`);
      expect(form).toContain(`value="{{.${field}}}"`);
      expect(form).toContain(`for="${field}"`);
    }
    expect(form).toContain(".DisableRegistrationReason");
    expect(form).toContain("{{if .DisableRegistration}}");
    expect(form).toContain("{{if not .DisablePassword}}");
    expect(form).toContain(".LinkAccountModeRegister");
    expect(form).toContain('"auth.oauth_signup_title"');
    expect(form).toContain('"auth.oauth_signup_submit"');
    expect(form).toContain('{{template "custom/signup_top"}}');
    expect(form).toContain('{{template "user/auth/captcha" .}}');
    expect(form).toContain('{{template "user/auth/oauth_container" .}}');
    expect(form).toContain('{{template "base/alert" .}}');
    expect(form.match(/autocomplete="new-password" required/g)).toHaveLength(2);
    expect(form).toContain('class="ui form{{if not .LinkAccountMode}} ignore-dirty{{end}}"');
    expect(form).toContain('"auth.hint_login" (printf "%s/user/login" AppSubUrl)');
    expect(form).toContain('class="signin-branding"');
    expect(form).toContain('class="signin-logo"');
    expect(form).toContain('class="signin-footer"');
    expect(form).not.toContain("ui top attached header");
    // A site-wide username prefix stays visible before the field, with Forgejo's note on it.
    expect(form).toContain('<div class="ui label">{{.UsernamePrefix}}</div>');
    expect(form).toContain('"auth.signup.username.prefix.info" .UsernamePrefix');
  });

  it("preserves Forgejo's native two-factor form contracts in the shared challenge layout", () => {
    const authDirectory = path.join(ROOT_DIR, "templates", "user", "auth");
    const challenge = fs.readFileSync(path.join(authDirectory, "twofa_challenge.tmpl"), "utf-8");

    for (const [file, recovery] of [
      ["twofa.tmpl", "false"],
      ["twofa_scratch.tmpl", "true"],
    ]) {
      const page = fs.readFileSync(path.join(authDirectory, file), "utf-8");
      expect(page).toContain(`"user/auth/twofa_challenge" (dict "ctxData" . "Recovery" ${recovery})`);
      expect(page).toContain('{{template "base/head" .}}');
      expect(page).toContain('{{template "base/footer" .}}');
    }

    expect(challenge).toContain('action="{{.Link}}" method="post"');
    expect(challenge).toContain('{{template "base/alert" .}}');
    expect(challenge).toContain('id="passcode" name="passcode" type="text"');
    expect(challenge).toContain('autocomplete="one-time-code"');
    expect(challenge).toContain('inputmode="numeric" pattern="[0-9]*" autofocus required');
    expect(challenge).toContain('id="token" name="token" type="text"');
    expect(challenge).toContain('autocomplete="off" autocapitalize="none" spellcheck="false" autofocus required');
    expect(challenge).toContain('aria-label="{{ctx.Locale.Tr "passcode"}}"');
    expect(challenge).toContain('aria-label="{{ctx.Locale.Tr "auth.scratch_code"}}"');
    expect(challenge).toContain('href="{{AppSubUrl}}/user/two_factor"');
    expect(challenge).toContain('href="{{AppSubUrl}}/user/two_factor/scratch"');
    expect(challenge).not.toContain('class="page-content user signin');
    expect(challenge).not.toContain("tw-max-w-2xl");
  });
});

describe("auto 主题 CSS 内容验证", () => {
  for (const fileName of AUTO_THEME_FILES) {
    describe(fileName, () => {
      let css: string;

      beforeAll(() => {
        css = fs.readFileSync(path.join(DIST_DIR, fileName), "utf-8");
      });

      it("文件非空", () => {
        expect(css.length, `${fileName} 不应为空文件`).toBeGreaterThan(0);
      });

      it("包含 @import 和 prefers-color-scheme 媒体查询", () => {
        const hasImport = css.includes("@import");
        const hasMediaQuery = css.includes("prefers-color-scheme");
        expect(hasImport && hasMediaQuery, `${fileName} 应包含 @import 和 prefers-color-scheme`).toBe(true);
      });
    });
  }
});

describe("暗/亮主题语义验证", () => {
  /** 从文件名推断是否为暗色主题 */
  function isDarkTheme(fileName: string): boolean {
    if (fileName.includes("-light")) return false;
    if (fileName.includes("-latte")) return false;
    return true; // dark, soft-dark, mocha, frappe, macchiato 等默认为暗色
  }

  for (const fileName of SOLID_THEME_FILES) {
    it(`${fileName}: color-scheme 与主题类型匹配`, () => {
      const css = fs.readFileSync(path.join(DIST_DIR, fileName), "utf-8");
      const dark = isDarkTheme(fileName);

      if (dark) {
        expect(css, `${fileName} 暗色主题应包含 color-scheme: dark`).toMatch(/color-scheme:\s*dark/);
      } else {
        expect(css, `${fileName} 亮色主题应包含 color-scheme: light`).toMatch(/color-scheme:\s*light/);
      }
    });
  }
});

// ============================================================================
// CSS 文件大小增长限制 — 防止意外膨胀
// ============================================================================

/** 单文件大小上限 */
const SIZE_LIMITS = {
  /** auto 主题仅有 @import + 元信息，应保持极小 */
  AUTO_MAX: 1 * 1024, // 1 KB
  /** 非 auto 主题包含完整主题变量 + 公共样式，当前约 207-216 KB */
  SOLID_MAX: 220 * 1024, // 220 KB (给予主题页面样式增长空间)
  /** 所有 CSS 文件总大小上限，当前约 2.6 MB */
  TOTAL_MAX: 5 * 1024 * 1024, // 5 MB
} as const;

describe("CSS 文件大小限制", () => {
  it("所有 auto 主题文件大小 < 1KB", () => {
    const oversized: string[] = [];
    for (const fileName of AUTO_THEME_FILES) {
      const size = fs.statSync(path.join(DIST_DIR, fileName)).size;
      if (size >= SIZE_LIMITS.AUTO_MAX) {
        oversized.push(`${fileName}: ${(size / 1024).toFixed(1)}KB`);
      }
    }
    expect(
      oversized,
      `以下 auto 主题文件体积超过 ${SIZE_LIMITS.AUTO_MAX / 1024}KB 上限:\n${oversized.join("\n")}`
    ).toEqual([]);
  });

  it("所有非 auto 主题文件大小 < 220KB", () => {
    const oversized: string[] = [];
    for (const fileName of SOLID_THEME_FILES) {
      const size = fs.statSync(path.join(DIST_DIR, fileName)).size;
      if (size >= SIZE_LIMITS.SOLID_MAX) {
        oversized.push(`${fileName}: ${(size / 1024).toFixed(1)}KB`);
      }
    }
    expect(
      oversized,
      `以下非 auto 主题文件体积超过 ${SIZE_LIMITS.SOLID_MAX / 1024}KB 上限:\n${oversized.join("\n")}`
    ).toEqual([]);
  });

  it("所有 CSS 文件总大小 < 5MB", () => {
    let totalSize = 0;
    for (const fileName of EXPECTED_THEME_FILES) {
      totalSize += fs.statSync(path.join(DIST_DIR, fileName)).size;
    }
    expect(
      totalSize,
      `CSS 文件总大小 ${(totalSize / 1024 / 1024).toFixed(2)}MB 超过 ${SIZE_LIMITS.TOTAL_MAX / 1024 / 1024}MB 上限`
    ).toBeLessThan(SIZE_LIMITS.TOTAL_MAX);
  });
});

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
    const extra = actualFiles.filter(f => !expectedSet.has(f));
    expect(extra, `存在多余主题文件: ${extra.join(", ")}`).toEqual([]);
  });
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
    ".vch__legend",
    ".codemirror-container",
  ];

  const requiredTemplates = [
    "base/head_navbar.tmpl",
    "base/head_navbar_icons.tmpl",
    "repo/global_header.tmpl",
    "repo/header.tmpl",
    "repo/home.tmpl",
    "repo/home_sidebar_bottom.tmpl",
    "repo/home_sidebar_top.tmpl",
    "repo/view_content.tmpl",
    "repo/view_list.tmpl",
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

  it("includes Forgejo-native rules in the standard theme output", () => {
    const css = fs.readFileSync(path.join(DIST_DIR, `${PREFIX}light.css`), "utf-8");

    for (const selector of requiredSelectors) {
      expect(css, `Forgejo theme output should contain ${selector}`).toContain(selector);
    }
  });

  it("ships GitHub's proportional font and applies its Primer stack", () => {
    const css = fs.readFileSync(path.join(DIST_DIR, `${PREFIX}light.css`), "utf-8");
    const sourceFont = path.join(ROOT_DIR, "public", "assets", "fonts", "MonaSansVF-v2.0.27.woff2");
    const builtFont = path.join(DIST_DIR, "assets", "fonts", "MonaSansVF-v2.0.27.woff2");
    const fontLicense = path.join(DIST_DIR, "assets", "fonts", "MonaSans-OFL.txt");

    expect(css).toContain("font-family:Mona Sans VF");
    expect(css).toContain("url(../fonts/MonaSansVF-v2.0.27.woff2)");
    expect(css).toContain('--fonts-proportional:"Mona Sans VF", -apple-system, BlinkMacSystemFont');
    expect(fs.existsSync(sourceFont)).toBe(true);
    expect(fs.existsSync(builtFont)).toBe(true);
    expect(fs.existsSync(fontLicense)).toBe(true);
    expect(fs.statSync(builtFont).size).toBeGreaterThan(100_000);
  });

  it("matches GitHub's measured repository navigation geometry", () => {
    const header = fs.readFileSync(path.join(ROOT_DIR, "styles", "templates", "repo", "header.ts"), "utf-8");
    const navbarTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "base", "head_navbar.tmpl"), "utf-8");

    expect(header).toContain("height: 52px;");
    expect(header).toContain("padding-top: 16px;");
    expect(header).toContain("border-bottom: 0;");
    expect(header).toContain(".navbar-left > #navbar-logo.item");
    expect(header).toContain("height: 48px;");
    expect(header).toContain("gap: 8px;");
    expect(header).toContain("margin: 0 7px;");
    expect(header).toContain(".repository-navbar-breadcrumb > a.repository-navbar-name");
    expect(header).toContain("margin: 0 0 8px !important;");
    expect(header).toContain("padding: 6px 8px !important;");
    expect(header).toContain("line-height: 21px;");
    expect(header).toContain("bottom: -8px;");
    expect(navbarTemplate).toContain("{{ctx.AvatarUtils.Avatar .Owner 16}}");
    expect(navbarTemplate).not.toContain('class="repository-navbar-owner-avatar"');
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

    expect(compactMenu).toContain(
      ".page-content.user.notification > .ui.container:has(> .ui.bottom.active.tab.segment)"
    );
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
    expect(notification).toContain("text-decoration: none;");
    expect(repoContentTemplate).toContain('class="repo-code-navigation"');
    expect(repoContentTemplate).toContain('class="repo-code-body"');
    expect(repoContentTemplate).toContain('svg "octicon-terminal" 16');
    expect(repoContentStyle).toContain("border-radius: 12px;");
    expect(repoContentStyle).toContain("width: min(400px, calc(100vw - 32px));");
    expect(repoContentStyle).toContain("grid-template-rows: 32px 32px;");
    expect(repoContentStyle).toContain("border-radius: ${otherThemeVars.border.radius} !important;");
    expect(repoContentStyle).toContain("font-size: 14px;");
    expect(repoContentStyle).toContain("padding: 0 !important;");
    expect(repoContentStyle).toContain(".repo-code-actions > li > a:hover");
  });

  it("matches GitHub's repository About, visibility, and code-search details", () => {
    const headerStyle = fs.readFileSync(path.join(ROOT_DIR, "styles", "templates", "repo", "header.ts"), "utf-8");
    const headerTemplate = fs.readFileSync(path.join(ROOT_DIR, "templates", "repo", "header.tmpl"), "utf-8");
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
    expect(repoContentStyle).toContain("min-height: 34px;");
    expect(repoContentStyle).toContain("flex: 1 1 120px;");
    expect(repoContentStyle).toContain("> .ui.dropdown.selection");
    expect(repoContentStyle).toContain("border-radius: 0 !important;");
  });

  it("keeps adapted templates in the standard template tree", () => {
    for (const template of requiredTemplates) {
      expect(fs.existsSync(path.join(ROOT_DIR, "templates", template)), `missing template: ${template}`).toBe(true);
    }
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
  /** 非 auto 主题包含完整主题变量 + 公共样式，当前约 108-117 KB */
  SOLID_MAX: 200 * 1024, // 200 KB (给予 ~70% 增长空间)
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

  it("所有非 auto 主题文件大小 < 200KB", () => {
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

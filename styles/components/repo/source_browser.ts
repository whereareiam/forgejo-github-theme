import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

export default css`
  .page-content.repository.file.list:has(#repo-source-browser) > .ui.container {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 0;
  }
  #repo-source-browser {
    display: grid;
    grid-template-columns: var(--repo-file-tree-width, 320px) 1px minmax(0, 1fr);
    min-height: 100dvh;
    align-items: start;
  }
  #repo-source-browser .repo-source-panel {
    grid-column: 1;
    grid-row: 1;
    position: sticky;
    top: 0;
    height: 100dvh;
    overflow: visible;
    padding: 16px;
    z-index: 20;
    scrollbar-gutter: stable;
  }
  #repo-source-browser > .resizable-divider {
    grid-column: 2;
    grid-row: 1;
  }
  #repo-source-browser > .repo-source-main {
    grid-column: 3;
    grid-row: 1;
    min-width: 0;
    padding: 16px;
  }
  .repo-source-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  .repo-source-title h2 {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
  }
  .repo-source-branch {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }
  .repo-source-branch > .js-branch-tag-selector {
    flex: 1;
    min-width: 0;
  }
  .repo-source-branch .js-branch-tag-selector > .ui.dropdown {
    display: block;
    width: 100%;
  }
  #repo-source-browser .repo-source-branch .branch-dropdown-button {
    justify-content: space-between !important;
  }
  .repo-source-branch .ui.button {
    width: 100%;
    margin: 0;
  }
  #repo-source-browser .repo-source-panel .repo-file-picker,
  #repo-source-browser .repo-source-panel .repo-file-picker:focus-within {
    width: 100%;
  }
  .repo-source-tree {
    --file-tree-indent: 16px;
    margin-top: 16px;
    max-height: calc(100dvh - 168px);
    overflow: auto;
  }
  .repo-source-tree-status {
    font-size: 14px;
    padding: 8px;
    color: ${themeVars.color.text.light.num1};
  }
  .repo-source-main .repo-button-row {
    min-height: 32px;
    margin-bottom: 16px;
    align-items: center;
  }
  .repo-source-main .repo-path {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    min-width: 0;
    flex-wrap: wrap;
  }
  .repo-source-main .repo-path .section {
    font-weight: 600;
  }
  .repo-source-main .repo-file-title {
    display: inline;
    margin: 0;
    font: inherit;
  }
  #repo-source-browser .repo-source-show-tree {
    display: none;
  }
  #repo-source-browser.repo-source-tree-hidden {
    grid-template-columns: minmax(0, 1fr);
  }
  #repo-source-browser.repo-source-tree-hidden > .repo-source-panel,
  #repo-source-browser.repo-source-tree-hidden > .resizable-divider {
    display: none;
  }
  #repo-source-browser.repo-source-tree-hidden > .repo-source-main {
    grid-column: 1;
  }
  #repo-source-browser.repo-source-tree-hidden .repo-source-show-tree {
    display: inline-flex;
  }
  #repo-source-browser #repo-file-commit-box {
    min-height: 46px;
    align-items: center;
    padding: 0;
    margin: 0 0 16px !important;
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    background: ${themeVars.color.body};
    gap: 8px;
  }
  #repo-source-browser #repo-file-commit-box .latest-commit {
    min-width: 0;
    flex: 1;
  }
  #repo-source-browser #repo-file-commit-box .age {
    flex-shrink: 0;
    font-size: 12px;
  }
  .repo-file-history {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: ${themeVars.color.text.self};
    flex-shrink: 0;
  }
  #repo-source-browser .file-header {
    min-height: 46px;
    padding: 6px 8px;
    gap: 8px;
    background: ${themeVars.color.box.header};
    border-color: ${themeVars.color.light.border};
  }
  .repo-file-view-tabs {
    display: inline-flex;
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    overflow: hidden;
    margin-right: 8px;
  }
  .repo-file-view-tabs a {
    padding: 3px 12px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: ${themeVars.color.text.self};
    background: ${themeVars.color.body};
  }
  .repo-file-view-tabs a.active {
    background: ${themeVars.color.button};
    font-weight: 600;
  }
  .repo-file-view-tabs a:hover {
    background: ${themeVars.color.hover.self};
    text-decoration: none;
  }
  #repo-source-browser .file-info {
    font: 12px/20px var(--fonts-monospace);
    color: ${themeVars.color.text.light.num1};
  }
  #repo-source-browser .file-view.markup {
    padding: 32px;
  }
  #repo-source-browser .file-view.markup > * {
    max-width: 1012px;
    margin-left: auto;
    margin-right: auto;
  }
  #repo-source-browser .file-view.code-view {
    overflow-x: auto;
  }
  #repo-source-browser .file-view.code-view .code-inner {
    font-size: 12px;
    line-height: 20px;
    white-space: pre;
  }
  @media (max-width: 767.98px) {
    #repo-source-browser {
      display: block;
    }
    #repo-source-browser > .resizable-divider {
      display: none;
    }
    #repo-source-browser .repo-source-panel {
      position: static;
      height: auto;
    }
    #repo-source-browser:not(.repo-source-tree-hidden) .repo-source-main {
      display: none;
    }
    #repo-source-browser .repo-source-panel .repo-file-picker {
      display: block;
    }
    #repo-source-browser .repo-source-panel .repo-find-file {
      display: flex;
    }
    #repo-source-browser .repo-source-main .repo-button-row-left {
      flex: 1;
    }
    #repo-source-browser .repo-source-main .repo-path {
      font-size: 14px;
    }
    #repo-source-browser .repo-source-main .repo-path .section {
      overflow-wrap: anywhere;
    }
    #repo-source-browser .file-view.markup {
      padding: 16px;
    }
    #repo-source-browser #repo-file-commit-box .age {
      display: none;
    }
  }
`;

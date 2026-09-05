import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

export default css`
  .diff-change-summary {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    font: 600 12px/18px var(--fonts-proportional);
  }
  .diff-additions {
    color: ${themeVars.github.fgColor.success};
  }
  .diff-deletions {
    color: ${themeVars.color.red.self};
  }
  .diff-change-bar {
    display: flex;
    flex-shrink: 0;
  }
  .diff-change-square {
    width: 8px;
    height: 8px;
    margin-left: 1px;
    border: 1px solid ${themeVars.color.light.border};
    border-radius: 2px;
  }
  .diff-change-added {
    background: ${themeVars.github.bgColor.success.emphasis};
    border-color: ${themeVars.github.bgColor.success.emphasis};
  }
  .diff-change-deleted {
    background:
      repeating-linear-gradient(
        135deg,
        color-mix(in srgb, ${themeVars.color.white} 60%, transparent) 0 1.76px,
        transparent 1.76px 3.52px
      ),
      ${themeVars.github.bgColor.danger.emphasis};
    border-color: ${themeVars.github.bgColor.danger.emphasis};
  }
  .repository #diff-file-boxes .diff-file-header:has(details[open]) {
    z-index: 10;
  }
  .repository #diff-file-boxes .diff-file-heading {
    min-width: 0;
    display: flex;
    margin: 0;
    font: inherit;
  }
  .diff-expand-file {
    flex-shrink: 0;
    padding: 4px;
    margin-left: 4px;
    border-radius: 4px;
  }
  .diff-expand-file[hidden] {
    display: none;
  }
  .diff-file-status {
    flex: 0 0 16px;
    margin-left: 4px;
  }
  .repository #diff-container .diff-content-controls {
    justify-content: flex-start;
  }
  .diff-content-controls-right {
    margin-left: 0;
  }
  .diff-code-search {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
  }
  .diff-code-search > .diff-search-field {
    flex: 0 1 300px;
    width: 300px;
    height: 34px;
  }
  .diff-search-navigation:not([hidden]) {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .diff-search-navigation {
    font-size: 12px;
    white-space: nowrap;
    color: ${themeVars.color.text.light.num1};
  }
  .diff-search-navigation .btn {
    width: 28px;
    height: 28px;
    border-radius: 4px;
  }
  .diff-view-settings .theme-menu-popover {
    min-width: 256px;
  }
  .theme-menu-popover a > input {
    pointer-events: none;
  }
  .repository #diff-file-boxes .diff-file-box {
    margin: 0 0 16px !important;
    scroll-margin-top: 84px;
  }
  .repository #diff-file-boxes .diff-file-header {
    background: ${themeVars.color.box.header};
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0 0;
    box-sizing: border-box;
    min-height: 46px;
    margin: 0;
    padding: 6px 8px;
    gap: 8px;
    flex-wrap: nowrap;
    top: calc(var(--sticky-top-offset, 0px) + 66px);
    z-index: 7;
  }
  .repository #diff-file-boxes .diff-file-name {
    min-width: 0;
    gap: 8px;
    flex-wrap: nowrap;
  }
  .repository #diff-file-boxes .diff-file-name > .file {
    min-width: 0;
    flex: 0 1 auto;
  }
  .repository #diff-file-boxes .diff-file-header .file-link {
    color: ${themeVars.color.text.self};
    font: 400 12px/20px var(--fonts-monospace);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
  .repository #diff-file-boxes .diff-file-header .file-link:hover {
    text-decoration: underline;
  }
  .repository #diff-file-boxes .diff-file-header [data-clipboard-text] {
    flex-shrink: 0;
    padding: 4px !important;
    margin-left: 4px;
  }
  .repository #diff-file-boxes .diff-file-header-actions {
    flex-wrap: nowrap;
    gap: 8px;
  }
  .repository #diff-file-boxes .fold-file {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 28px;
    padding: 0 !important;
  }
  .diff-deleted-placeholder {
    height: 300px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;
    border: 1px solid ${themeVars.color.light.border};
    border-top: 0;
    border-radius: 0 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius};
    color: ${themeVars.color.text.light.num1};
    font-size: 14px;
  }
  .diff-load-deleted {
    color: ${themeVars.github.fgColor.accent};
    font-size: 16px;
    font-weight: 600;
  }
  .diff-load-deleted:hover {
    text-decoration: underline;
  }
  .diff-deleted-skeleton {
    position: absolute;
    left: 16px;
    top: 36%;
    opacity: 0.55;
    width: 300px;
    pointer-events: none;
  }
  .diff-deleted-skeleton i {
    display: block;
    height: 12px;
    margin-bottom: 12px;
    border-radius: 2px;
    background: ${themeVars.color.box.header};
    width: 72%;
  }
  .diff-deleted-skeleton i:nth-child(2) {
    width: 90%;
    margin-left: 18px;
  }
  .diff-deleted-skeleton i:nth-child(3) {
    width: 80%;
    margin-left: 18px;
  }
  .diff-deleted-skeleton i:nth-child(4) {
    width: 16%;
  }
  .diff-deleted-placeholder > :not(.diff-deleted-skeleton) {
    position: relative;
  }
  .repository #diff-file-boxes [data-deleted-diff-hidden] > .diff-file-body,
  .repository #diff-file-boxes [data-folded="true"] > .diff-deleted-placeholder,
  .repository #diff-file-boxes .diff-deleted-placeholder[hidden] {
    display: none;
  }
  .repository #diff-file-boxes .diff-file-body {
    border-color: ${themeVars.color.light.border};
  }
  .repository #diff-file-boxes .code-diff :is(.lines-num, .lines-code, .code-inner, .lines-type-marker) {
    font-family: var(--fonts-monospace);
    font-size: 12px;
    line-height: var(--diff-line-height, 20px);
  }
  .repository #diff-file-boxes .code-diff .code-inner {
    white-space: pre;
    overflow-wrap: normal;
    word-break: normal;
  }
  .repository #diff-file-boxes .code-diff .lines-num {
    min-width: 40px;
    padding-top: 0;
    padding-bottom: 0;
    text-align: right !important;
  }
  .repository #diff-file-boxes .add-code .lines-num {
    background: ${themeVars.color.diff.added.linenum.bg};
    color: ${themeVars.color.text.self};
  }
  .repository #diff-file-boxes .del-code .lines-num {
    background: ${themeVars.color.diff.removed.linenum.bg};
    color: ${themeVars.color.text.self};
  }
  .repository #diff-file-boxes .lines-type-marker > span {
    visibility: hidden;
  }
  .repository #diff-file-boxes tr:hover .lines-type-marker > span {
    visibility: visible;
  }
  .repository #diff-file-boxes :is(.added-code, .removed-code) {
    border-radius: 0;
  }
  .repository #diff-file-boxes .tag-code {
    height: 24px;
  }
  .repository #diff-file-boxes .tag-code .code-inner {
    line-height: 24px;
  }
  .repository #diff-file-boxes .tag-code .code-expander-button {
    height: 24px;
  }
  .repository #diff-file-boxes .file-body.file-code {
    overflow-x: auto;
  }
  #diff-container.diff-comfortable {
    --diff-line-height: 24px;
  }
  #diff-container.diff-minimize-comments .comment-diff-data {
    display: none;
  }
  ::highlight(diff-search-results) {
    background: ${themeVars.color.yellow.light};
    color: inherit;
  }
  ::highlight(diff-search-current) {
    background: ${themeVars.color.yellow.self};
    color: ${themeVars.color.body};
  }
  .diff-search-current-line {
    outline: 1px solid ${themeVars.color.yellow.self};
    outline-offset: -1px;
  }
  @media (max-width: 767.98px) {
    .diff-code-search > .diff-search-field {
      width: min(264px, calc(100vw - 112px));
    }
    .repository #diff-file-boxes .diff-change-summary,
    .repository #diff-file-boxes .diff-file-name [data-clipboard-text] {
      display: none;
    }
    .diff-search-navigation {
      position: absolute;
      right: 40px;
      background: ${themeVars.color.body};
    }
    .repository #diff-file-boxes .diff-file-header {
      flex-wrap: wrap;
    }
    .repository #diff-file-boxes .diff-file-header-actions {
      margin-left: auto;
    }
  }
`;

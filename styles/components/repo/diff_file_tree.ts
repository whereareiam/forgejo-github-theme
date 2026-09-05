import { css, themeVars } from "@lutinglt/gitea-github-theme/core";

// Shared by commit and pull-request diffs; Forgejo still owns the Vue tree.
export default css`
  .repository #diff-container:has(> .diff-file-tree-panel) {
    display: grid;
    grid-template-columns: var(--diff-file-tree-width, 296px) 1px minmax(0, 1fr);
    position: relative;
    min-height: 100dvh;
    align-items: start;
    gap: 0;
  }
  .repository #diff-container:has(#diff-file-tree.tw-hidden) {
    grid-template-columns: minmax(0, 1fr);
  }
  .repository #diff-container:has(#diff-file-tree.tw-hidden) > .diff-file-tree-panel,
  .repository #diff-container:has(#diff-file-tree.tw-hidden) > .resizable-divider {
    display: none;
  }
  .repository .diff-file-tree-panel {
    min-width: 0;
    position: sticky;
    height: 100dvh;
    z-index: 20;
    top: var(--sticky-top-offset, 0px);
    max-height: calc(100dvh - var(--sticky-top-offset, 0px));
  }
  .repository .diff-file-tree-scroll {
    overflow: auto;
    scrollbar-gutter: stable;
    height: 100dvh;
    max-height: calc(100dvh - var(--sticky-top-offset, 0px));
    padding: 24px;
  }
  .repository .diff-file-tree-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .repository #diff-container #diff-file-tree {
    height: auto;
    min-height: 0;
    max-height: none;
    width: auto;
    max-width: none;
    flex-basis: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    position: static;
  }
  .repository #diff-file-boxes > [data-tree-filtered] {
    display: none !important;
  }
  .diff-tree-empty {
    padding: 8px 4px;
    color: ${themeVars.color.text.light.num1};
    font-size: 14px;
  }
  .repository #diff-container > #diff-content-container {
    min-width: 0;
    padding: 24px;
  }
  .repository #diff-container .diff-content-controls {
    background: ${themeVars.color.body};
    border: 0;
    border-radius: 0;
    box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 34px;
    height: auto;
    padding: 0;
    margin: 0 0 8px;
    position: sticky;
    top: calc(var(--sticky-top-offset, 0px) + 24px);
    z-index: 8;
  }
  .diff-content-controls-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }
  .repository #diff-container .diff-content-controls::before {
    content: "";
    position: absolute;
    inset: -24px -1px -8px;
    background: ${themeVars.color.body};
    z-index: -1;
  }
  .diff-toggle-file-tree-button > svg.tw-hidden {
    display: none;
  }
  @media (max-width: 767.98px) {
    .repository .diff-toggle-file-tree-button.theme-icon-button.not-mobile {
      display: inline-flex !important;
    }
    .repository #diff-container.diff-mobile-tree-open {
      display: flex;
      flex-direction: column;
    }
    .repository #diff-container.diff-mobile-tree-open > .diff-file-tree-panel {
      display: block !important;
      position: static;
      max-height: none;
      height: auto;
      width: 100%;
    }
    .repository #diff-container.diff-mobile-tree-open .diff-file-tree-scroll {
      max-height: none;
      height: auto;
      padding: 0 16px 16px;
    }
    .repository #diff-container.diff-mobile-tree-open > #diff-content-container {
      display: contents;
    }
    .repository #diff-container.diff-mobile-tree-open .diff-content-controls {
      order: -1;
      margin: 16px;
    }
    .repository #diff-container.diff-mobile-tree-open .diff-content-body,
    .repository #diff-container.diff-mobile-tree-open .diff-code-search {
      display: none;
    }
    .repository #diff-container:has(> .diff-file-tree-panel) {
      display: block;
    }
    .repository #diff-container.diff-mobile-tree-open {
      display: flex;
    }
    .repository #diff-container > #diff-content-container {
      padding: 16px;
    }
    .repository #diff-container > .diff-file-tree-panel,
    .repository #diff-container > .resizable-divider {
      display: none;
    }
  }
`;

import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";
import { activeItemAfterStyle } from "@lutinglt/gitea-github-theme/styles/common";

export default css`
  .repository .file-tree :is(.diff-file-tree-items, .file-tree-items) {
    width: 100%;
    overflow: visible;
    padding: 0;
  }
  .repository .file-tree .sub-items {
    position: relative;
  }
  .repository .file-tree .sub-items::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(10px - var(--file-tree-indent, 8px));
    border-left: 1px solid transparent;
    pointer-events: none;
  }
  .repository .file-tree:hover .sub-items::before,
  .repository .file-tree:focus-within .sub-items::before {
    border-color: ${themeVars.color.light.border};
  }
  .repository .file-tree .sub-items {
    margin-left: var(--file-tree-indent, 8px);
    gap: 0;
    padding-left: 0;
    border: 0;
  }
  .repository .file-tree .item-directory,
  .repository .file-tree .item-file.item-file {
    display: flex;
    align-items: center;
    position: relative;
    gap: 8px;
    height: 32px;
    min-height: 32px;
    margin: 0;
    padding: 0 4px;
    border-radius: ${otherThemeVars.border.radius};
    font-size: 14px;
    line-height: 20px;
    color: ${themeVars.color.text.self};
    text-decoration: none;
    cursor: pointer;
  }
  .repository .file-tree .item-file.item-file {
    padding-left: 24px;
  }
  .repository .file-tree .item-directory:hover,
  .repository .file-tree .item-file.item-file:hover {
    background: ${themeVars.github.control.transparent.bgColor.hover};
    box-shadow: none;
  }
  .repository .file-tree :is(.item-file, .item-directory):focus-visible {
    outline: 2px solid ${themeVars.github.fgColor.accent};
    outline-offset: -2px;
  }
  .repository .file-tree :is(.item-file, .item-directory).selected {
    background: ${themeVars.github.control.transparent.bgColor.active};
  }
  .repository .file-tree :is(.item-file, .item-directory).selected::after {
    ${activeItemAfterStyle}
    left: -8px;
    height: 24px;
    top: 4px;
  }
  .repository .file-tree .gt-ellipsis {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .repository .file-tree .item-directory > svg:first-child {
    width: 12px;
    height: 12px;
    flex: 0 0 12px;
    min-width: 12px;
    min-height: 12px;
    color: ${themeVars.color.text.light.num1};
  }
  .repository .file-tree .item-directory > svg:nth-child(2) {
    display: none;
  }
  .repository .file-tree .item-directory[aria-expanded="false"] > svg:nth-child(2) {
    display: block;
    color: ${themeVars.color.text.light.num1} !important;
  }
  .repository .file-tree .item-directory[aria-expanded="false"] > .tree-directory-icon {
    display: none;
  }
  .repository .file-tree .tree-directory-icon {
    color: ${themeVars.color.text.light.num1} !important;
  }
  .repository .file-tree .item-file > svg:not(.tree-file-icon) {
    display: none;
  }
  .repository .file-tree .item-file > svg.tree-file-icon {
    order: -1;
    flex: 0 0 16px;
  }
  .repository .file-tree [data-tree-filtered] {
    display: none !important;
  }

  .file-tree [hidden] {
    display: none !important;
  }
`;

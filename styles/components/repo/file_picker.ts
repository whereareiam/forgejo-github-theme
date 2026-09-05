import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

export default css`
  .repo-file-picker {
    position: relative;
    width: 130px;
    flex-shrink: 1;
  }
  .repo-file-picker .repo-find-file {
    width: 100%;
    height: 32px;
    gap: 8px;
  }
  .repo-file-picker .repo-find-file kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 20px;
    box-sizing: border-box;
    width: 20px;
    min-width: 20px;
    height: 20px;
    margin: 0;
    padding: 4px;
    font: 12px/10px var(--fonts-proportional);
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    box-shadow: none;
    color: ${themeVars.color.text.light.num1};
  }
  .repo-file-picker:has(input:not(:placeholder-shown)) kbd {
    display: none;
  }
  .repo-picker-clear {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
    padding: 0;
    color: ${themeVars.color.text.light.num1};
  }
  .repo-picker-clear[hidden] {
    display: none;
  }
  .repo-file-picker:focus-within {
    width: min(280px, 40vw);
  }
  .repo-file-picker-results {
    position: fixed;
    z-index: 50;
    inset: auto;
    width: 640px;
    max-width: calc(100vw - 32px);
    max-height: 768px;
    overflow: auto;
    border-radius: 12px;
    padding: 8px;
    background: ${themeVars.color.menu};
    box-shadow: ${themeVars.github.shadow.floating.small};
  }
  .repo-file-picker-results > a {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font: 14px/20px var(--fonts-proportional);
    color: ${themeVars.color.text.self};
    border-radius: ${otherThemeVars.border.radius};
    padding: 6px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
  .repo-file-picker-results > a:hover {
    background: ${themeVars.color.hover.self};
    text-decoration: none;
  }
  .repo-file-picker-results > a[aria-selected="true"] {
    outline: 2px solid ${themeVars.github.fgColor.accent};
    outline-offset: -2px;
  }
  .repo-file-picker-results > a > svg {
    flex: 0 0 16px;
    margin-top: 2px;
    color: ${themeVars.color.text.light.num1};
  }
  .repo-file-result-path {
    min-width: 0;
    overflow-wrap: anywhere;
    color: ${themeVars.color.text.light.num1};
  }
  .repo-file-result-path mark {
    background: transparent;
    color: ${themeVars.color.text.self};
    font-weight: 600;
  }
  .repo-button-row-right:has(.repo-file-picker) .repo-add-file {
    min-width: 98px;
  }
  .gitea-github-theme-templates.repo-button-row
    .repo-button-row-right:has(.repo-file-picker)
    .repo-code-dropdown
    > summary.ui.primary.button {
    padding: 5px 8px !important;
    gap: 4px;
  }
  .repo-button-row-right:has(.repo-file-picker) .repo-code-dropdown > summary > span {
    display: none;
  }
  .repo-button-row-right:has(.repo-file-picker) .repo-code-dropdown > summary > svg:last-child {
    width: 12px;
  }
  .repo-file-picker-empty {
    padding: 16px;
    text-align: center;
    color: ${themeVars.color.text.light.num1};
  }
  .repo-file-picker-status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  @media (max-width: 767.98px) {
    .repo-file-picker {
      display: none;
    }
  }
`;

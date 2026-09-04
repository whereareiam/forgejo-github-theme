import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

// Shared controls for file navigation and diff viewers.
export default css`
  .diff-search-field {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    height: 32px;
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    background: ${themeVars.color.body};
    color: ${themeVars.color.text.light.num1};
    padding: 0 8px;
    flex: 1;
  }
  .diff-search-field:focus-within {
    border-color: ${themeVars.github.fgColor.accent};
    outline: 1px solid ${themeVars.github.fgColor.accent};
  }
  .diff-search-field > svg {
    flex: 0 0 16px;
  }
  .diff-search-field input {
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    outline: none;
    color: ${themeVars.color.text.self};
    font: inherit;
    font-size: 14px;
    line-height: 20px;
    min-width: 0;
    width: 100%;
    padding: 0;
  }
  .diff-search-field input:focus,
  .diff-search-field input:focus-visible {
    border: 0 !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .diff-search-field input::placeholder {
    color: ${themeVars.color.text.light.num1};
    opacity: 1;
  }
  .theme-menu {
    position: relative;
    flex-shrink: 0;
  }
  .theme-icon-button {
    appearance: none;
    padding: 0;
    margin: 0;
    box-shadow: none;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid transparent;
    border-radius: ${otherThemeVars.border.radius};
    background: transparent;
    color: ${themeVars.color.text.light.num1};
    cursor: pointer;
    list-style: none;
  }
  .theme-menu > summary::-webkit-details-marker {
    display: none;
  }
  .theme-icon-button:hover {
    background: ${themeVars.github.control.transparent.bgColor.hover};
  }
  .theme-icon-button[aria-expanded="true"],
  .theme-menu[open] > .theme-icon-button {
    background: ${themeVars.github.control.transparent.bgColor.active};
  }
  .theme-icon-button-outlined {
    border-color: ${themeVars.color.light.border};
    background: ${themeVars.color.button};
  }
  .theme-icon-button > svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin: 0;
  }
  .theme-icon-button:focus-visible {
    outline: 2px solid ${themeVars.github.fgColor.accent};
    outline-offset: 2px;
  }
  .theme-menu-popover {
    position: fixed;
    z-index: 1000;
    inset: auto;
    min-width: 220px;
    max-width: calc(100vw - 32px);
    margin-top: 0;
    padding: 8px;
    border: 0;
    border-radius: 12px;
    background: ${themeVars.color.menu};
    box-shadow: ${themeVars.github.shadow.floating.small};
    color: ${themeVars.color.text.self};
    font: 14px/21px var(--fonts-proportional);
  }
  .theme-menu-popover > :is(label, a, button) {
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
    padding: 5px 8px;
    min-height: 32px;
    margin: 0;
    width: 100%;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    text-decoration: none;
  }
  .theme-menu-popover > :is(label, a, button):hover {
    background: ${themeVars.color.hover.self};
  }
  .theme-menu-popover input:is([type="checkbox"], [type="radio"]) {
    appearance: none;
    width: 16px;
    height: 16px;
    min-width: 16px;
    margin: 0;
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    border-radius: 0;
    position: relative;
    color: ${themeVars.color.text.light.num1};
  }
  .theme-menu-popover input:checked::before {
    content: "";
    position: absolute;
    inset: 0;
    background: currentColor;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 1 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z'/%3E%3C/svg%3E")
      center / 16px no-repeat;
  }
  .theme-menu-popover > label:focus-within {
    outline: 2px solid ${themeVars.github.fgColor.accent};
    outline-offset: -2px;
  }
  .theme-menu-popover input:focus-visible {
    outline: none;
  }
  .theme-menu-popover > hr {
    border: 0;
    border-top: 1px solid ${themeVars.color.light.border};
    margin: 8px -8px;
  }
  .diff-filter-count {
    margin-left: auto;
    border-radius: 20px;
    background: ${themeVars.color.hover.self};
    padding: 0 6px;
    font-size: 12px;
  }
  .diff-tree-options .theme-menu-popover {
    min-width: 192px;
  }
  .theme-menu-title {
    display: block;
    padding: 4px 8px;
    color: ${themeVars.color.text.light.num1};
    font-size: 12px;
    line-height: 18px;
    font-weight: 600;
  }
  .resizable-divider {
    align-self: stretch;
    position: relative;
    background: ${themeVars.color.light.border};
    cursor: col-resize;
    touch-action: none;
  }
  .resizable-divider::after {
    content: "";
    position: absolute;
    inset: 0 -3px;
    z-index: 9;
  }
  .resizable-divider:hover,
  .resizable-divider:focus-visible {
    background: ${themeVars.github.fgColor.accent};
    outline: none;
  }
  body.resizable-divider-active {
    cursor: col-resize;
    user-select: none;
  }
`;

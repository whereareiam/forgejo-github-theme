import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

export default css`
  .github-issues {
    &.page-content.repository.issue-list {
      display: grid;
      grid-template-columns: 256px minmax(0, 1fr);
      min-height: calc(100dvh - 100px);
    }
    &.page-content.repository.issue-list > .issue-navigation {
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: calc(100dvh - 100px);
      padding: 8px;
      margin-top: 0;
      border-right: 1px solid ${themeVars.color.light.border};
    }
    & .issue-navigation-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;
      scrollbar-gutter: stable;
      flex: 1;
      min-height: 0;
    }
    & .issue-navigation-content > nav {
      padding: 8px 0;
    }
    & .issue-navigation nav a {
      margin: 0 8px;
    }
    & .issue-navigation nav a,
    & .issue-navigation-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 32px;
      padding: 6px 8px;
      border: 0;
      background: transparent;
      font: 14px/20px var(--fonts-proportional);
      color: ${themeVars.color.text.self};
      text-decoration: none;
      border-radius: ${otherThemeVars.border.radius};
      position: relative;
    }
    & .issue-navigation nav a:hover,
    & .issue-navigation-toggle:hover {
      background: ${themeVars.color.hover.self};
      cursor: pointer;
    }
    & .issue-navigation nav a.active {
      background: ${themeVars.github.control.transparent.bgColor.active};
      font-weight: 600;
    }
    & .issue-navigation nav a.active::before {
      content: "";
      position: absolute;
      left: -8px;
      top: 4px;
      width: 4px;
      height: 24px;
      background: ${themeVars.github.bgColor.accent.emphasis};
      border-radius: ${otherThemeVars.border.radius};
    }
    & .issue-navigation nav a svg,
    & .issue-navigation-toggle svg {
      color: ${themeVars.color.text.light.num1};
      flex-shrink: 0;
    }
    & .issue-navigation hr {
      border: 0;
      border-top: 1px solid color-mix(in srgb, ${themeVars.color.light.border} 70%, transparent);
      height: 1px;
      min-height: 1px;
      padding: 0;
      margin: 4px 0;
    }
    & .issue-navigation-toggle {
      margin: 0 8px;
      flex-shrink: 0;
    }
    &.page-content.repository.issue-list > .issue-list-main {
      width: calc(100% - 48px) !important;
      max-width: 1232px !important;
      margin: 24px auto !important;
      min-width: 0;
    }
    & .list-header-issues {
      margin: 0 0 16px;
      min-height: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    & .issue-list-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    & .issue-list-title h1 {
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
      margin: 0;
    }
    & .issue-list-title .theme-icon-button {
      display: none;
    }
    & .issue-list-new {
      min-height: 32px;
      height: 32px;
      padding: 5px 12px;
      font-size: 14px;
      line-height: 20px;
    }
    & .issue-list-search {
      & {
        width: 100%;
        margin-bottom: 16px;
      }
      & .ui.action.input:not(.search) {
        height: 32px;
        border: 1px solid ${themeVars.color.light.border};
        border-radius: ${otherThemeVars.border.radius};
        background: ${themeVars.color.body};
        overflow: hidden;
      }
      & .ui.action.input:not(.search):focus-within {
        outline: 2px solid ${themeVars.github.fgColor.accent};
        outline-offset: -1px;
      }
      & input[type="search"] {
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        outline: none !important;
        font-size: 14px;
        padding: 5px 12px;
      }
      & button {
        min-height: 30px;
        height: 30px;
        width: 32px;
        padding: 0;
        border: 0;
        border-left: 1px solid ${themeVars.color.light.border};
      }
      & > .show-modal {
        display: none;
      }
    }
    & .issue-list-toolbar {
      & {
        margin-top: 0;
        height: 48px;
        padding: 8px 16px;
      }
      & .switch {
        display: flex;
        align-items: center;
        gap: 8px;
        border: 0;
        box-shadow: none;
        background: transparent;
      }
      & .switch > .item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 0;
        box-shadow: none;
        background: transparent;
        padding: 4px;
        min-height: 32px;
        color: ${themeVars.color.text.light.num1};
        font-size: 14px;
        font-weight: 400;
        outline: none;
      }
      & .switch > .item.active {
        color: ${themeVars.color.text.self};
        font-weight: 600;
      }
      & .switch > .item > svg {
        display: none;
      }
      & .switch > .item::before,
      & .switch > .item::after {
        display: none !important;
      }
      & .switch > [data-test-name="all-issue-count"] {
        display: none;
      }
      & .list-header-author {
        order: -1;
      }
      & .issue-state-count {
        border-radius: 20px;
        padding: 0 6px;
        background: ${themeVars.color.hover.self};
        font-size: 12px;
        line-height: 18px;
      }
      &-right > .ui.menu {
        gap: 4px;
      }
      &-right > .ui.menu > .item {
        padding: 4px 8px;
        font-size: 14px;
        height: 32px;
        min-height: 32px;
      }
    }
    & .issue-mobile-filter-toggle {
      display: none;
    }
    & #issue-list {
      & > .flex-item {
        padding: 8px 16px 10px;
        min-height: 64px;
        gap: 8px;
      }
      & .flex-item-title {
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
      }
      & .flex-item-main > .labels-list {
        display: flex;
        margin: 8px 0 0 0 !important;
      }
      & .flex-item-main > .labels-list .ui.label {
        font-size: 12px;
        line-height: 16px;
        padding: 0 6px;
        border-radius: 20px;
      }
      & .issue-meta {
        font-size: 12px;
        line-height: 18px;
        margin-top: 2px;
      }
      & .flex-item-icon {
        align-items: flex-start;
        padding-top: 3px;
        gap: 12px;
      }
      & .issue-checkbox {
        margin: 0 !important;
      }
      & .issue-title:hover {
        color: ${themeVars.github.fgColor.accent};
      }
      & > .tw-text-center {
        padding: 64px 24px;
      }
      & > .tw-text-center h3 {
        font-size: 24px;
        line-height: 32px;
        font-weight: 600;
      }
    }
    &.issue-navigation-collapsed {
      grid-template-columns: minmax(0, 1fr) !important;
    }
    &.issue-navigation-collapsed > .issue-navigation {
      display: none;
    }
    &.issue-navigation-collapsed .issue-list-title .theme-icon-button {
      display: flex;
    }
    @media (max-width: 1011.98px) {
      & .issue-list-toolbar {
        flex-wrap: wrap;
        height: auto;
        gap: 8px;
      }
      & .issue-list-toolbar-right {
        min-width: 0;
        max-width: 100%;
      }
    }
    @media (max-width: 767.98px) {
      & .issue-list-toolbar {
        flex-wrap: nowrap;
        justify-content: space-between;
        position: relative;
      }
      & .issue-mobile-filter-toggle {
        display: inline-flex;
      }
      & #issue-filters > .issue-list-toolbar-right {
        display: none;
      }
      & #issue-filters.issue-mobile-filters-open > .issue-list-toolbar-right {
        display: block;
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 30;
        width: 280px;
        padding: 8px;
        background: ${themeVars.color.menu};
        border-radius: 12px;
        box-shadow: ${themeVars.github.shadow.floating.small};
      }
      & #issue-filters.issue-mobile-filters-open > .issue-list-toolbar-right .ui.menu {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
      & #issue-list .flex-item-header {
        flex-direction: row;
        align-items: flex-start;
      }
      & #issue-list .flex-item-title {
        min-width: 0;
        flex: 1;
      }
      & #issue-list .flex-item-trailing {
        flex: 0 0 auto;
        margin: 2px 0 0 8px;
      }
      & #issue-list .issue-meta {
        margin-top: 4px;
      }

      &.page-content.repository.issue-list {
        display: block;
      }
      &:not(.issue-navigation-collapsed) .issue-list-main {
        display: none;
      }
      &.page-content.repository.issue-list > .issue-navigation {
        height: calc(100dvh - 100px);
        border-right: 0;
      }
      &.page-content.repository.issue-list > .issue-list-main {
        width: calc(100% - 32px) !important;
        margin: 16px !important;
      }
      & .issue-list-toolbar-right > .ui.menu {
        flex-wrap: wrap;
      }
      & .issue-list-toolbar {
        padding: 8px;
      }
      & .issue-mobile-filter-toggle {
        display: none;
      }
      & #issue-list > .flex-item {
        padding: 12px;
      }
    }
  }
`;

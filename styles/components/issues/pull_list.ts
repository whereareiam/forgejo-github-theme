import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

export default css`
  .github-pull-list {
    &.page-content.repository.issue-list > .ui.container {
      width: calc(100% - 64px) !important;
      max-width: 1216px !important;
      margin: 24px auto !important;
    }
    & .list-header-issues {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 0;
      margin-top: 0;
      margin-bottom: 16px;
      min-height: 32px;
    }
    & .pull-list-presets > summary.ui.button {
      height: 32px;
      min-height: 32px;
      margin: 0;
      padding: 5px 12px;
      font-size: 14px;
      line-height: 20px;
      border-radius: ${otherThemeVars.border.radius} 0 0 ${otherThemeVars.border.radius};
      display: flex;
      align-items: center;
      gap: 8px;
    }
    & .issue-list-search {
      & {
        flex: 1;
        margin: 0;
        min-width: 0;
      }
      & .ui.action.input:not(.search) {
        height: 32px;
        border: 1px solid ${themeVars.color.light.border};
        border-left: 0;
        border-radius: 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0;
        overflow: hidden;
        background: ${themeVars.color.body};
      }
      & .ui.action.input:not(.search):focus-within {
        outline: 2px solid ${themeVars.github.fgColor.accent};
        outline-offset: -1px;
      }
      & input {
        border: 0 !important;
        box-shadow: none !important;
        outline: none !important;
        background: transparent !important;
        font-size: 14px;
        padding: 5px 12px;
      }
      & button {
        width: 32px;
        min-height: 30px;
        height: 30px;
        padding: 0;
        border: 0;
        background: transparent;
      }
      & > .show-modal {
        display: none;
      }
    }
    & .list-header-issues > nav.ui.menu {
      margin: 0 16px;
      min-height: 32px;
      height: 32px;
    }
    & .list-header-issues > nav.ui.menu > .item {
      font-size: 14px;
      padding: 5px 12px;
      min-height: 32px;
    }
    & .issue-list-new {
      height: 32px;
      min-height: 32px;
      font-size: 14px;
      line-height: 20px;
      padding: 5px 12px;
      margin-left: 16px;
    }
    & .issue-list-toolbar {
      & {
        height: 54px;
        margin-top: 0;
        padding: 8px 16px;
      }
      & .switch {
        display: flex;
        gap: 8px;
        border: 0;
        background: transparent;
        box-shadow: none;
      }
      & .switch > .item {
        display: flex;
        gap: 8px;
        align-items: center;
        height: 32px;
        padding: 4px;
        border: 0;
        outline: none;
        background: transparent;
        box-shadow: none;
        color: ${themeVars.color.text.light.num1};
      }
      & .switch > .item.active {
        font-weight: 600;
        color: ${themeVars.color.text.self};
      }
      & .switch > .item::before,
      & .switch > .item::after {
        display: none;
      }
      & .switch > [data-test-name="all-issue-count"] {
        display: none;
      }
      &-right > .ui.menu > .item {
        font-size: 14px;
        min-height: 32px;
        height: 32px;
        padding: 4px 8px;
      }
      &-right .list-header-author {
        order: -1;
      }
    }
    & #issue-list {
      & > .flex-item {
        padding: 8px 16px 10px;
        min-height: 64px;
        gap: 8px;
      }
      & .issue-title {
        font-size: 16px;
        line-height: 24px;
        font-weight: 600;
      }
      & .issue-meta {
        font-size: 12px;
        line-height: 18px;
      }
      & .issue-checkbox {
        margin: 0 8px 0 0 !important;
      }
      & > .tw-text-center {
        padding: 80px 24px;
        min-height: 296px;
      }
      & > .tw-text-center h3 {
        font-size: 24px;
        line-height: 32px;
        font-weight: 600;
      }
    }
    & .issue-mobile-filter-toggle {
      display: none;
    }
    @media (max-width: 1011.98px) {
      & .issue-list-toolbar {
        flex-wrap: wrap;
        height: auto;
        gap: 8px;
      }
    }
    @media (max-width: 767.98px) {
      &.page-content.repository.issue-list > .ui.container {
        width: calc(100% - 32px) !important;
        margin: 16px !important;
      }
      & .list-header-issues {
        display: grid;
        grid-template-columns: 86px minmax(0, 1fr) auto;
        gap: 8px 0;
      }
      & .pull-list-presets {
        grid-column: 1;
        grid-row: 2;
      }
      & .issue-list-search {
        grid-column: 2 / -1;
        grid-row: 2;
        width: auto !important;
      }
      & .list-header-issues > nav.ui.menu {
        grid-column: 1 / 3;
        grid-row: 1;
        margin: 0;
        width: max-content;
      }
      & .issue-list-new {
        grid-column: 3;
        grid-row: 1;
      }
      & .issue-list-search {
        flex-basis: calc(100% - 90px);
      }
      & .list-header-issues > nav.ui.menu {
        margin: 0;
      }
      & .issue-list-new {
        margin-left: auto;
      }
      & .issue-list-toolbar {
        flex-wrap: nowrap;
        position: relative;
        justify-content: space-between;
        padding: 8px;
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
      & #issue-list > .flex-item {
        padding: 12px;
      }
      &.page-content.repository #issue-list .flex-item-header {
        flex-direction: row;
        flex-wrap: nowrap;
      }
      & #issue-list .flex-item-title {
        flex: 1;
        min-width: 0;
      }

      & #issue-list .flex-item-trailing {
        flex: 0 0 auto;
        margin: 0 0 0 8px;
      }
    }
  }
`;

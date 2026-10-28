import { css, themeVars } from "@lutinglt/gitea-github-theme/core";

// The issue list and the pull request list share one layout.
export default css`
  :is(.github-issues, .github-pull-list) {
    /* The heading itself is the shared theme-list-heading component. */
    & .list-header-issues {
      margin: 0 0 16px;
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
    & #issue-list {
      & > .flex-item {
        padding: 8px 16px 10px;
        min-height: 64px;
        gap: 8px;
      }
      & .flex-item-title {
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
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
      /* As on GitHub, Open and Closed keep the first row and the filters follow in a row that scrolls sideways,
         from one edge of the box to the other, without a scrollbar. */
      & #issue-filters {
        flex-wrap: wrap;
        row-gap: 8px;
      }
      & #issue-filters > .issue-list-toolbar-left {
        flex: 1 1 100%;
        min-width: 0;
      }
      & #issue-filters > .issue-list-toolbar-right {
        flex: 1 1 100%;
        min-width: 0;
        max-width: none;
        margin: 0 -8px;
        padding: 0 8px;
        overflow-x: auto;
        scrollbar-width: none;
      }
      & #issue-filters > .issue-list-toolbar-right::-webkit-scrollbar {
        display: none;
      }
      & #issue-filters > .issue-list-toolbar-right > .ui.menu {
        flex-wrap: nowrap;
        width: max-content;
        margin: 0;
      }
      & #issue-filters > .issue-list-toolbar-right > .ui.menu > .item {
        flex: none;
      }
      /* The scrolling row would clip a menu below its button, so a menu opens as a sheet at the bottom of the screen. */
      & #issue-filters > .issue-list-toolbar-right .ui.dropdown > .menu {
        position: fixed;
        inset: auto 16px 16px;
        z-index: 30;
        min-width: 0;
        max-width: none;
        max-height: calc(100dvh - 32px);
        overflow-y: auto;
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

      & .issue-list-toolbar-right > .ui.menu {
        flex-wrap: wrap;
      }
      & .issue-list-toolbar {
        padding: 8px;
      }
      & #issue-list > .flex-item {
        padding: 12px;
      }
    }
  }
`;

import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

/** The 32px round status icon that starts a merge box section; the section sets its background. */
const mergeSectionIcon = `
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 50%;
  color: ${themeVars.github.fgColor.onEmphasis};
`;

/** "View command line instructions": Forgejo's disclosure summary shown as a small link. */
const mergeInstructionsLink = `
  padding: 0 !important;
  list-style: none;
  color: ${themeVars.github.fgColor.accent};
  font-size: 12px;
  line-height: 18px;
  text-decoration: underline;
  cursor: pointer;
  &::before,
  &::-webkit-details-marker {
    display: none;
  }
`;

/** Forgejo's buttons inside the merge box, at GitHub's 32px control height. */
const mergeButton = `
  min-height: 32px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 14px;
  line-height: 20px;
`;

export default css`
  .page-content.repository.view.issue.github-pull-review {
    & > .ui.container {
      width: calc(100% - 64px) !important;
      max-width: 1216px !important;
      margin: 24px auto !important;
      padding: 0;
    }
    &.files > .ui.container {
      width: 100% !important;
      max-width: none !important;
    }
    &.files > .ui.container > .issue-title-header,
    &.files > .ui.container > .pull.tabs {
      width: calc(100% - 64px);
      max-width: 1216px;
      margin-left: auto;
      margin-right: auto;
    }
    & .issue-title-header {
      margin-bottom: 16px;
    }
    & .issue-title h1 {
      font-size: 32px;
      line-height: 40px;
      font-weight: 400;
    }
    & .issue-title .index {
      font-weight: 300;
      color: ${themeVars.color.text.light.num1};
    }
    & .issue-title-meta {
      min-height: 32px;
      margin-top: 8px;
    }
    & .issue-title-meta .issue-state-label {
      height: 32px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
    }
    & .pull-desc {
      font-size: 14px;
      line-height: 24px;
      color: ${themeVars.color.text.light.num1};
    }
    & .ui.pull.tabs.container {
      overflow: visible;
      width: 100%;
      margin-bottom: 16px;
    }
    & .ui.pull.tabular.menu {
      scrollbar-width: none;
      align-items: flex-start;
      height: 40px;
      border: 0;
      box-shadow: inset 0 -1px 0 ${themeVars.color.light.border} !important;
      min-height: 40px;
      margin: 0;
      gap: 0;
      background: transparent;

      & > .item {
        box-sizing: border-box;
        height: 40px;
        line-height: 21px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        margin: 0;
        border: 1px solid transparent;
        min-height: 40px;
        position: relative;
        color: ${themeVars.color.text.self};
        font-size: 14px;
        font-weight: 400;
      }
      & > .item.active {
        background: ${themeVars.color.body};
        font-weight: 400;
        border-color: ${themeVars.color.light.border};
        border-bottom-color: ${themeVars.color.body};
        border-radius: ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0 0;
        margin-bottom: -1px;
        z-index: 1;
      }
      & > .item:not(.active):hover {
        background: ${themeVars.github.control.transparent.bgColor.hover};
        border-radius: ${otherThemeVars.border.radius};
      }
    }

    & .pull.tabs > .ui.tabs.divider {
      display: none;
    }
    & .pull-review-change-summary {
      margin-left: auto;
      display: flex;
      align-items: center;
      padding-left: 16px;
    }
    &.files .pull.tabs.container {
      margin-bottom: 0;
    }
    &.files #diff-container {
      border-top: 1px solid ${themeVars.color.light.border};
    }
    &.github-conversation .issue-content {
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 24px;
    }
    &.github-conversation .issue-content-left > .ui.timeline {
      margin-left: 40px;
      padding-left: 16px;
    }
    &.github-conversation .timeline-item.comment > .timeline-avatar {
      display: block;
      left: -56px;
    }
    &.github-conversation .comment-header .inline-timeline-avatar {
      display: none !important;
    }
    &.commits .commit-list .message {
      min-width: 0;
    }
    &.github-conversation .comment .comment-header {
      min-height: 38px;
      padding: 4px 16px;
    }
    & .comment-header-left a:has(relative-time) {
      text-decoration: underline !important;
    }
    & .issue-title-meta .pull-desc a:not(code a) {
      color: ${themeVars.color.text.light.num1};
      font-weight: 600;
    }
    & .comment.first .comment-container::before,
    & .comment.first .comment-container::after {
      content: "";
      position: absolute;
      left: -8px;
      top: 12px;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: 8px solid var(--conversation-border, ${themeVars.color.light.border});
    }
    & .comment.first .comment-container::after {
      left: -7px;
      border-right-color: ${themeVars.color.box.header};
    }
    &.own-conversation .comment.first .comment-container::after {
      border-right-color: color-mix(in srgb, ${themeVars.color.body}, ${themeVars.github.bgColor.accent.emphasis} 10%);
    }
    & .merge.box {
      z-index: 2;
      margin-left: 0;
      & > .content {
        margin-left: 0;
        border: 1px solid ${themeVars.color.light.border};
        border-radius: ${otherThemeVars.border.radius};
      }
      /* The status badge beside the box: neutral unless the pull request can be merged. */
      & > .timeline-avatar {
        display: grid !important;
        place-items: center;
        width: 40px;
        height: 40px;
        border-radius: ${otherThemeVars.border.radius};
        background: ${themeVars.github.bgColor.neutral.emphasis};
        color: ${themeVars.github.fgColor.onEmphasis} !important;
        & svg {
          width: 24px;
          height: 24px;
        }
      }
      &.merge-ready > .timeline-avatar {
        background: ${themeVars.github.bgColor.success.emphasis};
      }
      /* Without the merge status block, each native row becomes one of GitHub's bordered sections. */
      & .merge-section:not(:has(.pull-merge-status)) {
        padding: 0;
        & > .item {
          min-height: 64px;
          padding: 16px;
        }
        & > .item + .divider + .item,
        & > .item + .divider + details {
          margin-top: 0;
          border-top: 1px solid ${themeVars.color.light.border};
        }
        & > .item .flex-text-inline {
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
        }
        & > .item .flex-text-inline > svg {
          ${mergeSectionIcon}
          background: ${themeVars.github.bgColor.neutral.emphasis};
        }
        & > details {
          padding: 16px;
          background: ${themeVars.color.box.header};
          border-radius: 0 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius};
        }
      }
      & .merge-section {
        padding: 16px;
        border: 0;
        & > .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          min-height: 32px;
          border: 0;
          padding: 0;
        }
        & > .item + .divider + .item,
        & > .item + .divider + details {
          margin-top: 8px;
        }
        & > .divider {
          display: none;
        }
        & > .item .ui.button {
          ${mergeButton}
          height: 32px;
          margin: 0;
          padding-right: 12px;
          padding-left: 12px;
        }
        & > .item .ui.dropdown.icon.button {
          width: 32px;
          padding: 0;
          justify-content: center;
        }
        & > details > summary {
          ${mergeInstructionsLink}
        }
        & .pull-merge-status {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          gap: 8px;
          & > svg {
            ${mergeSectionIcon}
            background: ${themeVars.github.bgColor.success.emphasis};
          }
          & h3 {
            margin: 0;
            font-size: 16px;
            line-height: 24px;
            font-weight: 600;
          }
          & .pull-merge-note {
            padding: 0;
            border: 0;
            color: ${themeVars.color.text.light.num1};
            font-size: 14px;
            line-height: 21px;
            & > svg {
              display: none;
            }
          }
        }
      }
      & .pull-merge-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin: 16px -16px -16px;
        padding: 16px;
        border-top: 1px solid ${themeVars.color.light.border};
        border-radius: 0 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius};
        background: ${themeVars.color.box.header};
        & details {
          flex: 1;
          min-width: 180px;
        }
        & details[open] {
          flex-basis: 100%;
        }
        & summary {
          ${mergeInstructionsLink}
        }
        & .menu .item {
          border: 0;
        }
        & .ui.button {
          ${mergeButton}
        }
      }
    }
    @media (max-width: 767.98px) {
      & .merge.box > .timeline-avatar {
        display: none !important;
      }

      & .comment.first .comment-container::before,
      & .comment.first .comment-container::after {
        display: none;
      }
      &.github-conversation .issue-content {
        grid-template-columns: minmax(0, 1fr);
      }
      &.github-conversation .issue-content-left > .ui.timeline {
        margin-left: 0;
        padding-left: 0;
      }
      &.github-conversation .timeline-item.comment > .timeline-avatar {
        display: none;
      }
      &.github-conversation .comment-header .inline-timeline-avatar {
        display: inline-flex !important;
      }

      & > .ui.container {
        width: calc(100% - 32px) !important;
        margin: 16px auto !important;
      }
      &.files > .ui.container {
        width: 100% !important;
      }
      &.files > .ui.container > .issue-title-header,
      &.files > .ui.container > .pull.tabs {
        width: calc(100% - 32px);
      }
      & .issue-title h1 {
        font-size: 24px;
        line-height: 32px;
      }
      & .pull.tabs.container {
        overflow-x: auto;
      }
      & .pull.tabular.menu {
        width: max-content;
        min-width: 100%;
        flex-wrap: nowrap;
      }
      & .pull.tabular.menu > .item {
        padding: 8px;
        white-space: nowrap;
      }
      & .pull-review-change-summary {
        display: none;
      }
      &.files .diff-content-controls-right {
        flex-wrap: wrap;
      }
    }
  }
`;

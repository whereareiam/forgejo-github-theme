import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";
import { primaryButtonHoverStyle, primaryButtonStyle } from "@lutinglt/gitea-github-theme/styles/common";

/** The round status icon that starts a merge box section; the section sets its background. */
const mergeSectionIcon = `
  flex: 0 0 var(--merge-section-icon);
  width: var(--merge-section-icon);
  height: var(--merge-section-icon);
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
    /* The same header box on every tab, so switching tabs does not move the page. */
    & .issue-title-header {
      margin-bottom: 16px;
      padding: 0;
    }
    & .issue-title {
      align-items: flex-start;
      gap: 16px;
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
      font-weight: 600;
    }
    /* A closed pull request is red on GitHub (purple is for merged, and for closed issues). */
    & .issue-title-meta .ui.label.issue-state-label.red {
      background-color: ${themeVars.github.bgColor.danger.emphasis} !important;
      border-color: ${themeVars.github.bgColor.danger.emphasis} !important;
      box-shadow: none;
    }
    /* The "closed this pull request" entry in the timeline is red too. */
    & .timeline-item.event .badge.tw-bg-red {
      background-color: ${themeVars.github.bgColor.danger.emphasis} !important;
    }
    /* A draft is a solid grey label. */
    & .issue-title-meta .ui.label.issue-state-label.grey {
      color: ${themeVars.github.fgColor.onEmphasis} !important;
      background-color: ${themeVars.github.bgColor.neutral.emphasis} !important;
      border-color: ${themeVars.github.bgColor.neutral.emphasis} !important;
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
    /*
     * Timeline connectors. Our own rule, not GitHub's continuous line: a connector is drawn only
     * between two neighbouring entries. Nothing runs past the last entry, alongside a box, or
     * out of a review group, whose boxes are indented away from the rail.
     */
    &.github-conversation .issue-content-left > .ui.timeline {
      --rail: color-mix(in srgb, ${themeVars.color.light.border} 70%, transparent);
      --rail-line: linear-gradient(var(--rail), var(--rail));
      &::before {
        display: none;
      }
      /* Events and commit rows sit left of their own box, so their halves are pseudo-elements. */
      & > .timeline-item:is(.event, .commits-list)::before,
      & > .timeline-item:is(.event, .commits-list)::after,
      & > .timeline-item-group > .timeline-item.event:first-child::before {
        content: "";
        position: absolute;
        left: -2px;
        width: 2px;
        background: var(--rail);
      }
      /* Upper half: from the entry above down to this badge. */
      & > .timeline-item.event::before,
      & > .timeline-item-group > .timeline-item.event:first-child::before {
        top: 0;
        height: 12px;
      }
      & > .timeline-item.commits-list::before {
        top: 0;
        bottom: 27px;
      }
      /* Lower half: only when another entry follows. */
      & > .timeline-item:is(.event, .commits-list)::after {
        display: none;
        bottom: 0;
      }
      & > .timeline-item:is(.event, .commits-list):has(~ :is(.timeline-item:not(.form), .timeline-item-group))::after {
        display: block;
      }
      & > .timeline-item.event::after {
        top: 46px;
      }
      & > .timeline-item.commits-list::after {
        height: 27px;
      }
      /* Comment and merge boxes cover the rail; they only draw stubs in the gaps above and below. */
      & > .timeline-item.comment:not(.form) {
        --rail-up: var(--rail-line) 14px 0 / 2px 12px no-repeat;
        --rail-down: var(--rail-line) 14px 100% / 0 0 no-repeat;
        background: var(--rail-up), var(--rail-down);
      }
      & > .timeline-item.comment:not(.form):has(~ :is(.timeline-item:not(.form), .timeline-item-group)) {
        --rail-down: var(--rail-line) 14px 100% / 2px 12px no-repeat;
      }
      & > .timeline-item.comment.first {
        --rail-up: var(--rail-line) 14px 0 / 0 0 no-repeat;
      }
      /* Nothing leaves a review group. */
      & > .timeline-item-group + .timeline-item.comment,
      & > .timeline-item-group + div:empty + .timeline-item.comment {
        --rail-up: var(--rail-line) 14px 0 / 0 0 no-repeat;
      }
      & > .timeline-item-group + .timeline-item:is(.event, .commits-list)::before,
      & > .timeline-item-group + div:empty + .timeline-item:is(.event, .commits-list)::before,
      & > .timeline-item-group + .timeline-item-group > .timeline-item.event:first-child::before,
      & > .timeline-item-group + div:empty + .timeline-item-group > .timeline-item.event:first-child::before {
        display: none;
      }
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
      /* One section row's measurements, also used by rows styled outside this file. */
      --merge-section-height: 64px;
      --merge-section-padding: 16px;
      --merge-section-icon: 32px;
      --merge-section-divider: color-mix(in srgb, ${themeVars.color.light.border} 70%, transparent);
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
      &.merge-ready > .content {
        border-color: ${themeVars.github.bgColor.success.emphasis};
      }
      /* GitHub keeps the badge and border neutral for blocked, conflicting, draft and closed pull requests. */
      & > .timeline-avatar:is(.red, .grey, .yellow) {
        background: ${themeVars.github.bgColor.neutral.emphasis} !important;
      }
      &:has(> .timeline-avatar.purple) > .content {
        border-color: ${themeVars.github.bgColor.done.emphasis};
      }
      /* While the merge form is open GitHub shows the form alone, in a neutral box. */
      & > .content:has(.pull-merge-actions form .field) {
        border-color: ${themeVars.color.light.border};
        & > :not(.merge-section),
        & > .merge-section > :not(.pull-merge-actions) {
          display: none !important;
        }
        & .pull-merge-actions {
          border-top: 0 !important;
          border-radius: ${otherThemeVars.border.radius};
        }
      }
      /* Every state uses one layout: each row is a bordered section, as in GitHub's merge box. */
      & .merge-section {
        padding: 0;
        border: 0;
        & > .divider {
          display: none;
        }
        & > :is(.item, details, .pull-merge-actions):not(:first-child) {
          border-top: 1px solid var(--merge-section-divider);
        }
        & > .item {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: var(--merge-section-height);
          margin: 0;
          padding: var(--merge-section-padding);
          border-right: 0;
          border-bottom: 0;
          border-left: 0;
        }
        /* A row's title: Forgejo writes it either beside the icon or inside .flex-text-inline. */
        & > .item:has(> svg:first-child),
        & > .item > .flex-text-inline {
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
        }
        & > .item > svg:first-child,
        & > .item > .flex-text-inline > svg {
          ${mergeSectionIcon}
          background: ${themeVars.github.bgColor.neutral.emphasis};
        }
        & > .item > svg.octicon-x:first-child {
          background: ${themeVars.github.bgColor.danger.emphasis};
        }
        /* A row's control sits at its right edge. */
        & > .item > .flex-text-inline {
          flex: 1;
          min-width: 0;
        }
        & > .item:not(.pull-merge-status) > :is(div, .ui.button, .ui.buttons):last-child:not(:first-child) {
          flex: none;
          margin-left: auto;
        }
        & > .item .ui.button {
          ${mergeButton}
          height: 32px;
          margin: 0;
          padding-right: 12px;
          padding-left: 12px;
          font-weight: 500;
        }
        & > .item .ui.dropdown.icon.button {
          width: 32px;
          padding: 0;
          justify-content: center;
        }
        & > details {
          padding: 16px;
          background: ${themeVars.color.box.header};
          border-radius: 0 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius};
        }
        & > details > summary {
          ${mergeInstructionsLink}
        }
        & > .item.pull-merge-status {
          align-items: flex-start;
          font-size: 14px;
          font-weight: 400;
          line-height: 21px;
          & > svg {
            background: ${themeVars.github.bgColor.success.emphasis};
          }
          & h3 {
            margin: 0;
            font-size: 16px;
            line-height: 24px;
            font-weight: 600;
          }
          & .pull-merge-note {
            min-height: 0;
            padding: 0;
            border: 0;
            color: ${themeVars.color.text.light.num1};
            font-size: 14px;
            font-weight: 400;
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
        padding: 16px;
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
        & .ui.button {
          ${mergeButton}
          margin: 0;
        }
        /* Merging past unmet requirements: GitHub's danger button, not a filled red bar. */
        & .ui.red.buttons .ui.button {
          color: ${themeVars.github.button.danger.fgColor.rest};
          background-color: ${themeVars.github.button.danger.bgColor.rest};
          border-color: ${themeVars.color.light.border};
          &:hover {
            color: ${themeVars.github.button.danger.fgColor.hover};
            background-color: ${themeVars.github.button.danger.bgColor.hover};
            border-color: ${themeVars.github.button.danger.borderColor.hover};
          }
        }
        /* Scheduling a merge for when checks pass is not an override: Forgejo marks the group
           red, but its own confirm button is primary, so the group is shown primary too. */
        &.merge-scheduled .ui.red.buttons .ui.button {
          ${primaryButtonStyle}
          &:hover {
            ${primaryButtonHoverStyle}
          }
          & svg {
            color: inherit;
          }
        }
        & .ui.buttons .ui.dropdown.icon.button {
          width: 32px;
          padding: 0;
          justify-content: center;
        }
        /* The expanded form takes the whole row: title, message, then the buttons. */
        & > #pull-request-merge-form:has(form .field) {
          flex: 0 0 100%;
        }
        & form {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px 8px;
          & > .field {
            flex: 0 0 100%;
            margin: 0;
          }
          & > .field > :is(input, textarea) {
            font-family: var(--fonts-monospace);
            line-height: 20px;
          }
          & > .field > input {
            height: 32px;
            padding: 5px 12px;
          }
          & > .field > textarea {
            display: block;
            min-height: 100px;
            padding: 12px;
            resize: vertical;
          }
          & > .ui.checkbox {
            margin-left: 8px !important;
          }
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

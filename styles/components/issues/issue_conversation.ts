import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

export default css`
  .page-content.repository.view.issue.github-conversation {
    & > .ui.container {
      width: calc(100% - 64px) !important;
      max-width: 1232px !important;
      margin: 24px auto !important;
    }
    & .issue-title-header {
      margin: 0 0 24px;
      padding: 0;
    }
    & .issue-title {
      align-items: flex-start;
      gap: 16px;
    }
    & .issue-title h1 {
      margin: 0;
      font-size: 32px;
      line-height: 40px;
      font-weight: 400;
    }
    & .issue-title h1 .index {
      color: ${themeVars.color.text.light.num1};
      font-weight: 300;
    }
    & .issue-title-meta {
      margin-top: 12px;
      min-height: 32px;
    }
    &.github-issue-conversation .issue-title-meta .time-desc {
      display: none;
    }
    & .issue-state-label {
      height: 32px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      line-height: 20px;
      border-radius: 20px !important;
    }
    & .issue-content {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 288px;
      gap: 32px;
    }
    & .issue-content img.ui.avatar {
      border-radius: 50%;
    }
    & .issue-content-left {
      min-width: 0;
      width: auto;
    }
    & .issue-content-right {
      &.ui.segment {
        width: auto;
        padding: 0;
        margin: 0;
        border: 0;
        box-shadow: none;
        min-width: 0;
        font-size: 12px;
      }
      & .divider {
        margin: 16px 0;
        border-color: color-mix(in srgb, ${themeVars.color.light.border} 70%, transparent);
        width: 100%;
      }
      & strong {
        font-size: 12px;
        font-weight: 600;
        color: ${themeVars.color.text.light.num1};
      }
      & > .dropdown > .text,
      & #milestone-section > .dropdown > .text {
        width: 100%;
      }
      & > .dropdown,
      & #milestone-section > .dropdown {
        width: 100%;
      }
      & .ui.list {
        margin: 0;
        padding: 0;
      }
      & .ui.avatar {
        width: 20px;
        height: 20px;
      }
      & .ui.labels .label {
        padding: 0 6px;
        font-size: 12px;
        line-height: 18px;
        border-radius: 20px;
      }

      & :is(.ui.form, .no-select, p, .text) {
        font-size: 12px;
        line-height: 18px;
        color: ${themeVars.color.text.light.num1};
      }
      & .ui.dropdown > :is(a, span).text {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        min-height: 26px;
        padding: 4px 0;
        margin: -4px 0 4px;
        border-radius: 0;
      }
      & .ui.dropdown > :is(a, span).text:hover {
        color: ${themeVars.github.fgColor.accent};
        background: transparent;
      }
      & .ui.dropdown > :is(a, span).text:hover strong {
        color: inherit;
      }
      & > .ui.labels {
        margin: 0;
      }
      & .ui.button {
        min-height: 28px;
        font-size: 12px;
        line-height: 20px;
      }
      & .assignees .item {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0;
      }
      & .watching .ui.button {
        height: 28px;
        padding: 3px 8px;
      }

      & [data-modal="#sidebar-delete-issue"] {
        color: ${themeVars.color.red.self};
      }

      & .timetrack > div > .ui.button {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        height: 28px;
        min-height: 28px;
        padding: 3px 8px;
      }
      & :is(.timetrack > div, .single-button-form) > .ui.button > svg {
        margin: 0 !important;
        flex: 0 0 16px;
      }
      & > .single-button-form {
        margin: 0;
      }
      & .single-button-form > .ui.button,
      & > .ui.show-modal.button {
        border: 0;
        background: transparent;
        box-shadow: none;
        justify-content: flex-start;
        margin: 0 !important;
        font-weight: 400;
        display: flex;
        align-items: center;
        gap: 8px;
        height: 28px;
        min-height: 28px;
        padding: 4px 0;
        & > svg {
          width: 16px;
          height: 16px;
          margin: 0 !important;
        }
        &:hover {
          color: ${themeVars.github.fgColor.accent};
        }
      }
      & .reference > .ui {
        align-items: center;
        gap: 8px;
      }
      & .reference .ui.button {
        flex: 0 0 28px;
        width: 28px;
        height: 28px;
        min-height: 28px;
        padding: 6px !important;
        border: 0;
        background: transparent;
        box-shadow: none;
      }
      & .ui.action.input:has(> .selection.dropdown > .text > .text) {
        height: auto;
        align-items: stretch;
        & > .ui.selection.dropdown {
          height: auto;
          min-height: 50px;
          padding: 6px 32px 6px 12px;
          & > .text {
            display: block;
            line-height: 18px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          & > .text > .text {
            line-height: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          & > .dropdown.icon {
            top: 50%;
            transform: translateY(-50%);
            padding-top: 0;
          }
        }
        & > .ui.button {
          height: auto;
        }
      }
      & #deadline-loader {
        margin-top: 8px;
      }
      & .issue-due-form {
        height: 28px;
        & input {
          min-width: 0;
          height: 28px;
          padding: 3px 8px;
          font-size: 12px;
          background: ${themeVars.color.body};
          box-shadow: none;
        }
        & .ui.button {
          width: 28px;
          height: 28px;
          min-height: 28px;
          padding: 5px;
        }
      }
    }

    & .issue-content-left > .ui.timeline {
      margin-left: 0;
      padding-left: 0;
    }
    & .ui.timeline > .timeline-item.comment {
      margin-left: 0;

      & > .content {
        margin-left: 0;
      }
      &::before {
        display: none;
      }
    }
    & .timeline-item.comment > .timeline-avatar {
      display: none;
    }
    & .comment-header .inline-timeline-avatar {
      display: inline-flex !important;
      margin-right: 8px;
    }
    & .comment-header .inline-timeline-avatar img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    & .comment .comment-container {
      position: relative;
      background: ${themeVars.color.body};
      border-color: var(--conversation-border, ${themeVars.color.light.border});
    }
    & .comment .comment-header {
      min-height: 38px;
      padding: 4px 4px 4px 8px;
      background: ${themeVars.color.box.header};
      border-color: ${themeVars.color.light.border};
      font-size: 14px;
      line-height: 20px;
    }
    & .comment .comment-header-left {
      min-width: 0;
    }
    & .comment-header-left {
      & > .text {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      }
      & a:has(relative-time) {
        text-decoration: none !important;
      }
    }
    & .comment-header .role-label {
      border: 1px solid ${themeVars.color.light.border};
      border-radius: 20px;
      padding: 0 6px;
      font-size: 12px;
    }
    & .comment .comment-body {
      padding: 16px;

      & .markup {
        font-size: 14px;
        line-height: 21px;
      }
      & .markup h2 {
        font-size: 24px;
      }
      & .markup h3 {
        font-size: 20px;
      }
      & .markup pre {
        padding: 16px;
        font-size: 12px;
        line-height: 18px;
      }
    }
    &.github-issue-conversation {
      & .ui.timeline::before {
        display: none;
      }
      & .comment-list .timeline-item.event {
        display: flex;
        align-items: center;
        gap: 4px;
        align-items: flex-start;
        min-height: 48px;
        margin: 0 0 0 20px;
        padding: 13px 0 13px 24px;
        &::before {
          content: "";
          position: absolute;
          left: -1px;
          top: 0;
          bottom: 0;
          width: 2px;
          height: auto;
          background: ${themeVars.color.light.border};
          z-index: -1;
        }
        & .badge {
          position: absolute;
          left: -16px;
          top: 8px;
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          margin: 0;
          border: 2px solid ${themeVars.color.body};
          border-radius: 50%;
          background: ${themeVars.github.control.bgColor.rest};
          color: ${themeVars.color.text.light.num1};
        }
        & > a.avatar {
          margin-top: 2.5px;
          display: flex;
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          & > img.ui.avatar {
            width: 16px;
            height: 16px;
            margin: 0;
          }
        }
        & > .text.grey.muted-links {
          font-size: 14px;
          line-height: 21px;
          color: ${themeVars.color.text.light.num1};
          & .author {
            color: ${themeVars.color.text.self};
          }
          & a:has(relative-time) {
            text-decoration: underline;
          }
        }
      }
      & .comment.first {
        padding-bottom: 0;
      }
      & .comment.first ~ .timeline-item.event:nth-child(1 of .timeline-item.event) {
        margin-top: 16px;
        &::before {
          top: -16px;
        }
      }
    }
    & .comment-editor-heading {
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      margin: 0 0 8px;
    }
    & .comment.form {
      z-index: 1;
      margin-top: 32px;
      padding: 0;
      background: ${themeVars.color.body};
      & #comment-form {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 8px;
        border: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
        & > .field {
          margin: 0;
          min-width: 0;
        }
        & > .field:first-child {
          grid-column: 1 / -1;
        }
        & > .field:has(.dropzone) {
          align-self: start;
        }
        & > .field.footer {
          grid-column: 2;
        }
        & .button {
          height: 32px;
          min-height: 32px;
          padding: 5px 12px;
          font-size: 14px;
          line-height: 20px;
        }
        & #status-button svg {
          color: ${themeVars.github.borderColor.done.emphasis};
        }
      }
      & .combo-markdown-editor {
        border: 1px solid ${themeVars.color.light.border};
        border-radius: ${otherThemeVars.border.radius};
        background: ${themeVars.color.body};
        & markdown-toolbar {
          background: ${themeVars.color.box.header};
          border-bottom: 1px solid ${themeVars.color.light.border};
        }
        & .markdown-toolbar-button {
          color: ${themeVars.color.text.light.num1};
          width: 28px;
          height: 28px;
          padding: 6px;
          border: 0;
          background: transparent;
        }
        & textarea {
          background: ${themeVars.color.body};
          font-size: 14px;
          border: 1px solid ${themeVars.color.light.border};
          border-radius: ${otherThemeVars.border.radius};
          box-shadow: none;
        }
        overflow: visible;

        & markdown-toolbar {
          border-radius: ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0 0;
          min-height: 38px;
          padding: 0 8px 0 0;
          gap: 8px;

          & .markdown-toolbar-group {
            flex: 0 0 auto;
          }
          & .switch {
            border: 0;
            background: transparent;
            border-radius: 0;
            margin: 0 auto -1px 0;
            min-height: 38px;
          }
          & .switch .item {
            height: 38px;
            min-height: 38px;
            padding: 8px 16px;
            border: 1px solid transparent;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
            font-size: 14px;
            line-height: 21px;
            font-weight: 400;
          }
          & .switch .item.active {
            border-right-color: ${themeVars.color.light.border};
            border-left-color: ${themeVars.color.light.border};
            border-bottom-color: ${themeVars.color.body};
            background: ${themeVars.color.body};
          }
          & .switch .item.active::before,
          & .switch .item.active::after {
            display: none;
          }
        }
        & > .ui.tab.markup {
          background: ${themeVars.color.body};
          padding: 16px;
          min-height: 136px;
          font-size: 14px;
          line-height: 21px;
        }
        & textarea {
          margin: 8px;
          width: calc(100% - 16px);
          height: auto;
          min-height: 123px;
          max-height: calc(35lh + 18px);
          field-sizing: content;
          line-height: 21px;
          font-family: var(--fonts-proportional);
          padding: 8px;
        }
      }
      & .dropzone {
        min-height: 32px;
        padding: 0;
        border: 0;
        background: transparent;
        & .dz-message {
          margin: 0;
          text-align: left;
        }
        & .dz-button {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 8px;
          min-height: 32px;
          font-size: 12px;
          line-height: 18px;
          font-weight: 400;
          color: ${themeVars.color.text.light.num1};
          background: transparent;
          border: 0;
          box-shadow: none;
        }
      }
    }

    &.own-conversation .comment.first {
      & .comment-container {
        --conversation-border: rgb(from ${themeVars.github.bgColor.accent.muted} r g b / 0.4);
      }
      & .comment-header {
        background: ${themeVars.github.bgColor.accent.muted};
        border-color: var(--conversation-border);
      }
      & .role-label {
        border-color: var(--conversation-border);
      }
    }
    & .conversation-body-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
    }
    & .comment-container {
      & .ui.dropdown.select-reaction > .menu {
        left: 0 !important;
        right: auto !important;
      }
      & .select-reaction > .add-reaction {
        display: flex;
        width: 28px;
        height: 28px;
        align-items: center;
        justify-content: center;
        border: 1px solid ${themeVars.color.light.border};
        border-radius: 50%;
        color: ${themeVars.color.text.light.num1};
        background: transparent;
      }
      & .select-reaction > .add-reaction:hover {
        background: ${themeVars.color.hover.self};
      }
      &:has(> .reactions .comment-reaction-button) .conversation-body-actions {
        display: none;
      }
      & > .reactions {
        padding: 8px 16px 16px;
        border: 0;
        background: transparent;
        gap: 8px;
      }
    }
    & .comment-header-right {
      gap: 8px;
    }
    & .comment-header .context-dropdown {
      display: grid;
      place-items: center;
      margin: 0;
      padding: 0;
      width: 28px;
      height: 28px;
    }

    @media (max-width: 767.98px) {
      & .comment.form #comment-form {
        grid-template-columns: minmax(0, 1fr);
        & > .field.footer {
          grid-column: 1;
        }
      }

      & > .ui.container {
        width: calc(100% - 32px) !important;
        margin: 16px !important;
      }
      & .issue-title {
        flex-wrap: wrap;
      }
      & .issue-title h1 {
        font-size: 24px;
        line-height: 32px;
      }
      & .issue-content {
        grid-template-columns: minmax(0, 1fr);
      }
      & .issue-content-right.ui.segment {
        border-top: 1px solid ${themeVars.color.light.border};
        padding-top: 16px;
      }
      & .comment-header {
        flex-wrap: wrap;
        gap: 4px;
      }
      & .comment-header-left > .text {
        font-size: 12px;
      }
      & .comment .comment-body {
        padding: 12px;
      }
    }
  }
`;

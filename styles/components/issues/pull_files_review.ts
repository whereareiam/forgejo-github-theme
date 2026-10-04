import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

export default css`
  /* "Finish review" opens Forgejo's form in a popup; GitHub shows it as a 640px dialog. */
  .tippy-box[data-theme="menu"]:has(.review-box-panel) {
    width: 640px;
    max-width: calc(100vw - 32px) !important;
    & > .tippy-content {
      padding: 0;
    }
  }
  /* The pending comment count on the green button: GitHub's counter inside a primary button. */
  #review-box .js-btn-review .review-comments-counter {
    min-width: 20px;
    padding: 0 6px;
    background: rgb(0 0 0 / 0.2);
    color: inherit;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
  }
  /* GitHub's review button is a small 28px control. */
  #review-box .ui.ui.ui.button.js-btn-review {
    height: 28px;
    min-height: 28px;
  }
  /* "Viewed" is a small bordered button on GitHub. */
  .diff-file-header .viewed-file-form {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 28px;
    padding: 0 8px;
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    background: ${themeVars.color.button};
    color: ${themeVars.color.text.self};
    font-size: 12px;
    font-weight: 500;
  }
  .review-box-panel {
    display: block;
    & > .ui.segment {
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }
    & form {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 0 8px;
      & > :is(.field, .divider) {
        flex: 0 0 100%;
        min-width: 0;
        margin: 0;
      }
    }
    /* Title row */
    & form > .field:has(> .close) {
      min-height: 48px;
      padding: 8px 8px 8px 16px;
      border-bottom: 1px solid ${themeVars.color.light.border};
      font-size: 14px;
      font-weight: 600;
      & .close {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border-radius: ${otherThemeVars.border.radius};
        color: ${themeVars.color.text.light.num1};
        &:hover {
          background: ${themeVars.github.control.transparent.bgColor.hover};
        }
      }
    }
    & form > .field:has(.combo-markdown-editor) {
      padding: 16px 16px 0;
    }
    & form > .field:has(.dropzone) {
      padding: 4px 16px 8px;
    }
    & form > .divider {
      border-color: ${themeVars.color.light.border};
    }
    & form > .ui.ui.ui.button {
      /* Sized by the native control list in the button component. */
      margin: 16px 0;
    }
    & form > .ui.ui.ui.button:last-of-type {
      margin-right: 16px;
    }
    & .combo-markdown-editor {
      /* Forgejo fixes this editor at 730px; it fills the dialog instead. */
      width: auto;
      max-width: none;
      /* The dialog is narrower than the toolbar's buttons at their usual spacing. */
      & markdown-toolbar {
        gap: 0 !important;
        padding-right: 4px !important;
      }
      & .markdown-toolbar-group {
        gap: 0 !important;
      }
    }
  }
  /* The comment form opened on a diff line */
  .comment-code-cloud {
    & .field:has(> .dropzone) {
      margin: 4px 0 0;
    }
    & .field.footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding-top: 8px;
      & .markup-info {
        margin: 0;
      }
      & .button-sequence {
        flex: 1;
        gap: 8px;
      }
      & .ui.ui.ui.button {
        margin: 0;
      }
    }
    /* The row under a posted conversation, in the diff and on the Conversation tab: Previous / Next, Resolve, Reply */
    & :is(.button-row, .button-sequence):has(.comment-form-reply) {
      gap: 8px;
      margin-top: 8px;
      & .ui.ui.ui.button {
        margin: 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      & .ui.buttons > .ui.ui.ui.button:not(:first-child) {
        margin-left: -1px;
      }
      /* Fomantic's labelled icon sits in an absolutely placed box; show a plain icon beside the text. */
      & .ui.ui.ui.labeled.icon.button {
        padding: 5px 12px !important;
      }
      & .ui.ui.ui.labeled.icon.button > .icon {
        position: static;
        width: 16px;
        height: 16px;
        margin: 0 !important;
        padding: 0;
        background: transparent;
        box-shadow: none;
        color: inherit;
        opacity: 1;
      }
    }
  }
`;

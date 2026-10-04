import { css, themeVars } from "@lutinglt/gitea-github-theme/core";

/** The "New issue" page, laid out as GitHub's "Create new issue": avatar, heading, title, editor, sidebar. */
export default css`
  .page-content.repository.new.issue.github-issue-new {
    & > .ui.container {
      width: calc(100% - 64px) !important;
      max-width: 1232px !important;
      margin: 24px auto !important;
    }
    & .issue-new-heading {
      margin: 0 0 8px 56px;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }
    & .issue-content {
      gap: 24px;
    }
    & .issue-content-left .ui.comments {
      max-width: none;
      margin: 0;
    }
    & .issue-content-left .comment {
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr);
      gap: 16px;
      margin: -32px 0 0;
      padding: 0;
      & > :is(img, .avatar) {
        float: none;
        width: 40px;
        height: 40px;
        margin: 0;
      }
      /* GitHub's form has no box around it. */
      & > .ui.segment.content {
        margin: 32px 0 0 !important;
        padding: 0;
        border: 0;
        background: transparent;
        box-shadow: none;
        &::before,
        &::after {
          display: none;
        }
      }
    }
    & .issue-content-left .field {
      margin: 0 0 16px;
    }
    & #issue_title {
      height: 32px;
      padding: 5px 12px;
      font-size: 14px;
      line-height: 20px;
    }
    & .combo-markdown-editor textarea {
      min-height: 300px !important;
    }
    /* Sidebar: muted bold headings with the gear at the right edge, as on an issue page. */
    & .issue-content-right.ui.segment {
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
      font-size: 12px;
    }
    & .issue-content-right .ui.dropdown {
      width: 100%;
    }
    & .issue-content-right .ui.dropdown > .text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 4px 0;
      &:hover {
        color: ${themeVars.github.fgColor.accent};
      }
    }
    & .issue-content-right strong {
      color: ${themeVars.color.text.light.num1};
      font-size: 12px;
      font-weight: 600;
    }
    & .issue-content-right .ui.dropdown > .text:hover strong {
      color: inherit;
    }
    & .issue-content-right .divider {
      margin: 16px 0;
    }
  }
`;

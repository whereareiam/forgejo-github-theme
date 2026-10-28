import { css, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

/**
 * GitHub's "Create new issue": the page heading over the form, which is repo/issue/new_form (theme-issue-form) on the
 * new issue page and the compare page alike: labelled title and description fields without an avatar, the buttons at
 * the right below them, and the metadata sidebar as on an issue. The template chooser shares the page heading.
 */
export default css`
  .page-content.repository.new.issue.github-issue-new {
    & > .ui.container {
      width: calc(100% - 64px) !important;
      max-width: 1232px !important;
      margin: 24px auto !important;
    }
    & .issue-new-heading {
      margin: 0 0 16px;
      font-size: 20px;
      font-weight: 600;
      line-height: 32px;
    }
  }
  @media (max-width: 767.98px) {
    .page-content.repository.new.issue.github-issue-new > .ui.container {
      width: calc(100% - 32px) !important;
      margin: 16px auto !important;
    }
  }

  .ui.form.theme-issue-form.issue-content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 288px;
    & > .issue-content-left {
      width: auto;
      min-width: 0;
    }
    & > .issue-content-left > .field {
      margin: 0 0 16px;
    }
    /* "Title *" and "Description": GitHub's form labels. Template forms label their fields with an h3. */
    & > .issue-content-left > .field > label,
    & .theme-issue-form-label,
    & > .issue-content-left > .field > h3 {
      display: block;
      margin: 0 0 8px;
      color: ${themeVars.color.text.self};
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
    }
    /* The required marker in the danger colour, as Forgejo marks a template's required fields. */
    & .theme-issue-form-required {
      color: ${themeVars.color.red.self};
    }
    /* A template's description under its label, as GitHub's muted field caption. */
    & > .issue-content-left > .field > .help {
      display: block;
      margin: -4px 0 8px;
      padding: 0;
      color: ${themeVars.color.text.light.num1};
      font-size: 12px;
      line-height: 20px;
      & > p {
        margin: 0;
      }
    }
    /* The title and a template's text fields are GitHub's 32px inputs. */
    & #issue_title,
    & > .issue-content-left > .field > input:is([type="text"], [type="number"]) {
      height: 32px;
      padding: 5px 12px;
      font-size: 14px;
      line-height: 20px;
    }
    & .title_wip_desc {
      margin-top: 4px;
      color: ${themeVars.color.text.light.num1};
      font-size: 12px;
      line-height: 20px;
    }
    & .theme-issue-form-description > .field {
      margin: 0 0 8px;
    }
    & .combo-markdown-editor textarea {
      min-height: 200px !important;
    }
    & .theme-issue-form-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
      & > .ui.button {
        margin: 0;
      }
    }
    /* The sidebar as on an issue (issue_conversation): flush muted headings with the gear at the right edge, the value
       below, full-width dividers. Listed after issue_sidebar, whose padded rows it replaces here. */
    & > .issue-content-right.ui.segment {
      width: auto;
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      box-shadow: none;
      font-size: 12px;
      & > .divider {
        width: 100%;
        margin: 16px 0;
      }
      & strong {
        color: ${themeVars.color.text.light.num1};
        font-size: 12px;
        font-weight: 600;
      }
      & > .ui.dropdown,
      & > .ui.dropdown.select-branch {
        width: 100%;
        padding: 0;
      }
      & > .ui.dropdown > :is(a, span).text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
        height: auto;
        min-height: 26px;
        margin: -4px 0 4px;
        padding: 4px 0;
        border-radius: 0;
        &:hover {
          color: ${themeVars.github.fgColor.accent};
          background: transparent;
          box-shadow: none;
        }
        &:hover strong {
          color: inherit;
        }
      }
      & > .ui.list,
      & > .ui.dropdown > .theme-issue-development-ref {
        margin: 0;
        padding: 0;
      }
      & :is(.no-select, .theme-issue-development-ref) {
        padding: 0;
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
  @media (max-width: 767.98px) {
    .ui.form.theme-issue-form.issue-content {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  /* The template chooser: one box with a row per template, its description below the name and a chevron. */
  .page-content.theme-issue-choose .theme-issue-choose-list > .theme-box-list-row {
    min-height: 0;
    margin: 0;
    padding: 0;
    & > a {
      display: flex;
      flex: 1;
      align-items: center;
      gap: 16px;
      min-width: 0;
      padding: 12px 16px;
      color: ${themeVars.color.text.self};
      text-decoration: none;
      &:hover {
        background: ${themeVars.color.hover.self};
      }
    }
    & .theme-box-list-main {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 14px;
      line-height: 20px;
    }
    & .theme-box-list-main > strong {
      font-weight: 600;
    }
    &:first-child > a {
      border-radius: ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0 0;
    }
    &:last-child > a {
      border-radius: 0 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius};
    }
    &:only-child > a {
      border-radius: ${otherThemeVars.border.radius};
    }
  }
  .page-content.theme-issue-choose .theme-issue-choose-action {
    display: flex;
    flex: none;
    color: ${themeVars.color.text.light.num1};
  }
  /* Forgejo's "Get started" and "Open" stay for screen readers; GitHub shows only the icon. */
  .page-content.theme-issue-choose .theme-issue-choose-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;

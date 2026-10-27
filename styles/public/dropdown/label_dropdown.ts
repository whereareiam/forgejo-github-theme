import { css, themeVars } from "@lutinglt/gitea-github-theme/core";

// GitHub's label picker rows in the issue sidebar's label menu: the check beside the label, the description below the
// label, and the row as tall as its text. Forgejo's rows and the template's components/repository/label/option share
// this layout; their children are placed by class. Forgejo writes two &nbsp; between the check and the label, which
// become an unplaced grid item; at font size 0 it takes no room, and every child sets its own size. The selector names
// the menu by all of Forgejo's classes to outrank the theme's fixed 32px menu rows, and leaves out the rows the
// filter field hides.
export default css`
  .ui.dropdown.select-label > .filter.menu.ugc-labels > .item:not(.no-select):not(.tw-hidden):not(.filtered) {
    display: grid !important;
    grid-template-columns: 16px auto minmax(0, 1fr);
    grid-template-areas:
      "check label hint"
      ". description description";
    align-items: center;
    gap: 2px 8px;
    height: auto !important;
    font-size: 0;
    line-height: 0;
    white-space: normal;
    > .octicon-check {
      display: flex;
      grid-area: check;
      svg {
        margin: 0;
      }
    }
    > :is(.ui.label, .repository-label, .repository-label-scoped) {
      grid-area: label;
      justify-self: start;
    }
    > .archived-label-hint {
      display: flex;
      grid-area: hint;
      float: none;
      margin: 0;
      font-size: 12px;
      line-height: 20px;
      .archived-label-indicator {
        margin: 0 !important;
      }
    }
    > .desc {
      grid-area: description;
      padding: 0;
      color: ${themeVars.color.text.light.num1};
      font-size: 12px;
      line-height: 16px;
      overflow-wrap: anywhere;
    }
  }
`;

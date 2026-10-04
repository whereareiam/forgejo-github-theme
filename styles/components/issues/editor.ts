import { otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

/** GitHub's comment editor, for the rules of a `.combo-markdown-editor`: a bordered box whose toolbar carries the Write/Preview tabs. */
export const markdownEditor = `
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
    /* Forgejo overlaps neighbouring switch items with negative margins and paints the first one. */
    & .switch .item {
      height: 38px;
      min-height: 38px;
      margin: 0 !important;
      padding: 8px 16px !important;
      border: 1px solid transparent;
      border-radius: 0;
      background: transparent !important;
      box-shadow: none;
      outline: 0;
      color: ${themeVars.color.text.light.num1};
      font-size: 14px;
      line-height: 21px;
      font-weight: 400;
    }
    & .switch .item:not(.active):hover {
      color: ${themeVars.color.text.self};
    }
    & .switch .item.active {
      border-right-color: ${themeVars.color.light.border};
      border-left-color: ${themeVars.color.light.border};
      border-bottom-color: ${themeVars.color.body};
      background: ${themeVars.color.body} !important;
      color: ${themeVars.color.text.self};
    }
    /* The editor's own border already draws the first tab's left edge. */
    & .switch .item.active:first-child {
      border-left-color: transparent;
      border-top-left-radius: ${otherThemeVars.border.radius};
    }
    & .switch .item:focus-visible {
      outline: 2px solid ${themeVars.github.fgColor.accent};
      outline-offset: -2px;
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
`;

/** The attachment line under an editor, for the rules of its `.dropzone`: a plain text button instead of a dashed drop area. */
export const attachmentDropzone = `
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
`;

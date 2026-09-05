/*!
 * Copyright (c) https://github.com/lutinglt
 *
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { css, cssCombine, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";

const repoButtonRow = css`
  .gitea-github-theme-templates {
    /* 仓库按钮行 */
    &.repo-button-row {
      margin: 0 0 16px 0;
      .repo-button-row-left .repository-summary {
        /* 分支/标签样式 */
        > .item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border-radius: ${otherThemeVars.border.radius};
          color: ${themeVars.color.text.light.num1};
          padding: 4px;
          height: 32px;
          min-height: 32px;
          &:hover {
            background-color: ${themeVars.github.control.transparent.bgColor.hover};
            box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
            text-decoration-line: none;
          }
          svg {
            color: ${themeVars.github.button.invisible.iconColor.rest};
            margin-right: 4px;
          }
          b {
            color: ${themeVars.color.caret};
          }
        }
      }
    }
  }
`;

const repoToolbarDetails = css`
  .gitea-github-theme-templates.repo-button-row {
    /*
 * Two-sided repository toolbar layout and its compact native controls.
 */
    & > .repo-button-row-left,
    & > .repo-button-row-right {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    & > .repo-button-row-left {
      flex-grow: 1;
    }

    & > .repo-button-row-right {
      flex-wrap: nowrap;
    }

    & .ui.button {
      flex-shrink: 0;
      margin: 0;
      min-height: 30px;
    }

    & .repo-find-file {
      gap: 6px;
    }

    /* Compact code dropdown with protocol, URL, copy, archive, citation, and editor controls. */
    & .repo-code-dropdown {
      flex: 0 0 auto;
    }

    & .repo-code-dropdown > summary.ui.primary.button {
      background: ${themeVars.github.button.primary.bgColor.rest} !important;
      border-color: ${themeVars.github.button.primary.borderColor.rest} !important;
      color: ${themeVars.github.button.primary.fgColor.rest} !important;
      cursor: pointer;
      gap: 6px;
      height: 32px;
      min-height: 32px;
      padding: 5px 12px !important;
    }

    & .repo-code-dropdown > summary.ui.primary.button:hover {
      background: ${themeVars.github.button.primary.bgColor.hover} !important;
    }

    & .repo-code-dropdown[open] > summary.ui.primary.button {
      background: ${themeVars.github.button.primary.bgColor.active} !important;
    }

    & .repo-code-dropdown > summary.ui.primary.button > svg {
      color: currentcolor;
    }

    & .repo-code-dropdown > .content {
      background: ${themeVars.color.menu};
      border: 0;
      border-radius: 12px;
      box-sizing: border-box;
      box-shadow: ${themeVars.github.shadow.floating.small};
      direction: ltr;
      left: auto;
      margin-top: 4px !important;
      min-width: 0;
      overflow: hidden;
      padding: 0;
      right: 0;
      width: min(400px, calc(100vw - 32px));
    }

    & .repo-code-navigation {
      align-items: flex-start;
      box-shadow: inset 0 -1px 0 ${themeVars.color.light.border};
      display: flex;
      height: 48px;
      padding: 8px 8px 0;
    }

    & .repo-code-navigation-item {
      align-items: center;
      border-radius: ${otherThemeVars.border.radius};
      color: ${themeVars.color.text.self};
      display: flex;
      height: 32px;
      line-height: 21px;
      padding: 6px 8px;
      position: relative;
    }

    & .repo-code-navigation-item.active::after {
      background: ${themeVars.github.underlineNav.borderColor.active};
      border-radius: ${otherThemeVars.border.radius};
      bottom: -8px;
      content: "";
      height: 2px;
      left: 8px;
      position: absolute;
      right: 8px;
    }

    & .repo-code-body {
      padding: 16px 0 8px;
    }

    & .repo-code-clone {
      padding: 0 16px;
    }

    & .repo-code-title {
      align-items: center;
      display: flex;
      font-weight: 600;
      gap: 8px;
      margin-bottom: 8px;
    }

    & .repo-code-dropdown .clone-panel {
      align-items: center;
      column-gap: 0;
      display: grid;
      grid-template-columns: max-content max-content minmax(0, 1fr) 36px;
      grid-template-rows: 32px 32px;
      height: auto !important;
      min-height: 72px;
      row-gap: 8px;
      width: 100%;
    }

    & .repo-code-dropdown .clone-panel > #repo-clone-https,
    & .repo-code-dropdown .clone-panel > #repo-clone-ssh {
      background: transparent !important;
      border: 1px solid #0000 !important;
      border-radius: ${otherThemeVars.border.radius} !important;
      box-shadow: none !important;
      box-sizing: border-box;
      color: ${themeVars.color.text.self} !important;
      font-size: 14px;
      font-weight: 400;
      grid-row: 1;
      height: 32px;
      line-height: 21px;
      margin: 0;
      min-height: 32px;
      padding: 4px 12px !important;
    }

    & .repo-code-dropdown .clone-panel > #repo-clone-https {
      grid-column: 1;
    }

    & .repo-code-dropdown .clone-panel > #repo-clone-ssh {
      grid-column: 2;
    }

    & .repo-code-dropdown .clone-panel > .primary:is(#repo-clone-https, #repo-clone-ssh) {
      background: light-dark(${themeVars.github.controlKnob.bgColor.rest}, ${themeVars.color.hover.self}) !important;
      border-color: ${themeVars.color.secondary.self} !important;
      font-weight: 600;
    }

    & .repo-code-dropdown .clone-panel > .basic:is(#repo-clone-https, #repo-clone-ssh):hover {
      background: ${themeVars.github.control.transparent.bgColor.hover} !important;
    }

    & .repo-code-dropdown .clone-panel > #repo-clone-url {
      background: ${themeVars.color.box.header};
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius};
      font-family: var(--font-monospace);
      font-size: 12px;
      grid-column: 1 / 4;
      grid-row: 2;
      height: 32px;
      min-width: 0;
      padding: 3px 12px;
      width: 100%;
    }

    & .repo-code-dropdown .clone-panel > #repo-clone-url:focus {
      border-color: ${themeVars.github.borderColor.accent.emphasis};
    }

    & .repo-code-dropdown .clone-panel > #clipboard-btn {
      align-items: center;
      background: transparent !important;
      border: 1px solid #0000 !important;
      border-radius: ${otherThemeVars.border.radius} !important;
      color: ${themeVars.color.text.light.num1};
      display: grid;
      font-size: 14px;
      gap: 0;
      grid-column: 4;
      grid-row: 2;
      height: 32px;
      justify-content: center;
      justify-self: end;
      margin: 0;
      padding: 0 !important;
      width: 32px;
    }

    & .repo-code-dropdown .clone-panel > #clipboard-btn:hover {
      background: ${themeVars.github.control.transparent.bgColor.hover};
      box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
    }

    & .repo-code-body > hr {
      margin: 12px 0 8px;
    }

    & .repo-code-body > .repo-code-search:not([open]) + hr {
      margin-top: 0;
    }

    & .repo-code-actions {
      list-style: none;
      margin: 8px;
      padding: 0;
    }

    & .repo-code-actions > li {
      margin: 0;
    }

    & .repo-code-actions > li > a {
      align-items: center;
      border-radius: ${otherThemeVars.border.radius};
      color: ${themeVars.color.text.self};
      display: flex;
      gap: 8px;
      height: 32px;
      line-height: 21px;
      padding: 6px 8px;
      text-decoration: none;
    }

    & .repo-code-actions > li > a:hover {
      background: ${themeVars.github.control.transparent.bgColor.hover};
      box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
      text-decoration: none;
    }

    & .repo-code-actions svg {
      color: ${themeVars.color.text.light.num1} !important;
      flex: 0 0 auto;
      margin: 0 !important;
    }
  }
  /*
 * GitHub edits repository description, website, and topics from the About
 * sidebar. Forgejo 15 exposes the same data through separate settings and
 * topics endpoints, so present its native controls in one modal while keeping
 * the topic dropdown markup required by repo-home.js.
 */
  .page-content.repository.file.list .repo-home-sidebar-top > .repo-about-block {
    gap: 0;
    margin: 0 !important;
    position: relative;
  }

  .page-content.repository.file.list .repo-about-block > .repo-about-heading {
    height: 24px;
    margin: 0;
  }

  .page-content.repository.file.list .repo-about-block > .repo-description {
    color: ${themeVars.color.text.self};
    margin: 12px 0;
  }

  .page-content.repository.file.list .repo-about-block > .repo-description.no-description {
    color: ${themeVars.color.text.light.num1};
    font-size: 16px;
    font-style: italic;
    line-height: 24px;
  }

  .page-content.repository.file.list .repo-about-settings,
  .page-content.repository.file.list .repo-about-modal-close {
    align-items: center;
    border-radius: ${otherThemeVars.border.radius};
    display: inline-flex;
    height: 24px;
    justify-content: center;
    padding: 4px;
    width: 24px;
  }

  .page-content.repository.file.list .repo-about-settings:hover,
  .page-content.repository.file.list .repo-about-modal-close:hover {
    background: ${themeVars.github.control.transparent.bgColor.hover};
    box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
  }

  .page-content.repository.file.list .repo-about-topic-list:empty {
    display: none;
  }

  html.repo-about-modal-open {
    overflow: hidden;
  }

  .page-content.repository.file.list .repo-about-modal-overlay {
    align-items: center;
    background: ${themeVars.color.overlayBackdrop};
    display: flex;
    inset: 0;
    justify-content: center;
    padding: 16px;
    position: fixed;
    z-index: 1100;
  }

  .page-content.repository.file.list .repo-about-modal-card {
    background: ${themeVars.color.body};
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    box-shadow: ${themeVars.github.shadow.floating.small};
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 32px);
    overflow: auto;
    width: min(640px, calc(100vw - 32px));
  }

  .page-content.repository.file.list .repo-about-modal-header,
  .page-content.repository.file.list .repo-about-modal-footer {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    padding: 16px;
  }

  .page-content.repository.file.list .repo-about-modal-header {
    border-bottom: 1px solid ${themeVars.color.light.border};
    font-size: 16px;
    justify-content: space-between;
  }

  .page-content.repository.file.list .repo-about-modal-body {
    overflow: auto;
    padding: 16px;
  }

  .page-content.repository.file.list .repo-about-modal-body > .field:not(:last-child) {
    margin-bottom: 24px;
  }

  .page-content.repository.file.list .repo-about-modal-body label {
    font-size: 14px;
    font-weight: var(--font-weight-semibold);
    line-height: 21px;
  }

  .page-content.repository.file.list .repo-about-modal-body input:is([name="description"], [name="website"]) {
    box-sizing: border-box;
    font-size: 14px;
    height: 32px;
    line-height: 20px;
    padding: 5px 12px;
  }

  .page-content.repository.file.list .repo-about-topics-input {
    align-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    font-size: 12px;
    line-height: 20px;
    min-height: 34px;
    padding: 6px 0 6px 12px;
  }

  .page-content.repository.file.list .repo-about-topics-input > input.search {
    flex: 1 1 120px;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    margin: 0 12px 0 0;
    min-width: 120px;
    padding: 0;
    width: auto !important;
  }

  .page-content.repository.file.list .repo-about-error {
    color: ${themeVars.color.error.text};
    margin-top: 8px;
  }

  .page-content.repository.file.list .repo-about-modal-footer {
    border-top: 1px solid ${themeVars.color.light.border};
    gap: 8px;
    justify-content: flex-end;
  }

  .page-content.repository.file.list .repo-about-modal-footer .ui.button {
    height: 32px;
    line-height: 20px;
    margin: 0;
    min-height: 32px;
    padding: 5px 12px;
  }

  /*
 * The preserved Forgejo 15 code-search form is attached to the file list.
 * The newer theme gives standalone file lists a 16px top margin, which must
 * be removed only for this legacy adjacent form.
 */
  .page-content.repository.file.list .code-search + #repo-files-table {
    margin-top: 0;
  }

  .page-content.repository.file.list .code-search [data-test-tag="codesearch"] .ui.action.input > input {
    border-radius: ${otherThemeVars.border.radius} 0 0 ${otherThemeVars.border.radius};
  }

  .page-content.repository.file.list
    .code-search
    [data-test-tag="codesearch"]
    .ui.action.input
    > .ui.dropdown.selection {
    border-radius: 0 !important;
  }

  .page-content.repository.file.list
    .code-search
    [data-test-tag="codesearch"]
    .ui.action.input
    > .ui.button:last-child {
    border-radius: 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0 !important;
  }

  .page-content.repository.file.list .code-search + #repo-files-table > .repo-file-line:first-child {
    border-radius: 0;
  }

  @media (max-width: 767.98px) {
    .gitea-github-theme-templates.repo-button-row {
      align-items: stretch;
      gap: 8px;
    }

    .gitea-github-theme-templates.repo-button-row > .repo-button-row-left,
    .gitea-github-theme-templates.repo-button-row > .repo-button-row-right {
      box-sizing: border-box;
      width: 100%;
    }

    .gitea-github-theme-templates.repo-button-row > .repo-button-row-left {
      align-items: stretch;
    }

    .gitea-github-theme-templates.repo-button-row > .repo-button-row-left > .js-branch-tag-selector {
      flex: 1 1 160px;
      min-width: 0;
    }

    .gitea-github-theme-templates.repo-button-row > .repo-button-row-right {
      justify-content: flex-end;
      overflow: visible;
    }

    .gitea-github-theme-templates.repo-button-row .repo-code-dropdown > .content {
      max-height: calc(100vh - 96px);
      overflow-y: auto;
    }

    .page-content.repository.file.list .repo-about-modal-overlay {
      align-items: flex-end;
      padding: 0;
    }

    .page-content.repository.file.list .repo-about-modal-card {
      border-bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      max-height: calc(100vh - 48px);
      width: 100%;
    }

    .page-content.repository.file.list .repo-about-modal-body > .field:not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;

export default cssCombine(repoButtonRow, repoToolbarDetails);

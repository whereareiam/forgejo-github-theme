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
  /*
 * Two-sided repository toolbar layout and its compact native controls.
 */
  .gitea-github-theme-templates.repo-button-row > .repo-button-row-left,
  .gitea-github-theme-templates.repo-button-row > .repo-button-row-right {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .gitea-github-theme-templates.repo-button-row > .repo-button-row-left {
    flex-grow: 1;
  }

  .gitea-github-theme-templates.repo-button-row > .repo-button-row-right {
    flex-wrap: nowrap;
  }

  .gitea-github-theme-templates.repo-button-row .ui.button {
    flex-shrink: 0;
    margin: 0;
    min-height: 30px;
  }

  .gitea-github-theme-templates.repo-button-row .repo-find-file {
    gap: 6px;
  }

  /* Compact code dropdown with protocol, URL, copy, archive, citation, and editor controls. */
  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown {
    flex: 0 0 auto;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown > summary.ui.primary.button {
    background: ${themeVars.github.button.primary.bgColor.rest} !important;
    border-color: ${themeVars.github.button.primary.borderColor.rest} !important;
    color: ${themeVars.github.button.primary.fgColor.rest} !important;
    cursor: pointer;
    gap: 6px;
    height: 32px;
    min-height: 32px;
    padding: 5px 12px !important;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown > summary.ui.primary.button:hover {
    background: ${themeVars.github.button.primary.bgColor.hover} !important;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown[open] > summary.ui.primary.button {
    background: ${themeVars.github.button.primary.bgColor.active} !important;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown > summary.ui.primary.button > svg {
    color: currentcolor;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown > .content {
    box-sizing: border-box;
    direction: ltr;
    left: auto;
    min-width: 0;
    padding: 16px 0 8px;
    right: 0;
    width: min(420px, calc(100vw - 32px));
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-clone {
    padding: 0 16px;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-title {
    font-weight: 600;
    margin-bottom: 8px;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown .clone-panel {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    height: auto !important;
    min-height: 72px;
    width: 100%;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown .clone-panel > #repo-clone-https,
  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown .clone-panel > #repo-clone-ssh {
    background: transparent !important;
    border: 0 !important;
    box-shadow: none !important;
    color: ${themeVars.color.text.self} !important;
    font-weight: 600;
    padding: 6px 8px;
    position: relative;
  }

  .gitea-github-theme-templates.repo-button-row
    .repo-code-dropdown
    .clone-panel
    > .primary:is(#repo-clone-https, #repo-clone-ssh)::after {
    background: ${themeVars.github.underlineNav.borderColor.active};
    border-radius: ${otherThemeVars.border.radius};
    bottom: -5px;
    content: "";
    height: 2px;
    left: 8px;
    position: absolute;
    right: 8px;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown .clone-panel > #repo-clone-url {
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    flex: 1 1 calc(100% - 40px);
    font-family: var(--font-monospace);
    min-width: 0;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown .clone-panel > #repo-clone-url:focus {
    border-color: ${themeVars.github.borderColor.accent.emphasis};
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown .clone-panel > #clipboard-btn {
    border: 0;
    border-radius: ${otherThemeVars.border.radius};
    flex: 0 0 32px;
    height: 32px;
    padding: 0;
    width: 32px;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-dropdown > .content > hr {
    margin: 12px 0 8px;
  }

  .gitea-github-theme-templates.repo-button-row .repo-code-actions svg {
    color: ${themeVars.color.text.light.num1};
  }

  /*
 * GitHub edits repository description, website, and topics from the About
 * sidebar. Forgejo 15 exposes the same data through separate settings and
 * topics endpoints, so present its native controls in one modal while keeping
 * the topic dropdown markup required by repo-home.js.
 */
  .page-content.repository.file.list .repo-about-block {
    position: relative;
  }

  .page-content.repository.file.list .repo-about-heading {
    height: 24px;
    margin-top: 0;
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
    font-weight: var(--font-weight-semibold);
  }

  .page-content.repository.file.list .repo-about-modal-body input:is([name="description"], [name="website"]) {
    font-size: 14px;
    height: 32px;
  }

  .page-content.repository.file.list .repo-about-topics-input {
    align-content: flex-start;
    align-items: flex-start;
    min-height: 58px;
    padding: 6px;
  }

  .page-content.repository.file.list .repo-about-topics-input > input.search {
    font-size: 14px;
    line-height: 20px;
    margin: 0;
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

  .page-content.repository.file.list .code-search + #repo-files-table > .repo-file-line:first-child {
    border-radius: 0;
  }

  /* Match Forgejo's native clone input to the 32px popup controls. */
  .gitea-github-theme-templates.repo-button-row .clone-panel #repo-clone-url {
    font-size: 13px;
    height: 32px;
  }
`;

export default cssCombine(repoButtonRow, repoToolbarDetails);

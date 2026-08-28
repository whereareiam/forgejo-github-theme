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

const commitPage = css`
  .page-content.repository.diff.github-commit-page {
    > .repository-content-header {
      display: none;
    }

    > .github-commit-page-container.ui.container.fluid.padded {
      margin: 0;
      max-width: none;
      padding: 24px;
      width: 100%;
    }

    .github-commit-title-row {
      align-items: center;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      min-height: 36px;
    }

    .github-commit-title {
      color: ${themeVars.color.text.self};
      font-size: 24px;
      font-weight: 400;
      line-height: 36px;
      margin: 0;
      min-width: 0;
    }

    .github-commit-title code {
      background: transparent;
      color: inherit;
      font-size: inherit;
      line-height: inherit;
      padding: 0;
    }

    .github-commit-page-actions {
      align-items: center;
      display: flex;
      flex: 0 0 auto;
      gap: 8px;
    }

    .github-commit-page-actions > .ui.button,
    .github-commit-page-actions > .ui.dropdown.button {
      align-items: center;
      background: ${themeVars.color.button};
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius};
      box-shadow: none;
      color: ${themeVars.color.text.self};
      display: inline-flex;
      font-size: 14px;
      font-weight: 500;
      gap: 8px;
      height: 32px;
      line-height: 20px;
      margin: 0;
      padding: 5px 12px;
    }

    .github-commit-page-actions > .ui.button:hover,
    .github-commit-page-actions > .ui.dropdown.button:hover {
      background: ${themeVars.color.hover.self};
      border-color: ${themeVars.color.light.border};
    }

    .github-commit-page-actions > .github-commit-operations.ui.dropdown.button {
      padding-left: 8px;
      padding-right: 8px;
    }

    .github-commit-attribution {
      align-items: center;
      color: ${themeVars.color.text.light.num1};
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      gap: 4px;
      line-height: 21px;
      margin-top: 8px;
      min-height: 21px;
    }

    .github-commit-avatar-stack {
      display: inline-flex;
      flex: 0 0 auto;
      margin-right: 4px;
      min-width: 20px;
      position: relative;
    }

    .github-commit-avatar-stack > img.ui.avatar {
      border: 1px solid ${themeVars.github.avatar.borderColor};
      border-radius: 9999px;
      height: 20px;
      margin: 0;
      width: 20px;
    }

    .github-commit-avatar-stack > img.ui.avatar + img.ui.avatar {
      margin-left: -11px;
    }

    .github-commit-attribution a {
      color: ${themeVars.color.text.self};
      font-weight: 600;
    }

    .github-commit-attribution a:hover {
      color: ${themeVars.color.text.self};
      text-decoration: underline;
    }

    .github-commit-attribution-separator {
      margin: 0 4px;
    }

    .github-commit-verification {
      align-items: center;
      border: 1px solid ${themeVars.github.borderColor.success.emphasis};
      border-radius: 9999px;
      color: ${themeVars.github.fgColor.success};
      display: inline-flex;
      font-size: 12px;
      font-weight: 500;
      gap: 4px;
      height: 22px;
      line-height: 20px;
      padding: 0 8px;
    }

    .github-commit-card {
      background: ${themeVars.color.box.body.self};
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius};
      margin-top: 16px;
      overflow: hidden;
    }

    .github-commit-message {
      box-sizing: border-box;
      min-height: 63px;
      padding: 8px 12px;
    }

    .github-commit-summary {
      color: ${themeVars.color.text.self};
      font-family: var(--fonts-monospace);
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
      overflow-wrap: anywhere;
    }

    .github-commit-summary a {
      color: ${themeVars.github.fgColor.accent};
    }

    .github-commit-message > .commit-body {
      color: ${themeVars.color.text.self};
      font-family: var(--fonts-monospace);
      font-size: 12px;
      line-height: 18px;
      margin: 4px 0 0;
      overflow: auto;
      white-space: pre-wrap;
    }

    .github-commit-meta-row {
      align-items: center;
      border-top: 1px solid ${themeVars.color.light.border};
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: space-between;
      min-height: 45px;
      padding: 8px 12px;
    }

    .github-commit-card .branch-and-tag-area {
      align-items: center;
      display: flex;
      flex: 1 1 auto;
      min-width: 0;
    }

    .github-commit-card .branch-and-tag-area > .ellipsis-button.ui.button {
      align-items: center;
      background: ${themeVars.github.bgColor.accent.muted};
      border: 0;
      border-radius: ${otherThemeVars.border.radius};
      box-shadow: none;
      color: ${themeVars.github.fgColor.accent};
      display: inline-flex;
      font-size: 0;
      height: 24px;
      margin: 0 !important;
      padding: 0 8px;
    }

    .github-commit-card .branch-and-tag-area > .ellipsis-button.ui.button::before {
      content: "Branches and tags";
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
    }

    .github-commit-card .branch-and-tag-detail {
      min-width: 0;
    }

    .github-commit-card .branch-and-tag-detail > .divider {
      display: none;
    }

    .github-commit-card .branch-and-tag-detail > div:first-of-type {
      display: none;
    }

    .github-commit-card .branch-and-tag-detail .ui.label {
      border-radius: ${otherThemeVars.border.radius};
      margin: 0 4px 0 0;
    }

    .github-commit-identifiers {
      align-items: center;
      color: ${themeVars.color.text.light.num1};
      display: flex;
      flex: 0 0 auto;
      flex-wrap: wrap;
      font-family: var(--fonts-monospace);
      font-size: 12px;
      gap: 8px;
      justify-content: flex-end;
      line-height: 20px;
    }

    .github-commit-identifier {
      align-items: center;
      display: inline-flex;
      gap: 6px;
      white-space: nowrap;
    }

    .github-commit-identifier a,
    .github-commit-identifier code {
      background: transparent;
      color: ${themeVars.color.text.self};
      font-family: inherit;
      font-size: inherit;
      padding: 0;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    .github-commit-identifier-current code {
      text-decoration: none;
    }

    .github-commit-copy.btn {
      align-items: center;
      border-radius: ${otherThemeVars.border.radius};
      color: ${themeVars.color.text.light.num1};
      display: inline-flex;
      height: 28px;
      justify-content: center;
      padding: 0;
      width: 28px;
    }

    .github-commit-copy.btn:hover {
      background: ${themeVars.github.control.transparent.bgColor.hover};
      color: ${themeVars.color.text.self};
    }

    .github-commit-stats-row {
      align-items: center;
      border-top: 1px solid ${themeVars.color.light.border};
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: space-between;
      min-height: 37px;
      padding: 7px 12px;
    }

    .github-commit-files-changed {
      color: ${themeVars.color.text.self};
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
    }

    .github-commit-change-summary {
      align-items: center;
      color: ${themeVars.color.text.light.num1};
      display: flex;
      font-family: var(--fonts-monospace);
      font-size: 12px;
      gap: 6px;
    }

    .github-commit-additions {
      color: ${themeVars.github.fgColor.success};
    }

    .github-commit-deletions {
      color: var(--color-red);
    }

    .github-commit-change-bar {
      border-radius: 2px;
      display: flex;
      gap: 2px;
      height: 8px;
      overflow: hidden;
      width: 52px;
    }

    .github-commit-change-bar > span {
      min-width: 3px;
    }

    .github-commit-change-bar-additions {
      background: ${themeVars.github.bgColor.success.emphasis};
    }

    .github-commit-change-bar-deletions {
      background: ${themeVars.github.bgColor.danger.emphasis};
    }

    .github-commit-note {
      margin-top: 16px;
    }

    .github-commit-diff {
      border-top: 1px solid ${themeVars.color.light.border};
      margin: 24px -24px 0;
      padding: 0 24px;
    }

    .github-commit-single-file-diff {
      display: grid;
      grid-template-columns: 273px minmax(0, 1fr);
    }

    .github-commit-file-tree {
      border-right: 1px solid ${themeVars.color.light.border};
      box-sizing: border-box;
      min-width: 0;
      padding: 24px 24px 0 0;
    }

    .github-commit-file-tree-title {
      color: ${themeVars.color.text.self};
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
      margin: 0 0 8px;
    }

    .github-commit-file-tree a {
      align-items: center;
      border-radius: ${otherThemeVars.border.radius};
      color: ${themeVars.color.text.self};
      display: flex;
      font-size: 14px;
      gap: 8px;
      line-height: 21px;
      min-height: 32px;
      overflow: hidden;
      padding: 4px 8px;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .github-commit-file-tree a:hover {
      background: ${themeVars.github.control.transparent.bgColor.hover};
    }

    .github-commit-single-file-content {
      min-width: 0;
      padding: 16px 0 0 24px;
    }

    .github-commit-diff > .diff-box > .diff-detail-box,
    .github-commit-single-file-content > .diff-box > .diff-detail-box {
      background: ${themeVars.color.body};
      box-sizing: border-box;
      height: 50px;
      margin: 0;
      padding: 8px 0;
    }

    .github-commit-diff .diff-detail-box .diff-detail-stats {
      display: none !important;
    }

    .github-commit-diff .diff-file-box .diff-file-header {
      background: ${themeVars.color.box.header};
      border-color: ${themeVars.color.light.border};
      box-sizing: border-box;
      min-height: 46px;
      padding: 6px 8px;
    }

    .github-commit-diff .diff-file-box .diff-file-header .file-link {
      color: ${themeVars.color.text.self};
      font-size: 14px;
      font-weight: 600;
    }

    .github-commit-diff .diff-file-box .diff-file-body {
      border-color: ${themeVars.color.light.border};
    }

    .github-commit-diff #diff-file-tree {
      flex-basis: 273px;
      max-width: 273px;
      padding: 8px 24px 0 0;
    }

    .github-commit-diff #diff-content-container {
      min-width: 0;
      padding-left: 24px;
    }

    .github-commit-single-file-content #diff-content-container {
      padding-left: 0;
    }

    @media (max-width: 767.98px) {
      > .github-commit-page-container.ui.container.fluid.padded {
        padding: 16px;
      }

      .github-commit-title-row {
        align-items: flex-start;
        flex-direction: column;
      }

      .github-commit-title {
        font-size: 20px;
        line-height: 30px;
      }

      .github-commit-page-actions {
        flex-wrap: wrap;
        width: 100%;
      }

      .github-commit-message {
        min-height: 0;
      }

      .github-commit-meta-row {
        align-items: flex-start;
        flex-direction: column;
      }

      .github-commit-identifiers {
        justify-content: flex-start;
        width: 100%;
      }

      .github-commit-stats-row {
        align-items: flex-start;
        flex-direction: column;
      }

      .github-commit-single-file-diff {
        display: block;
      }

      .github-commit-file-tree {
        display: none;
      }

      .github-commit-single-file-content {
        padding-left: 0;
      }

      .github-commit-diff {
        margin-left: -16px;
        margin-right: -16px;
        padding: 0 16px;
      }
    }
  }
`;

export default cssCombine(commitPage);

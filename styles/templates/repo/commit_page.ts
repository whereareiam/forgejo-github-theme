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
  .page-content.repository.diff.commit-page {
    > .repository-content-header {
      display: none;
    }

    > .commit-page-container.ui.container.fluid.padded {
      margin: 0;
      max-width: none;
      padding: 24px;
      width: 100%;
    }

    .commit-title-row {
      align-items: center;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      min-height: 39px;
    }

    .commit-title {
      color: ${themeVars.color.text.self};
      font-size: 24px;
      font-weight: 400;
      line-height: 36px;
      margin: 0;
      min-width: 0;
    }

    .commit-title code {
      background: ${themeVars.color.box.header};
      border-radius: 4px;
      color: inherit;
      font-size: inherit;
      line-height: inherit;
      padding: 0 4px;
    }

    .commit-page-actions {
      align-items: center;
      display: flex;
      flex: 0 0 auto;
      gap: 8px;
    }

    .commit-page-actions > .ui.button,
    .commit-page-actions > .ui.dropdown.button {
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

    .commit-page-actions > .ui.button:hover,
    .commit-page-actions > .ui.dropdown.button:hover {
      background: ${themeVars.color.hover.self};
      border-color: ${themeVars.color.light.border};
    }

    .commit-page-actions > .commit-operations.ui.dropdown.button {
      padding-left: 8px;
      padding-right: 8px;
    }

    .commit-attribution {
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

    .commit-avatar-stack {
      display: inline-flex;
      flex: 0 0 auto;
      margin-right: 4px;
      min-width: 20px;
      position: relative;
    }

    .commit-avatar-stack > img.ui.avatar {
      border: 1px solid ${themeVars.github.avatar.borderColor};
      border-radius: 9999px;
      height: 20px;
      margin: 0;
      width: 20px;
    }

    .commit-avatar-stack > img.ui.avatar + img.ui.avatar {
      margin-left: -11px;
    }

    .commit-attribution a {
      color: ${themeVars.color.text.self};
      font-weight: 600;
    }

    .commit-attribution a:hover {
      color: ${themeVars.color.text.self};
      text-decoration: underline;
    }

    .commit-attribution-separator {
      margin: 0 4px;
    }

    .commit-verification {
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

    .commit-card {
      background: ${themeVars.color.box.body.self};
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius};
      margin-top: 16px;
      overflow: hidden;
    }

    .commit-message {
      box-sizing: border-box;
      min-height: 43px;
      padding: 11px 12px;
    }

    .commit-summary {
      color: ${themeVars.color.text.self};
      font-family: var(--fonts-monospace);
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
      overflow-wrap: anywhere;
      overflow: visible;
      white-space: pre-wrap;
      text-overflow: clip;
    }

    .commit-summary a {
      color: ${themeVars.github.fgColor.accent};
    }

    .commit-message > .commit-body {
      color: ${themeVars.color.text.self};
      font-family: var(--fonts-monospace);
      font-size: 12px;
      line-height: 18px;
      margin: 4px 0 0;
      overflow: auto;
      white-space: pre-wrap;
    }

    .commit-meta-row {
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

    .commit-card .branch-and-tag-area {
      align-items: center;
      display: flex;
      flex: 1 1 auto;
      min-width: 0;
    }

    .commit-card .branch-and-tag-area > .ellipsis-button.ui.button {
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

    .commit-card .branch-and-tag-area > .ellipsis-button.ui.button::before {
      content: "Branches and tags";
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;
    }

    .commit-card .branch-and-tag-detail {
      min-width: 0;
    }
    .commit-card .branch-and-tag-detail > .tw-flex {
      margin-top: 0 !important;
      align-items: center;
      gap: 8px;
    }
    .commit-card .branch-area a {
      color: ${themeVars.github.fgColor.accent};
      background: ${themeVars.github.bgColor.accent.muted};
      border: 0 !important;
      font-size: 12px;
      padding: 1px 6px !important;
    }
    .commit-identifiers > a {
      color: ${themeVars.color.text.self};
    }

    .commit-card .branch-and-tag-detail > .divider {
      display: none;
    }

    .commit-card .branch-and-tag-detail > div:nth-child(2) {
      display: none;
    }

    .commit-card .branch-and-tag-detail .ui.label {
      border-radius: ${otherThemeVars.border.radius};
      margin: 0 4px 0 0;
    }

    .commit-identifiers {
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

    .commit-identifier {
      align-items: center;
      display: inline-flex;
      gap: 6px;
      white-space: nowrap;
    }

    .commit-identifier a,
    .commit-identifier code {
      background: transparent;
      color: ${themeVars.color.text.self};
      font-family: inherit;
      font-size: inherit;
      padding: 0;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    .commit-identifier-current code {
      text-decoration: none;
    }

    .commit-copy.btn {
      align-items: center;
      border-radius: ${otherThemeVars.border.radius};
      color: ${themeVars.color.text.light.num1};
      display: inline-flex;
      height: 28px;
      justify-content: center;
      padding: 0;
      width: 28px;
    }

    .commit-copy.btn:hover {
      background: ${themeVars.github.control.transparent.bgColor.hover};
      color: ${themeVars.color.text.self};
    }

    .commit-stats-row {
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

    .commit-files-changed {
      color: ${themeVars.color.text.self};
      font-size: 14px;
      font-weight: 600;
      line-height: 21px;
    }

    .commit-note {
      margin-top: 16px;
    }

    .commit-diff {
      border-top: 1px solid ${themeVars.color.light.border};
      margin: 24px -24px 0;
      padding: 0;
    }

    @media (max-width: 767.98px) {
      > .commit-page-container.ui.container.fluid.padded {
        padding: 16px;
      }

      .commit-title-row {
        align-items: center;
      }

      .commit-title {
        font-size: 24px;
        line-height: 36px;
      }

      .commit-page-actions {
        gap: 4px;
      }
      .commit-page-actions > a.ui.button {
        width: 32px;
        padding: 0;
        justify-content: center;
      }
      .commit-page-actions > a > span {
        display: none;
      }

      .commit-message {
        min-height: 0;
      }

      .commit-meta-row {
        align-items: flex-start;
        flex-direction: column;
      }

      .commit-identifiers {
        justify-content: flex-start;
        width: 100%;
        flex-wrap: nowrap;
        overflow-x: auto;
      }

      .commit-stats-row {
        flex-wrap: nowrap;
      }

      .commit-diff {
        margin-left: -16px;
        margin-right: -16px;
        padding: 0;
      }
    }
  }
`;

export default cssCombine(commitPage);

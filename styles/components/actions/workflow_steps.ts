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
import { animationDown } from "@lutinglt/gitea-github-theme/styles/common";

const jobDetails = css`
  .action-view-right {
    border-radius: ${otherThemeVars.border.radius};
    box-shadow: ${themeVars.github.shadow.resting.small};
    min-height: calc(100vh - 245px);
    .job-info-header {
      height: 80px !important;
      padding: 16px 12px 16px 24px !important;
      .job-info-header-left {
        .job-info-header-title {
          color: ${themeVars.github.fgColor.accent} !important;
        }
        .job-info-header-detail {
          margin-top: 8px;
        }
      }
      .job-info-header-right {
        .ui.dropdown .menu > .item > i.icon {
          margin-right: 2px;
        }
      }
    }
    .job-step-container {
      padding: 8px;
      .job-step-section {
        margin: 0 4px 4px;
        .job-step-summary.job-step-summary {
          color: ${themeVars.color.console.fg.subtle};
          gap: 12px;
          height: 36px;
          padding: 8px !important;
          &.selected {
            background-color: ${themeVars.color.console.activeBg} !important;
            color: ${themeVars.color.console.fg.self} !important;
            top: 80px;
          }
          > svg {
            margin: 0 !important;
          }
          > span:not([class]):has(svg) {
            align-items: center;
            display: inline-flex;
          }
          .step-summary-duration {
            font-family: var(--fonts-monospace);
            font-size: 12px;
          }
        }
        .job-step-logs {
          ${animationDown};
          .job-log-line {
            color: ${themeVars.color.console.fg.self};
            .log-msg:hover {
              * {
                color: ${themeVars.color.console.fg.self};
              }
              a:hover {
                color: ${themeVars.color.primary.self} !important;
              }
            }
          }
        }
      }
    }
  }
`;

export default cssCombine(jobDetails);

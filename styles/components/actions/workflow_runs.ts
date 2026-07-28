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

const actionHeader = css`
  .action-view-header.action-view-header {
    margin: 16px 0;
    .action-info-summary .ui.basic.button {
      font-size: 14px;
    }
    .action-summary {
      a:hover {
        text-decoration: inherit;
      }
      .ui.ui.ui.label {
        background-color: ${themeVars.github.bgColor.accent.muted};
        border-color: transparent;
        border-radius: ${otherThemeVars.border.radius};
        color: ${themeVars.github.fgColor.accent};
        a {
          font-family: var(--fonts-monospace);
          font-weight: 400;
          opacity: 1;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
`;

const jobList = css`
  .action-view-left.action-view-left.action-view-left {
    margin-right: 28px;
    min-width: 224px;
    max-width: 18vw;
    .job-brief-item.job-brief-item {
      border-radius: ${otherThemeVars.border.radius} !important;
      margin-left: 0.5rem;
      padding: 8px;
      position: relative;
      &:hover {
        background-color: ${themeVars.color.console.hoverBg};
      }
      &.selected::after {
        background: ${themeVars.github.borderColor.accent.emphasis};
        border-radius: ${otherThemeVars.border.radius};
        content: "";
        height: 24px;
        left: -0.5rem;
        position: absolute;
        top: calc(50% - 12px);
        width: 4px;
      }
      .job-brief-item-left {
        align-items: center;
        display: flex;
      }
      .job-brief-rerun {
        color: ${themeVars.color.console.fg.subtle} !important;
        display: none;
        &:hover {
          color: ${themeVars.color.text.self} !important;
        }
      }
      .step-summary-duration {
        color: ${themeVars.color.console.fg.subtle};
        font-size: 12px;
      }
      &:hover .job-brief-rerun {
        display: inline-block;
      }
    }
  }
`;

const jobListMobile = css`
  @media (max-width: 767.98px) {
    .action-view-left.action-view-left.action-view-left {
      max-width: none;
    }
  }
`;

export default cssCombine(actionHeader, jobList, jobListMobile);

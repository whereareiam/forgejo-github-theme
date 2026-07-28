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

const packageList = css`
  .page-content.packages > .ui.container > div:not([class]):not(:has(img.ui.avatar)) {
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    margin-top: 16px;
    > .flex-list {
      border-top: 1px solid ${themeVars.color.light.border};
      &:first-child {
        border-top: 0;
      }
      > .flex-item {
        padding: 16px;
        .flex-item-title {
          gap: 8px;
          > a {
            min-height: 25px;
          }
          .ui.label {
            background-color: transparent;
            border: 1px solid ${themeVars.color.light.border};
            color: ${themeVars.color.primary.self};
            gap: 4px;
            min-height: 24.5px;
            padding: 3px 6px;
          }
        }
        .flex-item-body {
          font-size: 12px;
          a {
            text-decoration: underline;
          }
        }
      }
    }
  }
`;

const packageDetails = css`
  .page-content.packages {
    .issue-title-header > div {
      color: ${themeVars.color.text.light.num1};
    }
    .issue-content-left {
      width: calc(100% - 320px);
      .ui.top.attached.header {
        font-size: 14px;
        padding: 16px;
      }
      .ui.attached.segment {
        color: ${themeVars.color.text.light.num1};
        padding: 16px;
        .ui.table,
        .ui.form .field > label {
          color: ${themeVars.color.text.light.num1};
        }
        .ui.form .field > label {
          margin-bottom: 8px;
        }
        .markup {
          color: ${themeVars.color.text.self};
          pre {
            font-size: 12px;
            font-weight: 400;
            padding: 12px 16px;
          }
        }
        + .ui.top.attached.header {
          margin-top: 24px;
        }
      }
    }
    .issue-content-right {
      border: 0;
      padding: 0 16px;
      width: 304px;
      > strong {
        font-size: 16px;
      }
      > .divider {
        margin: 16px 0;
      }
      > .ui.relaxed.list {
        margin: 16px 0;
        > .item {
          color: ${themeVars.color.text.light.num1};
          svg {
            color: ${themeVars.color.text.self};
          }
          &.tw-flex {
            justify-content: space-between;
            > a {
              border: 1px solid ${themeVars.color.light.border};
              border-radius: 9999px;
              flex: none !important;
              font-size: 12px;
              min-height: 20px;
              padding: 0 6px;
              &:hover {
                text-decoration: none;
              }
            }
            &::after {
              display: none;
            }
          }
        }
      }
    }
  }
`;

const packageDetailsMobile = css`
  @media (max-width: 767.98px) {
    .page-content.packages :is(.issue-content-left, .issue-content-right) {
      width: 100%;
    }
  }
`;

export default cssCombine(packageList, packageDetails, packageDetailsMobile);

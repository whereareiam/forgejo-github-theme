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

const releaseHeader = css`
  :is(.page-content.repository.releases, .page-content.repository.tags) > .ui.container {
    > .list-header > .switch > .item {
      background-color: transparent !important;
      font-weight: 500;
      &.active {
        background: ${themeVars.github.bgColor.accent.emphasis} !important;
        color: ${themeVars.github.button.primary.fgColor.rest};
      }
    }
    > .divider {
      margin: 16px 0;
    }
    .release-list-buttons > .secondary.button {
      background-color: ${themeVars.color.button};
      border-color: ${themeVars.color.light.border};
      box-shadow: none;
      color: ${themeVars.color.text.light.self};
      &:hover {
        background-color: ${themeVars.color.hover.self};
      }
    }
  }
`;

const tagList = css`
  .page-content.repository.tags #tags-table {
    .release-tag-name {
      line-height: 1.5;
    }
    .download {
      color: ${themeVars.color.text.light.num1};
      font-size: 12px;
      svg {
        min-width: 12px;
        width: 12px;
      }
      a:hover {
        text-decoration: none;
      }
    }
  }
`;

const releaseList = css`
  .page-content.repository.releases ul#release-list {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin: 32px 0 16px;
    > li {
      .meta {
        gap: 0.5rem;
        padding-right: 24px;
        padding-top: 24px;
        text-align: left;
        a.muted {
          color: ${themeVars.color.text.light.num1};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          svg {
            margin-right: 8px !important;
          }
        }
        .ui.button.branch-dropdown-button {
          font-size: 12px;
          line-height: 20px;
          min-height: 20px;
          padding: 3px 12px;
        }
      }
      .release-title-wrap {
        background: ${themeVars.color.box.body.self};
        border: 1px solid ${themeVars.color.light.border};
        border-bottom: 0;
        border-radius: ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0 0;
        margin-left: 1rem;
        padding: 16px 16px 0;
        h4 {
          font-size: 32px;
          gap: 8px;
        }
      }
      .detail {
        background: ${themeVars.color.box.body.self};
        border: 1px solid ${themeVars.color.light.border};
        border-radius: 0 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius};
        border-top: 0;
        margin-left: 1rem;
        padding: 0 16px 16px;
        img.ui.avatar {
          border-radius: 9999px;
        }
        p.text.grey {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 24px 0 0;
          span {
            word-break: break-word;
          }
          .time {
            color: ${themeVars.color.text.self};
          }
        }
        .markup > :first-child {
          margin-top: 24px !important;
        }
        > .divider {
          left: -16px;
          margin: 24px 0 16px;
          position: relative;
          width: calc(100% + 32px);
        }
        .download {
          summary {
            font-size: 16px;
            font-weight: 600;
            margin-top: 16px;
          }
          .list {
            margin-top: 16px;
            > li {
              align-items: center;
              line-height: 17px;
              padding: 8px 16px;
              > a:hover {
                text-decoration: underline !important;
              }
            }
          }
        }
      }
    }
  }
`;

const releaseListMobile = css`
  @media (max-width: 767.98px) {
    .page-content.repository.releases ul#release-list > li {
      .meta {
        padding: 0;
      }
      :is(.release-title-wrap, .detail) {
        margin-left: 0;
      }
    }
  }
`;

export default cssCombine(releaseHeader, tagList, releaseList, releaseListMobile);

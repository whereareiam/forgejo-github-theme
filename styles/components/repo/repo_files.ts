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

// 文件列表页面下的分支按钮
const branchButton = css`
  .page-content.repository.file.list {
    .js-branch-tag-selector > .ui.dropdown.custom > .menu > .scrolling.menu {
      /* 显示默认分支的标签 */
      .ui.label {
        background-color: ${themeVars.color.menu};
        border: 1px solid ${themeVars.color.light.border};
        margin-top: 1px;
        margin-left: auto;
        margin-right: 20px; /* gitea 有 RSS 留出足够的空间 */
      }
    }
  }
`;
// 仓库同步派生
const syncFork = css`
  .page-content.repository.file.list {
    .repo-home-filelist > .ui.message {
      background: ${themeVars.color.box.header};
      padding: 8px 8px 8px 16px;
      margin: 16px 0px;
      .ui.button {
        min-width: 96px;
      }
    }
  }
`;
// 仓库文件列表
const repoFiles = css`
  /* 文件列表和提交列表的按钮组 */
  .repo-button-row {
    margin: 16px 0;
    .repo-button-row-right {
      /* 添加文件按钮 */
      .repo-add-file {
        padding: 0px 26px 0px 12px;
        .menu > .item {
          min-width: 128px;
          svg {
            margin-top: 0;
            margin-right: 4px !important;
          }
        }
      }
    }
  }
  .repository.file.list {
    #repo-files-table {
      margin: 16px 0;
      /* 头部最后一次提交 */
      .repo-file-line {
        padding-right: 16px;
        /* 父目录 */
        &.parent-link {
          gap: 0.5rem;
          padding-left: 16px;
          svg {
            margin-right: 2px;
          }
        }
      }
      /* 文件列表 */
      .repo-file-item {
        .repo-file-cell {
          height: 40px;
          &.name {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding-left: 16px;
          }
          &.age {
            padding-right: 16px;
          }
        }
      }
    }
    #readme {
      .file-header {
        background: ${themeVars.color.body};
        min-height: 48px;
        padding: 0px 8px !important;
        overflow-x: visible;
        svg {
          color: ${themeVars.color.text.light.num1};
        }
        .file-header-left {
          padding: 6px 8px !important;
          line-height: 1.45;
          /* 伪元素宽度等于按钮宽度而不是父元素宽度 */
          position: relative;
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover};
            border-radius: ${otherThemeVars.border.radius};
          }
          &:after {
            content: "";
            background: ${themeVars.github.underlineNav.borderColor.active};
            border-radius: ${otherThemeVars.border.radius};
            bottom: -8px;
            left: 0;
            height: 2px;
            position: absolute;
            width: 100%;
          }
          a.muted:hover {
            color: inherit;
            text-decoration-line: none;
          }
        }
        .file-header-right {
          .btn-octicon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0px 8px;
            border-radius: ${otherThemeVars.border.radius};
            height: 28px;
            width: 28px;
            &:hover {
              background: ${themeVars.github.control.transparent.bgColor.hover};
              box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
            }
          }
        }
      }
    }
  }
`;
// 手机下隐藏提交信息
const repoFilesMobile = css`
  @media (max-width: 767.98px) {
    #repo-files-table {
      grid-template-columns: 1fr auto;
      .repo-file-line {
        grid-column: 1 / span 2;
      }
      .repo-file-cell {
        &.name {
          max-width: none;
        }
        &.message {
          display: none;
        }
      }
    }
  }
`;

export default cssCombine(branchButton, syncFork, repoFiles, repoFilesMobile);

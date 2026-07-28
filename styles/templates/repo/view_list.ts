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

const repoFileLastCommit = css`
  /* 仓库页和文件列表文件夹页的最后一次提交 */
  .repository.file.list #repo-files-table .gitea-github-theme-templates.repo-file-line.repo-file-last-commit {
    padding-right: 10px;
    /* 提交时间 */
    .gitea-github-theme-latest-time {
      color: ${themeVars.color.text.light.num1};
      font-size: 12px;
    }
    /* 提交历史按钮 */
    .gitea-github-theme-latest-commit {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border-radius: ${otherThemeVars.border.radius};
      padding: 0px 8px;
      min-height: 28px;
      height: 28px;
      font-size: 12px;
      font-weight: 500;
      &:hover {
        background-color: ${themeVars.github.control.transparent.bgColor.hover};
        box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
        color: inherit;
        text-decoration-line: none;
      }
      svg {
        color: ${themeVars.github.button.invisible.iconColor.rest};
      }
    }
  }
`;

const repoFileList = css`
  #repo-files-table {
    width: 100%;
    display: grid;
    grid-template-columns: 2fr 3fr auto;
    border: 1px solid ${themeVars.color.secondary.self};
    background: ${themeVars.color.box.body.self};
    border-radius: ${otherThemeVars.border.radius};
    margin: 10px 0;
  }

  @media (max-width: 767.98px) {
    #repo-files-table {
      grid-template-columns: auto 1fr auto;
    }
  }

  #repo-files-table .repo-file-item {
    display: contents;
  }

  #repo-files-table .repo-file-item:hover > .repo-file-cell,
  #repo-files-table .parent-link:hover {
    background: ${themeVars.color.hover.opaque};
  }

  #repo-files-table .repo-file-line,
  #repo-files-table .repo-file-cell {
    border-top: 1px solid ${themeVars.color.secondary.self};
    padding: 8px 10px;
  }

  #repo-files-table .repo-file-line:first-child {
    border-top: none;
    border-radius: ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0 0;
  }

  #repo-files-table .repo-file-item:last-child .repo-file-cell:first-child {
    border-bottom-left-radius: calc(${otherThemeVars.border.radius} - 1px);
  }

  #repo-files-table .repo-file-item:last-child .repo-file-cell:last-child {
    border-bottom-right-radius: calc(${otherThemeVars.border.radius} - 1px);
  }

  #repo-files-table .repo-file-line {
    grid-column: 1 / span 3;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  #repo-files-table .repo-file-last-commit {
    min-width: 0;
    background: ${themeVars.color.box.header};
  }

  #repo-files-table .repo-file-cell.name {
    display: flex;
    align-items: center;
    gap: 0.5em;
    overflow: hidden;
  }

  #repo-files-table .repo-file-cell.name > a,
  #repo-files-table .repo-file-cell.name > span {
    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  #repo-files-table .repo-file-cell.name .entry-name {
    flex-shrink: 1;
    min-width: 1ch;
  }

  @media (max-width: 767.98px) {
    #repo-files-table .repo-file-cell.name {
      max-width: 35vw;
    }
  }

  #repo-files-table .repo-file-cell.message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${themeVars.color.text.light.num1};
  }

  #repo-files-table .repo-file-cell.age {
    text-align: right;
    white-space: nowrap;
    color: ${themeVars.color.text.light.num1};
  }

  #repo-files-table .repo-file-cell.notready.message .loader {
    width: 16px;
    height: 16px;
  }
`;

export default cssCombine(repoFileLastCommit, repoFileList);

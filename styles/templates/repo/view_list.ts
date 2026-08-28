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
  .repository.file.list #repo-files-table .gitea-github-theme-templates.repo-file-line.repo-file-last-commit {
    gap: 0;
    min-height: 52px;
    padding: 4px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-row {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    min-height: 44px;
    min-width: 0;
    padding: 8px;
    width: 100%;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-row > .sr-only {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-primary {
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    gap: 8px;
    min-width: 0;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-attribution {
    align-items: center;
    display: flex;
    flex: 0 1 auto;
    min-width: 0;
    position: relative;
    white-space: nowrap;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-avatar {
    align-items: center;
    border-radius: 9999px;
    display: flex;
    flex: 0 0 20px;
    height: 20px;
    outline: none;
    width: 20px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-avatar:focus-visible {
    outline: 2px solid ${themeVars.github.fgColor.accent};
    outline-offset: 2px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-avatar > img.ui.avatar {
    border-radius: 9999px;
    flex: 0 0 auto;
    height: 20px;
    margin: 0;
    width: 20px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-author {
    color: ${themeVars.color.text.self};
    display: block;
    margin-left: 8px;
    max-width: 125px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .repository.file.list #repo-files-table a.repo-latest-commit-author:hover {
    color: ${themeVars.color.text.self};
    text-decoration: underline;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-author-card {
    background: ${themeVars.color.menu};
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    bottom: calc(100% + 12px);
    box-shadow: ${themeVars.github.shadow.floating.small};
    box-sizing: border-box;
    color: ${themeVars.color.text.self};
    left: 0;
    opacity: 0;
    padding: 16px;
    pointer-events: none;
    position: absolute;
    transform: translateY(4px);
    transition:
      opacity 120ms ease 300ms,
      transform 120ms ease 300ms,
      visibility 0s linear 420ms;
    visibility: hidden;
    white-space: normal;
    width: min(360px, calc(100vw - 32px));
    z-index: 100;
  }

  .repository.file.list
    #repo-files-table
    .repo-latest-commit-attribution:has(
      > .repo-latest-commit-avatar:hover,
      > .repo-latest-commit-author:hover,
      > .repo-latest-commit-author-card:hover
    )
    > .repo-latest-commit-author-card {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
    transition-delay: 300ms;
    visibility: visible;
  }

  .repository.file.list
    #repo-files-table
    .repo-latest-commit-attribution:has(> .repo-latest-commit-avatar:focus, > .repo-latest-commit-author:focus)
    > .repo-latest-commit-author-card {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
    transition-delay: 0s;
    visibility: visible;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-author-card::after {
    bottom: -12px;
    content: "";
    height: 12px;
    left: 0;
    position: absolute;
    width: 140px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-author-card-profile {
    align-items: center;
    display: flex;
    gap: 12px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-author-card-profile img.ui.avatar {
    border-radius: 9999px;
    flex: 0 0 48px;
    height: 48px;
    margin: 0;
    width: 48px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-author-card-identity {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-author-card-context {
    align-items: center;
    color: ${themeVars.color.text.light.num1};
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-author-card-context svg {
    flex: 0 0 auto;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-message {
    align-items: center;
    display: flex;
    flex: 1 1 auto;
    gap: 8px;
    height: 28px;
    min-width: 0;
    position: relative;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-message > .message-wrapper {
    color: ${themeVars.color.text.light.num1};
    display: block;
    flex: 1 1 auto;
    line-height: 21px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-message > .message-wrapper a {
    color: inherit;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-message > .message-wrapper a:hover {
    color: ${themeVars.github.fgColor.accent};
    text-decoration: underline;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-details,
  .repository.file.list #repo-files-table .repo-latest-commit-signature,
  .repository.file.list #repo-files-table .repo-latest-commit-status > :first-child {
    align-items: center;
    background: transparent !important;
    border: 1px solid transparent !important;
    border-radius: ${otherThemeVars.border.radius};
    box-shadow: none !important;
    color: ${themeVars.color.text.light.num1};
    display: inline-flex;
    flex: 0 0 28px;
    height: 28px;
    justify-content: center;
    margin: 0;
    padding: 5px;
    width: 28px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-details:hover,
  .repository.file.list #repo-files-table .repo-latest-commit-signature:hover,
  .repository.file.list #repo-files-table .repo-latest-commit-status > :first-child:hover {
    background: ${themeVars.github.control.transparent.bgColor.hover} !important;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-details svg,
  .repository.file.list #repo-files-table .repo-latest-commit-signature svg,
  .repository.file.list #repo-files-table .repo-latest-commit-status svg {
    color: currentcolor;
    height: 16px;
    margin: 0;
    width: 16px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-signature .signature {
    align-items: center;
    background: transparent !important;
    border: 0 !important;
    display: flex;
    height: 16px;
    justify-content: center;
    padding: 0;
    width: 16px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-signature .signature img {
    display: none;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-status {
    display: inline-flex;
    flex: 0 0 28px;
    height: 28px;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-message > .commit-body {
    background: ${themeVars.color.menu};
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    box-shadow: ${themeVars.github.shadow.floating.small};
    box-sizing: border-box;
    margin: 4px 0 0;
    max-width: min(480px, calc(100vw - 32px));
    padding: 12px;
    position: absolute;
    right: 0;
    top: 100%;
    white-space: pre-wrap;
    z-index: 100;
  }

  .repository.file.list #repo-files-table .repo-latest-commit-actions {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    gap: 8px;
  }

  .repository.file.list #repo-files-table .gitea-github-theme-latest-time {
    align-items: center;
    color: ${themeVars.color.text.light.num1};
    display: flex;
    font-size: 12px;
    gap: 4px;
    height: 28px;
    line-height: 18px;
    white-space: nowrap;
  }

  .repository.file.list #repo-files-table .gitea-github-theme-latest-commit {
    align-items: center;
    border-radius: ${otherThemeVars.border.radius};
    display: inline-flex;
    font-size: 12px;
    font-weight: 500;
    gap: 4px;
    height: 28px;
    margin: 0;
    min-height: 28px;
    padding: 0 8px;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .repository.file.list #repo-files-table .gitea-github-theme-latest-commit b {
    font-weight: 500;
  }

  .repository.file.list #repo-files-table .gitea-github-theme-latest-commit:hover {
    background: ${themeVars.github.control.transparent.bgColor.hover};
    color: inherit;
    text-decoration: none;
  }

  .repository.file.list #repo-files-table .gitea-github-theme-latest-commit svg {
    color: ${themeVars.github.button.invisible.iconColor.rest};
  }

  @media (max-width: 1011.98px) {
    .repository.file.list #repo-files-table .gitea-github-theme-latest-commit {
      justify-content: center;
      padding: 0;
      width: 28px;
    }

    .repository.file.list #repo-files-table .gitea-github-theme-latest-commit > span {
      display: none;
    }
  }

  @media (max-width: 767.98px) {
    .repository.file.list #repo-files-table .repo-latest-commit-message,
    .repository.file.list #repo-files-table .gitea-github-theme-latest-time {
      display: none;
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

  #repo-files-table .repo-file-cell.name > svg {
    color: ${themeVars.color.text.light.num1};
    flex: 0 0 auto;
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
      max-width: none;
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

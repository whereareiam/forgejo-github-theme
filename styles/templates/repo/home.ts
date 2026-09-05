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

const repositoryHome = css`
  /*
 * Repository overview grid and sidebar placement. Only repository roots
 * receive the sidebar class; directories, files, and blame pages remain
 * full-width.
 */
  .page-content.repository.file.list .repo-grid-filelist-sidebar {
    display: grid;
    column-gap: 40px;
    row-gap: 16px;
    grid-template-columns: minmax(0, 1fr) 272px;
    grid-template-rows: auto auto 1fr;
  }

  .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) > .ui.container,
  .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) > .repository-content-header > .ui.container {
    width: calc(100% - 64px);
    max-width: 1216px;
    margin-left: auto;
    margin-right: auto;
  }
  .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) > .repository-content-header > .ui.container {
    padding-bottom: 18px;
  }
  .page-content.repository.file.list .repo-home-sidebar-top .repo-home-sidebar-header {
    margin-top: 0;
    line-height: 24px;
  }
  .page-content.repository.file.list .repo-home-sidebar-top .repo-description {
    font-size: 16px;
    line-height: 24px;
  }
  .page-content.repository.file.list .repo-code-search {
    border-top: 1px solid ${themeVars.color.light.border};
    margin-top: 16px;
  }
  .page-content.repository.file.list .repo-code-search > summary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    cursor: pointer;
  }
  .page-content.repository.file.list .repo-code-search > form {
    padding: 0 16px 16px;
  }
  .page-content.repository.file.list .repo-home-filelist {
    grid-column: 1;
    grid-row: 1 / 4;
    min-width: 0;
  }

  .page-content.repository.file.list .repo-home-sidebar-top {
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
  }

  .page-content.repository.file.list .repo-home-sidebar-bottom {
    grid-column: 2;
    grid-row: 2;
    min-width: 0;
  }

  .page-content.repository.file.list .flex-relaxed-list {
    display: flex;
    flex-direction: column;
    gap: ${otherThemeVars.gap.block};
  }

  .page-content.repository.file.list .flex-relaxed-list > .divider {
    margin: 0;
  }

  .page-content.repository.file.list .repo-home-sidebar-top,
  .page-content.repository.file.list .repo-home-sidebar-bottom {
    padding-left: 0;
  }

  .page-content.repository.file.list .repo-home-sidebar-header {
    font-size: 16px;
    font-weight: var(--font-weight-semibold);
    margin-top: 0.5em;
  }

  .page-content.repository.file.list .repo-home-sidebar-top .repo-description {
    line-height: 1.5;
  }

  .page-content.repository.file.list .repo-home-sidebar-website {
    min-width: 0;
  }

  .page-content.repository.file.list .repo-home-sidebar-website > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .page-content.repository.file.list .repo-home-sidebar-metadata {
    gap: 2px;
  }

  .page-content.repository.file.list .repo-home-sidebar-metadata .flex-text-block {
    min-height: 22px;
  }

  .page-content.repository.file.list .repo-home-sidebar-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .page-content.repository.file.list .language-stats {
    border-radius: 5px;
    display: flex;
    gap: 2px;
    height: 10px;
    margin: 5px 0;
    overflow: hidden;
    padding: 0;
    white-space: nowrap;
    width: 100%;
  }

  .page-content.repository.file.list .language-stats-details {
    column-gap: 12px;
    display: flex;
    flex-wrap: wrap;
  }

  .page-content.repository.file.list .language-stats-details .item {
    align-items: center;
    display: flex;
    gap: 0;
    height: 30px;
    justify-content: center;
    padding: 0;
    text-decoration: none;
  }

  .page-content.repository.file.list .language-stats-details .color-icon {
    border-radius: 50%;
    display: inline-block;
  }

  @media (max-width: 767.98px) {
    .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) > .repository-content-header > .ui.container {
      border-bottom: 0;
      padding-bottom: 0;
    }
    .page-content.repository.file.list
      .repo-home-sidebar-metadata
      > a:has(:is(.octicon-star, .octicon-repo-forked, .octicon-eye)) {
      text-transform: lowercase;
    }

    .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) .repo-header > .flex-item {
      display: none;
    }
    .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) .repo-header > .repo-buttons > a[href$=".rss"] {
      display: none;
    }
    .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) #watch-button .text.not-mobile,
    .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) a[href$="/fork"] .text.not-mobile {
      display: inline !important;
    }
    .page-content.repository.file.list .repo-about-heading {
      display: none;
    }
    .page-content.repository.file.list .repo-home-sidebar-metadata {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 8px 16px;
    }
    .page-content.repository.file.list .repo-home-sidebar-metadata > a:has(.octicon-book),
    .page-content.repository.file.list .repo-home-sidebar-metadata > div:has(.octicon-database) {
      display: none;
    }
    .page-content.repository.file.list .repo-home-sidebar-metadata > a:has(.octicon-star) {
      order: 1;
    }
    .page-content.repository.file.list .repo-home-sidebar-metadata > a:has(.octicon-repo-forked) {
      order: 2;
    }
    .page-content.repository.file.list .repo-home-sidebar-metadata > a:has(.octicon-eye) {
      order: 3;
    }
    .page-content.repository.file.list .repo-mobile-summary {
      display: flex;
      order: 4;
      gap: 16px;
    }
    .page-content.repository.file.list .repo-home-sidebar-metadata > a:has(.octicon-pulse) {
      order: 5;
    }
    .page-content.repository.file.list .repo-mobile-visibility {
      display: flex;
      align-items: center;
      gap: 8px;
      order: 6;
      width: 100%;
      color: ${themeVars.color.text.light.num1};
    }
    .page-content.repository.file.list .repo-home-sidebar-top {
      padding-bottom: 16px;
      border-bottom: 1px solid ${themeVars.color.light.border};
    }
    .page-content.repository.file.list .repo-button-row {
      position: relative;
      flex-wrap: nowrap;
      align-items: center;
    }
    .page-content.repository.file.list .repo-button-row > .repo-button-row-left,
    .page-content.repository.file.list .repo-button-row > .repo-button-row-right {
      width: auto;
    }
    .page-content.repository.file.list .repo-button-row > .repo-button-row-left {
      flex-grow: 0;
    }
    .page-content.repository.file.list .repo-button-row > .repo-button-row-left > .js-branch-tag-selector {
      flex: 0 0 auto;
    }
    .page-content.repository.file.list .repo-button-row .repository-summary,
    .page-content.repository.file.list .repo-button-row .repo-find-file,
    .page-content.repository.file.list .repo-button-row .repo-add-file {
      display: none;
    }
    .page-content.repository.file.list .repo-code-dropdown {
      position: static;
    }
    .page-content.repository.file.list .repo-button-row .repo-code-dropdown > .content {
      left: 0;
      right: 0;
      top: 100%;
      width: auto;
    }
    .page-content.repository.file.list .repo-code-dropdown > summary > span {
      display: none;
    }
    .page-content.repository.file.list .repo-mobile-actions {
      order: 2;
    }

    .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) > .ui.container,
    .page-content.repository.file.list:has(.repo-grid-filelist-sidebar) > .repository-content-header > .ui.container {
      width: calc(100% - 32px);
    }
    .page-content.repository.file.list .repo-grid-filelist-sidebar {
      grid-template-columns: 100%;
      grid-template-rows: auto auto auto;
    }

    .page-content.repository.file.list .repo-home-filelist {
      grid-column: 1;
      grid-row: 2;
    }

    .page-content.repository.file.list .repo-grid-filelist-sidebar .repo-home-sidebar-top {
      grid-column: 1;
      grid-row: 1;
      padding-left: 0;
    }

    .page-content.repository.file.list .repo-grid-filelist-sidebar .repo-home-sidebar-bottom {
      grid-column: 1;
      grid-row: 3;
      padding-left: 0;
    }
  }
`;

export default cssCombine(repositoryHome);

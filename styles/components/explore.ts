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

import { css, cssCombine, customThemeVars, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";
import { fallbackVar } from "@vanilla-extract/css";

const userRepoColumns = fallbackVar(customThemeVars.userRepolistColumns, "2");
const exploreRepoColumns = fallbackVar(customThemeVars.explore.repolistColumns, "2");
const orgRepoColumns = fallbackVar(customThemeVars.org.repolistColumns, "1");
const exploreUserColumns = fallbackVar(customThemeVars.explore.userlistColumns, "3");
const orgUserColumns = fallbackVar(customThemeVars.org.userlistColumns, "2");

const repositoryList = css`
  :is(
      .page-content.organization.profile > .ui.container > .ui.stackable > .ui.eleven,
      .page-content.user.profile > .ui.container > .ui.stackable > .ui.twelve,
      .page-content.explore.repositories > .ui.container
    )
    > .flex-list:not(#activity-feed) {
    display: grid;
    > .flex-item {
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius};
      padding: 16px;
      > .flex-item-leading :is(img, svg) {
        color: ${themeVars.color.text.light.num1};
      }
      > .flex-item-main {
        > .flex-item-header {
          > .flex-item-title {
            gap: 8px;
          }
          > .flex-item-trailing {
            color: ${themeVars.color.text.light.num1};
            font-size: 12px;
            gap: 16px;
            .color-icon {
              width: 12px;
              height: 12px;
              margin-right: 0 !important;
            }
          }
        }
        > .flex-item-body {
          margin-top: 8px;
          &:last-child {
            font-size: 12px;
          }
        }
        > .repo-topics {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 8px;
        }
      }
    }
  }

  .page-content.organization.profile > .ui.container > .ui.stackable > .ui.eleven > .flex-list {
    grid-template-columns: repeat(${orgRepoColumns}, minmax(0, 1fr));
    gap: min(calc(${orgRepoColumns} * 8px), 16px);
  }
  .page-content.user.profile > .ui.container > .ui.stackable > .ui.twelve > .flex-list:not(#activity-feed) {
    grid-template-columns: repeat(${userRepoColumns}, minmax(0, 1fr));
    gap: min(calc(${userRepoColumns} * 8px), 16px);
  }
  .page-content.explore.repositories > .ui.container > .flex-list {
    grid-template-columns: repeat(${exploreRepoColumns}, minmax(0, 1fr));
    gap: min(calc(${exploreRepoColumns} * 8px), 16px);
  }
`;

const userList = css`
  :is(.page-content.organization.members > .ui.container, .page-content.explore.users > .ui.container) > .flex-list {
    display: grid;
    > .flex-item {
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius};
      padding: 16px;
      > .flex-item-main {
        > .flex-item-title {
          gap: 8px;
          margin-bottom: 8px;
          > .label {
            font-size: 12px;
          }
        }
        > .flex-item-body {
          font-size: 12px;
          svg {
            width: 12px;
            min-width: 12px;
          }
        }
      }
    }
  }

  .page-content.organization.members > .ui.container > .flex-list {
    grid-template-columns: repeat(${orgUserColumns}, minmax(0, 1fr));
    gap: min(calc(${orgUserColumns} * 8px), 16px);
  }
  .page-content.explore.users > .ui.container > .flex-list {
    grid-template-columns: repeat(${exploreUserColumns}, minmax(0, 1fr));
    gap: min(calc(${exploreUserColumns} * 8px), 16px);
  }
`;

const emptyList = css`
  :is(
      .page-content.organization.profile > .ui.container > .ui.stackable > .ui.eleven,
      .page-content.user.profile > .ui.container > .ui.stackable > .ui.twelve,
      .page-content.explore.repositories > .ui.container,
      .page-content.organization.members > .ui.container,
      .page-content.explore.users > .ui.container
    )
    > .flex-list:has(> div:only-child):not(:has(.flex-item-main)) {
    grid-template-columns: 1fr;
    > div {
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius};
      display: flex;
      font-size: 16px;
      font-weight: 500;
      justify-content: center;
      padding: 32px;
    }
  }
`;

const mobileList = css`
  @media (max-width: 767.98px) {
    :is(
        .page-content.organization.profile > .ui.container > .ui.stackable > .ui.eleven,
        .page-content.user.profile > .ui.container > .ui.stackable > .ui.twelve,
        .page-content.explore.repositories > .ui.container,
        .page-content.organization.members > .ui.container,
        .page-content.explore.users > .ui.container
      )
      > .flex-list:not(#activity-feed) {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
`;

export default cssCombine(repositoryList, userList, emptyList, mobileList);

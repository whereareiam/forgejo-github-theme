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

/* GitHub's package page (templates/package/view.tmpl): the heading, a main column of boxes and a 296px sidebar. */
const packageView = css`
  .theme-package-header {
    margin: 0 0 24px;
    > h1 {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 32px;
      font-weight: 600;
      line-height: 40px;
      overflow-wrap: anywhere;
    }
    > p {
      margin: 4px 0 0;
      color: ${themeVars.color.text.light.num1};
      font-size: 14px;
      line-height: 20px;
    }
  }
  .theme-package-header-icon {
    display: inline-flex;
    color: ${themeVars.color.text.light.num1};
  }
  .theme-package-header-version {
    color: ${themeVars.color.text.light.num1};
    font-size: 24px;
    font-weight: 400;
    line-height: 30px;
  }
  .theme-package-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 296px;
    gap: 24px;
    align-items: start;
  }
  /* Each package type's sections (installation, about, dependencies) as GitHub boxes: a header row over the body. */
  .theme-package-main {
    min-width: 0;
    > .ui.top.attached.header {
      margin: 0;
      padding: 16px;
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0 0;
      background: ${themeVars.color.box.header};
      color: ${themeVars.color.text.self};
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
    }
    > .ui.attached.segment {
      width: 100%;
      max-width: 100%;
      margin: 0 0 16px;
      padding: 16px;
      border: 1px solid ${themeVars.color.light.border};
      border-top: 0;
      border-radius: 0 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius};
      background: ${themeVars.color.box.body.self};
      color: ${themeVars.color.text.self};
      font-size: 14px;
      line-height: 20px;
      > :last-child {
        margin-bottom: 0;
      }
    }
    /* GitHub's install box: a small muted line with its icon over each command. */
    .ui.form .field {
      margin: 0 0 16px;
      &:last-child {
        margin-bottom: 0;
      }
      > label {
        display: block;
        margin: 0 0 8px;
        color: ${themeVars.color.text.light.num1};
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        > .svg {
          margin-right: 4px;
          vertical-align: text-bottom;
        }
      }
      &:last-child > label {
        margin: 0;
      }
    }
    .markup pre.code-block {
      margin: 0;
      padding: 8px 16px;
      border: 0;
      border-radius: ${otherThemeVars.border.radius};
      background: ${themeVars.color.markup.code.block};
      font-size: 12px;
      line-height: 20px;
    }
  }
  /* The sidebar's sections are split by a rule, each under a 16px title. */
  .theme-package-sidebar {
    min-width: 0;
    > section + section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid ${themeVars.color.light.border};
    }
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }
  }
  .theme-package-details > .item {
    margin: 0 0 8px;
    color: ${themeVars.color.text.light.num1};
    font-size: 14px;
    line-height: 20px;
    overflow-wrap: anywhere;
    &:last-child {
      margin-bottom: 0;
    }
    > :is(.svg, img) {
      vertical-align: text-bottom;
    }
    > img {
      border-radius: 50%;
    }
    a {
      color: ${themeVars.color.text.light.num1};
      &:hover {
        color: ${themeVars.color.primary.self};
      }
    }
    > a.theme-package-owner {
      color: ${themeVars.color.text.self};
      font-weight: 600;
    }
  }
  /* GitHub's figures: a small muted label over a 20px value. */
  .theme-package-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    span {
      color: ${themeVars.color.text.light.num1};
      font-size: 12px;
      line-height: 18px;
    }
    strong {
      font-size: 20px;
      font-weight: 600;
      line-height: 25px;
    }
  }
  .theme-package-assets,
  .theme-package-versions {
    margin: 0;
    padding: 0;
    list-style: none;
    > li {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 8px;
      font-size: 14px;
      line-height: 20px;
      > a {
        flex: 1;
        min-width: 0;
      }
      > span {
        flex: none;
        color: ${themeVars.color.text.light.num1};
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
  .theme-package-assets > li {
    > .svg {
      flex: none;
      color: ${themeVars.color.text.light.num1};
    }
    > a {
      overflow-wrap: anywhere;
    }
  }
  /* The version on display is marked, as GitHub marks the current one. */
  .theme-package-versions > li[aria-current] > a {
    color: ${themeVars.color.text.self};
    font-weight: 600;
  }
  .theme-package-versions-all {
    display: inline-block;
    font-size: 14px;
    line-height: 20px;
  }
`;

/* GitHub's versions page (templates/user/profile_package_versions.tmpl): a breadcrumb, the Versions subhead, and the
   box list of versions with their downloads. */
const packageVersions = css`
  .theme-package-breadcrumb {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin: 0 0 8px;
    color: ${themeVars.color.text.light.num1};
    font-size: 14px;
    line-height: 20px;
    > a[aria-current] {
      color: ${themeVars.color.text.self};
    }
  }
  .theme-package-subhead {
    margin: 0 0 16px;
    padding: 0 0 8px;
    border-bottom: 1px solid ${themeVars.color.light.border};
    font-size: 24px;
    font-weight: 400;
    line-height: 36px;
  }
  .theme-package-version-list {
    .theme-box-list-title {
      display: flex;
      align-items: center;
      gap: 8px;
      > .svg {
        color: ${themeVars.color.text.light.num1};
      }
    }
    .theme-box-list-row h3 {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
    }
  }
  .theme-package-downloads {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 4px;
    color: ${themeVars.color.text.light.num1};
    font-size: 12px;
    line-height: 18px;
    white-space: nowrap;
  }
`;

/* A package's settings (templates/package/settings.tmpl) keep GitHub's 980px settings column without the nav, also
   under an organization's header, whose page width rule this outranks. */
const packageSettings = css`
  :is(.organization-global-header ~ .page-content, .page-content).theme-package-settings
    > .ui.container:is(.theme-settings-context-container, .theme-settings) {
    width: calc(100% - 32px) !important;
    max-width: 980px !important;
  }
`;

const packageMobile = css`
  @media (max-width: 1011.98px) {
    .theme-package-layout {
      grid-template-columns: minmax(0, 1fr) 240px;
    }
  }
  @media (max-width: 767.98px) {
    .theme-package-header > h1 {
      font-size: 24px;
      line-height: 30px;
    }
    .theme-package-header-version {
      font-size: 20px;
      line-height: 25px;
    }
    .theme-package-layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;

export default cssCombine(packageView, packageVersions, packageSettings, packageMobile);

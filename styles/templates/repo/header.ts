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

const repositoryHeader = css`
  /*
 * GitHub's repository header has two navigation rows: the repository
 * breadcrumb shares the global navbar, then the repository tabs occupy a
 * full-width row using the same navbar background. The template separates the
 * repository title and actions from the tabs while retaining native routes and
 * controls.
 */
  #navbar.repository-navbar {
    border-bottom: 0;
    box-sizing: border-box;
    height: 52px;
    min-height: 52px;
    padding-bottom: 4px;
    padding-top: 16px;
  }

  #navbar.repository-navbar .navbar-left,
  #navbar.repository-navbar .navbar-right {
    height: 32px;
    min-height: 32px;
  }

  #navbar.repository-navbar .navbar-left {
    gap: 8px;
  }

  #navbar.repository-navbar .navbar-left > #navbar-logo.item {
    box-sizing: border-box;
    flex: none;
    height: 32px;
    min-height: 32px;
    min-width: 32px;
    padding: 0;
    width: 32px;
  }

  #navbar .repository-navbar-breadcrumb {
    align-items: center;
    display: flex;
    gap: 0;
    height: 32px;
    min-width: 0;
  }

  #navbar .repository-navbar-breadcrumb a {
    align-items: center;
    border-radius: ${otherThemeVars.border.radius};
    box-sizing: border-box;
    color: ${themeVars.color.nav.text};
    display: flex;
    height: 32px;
    line-height: 24px;
    padding: 4px 6px;
    text-decoration: none;
  }

  #navbar .repository-navbar-breadcrumb a:hover {
    background: ${themeVars.color.nav.hoverBg};
  }

  #navbar .repository-navbar-owner {
    gap: 8px;
  }

  #navbar .repository-navbar-owner img {
    border-radius: 9999px;
    height: 16px;
    margin: 0 !important;
    width: 16px;
  }

  #navbar .repository-navbar-breadcrumb > a.repository-navbar-name {
    font-weight: 600;
    padding: 4px;
  }

  #navbar .repository-navbar-separator {
    align-items: center;
    box-sizing: border-box;
    color: transparent;
    display: flex;
    flex: none;
    font-size: 0;
    height: 32px;
    justify-content: center;
    margin: 0 7px;
    width: 1px;
  }

  #navbar .repository-navbar-separator::after {
    border-right: 1px solid ${themeVars.color.text.light.num1};
    content: "";
    height: 20px;
    transform: rotate(15deg);
  }

  .repository-tab-nav.page-content.repository {
    background: ${themeVars.color.nav.bg};
    box-sizing: border-box;
    flex: none;
    height: 48px;
    margin-bottom: 0;
    min-height: 48px;
    width: 100%;
  }

  .repository-tab-nav.page-content.repository > .secondary-nav {
    background: ${themeVars.color.nav.bg} !important;
    box-sizing: border-box;
    height: 48px;
    margin-bottom: 0;
    min-height: 48px;
    padding-top: 0;
  }

  .repository-tab-nav.page-content.repository > .secondary-nav > overflow-menu.ui.container {
    box-sizing: border-box;
    height: 48px;
    margin-left: 0 !important;
    margin-right: 0 !important;
    max-width: none;
    min-height: 48px;
    padding-bottom: 0;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px !important;
    width: 100%;
  }

  .repository-tab-nav.page-content.repository .ui.secondary.pointing.menu .overflow-menu-items {
    align-items: flex-start;
    gap: 8px;
    height: 40px;
  }

  .repository-tab-nav.page-content.repository .ui.secondary.pointing.menu .overflow-menu-items > .item {
    border-bottom: 0 !important;
    box-sizing: border-box;
    height: 32px;
    line-height: 21px;
    margin: 0 0 8px !important;
    min-height: 32px;
    padding: 6px 8px !important;
  }

  .repository-tab-nav.page-content.repository > .secondary-nav > .ui.tabs.divider {
    border-top-color: ${themeVars.color.light.border};
    margin: -1px 0 0;
  }

  .page-content.repository > .repository-content-header {
    border-bottom: 0;
    margin-bottom: 24px;
    margin-top: 0;
    padding: 20px 0 0;
  }

  .page-content.repository > .repository-content-header > .ui.container {
    border-bottom: 1px solid ${themeVars.color.light.border};
    padding-bottom: 20px;
  }

  .page-content.repository > .secondary-nav {
    padding-top: 0;
  }

  .page-content.repository .repo-header {
    align-items: center;
    margin-bottom: 0;
    padding: 1em 0 0.25em;
  }

  .page-content.repository > .repository-content-header .repo-header {
    padding: 0;
  }

  .page-content.repository > .repository-content-header .repository-content-owner-avatar {
    display: flex;
  }

  .page-content.repository > .repository-content-header .repository-content-owner-avatar img {
    border-radius: 9999px;
    height: 24px;
    margin: 0 !important;
    width: 24px;
  }

  .page-content.repository .repo-header > .flex-item > .flex-item-main > .flex-item-title {
    align-items: center;
    color: ${themeVars.color.text.light.num1};
    font-size: 18px;
  }

  .page-content.repository .repo-header > .flex-item > .flex-item-main > .flex-item-title > a {
    align-items: center;
    border-radius: ${otherThemeVars.border.radius};
    color: ${themeVars.color.text.self};
    display: flex;
    font-size: 18px;
    margin-bottom: 8px;
    margin-top: 8px;
    min-width: 3ch;
    padding: 0 6px;
    text-decoration: none !important;
  }

  .page-content.repository
    > .repository-content-header
    .repo-header
    > .flex-item
    > .flex-item-main
    > .flex-item-title
    > a {
    background: transparent;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    padding: 0;
  }

  .page-content.repository
    > .repository-content-header
    .repo-header
    > .flex-item
    > .flex-item-main
    > .flex-item-title
    > a:hover {
    background: transparent;
    text-decoration: underline !important;
  }

  .page-content.repository .repo-header > .flex-item > .flex-item-main > .flex-item-title > a:hover {
    background: ${themeVars.github.control.transparent.bgColor.hover};
  }

  .page-content.repository .repo-header > .flex-item > .flex-item-trailing > .ui.label {
    background: ${themeVars.color.button};
    border: 1px solid ${themeVars.color.light.border};
    color: ${themeVars.color.text.light.self};
  }

  .page-content.repository > .repository-content-header .repo-header > .flex-item > .flex-item-trailing > .ui.label {
    background: transparent;
  }

  .page-content.repository
    > .repository-content-header
    .repo-header
    > .flex-item
    > .flex-item-trailing
    > .ui.label.repository-visibility-label {
    color: ${themeVars.color.text.light.num1};
  }

  .page-content.repository > .secondary-nav > .ui.tabs.divider {
    border-top-color: ${themeVars.color.light.border};
    margin-bottom: 12px;
    margin-top: -1px;
  }

  /*
 * The current theme draws the active repository-tab indicator on a child
 * span, but Forgejo 15 renders these labels as bare text. Reuse the otherwise
 * hidden Fomantic item pseudo-element with the theme's exact indicator
 * geometry so the coral line meets the neutral divider instead of leaving a
 * plain full-width separator. Counter labels must not inherit the newer
 * span-based indicator.
 */
  .page-content.repository > .secondary-nav .ui.secondary.pointing.menu .active.item::after {
    background: ${themeVars.github.underlineNav.borderColor.active};
    border: 0;
    border-radius: ${otherThemeVars.border.radius};
    bottom: -8px;
    content: "";
    display: block;
    height: 2px;
    left: 0;
    margin: 0;
    position: absolute;
    right: auto;
    top: auto;
    transform: none;
    transition: none;
    visibility: visible;
    width: 100%;
    z-index: 1;
  }

  .page-content.repository > .secondary-nav .ui.secondary.pointing.menu .active.item > .ui.label::after {
    content: none;
  }

  /* Forgejo's labeled wrappers otherwise retain extra line-box height around 28px controls. */
  .page-content.repository .repo-buttons.button-row {
    align-items: center;
    gap: 8px;
  }
  .page-content.repository .repo-buttons.button-row > form,
  .page-content.repository .repo-buttons.button-row > details,
  .page-content.repository .repo-buttons.button-row .ui.labeled.button {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    height: 28px;
    min-height: 28px;
    margin: 0;
    padding: 0;
    line-height: 20px;
  }
  .page-content.repository .repo-buttons.button-row .ui.labeled.button > .ui.button,
  .page-content.repository .repo-buttons.button-row .ui.labeled.button > .ui.label,
  .page-content.repository .repo-buttons.button-row > a.ui.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 28px;
    min-height: 28px;
    padding-top: 3px;
    padding-bottom: 3px;
    font-size: 12px;
    line-height: 20px;
  }
  .page-content.repository .repo-buttons.button-row .ui.labeled.button > .ui.button > .text {
    line-height: 20px;
  }
  .page-content.repository .repo-buttons.button-row .ui.labeled.button > .ui.button > svg,
  .page-content.repository .repo-buttons.button-row > a.ui.button > svg {
    display: block;
    margin-top: 0;
    margin-bottom: 0;
    top: auto;
  }

  @media (max-width: 767.98px) {
    #navbar.repository-navbar {
      padding-left: 8px;
      padding-right: 8px;
    }

    .repository-tab-nav.page-content.repository > .secondary-nav > overflow-menu.ui.container {
      padding-left: 8px;
      padding-right: 8px;
    }

    .repository-tab-nav.page-content.repository .ui.secondary.pointing.menu .overflow-menu-items {
      gap: 4px;
    }

    .page-content.repository > .repository-content-header {
      margin-bottom: 16px;
      padding-top: 16px;
    }

    .page-content.repository > .repository-content-header > .ui.container {
      padding-bottom: 16px;
    }

    .page-content.repository > .repository-content-header .repo-header {
      align-items: flex-start;
      gap: 12px;
    }

    .page-content.repository > .repository-content-header .repo-buttons {
      justify-content: flex-start;
      width: 100%;
    }
  }
`;

export default cssCombine(repositoryHeader);

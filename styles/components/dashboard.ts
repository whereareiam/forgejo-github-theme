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
import { labelStyle } from "@lutinglt/gitea-github-theme/styles/common";

const dashboard = css`
  .page-content.dashboard {
    /* 仪表板切换控制用户按钮 */
    .context-switcher > .context-switcher-menu > .scrolling.menu {
      animation: none; /* 去掉嵌套菜单导致的多余动画 */
    }

    .context-switcher > .context-switcher-menu {
      padding: 0;
      width: 320px;
      max-width: min(320px, calc(100vw - 32px));

      > .header {
        border-bottom: 1px solid ${themeVars.color.secondary.self};
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        margin: 0;
        padding: 12px 16px 10px;
      }

      > .scrolling.menu {
        max-height: 320px;
        overflow-y: auto;
        padding: 8px 0;

        > .context-switcher-item {
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          height: 32px;
          margin: 0 8px;
          padding: 5px 8px;
          width: calc(100% - 16px);
          font-size: 14px;
          font-weight: 400;
          line-height: 21px;
          position: relative;
          overflow: visible;
          --color-hover: ${themeVars.github.control.transparent.bgColor.hover};
          --color-active: transparent;

          &:not(:first-child)::after {
            background: ${themeVars.color.secondary.self};
            content: "";
            height: 1px;
            left: 54px;
            pointer-events: none;
            position: absolute;
            right: 8px;
            top: 0;
            z-index: 3;
          }

          > .context-switcher-marker {
            background: transparent;
            border-radius: 2px;
            bottom: 3px;
            height: auto;
            left: -8px;
            pointer-events: none;
            position: absolute;
            top: 3px;
            width: 4px;
            z-index: 1;
          }

          &:hover,
          &:active {
            background: var(--color-hover);
            box-shadow: none;
          }

          &:hover > .context-switcher-marker,
          &:focus-visible > .context-switcher-marker {
            background: ${themeVars.github.borderColor.accent.emphasis};
          }

          &.context-switcher-selected:not(:hover) {
            background: transparent;
          }

          > .context-switcher-check {
            align-items: center;
            color: ${themeVars.color.text.light.num1};
            display: inline-flex;
            flex: 0 0 16px;
            height: 16px;
            justify-content: center;
            opacity: 0;
            width: 16px;

            svg {
              margin: 0;
            }
          }

          &.context-switcher-selected > .context-switcher-check {
            opacity: 1;
          }

          > img.ui.avatar {
            border-radius: 9999px;
            flex: 0 0 14px;
            height: 14px;
            margin: 0;
            width: 14px;
          }

          > .truncated-item-name {
            line-height: 21px;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  /* 首页仪表板, 避免选中管理员后台的维护管理面板 */
  .page-content.dashboard.feeds {
    /* 仓库列表的仓库/组织切换按钮 */
    .ui.two.item.menu {
      background: ${themeVars.github.controlTrack.bgColor.rest};
      border: 0;
      border-radius: 12px;
      margin-bottom: 8px;
      position: relative;
      > .item {
        background: unset;
        border-radius: 12px;
        padding: 6px 12px !important;
        position: relative;
        z-index: 2;
        &.active {
          background: unset !important;
          box-shadow: none !important;
          font-weight: 600;
        }
        &::before {
          display: none;
        }
        &:not(.active) {
          border-radius: ${otherThemeVars.border.radius};
          margin: 6px !important;
          width: calc(50% - 12px);
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover};
          }
        }
      }
      /* 滑块指示器 */
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        background: ${themeVars.github.controlKnob.bgColor.rest};
        border-radius: 12px;
        box-shadow:
          0px 0px 0px 1px ${themeVars.color.secondary.self},
          ${themeVars.github.shadow.resting.small};
        transition: transform 200ms cubic-bezier(0.33, 1, 0.68, 1);
        z-index: 1;
        pointer-events: none;
      }
      /* 右侧激活 → 滑块向右滑 */
      &:has(> .item:last-child.active)::after {
        transform: translateX(100%);
      }
    }
    /* 仓库/组织列表标题 */
    .ui.top.attached.header {
      border: 0;
      font-size: 20px;
      font-weight: 400;
      background-color: unset !important;
      margin-bottom: 0.25rem;
      .ui.label {
        border-color: ${themeVars.github.counter.borderColor};
      }
    }
    /* 仓库/组织列表 */
    .ui.attached.segment {
      background-color: ${themeVars.color.menu};
      border: unset !important;
      box-shadow:
        0px 0px 0px 1px ${themeVars.color.secondary.self},
        ${themeVars.github.shadow.resting.small};
      &.repos-search {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        > .menu.repos-filter {
          .item.active {
            background: #0000;
            &:hover {
              background: ${themeVars.github.control.transparent.bgColor.hover};
              color: ${themeVars.color.text.self};
            }
          }
          .ui.circular.label {
            border-color: ${themeVars.github.counter.borderColor};
            min-height: fit-content;
            padding: ${labelStyle.padding} !important;
          }
        }
      }
      &.table {
        &:last-child {
          border-bottom-left-radius: 12px !important;
          border-bottom-right-radius: 12px !important;
        }
        ul {
          padding: 8px;
          li {
            border-radius: ${otherThemeVars.border.radius};
            padding: 6px 8px !important;
            height: 32px;
            &:not(:last-child) {
              border-bottom: 0;
            }
            &:hover {
              background: ${themeVars.github.control.transparent.bgColor.hover};
              box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
            }
            a.muted:hover {
              color: inherit;
              text-decoration-line: none;
            }
          }
        }
      }
    }
    /* 组织列表 */
    .ui.tab.dashboard-orgs .ui.attached.segment.table {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
  }
`;

// 导航栏的工单/PR/里程碑仪表板
const dashboardIssues = css`
  .page-content.dashboard.issues {
    .list-header {
      background-color: ${themeVars.color.box.header};
      border: 1px solid ${themeVars.color.light.border};
      border-bottom: 0;
      border-top-left-radius: ${otherThemeVars.border.radius};
      border-top-right-radius: ${otherThemeVars.border.radius};
      height: 54px;
      padding: 16px 8px;
      .list-header-toggle {
        align-items: center;
        border: 0;
        > .item {
          background: unset !important;
          border-radius: ${otherThemeVars.border.radius};
          color: ${themeVars.color.text.light.num1};
          padding: 0px 8px;
          height: 30px;
          &:before {
            display: none;
          }
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover} !important;
          }
          &.active {
            color: ${themeVars.color.text.self};
            font-weight: 700;
          }
        }
      }
      > .ui.secondary.menu {
        > .item {
          border-radius: ${otherThemeVars.border.radius};
          color: ${themeVars.color.text.light.num1};
          padding: 0px 12px;
          height: 32px;
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover};
          }
        }
      }
    }
  }
`;

// 避免手机/平板下菜单错位
const issueListMobile = css`
  @media (max-width: 767.98px) {
    .page-content.dashboard.issues .list-header {
      height: auto;
    }
  }
`;

// 修复仪表板下二级面板选择菜单组织的标签间隔
const fixOrgLabel = css`
  .dashboard .secondary-nav .org-visibility .label {
    margin-right: 0;
  }
`;

export default cssCombine(dashboard, dashboardIssues, issueListMobile, fixOrgLabel);

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

import { css, cssCombine, cssStyle, otherThemeVars, themeVars } from "@lutinglt/gitea-github-theme/core";
import { deleteHoverActiveStyle } from "@lutinglt/gitea-github-theme/styles/common";

const sidebarPadding = cssStyle({
  padding: "4px 8px",
});

// 侧边栏
const issueSidebar = css`
  /* 创建PR页面 */
  .page-content.repository.diff.compare.pull,
  /* 工单&创建工单&PR页面侧边栏 */
  .page-content.repository.issue:not(.github-conversation) {
    .issue-content {
      img.ui.avatar {
        border-radius: 9999px;
      }
      gap: 24px;
      /* 侧边栏 */
      .issue-content-right {
        background-color: ${themeVars.color.body};
        border: 0;
        font-size: 12px;
        padding: 0;
        .ui.button {
          font-size: 12px;
        }
        .ui.form,
        span.text,
        /* 列表项为空时的文字 */
        .no-select,
        p {
          color: ${themeVars.color.text.light.num1};
          font-size: 12px;
        }
        /* WIP 前缀提示 */
        > a,
        .ui.dropdown.select-branch,
        .ui.form,
        span.text,
        .ui.watching > div,
        .ui.depending > div,
        .flex-text-block,
        .ui.list,
        .toggle-wip,
        p {
          ${sidebarPadding};
        }
        /* 允许维护者编辑 */
        > .ui.checkbox {
          margin: 4px 8px;
          strong {
            font-weight: 400;
          }
        }
        > .ui.dropdown > :is(a, span).text.muted,
        > #milestone-section > .ui.dropdown > a.text.muted {
          align-items: center;
          border-radius: ${otherThemeVars.border.radius};
          display: flex;
          height: 28px;
          text-decoration-line: none;
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover};
            box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
          }
        }
        > .ui.list,
        > #milestone-section > .ui.list {
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
        /* 评审人 */
        .ui.assignees.list {
          .item {
            /* 操作图标按钮 */
            a.muted.icon {
              color: ${themeVars.color.text.light.num1};
              &:hover {
                color: ${themeVars.color.primary.self};
              }
            }
          }
        }
        /* Forgejo 15 的标签描述和归档提示是菜单项的直接子元素 */
        .ui.dropdown.select-label > .menu > .item {
          .desc {
            color: ${themeVars.color.text.light.num1};
            font-size: 12px;
            overflow-wrap: anywhere;
            white-space: normal;
          }
          .archived-label-hint {
            color: ${themeVars.color.text.light.num1};
            font-size: 12px;
            margin: 4px 0 0 23px;
          }
        }
        /* 修复菜单下拉打开时, 无法聚焦输入框 */
        > .ui.dropdown .menu input,
        > #milestone-section > .ui.dropdown .menu input {
          transition: none;
        }
        /* 时间追踪 */
        > div:not([class]):not([id]) {
          > .flex-text-block {
            color: ${themeVars.color.text.light.num1};
          }
          > .ui.buttons {
            ${sidebarPadding};
            .button {
              height: 30px;
              min-height: 30px;
              &:hover {
                border-color: ${themeVars.color.light.border};
                + .button {
                  border-left-color: ${themeVars.color.light.border};
                }
              }
            }
          }
        }
        /* 选中日期颜色 */
        .ui.form .due-date {
          color: ${themeVars.color.text.self};
        }
        /* 分割线 */
        > .divider {
          margin: 12px 0 12px 8px;
          width: calc(100% - 16px);
        }
        /* 订阅按钮 */
        .ui.watching .ui.button {
          padding: 0px 8px;
          height: 30px;
          min-height: 30px;
          svg {
            margin: 0 !important;
          }
        }
        /* PIN 按钮 */
        .form-fetch-action.single-button-form .ui.button,
        /* 底部操作按钮 */
        > .ui.show-modal.button {
          border: 0;
          background: unset;
          font-weight: 400;
          ${sidebarPadding};
          /* 好像是浏览器 BUG, 最后不生效, 必须 !important */
          margin: 0 !important;
          justify-content: left;
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover};
            box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
          }
          &:active {
            background-color: ${themeVars.github.control.transparent.bgColor.active};
            box-shadow: inset 0 0 0 1px ${themeVars.github.control.transparent.borderColor.active};
          }
        }
        .ui.show-modal.button[data-modal="#sidebar-delete-issue"] {
          color: ${themeVars.color.red.self};
          svg {
            color: inherit;
          }
          ${deleteHoverActiveStyle}
        }
      }
    }
  }
`;

export default cssCombine(issueSidebar);

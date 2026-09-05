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

const input = css`
  :root {
    --color-input-border-hover: ${themeVars.color.input.border};
  }
  textarea,
  /* 排除复选框和单选框 */
  input:not([type=checkbox],[type=radio]),
  .ui.input input:not([type=checkbox],[type=radio]),
  /* 排除可以选择的输入搜索框 */
  .ui.form input:not([type]):not(.search),
  .ui.form select,
  .ui.form textarea,
  .ui.form input[type="date"],
  .ui.form input[type="datetime-local"],
  .ui.form input[type="email"],
  .ui.form input[type="file"],
  .ui.form input[type="number"],
  .ui.form input[type="password"],
  .ui.form input[type="search"],
  .ui.form input[type="tel"],
  .ui.form input[type="text"],
  .ui.form input[type="time"],
  .ui.form input[type="url"] {
    box-shadow: ${themeVars.github.shadow.inset};
    border-radius: ${otherThemeVars.border.radius};
    padding: 8px 12px;
    &:focus,
    &:focus-visible {
      background: ${themeVars.color.body};
      border-color: ${themeVars.github.borderColor.accent.emphasis};
      /* 向内部添加一个 1px 的边框 */
      box-shadow: inset 0 0 0 1px ${themeVars.github.borderColor.accent.emphasis};
      outline: none;
    }
  }
  .ui.input {
    height: 32px;
  }
  .ui.action.input:not([class*="left action"]) > .ui.input > input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-color: transparent;
  }
  .ui.form .ui.action.input:not([class*="left action"]) input:focus {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .ui.form .ui[class*="left action"].input input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  /* 由于输入框高度, 需要输入框在表单中垂直居中 */
  /* 管理员页面仓库搜索表单 */
  .ui.form#repo-search-form {
    align-items: center;
  }
  /* 下拉菜单的输入框 */
  .ui.dropdown.dropdown .menu > .input {
    margin: 12px 10px;
  }
`;
// 复选框和单选框
const checkBoxAndRadio = css`
  /* 复选框 */
  input[type="checkbox"],
  .ui.checkbox input[type="checkbox"],
  .markup .task-list-item input[type="checkbox"] {
    appearance: none;
    box-sizing: border-box;
    display: inline-grid;
    place-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    border: 1px solid ${themeVars.github.borderColor.emphasis};
    border-radius: 3px;
    background-color: ${themeVars.color.body};
    cursor: pointer;
    &:focus-visible {
      outline: 2px solid ${themeVars.github.fgColor.accent};
      outline-offset: 2px;
    }
    &:disabled {
      cursor: default;
      opacity: 0.5;
    }
    &:checked,
    &:indeterminate {
      background-color: ${themeVars.github.bgColor.accent.emphasis};
      border-color: ${themeVars.github.bgColor.accent.emphasis};
    }
    &::before {
      content: "";
      width: 10px;
      height: 10px;
      background-color: ${themeVars.github.fgColor.onEmphasis};
      clip-path: polygon(14% 44%, 0 59%, 38% 95%, 100% 20%, 84% 7%, 36% 66%);
      visibility: hidden;
    }
    &:checked::before {
      visibility: visible;
    }
    &:indeterminate::before {
      clip-path: inset(40% 0);
      visibility: visible;
    }
  }
  /* 单选框 */
  input[type="radio"],
  .ui.checkbox input[type="radio"] {
    background-color: ${themeVars.color.body};
    border-color: ${themeVars.github.borderColor.emphasis};
    &:checked {
      background-color: ${themeVars.github.fgColor.onEmphasis};
      border-color: ${themeVars.github.bgColor.accent.emphasis};
    }
  }
`;

// Opt-in search group for native Forgejo query/mode/submit controls.
const searchControl = css`
  .ui.form.theme-search-control > .ui.action.input {
    display: flex;
    align-items: stretch;
    height: 32px;
    min-width: 0;
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    background: ${themeVars.color.body};
    box-shadow: none;
    &:has(> input:focus-visible) {
      outline: 2px solid ${themeVars.github.fgColor.accent};
      outline-offset: -1px;
    }
    & > input[type="search"] {
      min-width: 0;
      width: 0;
      flex: 1 1 0;
      height: 30px;
      padding: 5px 12px;
      font-size: 14px;
      line-height: 20px;
      background: transparent;
      border: 0;
      border-radius: inherit;
      box-shadow: none;
      outline: none;
    }
    & > .ui.selection.dropdown,
    & > .ui.button {
      flex: 0 0 auto;
      height: 30px;
      min-height: 30px;
      margin: 0;
      border: 0;
      border-left: 1px solid ${themeVars.color.light.border};
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      color: ${themeVars.color.text.light.num1};
      &:hover {
        background: ${themeVars.color.hover.self};
      }
      &:focus-visible {
        outline: 2px solid ${themeVars.github.fgColor.accent};
        outline-offset: -2px;
      }
    }
    & > .ui.selection.dropdown {
      display: flex;
      align-items: center;
      width: auto;
      min-width: 88px;
      padding: 5px 28px 5px 8px;
      font-size: 12px;
      line-height: 20px;
      & > .text {
        margin: 0;
        line-height: 20px;
      }
      & > .dropdown.icon {
        top: 50%;
        transform: translateY(-50%);
        right: 8px;
        padding: 0;
        margin: 0;
        width: 16px;
        height: 16px;
      }
      & > .menu {
        left: auto;
        right: 0;
        width: 200px;
        min-width: 200px;
        margin-top: 4px;
      }
    }
    & > .ui.button {
      display: grid;
      place-items: center;
      width: 32px;
      padding: 0 !important;
      border-radius: 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0;
      & > svg {
        width: 16px;
        height: 16px;
        margin: 0;
      }
    }
  }
`;

export default cssCombine(input, checkBoxAndRadio, searchControl);

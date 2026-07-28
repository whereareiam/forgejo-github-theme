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

// 仓库 Actions 页面
const actions = css`
  .page-content.repository.actions:not(.settings) {
    .actions-menu::before {
      content: "Actions";
      display: block;
      font-size: 20px;
      font-weight: 600;
      margin: 6px 8px 8px;
    }
    .run-list {
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius};
      font-size: 12px;
      margin-top: 8px;
      > .flex-item {
        line-height: 18px;
        padding: 16px;
        > .flex-item-leading {
          align-self: flex-start;
        }
        > .flex-item-main {
          gap: 0.5rem;
        }
      }
      .run-list-ref {
        background-color: ${themeVars.github.bgColor.accent.muted};
        border-color: transparent;
        color: ${themeVars.github.fgColor.accent};
        font-family: var(--fonts-monospace);
        font-weight: 400;
        padding: 0 6px;
        &:hover {
          background-color: ${themeVars.github.bgColor.accent.muted};
          color: ${themeVars.github.fgColor.accent};
          text-decoration-line: underline !important;
        }
      }
      .run-list-item-right {
        color: ${themeVars.color.text.light.num1};
      }
    }
    .center.page.buttons {
      background: ${themeVars.color.body};
    }
  }
`;

// 工作流禁用标签
const label = css`
  .page-content.repository.actions:not(.settings) .ui.vertical.menu .item > .ui.red.label {
    color: ${themeVars.color.error.text};
    border: 1px solid ${themeVars.color.error.border};
    background: ${themeVars.color.error.bg.self};
  }
`;

// 手动工作流
const runWorkflow = css`
  #workflow_dispatch_dropdown > .menu > .message.ui.form {
    font-size: 12px;
    .field > label {
      font-weight: 600;
      margin-bottom: 6px;
    }
    .branch-dropdown-button {
      font-size: 12px;
      gap: 4px;
      min-height: 27px;
      padding: 3px 21px 3px 12px;
      .text {
        line-height: 20px;
      }
    }
    #workflow-dispatch-submit {
      min-height: 27px;
      padding: 0 8px;
    }
  }
`;

export default cssCombine(actions, label, runWorkflow);

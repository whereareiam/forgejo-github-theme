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

import { css, cssCombine, themeVars } from "@lutinglt/gitea-github-theme/core";

const codeEditor = css`
  .codemirror-container {
    min-height: auto;
    .cm-editor {
      max-height: calc(100vh - 64px - 128px - 32px - 64px - 32px);
    }
    .cm-panel.cm-search {
      background-color: ${themeVars.color.box.header};
      gap: 0;
      padding: 8px;
      .cm-textfield {
        background-color: ${themeVars.color.body};
        margin: 4px 8px 4px 0;
      }
      .cm-button {
        background-color: ${themeVars.color.body};
        margin: 4px 8px 4px 0;
        padding: 4px 8px;
        text-transform: capitalize;
        &:hover {
          background-color: ${themeVars.color.button};
        }
        &:active {
          background-color: ${themeVars.color.hover.self};
          background-image: none;
        }
      }
      > label {
        font-size: 12px;
        font-weight: 600;
        margin: 4px 8px 4px 0;
        text-transform: capitalize;
      }
      button[name="close"] {
        color: ${themeVars.color.text.self};
        height: 14px;
        width: 14px;
      }
    }
    .cm-scroller,
    .ͼ1 .cm-scroller {
      font-family:
        ui-monospace,
        SFMono-Regular,
        SF Mono,
        Menlo,
        Consolas,
        Liberation Mono,
        monospace;
    }
  }
`;

const fileEditor = css`
  .page-content.repository.file.editor {
    .repo-editor-header {
      margin: 16px 0;
      min-height: 32px;
      .breadcrumb {
        gap: 8px;
        .section,
        .breadcrumb-divider {
          font-size: 16px;
        }
        > .section:first-child {
          font-weight: 600;
        }
        input {
          margin-right: 0 !important;
        }
        svg {
          color: ${themeVars.color.text.light.num1};
        }
        span:has(svg) {
          align-items: center;
          display: flex;
        }
      }
    }
    #editor-bar .switch .item svg {
      display: none;
    }
  }
`;

const commitForm = css`
  .repository.file.editor .commit-form-wrapper {
    .commit-avatar {
      border-radius: 9999px;
    }
    .commit-form {
      &::before,
      &::after {
        display: none;
      }
    }
  }
`;

export default cssCombine(codeEditor, fileEditor, commitForm);

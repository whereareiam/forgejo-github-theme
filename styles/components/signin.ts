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

// 注册/登录界面
const signIn = css`
  .page-content.user.signin,
  .page-content.user.twofa-challenge {
    .ui.grid {
      justify-content: center;
      > .column {
        width: 384px;
        max-width: 100%;
        padding: 16px;
        > .ui.container {
          max-width: unset;
        }
      }
    }
    .signin-branding {
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }
    .signin-logo {
      display: block;
      height: 48px;
      width: 48px;
    }
    .signin-title {
      border: 0;
      color: inherit;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.5;
      margin: 0;
      padding: 0;
      text-align: center;
      white-space: nowrap;
    }
    .ui.top.attached.header {
      background-color: unset !important;
    }

    .ui.attached.segment {
      border: 0;
      padding: 0;
      form.tw-mb-4 {
        margin-bottom: 0 !important;
      }
      .field:not(.inline) {
        margin-bottom: 16px;
        label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .signin-field-label {
          align-items: baseline;
          display: flex;
          justify-content: space-between;
          width: 100%;
          label {
            margin-bottom: 4px;
          }
          a {
            font-size: 14px;
            font-weight: 400;
          }
        }
        input {
          background: unset;
          padding: 5px 12px;
          height: 40px;
          font-size: 16px;
        }
      }
      .button {
        height: 40px;
      }
      .divider.divider-text {
        margin: 20px 0px;
      }
      #oauth2-login-navigator-inner {
        gap: 8px;
        .ui.button svg {
          width: 18px;
        }
      }
    }
    .signin-footer {
      border: 0;
      font-size: 14px;
      font-weight: 400;
      gap: 16px;
      padding: 16px 0 0;
    }
    .ui.top.attached.header.segment {
      font-size: 14px;
      font-weight: 400;
      gap: 16px;
    }
  }
`;

const signInTitle = css`
  .page-content.user.signin .signin-title {
    align-self: center;
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
    white-space: nowrap;
  }
`;

const twoFactor = css`
  /* Use a dedicated challenge layout instead of Forgejo's legacy .signin grid,
     whose desktop rules force authentication forms to a fixed 800px width. */
  .page-content.user.twofa-challenge {
    .twofa-challenge-column {
      width: 384px;
      max-width: 100%;
      margin: 0 auto;
      padding: 48px 16px 32px;
    }
    .signin-logo {
      width: 44px;
      height: 44px;
    }
    .twofa-heading {
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: center;
    }
    .signin-title {
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .twofa-description {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    .ui.attached.segment .field:not(.inline) {
      margin-bottom: 24px;
      input {
        text-align: center;
        padding: 4px 32px;
        line-height: 20px;
      }
    }
    .ui.button {
      font-weight: 500;
      line-height: 20px;
      margin: 0;
      padding: 5px 16px;
    }
    .twofa-options {
      margin-top: 16px;
      > summary.ui.button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        list-style: none;
        &::marker,
        &::-webkit-details-marker {
          display: none;
        }
      }
      &[open] > summary .svg {
        transform: rotate(180deg);
      }
      .ui.button {
        width: 100%;
        min-height: 40px;
        height: auto;
        margin: 0;
        white-space: normal;
      }
    }
    .twofa-options-content {
      border-top: 1px solid ${themeVars.color.light.border};
      margin-top: 16px;
      padding-top: 16px;
    }
  }
`;

export default cssCombine(signIn, signInTitle, twoFactor);

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

// 注册/登录界面
const signIn = css`
  .page-content.user.signin,
  .page-content.user.twofa-challenge,
  .registration-panel {
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
      white-space: normal;
      overflow-wrap: anywhere;
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
        /* A site-wide username prefix sits in a box joined to the start of the field, with its note below. */
        .ui.labeled.input {
          width: 100%;
          > .ui.label {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 400;
          }
        }
        .help {
          display: block;
          margin-top: 4px;
          color: ${themeVars.color.text.light.num1};
          font-size: 12px;
        }
      }
      .signin-remember {
        margin: 0 0 16px;
        label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          font-size: 14px;
          font-weight: 400;
          cursor: pointer;
        }
        input {
          margin: 0;
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

const registration = css`
  .registration-panel {
    width: 384px;
    max-width: 100%;
    margin: 0 auto;
    padding: 16px;
    .signin-footer {
      text-align: center;
    }
    /* Recovery and activation forms submit with a full-width button, as sign-in does. */
    .ui.attached.segment > .inline.field > .ui.primary.button {
      width: 100%;
      margin: 0;
    }
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

/* Linking an external account: the sign-in column with the logo once, a full-width segmented switch between the two
   forms and the chosen form below it. Forgejo's .user.link-account rules fix forms at 800px and indent notes for a
   label column; the stacked column has neither. */
const linkAccount = css`
  .page-content.user.link-account {
    .theme-link-account {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      box-sizing: border-box;
      width: 384px;
      max-width: 100%;
      margin: 0 auto;
      padding: 32px 16px 0;
      > .ui.tab {
        width: 100%;
      }
      .registration-panel {
        width: auto;
        padding: 0;
      }
      .ui.tab .signin-logo {
        display: none;
      }
      .ui.tab .signin-branding {
        margin-bottom: 16px;
      }
    }
    .theme-switch {
      width: 100%;
      > .item {
        flex: 1;
        min-width: 0;
        padding-inline: 8px;
        cursor: pointer;
        text-align: center;
      }
    }
    form {
      width: auto !important;
      .help {
        margin-inline-start: 0 !important;
      }
    }
  }
`;

/* OAuth authorization and its error: GitHub's authorize page in the sign-in column, a little wider for the box. The
   site's logo and the account face each other over a dashed line, what the application gets is listed in a box, and
   Cancel and Authorize share one row. */
const authCard = css`
  .page-content.oauth2-authorize-application-box {
    margin-top: 0 !important;
    .theme-auth-card {
      box-sizing: border-box;
      width: 472px;
      max-width: 100%;
      margin: 0 auto;
      padding: 32px 16px;
      overflow-wrap: anywhere;
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
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      line-height: 30px;
      text-align: center;
    }
    .theme-auth-card-parties {
      align-items: center;
      display: flex;
      gap: 8px;
      img.ui.avatar {
        border-radius: 50%;
        height: 48px;
        width: 48px;
      }
    }
    .theme-auth-card-link {
      border-top: 2px dashed ${themeVars.color.light.border};
      width: 48px;
    }
    .theme-auth-card-box {
      border: 1px solid ${themeVars.color.light.border};
      border-radius: ${otherThemeVars.border.radius};
      margin-bottom: 16px;
    }
    .theme-auth-card-row {
      align-items: flex-start;
      display: flex;
      gap: 12px;
      padding: 16px;
      + .theme-auth-card-row {
        border-top: 1px solid ${themeVars.color.light.border};
      }
      > .svg {
        color: ${themeVars.color.text.light.num1};
        flex: none;
        margin-top: 2px;
      }
      p,
      h2 {
        margin: 0;
        font-size: 14px;
        line-height: 20px;
      }
      h2 {
        font-weight: 600;
        margin-bottom: 4px;
      }
    }
    .theme-auth-card-actions {
      display: flex;
      gap: 8px;
      > .ui.button {
        flex: 1;
        height: 40px;
        margin: 0;
      }
    }
    .theme-auth-card-note {
      color: ${themeVars.color.text.light.num1};
      font-size: 12px;
      line-height: 18px;
      margin: 16px 0 0;
      text-align: center;
    }
  }
`;

export default cssCombine(signIn, signInTitle, registration, twoFactor, linkAccount, authCard);

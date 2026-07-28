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

const notificationToolbar = css`
  .page-content.user.notification {
    > .ui.container {
      > .tw-flex.tw-justify-between:first-child,
      > .ui.attached.segment > .tw-flex.tw-justify-between:first-child {
        align-content: center;
        align-items: center;
        background-color: ${themeVars.color.box.header};
        border: 1px solid ${themeVars.color.light.border};
        border-bottom: 0;
        border-top-left-radius: ${otherThemeVars.border.radius};
        border-top-right-radius: ${otherThemeVars.border.radius};
        min-height: 52px;
        padding: 8px;
        margin-bottom: 0 !important;
        > .switch {
          --switch-item-min-height: 32px;
          --switch-padding-inline: 12px;
          align-items: center;
          background: light-dark(${themeVars.github.controlTrack.bgColor.rest}, ${themeVars.color.menu}) !important;
          border: 0;
          border-radius: ${otherThemeVars.border.radius};
          display: flex;
          gap: 0;
          height: 32px;
          min-height: 32px;
          > .item {
            align-items: center;
            background: transparent !important;
            border: 1px solid #0000;
            border-radius: ${otherThemeVars.border.radius};
            box-sizing: border-box;
            color: ${themeVars.color.text.self};
            display: flex;
            font-weight: 400;
            height: 32px;
            justify-content: center;
            line-height: 21px;
            margin: 0;
            min-height: 32px;
            outline: 0;
            padding: 4px 12px;
            &::before {
              display: none;
            }
            &:not(.active):hover {
              background: ${themeVars.github.control.transparent.bgColor.hover} !important;
            }
            &.active {
              background: light-dark(
                ${themeVars.github.controlKnob.bgColor.rest},
                ${themeVars.color.hover.self}
              ) !important;
              border-color: ${themeVars.color.secondary.self};
              color: ${themeVars.color.text.self};
              font-weight: 600;
            }
            .notifications-unread-count {
              margin-left: 4px;
            }
          }
          > .item:has(+ .active.item),
          > .active.item + .item {
            margin: 0;
            padding: 4px 12px;
          }
        }
        > .button-row {
          align-items: center;
          gap: 8px;
          > .button,
          > form .button {
            height: 32px;
            line-height: 20px;
            min-height: 32px;
            padding: 5px 12px;
          }
        }
      }
      > .ui.attached.segment {
        border: 0;
        padding: 0;
        > .divider {
          display: none;
        }
      }
    }
  }
`;

const watchingList = css`
  .page-content.user.notification > .ui.container > .ui.attached.segment > .flex-list:not([id]) {
    border: 1px solid ${themeVars.color.light.border};
    border-radius: ${otherThemeVars.border.radius};
    > .flex-item {
      padding: 16px;
      > .flex-item-main {
        gap: 4px;
        > .flex-item-header {
          > .flex-item-title {
            gap: 12px;
          }
          > .flex-item-trailing {
            color: ${themeVars.color.text.light.num1};
            font-size: 12px;
            font-weight: 400;
            gap: 16px;
            .color-icon {
              width: 12px;
              height: 12px;
              margin-right: 0 !important;
            }
          }
        }
        > .flex-item-body:last-child {
          font-size: 12px;
        }
      }
    }
  }
`;

const notificationList = css`
  .page-content.user.notification > .ui.container {
    #notification_table {
      border: 1px solid ${themeVars.color.light.border};
      border-radius: 0 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius};
      color: ${themeVars.color.text.light.num1};
      > .notifications-item {
        border-top: 1px solid ${themeVars.color.light.border};
        padding: 12px !important;
        &:first-child {
          border-top: 0;
        }
        &:last-child {
          border-bottom-left-radius: ${otherThemeVars.border.radius};
          border-bottom-right-radius: ${otherThemeVars.border.radius};
          &:hover {
            border-bottom-left-radius: 0;
          }
        }
        &:hover {
          background: ${themeVars.github.bgColor.accent.muted};
          box-shadow: inset 2px 0 0 ${themeVars.github.borderColor.accent.emphasis};
          color: ${themeVars.color.text.self};
        }
        > .tw-self-start:has(svg) {
          margin-top: 1px !important;
          line-height: 1;
        }
        > .notifications-link > div {
          &:first-child {
            font-size: 12px !important;
          }
          &:last-child {
            font-size: 14px !important;
          }
        }
        > .notifications-updated {
          font-size: 12px;
        }
        > .notifications-buttons .interact-bg {
          background: ${themeVars.github.bgColor.accent.muted} !important;
          color: ${themeVars.color.text.light.num1};
          padding: 8px !important;
          &:hover {
            background: ${themeVars.github.control.transparent.bgColor.hover} !important;
            color: ${themeVars.color.text.self};
          }
        }
      }
    }
  }
`;

export default cssCombine(notificationToolbar, watchingList, notificationList);

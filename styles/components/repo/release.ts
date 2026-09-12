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

const releaseHeader = css`
  :is(.page-content.repository.releases, .page-content.repository.tags) > .ui.container {
    > .list-header > .switch > .item {
      background-color: transparent !important;
      font-weight: 500;
      &.active {
        background: ${themeVars.github.bgColor.accent.emphasis} !important;
        color: ${themeVars.github.button.primary.fgColor.rest};
      }
    }
    > .divider {
      margin: 16px 0;
    }
    .release-list-buttons > .secondary.button {
      background-color: ${themeVars.color.button};
      border-color: ${themeVars.color.light.border};
      box-shadow: none;
      color: ${themeVars.color.text.light.self};
      &:hover {
        background-color: ${themeVars.color.hover.self};
      }
    }
  }
`;

const tagList = css`
  .page-content.repository.tags #tags-table {
    .release-tag-name {
      line-height: 1.5;
    }
    .download {
      color: ${themeVars.color.text.light.num1};
      font-size: 12px;
      svg {
        min-width: 12px;
        width: 12px;
      }
      a:hover {
        text-decoration: none;
      }
    }
  }
`;

const releaseList = css`
  .page-content.repository.releases ul#release-list {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin: 32px 0 16px;
    > li {
      .meta {
        gap: 0.5rem;
        padding-right: 24px;
        padding-top: 24px;
        text-align: left;
        a.muted {
          color: ${themeVars.color.text.light.num1};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          svg {
            margin-right: 8px !important;
          }
        }
        .ui.button.branch-dropdown-button {
          font-size: 12px;
          line-height: 20px;
          min-height: 20px;
          padding: 3px 12px;
        }
      }
      .release-title-wrap {
        background: ${themeVars.color.box.body.self};
        border: 1px solid ${themeVars.color.light.border};
        border-bottom: 0;
        border-radius: ${otherThemeVars.border.radius} ${otherThemeVars.border.radius} 0 0;
        margin-left: 1rem;
        padding: 16px 16px 0;
        h4 {
          font-size: 32px;
          gap: 8px;
        }
      }
      .detail {
        background: ${themeVars.color.box.body.self};
        border: 1px solid ${themeVars.color.light.border};
        border-radius: 0 0 ${otherThemeVars.border.radius} ${otherThemeVars.border.radius};
        border-top: 0;
        margin-left: 1rem;
        padding: 0 16px 16px;
        img.ui.avatar {
          border-radius: 9999px;
        }
        p.text.grey {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 24px 0 0;
          span {
            word-break: break-word;
          }
          .time {
            color: ${themeVars.color.text.self};
          }
        }
        .markup > :first-child {
          margin-top: 24px !important;
        }
        > .divider {
          left: -16px;
          margin: 24px 0 16px;
          position: relative;
          width: calc(100% + 32px);
        }
        .download {
          summary {
            font-size: 16px;
            font-weight: 600;
            margin-top: 16px;
          }
          .list {
            margin-top: 16px;
            > li {
              align-items: center;
              line-height: 17px;
              padding: 8px 16px;
              > a:hover {
                text-decoration: underline !important;
              }
            }
          }
        }
      }
    }
  }
`;

const releaseListMobile = css`
  @media (max-width: 767.98px) {
    .page-content.repository.releases ul#release-list > li {
      .meta {
        padding: 0;
      }
      :is(.release-title-wrap, .detail) {
        margin-left: 0;
      }
    }
  }
`;

const githubReleasePage = css`
  body:has(.page-content.repository.github-releases) .repository-content-header {
    display: none;
  }
  .page-content.repository.github-releases > .ui.container {
    box-sizing: border-box;
    max-width: calc(100% - 32px);
    padding-left: 0;
    padding-right: 0;
    width: 1116px !important;
  }
  .github-release-toolbar {
    align-items: center;
    border-bottom: 1px solid ${themeVars.color.light.border};
    display: flex;
    gap: 16px;
    justify-content: space-between;
    margin: 0 0 32px;
    padding: 24px 0;
  }
  .github-release-switch {
    display: flex;
    gap: 0;
  }
  .github-release-switch a {
    border: 1px solid ${themeVars.color.light.border};
    color: ${themeVars.color.text.self};
    padding: 7px 16px;
    text-decoration: none;
  }
  .github-release-switch a:first-child {
    border-radius: 6px 0 0 6px;
  }
  .github-release-switch a:last-child {
    border-radius: 0 6px 6px 0;
    margin-left: -1px;
  }
  .github-release-switch a:only-child {
    border-radius: 6px;
    margin-left: 0;
  }
  .github-release-switch a.active {
    background: ${themeVars.github.bgColor.accent.emphasis};
    border-color: ${themeVars.github.bgColor.accent.emphasis};
    color: ${themeVars.github.button.primary.fgColor.rest};
  }
  .github-release-actions {
    align-items: center;
    display: flex;
    gap: 8px;
  }
  .github-release-actions .secondary.button {
    align-items: center;
    box-sizing: border-box;
    display: inline-flex;
    height: 32px !important;
    line-height: 20px;
    min-height: 0 !important;
    min-width: 163px;
    padding: 5px 16px;
    background-color: var(--color-button);
    border-color: var(--color-light-border);
    box-shadow: none;
    color: var(--color-text);
  }
  .github-release-actions .secondary.button:hover {
    background-color: var(--color-hover);
  }
  .github-release-content {
    display: grid;
    gap: 0 38px;
    grid-template-columns: 164px minmax(0, 1fr);
  }
  .github-release-mobile-toc {
    display: none;
  }
  .github-release-toc h2 {
    color: var(--color-text);
    font-size: 20px;
    font-weight: 600;
    line-height: 1.5;
    margin: 0 0 8px;
    margin-left: 0;
  }
  .github-release-toc ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .github-release-toc li a {
    border-radius: 6px;
    color: var(--color-text) !important;
    display: block;
    font-size: 14px;
    line-height: 20px;
    margin-left: -10px;
    overflow: hidden;
    padding: 8px 10px;
    text-overflow: ellipsis;
    text-decoration: none;
    white-space: nowrap;
  }
  .github-release-toc li a[aria-current="location"] {
    font-weight: 600;
  }
  .github-release-toc li {
    border-radius: 6px;
    position: relative;
  }
  .github-release-toc li:has(a[aria-current="location"]) {
    background: rgba(101, 108, 118, 0.2);
  }
  .github-release-toc li:has(a[aria-current="location"])::before {
    background: #1f6feb;
    border-radius: 6px;
    bottom: 4px;
    content: "";
    left: -8px;
    position: absolute;
    top: 4px;
    width: 4px;
  }
  .github-release-toc li a:hover:not([aria-current="location"]) {
    background: var(--color-hover);
    color: var(--github-fgColor-accent);
  }
  #release-list.github-release-list {
    grid-column: 2;
    display: flex !important;
    flex-direction: column;
    gap: 32px;
    margin: 0 0 16px !important;
  }
  #release-list.github-release-list > li {
    display: block;
  }
  #release-list.github-release-list > li .meta {
    display: none;
  }
  #release-list.github-release-list > li .release-title-wrap {
    margin-left: 0 !important;
    padding: 16px 16px 0;
  }
  #release-list.github-release-list > li .release-title-wrap > div {
    display: flex;
    flex-shrink: 0;
    gap: 8px;
  }
  #release-list.github-release-list > li .release-title-wrap > div > :is(a, button) {
    align-items: center;
    background: var(--color-button);
    border: 1px solid var(--color-light-border);
    border-radius: 6px;
    display: inline-flex;
    height: 28px;
    justify-content: center;
    padding: 0;
    width: 28px;
  }
  #release-list.github-release-list > li .github-release-controls > a {
    color: var(--color-text-light-1) !important;
  }
  #release-list.github-release-list > li .github-release-controls > a svg {
    color: var(--color-text-light-1) !important;
  }
  #release-list.github-release-list > li .release-title-wrap > div > :is(a, button):hover {
    background: var(--color-hover);
  }
  #release-list.github-release-list > li .github-release-delete:hover {
    color: var(--github-control-danger-fgColor-hover);
  }
  #release-list.github-release-list > li .release-title-wrap h4 {
    align-items: center;
    display: flex !important;
    flex: 1;
    flex-wrap: wrap;
    font-size: 32px;
    font-weight: 600;
    gap: 8px;
    line-height: 1.5;
    min-width: 0;
  }
  #release-list.github-release-list > li .release-title-wrap h4 .github-release-name {
    display: contents;
  }
  #release-list.github-release-list > li .github-release-name > a:first-child {
    flex: 0 1 auto;
    color: var(--color-text);
    font-weight: 600;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    white-space: nowrap;
  }
  #release-list.github-release-list > li .release-title-wrap h4 a[data-tippy="commit-statuses"] {
    align-items: center;
    border: 1px solid currentColor;
    border-radius: 24px;
    display: inline-flex;
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 500;
    gap: 4px;
    height: 24px;
    line-height: 18px;
    margin: 0 0 0 8px;
    padding: 2px 8px;
    text-decoration: none;
    vertical-align: middle;
    width: max-content !important;
  }
  #release-list.github-release-list > li .release-title-wrap h4 .github-release-latest {
    align-items: center;
    display: inline-flex !important;
    height: 24px;
    line-height: 18px;
    margin: 0 0 0 8px;
    vertical-align: middle;
  }
  #release-list.github-release-list > li .release-title-wrap h4 .github-release-latest[hidden] {
    display: none !important;
  }
  #release-list.github-release-list > li .release-title-wrap h4 a[data-tippy="commit-statuses"] svg {
    height: 12px;
    width: 12px;
  }
  #release-list.github-release-list > li .release-title-wrap h4 a[data-tippy="commit-statuses"]::after {
    content: "Checks";
  }
  #release-list.github-release-list > li .release-title-wrap h4 a[data-tippy="commit-statuses"]:has(svg.text.yellow) {
    color: #d29922;
  }
  #release-list.github-release-list > li .release-title-wrap h4 a[data-tippy="commit-statuses"]:has(svg.text.green) {
    color: #3fb950;
  }
  #release-list.github-release-list > li .release-title-wrap h4 a[data-tippy="commit-statuses"]:has(svg.text.red) {
    color: #f85149;
  }
  #release-list.github-release-list
    > li
    .release-title-wrap
    h4
    a[data-tippy="commit-statuses"]:has(svg.text.yellow)::after {
    content: "Checks pending";
  }
  #release-list.github-release-list
    > li
    .release-title-wrap
    h4
    a[data-tippy="commit-statuses"]:has(svg.text.green)::after {
    content: "Checks passed";
  }
  #release-list.github-release-list
    > li
    .release-title-wrap
    h4
    a[data-tippy="commit-statuses"]:has(svg.text.red)::after {
    content: "Checks failed";
  }
  #release-list.github-release-list > li .github-release-name > a:first-child:hover {
    color: var(--github-fgColor-accent);
    text-decoration: underline;
  }
  #release-list.github-release-list > li .detail {
    margin-left: 0 !important;
    padding: 0 16px 16px;
  }
  #release-list.github-release-list > li .detail .author a {
    color: var(--color-text-light-1) !important;
    text-decoration: none;
  }
  #release-list.github-release-list > li .detail .author a:hover {
    color: var(--github-fgColor-accent) !important;
    text-decoration: underline;
  }
  #release-list.github-release-list > li .detail .markup.desc {
    color: var(--color-text);
    font-size: 16px;
    line-height: 1.5;
  }
  #release-list.github-release-list > li .detail .markup.desc :is(h1, h2, h3, h4, h5, h6) {
    border-bottom: 1px solid var(--color-light-border);
    color: var(--color-text);
    font-weight: 600;
    line-height: 1.25;
    padding-bottom: 8px;
  }
  #release-list.github-release-list > li .detail .markup.desc h2 {
    font-size: 24px;
  }
  #release-list.github-release-list > li .detail .markup.desc h3 {
    font-size: 20px;
  }
  @media (max-width: 767.98px) {
    .page-content.repository.github-releases > .ui.container {
      padding-left: 16px;
      padding-right: 16px;
      width: 100%;
    }
    .github-release-toolbar {
      align-items: stretch;
      flex-direction: column;
    }
    .github-release-actions {
      flex-wrap: wrap;
    }
    .github-release-actions .github-release-search {
      flex: 1 1 100%;
      min-width: 100%;
      order: 3;
    }
    .github-release-list {
      gap: 24px;
    }
    .github-release-list > li {
      display: block;
    }
    .page-content.repository.github-releases .github-release-list > li .meta {
      display: none;
    }
  }
`;

const releaseRefinements = css`
  .page-content.repository.github-releases {
    .github-release-toolbar {
      margin-bottom: 48px;
    }
    .github-release-switch a {
      padding: 5px 16px;
      font-weight: 500;
      line-height: 20px;
    }
    .github-release-search {
      width: 248px;
      flex: 0 0 248px;
    }
    .github-release-search .ui.input {
      position: relative;
      width: 100%;
    }
    .github-release-search .ui.input input {
      width: 100%;
      min-width: 0;
      height: 32px;
      padding: 5px 12px 5px 32px;
      border-radius: 6px !important;
      border-right: 1px solid var(--color-light-border) !important;
      background: transparent;
    }
    .github-release-search .ui.input button {
      position: absolute;
      left: 0;
      top: 0;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--color-text-light-1);
    }
    .github-release-toc {
      align-self: start;
      position: sticky;
      top: 24px;
      overflow: visible;
      padding-left: 0;
      margin-left: 0;
      margin-top: -8px;
      width: 162px;
    }
    .github-release-toc li a {
      margin-left: 0;
      padding: 6px 8px;
    }
    ul#release-list.github-release-list > li {
      border: 1px solid var(--color-light-border);
      border-radius: 6px;
      background: var(--color-box-body);
      scroll-margin-top: 24px;
      min-width: 0;
      .release-title-wrap,
      .detail {
        border: 0;
        background: transparent;
        border-radius: 0;
      }
      .release-title-wrap {
        align-items: flex-start;
        gap: 16px;
        padding: 16px 16px 0;
      }
      .release-title-wrap h4 {
        display: block;
        margin: 0;
        overflow-wrap: anywhere;
      }
      .github-release-name > a:first-child {
        white-space: normal;
        overflow: visible;
      }
      .release-title-wrap h4 a[data-tippy="commit-statuses"] {
        margin-left: 0;
      }
      .release-title-wrap h4 .ui.label {
        display: inline-block;
        vertical-align: middle;
        background: transparent;
        border: 1px solid currentColor;
        border-radius: 24px;
        font-size: 12px;
        font-weight: 500;
        line-height: 18px;
        padding: 2px 8px;
      }
      .github-release-latest {
        display: inline;
        margin-left: 8px;
      }
      .github-release-latest[hidden] {
        display: none;
      }
      .release-title-wrap h4 .github-release-draft {
        background: var(--github-bgColor-neutral-emphasis);
        border: 0;
        color: var(--github-fgColor-onEmphasis);
        line-height: 24px;
        margin-left: 8px;
        padding: 0 10px;
      }
      .github-release-controls {
        align-items: center;
      }
      .github-release-controls .branch-dropdown-button {
        min-height: 28px;
        padding: 3px 10px;
        font-size: 12px;
        line-height: 20px;
      }
      .github-release-delete {
        cursor: pointer;
        color: var(--color-text-light-1);
      }
      .detail {
        margin-top: 0;
        padding: 0 16px 16px;
      }
      .detail p.text.grey {
        align-items: center;
        margin: 16px 0 0;
        color: var(--color-text-light-1) !important;
        font-size: 14px;
      }
      .detail p.text.grey .time {
        color: inherit;
      }
      .detail .author {
        display: inline-flex;
        align-items: center;
        font-weight: 600;
      }
      .detail .author a {
        color: var(--color-text-light-1) !important;
        text-decoration: none;
      }
      .detail .author a:hover,
      .github-release-ref:hover {
        color: var(--github-fgColor-accent) !important;
        text-decoration: none;
      }
      .github-release-ref {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: 16px;
        color: var(--color-text-light-1);
        text-decoration: none;
      }
      .detail .markup.desc {
        margin-top: 32px;
      }
      .detail .markup.desc :is(h3, h4, h5, h6) {
        border-bottom: 0;
        padding-bottom: 0;
      }
      .github-release-footer {
        border-top: 1px solid var(--color-light-border);
        margin: 24px -16px -16px;
        padding: 16px;
      }
      .detail .download summary {
        font-size: 20px;
        line-height: 28px;
        margin-top: 0;
      }
      .github-release-asset-count {
        display: inline-block;
        border-radius: 24px;
        background: var(--color-hover);
        font-size: 12px;
        line-height: 20px;
        padding: 0 6px;
        vertical-align: middle;
        margin-left: 4px;
      }
      .detail .download .list > li {
        gap: 8px;
        padding: 8px 12px;
        flex-wrap: wrap;
      }
      .detail .download .list > li > a {
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .detail .download .list > li > a svg {
        flex-shrink: 0;
        color: var(--color-text-light-1);
      }
      .detail .download .list > li .text.grey {
        font-size: 12px;
        color: var(--color-text-light-1) !important;
      }
      .github-release-digest {
        align-items: center;
        display: inline-flex;
        font-family: var(--font-family-monospace);
        font-size: 12px;
        gap: 4px;
        margin-right: 16px;
      }
      .github-release-copy-digest {
        background: transparent;
        border: 0;
        color: var(--color-text-light-1);
        cursor: pointer;
        padding: 0;
      }
      .github-release-copy-digest:hover {
        color: var(--color-text);
      }
    }
    .github-release-empty {
      text-align: center;
      padding: 64px 24px;
      border: 1px solid var(--color-light-border);
      border-radius: 6px;
    }
    @media (max-width: 767.98px) {
      > .ui.container {
        max-width: calc(100% - 32px);
        width: calc(100% - 32px) !important;
        margin: 0 auto !important;
        padding: 0;
      }
      .github-release-toolbar {
        gap: 8px;
        margin: 0 14px 16px;
        padding: 24px 0 16px;
      }
      .github-release-content {
        display: block;
      }
      .github-release-toc {
        display: none;
      }
      .github-release-mobile-toc {
        display: block;
        margin: 0 auto 48px;
        position: relative;
        width: max-content;
        summary {
          align-items: center;
          background: var(--color-button);
          border: 1px solid var(--color-light-border);
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          gap: 8px;
          list-style: none;
          padding: 5px 12px;
          font-weight: 500;
        }
        summary::-webkit-details-marker {
          display: none;
        }
        ul {
          background: var(--color-box-body);
          border: 1px solid var(--color-light-border);
          border-radius: 6px;
          list-style: none;
          margin: 4px 0 0;
          padding: 4px 0;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          max-height: 320px;
          overflow-y: auto;
          z-index: 10;
        }
        a {
          color: var(--color-text);
          display: block;
          padding: 8px 12px;
          text-decoration: none;
        }
        a:hover,
        a[aria-current="location"] {
          background: var(--color-hover);
          color: var(--github-fgColor-accent);
        }
        a[aria-current="location"] {
          background: #262c36;
        }
      }
      ul#release-list.github-release-list > li {
        .release-title-wrap {
          flex-direction: column;
          gap: 12px;
        }
        .release-title-wrap h4 {
          display: flex;
          gap: 8px;
          font-size: 26px;
          width: 100%;
          .github-release-name {
            flex: 1;
            min-width: 0;
          }
          > .ui.label,
          .github-release-latest {
            align-self: flex-start;
            flex-shrink: 0;
            margin-top: 12px;
          }
        }
        .github-release-controls {
          flex-wrap: wrap;
        }
        .detail p.text.grey {
          margin-top: 16px;
        }
        .github-release-ref {
          margin-left: 0;
          margin-right: 8px;
        }
        .detail .download .list > li > a {
          flex-basis: 100%;
        }
      }
    }
  }
`;

const githubTagPage = css`
  body:has(.page-content.repository.github-tags) .repository-content-header {
    display: none;
  }
  .page-content.repository.github-tags > .ui.container {
    box-sizing: border-box;
    max-width: calc(100% - 32px);
    padding: 0;
    width: 1116px !important;
  }
  .github-tags-toolbar {
    align-items: center;
    border-bottom: 1px solid var(--color-light-border);
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 24px 0;
  }
  .github-tags-switch {
    display: flex;
  }
  .github-tags-switch a {
    border: 1px solid var(--color-light-border);
    color: var(--color-text);
    line-height: 20px;
    padding: 5px 16px;
    text-decoration: none;
  }
  .github-tags-switch a:first-child {
    border-radius: 6px 0 0 6px;
  }
  .github-tags-switch a:last-child {
    border-radius: 0 6px 6px 0;
    margin-left: -1px;
  }
  .github-tags-switch a:only-child {
    border-radius: 6px;
    margin-left: 0;
  }
  .github-tags-switch a.active {
    background: var(--github-bgColor-accent-emphasis);
    border-color: var(--github-bgColor-accent-emphasis);
    color: var(--github-button-primary-fgColor-rest);
  }
  .github-tags-search {
    width: 248px;
  }
  .github-tags-search .ui.input {
    position: relative;
    width: 100%;
  }
  .github-tags-search .ui.input input {
    width: 100%;
    min-width: 0;
    background: transparent;
    height: 32px;
    padding: 5px 12px 5px 32px;
    border-radius: 6px !important;
    border-right: 1px solid var(--color-light-border) !important;
  }
  .github-tags-search .ui.input button {
    position: absolute;
    left: 0;
    top: 0;
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: 0;
    color: var(--color-text-light-1);
  }
  .github-tags-box {
    border: 1px solid var(--color-light-border);
    border-radius: 6px;
    overflow: hidden;
  }
  .github-tags-box-header {
    align-items: center;
    background: var(--color-box-header);
    border-bottom: 1px solid var(--color-light-border);
    display: flex;
    font-size: 16px;
    font-weight: 600;
    gap: 4px;
    line-height: 20px;
    margin: 0;
    padding: 16px;
  }
  .github-tags-list {
    background: var(--color-box-body);
  }
  .github-tag-row {
    border-bottom: 1px solid var(--color-light-border);
    min-height: 90px;
    padding: 16px;
  }
  .github-tag-row:last-child {
    border-bottom: 0;
  }
  .github-tag-heading {
    align-items: center;
    display: flex;
    justify-content: space-between;
    min-height: 28px;
  }
  .github-tag-heading > a {
    color: var(--color-text);
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    text-decoration: none;
  }
  .github-tag-heading > a:hover {
    color: var(--github-fgColor-accent);
    text-decoration: underline;
  }
  .github-tag-heading .verification-status {
    margin-left: auto;
  }
  .github-tag-actions {
    align-items: center;
    color: var(--color-text-light-1);
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    gap: 16px;
    line-height: 20px;
    margin-top: 8px;
  }
  .github-tag-actions > span,
  .github-tag-actions > a {
    align-items: center;
    display: inline-flex;
    gap: 4px;
    white-space: nowrap;
  }
  .github-tag-actions a {
    color: var(--color-text-light-1);
    text-decoration: none;
  }
  .github-tag-actions a:hover {
    color: var(--github-fgColor-accent);
    text-decoration: none;
  }
  .github-tag-actions svg {
    flex-shrink: 0;
  }
  .github-tag-actions .github-tag-delete {
    cursor: pointer;
  }
  .github-tags-empty {
    padding: 48px 16px;
    text-align: center;
  }
  @media (max-width: 767.98px) {
    .page-content.repository.github-tags > .ui.container {
      width: calc(100% - 32px) !important;
    }
    .github-tags-toolbar {
      align-items: stretch;
      flex-direction: column;
      gap: 12px;
    }
    .github-tags-search { align-self: center; width: 248px; }
    .github-tag-actions {
      gap: 8px 16px;
    }
    .github-tag-heading .verification-status {
      margin-left: 8px;
    }
  }
`;

export default cssCombine(
  releaseHeader,
  tagList,
  releaseList,
  releaseListMobile,
  githubReleasePage,
  releaseRefinements,
  githubTagPage
);

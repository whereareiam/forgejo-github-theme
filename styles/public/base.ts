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

const body = css`
  /*
   * GitHub's own font lists. Like GitHub's repository pages, the theme serves no font files: the
   * first family in each list only takes effect where it is installed, otherwise the system fonts
   * apply, the same ones the visitor sees on GitHub.
   */
  :root {
    --color-selection-bg: ${themeVars.color.primary.light.num1};
    --color-selection-fg: ${themeVars.color.white};
    /*
     * Forgejo 17 colours .text.green/.red/.purple/.orange, markdown alerts and more with --color-thin-*, which it
     * derives from Forgejo-theme-only inputs and no longer falls back from. Undefined, every such icon turned white.
     * Forgejo 16 fell back to the plain colours, so use those.
     */
    --color-thin-green: var(--color-green);
    --color-thin-red: var(--color-red);
    --color-thin-purple: var(--color-purple);
    --color-thin-violet: var(--color-violet);
    --color-thin-orange: var(--color-orange);
    --color-thin-blue: var(--color-blue);
    /* Other variables only Forgejo's own themes define. */
    --color-indicator-offline: var(--color-text-light-2);
    --color-indicator-offline-20: color-mix(in srgb, var(--color-indicator-offline) 10%, transparent);
    --color-indicator-idle: var(--color-green);
    --color-indicator-idle-20: color-mix(in srgb, var(--color-indicator-idle) 10%, transparent);
    --color-indicator-active: var(--color-blue);
    --color-indicator-active-20: color-mix(in srgb, var(--color-indicator-active) 20%, transparent);
    --checkerboard-color-1: var(--color-box-body);
    --checkerboard-color-2: var(--color-secondary);
    --fancy-card-bg: var(--color-box-body);
    --fancy-card-border: var(--color-light-border);
    --color-light-mimic-enabled: var(--color-button);
    --fonts-proportional:
      "Mona Sans VF", -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
    --fonts-monospace:
      "Monaspace Neon", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace,
      var(--fonts-emoji);
    --fonts-emoji: "Apple Color Emoji", "Segoe UI Emoji";
  }

  body {
    font-family: var(--fonts-proportional), var(--fonts-emoji);
    line-height: 1.5;
  }
  a {
    text-underline-offset: 0.2rem; /* 0.2rem 可以始终保持下划线不受 overflow: hidden 的影响 */
    &:hover {
      text-underline-position: unset;
    }
  }
  /* 默认代码块; the code of a block (pre > code) takes its padding from the pre, as on GitHub, so its first line is not indented. */
  code:not(.code-inner, pre > code) {
    padding: 0.2em 0.4em;
  }
  /* 快捷键提示(输入框内) */
  kbd {
    background-color: #0000;
    font-size: 12px;
    box-shadow: none;
    padding: 4px;
    min-width: 20px;
    line-height: 10px;
  }
`;

export default cssCombine(body);

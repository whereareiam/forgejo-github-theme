# Contributing Guide

## Directory Structure

| Directory         | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| src               | Theme generation framework and utilities                          |
| src/core          | Theme generation framework (CSS vars, syntax highlighting styles) |
| src/functions     | Theme utilities (color calculations, etc.)                        |
| src/palette       | Theme palettes (GitHub / Gitea / Catppuccin)                      |
| src/types         | Theme color variable type definitions                             |
| src/vite-plugin   | Theme Vite build plugin                                           |
| styles            | Theme style overrides                                             |
| styles/common     | Reusable CSS style fragments                                      |
| styles/public     | Base element or cross-page element styles                         |
| styles/components | Page-specific styles                                              |
| styles/templates  | Template-specific styles                                          |
| themes            | Color theme definitions                                           |
| primer            | Auto-generated Primer design tokens                               |
| scripts           | Build and utility scripts                                         |
| templates         | Gitea template overrides (optional)                               |
| gitea             | Upstream Gitea reference files                                    |
| screenshots       | Theme screenshots                                                 |

## Contribution Notes

Style contributions are not recommended, as Gitea themes are ultimately delivered as a single CSS file, which introduces
issues like ordering/override conflicts and broad-reaching style impacts.

Each developer has their own approach, making it difficult for review to catch these issues, greatly increasing
maintenance difficulty.

If you have confirmed understanding of Gitea's style layout and the project's approach, please first file an Issue to
confirm scope and expected results, then develop and submit a PR.

If you believe you have a better approach, feel free to submit an Issue.

> [!IMPORTANT]
>
> When submitting a PR, please run `bun commit`

### Pull Requests and Release Notes

Submit changes through a pull request targeting `dev`. Use a specific, release-note-friendly title in the form
`Area: Description`, for example `Templates: Fix commit status badge rendering`.

Apply exactly one primary release label:

- `feature` for new user-facing capabilities or themes
- `change` for intentional style, template, or compatibility improvements
- `bug` for regressions and incorrect rendering
- `dependencies` for dependency and build-tool updates
- `skip-changelog` for internal changes that should not appear in release notes

Add `major` when the change requires a major version bump. It modifies version resolution but does not create a separate
release-notes section.

## Development Environment

The theme depends on the Bun runtime. Please ensure Bun is installed in your environment. Bun 1.3.14 or later is
recommended.

Please use VSCode for development and install the recommended extensions in the repository.

If you prefer fewer extensions, you must install the `vscode-styled-components` extension, which is used for rendering
and checking CSS template strings in TypeScript.

VSCode 1.102.0 or later is recommended for development, as this version and above support hex color rendering in
TypeScript code.

## Development Workflow

### Install Dependencies

```bash
bun install
```

### Set Environment Variables

Create a `.env` file in the project root. Refer to `.env.example` for available variables.

Environment variables are used to send compiled themes to a server for quick preview.

### Compile Themes

Compile and sync to remote server for preview:

```bash
bun bundle:dev
```

Compile all themes:

```bash
bun bundle
```

Format project code:

```bash
bun fmt
```

For PR submission — check and compile all project code with formatting:

```bash
bun commit
```

## Development Conventions

`src`, `styles`, and `themes` are the project's main directories.

When referencing across modules, use package exports paths. For example:
`import { defineTheme } from "@lutinglt/gitea-github-theme/core"`

When referencing files within the same module, use relative paths. For example: `import { defineTheme } from "./theme"`

## Color Theme Contributions

Theme file naming format: `themeName.ts`, used together with `theme.config.ts` registration.

If a theme has both dark and light variants, the framework automatically generates an auto color theme.

The project accepts custom themes and will include them in published releases, but the project owner does not
participate in their maintenance or review.

Please add your author info at the top of the color theme file so Issue reporters can `@` mention you.

It is recommended to use `defineTheme` with the `ThemeColor` type to define theme colors. The framework will
automatically compute and generate all Gitea CSS variables.

Color calculation functions can be imported from `@lutinglt/gitea-github-theme/core` (`scaleColorLight`, `rgba`), or use
the `color2k` library for additional color manipulation.

Example: `themes/my-theme.ts`

```ts
/**
 * @author your-name
 * @description theme description
 */
import { defineTheme, scaleColorLight } from "@lutinglt/gitea-github-theme/core";
import type { ThemeColor, Syntax } from "@lutinglt/gitea-github-theme/core";

const themeColor: ThemeColor = {
  isDarkTheme: true,
  primary: "#0969da",
  primaryContrast: "#f0f6fc",
  secondary: "#30363d",
  base: { red: "#f85149", orange: "#d29922" /* ... */ },
  console: {
    /* ... */
  },
  diff: {
    /* ... */
  },
  other: {
    /* ... */
  },
  github: {
    /* ... */
  },
};

const syntaxColor: Syntax = {
  /* Custom code highlight colors, or import from another theme */
};

export default defineTheme({ colorType: "theme", themeColor, syntaxColor });
```

To use Gitea's native color format, use `colorType: "gitea"` with the `GiteaColor` type:

```ts
import type { GiteaColor, Syntax } from "@lutinglt/gitea-github-theme/core";
import { defineTheme } from "@lutinglt/gitea-github-theme/core";

const giteaColor: GiteaColor = {
  /* ... */
};
const syntaxColor: Syntax = {
  /* ... */
};
export default defineTheme({ colorType: "gitea", themeColor: giteaColor, syntaxColor });
```

After completing theme color development, register the theme series in `theme.config.ts`, compile it, and take
screenshots in a Gitea instance. Place them in the `screenshots` directory with filenames matching the theme names.
(Cloning the repository is recommended to avoid leaking personal information.)

Then add screenshot information to `README.md`.

For color reuse patterns, see the colorblind theme implementation in `themes/github.ts`.

## Theme Style Contributions

Theme styles use the `css()` template string for development. Strings are processed by LightningCSS and support CSS
nesting syntax. Do not use SCSS functions; for complex processing, use TypeScript libraries such as the bundled
`color2k` library.

For complex logic, it is recommended to extract it into functions under the `src/functions` directory.

### Reuse shared page controls

Use `components/common/*/*.css` for sidebars, search fields, selects, counters, switches, empty states, and compact
buttons, and `components/common/dropdown/*` for dropdown variants. `templates/base/head_navbar.tmpl` loads the shared
styles and controllers for all pages. Keep page layout rules in the page stylesheet and pass the page's existing routes,
permissions, and form values into the shared controls.

- **Sidebar:** add `theme-sidebar-layout` and a unique `data-theme-sidebar` storage key to the page, then use
  `theme-sidebar`, `theme-sidebar-content`, and `theme-sidebar-main` for its children. Include
  `shared/theme/sidebar_toggle` inside the sidebar and a button with `data-theme-sidebar-toggle` and
  `data-theme-sidebar-expand` beside the page title. The controller preserves desktop collapse preferences and starts
  collapsed on mobile. See `templates/repo/issue/sidebar.tmpl` and `templates/org/repository_nav.tmpl`.
- **Search:** call `components/common/search/search` with `Value` and `Placeholder` inside the existing form; do not
  write a search input in a page template. `Kind` selects the variant: `submit` (default, trailing search button),
  `icon` (leading search icon, as on releases and Actions), or `plain`. `Name` defaults to `q`, `Label` overrides the
  accessible name, and `Class` adds a page layout hook to the field. For a client-side filter that is never submitted,
  pass `Local` with an `ID` for its controller. Keep hidden filter inputs in the form and size the field from the page
  stylesheet through its `Class` or parent; an unconstrained wrapper can shrink it. A control built by a script uses the
  `theme-search-field` class directly. Forgejo's native query/mode/submit group (`shared/search/combo_multi`) opts in
  with `theme-search-control` on its form.
- **Dropdowns:** call `components/common/dropdown/dropdown` with `Kind` (`single`, `multiple`, or `actions`), `Label`,
  `Items` (the content template name), and `Data` (the page context). `Title`, `Icon`, `IconOnly`, `UpdateLabel`, and
  `Quiet` customize the header and trigger. Use `components/common/dropdown/option` for radio or checkbox rows; action
  rows are links or buttons with `theme-dropdown-action`. Single-choice menus use checkmarks, multiple-choice menus use
  native checkboxes, and action menus omit selection indicators. The controller handles Escape, outside clicks, and
  opening one menu at a time. See `components/repository/filter/filter`, `components/repository/sort/sort`, and
  `org/action_menu_items`.
- **Buttons:** keep Forgejo's native `ui button` classes on buttons Forgejo already renders; the theme styles those
  globally. For a button the theme adds, use `button theme-control` (32px, 12px inline padding) instead of sizing it in
  a page stylesheet, with `theme-control-wide` for the 16px padding GitHub uses on profile pages or
  `theme-control-small` for 28px controls. Use `theme-icon-button` only for icon-only controls. Keep native `primary`,
  `secondary`, and permission checks on actions, and leave page stylesheets to layout such as `flex` and `order`.
- **Counter:** add `theme-counter` to a count pill next to a tab, heading, or filter, including ones a script creates.
  Add `theme-counter-tab` inside a tab, where GitHub's counter is 18px tall and semibold. Keep only layout (`margin`,
  `flex`) under the page's own class.
- **Segmented switch:** use `<nav class="theme-switch">` with links and `active` on the current one, as on the releases
  and tags pages.
- **Empty state:** use `theme-empty` for a bordered "nothing here" box holding an icon, an `h2` or `h3`, and an optional
  paragraph. `templates/user/profile_empty.tmpl` renders one from `Icon`, `Title`, and `Description`. Short inline
  messages inside a list or menu stay plain text.
- **Label:** use Forgejo's native `ui basic label` for outline labels such as visibility or package type; do not build a
  page-specific pill.
- **Select:** wrap a native `<select class="theme-select">` in `<span class="theme-select-wrap">`. The options stay in
  the page template. See `templates/user/profile_packages.tmpl`.

For repository filtering, add `data-theme-repository-search` to the form and render
`components/repository/results/results` after it. `repository-search.js` updates that result fragment through the same
server-rendered GET route, preserves search and sort values, and cancels obsolete requests. Checkbox criteria combine,
while opposing values of one criterion are exclusive. Clear filters is an action, not a selectable option. Keep
`tab=overview` or `tab=repositories` in the organization form; query parameters alone do not determine the page layout.
Use `org/repository_pagination` so pagination retains the same view even without the enhancement script. Errors leave
the previous results visible and display a retry message; browser history restores the server-rendered controls and
results.

After changing a component, verify each consuming page at desktop and mobile widths. Check search submission, retained
filters, sidebar focus and collapse behavior, and Escape/outside-click dismissal for select menus.

### Use theme tokens

All colors used in theme styles must use color variables. Import them via
`import { themeVars } from "@lutinglt/gitea-github-theme/core"`.

When using theme-specific color variables like `${themeVars.github.xxx}`, please add the file and variable to the
corresponding variable's comment in `src/types/color/github`.

For small border-radius values (6px), use the global border-radius variable. Import via
`import { otherThemeVars } from "@lutinglt/gitea-github-theme/core"` and use `${otherThemeVars.border.radius}`.

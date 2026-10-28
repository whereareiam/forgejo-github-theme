import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const read = (...path: string[]) => readFileSync(join(root, ...path), "utf8");
const results = read("components", "repository", "code-search", "results.tmpl");
const search = read("templates", "shared", "search", "code", "search.tmpl");

it("renders repository, owner and Explore code search through the one result component", () => {
  expect(read("templates", "shared", "search", "code", "results.tmpl").trim()).toBe(
    '{{template "components/repository/code-search/results" .}}'
  );
  expect(search).toContain('{{template "shared/search/code/results" .}}');
  // Explore and owner code search keep Forgejo's own page templates, which render the same shared search.
  expect(read("templates", "repo", "search.tmpl")).toContain('{{template "shared/search/code/search" .}}');
});

it("keeps Forgejo's search form, branch choice for git grep and unavailable message", () => {
  expect(search).toContain('<form class="ui form ignore-dirty theme-search-control">');
  expect(search).toContain('<input type="hidden" name="path" value="{{.CodeSearchPath}}">');
  expect(search).toContain('"Options" $.CodeSearchOptions');
  expect(search).toContain("{{if .CodeIndexerDisabled}}");
  expect(search).toContain('{{template "repo/branch_dropdown"');
  expect(search).toContain('"search.code_search_unavailable"');
});

it("heads each file with its path and matching lines, and keeps the language filter, path and pagination", () => {
  expect(results).toContain('"repo.activity.git_stats_file_1" "repo.activity.git_stats_file_n"');
  expect(results).toContain('<details class="theme-code-result repo-search-result" open>');
  expect(results).toContain('"search-highlight"');
  expect(results).toContain('<span class="theme-counter">{{$matches}}</span>');
  expect(results).toContain('href="{{$fileLink}}#L{{.Num}}"');
  expect(results).toContain("&l={{$term.Language}}");
  expect(results).toContain("&path={{$href}}");
  expect(results).toContain('{{template "base/paginate" .}}');
  expect(results).toContain('"search.no_results"');
  expect(results).toContain('"explore.code_last_indexed_at"');
  expect(read("templates", "base", "component_assets.tmpl")).toContain(
    "/css/components/repository/code-search/code-search.css"
  );
});

it("overrides Fomantic's vertical menu with a selector that outranks it", () => {
  const css = read("components", "repository", "code-search", "code-search.css");
  // `.ui.vertical.menu` sets a 15rem block; a lower-specificity rule left the filter narrow and stacked on phones.
  expect(css).toContain("& .ui.vertical.menu.theme-nav-list {\n    width: 100%;");
  expect(css).toMatch(/& \.ui\.vertical\.menu\.theme-nav-list \{\n\s+display: flex;\n\s+flex-direction: row;/);
  expect(css).toContain("content: none !important;");
});

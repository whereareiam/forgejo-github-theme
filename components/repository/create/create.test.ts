import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const read = (...path: string[]) => readFileSync(join(root, ...path), "utf8");

const owner = read("components", "repository", "create", "owner.tmpl");
const visibility = read("components", "repository", "create", "visibility.tmpl");
const migrations = readdirSync(join(root, "templates", "repo", "migrate")).filter(
  file => file.endsWith(".tmpl") && file !== "migrate.tmpl"
);

describe("Owner / Repository name", () => {
  it("keeps the fields and ids Forgejo's scripts read", () => {
    expect(owner).toContain('<input type="hidden" id="uid" name="uid" value="{{.Owner.ID}}" required>');
    expect(owner).toContain('<input id="repo_name" name="repo_name" value="{{.Name}}" required maxlength="100"');
    expect(owner).toContain('class="ui selection owner dropdown"');
    expect(owner).toContain('<span class="theme-create-slash" aria-hidden="true">/</span>');
  });

  it("is the only owner and name field on every form that creates a repository", () => {
    const pages = [
      ["templates", "repo", "create_basic.tmpl"],
      ["templates", "repo", "pulls", "fork.tmpl"],
      ...migrations.map(file => ["templates", "repo", "migrate", file]),
    ];
    for (const page of pages) {
      const template = read(...page);
      expect(template, page.join("/")).toContain('{{template "components/repository/create/owner" dict');
      expect(template, page.join("/")).not.toContain('name="uid"');
      expect(template, page.join("/")).not.toContain('name="repo_name"');
    }
  });
});

describe("visibility", () => {
  it("sends Forgejo's private field as the checkbox did, and nothing when locked", () => {
    expect(visibility).toContain('"Value" "false" "Checked" (not $private)');
    expect(visibility).toContain('"Value" "on" "Checked" $private');
    expect(visibility).toContain('{{if $locked}}{{$name = ""}}{{end}}');
    expect(visibility).toContain('ctx.Locale.Tr "repo.visibility_helper_forced"');
  });

  it("replaces the private checkbox on the create and migration forms", () => {
    for (const page of [["create_basic.tmpl"], ...migrations.map(file => ["migrate", file])]) {
      const template = read("templates", "repo", ...page);
      expect(template, page.join("/")).toContain(
        '{{template "components/repository/create/visibility" dict "Private" .private "Forced" .IsForcedPrivate}}'
      );
      expect(template, page.join("/")).not.toContain('name="private"');
    }
  });
});

describe("new repository", () => {
  const create = read("templates", "repo", "create.tmpl");
  const init = read("templates", "repo", "create_init.tmpl");
  const template = read("templates", "repo", "create_from_template.tmpl");

  it("keeps the template search and the rows it hides inside the configuration box", () => {
    expect(template).toContain('<div id="repo_template_search" class="ui search selection dropdown"');
    expect(template).toContain('<input type="hidden" id="repo_template" name="repo_template"');
    expect(template).toContain('<fieldset id="template_units" class="tw-hidden');
    expect(create.indexOf('template "repo/create_from_template"')).toBeLessThan(create.indexOf('id="non_template"'));
    expect(create.indexOf('id="non_template"')).toBeLessThan(create.indexOf('template "repo/create_init"'));
    expect(create.indexOf('template "repo/create_init"')).toBeLessThan(
      create.indexOf('template "repo/create_advanced"')
    );
  });

  it("draws auto_init as a switch whose label still shows the rows after it", () => {
    expect(init).toMatch(
      /<label class="theme-create-row">[\s\S]*name="auto_init" type="checkbox"[\s\S]*<\/label>\s*<div class="hide-unless-checked">/
    );
    for (const field of ['name="gitignores"', 'name="license"', 'name="readme"']) expect(init).toContain(field);
  });

  it("keeps every field Forgejo's create form sends", () => {
    const all = [
      create,
      read("templates", "repo", "create_basic.tmpl"),
      template,
      init,
      read("templates", "repo", "create_advanced.tmpl"),
      owner,
    ].join("\n");
    for (const field of [
      "uid",
      "repo_name",
      "description",
      "repo_template",
      "git_content",
      "webhooks",
      "topics",
      "avatar",
      "labels",
      "protected_branch",
      "git_hooks",
      "auto_init",
      "gitignores",
      "license",
      "readme",
      "issue_labels",
      "object_format_name",
      "default_branch",
      "template",
    ])
      expect(all, field).toContain(`name="${field}"`);
  });
});

describe("new organization", () => {
  const org = read("templates", "org", "create.tmpl");

  it("keeps Forgejo's Visibility label over the choices and the radios Forgejo's script reads", () => {
    expect(org).toContain('<label id="org_visibility_label">{{ctx.Locale.Tr "org.settings.visibility"}}</label>');
    expect(org).toContain('role="radiogroup" aria-labelledby="org_visibility_label"');
    for (const value of ["0", "1", "2"])
      expect(org).toContain(`"Class" "enable-system-radio" "Name" "visibility" "Value" "${value}"`);
  });
});

describe("migration", () => {
  it("keeps an access token's help link beside the field", () => {
    const css = read("styles", "pages", "create.css");
    expect(css).toContain(".page-content.new.migrate .ui.form .inline.field:has(> input + a > .svg)");
    expect(read("templates", "repo", "migrate", "github.tmpl")).toMatch(/id="auth_token"[^\n]*>\s*<a target="_blank"/);
  });
});

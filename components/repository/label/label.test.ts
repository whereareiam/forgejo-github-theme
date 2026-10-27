import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const read = (...path: string[]) => readFileSync(join(root, ...path), "utf8");
const templates = (directory: string) =>
  readdirSync(join(root, directory), { recursive: true })
    .map(file => join(directory, String(file)))
    .filter(file => file.endsWith(".tmpl"));

const label = read("components", "repository", "label", "label.tmpl");
const event = read("templates", "repo", "issue", "view_content", "labels_event.tmpl");
const classes = (template: string) => new Set(template.match(/repository-label[\w-]*(?=[%"\s{])/g));

it("renders every issue label through the shared label", () => {
  for (const file of [...templates("templates"), ...templates("components")])
    expect(read(file).replace(/{{-? \/\*[\s\S]*?\*\/ -?}}/g, ""), file).not.toMatch(/\bRenderLabels?\b/);
});

it("draws a scoped label as one pill of a scope and an item", () => {
  expect(label).toContain(".ExclusiveScope");
  expect(label).toContain('class="repository-label repository-label-scope"');
  expect(label).toContain('class="repository-label repository-label-item"');
  expect(label).toContain('(slice .Name (len (print $scope "/")))');
});

it("keeps the timeline's label markup in step with the shared label", () => {
  expect(classes(event)).toEqual(classes(label));
  expect(event).toContain("--repository-label-color: %s; --repository-label-foreground: %s");
  expect(label).toContain(
    "--repository-label-color: {{.Color}}; --repository-label-foreground: {{ContrastColor .Color}}"
  );
});

it("lists the label menu's labels as shared options", () => {
  const field = read("templates", "repo", "issue", "labels", "labels_selector_field.tmpl");
  expect(field).toContain('{{template "components/repository/label/options" .Labels}}');
  expect(field).toContain('{{template "components/repository/label/options" .OrgLabels}}');
  const option = read("components", "repository", "label", "option.tmpl");
  for (const hook of ["data-id=", "data-scope=", "data-id-selector=", '"octicon-check', 'class="desc"'])
    expect(option).toContain(hook);
});

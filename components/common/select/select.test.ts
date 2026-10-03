import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const root = fileURLToPath(new URL("../../..", import.meta.url));

it("styles every template select through the shared select", () => {
  const selects = ["templates", "components"].flatMap(directory =>
    readdirSync(join(root, directory), { recursive: true })
      .map(file => `${directory}/${String(file)}`)
      .filter(file => file.endsWith(".tmpl"))
      .flatMap(file => readFileSync(join(root, file), "utf8").match(/<select\b[^>]*>/g) ?? [])
  );
  expect(selects.length).toBeGreaterThan(0);
  for (const select of selects) expect(select).toContain('class="theme-select"');
  const stylesheet = readFileSync(join(root, "components/common/select/select.css"), "utf8");
  expect(stylesheet).toContain(".theme-select-wrap > .theme-select");
});

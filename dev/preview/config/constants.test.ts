import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, it } from "vitest";

import pkg from "../../../package.json";
import { COMPOSE } from "./constants.ts";

it("runs the Forgejo release that package.json pins", () => {
  const compose = readFileSync(join(import.meta.dirname, "../../docker-compose.yml"), "utf8");
  const image = /^\s+image: (code\.forgejo\.org\/forgejo\/forgejo:\S+)$/m.exec(compose)?.[1];
  expect(image).toBe(`code.forgejo.org/forgejo/forgejo:${pkg.forgejo}-rootless`);
  expect(COMPOSE.image).toBe(image);
});

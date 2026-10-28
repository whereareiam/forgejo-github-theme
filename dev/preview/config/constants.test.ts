import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

import { COMPOSE } from "./constants.ts";

it("runs its one-off containers on the image of the Compose service", () => {
  // The ownership repair and database cleanup start the image by name; another version would be pulled beside it.
  const compose = readFileSync(fileURLToPath(new URL(`../../../${COMPOSE.file}`, import.meta.url)), "utf-8");
  const service = compose.slice(compose.indexOf(`  ${COMPOSE.service}:\n`));
  expect(service.match(/^ {4}image: (\S+)$/m)?.[1]).toBe(COMPOSE.image);
});

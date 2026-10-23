import { describe, expect, it } from "vitest";
import { tokens } from "./pagination";

describe("pagination tokens", () => {
  it("only refers to --ds- variables", () => {
    for (const value of Object.values(tokens)) expect(value).toMatch(/^var\(--ds-/);
  });
});

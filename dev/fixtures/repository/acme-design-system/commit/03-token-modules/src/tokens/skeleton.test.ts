import { describe, expect, it } from "vitest";
import { tokens } from "./skeleton";

describe("skeleton tokens", () => {
  it("only refers to --ds- variables", () => {
    for (const value of Object.values(tokens)) expect(value).toMatch(/^var\(--ds-/);
  });
});

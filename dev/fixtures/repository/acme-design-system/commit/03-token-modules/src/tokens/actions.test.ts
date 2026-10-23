import { describe, expect, it } from "vitest";
import { tokens } from "./actions";

describe("actions tokens", () => {
  it("only refers to --ds- variables", () => {
    for (const value of Object.values(tokens)) expect(value).toMatch(/^var\(--ds-/);
  });
});

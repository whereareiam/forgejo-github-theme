import { describe, expect, it } from "vitest";
import { tokens } from "./button";

describe("button tokens", () => {
  it("only refers to --ds- variables", () => {
    for (const value of Object.values(tokens)) expect(value).toMatch(/^var\(--ds-/);
  });
});

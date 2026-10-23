import { describe, expect, it } from "vitest";
import { tokens } from "./textarea";

describe("textarea tokens", () => {
  it("only refers to --ds- variables", () => {
    for (const value of Object.values(tokens)) expect(value).toMatch(/^var\(--ds-/);
  });
});

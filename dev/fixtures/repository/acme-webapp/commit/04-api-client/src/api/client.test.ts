import { expect, it } from "vitest";

import { ApiClient } from "./client";

it("keeps the base URL", () => {
  expect(new ApiClient("https://api.acme.example")).toBeInstanceOf(ApiClient);
});

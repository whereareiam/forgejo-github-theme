import { expect, it } from "vitest";

import { FixtureClock } from "./FixtureClock.ts";

const clock = new FixtureClock(new Date("2026-10-03T12:30:00Z"));

it("counts days back from the day of seeding", () => {
  expect(clock.at(2, "09:00").toISOString()).toBe("2026-10-01T09:00:00.000Z");
  expect(clock.at(120).toISOString()).toBe("2026-06-05T12:00:00.000Z");
});

it("never returns a time after the moment of seeding", () => {
  expect(clock.at(0, "23:00").toISOString()).toBe("2026-10-03T12:30:00.000Z");
  expect(clock.unix(0, "23:00")).toBe(Date.parse("2026-10-03T12:30:00Z") / 1000);
});

import { expect, it } from "vitest";

import { FixtureActionLog } from "./FixtureActionLog.ts";

it("splits a log into jobs and steps", () => {
  const log = new FixtureActionLog(
    "::job build\n::step Set up job\nfirst\nsecond\n::step Complete job\n::job test\n::step run\nthird\n",
    "test"
  );
  expect(log.steps("build")).toEqual([
    { name: "Set up job", lines: ["first", "second"] },
    { name: "Complete job", lines: [] },
  ]);
  expect(log.steps("test")).toEqual([{ name: "run", lines: ["third"] }]);
  expect(log.steps("missing")).toEqual([]);
});

it("rejects lines outside a job or step", () => {
  expect(() => new FixtureActionLog("::step orphan\n", "test")).toThrow("before any ::job");
  expect(() => new FixtureActionLog("::job build\nstray\n", "test")).toThrow("before any ::step");
});

it("encodes line offsets the way Forgejo reads them", () => {
  // Two lines of 89 and 57 bytes, as recorded by a real Forgejo 16 task: offsets 0 and 89.
  const first = `${"a".repeat(88)}\n`;
  const second = `${"b".repeat(56)}\n`;
  expect([...FixtureActionLog.indexes([first, second])]).toEqual([0, 178, 1]);
});

import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const script = readFileSync(new URL("../public/assets/js/blame-age.js", import.meta.url), "utf8");

/** Blame rows as Forgejo renders them: a hunk's first row carries its date, the hunk's other rows none. */
function rows(hunks: (string | null)[][]) {
  return hunks.flatMap(([date, ...rest]) =>
    [date, ...rest].map((value, index) => {
      const style = new Map<string, string>();
      const time = index === 0 && value ? { getAttribute: () => value } : null;
      return {
        style: { setProperty: (name: string, step: string) => style.set(name, step) },
        querySelector: () => time,
        age: () => style.get("--theme-blame-age"),
      };
    })
  );
}

function run(table: ReturnType<typeof rows>) {
  runInNewContext(script, { document: { querySelectorAll: () => table } });
  return table.map(row => row.age());
}

describe("blame age bars", () => {
  it("scales each hunk from the file's oldest commit to its newest and colours every row of the hunk", () => {
    const table = rows([
      ["2024-01-01T00:00:00Z", null, null],
      ["2026-01-01T00:00:00Z", null],
      ["2025-01-01T00:00:00Z"],
    ]);
    expect(run(table)).toEqual(["19%", "19%", "19%", "100%", "100%", "64%"]);
  });

  it("gives a file with one commit the newest step", () => {
    expect(run(rows([["2026-07-19T16:45:00Z", null, null]]))).toEqual(["100%", "100%", "100%"]);
  });

  it("leaves rows without a readable date alone", () => {
    expect(run(rows([["not a date", null]]))).toEqual([undefined, undefined]);
  });
});

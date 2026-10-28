import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it } from "vitest";

const script = readFileSync(new URL("../public/assets/js/pull-review.js", import.meta.url), "utf8");

function fixture(label: string) {
  const button = { textContent: label };
  const classes = new Set<string>();
  const form = { querySelector: () => button };
  const actions = {
    querySelector: () => form,
    classList: { toggle: (name: string, value: boolean) => (value ? classes.add(name) : classes.delete(name)) },
  };
  let sync = () => {};
  runInNewContext(script, {
    document: { querySelector: () => actions },
    window: {
      config: {
        pageData: {
          pullRequestMergeForm: {
            textAutoMergeButtonWhenSucceed: "(When checks succeed)",
            mergeStyles: [{ textDoMerge: "Create merge commit" }, { textDoMerge: "Squash and merge" }],
          },
        },
      },
    },
    MutationObserver: class {
      constructor(callback: () => void) {
        sync = callback;
      }
      observe() {}
    },
  });
  const relabel = (text: string) => {
    button.textContent = text;
    sync();
  };
  return { classes, relabel };
}

describe("pull request merge button", () => {
  it("marks a merge scheduled for when checks succeed, by Forgejo's auto-merge label", () => {
    const f = fixture("\n  Create merge commit\n  ");
    expect(f.classes.has("merge-scheduled")).toBe(false);
    f.relabel("\n  Squash and merge\n  (When checks succeed)\n");
    expect(f.classes.has("merge-scheduled")).toBe(true);
    f.relabel("Squash and merge");
    expect(f.classes.has("merge-scheduled")).toBe(false);
  });

  it("does not mistake a merge style missing from the page data for a scheduled merge", () => {
    expect(fixture("Rebase and merge").classes.has("merge-scheduled")).toBe(false);
  });
});

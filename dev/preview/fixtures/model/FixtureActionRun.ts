export type FixtureActionStatus = "success" | "failure" | "cancelled" | "skipped";

/** One workflow run. Its log sits beside it under the same name, split by `::job <id>` and `::step <name>` lines. */
export interface FixtureActionRun {
  /** The workflow's display name, as in its `name:` key. */
  readonly name: string;
  /** The workflow's file name under `.forgejo/workflows`. */
  readonly workflow: string;
  readonly title: string;
  readonly event: "push" | "pull_request";
  readonly ref: string;
  readonly commit: string;
  readonly actor: string;
  readonly daysAgo: number;
  readonly time: string;
  readonly jobs: readonly FixtureActionJob[];
}

export interface FixtureActionJob {
  readonly id: string;
  readonly status: FixtureActionStatus;
  readonly steps: readonly FixtureActionStep[];
}

/** `Set up job` and `Complete job` are the steps Forgejo adds itself; list them to give them log lines and a duration. */
export interface FixtureActionStep {
  readonly name: string;
  readonly status: FixtureActionStatus;
  readonly seconds: number;
}

import type { FixtureActionRunFile } from "../FixtureRepositoryDirectory.ts";
import type { FixtureRepositoryDescription } from "../model/FixtureRepositoryDescription.ts";
import { BuiltHistory } from "./BuiltHistory.ts";

export interface SeededIssue {
  readonly index: number;
  readonly title: string;
  readonly author: string;
  readonly kind: "issue" | "pull";
  readonly state: "open" | "closed" | "merged";
  readonly daysAgo: number;
}

export interface SeededComment {
  readonly id: number;
  readonly daysAgo: number;
}

export interface SeededRelease {
  readonly id: number;
  readonly tag: string;
  readonly name: string;
  readonly draft: boolean;
  readonly daysAgo: number;
}

/** What the API created for one fixture repository; the database step adjusts times and adds Actions from it. */
export class SeededRepository {
  public readonly id: number;
  public readonly ownerId: number;
  public readonly description: FixtureRepositoryDescription;
  public readonly history: BuiltHistory;
  public readonly actionRuns: readonly FixtureActionRunFile[];
  public readonly issues: SeededIssue[] = [];
  public readonly comments: SeededComment[] = [];
  public readonly releases: SeededRelease[] = [];

  public constructor(
    id: number,
    ownerId: number,
    description: FixtureRepositoryDescription,
    history: BuiltHistory,
    actionRuns: readonly FixtureActionRunFile[]
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.description = description;
    this.history = history;
    this.actionRuns = actionRuns;
  }

  public get identifier(): string {
    return `${this.description.owner}/${this.description.name}`;
  }
}

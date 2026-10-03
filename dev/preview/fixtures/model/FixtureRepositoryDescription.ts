export interface FixtureRepositoryDescription {
  readonly owner: string;
  readonly name: string;
  readonly description: string;
  readonly website: string;
  readonly topics: readonly string[];
  readonly createdDaysAgo: number;
  readonly stars: readonly string[];
  readonly labels: readonly FixtureLabel[];
  readonly milestones: readonly FixtureMilestone[];
  readonly issues: readonly FixtureIssue[];
  readonly pulls: readonly FixturePull[];
  readonly releases: readonly FixtureRelease[];
  readonly packages: readonly FixturePackage[];
}

export interface FixtureLabel {
  readonly name: string;
  readonly color: string;
  readonly description: string;
}

export interface FixtureMilestone {
  readonly title: string;
  readonly description: string;
  readonly state: "open" | "closed";
  readonly dueInDays: number;
}

export interface FixtureComment {
  readonly author: string;
  readonly daysAgo: number;
  readonly body: string;
}

export interface FixtureIssue {
  readonly title: string;
  readonly body: string;
  readonly author: string;
  readonly labels: readonly string[];
  readonly milestone: string | null;
  readonly assignees: readonly string[];
  readonly state: "open" | "closed";
  readonly daysAgo: number;
  readonly comments: readonly FixtureComment[];
}

export interface FixturePull {
  readonly title: string;
  readonly body: string;
  readonly author: string;
  readonly head: string;
  readonly labels: readonly string[];
  readonly milestone: string | null;
  readonly state: "open" | "closed" | "merged";
  readonly daysAgo: number;
  readonly comments: readonly FixtureComment[];
}

export interface FixtureRelease {
  readonly tag: string;
  readonly name: string;
  readonly body: string;
  readonly draft: boolean;
  readonly prerelease: boolean;
  readonly daysAgo: number;
  readonly assets: readonly FixtureFile[];
}

export interface FixtureFile {
  readonly name: string;
  readonly content: string;
}

export interface FixturePackage {
  readonly type: "generic";
  readonly name: string;
  readonly version: string;
  readonly file: string;
  readonly content: string;
}

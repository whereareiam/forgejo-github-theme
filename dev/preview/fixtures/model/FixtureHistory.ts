export interface FixtureHistory {
  readonly defaultBranch: string;
  readonly commits: readonly FixtureCommit[];
  readonly tags: readonly FixtureTag[];
}

/** A commit applies the files under `commit/<id>/`. A branch seen for the first time starts at the default branch's tip. */
export interface FixtureCommit {
  readonly id: string;
  readonly branch: string;
  readonly author: string;
  readonly daysAgo: number;
  readonly time: string;
  readonly message: string;
}

export interface FixtureTag {
  readonly name: string;
  readonly commit: string;
}

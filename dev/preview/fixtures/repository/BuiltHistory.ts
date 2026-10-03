export interface BuiltCommit {
  readonly id: string;
  readonly sha: string;
  readonly branch: string;
  readonly author: string;
  readonly message: string;
  readonly date: Date;
}

/** A fixture history after it has been turned into real commits. */
export class BuiltHistory {
  public readonly defaultBranch: string;
  public readonly commits: readonly BuiltCommit[];
  public readonly tags: ReadonlyMap<string, BuiltCommit>;

  public constructor(defaultBranch: string, commits: readonly BuiltCommit[], tags: ReadonlyMap<string, BuiltCommit>) {
    this.defaultBranch = defaultBranch;
    this.commits = commits;
    this.tags = tags;
  }

  public commit(id: string): BuiltCommit {
    const commit = this.commits.find(candidate => candidate.id === id);
    if (!commit) throw new Error(`Fixture history has no commit ${id}.`);
    return commit;
  }

  public latest(): BuiltCommit {
    return this.commits.reduce((latest, commit) => (commit.date > latest.date ? commit : latest));
  }
}

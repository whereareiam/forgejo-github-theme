import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { COMMANDS } from "../../config/constants.ts";
import { CommandRunner } from "../../CommandRunner.ts";
import { FixtureClock } from "../FixtureClock.ts";
import { FixtureRepositoryDirectory } from "../FixtureRepositoryDirectory.ts";
import type { FixtureUser } from "../model/FixtureOwners.ts";
import { BuiltHistory } from "./BuiltHistory.ts";
import type { BuiltCommit } from "./BuiltHistory.ts";

/** Replays a fixture's commit folders into a temporary Git repository and pushes it to the preview. */
export class FixtureHistoryBuilder {
  private readonly runner: CommandRunner;
  private readonly clock: FixtureClock;

  public constructor(runner: CommandRunner, clock: FixtureClock) {
    this.runner = runner;
    this.clock = clock;
  }

  public push(
    fixture: FixtureRepositoryDirectory,
    users: ReadonlyMap<string, FixtureUser>,
    remote: string
  ): BuiltHistory {
    const checkout = mkdtempSync(join(tmpdir(), "forgejo-fixture-"));
    try {
      const history = this.build(fixture, users, checkout);
      this.git(checkout, ["push", "--quiet", "--mirror", remote]);
      return history;
    } finally {
      rmSync(checkout, { recursive: true, force: true });
    }
  }

  private build(
    fixture: FixtureRepositoryDirectory,
    users: ReadonlyMap<string, FixtureUser>,
    checkout: string
  ): BuiltHistory {
    const source = fixture.history();
    this.git(checkout, ["init", "--quiet", "--initial-branch", source.defaultBranch]);
    const branches = new Set<string>([source.defaultBranch]);
    const commits: BuiltCommit[] = [];

    for (const commit of source.commits) {
      const author = users.get(commit.author);
      if (!author) throw new Error(`Fixture ${fixture.name} commit ${commit.id} has unknown author ${commit.author}.`);
      if (commits.length > 0) this.checkout(checkout, commit.branch, branches, source.defaultBranch);
      cpSync(fixture.commitDirectory(commit.id), checkout, { recursive: true });
      const date = this.clock.at(commit.daysAgo, commit.time);
      const identity = {
        GIT_AUTHOR_NAME: author.fullName,
        GIT_AUTHOR_EMAIL: author.email,
        GIT_AUTHOR_DATE: date.toISOString(),
        GIT_COMMITTER_NAME: author.fullName,
        GIT_COMMITTER_EMAIL: author.email,
        GIT_COMMITTER_DATE: date.toISOString(),
      };
      this.git(checkout, ["add", "--all"]);
      this.git(checkout, ["commit", "--quiet", "--no-gpg-sign", "--message", commit.message], identity);
      const sha = this.git(checkout, ["rev-parse", "HEAD"]).trim();
      commits.push({ id: commit.id, sha, branch: commit.branch, author: commit.author, message: commit.message, date });
    }

    const tags = new Map<string, BuiltCommit>();
    for (const tag of source.tags) {
      const commit = commits.find(candidate => candidate.id === tag.commit);
      if (!commit) throw new Error(`Fixture ${fixture.name} tag ${tag.name} points at unknown commit ${tag.commit}.`);
      this.git(checkout, ["tag", tag.name, commit.sha]);
      tags.set(tag.name, commit);
    }
    this.git(checkout, ["checkout", "--quiet", source.defaultBranch]);
    return new BuiltHistory(source.defaultBranch, commits, tags);
  }

  private checkout(checkout: string, branch: string, branches: Set<string>, defaultBranch: string): void {
    if (branches.has(branch)) {
      this.git(checkout, ["checkout", "--quiet", branch]);
      return;
    }
    this.git(checkout, ["checkout", "--quiet", "-b", branch, defaultBranch]);
    branches.add(branch);
  }

  private git(checkout: string, args: readonly string[], environment: NodeJS.ProcessEnv = {}): string {
    return this.runner.captureIn(checkout, COMMANDS.git, args, environment);
  }
}

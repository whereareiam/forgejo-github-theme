import { FixtureClock } from "../FixtureClock.ts";
import type { FixtureOwners } from "../model/FixtureOwners.ts";
import type { BuiltCommit } from "../repository/BuiltHistory.ts";
import { SeededRepository } from "../repository/SeededRepository.ts";
import { FixtureDatabase } from "./FixtureDatabase.ts";

/** Forgejo's activity operation types (models/activities/action.go). */
const OPERATION = {
  createRepository: 1,
  commit: 5,
  createIssue: 6,
  createPull: 7,
  pushTag: 9,
  mergePull: 11,
  closeIssue: 12,
  closePull: 14,
  publishRelease: 24,
} as const;

/** Forgejo's comment types for the events that end an issue or pull request (models/issues/comment.go). */
const COMMENT_TYPE = { close: 2, mergePull: 28 } as const;

/**
 * The API stamps everything it creates with the current time. This moves the declared `daysAgo` values into
 * the database and rebuilds each repository's activity feed from them, so lists, feeds and the contribution
 * heatmap look like months of use.
 */
export class FixtureTimelineWriter {
  private readonly database: FixtureDatabase;
  private readonly clock: FixtureClock;
  private readonly userIds: ReadonlyMap<string, number>;

  public constructor(database: FixtureDatabase, clock: FixtureClock, userIds: ReadonlyMap<string, number>) {
    this.database = database;
    this.clock = clock;
    this.userIds = userIds;
  }

  public writeOwners(owners: FixtureOwners): void {
    for (const user of owners.users)
      this.database.run("UPDATE user SET created_unix = ? WHERE lower_name = ?", [
        this.clock.unix(user.joinedDaysAgo),
        user.login.toLowerCase(),
      ]);
  }

  public writeRepository(repository: SeededRepository): void {
    const created = this.clock.unix(repository.description.createdDaysAgo, "08:00");
    const updated = Math.floor(repository.history.latest().date.getTime() / 1000);
    this.database.run("UPDATE repository SET created_unix = ?, updated_unix = ? WHERE id = ?", [
      created,
      updated,
      repository.id,
    ]);

    for (const issue of repository.issues) {
      const opened = this.clock.unix(issue.daysAgo);
      const closed = this.clock.unix(Math.max(issue.daysAgo - 1, 0));
      this.database.run(
        'UPDATE issue SET created_unix = ?, updated_unix = ?, closed_unix = CASE WHEN is_closed THEN ? ELSE closed_unix END WHERE repo_id = ? AND "index" = ?',
        [opened, issue.state === "open" ? opened : closed, closed, repository.id, issue.index]
      );
    }
    this.writeTimelineEvents(repository);
    for (const comment of repository.comments) {
      const time = this.clock.unix(comment.daysAgo, "15:00");
      this.database.run("UPDATE comment SET created_unix = ?, updated_unix = ? WHERE id = ?", [time, time, comment.id]);
    }
    for (const release of repository.releases)
      this.database.run("UPDATE release SET created_unix = ? WHERE id = ?", [
        this.clock.unix(release.daysAgo, "16:00"),
        release.id,
      ]);

    this.writeActivity(repository, created);
  }

  /** Forgejo records label, milestone, push, close and merge events as comments stamped with the seed time. */
  private writeTimelineEvents(repository: SeededRepository): void {
    const issue = 'SELECT id FROM issue WHERE repo_id = ? AND "index" = ?';
    for (const entry of repository.issues) {
      const opened = this.clock.unix(entry.daysAgo);
      const closed = this.clock.unix(Math.max(entry.daysAgo - 1, 0));
      this.database.run(`UPDATE comment SET created_unix = ?, updated_unix = ? WHERE issue_id IN (${issue})`, [
        opened,
        opened,
        repository.id,
        entry.index,
      ]);
      this.database.run(
        `UPDATE comment SET created_unix = ?, updated_unix = ? WHERE type IN (${COMMENT_TYPE.close}, ${COMMENT_TYPE.mergePull}) AND issue_id IN (${issue})`,
        [closed, closed, repository.id, entry.index]
      );
    }
  }

  private writeActivity(repository: SeededRepository, created: number): void {
    this.database.run("DELETE FROM action WHERE repo_id = ?", [repository.id]);
    const author = (login: string): number => this.userId(login);
    const firstAuthor = repository.history.commits[0]?.author ?? "";
    this.record(repository, OPERATION.createRepository, author(firstAuthor), created, "", "");

    for (const commit of repository.history.commits)
      this.record(
        repository,
        OPERATION.commit,
        author(commit.author),
        this.unix(commit),
        `refs/heads/${commit.branch}`,
        this.pushContent([commit], commit)
      );
    for (const [tag, commit] of repository.history.tags)
      this.record(
        repository,
        OPERATION.pushTag,
        author(commit.author),
        this.unix(commit) + 60,
        `refs/tags/${tag}`,
        this.pushContent([], commit)
      );

    for (const issue of repository.issues) {
      const content = `${issue.index}|${issue.title}`;
      const pull = issue.kind === "pull";
      const opened = this.clock.unix(issue.daysAgo);
      const closed = this.clock.unix(Math.max(issue.daysAgo - 1, 0));
      this.record(
        repository,
        pull ? OPERATION.createPull : OPERATION.createIssue,
        author(issue.author),
        opened,
        "",
        content
      );
      if (issue.state === "merged")
        this.record(repository, OPERATION.mergePull, author(issue.author), closed, "", content);
      if (issue.state === "closed")
        this.record(
          repository,
          pull ? OPERATION.closePull : OPERATION.closeIssue,
          author(issue.author),
          closed,
          "",
          content
        );
    }
    for (const release of repository.releases.filter(candidate => !candidate.draft))
      this.record(
        repository,
        OPERATION.publishRelease,
        author(firstAuthor),
        this.clock.unix(release.daysAgo, "16:00"),
        release.tag,
        release.name
      );
  }

  /** Forgejo keeps one activity row per feed it appears in: the actor's, the owner's and each fixture user's. */
  private record(
    repository: SeededRepository,
    operation: number,
    actor: number,
    time: number,
    ref: string,
    content: string
  ): void {
    for (const feed of new Set([actor, repository.ownerId, ...this.userIds.values()]))
      this.database.insert("action", {
        id: this.database.nextIdentifier("action"),
        user_id: feed,
        op_type: operation,
        act_user_id: actor,
        repo_id: repository.id,
        comment_id: 0,
        ref_name: ref,
        is_private: false,
        content,
        created_unix: time,
      });
  }

  private pushContent(commits: readonly BuiltCommit[], head: BuiltCommit): string {
    const entry = (commit: BuiltCommit) => ({
      Sha1: commit.sha,
      Message: commit.message,
      AuthorEmail: `${commit.author}@fixtures.local`,
      AuthorName: commit.author,
      CommitterEmail: `${commit.author}@fixtures.local`,
      CommitterName: commit.author,
      Timestamp: commit.date.toISOString(),
    });
    return JSON.stringify({
      Commits: commits.map(entry),
      HeadCommit: entry(head),
      CompareURL: "",
      Len: commits.length,
    });
  }

  private unix(commit: BuiltCommit): number {
    return Math.floor(commit.date.getTime() / 1000);
  }

  private userId(login: string): number {
    const identifier = this.userIds.get(login);
    if (identifier === undefined) throw new Error(`Fixture activity refers to unknown user ${login}.`);
    return identifier;
  }
}

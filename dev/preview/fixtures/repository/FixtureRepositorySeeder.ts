import { PreviewConfig } from "../../config/PreviewConfig.ts";
import { FixtureRepositoryDirectory } from "../FixtureRepositoryDirectory.ts";
import { ForgejoApi } from "../ForgejoApi.ts";
import type { FixtureOwners, FixtureUser } from "../model/FixtureOwners.ts";
import type {
  FixtureComment,
  FixtureIssue,
  FixturePull,
  FixtureRepositoryDescription,
} from "../model/FixtureRepositoryDescription.ts";
import { FixtureHistoryBuilder } from "./FixtureHistoryBuilder.ts";
import { SeededRepository } from "./SeededRepository.ts";

interface Identified {
  readonly id: number;
}

interface Numbered extends Identified {
  readonly number: number;
}

const DAY_MS = 86_400_000;
const MERGE_ATTEMPTS = 20;
const SETTLE_ATTEMPTS = 60;

/** Creates one fixture repository and everything declared for it through the preview's API. */
export class FixtureRepositorySeeder {
  private readonly config: PreviewConfig;
  private readonly api: ForgejoApi;
  private readonly historyBuilder: FixtureHistoryBuilder;

  public constructor(config: PreviewConfig, api: ForgejoApi, historyBuilder: FixtureHistoryBuilder) {
    this.config = config;
    this.api = api;
    this.historyBuilder = historyBuilder;
  }

  /** Returns nothing when the repository already exists: a fixture is seeded once per preview volume. */
  public async seed(fixture: FixtureRepositoryDirectory, owners: FixtureOwners): Promise<SeededRepository | undefined> {
    const description = fixture.description();
    const path = `/repos/${description.owner}/${description.name}`;
    if (await this.api.find(path)) return undefined;

    const owner = await this.api.find<Identified>(`/users/${description.owner}`);
    if (!owner) throw new Error(`Fixture ${fixture.name} belongs to unknown owner ${description.owner}.`);
    const created = await this.create(description, owners);
    try {
      const users = new Map<string, FixtureUser>(owners.users.map(user => [user.login, user]));
      const remote = `${this.config.previewGitUrl}/${description.owner}/${description.name}.git`;
      const history = this.historyBuilder.push(fixture, users, remote);
      const seeded = new SeededRepository(created.id, owner.id, description, history, fixture.actionRuns());
      await this.api.patch(path, { website: description.website, default_branch: history.defaultBranch });
      await this.api.put(`${path}/topics`, { topics: description.topics });
      for (const user of description.stars)
        await this.api.put(`/user/starred/${description.owner}/${description.name}`, undefined, user);
      const labels = await this.seedLabels(path, description);
      const milestones = await this.seedMilestones(path, description);
      for (const issue of description.issues) await this.seedIssue(path, issue, labels, milestones, seeded);
      for (const pull of description.pulls) await this.seedPull(path, pull, labels, milestones, seeded);
      await this.seedReleases(path, seeded);
      await this.seedPackages(description);
      return seeded;
    } catch (error) {
      await this.api.delete(path);
      throw error;
    }
  }

  /**
   * Forgejo handles pushes and merges in a background queue. Wait until a repository's activity stops growing,
   * or that work would run after the database step and stamp everything with the current time again.
   */
  public async settle(repository: SeededRepository): Promise<void> {
    let previous = -1;
    for (let attempt = 0; attempt < SETTLE_ATTEMPTS; attempt++) {
      const feed = await this.api.find<readonly unknown[]>(`/repos/${repository.identifier}/activities/feeds?limit=50`);
      const current = feed?.length ?? 0;
      if (current > 0 && current === previous) return;
      previous = current;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error(`Fixture ${repository.identifier} was still being processed by Forgejo after ${SETTLE_ATTEMPTS}s.`);
  }

  private create(description: FixtureRepositoryDescription, owners: FixtureOwners): Promise<Identified> {
    const organization = owners.organizations.some(candidate => candidate.name === description.owner);
    const path = organization ? `/orgs/${description.owner}/repos` : `/admin/users/${description.owner}/repos`;
    return this.api.post<Identified>(path, {
      name: description.name,
      description: description.description,
      private: false,
      auto_init: false,
    });
  }

  private async seedLabels(path: string, description: FixtureRepositoryDescription): Promise<Map<string, number>> {
    const labels = new Map<string, number>();
    for (const label of description.labels) {
      const created = await this.api.post<Identified>(`${path}/labels`, {
        name: label.name,
        color: `#${label.color}`,
        description: label.description,
      });
      labels.set(label.name, created.id);
    }
    return labels;
  }

  private async seedMilestones(path: string, description: FixtureRepositoryDescription): Promise<Map<string, number>> {
    const milestones = new Map<string, number>();
    for (const milestone of description.milestones) {
      const created = await this.api.post<Identified>(`${path}/milestones`, {
        title: milestone.title,
        description: milestone.description,
        due_on: new Date(Date.now() + milestone.dueInDays * DAY_MS).toISOString(),
        state: milestone.state,
      });
      milestones.set(milestone.title, created.id);
    }
    return milestones;
  }

  private async seedIssue(
    path: string,
    issue: FixtureIssue,
    labels: ReadonlyMap<string, number>,
    milestones: ReadonlyMap<string, number>,
    seeded: SeededRepository
  ): Promise<void> {
    const created = await this.api.post<Numbered>(
      `${path}/issues`,
      {
        title: issue.title,
        body: issue.body,
        labels: this.identifiers(issue.labels, labels, "label"),
        milestone: issue.milestone === null ? 0 : this.identifier(issue.milestone, milestones, "milestone"),
        assignees: issue.assignees,
      },
      issue.author
    );
    await this.seedComments(path, created.number, issue.comments, seeded);
    if (issue.state === "closed") await this.api.patch(`${path}/issues/${created.number}`, { state: "closed" });
    seeded.issues.push({ ...this.summary(created.number, issue), kind: "issue" });
  }

  private async seedPull(
    path: string,
    pull: FixturePull,
    labels: ReadonlyMap<string, number>,
    milestones: ReadonlyMap<string, number>,
    seeded: SeededRepository
  ): Promise<void> {
    const created = await this.api.post<Numbered>(
      `${path}/pulls`,
      {
        title: pull.title,
        body: pull.body,
        head: pull.head,
        base: seeded.history.defaultBranch,
        labels: this.identifiers(pull.labels, labels, "label"),
        milestone: pull.milestone === null ? 0 : this.identifier(pull.milestone, milestones, "milestone"),
      },
      pull.author
    );
    await this.seedComments(path, created.number, pull.comments, seeded);
    if (pull.state === "merged") await this.merge(`${path}/pulls/${created.number}/merge`);
    if (pull.state === "closed") await this.api.patch(`${path}/pulls/${created.number}`, { state: "closed" });
    seeded.issues.push({ ...this.summary(created.number, pull), kind: "pull" });
  }

  /** Forgejo checks mergeability in the background, so a new pull request is not mergeable at once. */
  private async merge(path: string): Promise<void> {
    for (let attempt = 1; ; attempt++) {
      try {
        await this.api.submit(path, { Do: "merge" });
        return;
      } catch (error) {
        if (attempt === MERGE_ATTEMPTS) throw error;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  private async seedComments(
    path: string,
    index: number,
    comments: readonly FixtureComment[],
    seeded: SeededRepository
  ): Promise<void> {
    for (const comment of comments) {
      const created = await this.api.post<Identified>(
        `${path}/issues/${index}/comments`,
        { body: comment.body },
        comment.author
      );
      seeded.comments.push({ id: created.id, daysAgo: comment.daysAgo });
    }
  }

  private async seedReleases(path: string, seeded: SeededRepository): Promise<void> {
    for (const release of seeded.description.releases) {
      const created = await this.api.post<Identified>(`${path}/releases`, {
        tag_name: release.tag,
        target_commitish: seeded.history.defaultBranch,
        name: release.name,
        body: release.body,
        draft: release.draft,
        prerelease: release.prerelease,
      });
      for (const asset of release.assets)
        await this.api.attach(
          `${path}/releases/${created.id}/assets?name=${encodeURIComponent(asset.name)}`,
          asset.name,
          asset.content
        );
      seeded.releases.push({
        id: created.id,
        tag: release.tag,
        name: release.name,
        draft: release.draft,
        daysAgo: release.daysAgo,
      });
    }
  }

  private async seedPackages(description: FixtureRepositoryDescription): Promise<void> {
    for (const entry of description.packages) {
      const segments = [description.owner, entry.type, entry.name, entry.version, entry.file].map(encodeURIComponent);
      await this.api.uploadPackage(`/${segments.join("/")}`, entry.content);
    }
  }

  private summary(index: number, source: FixtureIssue | FixturePull): Omit<SeededRepository["issues"][number], "kind"> {
    return { index, title: source.title, author: source.author, state: source.state, daysAgo: source.daysAgo };
  }

  private identifiers(names: readonly string[], known: ReadonlyMap<string, number>, kind: string): number[] {
    return names.map(name => this.identifier(name, known, kind));
  }

  private identifier(name: string, known: ReadonlyMap<string, number>, kind: string): number {
    const identifier = known.get(name);
    if (identifier === undefined) throw new Error(`Fixture refers to undeclared ${kind} "${name}".`);
    return identifier;
  }
}

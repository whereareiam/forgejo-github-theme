import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { FixtureActionLog } from "./database/FixtureActionLog.ts";
import { FixtureArchive } from "./FixtureArchive.ts";

const archive = new FixtureArchive(fileURLToPath(new URL("../../fixtures", import.meta.url)));
const owners = archive.owners();
const users = new Set(owners.users.map(user => user.login));
const ownerNames = new Set([...users, ...owners.organizations.map(organization => organization.name)]);

it("declares team members as users", () => {
  for (const organization of owners.organizations)
    for (const team of organization.teams) for (const member of team.members) expect(users, member).toContain(member);
});

describe.each(archive.repositories().map(fixture => [fixture.name, fixture] as const))(
  "fixture %s",
  (_name, fixture) => {
    const description = fixture.description();
    const history = fixture.history();
    const commits = new Set(history.commits.map(commit => commit.id));
    const branches = new Set(history.commits.map(commit => commit.branch));

    it("is named after its owner and repository", () => {
      expect(fixture.name).toBe(`${description.owner}-${description.name}`);
      expect(ownerNames).toContain(description.owner);
    });

    it("has files for every commit and known authors", () => {
      expect(commits.size).toBe(history.commits.length);
      expect(branches).toContain(history.defaultBranch);
      for (const commit of history.commits) {
        expect(existsSync(fixture.commitDirectory(commit.id))).toBe(true);
        expect(users, commit.id).toContain(commit.author);
      }
      for (const tag of history.tags) expect(commits, tag.name).toContain(tag.commit);
    });

    it("only refers to declared users, labels, milestones and branches", () => {
      const labels = new Set(description.labels.map(label => label.name));
      const milestones = new Set(description.milestones.map(milestone => milestone.title));
      for (const user of description.stars) expect(users).toContain(user);
      for (const entry of [...description.issues, ...description.pulls]) {
        expect(users, entry.title).toContain(entry.author);
        for (const label of entry.labels) expect(labels, entry.title).toContain(label);
        if (entry.milestone !== null) expect(milestones, entry.title).toContain(entry.milestone);
        for (const comment of entry.comments) expect(users, entry.title).toContain(comment.author);
      }
      for (const issue of description.issues) for (const assignee of issue.assignees) expect(users).toContain(assignee);
      for (const pull of description.pulls) {
        expect(branches, pull.title).toContain(pull.head);
        expect(pull.head, pull.title).not.toBe(history.defaultBranch);
      }
    });

    it("gives every workflow run a commit, an actor and log sections for its jobs", () => {
      for (const { name, run, log } of fixture.actionRuns()) {
        expect(commits, name).toContain(run.commit);
        expect(users, name).toContain(run.actor);
        if (run.event === "pull_request")
          expect(
            description.pulls.map(pull => `refs/heads/${pull.head}`),
            name
          ).toContain(run.ref);
        const sections = new FixtureActionLog(log, name);
        for (const job of run.jobs) {
          const steps = job.steps.map(step => step.name);
          for (const section of sections.steps(job.id)) expect(steps, `${name} ${job.id}`).toContain(section.name);
          expect(sections.steps(job.id).length, `${name} ${job.id}`).toBeGreaterThan(0);
        }
      }
    });
  }
);

# Preview fixtures

Everything the local Forgejo preview shows comes from this folder. The content is invented; do not add exports from a
real instance.

```text
dev/fixtures/
  owner.json                 users, organizations and teams
  repository/
    <owner>-<name>/
      repository.json        description, labels, milestones, issues, pull requests, releases, packages
      history.json           commits, branches and tags
      commit/<id>/           the files a commit adds or changes
      action/<run>.json      one finished workflow run
      action/<run>.log       that run's log
```

## Change what the preview shows

Edit the files, then seed an empty volume. A repository that already exists in the preview is left as it is.

```bash
bun dev:forgejo:reset
bun dev:forgejo
```

Seeding stops with a message naming the fixture when something does not line up, for example a pull request from a
branch that `history.json` never creates. `bun vitest` runs the same checks without Docker.

## Times

Every time is written as `daysAgo`, optionally with a `time` of day in UTC, and is resolved when the preview is seeded.
A time later than the moment of seeding is clamped to it.

## Add a repository

Create a folder under `repository/` with `repository.json` and `history.json`. Use an empty list for anything the
repository should not have; `alex-notes` is the smallest example. The owner must be a user or organization in
`owner.json`.

## History

Each entry in `history.json` becomes one commit. Its `id` names a folder under `commit/` whose files are copied over the
working tree, so a commit only contains what it adds or changes. Commits are applied in list order. A `branch` seen for
the first time starts at the default branch's tip at that point in the list; later commits on the same branch continue
it. Tags name a commit `id`.

Commit hashes differ between seeds because the dates do. Refer to commits by `id`, never by hash.

## Issues, pull requests and releases

- `author`, `assignees` and comment authors are user logins from `owner.json`.
- `labels` and `milestone` must be declared in the same `repository.json`.
- A pull request's `head` is a branch from `history.json`. Its `state` is `open`, `closed` or `merged`; a title starting
  with `WIP:` makes it a draft.
- A release's `tag` may be one from `history.json` or a new one, which a draft usually wants. Each entry in `assets` is
  uploaded as a file with the given text content.
- Packages are generic packages owned by the repository's owner.

## Workflow runs

Forgejo's API cannot create a finished run, so runs are written into the database. Each `action/<run>.json` lists its
jobs and their steps with a status of `success`, `failure`, `cancelled` or `skipped` and a duration in seconds. The
run's `commit` is a commit `id`, and for a `pull_request` event its `ref` is the pull request's branch. Each job also
reports a commit status, which is what shows as the check mark beside the commit.

The log beside it supplies the lines for every step:

```text
::job build
::step Set up job
docker(version:v9.1.0) received task of job build
::step bun run build
built in 412ms
```

`Set up job` and `Complete job` are steps Forgejo adds to every job by itself. List them to give them log lines and a
duration; they are not stored as steps.

## After a Forgejo upgrade

The database rows for timestamps, the activity feed, workflow runs and commit statuses follow the schema of the Forgejo
version pinned in `dev/docker-compose.yml`. When a column they write is missing or a new required column appears,
seeding stops and names the table and column. Adjust the writers under `dev/preview/fixtures/database/`.

import { Buffer } from "node:buffer";
import { createHash, randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { FixtureClock } from "../FixtureClock.ts";
import type { FixtureActionRunFile } from "../FixtureRepositoryDirectory.ts";
import type { FixtureActionJob, FixtureActionStatus } from "../model/FixtureActionRun.ts";
import { SeededRepository } from "../repository/SeededRepository.ts";
import { FixtureActionLog } from "./FixtureActionLog.ts";
import { FixtureDatabase } from "./FixtureDatabase.ts";

const STATUS: Record<FixtureActionStatus, number> = { success: 1, failure: 2, cancelled: 3, skipped: 4 };
/** Forgejo adds these two steps itself from the log lines before the first and after the last recorded step. */
const IMPLICIT_STEPS = ["Set up job", "Complete job"];
const WORKFLOW_DIRECTORY = ".forgejo/workflows";
/** Forgejo's built-in user that reports workflow results as commit statuses. */
const ACTIONS_USER_ID = -2;

interface CommitChecks {
  count: number;
  failure?: string;
  last: string;
}

/** Replaces a repository's workflow runs with the declared ones and writes their log files. */
export class FixtureActionWriter {
  private readonly database: FixtureDatabase;
  private readonly clock: FixtureClock;
  private readonly logDirectory: string;
  private readonly userIds: ReadonlyMap<string, number>;
  private checks = new Map<string, CommitChecks>();

  public constructor(
    database: FixtureDatabase,
    clock: FixtureClock,
    logDirectory: string,
    userIds: ReadonlyMap<string, number>
  ) {
    this.database = database;
    this.clock = clock;
    this.logDirectory = logDirectory;
    this.userIds = userIds;
  }

  public write(repository: SeededRepository): void {
    this.deleteExisting(repository.id);
    this.checks = new Map();
    const runs = [...repository.actionRuns].sort(
      (a, b) => this.clock.unix(a.run.daysAgo, a.run.time) - this.clock.unix(b.run.daysAgo, b.run.time)
    );
    runs.forEach((file, position) => this.writeRun(repository, file, position + 1));
    this.database.run("DELETE FROM action_run_index WHERE group_id = ?", [repository.id]);
    if (runs.length > 0) this.database.insert("action_run_index", { group_id: repository.id, max_index: runs.length });
    this.writeCheckSummaries(repository.id);
  }

  private writeCheckSummaries(repositoryId: number): void {
    for (const [sha, checks] of this.checks) {
      this.database.insert("commit_status_summary", {
        id: this.database.nextIdentifier("commit_status_summary"),
        repo_id: repositoryId,
        sha,
        state: checks.failure ? "failure" : "success",
        target_url: checks.failure ?? checks.last,
      });
      this.database.insert("commit_status_index", {
        id: this.database.nextIdentifier("commit_status_index"),
        repo_id: repositoryId,
        sha,
        max_index: checks.count,
      });
    }
  }

  /** Pushing workflow files makes Forgejo queue runs of its own; they would wait for a runner forever. */
  private deleteExisting(repositoryId: number): void {
    const tasks = "SELECT id FROM action_task WHERE repo_id = ?";
    this.database.run(`DELETE FROM action_task_step WHERE task_id IN (${tasks})`, [repositoryId]);
    this.database.run(`DELETE FROM action_task_output WHERE task_id IN (${tasks})`, [repositoryId]);
    for (const table of [
      "action_artifact",
      "action_task",
      "action_run_job",
      "action_run",
      "commit_status",
      "commit_status_summary",
      "commit_status_index",
    ])
      this.database.run(`DELETE FROM ${table} WHERE repo_id = ?`, [repositoryId]);
  }

  private writeRun(repository: SeededRepository, file: FixtureActionRunFile, index: number): void {
    const { run } = file;
    const commit = repository.history.commit(run.commit);
    const actor = this.userId(run.actor);
    const pull = run.event === "pull_request" ? this.pullFor(repository, run.ref) : undefined;
    const ref = pull ? `refs/pull/${pull.index}/head` : run.ref;
    const created = this.clock.unix(run.daysAgo, run.time);
    const log = new FixtureActionLog(file.log, `${repository.identifier} action ${file.name}`);
    const runId = this.database.nextIdentifier("action_run");

    let cursor = created + 1;
    for (const [position, job] of run.jobs.entries()) {
      const needs = position === 0 ? null : [run.jobs[position - 1]?.id];
      const started = cursor;
      cursor = this.writeJob(repository, file, job, log, runId, commit.sha, needs, started);
      this.writeCheck(
        repository,
        file,
        job,
        commit.sha,
        `/${repository.identifier}/actions/runs/${index}/jobs/${position}`,
        started,
        cursor
      );
      cursor += 2;
    }
    const stopped = cursor - 2;

    this.database.insert("action_run", {
      id: runId,
      title: run.title,
      repo_id: repository.id,
      owner_id: repository.ownerId,
      workflow_id: run.workflow,
      workflow_directory: WORKFLOW_DIRECTORY,
      index,
      trigger_user_id: actor,
      schedule_id: 0,
      ref,
      commit_sha: commit.sha,
      event: run.event,
      event_payload: JSON.stringify(this.payload(run.event, ref, commit.sha, run.title, run.actor, pull, repository)),
      trigger_event: run.event,
      status: this.runStatus(run.jobs),
      version: 1,
      started: created + 1,
      stopped,
      previous_duration: 0,
      created,
      updated: stopped,
      notify_email: false,
      is_fork_pull_request: false,
      pull_request_poster_id: pull ? this.userId(pull.author) : 0,
      pull_request_id: 0,
      need_approval: false,
      approved_by: 0,
      concurrency_group: `${ref}_${run.workflow}_${run.event}__auto`,
      concurrency_type: 0,
      pre_execution_error: "",
      pre_execution_error_code: 0,
      pre_execution_error_details: "null",
      pre_execution_warning_codes: "[]",
      pre_execution_warning_details: "[]",
      priority: 0,
      prioritize: false,
    });
  }

  /** Returns the time the job stopped. */
  private writeJob(
    repository: SeededRepository,
    file: FixtureActionRunFile,
    job: FixtureActionJob,
    log: FixtureActionLog,
    runId: number,
    sha: string,
    needs: readonly (string | undefined)[] | null,
    started: number
  ): number {
    const jobId = this.database.nextIdentifier("action_run_job");
    const taskId = this.database.nextIdentifier("action_task");
    const sections = log.steps(job.id);
    const lines: string[] = [];
    let cursor = started;
    let stepIndex = 0;

    for (const step of job.steps) {
      const section = sections.find(candidate => candidate.name === step.name);
      const stepStarted = cursor;
      const stepLines = (section?.lines ?? []).map(line => `${this.timestamp(stepStarted)} ${line}\n`);
      if (!IMPLICIT_STEPS.includes(step.name))
        this.database.insert("action_task_step", {
          id: this.database.nextIdentifier("action_task_step"),
          name: step.name,
          task_id: taskId,
          index: stepIndex++,
          repo_id: repository.id,
          status: STATUS[step.status],
          log_index: lines.length,
          log_length: stepLines.length,
          started: stepStarted,
          stopped: stepStarted + step.seconds,
          created: started,
          updated: stepStarted + step.seconds,
        });
      lines.push(...stepLines);
      cursor += step.seconds;
    }

    const logFile = `${repository.identifier}/${(taskId % 256).toString(16).padStart(2, "0")}/${taskId}.log`;
    const target = join(this.logDirectory, logFile);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, lines.join(""));
    const token = createHash("sha256")
      .update(`fixture-task-${repository.identifier}-${file.name}-${job.id}`)
      .digest("hex");
    const shared = {
      repo_id: repository.id,
      owner_id: repository.ownerId,
      commit_sha: sha,
      is_fork_pull_request: false,
    };

    this.database.insert("action_task", {
      id: taskId,
      job_id: jobId,
      attempt: 1,
      runner_id: 0,
      status: STATUS[job.status],
      started,
      stopped: cursor,
      ...shared,
      token_hash: token,
      token_salt: "fixture",
      token_last_eight: token.slice(-8),
      log_filename: logFile,
      log_in_storage: true,
      log_length: lines.length,
      log_size: Buffer.byteLength(lines.join("")),
      log_indexes: FixtureActionLog.indexes(lines),
      log_expired: false,
      runner_request_key: "",
      created: started,
      updated: cursor,
    });
    this.database.insert("action_run_job", {
      id: jobId,
      run_id: runId,
      ...shared,
      name: job.id,
      attempt: 1,
      handle: randomUUID(),
      workflow_payload: Buffer.from(this.jobWorkflow(file.run.name, job.id)),
      job_id: job.id,
      needs: JSON.stringify(needs),
      runs_on: JSON.stringify(["docker"]),
      task_id: taskId,
      status: STATUS[job.status],
      started,
      stopped: cursor,
      created: started,
      updated: cursor,
    });
    return cursor;
  }

  /** The commit status a finished job reports, shown as the check mark beside its commit. */
  private writeCheck(
    repository: SeededRepository,
    file: FixtureActionRunFile,
    job: FixtureActionJob,
    sha: string,
    url: string,
    started: number,
    stopped: number
  ): void {
    const failed = job.status !== "success";
    const checks = this.checks.get(sha) ?? { count: 0, last: url };
    checks.count += 1;
    checks.last = url;
    if (failed) checks.failure ??= url;
    this.checks.set(sha, checks);
    const context = `${file.run.name} / ${job.id} (${file.run.event})`;
    this.database.insert("commit_status", {
      id: this.database.nextIdentifier("commit_status"),
      index: checks.count,
      repo_id: repository.id,
      state: failed ? "failure" : "success",
      sha,
      target_url: url,
      description: `${failed ? "Failing after" : "Successful in"} ${stopped - started}s`,
      context_hash: createHash("sha1").update(context).digest("hex"),
      context,
      creator_id: ACTIONS_USER_ID,
      created_unix: started,
      updated_unix: stopped,
    });
  }

  private runStatus(jobs: readonly FixtureActionJob[]): number {
    for (const status of ["failure", "cancelled"] as const)
      if (jobs.some(job => job.status === status)) return STATUS[status];
    return STATUS.success;
  }

  private payload(
    event: string,
    ref: string,
    sha: string,
    title: string,
    actor: string,
    pull: SeededRepository["issues"][number] | undefined,
    repository: SeededRepository
  ): unknown {
    const sender = { login: actor };
    if (event === "pull_request" && pull)
      return {
        action: "opened",
        number: pull.index,
        pull_request: {
          number: pull.index,
          title: pull.title,
          head: { ref: ref, sha },
          base: { ref: repository.history.defaultBranch },
        },
        sender,
      };
    return {
      ref,
      before: "0".repeat(40),
      after: sha,
      head_commit: { id: sha, message: title },
      pusher: sender,
      sender,
    };
  }

  private pullFor(repository: SeededRepository, ref: string): SeededRepository["issues"][number] {
    const branch = ref.replace("refs/heads/", "");
    const position = repository.description.pulls.findIndex(pull => pull.head === branch);
    const pull = repository.issues.filter(issue => issue.kind === "pull")[position];
    if (!pull)
      throw new Error(`Fixture ${repository.identifier} has no pull request from ${branch} for its workflow run.`);
    return pull;
  }

  private jobWorkflow(name: string, job: string): string {
    return `name: ${name}\n"on": push\njobs:\n  ${job}:\n    name: ${job}\n    runs-on: docker\n    steps:\n      - run: "true"\n`;
  }

  /** The timestamp layout Forgejo writes in front of every log line. */
  private timestamp(unix: number): string {
    return new Date(unix * 1000).toISOString().replace(/\.\d+Z$/, ".0000000Z");
  }

  private userId(login: string): number {
    const identifier = this.userIds.get(login);
    if (identifier === undefined) throw new Error(`Fixture workflow run refers to unknown user ${login}.`);
    return identifier;
  }
}

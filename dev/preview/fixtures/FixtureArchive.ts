import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { FixtureDefinition } from "./FixtureDefinition.ts";

export interface FixtureSnapshot {
  readonly releases: readonly FixtureRelease[];
  readonly actions: FixtureActions;
}

export interface FixtureHome {
  readonly userCreatedUnix: number;
  readonly repositories: readonly FixtureRepositoryActivity[];
  readonly actions: readonly FixtureRow[];
  readonly commitEmails: readonly string[];
}

export interface FixtureRepositoryActivity {
  readonly id: number;
  readonly name: string;
  readonly created_unix: number;
  readonly updated_unix: number;
}

export interface FixtureRelease {
  readonly tag_name: string;
  readonly target_commitish: string;
  readonly name: string;
  readonly body: string;
  readonly draft: boolean;
  readonly prerelease: boolean;
}

export interface FixtureActions {
  readonly action_run: readonly FixtureRow[];
  readonly action_run_job: readonly FixtureRow[];
  readonly action_task: readonly FixtureRow[];
  readonly action_task_step: readonly FixtureRow[];
  readonly action_task_output: readonly FixtureRow[];
  readonly action_artifact: readonly FixtureRow[];
}

export type FixtureRow = Readonly<Record<string, unknown>>;

export class FixtureArchive {
  private readonly fixturesDirectory: string;

  public constructor(fixturesDirectory: string) {
    this.fixturesDirectory = fixturesDirectory;
  }

  public repositoryDirectory(definition: FixtureDefinition): string {
    return join(this.fixturesDirectory, definition.owner, `${definition.repository}.git`);
  }

  public snapshotFile(definition: FixtureDefinition): string {
    return join(this.fixturesDirectory, definition.owner, `${definition.repository}.json`);
  }

  public logDirectory(): string {
    return join(this.fixturesDirectory, "logs");
  }

  public homeFile(): string {
    return join(this.fixturesDirectory, "home.json");
  }

  public readSnapshot(definition: FixtureDefinition): FixtureSnapshot {
    const file = this.snapshotFile(definition);
    if (!existsSync(file)) throw new Error(`Missing fixture snapshot: ${file}. Restore the checked-in fixtures first.`);
    return JSON.parse(readFileSync(file, "utf8")) as FixtureSnapshot;
  }

  public readHome(): FixtureHome {
    const file = this.homeFile();
    if (!existsSync(file)) throw new Error(`Missing fixture home activity: ${file}. Restore the checked-in fixtures first.`);
    return JSON.parse(readFileSync(file, "utf8")) as FixtureHome;
  }

  public assertRepository(definition: FixtureDefinition): void {
    const directory = this.repositoryDirectory(definition);
    if (!existsSync(directory))
      throw new Error(`Missing fixture repository: ${directory}. Restore the checked-in fixtures first.`);
  }

  public assertLogs(): void {
    const directory = this.logDirectory();
    if (!existsSync(directory)) throw new Error(`Missing fixture logs: ${directory}. Restore the checked-in fixtures first.`);
  }
}

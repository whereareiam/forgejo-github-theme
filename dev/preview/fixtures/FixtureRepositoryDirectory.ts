import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

import type { FixtureActionRun } from "./model/FixtureActionRun.ts";
import type { FixtureHistory } from "./model/FixtureHistory.ts";
import type { FixtureRepositoryDescription } from "./model/FixtureRepositoryDescription.ts";

export interface FixtureActionRunFile {
  readonly name: string;
  readonly run: FixtureActionRun;
  readonly log: string;
}

/** One `dev/fixtures/repository/<folder>`: everything that describes a single fixture repository. */
export class FixtureRepositoryDirectory {
  private readonly directory: string;

  public constructor(directory: string) {
    this.directory = directory;
  }

  public get name(): string {
    return basename(this.directory);
  }

  public description(): FixtureRepositoryDescription {
    return this.readJson<FixtureRepositoryDescription>("repository.json");
  }

  public history(): FixtureHistory {
    return this.readJson<FixtureHistory>("history.json");
  }

  public commitDirectory(commit: string): string {
    const directory = join(this.directory, "commit", commit);
    if (!existsSync(directory)) throw new Error(`Fixture ${this.name} has no files for commit ${commit}: ${directory}`);
    return directory;
  }

  public actionRuns(): readonly FixtureActionRunFile[] {
    const directory = join(this.directory, "action");
    if (!existsSync(directory)) return [];
    return readdirSync(directory)
      .filter(file => file.endsWith(".json"))
      .sort()
      .map(file => {
        const name = file.slice(0, -".json".length);
        const log = join(directory, `${name}.log`);
        if (!existsSync(log)) throw new Error(`Fixture ${this.name} action ${name} has no log: ${log}`);
        return { name, run: this.readJson<FixtureActionRun>(join("action", file)), log: readFileSync(log, "utf8") };
      });
  }

  private readJson<T>(file: string): T {
    const path = join(this.directory, file);
    if (!existsSync(path)) throw new Error(`Missing fixture file: ${path}`);
    return JSON.parse(readFileSync(path, "utf8")) as T;
  }
}

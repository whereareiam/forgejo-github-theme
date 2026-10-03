import { mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

import { FIXTURES } from "../../config/constants.ts";
import { PreviewConfig } from "../../config/PreviewConfig.ts";
import { ForgejoCompose } from "../../forgejo/ForgejoCompose.ts";
import { FixtureClock } from "../FixtureClock.ts";
import type { FixtureOwners } from "../model/FixtureOwners.ts";
import { SeededRepository } from "../repository/SeededRepository.ts";
import { FixtureActionWriter } from "./FixtureActionWriter.ts";
import { FixtureDatabase } from "./FixtureDatabase.ts";
import { FixtureTimelineWriter } from "./FixtureTimelineWriter.ts";

/**
 * Writes what Forgejo's API cannot create: past timestamps, the activity feed and finished workflow runs.
 * Forgejo is stopped while its SQLite database is edited on a local copy.
 */
export class FixtureDatabaseImporter {
  private readonly config: PreviewConfig;
  private readonly compose: ForgejoCompose;
  private readonly clock: FixtureClock;

  public constructor(config: PreviewConfig, compose: ForgejoCompose, clock: FixtureClock) {
    this.config = config;
    this.compose = compose;
    this.clock = clock;
  }

  public import(
    owners: FixtureOwners,
    repositories: readonly SeededRepository[],
    userIds: ReadonlyMap<string, number>
  ): void {
    const databaseCopy = this.config.fixtureDatabaseFile;
    const logs = join(dirname(databaseCopy), "fixture-logs");
    this.compose.stopService();
    try {
      mkdirSync(dirname(databaseCopy), { recursive: true });
      rmSync(databaseCopy, { force: true });
      rmSync(logs, { recursive: true, force: true });
      mkdirSync(logs, { recursive: true });
      this.copyDatabase(databaseCopy);

      const database = new FixtureDatabase(databaseCopy);
      const timeline = new FixtureTimelineWriter(database, this.clock, userIds);
      const actions = new FixtureActionWriter(database, this.clock, logs, userIds);
      timeline.writeOwners(owners);
      for (const repository of repositories) {
        timeline.writeRepository(repository);
        actions.write(repository);
      }
      database.apply();

      this.compose.removeDatabaseSidecars(FIXTURES.databaseFile);
      this.compose.copyToContainer(databaseCopy, FIXTURES.databaseFile);
      this.compose.repairOwnership(FIXTURES.databaseFile);
      this.compose.copyToContainer(`${logs}/.`, FIXTURES.actionLogDirectory);
      this.compose.repairOwnership(FIXTURES.actionLogDirectory);
    } finally {
      this.compose.startService();
    }
  }

  /** Forgejo's latest writes may still sit in SQLite's write-ahead log, so that file is copied along. */
  private copyDatabase(databaseCopy: string): void {
    for (const suffix of ["-wal", "-shm"]) rmSync(`${databaseCopy}${suffix}`, { force: true });
    this.compose.copyFromContainer(FIXTURES.databaseFile, databaseCopy);
    for (const suffix of ["-wal", "-shm"])
      this.compose.copyFromContainerIfPresent(`${FIXTURES.databaseFile}${suffix}`, `${databaseCopy}${suffix}`);
  }
}

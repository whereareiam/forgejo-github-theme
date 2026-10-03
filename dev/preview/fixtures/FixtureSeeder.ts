import { PreviewConfig } from "../config/PreviewConfig.ts";
import { CommandRunner } from "../CommandRunner.ts";
import { ForgejoCompose } from "../forgejo/ForgejoCompose.ts";
import { FixtureDatabaseImporter } from "./database/FixtureDatabaseImporter.ts";
import { FixtureArchive } from "./FixtureArchive.ts";
import { FixtureClock } from "./FixtureClock.ts";
import { FixtureOwnerSeeder } from "./FixtureOwnerSeeder.ts";
import { ForgejoApi } from "./ForgejoApi.ts";
import type { FixtureOwners } from "./model/FixtureOwners.ts";
import { FixtureHistoryBuilder } from "./repository/FixtureHistoryBuilder.ts";
import { FixtureRepositorySeeder } from "./repository/FixtureRepositorySeeder.ts";
import { SeededRepository } from "./repository/SeededRepository.ts";

interface Identified {
  readonly id: number;
}

/** Fills a fresh preview from `dev/fixtures`: owners, then each repository, then the database-only parts. */
export class FixtureSeeder {
  private readonly archive: FixtureArchive;
  private readonly api: ForgejoApi;
  private readonly ownerSeeder: FixtureOwnerSeeder;
  private readonly repositorySeeder: FixtureRepositorySeeder;
  private readonly databaseImporter: FixtureDatabaseImporter;

  public constructor(config: PreviewConfig, runner: CommandRunner, compose: ForgejoCompose) {
    const clock = new FixtureClock();
    this.archive = new FixtureArchive(config.fixturesDirectory);
    this.api = new ForgejoApi(config);
    this.ownerSeeder = new FixtureOwnerSeeder(this.api);
    this.repositorySeeder = new FixtureRepositorySeeder(config, this.api, new FixtureHistoryBuilder(runner, clock));
    this.databaseImporter = new FixtureDatabaseImporter(config, compose, clock);
  }

  /** Returns whether anything was seeded; repositories that already exist are left untouched. */
  public async seed(): Promise<boolean> {
    const owners = this.archive.owners();
    await this.ownerSeeder.seed(owners);

    const seeded: SeededRepository[] = [];
    for (const fixture of this.archive.repositories()) {
      const repository = await this.repositorySeeder.seed(fixture, owners);
      if (repository) seeded.push(repository);
      console.log(`${repository ? "Seeded" : "Kept existing"} fixture ${fixture.name}.`);
    }
    if (seeded.length === 0) return false;
    for (const repository of seeded) await this.repositorySeeder.settle(repository);

    this.databaseImporter.import(owners, seeded, await this.userIds(owners));
    return true;
  }

  private async userIds(owners: FixtureOwners): Promise<Map<string, number>> {
    const identifiers = new Map<string, number>();
    for (const user of owners.users) {
      const found = await this.api.find<Identified>(`/users/${user.login}`);
      if (!found) throw new Error(`Fixture user ${user.login} was not created.`);
      identifiers.set(user.login, found.id);
    }
    return identifiers;
  }
}

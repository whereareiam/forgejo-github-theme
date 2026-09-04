import { COMMANDS } from "../config/constants.ts";
import { CommandRunner } from "../CommandRunner.ts";
import { ForgejoCompose } from "../forgejo/ForgejoCompose.ts";
import { PreviewConfig } from "../config/PreviewConfig.ts";
import { FixtureActionImporter } from "./FixtureActionImporter.ts";
import type { FixtureRepositoryMapping } from "./FixtureActionImporter.ts";
import { FixtureArchive } from "./FixtureArchive.ts";
import type { FixtureHome, FixtureRelease } from "./FixtureArchive.ts";
import { FIXTURE_DEFINITIONS, FixtureDefinition } from "./FixtureDefinition.ts";
import { ForgejoApi } from "./ForgejoApi.ts";

interface ForgejoUser {
  readonly id: number;
}

interface ForgejoRepository {
  readonly id: number;
}

export class FixtureSeeder {
  private readonly config: PreviewConfig;
  private readonly runner: CommandRunner;
  private readonly archive: FixtureArchive;
  private readonly api: ForgejoApi;
  private readonly actionImporter: FixtureActionImporter;

  public constructor(config: PreviewConfig, runner: CommandRunner, compose: ForgejoCompose) {
    this.config = config;
    this.runner = runner;
    this.archive = new FixtureArchive(config.fixturesDirectory);
    this.api = new ForgejoApi(config);
    this.actionImporter = new FixtureActionImporter(config, compose);
  }

  public async seed(): Promise<void> {
    const home = this.archive.readHome();
    const repositories = [] as FixtureRepositoryMapping[];
    for (const definition of FIXTURE_DEFINITIONS) repositories.push(await this.seedRepository(definition, home));
    this.archive.assertLogs();
    await this.importActions(home, repositories);
  }

  private async seedRepository(definition: FixtureDefinition, home: FixtureHome): Promise<FixtureRepositoryMapping> {
    this.archive.assertRepository(definition);
    await this.ensureOwner(definition);
    const repository = await this.ensureRepository(definition);
    this.pushMirror(definition);
    await this.seedReleases(definition);
    console.log(`Seeded fixture ${definition.identifier}.`);
    return { sourceId: this.sourceRepositoryId(definition, home), localId: repository.id };
  }

  private async ensureOwner(definition: FixtureDefinition): Promise<void> {
    if (definition.ownerType === "organization") {
      if (await this.api.getJson(`/orgs/${definition.owner}`)) return;
      await this.api.postJson("/orgs", { username: definition.owner, full_name: definition.displayName });
      return;
    }

    if (definition.owner === this.config.previewUser) return;
    throw new Error(`Fixture user ${definition.owner} must be the configured preview user.`);
  }

  private async ensureRepository(definition: FixtureDefinition): Promise<ForgejoRepository> {
    const existing = await this.api.getJson<ForgejoRepository>(`/repos/${definition.identifier}`);
    if (existing) return existing;

    const path =
      definition.ownerType === "organization"
        ? `/orgs/${definition.owner}/repos`
        : `/admin/users/${definition.owner}/repos`;
    const created = await this.api.postJson<ForgejoRepository>(path, {
      name: definition.repository,
      description: `Local ${definition.identifier} fixture`,
      private: false,
      auto_init: false,
    });
    if (!created) {
      const repository = await this.api.getJson<ForgejoRepository>(`/repos/${definition.identifier}`);
      if (repository) return repository;
      throw new Error(`Unable to create local fixture repository ${definition.identifier}.`);
    }
    return created;
  }

  private pushMirror(definition: FixtureDefinition): void {
    this.runner.run(COMMANDS.git, [
      "-C",
      this.archive.repositoryDirectory(definition),
      "push",
      "--mirror",
      `${this.config.previewGitUrl}/${definition.identifier}.git`,
    ]);
  }

  private async seedReleases(definition: FixtureDefinition): Promise<void> {
    for (const release of this.archive.readSnapshot(definition).releases) await this.seedRelease(definition, release);
  }

  private async seedRelease(definition: FixtureDefinition, release: FixtureRelease): Promise<void> {
    const path = `/repos/${definition.identifier}/releases/tags/${encodeURIComponent(release.tag_name)}`;
    if (await this.api.getJson(path)) return;
    await this.api.postJson(`/repos/${definition.identifier}/releases`, {
      tag_name: release.tag_name,
      target_commitish: release.target_commitish,
      name: release.name,
      body: release.body,
      draft: release.draft,
      prerelease: release.prerelease,
    });
  }

  private async importActions(home: FixtureHome, repositories: readonly FixtureRepositoryMapping[]): Promise<void> {
    const definition = FIXTURE_DEFINITIONS[0];
    const repository = await this.api.getJson<ForgejoRepository>(`/repos/${definition.identifier}`);
    const owner = await this.api.getJson<ForgejoUser>(`/users/${definition.owner}`);
    if (!repository || !owner) throw new Error(`Unable to resolve local fixture IDs for ${definition.identifier}.`);
    this.actionImporter.import(
      this.archive.readSnapshot(definition).actions,
      home,
      repositories,
      repository.id,
      owner.id,
      this.archive.logDirectory()
    );
  }

  private sourceRepositoryId(definition: FixtureDefinition, home: FixtureHome): number {
    const repository = home.repositories.find(candidate => candidate.name === definition.repository);
    if (!repository) throw new Error(`Missing source repository activity for fixture ${definition.identifier}.`);
    return repository.id;
  }
}

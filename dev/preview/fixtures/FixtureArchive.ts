import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { FixtureRepositoryDirectory } from "./FixtureRepositoryDirectory.ts";
import type { FixtureOwners } from "./model/FixtureOwners.ts";

/** Reads `dev/fixtures`: `owner.json` and one folder per repository under `repository/`. */
export class FixtureArchive {
  private readonly fixturesDirectory: string;

  public constructor(fixturesDirectory: string) {
    this.fixturesDirectory = fixturesDirectory;
  }

  public owners(): FixtureOwners {
    const file = join(this.fixturesDirectory, "owner.json");
    if (!existsSync(file)) throw new Error(`Missing fixture owners: ${file}`);
    return JSON.parse(readFileSync(file, "utf8")) as FixtureOwners;
  }

  public repositories(): readonly FixtureRepositoryDirectory[] {
    const directory = join(this.fixturesDirectory, "repository");
    if (!existsSync(directory)) throw new Error(`Missing fixture repositories: ${directory}`);
    return readdirSync(directory, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()
      .map(name => new FixtureRepositoryDirectory(join(directory, name)));
  }
}

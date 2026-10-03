import { FIXTURES } from "../config/constants.ts";
import { ForgejoApi } from "./ForgejoApi.ts";
import type { FixtureOrganization, FixtureOwners, FixtureUser } from "./model/FixtureOwners.ts";

interface Identified {
  readonly id: number;
}

const TEAM_UNITS = ["repo.code", "repo.issues", "repo.pulls", "repo.releases", "repo.packages", "repo.actions"];

/** Creates the fixture users, organizations and teams that do not exist yet. */
export class FixtureOwnerSeeder {
  private readonly api: ForgejoApi;

  public constructor(api: ForgejoApi) {
    this.api = api;
  }

  public async seed(owners: FixtureOwners): Promise<void> {
    for (const user of owners.users) await this.seedUser(user);
    for (const organization of owners.organizations) await this.seedOrganization(organization);
  }

  private async seedUser(user: FixtureUser): Promise<void> {
    if (!(await this.api.find(`/users/${user.login}`)))
      await this.api.post("/admin/users", {
        username: user.login,
        email: user.email,
        password: FIXTURES.userPassword,
        must_change_password: false,
      });
    await this.api.patch(`/admin/users/${user.login}`, {
      login_name: user.login,
      source_id: 0,
      full_name: user.fullName,
    });
  }

  private async seedOrganization(organization: FixtureOrganization): Promise<void> {
    if (await this.api.find(`/orgs/${organization.name}`)) return;
    await this.api.post("/orgs", {
      username: organization.name,
      full_name: organization.fullName,
      description: organization.description,
      website: organization.website,
      location: organization.location,
      visibility: "public",
    });
    for (const team of organization.teams) {
      const created = await this.api.post<Identified>(`/orgs/${organization.name}/teams`, {
        name: team.name,
        permission: team.permission,
        includes_all_repositories: true,
        units: TEAM_UNITS,
      });
      for (const member of team.members) await this.api.put(`/teams/${created.id}/members/${member}`);
    }
  }
}

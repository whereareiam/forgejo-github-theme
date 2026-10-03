export interface FixtureOwners {
  readonly users: readonly FixtureUser[];
  readonly organizations: readonly FixtureOrganization[];
}

export interface FixtureUser {
  readonly login: string;
  readonly fullName: string;
  readonly email: string;
  readonly joinedDaysAgo: number;
}

export interface FixtureOrganization {
  readonly name: string;
  readonly fullName: string;
  readonly description: string;
  readonly website: string;
  readonly location: string;
  readonly teams: readonly FixtureTeam[];
}

export interface FixtureTeam {
  readonly name: string;
  readonly permission: "read" | "write" | "admin";
  readonly members: readonly string[];
}

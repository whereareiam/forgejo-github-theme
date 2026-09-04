export type FixtureOwnerType = "organization" | "user";

export class FixtureDefinition {
  public readonly owner: string;
  public readonly repository: string;
  public readonly ownerType: FixtureOwnerType;
  public readonly displayName: string;

  public constructor(owner: string, repository: string, ownerType: FixtureOwnerType, displayName: string) {
    this.owner = owner;
    this.repository = repository;
    this.ownerType = ownerType;
    this.displayName = displayName;
  }

  public get identifier(): string {
    return `${this.owner}/${this.repository}`;
  }
}

export const FIXTURE_DEFINITIONS = [
  new FixtureDefinition("whereareiam", "identica-docs", "user", "whereareiam"),
  new FixtureDefinition("arcadeya", "devops", "organization", "Arcadeya"),
] as const;

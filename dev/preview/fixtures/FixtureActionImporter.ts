import { Buffer } from "node:buffer";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname } from "node:path";

import { FIXTURES } from "../config/constants.ts";
import { PreviewConfig } from "../config/PreviewConfig.ts";
import { ForgejoCompose } from "../forgejo/ForgejoCompose.ts";
import type { FixtureActions, FixtureHome, FixtureRow } from "./FixtureArchive.ts";

type TableName = keyof FixtureActions;

interface TablePlan {
  readonly table: TableName;
  readonly parent?: TableName;
  readonly parentColumn?: string;
}

export interface FixtureRepositoryMapping {
  readonly sourceId: number;
  readonly localId: number;
}

const TABLE_PLANS: readonly TablePlan[] = [
  { table: "action_run" },
  { table: "action_run_job", parent: "action_run", parentColumn: "run_id" },
  { table: "action_task", parent: "action_run_job", parentColumn: "job_id" },
  { table: "action_task_step", parent: "action_task", parentColumn: "task_id" },
  { table: "action_task_output", parent: "action_task", parentColumn: "task_id" },
  { table: "action_artifact", parent: "action_run", parentColumn: "run_id" },
];

export class FixtureActionImporter {
  private readonly config: PreviewConfig;
  private readonly compose: ForgejoCompose;

  public constructor(config: PreviewConfig, compose: ForgejoCompose) {
    this.config = config;
    this.compose = compose;
  }

  public import(
    actions: FixtureActions,
    home: FixtureHome,
    repositories: readonly FixtureRepositoryMapping[],
    repositoryId: number,
    ownerId: number,
    logDirectory: string
  ): void {
    this.compose.stopService();
    try {
      this.compose.removeDatabaseSidecars(FIXTURES.databaseFile);
      this.copyDatabaseFromContainer();
      this.importDatabase(actions, home, repositories, repositoryId, ownerId);
      this.compose.removeDatabaseSidecars(FIXTURES.databaseFile);
      this.compose.copyToContainer(this.config.fixtureDatabaseFile, FIXTURES.databaseFile);
      this.compose.repairDatabaseOwnership(FIXTURES.databaseFile);
      this.copyLogs(logDirectory);
    } finally {
      this.compose.startService();
    }
  }

  private copyDatabaseFromContainer(): void {
    mkdirSync(dirname(this.config.fixtureDatabaseFile), { recursive: true });
    rmSync(this.config.fixtureDatabaseFile, { force: true });
    this.compose.copyFromContainer(FIXTURES.databaseFile, this.config.fixtureDatabaseFile);
  }

  private importDatabase(
    actions: FixtureActions,
    home: FixtureHome,
    repositories: readonly FixtureRepositoryMapping[],
    repositoryId: number,
    ownerId: number
  ): void {
    const database = new SqliteFixtureDatabase(this.config.fixtureDatabaseFile);
    database.transaction(() => {
      this.deleteExisting(database, repositoryId);
      this.deleteGeneratedActivity(database, repositories);
      this.restoreUserTimeline(database, home.userCreatedUnix, ownerId);
      this.restoreRepositoryTimeline(database, home, repositories);
      this.restoreActivity(database, home.actions, repositories, ownerId);
      this.restoreCommitEmails(database, home.commitEmails, ownerId);
      const identifierMaps = new Map<TableName, Map<number, number>>();
      for (const plan of TABLE_PLANS)
        this.insertRows(database, plan, actions[plan.table], identifierMaps, repositoryId, ownerId);
    });
  }

  private copyLogs(logDirectory: string): void {
    if (!existsSync(logDirectory)) throw new Error(`Missing fixture log directory: ${logDirectory}`);
    this.compose.copyToContainer(`${logDirectory}/.`, FIXTURES.actionLogDirectory);
    this.compose.repairOwnership(FIXTURES.actionLogDirectory);
  }

  private deleteExisting(database: SqliteFixtureDatabase, repositoryId: number): void {
    const taskIds = "SELECT id FROM action_task WHERE repo_id = ?";
    database.run(`DELETE FROM action_task_step WHERE task_id IN (${taskIds})`, [repositoryId]);
    database.run(`DELETE FROM action_task_output WHERE task_id IN (${taskIds})`, [repositoryId]);
    database.run("DELETE FROM action_artifact WHERE repo_id = ?", [repositoryId]);
    database.run("DELETE FROM action_task WHERE repo_id = ?", [repositoryId]);
    database.run("DELETE FROM action_run_job WHERE repo_id = ?", [repositoryId]);
    database.run("DELETE FROM action_run WHERE repo_id = ?", [repositoryId]);
  }

  private deleteGeneratedActivity(database: SqliteFixtureDatabase, repositories: readonly FixtureRepositoryMapping[]): void {
    database.run(
      `DELETE FROM action WHERE repo_id IN (${repositories.map(() => "?").join(", ")})`,
      repositories.map(repository => repository.localId)
    );
  }

  private restoreRepositoryTimeline(
    database: SqliteFixtureDatabase,
    home: FixtureHome,
    repositories: readonly FixtureRepositoryMapping[]
  ): void {
    for (const sourceRepository of home.repositories) {
      const localRepository = repositories.find(repository => repository.sourceId === sourceRepository.id);
      if (!localRepository) throw new Error(`Missing local repository mapping for source repository ${sourceRepository.id}.`);
      database.run(
        "UPDATE repository SET created_unix = ?, updated_unix = ? WHERE id = ?",
        [sourceRepository.created_unix, sourceRepository.updated_unix, localRepository.localId]
      );
    }
  }

  private restoreUserTimeline(database: SqliteFixtureDatabase, createdUnix: number, ownerId: number): void {
    database.run("UPDATE user SET created_unix = ? WHERE id = ?", [createdUnix, ownerId]);
  }

  private restoreActivity(
    database: SqliteFixtureDatabase,
    actions: readonly FixtureRow[],
    repositories: readonly FixtureRepositoryMapping[],
    ownerId: number
  ): void {
    const supportedColumns = new Set(database.columnNames("action"));
    const identifierOffset = database.maximumIdentifier("action");
    for (const [index, action] of actions.entries()) {
      const normalized = { ...action };
      normalized.id = identifierOffset + index + 1;
      normalized.user_id = ownerId;
      normalized.act_user_id = ownerId;
      normalized.repo_id = this.localRepositoryId(action.repo_id, repositories);
      const columns = Object.keys(normalized).filter(column => supportedColumns.has(column));
      database.insert(
        "action",
        columns,
        columns.map(column => normalized[column])
      );
    }
  }

  private restoreCommitEmails(database: SqliteFixtureDatabase, emails: readonly string[], ownerId: number): void {
    for (const email of emails)
      database.run(
        "INSERT OR IGNORE INTO email_address (uid, email, lower_email, is_activated, is_primary) VALUES (?, ?, ?, ?, ?)",
        [ownerId, email, email.toLowerCase(), true, false]
      );
  }

  private localRepositoryId(sourceId: unknown, repositories: readonly FixtureRepositoryMapping[]): number {
    if (typeof sourceId !== "number") throw new Error("Fixture activity is missing a source repository ID.");
    const repository = repositories.find(candidate => candidate.sourceId === sourceId);
    if (!repository) throw new Error(`Missing local repository mapping for source repository ${sourceId}.`);
    return repository.localId;
  }

  private insertRows(
    database: SqliteFixtureDatabase,
    plan: TablePlan,
    rows: readonly FixtureRow[],
    identifierMaps: Map<TableName, Map<number, number>>,
    repositoryId: number,
    ownerId: number
  ): void {
    const supportedColumns = this.supportedColumns(database, plan.table);
    const identifierMap = this.createIdentifierMap(database, plan.table, rows);
    identifierMaps.set(plan.table, identifierMap);

    for (const row of rows) {
      const normalized = this.normalizeRow(row, plan, identifierMaps, identifierMap, repositoryId, ownerId);
      const columns = Object.keys(normalized).filter(column => supportedColumns.has(column));
      if (columns.length === 0) continue;
      database.insert(
        plan.table,
        columns,
        columns.map(column => normalized[column])
      );
    }
  }

  private supportedColumns(database: SqliteFixtureDatabase, table: TableName): Set<string> {
    return new Set(database.columnNames(table));
  }

  private createIdentifierMap(
    database: SqliteFixtureDatabase,
    table: TableName,
    rows: readonly FixtureRow[]
  ): Map<number, number> {
    const currentMaximum = database.maximumIdentifier(table);
    const identifiers = rows
      .map(row => this.number(row.id))
      .filter((identifier): identifier is number => identifier !== undefined);
    return new Map(identifiers.map((identifier, index) => [identifier, currentMaximum + index + 1]));
  }

  private normalizeRow(
    row: FixtureRow,
    plan: TablePlan,
    identifierMaps: ReadonlyMap<TableName, Map<number, number>>,
    identifierMap: ReadonlyMap<number, number>,
    repositoryId: number,
    ownerId: number
  ): Record<string, unknown> {
    const normalized: Record<string, unknown> = { ...row };
    const logIndexesBase64 = normalized.log_indexes_base64;
    if (typeof logIndexesBase64 === "string") {
      normalized.log_indexes = Buffer.from(logIndexesBase64, "base64");
      delete normalized.log_indexes_base64;
    }
    const sourceId = this.number(row.id);
    if (sourceId !== undefined) normalized.id = identifierMap.get(sourceId);
    if ("repo_id" in normalized) normalized.repo_id = repositoryId;
    if ("owner_id" in normalized) normalized.owner_id = ownerId;
    for (const column of ["trigger_user_id", "pull_request_poster_id", "approved_by"])
      if (this.number(normalized[column]) !== undefined) normalized[column] = ownerId;
    if ("runner_id" in normalized) normalized.runner_id = 0;
    if (plan.parent && plan.parentColumn) {
      const sourceParentId = this.number(normalized[plan.parentColumn]);
      const parentId = sourceParentId === undefined ? undefined : identifierMaps.get(plan.parent)?.get(sourceParentId);
      if (parentId === undefined) throw new Error(`Fixture ${plan.table} row has no matching ${plan.parent} parent.`);
      normalized[plan.parentColumn] = parentId;
    }
    return normalized;
  }

  private number(value: unknown): number | undefined {
    return typeof value === "number" ? value : undefined;
  }
}

class SqliteFixtureDatabase {
  private readonly file: string;
  private readonly statements: string[] = [];

  public constructor(file: string) {
    this.file = file;
  }

  public transaction(callback: () => void): void {
    this.statements.push("PRAGMA foreign_keys = OFF", "BEGIN IMMEDIATE");
    callback();
    this.statements.push("COMMIT");
    execFileSync("sqlite3", [this.file], { input: this.statements.join(";\n"), stdio: ["pipe", "inherit", "inherit"] });
  }

  public run(statement: string, values: readonly unknown[]): void {
    this.statements.push(this.bindValues(statement, values));
  }

  public columnNames(table: string): readonly string[] {
    const output = execFileSync("sqlite3", [this.file, `SELECT name FROM pragma_table_info('${table}')`], {
      encoding: "utf8",
    });
    return output.trim().split("\n").filter(Boolean);
  }

  public maximumIdentifier(table: string): number {
    const output = execFileSync("sqlite3", [this.file, `SELECT coalesce(max(id), 0) FROM ${table}`], {
      encoding: "utf8",
    });
    return Number(output.trim());
  }

  public insert(table: string, columns: readonly string[], values: readonly unknown[]): void {
    this.statements.push(
      `INSERT INTO ${this.identifier(table)} (${columns.map(column => this.identifier(column)).join(", ")}) VALUES (${values.map(value => this.literal(value)).join(", ")})`
    );
  }

  private bindValues(statement: string, values: readonly unknown[]): string {
    let valueIndex = 0;
    const bound = statement.replaceAll("?", () => this.literal(values[valueIndex++]));
    if (valueIndex !== values.length) throw new Error("Fixture database statement has an unexpected number of values.");
    return bound;
  }

  private literal(value: unknown): string {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "1" : "0";
    if (value instanceof Uint8Array) return `X'${Buffer.from(value).toString("hex")}'`;
    const text = typeof value === "string" ? value : JSON.stringify(value);
    return `'${text.replaceAll("'", "''")}'`;
  }

  private identifier(value: string): string {
    return `"${value.replaceAll('"', '""')}"`;
  }
}

import { Buffer } from "node:buffer";
import { execFileSync } from "node:child_process";

interface Column {
  readonly name: string;
  readonly required: boolean;
}

export type FixtureDatabaseRow = Readonly<Record<string, unknown>>;

/**
 * Collects statements for a copy of the preview's SQLite database and applies them in one transaction.
 * Rows are checked against the live schema, so a Forgejo upgrade that renames a column fails here by name.
 */
export class FixtureDatabase {
  private readonly file: string;
  private readonly statements: string[] = [];
  private readonly columns = new Map<string, readonly Column[]>();
  private readonly identifiers = new Map<string, number>();

  public constructor(file: string) {
    this.file = file;
  }

  public apply(): void {
    const script = [
      "PRAGMA foreign_keys = OFF",
      "BEGIN IMMEDIATE",
      ...this.statements,
      "COMMIT",
      "PRAGMA wal_checkpoint(TRUNCATE)",
    ].join(";\n");
    execFileSync("sqlite3", [this.file], { input: `${script};\n`, stdio: ["pipe", "ignore", "inherit"] });
  }

  public run(statement: string, values: readonly unknown[]): void {
    let index = 0;
    const bound = statement.replaceAll("?", () => this.literal(values[index++]));
    if (index !== values.length)
      throw new Error(`Fixture statement expects ${index} values, got ${values.length}: ${statement}`);
    this.statements.push(bound);
  }

  public insert(table: string, row: FixtureDatabaseRow): void {
    const columns = this.tableColumns(table);
    const unknown = Object.keys(row).filter(name => !columns.some(column => column.name === name));
    if (unknown.length > 0)
      throw new Error(
        `Forgejo's ${table} table has no column ${unknown.join(", ")}; update the fixture database writers.`
      );
    const missing = columns.filter(column => column.required && !(column.name in row)).map(column => column.name);
    if (missing.length > 0)
      throw new Error(`Forgejo's ${table} table requires ${missing.join(", ")}; update the fixture database writers.`);
    const names = Object.keys(row);
    this.statements.push(
      `INSERT INTO ${this.quote(table)} (${names.map(name => this.quote(name)).join(", ")}) VALUES (${names.map(name => this.literal(row[name])).join(", ")})`
    );
  }

  /** The next free primary key of a table, counting rows queued in this batch. */
  public nextIdentifier(table: string): number {
    const current =
      this.identifiers.get(table) ?? Number(this.query(`SELECT coalesce(max(id), 0) FROM ${this.quote(table)}`));
    this.identifiers.set(table, current + 1);
    return current + 1;
  }

  private tableColumns(table: string): readonly Column[] {
    const cached = this.columns.get(table);
    if (cached) return cached;
    const columns = this.query(
      `SELECT name, "notnull" AND dflt_value IS NULL AND NOT pk FROM pragma_table_info('${table}')`
    )
      .split("\n")
      .filter(Boolean)
      .map(line => {
        const [name = "", required] = line.split("|");
        return { name, required: required === "1" };
      });
    if (columns.length === 0) throw new Error(`Forgejo has no ${table} table; update the fixture database writers.`);
    this.columns.set(table, columns);
    return columns;
  }

  private query(statement: string): string {
    return execFileSync("sqlite3", [this.file, statement], { encoding: "utf8" }).trim();
  }

  private literal(value: unknown): string {
    if (value === null || value === undefined) return "NULL";
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "1" : "0";
    if (value instanceof Uint8Array) return `X'${Buffer.from(value).toString("hex")}'`;
    const text = typeof value === "string" ? value : JSON.stringify(value);
    return `'${text.replaceAll("'", "''")}'`;
  }

  private quote(name: string): string {
    return `"${name.replaceAll('"', '""')}"`;
  }
}

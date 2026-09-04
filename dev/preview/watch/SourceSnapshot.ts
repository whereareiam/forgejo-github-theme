import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export class SourceSnapshot {
  private readonly sourcePaths: readonly string[];

  public constructor(sourcePaths: readonly string[]) {
    this.sourcePaths = sourcePaths;
  }

  public read(): string {
    return this.sourcePaths
      .flatMap(path => this.files(path))
      .map(path => `${path}:${statSync(path).mtimeMs}`)
      .join("\n");
  }

  private files(path: string): string[] {
    if (!statSync(path).isDirectory()) return [path];
    return readdirSync(path, { withFileTypes: true }).flatMap(entry => this.files(join(path, entry.name)));
  }
}

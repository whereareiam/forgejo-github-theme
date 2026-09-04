import { COMMANDS, COMPOSE } from "../config/constants.ts";
import { PreviewConfig } from "../config/PreviewConfig.ts";
import { CommandRunner } from "../CommandRunner.ts";

export class ForgejoCompose {
  private readonly config: PreviewConfig;
  private readonly runner: CommandRunner;

  public constructor(config: PreviewConfig, runner: CommandRunner) {
    this.config = config;
    this.runner = runner;
  }

  public start(): void {
    this.run(["up", "-d", this.config.composeService]);
  }

  public stop(): void {
    this.run(["down"]);
  }

  public stopService(): void {
    this.run(["stop", this.config.composeService]);
  }

  public restart(): void {
    this.run(["restart", this.config.composeService]);
  }

  public execute(args: readonly string[]): void {
    this.run(["exec", "-T", this.config.composeService, ...args]);
  }

  public capture(args: readonly string[]): string {
    return this.runner.capture(COMMANDS.docker, this.composeArgs(["exec", "-T", this.config.composeService, ...args]));
  }

  public copyFromContainer(source: string, destination: string): void {
    this.runner.run(COMMANDS.docker, ["cp", `${this.containerName()}:${source}`, destination]);
  }

  public copyToContainer(source: string, destination: string): void {
    this.runner.run(COMMANDS.docker, ["cp", source, `${this.containerName()}:${destination}`]);
  }

  public startService(): void {
    this.run(["start", this.config.composeService]);
  }

  public repairDatabaseOwnership(databaseFile: string): void {
    this.repairOwnership(databaseFile);
  }

  public repairOwnership(path: string): void {
    this.runner.run(COMMANDS.docker, [
      "run",
      "--rm",
      "--user",
      "0",
      "--volumes-from",
      COMPOSE.container,
      "--entrypoint",
      "chown",
      COMPOSE.image,
      "1000:1000",
      path,
    ]);
  }

  public removeDatabaseSidecars(databaseFile: string): void {
    this.runner.run(COMMANDS.docker, [
      "run",
      "--rm",
      "--user",
      "0",
      "--volumes-from",
      COMPOSE.container,
      "--entrypoint",
      "rm",
      COMPOSE.image,
      "-f",
      `${databaseFile}-shm`,
      `${databaseFile}-wal`,
    ]);
  }

  private run(args: readonly string[]): void {
    this.runner.run(COMMANDS.docker, this.composeArgs(args));
  }

  private composeArgs(args: readonly string[]): string[] {
    return ["compose", "-f", this.config.composeFile, ...args];
  }

  private containerName(): string {
    return COMPOSE.container;
  }
}

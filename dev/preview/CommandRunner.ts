import { execFileSync } from "node:child_process";

export class CommandRunner {
  private readonly workingDirectory: string;

  public constructor(workingDirectory: string) {
    this.workingDirectory = workingDirectory;
  }

  public run(command: string, args: readonly string[]): void {
    execFileSync(command, [...args], { cwd: this.workingDirectory, stdio: "inherit" });
  }

  public capture(command: string, args: readonly string[]): string {
    return execFileSync(command, [...args], { cwd: this.workingDirectory, encoding: "utf8" });
  }

  /** Whether the command exits successfully; its output is discarded. */
  public succeeds(command: string, args: readonly string[]): boolean {
    try {
      execFileSync(command, [...args], { cwd: this.workingDirectory, stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }

  /** Runs outside the project directory, for work on a temporary checkout. */
  public captureIn(
    directory: string,
    command: string,
    args: readonly string[],
    environment: NodeJS.ProcessEnv = {}
  ): string {
    return execFileSync(command, [...args], {
      cwd: directory,
      encoding: "utf8",
      env: { ...process.env, ...environment },
      stdio: ["ignore", "pipe", "pipe"],
    });
  }
}

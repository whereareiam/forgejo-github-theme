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
}

import { COMMANDS } from "../config/constants.ts";
import { CommandRunner } from "../CommandRunner.ts";

export class ThemeBuilder {
  private readonly runner: CommandRunner;

  public constructor(runner: CommandRunner) {
    this.runner = runner;
  }

  public build(): void {
    this.runner.run(COMMANDS.bun, ["bundle"]);
  }
}

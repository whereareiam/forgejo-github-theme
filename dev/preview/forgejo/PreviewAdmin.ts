import { ADMIN_CREATE_ARGS } from "../config/constants.ts";
import { PreviewConfig } from "../config/PreviewConfig.ts";
import { ForgejoCompose } from "./ForgejoCompose.ts";

export class PreviewAdmin {
  private readonly config: PreviewConfig;
  private readonly compose: ForgejoCompose;

  public constructor(config: PreviewConfig, compose: ForgejoCompose) {
    this.config = config;
    this.compose = compose;
  }

  public ensure(): void {
    try {
      this.compose.capture([
        "forgejo",
        ...ADMIN_CREATE_ARGS,
        "--username",
        this.config.previewUser,
        "--password",
        this.config.previewPassword,
        "--email",
        this.config.previewEmail,
        "--admin",
        "--must-change-password=false",
      ]);
    } catch (error) {
      const output = this.commandOutput(error);
      if (!output.toLowerCase().includes("already exists")) throw error;
    }
  }

  private commandOutput(error: unknown): string {
    if (!(error instanceof Error)) return "";
    const commandError = error as Error & { stdout?: string; stderr?: string };
    return `${commandError.stdout ?? ""}\n${commandError.stderr ?? ""}`;
  }
}

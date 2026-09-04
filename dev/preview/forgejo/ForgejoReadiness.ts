import { PreviewConfig } from "../config/PreviewConfig.ts";

export class ForgejoReadiness {
  private readonly config: PreviewConfig;

  public constructor(config: PreviewConfig) {
    this.config = config;
  }

  public async wait(): Promise<void> {
    for (let attempt = 0; attempt < this.config.maxHealthAttempts; attempt++) {
      try {
        const response = await fetch(this.config.healthUrl);
        if (response.ok) return;
      } catch {
        // Forgejo is still starting.
      }
      await this.delay();
    }

    throw new Error(`Forgejo did not become ready at ${this.config.previewUrl}`);
  }

  private delay(): Promise<void> {
    return new Promise(resolvePromise => setTimeout(resolvePromise, this.config.pollIntervalMs));
  }
}

import { PreviewConfig } from "../config/PreviewConfig.ts";
import { SourceSnapshot } from "./SourceSnapshot.ts";

export class SourceWatcher {
  private readonly snapshot: SourceSnapshot;
  private readonly config: PreviewConfig;

  public constructor(config: PreviewConfig) {
    this.config = config;
    this.snapshot = new SourceSnapshot(config.sourcePaths);
  }

  public async watch(onChange: () => void): Promise<never> {
    let previous = this.snapshot.read();
    while (true) {
      await this.delay();
      const current = this.snapshot.read();
      if (current === previous) continue;
      previous = current;
      onChange();
    }
  }

  private delay(): Promise<void> {
    return new Promise(resolvePromise => setTimeout(resolvePromise, this.config.watchIntervalMs));
  }
}

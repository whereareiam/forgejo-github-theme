import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

import { PreviewConfig } from "../config/PreviewConfig.ts";
import { ForgejoCompose } from "../forgejo/ForgejoCompose.ts";

/** The folders Forgejo mounts from the preview's copy of the built assets. */
const MOUNTED_ASSETS = ["css", "js"] as const;

export class ThemeSynchronizer {
  private readonly config: PreviewConfig;
  private readonly compose: ForgejoCompose;

  public constructor(config: PreviewConfig, compose: ForgejoCompose) {
    this.config = config;
    this.compose = compose;
  }

  /** Copies the built assets into the preview's own folder, where the reloader stamps them; dist stays as built. */
  public stage(): void {
    for (const folder of MOUNTED_ASSETS) {
      const source = join(this.config.themeAssetsDirectory, folder);
      const target = join(this.config.generatedAssetsDirectory, folder);
      // Empty the mounted folder instead of replacing it, so a running container keeps seeing it.
      mkdirSync(target, { recursive: true });
      for (const entry of readdirSync(target)) rmSync(join(target, entry), { force: true, recursive: true });
      cpSync(source, target, { recursive: true });
    }
  }

  public sync(): void {
    this.compose.recreate();
  }
}

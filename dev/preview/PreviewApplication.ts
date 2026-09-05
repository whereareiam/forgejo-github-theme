import { PREVIEW_COMMANDS } from "./config/constants.ts";
import { PreviewConfig } from "./config/PreviewConfig.ts";
import { CommandRunner } from "./CommandRunner.ts";
import { AutoLoginTemplate } from "./auth/AutoLoginTemplate.ts";
import { ForgejoCompose } from "./forgejo/ForgejoCompose.ts";
import { ForgejoReadiness } from "./forgejo/ForgejoReadiness.ts";
import { PreviewAdmin } from "./forgejo/PreviewAdmin.ts";
import { FixtureSeeder } from "./fixtures/FixtureSeeder.ts";
import { PreviewReloader } from "./theme/PreviewReloader.ts";
import { ThemeBuilder } from "./theme/ThemeBuilder.ts";
import { ThemeSynchronizer } from "./theme/ThemeSynchronizer.ts";
import { SourceWatcher } from "./watch/SourceWatcher.ts";

export class PreviewApplication {
  private readonly config: PreviewConfig;
  private readonly builder: ThemeBuilder;
  private readonly reloader: PreviewReloader;
  private readonly compose: ForgejoCompose;
  private readonly readiness: ForgejoReadiness;
  private readonly synchronizer: ThemeSynchronizer;
  private readonly admin: PreviewAdmin;
  private readonly autoLogin: AutoLoginTemplate;
  private readonly watcher: SourceWatcher;
  private readonly fixtureSeeder: FixtureSeeder;

  public constructor(config: PreviewConfig) {
    this.config = config;
    const runner = new CommandRunner(config.projectDirectory);
    this.builder = new ThemeBuilder(runner);
    this.reloader = new PreviewReloader(config);
    this.compose = new ForgejoCompose(config, runner);
    this.readiness = new ForgejoReadiness(config);
    this.synchronizer = new ThemeSynchronizer(this.compose);
    this.admin = new PreviewAdmin(config, this.compose);
    this.autoLogin = new AutoLoginTemplate(config);
    this.watcher = new SourceWatcher(config);
    this.fixtureSeeder = new FixtureSeeder(config, runner, this.compose);
  }

  public async run(command: string): Promise<void> {
    switch (command) {
      case PREVIEW_COMMANDS.start:
        await this.start();
        return;
      case PREVIEW_COMMANDS.stop:
        this.compose.stop();
        return;
      case PREVIEW_COMMANDS.sync:
        this.autoLogin.prepare();
        this.reloader.prepare();
        this.synchronizer.sync();
        this.reloader.publish();
        return;
      case PREVIEW_COMMANDS.watch:
        await this.watch();
        return;
      case PREVIEW_COMMANDS.seedFixtures:
        await this.seed();
        return;
      default:
        throw new Error(`Unknown preview command: ${command}`);
    }
  }

  private async start(): Promise<void> {
    this.autoLogin.prepare();
    this.builder.build();
    this.reloader.prepare();
    this.compose.start();
    await this.readiness.wait();
    this.reloader.publish();
    this.admin.ensure();
    await this.fixtureSeeder.seed();
    console.log(
      `Forgejo development preview: ${this.config.previewUrl} (login: ${this.config.previewUser} / ${this.config.previewPassword})`
    );
  }

  private async watch(): Promise<never> {
    await this.start();
    console.log("Watching theme sources. Press Ctrl+C to stop.");
    return this.watcher.watch(() => {
      this.autoLogin.prepare();
      this.builder.build();
      this.reloader.prepare();
      this.synchronizer.sync();
      this.reloader.publish();
      console.log("Theme preview updated; open preview pages reload automatically.");
    });
  }

  private async seed(): Promise<void> {
    await this.readiness.wait();
    this.admin.ensure();
    await this.fixtureSeeder.seed();
  }
}

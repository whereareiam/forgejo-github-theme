import { ForgejoCompose } from "../forgejo/ForgejoCompose.ts";

export class ThemeSynchronizer {
  private readonly compose: ForgejoCompose;

  public constructor(compose: ForgejoCompose) {
    this.compose = compose;
  }

  public sync(): void {
    this.compose.restart();
  }
}

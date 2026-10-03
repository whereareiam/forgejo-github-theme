import { ApiClient } from "../api/client";

export interface Settings {
  readonly displayName: string;
  readonly notifications: boolean;
}

export class SettingsPage {
  private readonly client: ApiClient;

  public constructor(client: ApiClient) {
    this.client = client;
  }

  public load(): Promise<Settings> {
    return this.client.get<Settings>("/settings");
  }
}

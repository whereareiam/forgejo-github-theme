import { PreviewConfig } from "../config/PreviewConfig.ts";

export class ForgejoApi {
  private readonly config: PreviewConfig;

  public constructor(config: PreviewConfig) {
    this.config = config;
  }

  public async getJson<T>(path: string): Promise<T | undefined> {
    const response = await this.request(path, "GET");
    if (response.status === 404) return undefined;
    await this.assertSuccess(response);
    return (await response.json()) as T;
  }

  public async postJson<T>(path: string, body: unknown): Promise<T | undefined> {
    const response = await this.request(path, "POST", body);
    if (response.status === 409 || response.status === 422) return undefined;
    if (response.status === 500) {
      const message = await response.text();
      if (message.includes("UNIQUE constraint failed: release.repo_id, release.tag_name")) return undefined;
      throw new Error(`Forgejo API request failed (${response.status}): ${message}`);
    }
    await this.assertSuccess(response);
    return (await response.json()) as T;
  }

  private async request(path: string, method: string, body?: unknown): Promise<Response> {
    return fetch(`${this.config.previewUrl}/api/v1${path}`, {
      method,
      headers: {
        authorization: `Basic ${Buffer.from(`${this.config.previewUser}:${this.config.previewPassword}`).toString("base64")}`,
        "content-type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }

  private async assertSuccess(response: Response): Promise<void> {
    if (response.ok) return;
    throw new Error(`Forgejo API request failed (${response.status}): ${await response.text()}`);
  }
}

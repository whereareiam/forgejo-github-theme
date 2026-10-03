import { PreviewConfig } from "../config/PreviewConfig.ts";

/** Calls the preview's API as its administrator; `sudo` performs a request as another fixture user. */
export class ForgejoApi {
  private readonly config: PreviewConfig;

  public constructor(config: PreviewConfig) {
    this.config = config;
  }

  public async find<T>(path: string): Promise<T | undefined> {
    const response = await this.request("GET", `/api/v1${path}`);
    if (response.status === 404) return undefined;
    return this.json<T>(response);
  }

  public async post<T>(path: string, body: unknown, sudo?: string): Promise<T> {
    return this.json<T>(await this.request("POST", `/api/v1${path}`, JSON.stringify(body), "application/json", sudo));
  }

  /** A POST whose response has no body worth reading, such as a merge. */
  public async submit(path: string, body: unknown, sudo?: string): Promise<void> {
    await this.assertSuccess(
      await this.request("POST", `/api/v1${path}`, JSON.stringify(body), "application/json", sudo)
    );
  }

  public async patch<T>(path: string, body: unknown, sudo?: string): Promise<T> {
    return this.json<T>(await this.request("PATCH", `/api/v1${path}`, JSON.stringify(body), "application/json", sudo));
  }

  public async put(path: string, body?: unknown, sudo?: string): Promise<void> {
    const payload = body === undefined ? undefined : JSON.stringify(body);
    await this.assertSuccess(await this.request("PUT", `/api/v1${path}`, payload, "application/json", sudo));
  }

  public async delete(path: string): Promise<void> {
    const response = await this.request("DELETE", `/api/v1${path}`);
    if (response.status !== 404) await this.assertSuccess(response);
  }

  public async attach<T>(path: string, name: string, content: string): Promise<T> {
    const form = new FormData();
    form.append("attachment", new Blob([content]), name);
    return this.json<T>(await this.request("POST", `/api/v1${path}`, form));
  }

  public async uploadPackage(path: string, content: string): Promise<void> {
    await this.assertSuccess(await this.request("PUT", `/api/packages${path}`, content, "application/octet-stream"));
  }

  private async request(
    method: string,
    path: string,
    body?: string | FormData,
    contentType?: string,
    sudo?: string
  ): Promise<Response> {
    const credentials = Buffer.from(`${this.config.previewUser}:${this.config.previewPassword}`).toString("base64");
    const headers: Record<string, string> = { authorization: `Basic ${credentials}` };
    if (contentType && typeof body === "string") headers["content-type"] = contentType;
    if (sudo && sudo !== this.config.previewUser) headers.sudo = sudo;
    return fetch(`${this.config.previewUrl}${path}`, { method, headers, body });
  }

  private async json<T>(response: Response): Promise<T> {
    await this.assertSuccess(response);
    return (await response.json()) as T;
  }

  private async assertSuccess(response: Response): Promise<void> {
    if (response.ok) return;
    throw new Error(`Forgejo ${response.url} failed (${response.status}): ${await response.text()}`);
  }
}

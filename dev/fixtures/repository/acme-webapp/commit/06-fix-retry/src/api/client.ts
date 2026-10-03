export class ApiClient {
  private readonly baseUrl: string;
  private readonly attempts: number;

  public constructor(baseUrl: string, attempts = 3) {
    this.baseUrl = baseUrl;
    this.attempts = attempts;
  }

  public async get<T>(path: string): Promise<T> {
    let failure: unknown;
    for (let attempt = 1; attempt <= this.attempts; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}${path}`);
        if (response.ok) return (await response.json()) as T;
        failure = new Error(`Request failed: ${response.status}`);
      } catch (error) {
        failure = error;
      }
    }
    throw failure;
  }
}

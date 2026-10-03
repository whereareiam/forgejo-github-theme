const DAY_MS = 86_400_000;

/** Fixture times are written as days before the seed, so a preview always looks recently used. */
export class FixtureClock {
  private readonly now: Date;

  public constructor(now: Date = new Date()) {
    this.now = now;
  }

  public at(daysAgo: number, time = "12:00"): Date {
    const [hours = 0, minutes = 0] = time.split(":").map(Number);
    const midnight = Date.UTC(this.now.getUTCFullYear(), this.now.getUTCMonth(), this.now.getUTCDate());
    const moment = midnight - daysAgo * DAY_MS + (hours * 60 + minutes) * 60_000;
    return new Date(Math.min(moment, this.now.getTime()));
  }

  public unix(daysAgo: number, time?: string): number {
    return Math.floor(this.at(daysAgo, time).getTime() / 1000);
  }
}

import { Buffer } from "node:buffer";

const JOB_MARKER = "::job ";
const STEP_MARKER = "::step ";

export interface FixtureActionLogStep {
  readonly name: string;
  readonly lines: readonly string[];
}

/** A run's `.log` file split into its `::job` and `::step` sections. */
export class FixtureActionLog {
  private readonly jobs = new Map<string, FixtureActionLogStep[]>();

  public constructor(text: string, source: string) {
    let steps: FixtureActionLogStep[] | undefined;
    let lines: string[] | undefined;
    for (const line of text.split("\n")) {
      if (line.startsWith(JOB_MARKER)) {
        steps = [];
        lines = undefined;
        this.jobs.set(line.slice(JOB_MARKER.length).trim(), steps);
      } else if (line.startsWith(STEP_MARKER)) {
        if (!steps) throw new Error(`${source}: a ::step line appears before any ::job line.`);
        lines = [];
        steps.push({ name: line.slice(STEP_MARKER.length).trim(), lines });
      } else if (line !== "") {
        if (!lines) throw new Error(`${source}: a log line appears before any ::step line.`);
        lines.push(line);
      }
    }
  }

  public steps(job: string): readonly FixtureActionLogStep[] {
    return this.jobs.get(job) ?? [];
  }

  /** Forgejo stores the byte offset of every log line as a signed varint. */
  public static indexes(lines: readonly string[]): Uint8Array {
    const bytes: number[] = [];
    let offset = 0;
    for (const line of lines) {
      let value = offset * 2;
      while (value >= 0x80) {
        bytes.push((value % 0x80) + 0x80);
        value = Math.floor(value / 0x80);
      }
      bytes.push(value);
      offset += Buffer.byteLength(line);
    }
    return Uint8Array.from(bytes);
  }
}

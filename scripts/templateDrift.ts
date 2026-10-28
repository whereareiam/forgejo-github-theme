import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { pkg } from "./utils";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

const FORGEJO_REPOSITORY = "https://codeberg.org/forgejo/forgejo";
const CACHE_DIRECTORY = join(rootDir, "node_modules", ".cache", "forgejo");
const TEMPLATES_DIRECTORY = join(rootDir, "templates");

const USAGE = `Usage: bun drift [version] [next-version]

  bun drift                 how far each override is from the pinned Forgejo (${pkg.forgejo})
  bun drift 17.1.0          the same against another release
  bun drift 17.0.0 17.1.0   the overridden templates Forgejo changed between two releases, with Forgejo's diff`;

export interface ForgejoVersion {
  version: string;
  tag: string;
}

export interface DriftArguments {
  base: ForgejoVersion;
  next?: ForgejoVersion;
}

export interface DiffSize {
  added: number;
  removed: number;
}

/** A theme template and its diff against Forgejo's file; no size means Forgejo has no such file. */
export interface TemplateDrift {
  path: string;
  size?: DiffSize;
}

/** How an overridden template changed upstream between two releases. */
export type UpstreamChange =
  | { path: string; kind: "changed"; size: DiffSize; diff: string }
  | { path: string; kind: "added" | "removed" };

/** Accepts a release as `17.0.0` or `v17.0.0`, with an optional pre-release suffix such as `-rc0`. */
export function parseForgejoVersion(input: string): ForgejoVersion {
  const match = /^v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)$/.exec(input.trim());
  if (!match) throw new Error(`"${input}" is not a Forgejo release such as 17.0.0`);
  return { version: match[1], tag: `v${match[1]}` };
}

export function parseDriftArguments(args: readonly string[], pinned: string): DriftArguments {
  if (args.length > 2) throw new Error(USAGE);
  const [base = pinned, next] = args;
  return { base: parseForgejoVersion(base), next: next === undefined ? undefined : parseForgejoVersion(next) };
}

/** Reads the line counts of `git diff --numstat` for a single file; no output means the files are identical. */
export function parseNumstat(output: string): DiffSize {
  const line = output.trim();
  if (line === "") return { added: 0, removed: 0 };
  const match = /^(\d+)\t(\d+)\t/.exec(line);
  if (!match || line.includes("\n")) throw new Error(`Unexpected git diff --numstat output: ${line}`);
  return { added: Number(match[1]), removed: Number(match[2]) };
}

export function formatDiffSize(size: DiffSize): string {
  return size.added === 0 && size.removed === 0 ? "identical" : `+${size.added} -${size.removed}`;
}

/** Lists the overrides furthest from Forgejo first, then the theme's own templates. */
export function formatDriftReport(version: ForgejoVersion, drifts: readonly TemplateDrift[]): string {
  const overrides = drifts
    .filter((drift): drift is Required<TemplateDrift> => drift.size !== undefined)
    .sort((a, b) => lineCount(b.size) - lineCount(a.size) || a.path.localeCompare(b.path));
  const own = drifts.filter(drift => drift.size === undefined).map(drift => drift.path);
  const width = Math.max(0, ...overrides.map(drift => formatDiffSize(drift.size).length));
  const lines = [
    `${templates(overrides.length)} overriding Forgejo ${version.tag}, by lines the theme added and removed:`,
  ];
  lines.push(...overrides.map(drift => `  ${formatDiffSize(drift.size).padStart(width)}  ${drift.path}`));
  if (own.length > 0) {
    lines.push(
      "",
      `${templates(own.length)} without a file in Forgejo ${version.tag}; check that none replaces a renamed one:`
    );
    lines.push(...own.sort().map(path => `  ${path}`));
  }
  return lines.join("\n");
}

/** Summarises the upstream changes to port, then prints Forgejo's diff of each changed file. */
export function formatChangeReport(
  base: ForgejoVersion,
  next: ForgejoVersion,
  changes: readonly UpstreamChange[]
): string {
  if (changes.length === 0) return `Forgejo ${base.tag}..${next.tag} changed none of the overridden templates.`;
  const sorted = [...changes].sort((a, b) => a.path.localeCompare(b.path));
  const labels = sorted.map(change => (change.kind === "changed" ? formatDiffSize(change.size) : change.kind));
  const width = Math.max(...labels.map(label => label.length));
  const lines = [`Forgejo ${base.tag}..${next.tag} changed ${templates(changes.length)} the theme overrides:`];
  lines.push(...sorted.map((change, index) => `  ${labels[index].padStart(width)}  ${change.path}`));
  for (const change of sorted) if (change.kind === "changed") lines.push("", change.diff.trimEnd());
  return lines.join("\n");
}

function templates(count: number): string {
  return count === 1 ? "1 template" : `${count} templates`;
}

function lineCount(size: DiffSize): number {
  return size.added + size.removed;
}

function listTemplates(directory: string, base = directory): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listTemplates(path, base) : [relative(base, path)];
  });
}

/** `git diff --no-index` exits with 1 when the files differ, so only a higher status is a failure. */
function gitDiff(directory: string, args: readonly string[]): string {
  const result = spawnSync("git", ["diff", "--no-index", "--no-color", "--no-ext-diff", ...args], {
    cwd: directory,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  if (result.status !== 0 && result.status !== 1)
    throw new Error(`git diff ${args.join(" ")} failed:\n${result.stderr}`);
  return result.stdout;
}

function git(args: readonly string[]): void {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed:\n${result.stderr}`);
}

/** Checks out only `templates/` of a release, once; a failed clone leaves no cache behind. */
function fetchUpstream(version: ForgejoVersion): string {
  const directory = join(CACHE_DIRECTORY, version.tag);
  if (existsSync(join(directory, "templates"))) return directory;
  const partial = `${directory}.partial-${process.pid}`;
  mkdirSync(CACHE_DIRECTORY, { recursive: true });
  rmSync(partial, { recursive: true, force: true });
  console.error(`Fetching the templates of Forgejo ${version.tag} from ${FORGEJO_REPOSITORY}`);
  try {
    git([
      "clone",
      "--quiet",
      "--depth=1",
      "--filter=blob:none",
      "--sparse",
      "--branch",
      version.tag,
      FORGEJO_REPOSITORY,
      partial,
    ]);
    git(["-C", partial, "sparse-checkout", "set", "templates"]);
    rmSync(directory, { recursive: true, force: true });
    renameSync(partial, directory);
  } finally {
    rmSync(partial, { recursive: true, force: true });
  }
  return directory;
}

function measureDrift(upstream: string): TemplateDrift[] {
  return listTemplates(TEMPLATES_DIRECTORY).map(path => {
    const upstreamFile = join(upstream, "templates", path);
    if (!existsSync(upstreamFile)) return { path };
    return { path, size: parseNumstat(gitDiff(rootDir, ["--numstat", upstreamFile, join(TEMPLATES_DIRECTORY, path)])) };
  });
}

function listUpstreamChanges(base: ForgejoVersion, next: ForgejoVersion): UpstreamChange[] {
  const files = (version: ForgejoVersion, path: string) => join(version.tag, "templates", path);
  return listTemplates(TEMPLATES_DIRECTORY).flatMap((path): UpstreamChange[] => {
    const before = existsSync(join(CACHE_DIRECTORY, files(base, path)));
    const after = existsSync(join(CACHE_DIRECTORY, files(next, path)));
    if (!before && !after) return [];
    if (!before || !after) return [{ path, kind: after ? "added" : "removed" }];
    const pair = [files(base, path), files(next, path)];
    const size = parseNumstat(gitDiff(CACHE_DIRECTORY, ["--numstat", ...pair]));
    if (lineCount(size) === 0) return [];
    return [{ path, kind: "changed", size, diff: gitDiff(CACHE_DIRECTORY, ["--no-prefix", ...pair]) }];
  });
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log(USAGE);
    return;
  }
  const { base, next } = parseDriftArguments(args, pkg.forgejo);
  const upstream = fetchUpstream(base);
  if (!next) {
    console.log(formatDriftReport(base, measureDrift(upstream)));
    return;
  }
  fetchUpstream(next);
  console.log(formatChangeReport(base, next, listUpstreamChanges(base, next)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

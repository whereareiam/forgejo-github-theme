export interface FixtureHistory {
  readonly defaultBranch: string;
  readonly commits: readonly FixtureCommit[];
  readonly tags: readonly FixtureTag[];
}

/** A commit applies the files under `commit/<id>/`. A branch seen for the first time starts at the default branch's tip. */
export interface FixtureCommit {
  readonly id: string;
  readonly branch: string;
  readonly author: string;
  readonly daysAgo: number;
  readonly time: string;
  readonly message: string;
  /** Entries the seeder writes after copying the commit's folder. */
  readonly generated?: readonly FixtureGeneratedEntry[];
}

/**
 * What the theme's own checkout should not hold: thousands of files, names some file systems refuse, symlinks and
 * submodules. `files` expands `{00..39}` ranges, padded to the width of the first number, into one file per path.
 */
export type FixtureGeneratedEntry =
  | { readonly files: string; readonly content: string }
  | { readonly symlink: string; readonly target: string }
  | { readonly submodule: string; readonly commit: string };

export interface FixtureTag {
  readonly name: string;
  readonly commit: string;
}

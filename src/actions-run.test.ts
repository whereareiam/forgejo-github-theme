import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("../public/assets/js/actions-run.js", import.meta.url), "utf8");

type Fake = {
  className: string;
  textContent: string;
  hidden?: boolean;
  children: Fake[];
  [key: string]: unknown;
};

// Elements the script builds: enough of the DOM to assemble the run overview and find its parts again.
function created(): Fake {
  const node: Fake = {
    className: "",
    textContent: "",
    children: [],
    dataset: {},
    classList: { add: () => {}, toggle: () => {}, remove: () => {} },
    setAttribute: () => {},
    addEventListener: () => {},
    append: (...nodes: Fake[]) => {
      for (const child of nodes) child.parent = node;
      node.children.push(...nodes);
    },
    appendChild: (child: Fake) => (node.children.push(child), child),
    remove: () => {
      const parent = node.parent as Fake | undefined;
      if (parent) parent.children = parent.children.filter(child => child !== node);
    },
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  return node;
}

const find = (node: Fake, className: string): Fake[] => [
  ...(node.className === className ? [node] : []),
  ...node.children.flatMap(child => find(child, className)),
];

function job(index: number, duration: string, status = "octicon-meter") {
  const state = { duration, status };
  return {
    state,
    element: {
      href: `https://forgejo.test/acme/webapp/actions/runs/7/jobs/${index}`,
      querySelector: (selector: string) =>
        selector === ".job-brief-name"
          ? { textContent: ` job-${index} ` }
          : selector === ".step-summary-duration"
            ? { textContent: state.duration }
            : selector === "svg"
              ? { getAttribute: () => state.status }
              : null,
    },
  };
}

function fixture() {
  const jobs = [job(0, "12s"), job(1, "3s")];
  const lines = [{ textContent: "Compiling app" }, { textContent: "error: missing semicolon" }] as Fake[];
  const result = { textContent: "" };
  const input = { value: "", closest: () => ({ querySelector: () => result }) };
  const right = {
    querySelector: (selector: string) =>
      selector === ".job-info-header-right"
        ? { querySelector: () => ({}) }
        : selector === ".actions-log-search input"
          ? input
          : null,
    querySelectorAll: vi.fn(() => lines),
  };
  const body = created();
  body.querySelector = () => body.children[0] ?? null;
  const header = {
    querySelector: (selector: string) =>
      selector === ".actions-run-back" ? {} : selector.endsWith("> span") ? { getAttribute: () => "Running" } : null,
  };
  const sidebar = {
    querySelector: () => ({ setAttribute: () => {} }),
    querySelectorAll: () => jobs.map(item => item.element),
  };
  const parts: Record<string, unknown> = {
    ".action-view-header": header,
    ".action-view-left": sidebar,
    ".action-view-right": right,
    ".action-view-body": body,
  };
  const run = {
    link: "/acme/webapp/actions/runs/7",
    status: "running",
    commit: { pusher: { displayName: "Ada", link: "/ada" }, shortSHA: "abcdef1", link: "/c", branch: null },
  };
  const mount = {
    dataset: {
      initialPostResponse: JSON.stringify({ state: { run } }),
      workflowSourceUrl: "/acme/webapp/src/branch/main/.forgejo/workflows/ci.yml",
      workflowName: "ci.yml",
    },
    querySelector: (selector: string) => parts[selector] ?? null,
    addEventListener: () => {},
  };
  const page = { parentElement: {}, classList: { toggle: () => {} } };
  const listeners = new Map<string, (event: unknown) => void>();
  const frames: (() => void)[] = [];
  const resizeObservers: { disconnect: () => void }[] = [];
  let mutated = () => {};
  runInNewContext(script, {
    location: { hash: "", pathname: "/acme/webapp/actions/runs/7/jobs/0" },
    fetch: () => new Promise(() => {}),
    document: {
      querySelector: (selector: string) =>
        selector === "#repo-action-view"
          ? mount
          : selector === ".github-actions-run"
            ? page
            : selector === ".action-view-right"
              ? right
              : null,
      createElement: created,
      createElementNS: created,
      addEventListener: (name: string, listener: (event: unknown) => void) => listeners.set(name, listener),
    },
    window: { addEventListener: () => {} },
    requestAnimationFrame: (callback: () => void) => frames.push(callback),
    MutationObserver: class {
      constructor(callback: () => void) {
        mutated = callback;
      }
      observe() {}
    },
    ResizeObserver: class {
      disconnect = vi.fn();
      constructor() {
        resizeObservers.push(this);
      }
      observe() {}
    },
  });
  const flush = () => frames.splice(0).forEach(frame => frame());
  const search = (value: string) => {
    input.value = value;
    listeners.get("input")?.({ target: { matches: () => true } });
  };
  return { jobs, lines, result, right, body, mutated: () => mutated(), flush, frames, resizeObservers, search };
}

describe("Actions run page", () => {
  it("renders once a frame however many mutations a poll causes", () => {
    const f = fixture();
    const overview = f.body.children[0];
    f.mutated();
    f.mutated();
    f.mutated();
    expect(f.frames).toHaveLength(1);
    f.flush();
    expect(f.body.children[0]).toBe(overview);
  });

  it("updates ticking durations in place and rebuilds the graph only when a job changes state", () => {
    const f = fixture();
    const overview = f.body.children[0];
    f.jobs[0].state.duration = "13s";
    f.mutated();
    f.flush();
    expect(f.body.children[0]).toBe(overview);
    expect(find(overview, "actions-job-duration").map(node => node.textContent)).toEqual(["13s", "3s"]);
    expect(f.resizeObservers).toHaveLength(1);

    f.jobs[1].state.status = "octicon-check-circle-fill";
    f.mutated();
    f.flush();
    expect(f.body.children[0]).not.toBe(overview);
    expect(f.resizeObservers).toHaveLength(2);
    expect(f.resizeObservers[0].disconnect).toHaveBeenCalledOnce();
  });

  it("leaves the log lines alone until there is a query, and shows them all again once it is cleared", () => {
    const f = fixture();
    f.mutated();
    f.flush();
    expect(f.right.querySelectorAll).not.toHaveBeenCalled();
    f.search("error");
    expect(f.lines.map(line => line.hidden)).toEqual([true, false]);
    expect(f.result.textContent).toBe("1 match");
    f.search("");
    expect(f.lines.map(line => line.hidden)).toEqual([false, false]);
    expect(f.result.textContent).toBe("");
    f.right.querySelectorAll.mockClear();
    f.mutated();
    f.flush();
    expect(f.right.querySelectorAll).not.toHaveBeenCalled();
  });
});

import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./results.js", import.meta.url), "utf8");
function events() {
  const listeners = new Map<string, (event: Record<string, unknown>) => void>();
  return {
    addEventListener: (name: string, callback: (event: Record<string, unknown>) => void) =>
      listeners.set(name, callback),
    emit: (name: string, event: Record<string, unknown> = {}) => listeners.get(name)?.(event),
  };
}
type ErrorMessage = { textContent: string; remove: () => void };
type Results = {
  id: string;
  status: { textContent: string };
  error?: ErrorMessage;
  querySelector: (selector: string) => { textContent: string } | ErrorMessage | undefined;
  setAttribute: ReturnType<typeof vi.fn>;
  removeAttribute: ReturnType<typeof vi.fn>;
  replaceWith: (next: Results) => void;
  prepend: (message: ErrorMessage) => void;
};

function fixture() {
  const filters = [
    { name: "archived", value: "1" },
    { name: "archived", value: "0" },
    { name: "private", value: "1" },
    { name: "private", value: "0" },
  ].map(input => ({ ...input, type: "checkbox", checked: false, closest: () => null }));
  const clear = { ...events(), disabled: true };
  const fields = { tab: "overview", q: "needle", sort: "recentupdate", page: "3" };
  const count = { textContent: "old count" };
  const sortLabel = { textContent: "old sort" };
  const form = {
    ...events(),
    action: "",
    querySelectorAll: () => filters,
    querySelector: (selector: string) =>
      selector.includes("clear-filters") ? clear : selector.includes("count") ? count : sortLabel,
  };
  const location = { href: "http://localhost/org", reload: vi.fn() };
  const history = { pushState: vi.fn((_state, _title, url: URL) => (location.href = url.href)) };
  const makeResults = (id: string) => {
    const status = { textContent: "" };
    const result: Results = {
      id,
      status,
      error: undefined as { textContent: string; remove: () => void } | undefined,
      querySelector: (selector: string) => (selector.includes("status") ? status : result.error),
      setAttribute: vi.fn(),
      removeAttribute: vi.fn(),
      replaceWith: (next: Results) => {
        rendered = next;
      },
      prepend: (message: { textContent: string; remove: () => void }) => {
        result.error = message;
      },
    };
    return result;
  };
  let rendered = makeResults("initial");
  const document = {
    ...events(),
    querySelector: (selector: string) => (selector.startsWith("form") ? form : rendered),
    createElement: () => ({
      textContent: "",
      setAttribute: vi.fn(),
      remove: () => {
        rendered.error = undefined;
      },
    }),
  };
  const window = events();
  const requests: {
    url: URL;
    signal: AbortSignal;
    resolve: (response: unknown) => void;
    reject: (error: Error) => void;
  }[] = [];
  const fetch = (url: URL, { signal }: { signal: AbortSignal }) =>
    new Promise((resolve, reject) => requests.push({ url, signal, resolve, reject }));
  class SearchFormData {
    *[Symbol.iterator]() {
      yield* Object.entries(fields);
      for (const filter of filters) if (filter.checked) yield [filter.name, filter.value];
    }
  }
  class PageParser {
    parseFromString(body: string) {
      const next = body === "missing" ? null : makeResults(body);
      return {
        querySelector: (selector: string) => (selector.includes("results") ? next : { textContent: body }),
      };
    }
  }
  runInNewContext(script, {
    document,
    window,
    location,
    history,
    URL,
    URLSearchParams,
    AbortController,
    FormData: SearchFormData,
    DOMParser: PageParser,
    fetch,
  });
  const change = (input: (typeof filters)[number]) => {
    const event = { target: input, stopImmediatePropagation: vi.fn() };
    form.emit("change", event);
    return event;
  };
  const respond = (index: number, body: string) => requests[index].resolve({ ok: true, text: async () => body });
  return {
    filters,
    fields,
    clear,
    form,
    document,
    window,
    requests,
    change,
    respond,
    history,
    location,
    count,
    sortLabel,
    results: () => rendered,
  };
}

describe("repository search enhancement", () => {
  it("combines criteria, preserves the overview and query, and removes pagination on a filter change", async () => {
    const f = fixture();
    f.filters[0].checked = true;
    f.filters[2].checked = true;
    expect(f.change(f.filters[2]).stopImmediatePropagation).toHaveBeenCalledOnce();
    const params = f.requests[0].url.searchParams;
    expect(params.get("tab")).toBe("overview");
    expect(params.get("q")).toBe("needle");
    expect(params.get("archived")).toBe("1");
    expect(params.get("private")).toBe("1");
    expect(params.has("page")).toBe(false);
    f.respond(0, "filtered");
    await vi.waitFor(() => expect(f.results().id).toBe("filtered"));
    expect(f.location.href).toContain("tab=overview");
    expect(f.location.reload).not.toHaveBeenCalled();
  });
  it("allows deselection and excludes contradictory values of the same criterion", () => {
    const f = fixture();
    f.filters[0].checked = true;
    f.filters[1].checked = true;
    f.change(f.filters[1]);
    expect(f.filters[0].checked).toBe(false);
    expect(f.requests[0].url.searchParams.getAll("archived")).toEqual(["0"]);
    f.filters[1].checked = false;
    f.change(f.filters[1]);
    expect(f.requests[1].url.searchParams.has("archived")).toBe(false);
  });
  it("clears checkbox filters through an action while preserving search and sort", () => {
    const f = fixture();
    f.filters[0].checked = true;
    f.filters[2].checked = true;
    f.clear.emit("click");
    expect(f.filters.every(input => !input.checked)).toBe(true);
    expect(f.clear.disabled).toBe(true);
    expect(f.requests[0].url.searchParams.get("sort")).toBe("recentupdate");
    expect(f.requests[0].url.searchParams.get("q")).toBe("needle");
    expect(f.requests[0].url.searchParams.has("private")).toBe(false);
  });
  it("never lets a slower obsolete response replace newer results", async () => {
    const f = fixture();
    f.change(f.filters[0]);
    f.change(f.filters[2]);
    expect(f.requests[0].signal.aborted).toBe(true);
    f.respond(1, "newer");
    await vi.waitFor(() => expect(f.results().id).toBe("newer"));
    f.respond(0, "older");
    await Promise.resolve();
    await Promise.resolve();
    expect(f.results().id).toBe("newer");
    expect(f.history.pushState).toHaveBeenCalledOnce();
  });
  it("keeps the previous results and reports a failed request instead of silently showing stale data", async () => {
    const f = fixture();
    f.change(f.filters[0]);
    f.requests[0].reject(new Error("Offline"));
    await vi.waitFor(() => expect(f.results().error?.textContent).toContain("could not be updated"));
    expect(f.results().id).toBe("initial");
    expect(f.history.pushState).not.toHaveBeenCalled();
    expect(f.results().removeAttribute).toHaveBeenCalledWith("aria-busy");
  });
  it("rejects responses without a result fragment and restores server state on browser history navigation", async () => {
    const f = fixture();
    f.change(f.filters[0]);
    f.respond(0, "missing");
    await vi.waitFor(() => expect(f.results().error).toBeDefined());
    f.window.emit("popstate");
    expect(f.location.reload).toHaveBeenCalledOnce();
  });
  it("does not intercept pagination-like links to another origin or route", () => {
    const f = fixture();
    for (const href of ["https://other.example/org?page=2", "http://localhost/other?page=2"]) {
      const preventDefault = vi.fn();
      f.document.emit("click", { target: { closest: () => ({ href }) }, button: 0, preventDefault });
      expect(preventDefault).not.toHaveBeenCalled();
    }
    expect(f.requests).toHaveLength(0);
  });
  it("rejects a redirected response from another origin before replacing results", async () => {
    const f = fixture();
    f.change(f.filters[0]);
    f.requests[0].resolve({ ok: true, url: "https://other.example/org", text: async () => "untrusted" });
    await vi.waitFor(() => expect(f.results().error).toBeDefined());
    expect(f.results().id).toBe("initial");
    expect(f.history.pushState).not.toHaveBeenCalled();
  });
});

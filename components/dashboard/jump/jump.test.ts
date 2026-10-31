import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("./jump.js", import.meta.url), "utf8");

type Listener = (event: Record<string, unknown>) => void;
type Fake = {
  tagName: string;
  className: string;
  id: string;
  href: string;
  title: string;
  textContent: string;
  tabIndex: number;
  hidden: boolean;
  src?: string;
  dataset: Record<string, string>;
  attributes: Map<string, string>;
  children: Fake[];
  parent?: Fake;
  classList: {
    add: (name: string) => void;
    remove: (name: string) => void;
    toggle: (name: string, force?: boolean) => void;
    contains: (name: string) => boolean;
  };
  setAttribute: (name: string, value: string) => void;
  removeAttribute: (name: string) => void;
  getAttribute: (name: string) => string | null;
  append: (...nodes: Fake[]) => void;
  replaceChildren: (...nodes: Fake[]) => void;
  closest: (selector: string) => Fake | null;
  scrollIntoView: () => void;
};

function element(tag: string, dataset: Record<string, string> = {}): Fake {
  const classes = () => node.className.split(" ").filter(Boolean);
  const adopt = (nodes: Fake[]) => nodes.forEach(child => (child.parent = node));
  const node: Fake = {
    tagName: tag.toUpperCase(),
    className: "",
    id: "",
    href: "",
    title: "",
    textContent: "",
    tabIndex: 0,
    hidden: false,
    dataset,
    attributes: new Map(),
    children: [],
    classList: {
      add: name => (node.className = [...new Set([...classes(), name])].join(" ")),
      remove: name =>
        (node.className = classes()
          .filter(other => other !== name)
          .join(" ")),
      toggle: (name, force) => (force ? node.classList.add(name) : node.classList.remove(name)),
      contains: name => classes().includes(name),
    },
    setAttribute: (name, value) => node.attributes.set(name, value),
    removeAttribute: name => node.attributes.delete(name),
    getAttribute: name => node.attributes.get(name) ?? null,
    append: (...nodes) => {
      adopt(nodes);
      node.children.push(...nodes);
    },
    replaceChildren: (...nodes) => {
      adopt(nodes);
      node.children = nodes;
    },
    // Only the two selectors jump.js asks for.
    closest: selector => {
      for (let at: Fake | undefined = node; at; at = at.parent) {
        if (selector === "[hidden]" ? at.hidden : at.tagName === selector.toUpperCase()) return at;
      }
      return null;
    },
    scrollIntoView: () => {},
  };
  return node;
}

function descendants(root: Fake): Fake[] {
  return root.children.flatMap(child => [child, ...descendants(child)]);
}

type Repo = { id: number; full_name: string; link: string; private?: boolean; fork?: boolean };
type Org = { name: string; link: string; avatar?: string };

function fixture(recent: Repo[], orgs: Org[], orgsOk: boolean[] = [true]) {
  const listeners = new Map<string, Listener>();
  const panelListeners = new Map<string, Listener>();
  const group = (name: string) => element("div", { themeJumpGroup: name });
  const repos = { group: group("repos"), list: element("ul") };
  const orgGroup = { group: group("orgs"), list: element("ul") };
  repos.group.append(repos.list);
  orgGroup.group.append(orgGroup.list);
  const message = element("p");
  const searchGroup = group("search");
  const searchList = element("ul");
  const searchItem = element("li");
  const button = element("button");
  button.className = "theme-jump-item";
  button.id = "theme-jump-search";
  button.setAttribute("role", "option");
  const query = element("span");
  button.append(query);
  searchItem.append(button);
  searchList.append(searchItem);
  searchGroup.append(searchList);
  for (const block of [repos.group, orgGroup.group, message, searchGroup]) block.hidden = true;
  const icons = {
    ...element("template"),
    content: {
      querySelector: (selector: string) => {
        const name = /data-icon="(\w+)"/.exec(selector)?.[1] ?? "";
        return { cloneNode: () => element("svg", { icon: name }) };
      },
    },
  };
  const text = element("template", { empty: "No results", error: "Could not load" });

  const input = {
    ...element("input"),
    value: "",
    addEventListener: (name: string, fn: Listener) => listeners.set(name, fn),
  };
  const form = { ...element("form"), querySelector: () => input };
  const listbox = element("div");
  listbox.id = "theme-jump";
  listbox.setAttribute("role", "listbox");
  listbox.append(repos.group, orgGroup.group, searchGroup);
  const panel = {
    ...element("div", {
      repos: "/repo/search",
      orgs: "/user/settings/organization",
      uid: "7",
      limit: "5",
    }),
    hidden: true,
    closest: (selector: string) => (selector === "form" ? form : null),
    querySelector: (selector: string) =>
      ({
        '[role="listbox"]': listbox,
        '[data-theme-jump-group="repos"]': repos.group,
        '[data-theme-jump-group="orgs"]': orgGroup.group,
        '[data-theme-jump-group="search"]': searchGroup,
        '[data-theme-jump-list="repos"]': repos.list,
        '[data-theme-jump-list="orgs"]': orgGroup.list,
        "[data-theme-jump-message]": message,
        "[data-theme-jump-query]": query,
        "[data-theme-jump-icons]": icons,
        "[data-theme-jump-text]": text,
      })[selector],
    querySelectorAll: (selector: string) => {
      const all = descendants(panel);
      if (selector === '[role="option"]') return all.filter(node => node.getAttribute("role") === "option");
      if (selector === ".theme-jump-item.active")
        return all.filter(node => node.classList.contains("theme-jump-item") && node.classList.contains("active"));
      throw new Error(`Unexpected selector ${selector}`);
    },
    addEventListener: (name: string, fn: Listener) => panelListeners.set(name, fn),
  };
  panel.append(message, listbox, icons, text);

  // Forgejo's repository search matches the name only; the empty query lists the most recently updated.
  const fetch = vi.fn(async (url: string) => {
    if (url === "/user/settings/organization") {
      const ok = orgsOk.shift() ?? true;
      return { ok, text: async () => "<html></html>" };
    }
    const params = new URL(url, "http://forgejo").searchParams;
    const q = params.get("q") ?? "";
    const found = recent.filter(repo => repo.full_name.split("/")[1].includes(q));
    const data = found.slice(0, Number(params.get("limit"))).map(repository => ({ repository }));
    return { ok: true, json: async () => ({ ok: true, data }) };
  });
  class DOMParser {
    parseFromString() {
      return {
        querySelectorAll: () =>
          orgs.map(org => ({
            dataset: { themeOrganization: org.name, themeOrganizationLink: org.link },
            querySelector: () => (org.avatar ? { getAttribute: () => org.avatar } : undefined),
          })),
      };
    }
  }
  // The typing delay runs when the test says so.
  let pending: (() => void) | undefined;
  const location = { href: "" };
  runInNewContext(script, {
    document: { querySelector: () => panel, createElement: (tag: string) => element(tag) },
    fetch,
    DOMParser,
    location,
    URLSearchParams,
    AbortController,
    setTimeout: (fn: () => void) => ((pending = fn), 1),
    clearTimeout: () => (pending = undefined),
    Promise,
    Set,
    Number,
    String,
    Boolean,
    Math,
    Error,
  });

  const settle = () => new Promise(resolve => setTimeout(resolve, 0));
  const focus = async () => {
    listeners.get("focus")?.({});
    await settle();
  };
  const type = async (value: string) => {
    input.value = value;
    listeners.get("input")?.({});
    pending?.();
    await settle();
  };
  const key = (name: string) => {
    const event = { key: name, preventDefault: vi.fn() };
    listeners.get("keydown")?.(event);
    return event;
  };
  const rows = (list: Fake) => list.children.map(item => item.children[0]);
  const names = (list: Fake) => rows(list).map(row => row.children[1].textContent);
  const active = () => descendants(panel).filter(node => node.classList.contains("active"));
  const calls = () => fetch.mock.calls.map(([url]) => url);
  return {
    panel,
    input,
    repos,
    orgs: orgGroup,
    message,
    searchGroup,
    button,
    query,
    location,
    listeners,
    panelListeners,
    fetch,
    calls,
    focus,
    type,
    key,
    rows,
    names,
    active,
    settle,
  };
}

const recent: Repo[] = [
  { id: 1, full_name: "alex/notes", link: "/alex/notes", private: true },
  { id: 2, full_name: "acme/webapp", link: "/acme/webapp" },
  { id: 3, full_name: "alex/dotfiles", link: "/alex/dotfiles", fork: true },
  { id: 4, full_name: "acme/api", link: "/acme/api" },
  { id: 5, full_name: "globex/site", link: "/globex/site" },
  { id: 6, full_name: "alex/acme-tools", link: "/alex/acme-tools" },
  { id: 7, full_name: "acme/docs", link: "/acme/docs" },
];
const orgs: Org[] = [
  { name: "acme", link: "/acme", avatar: "/avatars/acme" },
  { name: "globex", link: "/globex" },
];

describe("navbar jump-to", () => {
  it("lists the five most recently updated repositories and the organizations when the field is focused", async () => {
    const f = fixture(recent, orgs);
    expect(f.input.attributes.get("role")).toBe("combobox");
    expect(f.input.attributes.get("aria-controls")).toBe("theme-jump");
    expect(f.fetch).not.toHaveBeenCalled();
    await f.focus();

    expect(f.calls()).toHaveLength(2);
    const params = new URL(f.calls()[0], "http://forgejo").searchParams;
    expect(f.calls()[0].startsWith("/repo/search?")).toBe(true);
    expect(Object.fromEntries(params)).toMatchObject({ uid: "7", sort: "updated", order: "desc", limit: "50", q: "" });
    expect(f.calls()[1]).toBe("/user/settings/organization");

    expect(f.panel.hidden).toBe(false);
    expect(f.input.attributes.get("aria-expanded")).toBe("true");
    expect(f.names(f.repos.list)).toEqual(["alex/notes", "acme/webapp", "alex/dotfiles", "acme/api", "globex/site"]);
    expect(f.rows(f.repos.list).map(row => row.children[0].dataset.icon)).toEqual([
      "private",
      "repo",
      "fork",
      "repo",
      "repo",
    ]);
    expect(f.rows(f.repos.list)[0].href).toBe("/alex/notes");
    expect(f.rows(f.repos.list)[0].tabIndex).toBe(-1);
    expect(f.names(f.orgs.list)).toEqual(["acme", "globex"]);
    expect(f.rows(f.orgs.list)[0].children[0].src).toBe("/avatars/acme");
    expect(f.rows(f.orgs.list)[1].children[0].dataset.icon).toBe("repo");
    expect(f.repos.group.hidden).toBe(false);
    expect(f.orgs.group.hidden).toBe(false);
    expect(f.searchGroup.hidden).toBe(true);
    expect(f.message.hidden).toBe(true);
    expect(f.orgs.group.classList.contains("theme-jump-divided")).toBe(true);
    expect(f.repos.group.classList.contains("theme-jump-divided")).toBe(false);
    expect(f.active()).toHaveLength(0);
  });

  it("matches the owner as well as the name when typing, without duplicates, and highlights the first row", async () => {
    const f = fixture(recent, orgs);
    await f.focus();
    await f.type("acme");

    expect(f.calls()).toHaveLength(3);
    const params = new URL(f.calls()[2], "http://forgejo").searchParams;
    expect(Object.fromEntries(params)).toMatchObject({ q: "acme", limit: "5", uid: "7" });
    expect(f.names(f.repos.list)).toEqual(["alex/acme-tools", "acme/webapp", "acme/api", "acme/docs"]);
    expect(f.names(f.orgs.list)).toEqual(["acme"]);
    expect(f.searchGroup.hidden).toBe(false);
    expect(f.query.textContent).toBe("acme");
    const first = f.rows(f.repos.list)[0];
    expect(f.active()).toEqual([first]);
    expect(f.input.attributes.get("aria-activedescendant")).toBe(first.id);
  });

  it("wraps around with the arrow keys", async () => {
    const f = fixture(recent, orgs);
    await f.focus();
    await f.type("acme");
    const repoRows = f.rows(f.repos.list);

    expect(f.key("ArrowDown").preventDefault).toHaveBeenCalled();
    expect(f.active()).toEqual([repoRows[1]]);
    f.key("ArrowUp");
    f.key("ArrowUp");
    expect(f.active()).toEqual([f.button]);
    expect(f.input.attributes.get("aria-activedescendant")).toBe("theme-jump-search");
    f.key("ArrowDown");
    expect(f.active()).toEqual([repoRows[0]]);
  });

  it("opens the highlighted repository on Enter and leaves the search row to the form", async () => {
    const f = fixture(recent, orgs);
    await f.focus();
    await f.type("acme");

    f.key("ArrowUp");
    const search = f.key("Enter");
    expect(search.preventDefault).not.toHaveBeenCalled();
    expect(f.location.href).toBe("");

    f.key("ArrowDown");
    const repo = f.key("Enter");
    expect(repo.preventDefault).toHaveBeenCalled();
    expect(f.location.href).toBe("/alex/acme-tools");
  });

  it("closes on Escape and clears the expanded state and the highlight", async () => {
    const f = fixture(recent, orgs);
    await f.focus();
    await f.type("acme");

    const event = f.key("Escape");
    expect(event.preventDefault).toHaveBeenCalled();
    expect(f.panel.hidden).toBe(true);
    expect(f.input.attributes.get("aria-expanded")).toBe("false");
    expect(f.input.attributes.has("aria-activedescendant")).toBe(false);
    expect(f.active()).toHaveLength(0);
  });

  it("keeps the field focused when a row is pressed", () => {
    const f = fixture(recent, orgs);
    const event = { preventDefault: vi.fn() };
    f.panelListeners.get("mousedown")?.(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("leaves the organizations out when their list fails and tries again on the next opening", async () => {
    const f = fixture(recent, orgs, [false, true]);
    await f.focus();
    expect(f.orgs.group.hidden).toBe(true);
    expect(f.names(f.repos.list)).toHaveLength(5);
    expect(f.message.hidden).toBe(true);

    f.listeners.get("blur")?.({});
    expect(f.panel.hidden).toBe(true);
    await f.focus();
    expect(f.calls().filter(url => url === "/user/settings/organization")).toHaveLength(2);
    expect(f.orgs.group.hidden).toBe(false);
    expect(f.names(f.orgs.list)).toEqual(["acme", "globex"]);

    f.listeners.get("blur")?.({});
    await f.focus();
    expect(f.calls().filter(url => url === "/user/settings/organization")).toHaveLength(2);
  });

  it("never links outside the site", async () => {
    const f = fixture(
      [
        { id: 1, full_name: "acme/evil", link: "https://evil.example/x" },
        { id: 2, full_name: "acme/script", link: "javascript:alert(1)" },
        { id: 3, full_name: "acme/relative", link: "//evil.example/x" },
        { id: 4, full_name: "acme/backslash", link: "/\\evil.example/x" },
        { id: 5, full_name: "acme/webapp", link: "/acme/webapp" },
      ],
      [{ name: "evil", link: "https://evil.example/org" }]
    );
    await f.focus();
    expect(f.rows(f.repos.list).map(row => row.href)).toEqual(["#", "#", "#", "#", "/acme/webapp"]);
    expect(f.rows(f.orgs.list).map(row => row.href)).toEqual(["#"]);
  });

  it("turns off the browser's suggestions and keeps list items out of the listbox's options", async () => {
    const f = fixture(recent, orgs);
    expect(f.input.attributes.get("autocomplete")).toBe("off");
    await f.focus();
    expect(f.repos.list.children.every(item => item.getAttribute("role") === "presentation")).toBe(true);
  });

  it("ignores an answer for text the user has typed past", async () => {
    const f = fixture(recent, orgs);
    await f.focus();
    // "acme" is being searched when "acmez" is typed: its answer must not highlight a row Enter would open.
    f.input.value = "acme";
    f.listeners.get("input")?.({});
    f.input.value = "acmez";
    f.listeners.get("input")?.({});
    await f.settle();
    expect(f.active()).toEqual([]);
    expect(f.input.attributes.has("aria-activedescendant")).toBe(false);
    const enter = f.key("Enter");
    expect(enter.preventDefault).not.toHaveBeenCalled();
    expect(f.location.href).toBe("");
  });

  it("leaves keys to an input method while it composes", async () => {
    const f = fixture(recent, orgs);
    await f.focus();
    await f.type("acme");
    for (const event of [
      { key: "Enter", isComposing: true, preventDefault: vi.fn() },
      { key: "ArrowDown", keyCode: 229, preventDefault: vi.fn() },
    ]) {
      f.listeners.get("keydown")?.(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    }
    expect(f.location.href).toBe("");
  });

  it("stays closed when Escape on a closed list empties the field", async () => {
    const f = fixture(recent, orgs);
    await f.focus();
    await f.type("acme");
    f.key("Escape");
    expect(f.panel.hidden).toBe(true);
    const before = f.calls().length;
    // The second Escape is the browser's: it empties the search field and fires input.
    const second = f.key("Escape");
    expect(second.preventDefault).not.toHaveBeenCalled();
    f.input.value = "";
    f.listeners.get("input")?.({});
    await f.settle();
    expect(f.panel.hidden).toBe(true);
    expect(f.input.attributes.get("aria-expanded")).toBe("false");
    expect(f.calls()).toHaveLength(before);
    // Typing again opens it.
    await f.type("glo");
    expect(f.panel.hidden).toBe(false);
  });
});

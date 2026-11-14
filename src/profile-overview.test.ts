import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(new URL("../public/assets/js/profile-overview.js", import.meta.url), "utf8");

type Fake = {
  tag: string;
  className: string;
  textContent: string;
  childNodes: unknown[];
  append: (...nodes: unknown[]) => void;
  querySelector: (selector: string) => unknown;
  querySelectorAll: (selector: string) => unknown[];
};

function node(
  tag = "div",
  parts: { text?: string; one?: Record<string, unknown>; all?: Record<string, unknown[]> } = {}
) {
  const fake: Fake = {
    tag,
    className: "",
    textContent: parts.text ?? "",
    childNodes: parts.text ? [parts.text] : [],
    append: (...nodes) => fake.childNodes.push(...nodes),
    querySelector: selector => parts.one?.[selector] ?? null,
    querySelectorAll: selector => parts.all?.[selector] ?? [],
  };
  return fake;
}

function repository(name: string, stars: string, forks: string) {
  const trailing = node("div", {
    one: { 'a[href$="/stars"]': node("a", { text: stars }), 'a[href$="/forks"]': node("a", { text: forks }) },
  });
  return node("div", {
    one: {
      ".flex-item-title > a.name:last-of-type": node("a", { text: name }),
      ".flex-item-body": node("div", { text: `${name} description` }),
      ".flex-item-trailing": trailing,
    },
    all: { ".flex-item-title .ui.label": [node("span", { text: "Public" })] },
  });
}

async function run(options: { repositories?: Fake[]; ok?: boolean; url?: string } = {}) {
  const list = { cards: [] as Fake[], replaceChildren: (...cards: Fake[]) => (list.cards = cards) };
  const icon = { content: { cloneNode: () => node("svg") } };
  const section = {
    hidden: true,
    dataset: { themeProfilePopular: options.url ?? "/alex?tab=repositories&sort=moststars&private=false" },
    classList: { add: vi.fn() },
    querySelector: (selector: string) =>
      ({ "[data-theme-profile-popular-list]": list, "[data-theme-profile-popular-icon]": icon })[selector],
  };
  const page = { querySelectorAll: () => options.repositories ?? [] };
  const fetch = vi.fn(async () => ({ ok: options.ok ?? true, text: async () => "<html></html>" }));
  runInNewContext(script, {
    document: { querySelector: () => section, createElement: (tag: string) => node(tag) },
    location: { href: "http://forgejo.test/alex", origin: "http://forgejo.test" },
    URL,
    fetch,
    DOMParser: class {
      parseFromString() {
        return page;
      }
    },
  });
  await new Promise(resolve => setTimeout(resolve, 0));
  return { section, list, fetch };
}

describe("profile overview popular repositories", () => {
  it("shows the first six repositories of the stars-sorted list as cards", async () => {
    const repositories = Array.from({ length: 8 }, (_, index) => repository(`repo-${index}`, "3", "0"));
    const { section, list, fetch } = await run({ repositories });
    expect(fetch).toHaveBeenCalledOnce();
    expect(String((fetch.mock.calls[0] as unknown[])[0])).toBe(
      "http://forgejo.test/alex?tab=repositories&sort=moststars&private=false"
    );
    expect(section.hidden).toBe(false);
    expect(section.classList.add).toHaveBeenCalledWith("theme-fade-in");
    expect(list.cards).toHaveLength(6);
    const box = list.cards[0].childNodes[0] as Fake;
    const [heading, description, meta] = box.childNodes as Fake[];
    expect(heading.className).toBe("profile-popular-heading");
    expect((heading.childNodes[1] as Fake).className).toBe("profile-popular-name");
    expect((heading.childNodes[2] as Fake).textContent).toBe("Public");
    expect((heading.childNodes[2] as Fake).className).toBe("ui label theme-label theme-label-muted");
    expect(description.childNodes).toEqual(["repo-0 description"]);
    // Stars are listed; forks are left out at zero, as on GitHub's cards.
    expect(meta.childNodes.map(child => (child as Fake).textContent)).toEqual(["3"]);
  });

  it("stays hidden when the person has no public repositories or the list fails to load", async () => {
    expect((await run({ repositories: [] })).section.hidden).toBe(true);
    expect((await run({ repositories: [repository("repo", "1", "1")], ok: false })).section.hidden).toBe(true);
  });

  it("only loads the list from the page's own origin", async () => {
    const { fetch, section } = await run({ url: "https://elsewhere.test/alex?tab=repositories" });
    expect(fetch).not.toHaveBeenCalled();
    expect(section.hidden).toBe(true);
  });
});

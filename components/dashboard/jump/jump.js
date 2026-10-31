(() => {
  const panel = document.querySelector("[data-theme-jump]");
  const form = panel?.closest("form");
  const input = form?.querySelector('input[type="search"]');
  if (!panel || !input) return;

  const listbox = panel.querySelector('[role="listbox"]');
  const groups = name => panel.querySelector(`[data-theme-jump-group="${name}"]`);
  const lists = {
    repos: panel.querySelector('[data-theme-jump-list="repos"]'),
    orgs: panel.querySelector('[data-theme-jump-list="orgs"]'),
  };
  const message = panel.querySelector("[data-theme-jump-message]");
  const query = panel.querySelector("[data-theme-jump-query]");
  const icons = panel.querySelector("[data-theme-jump-icons]")?.content;
  const text = panel.querySelector("[data-theme-jump-text]")?.dataset ?? {};
  const state = {
    open: false,
    active: -1,
    revision: 0,
    request: undefined,
    recent: undefined,
    orgs: undefined,
    timer: undefined,
    next: 0,
    cleared: false,
  };

  // The browser's own suggestions for the field would cover the list.
  input.setAttribute("autocomplete", "off");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-controls", listbox.id);
  input.setAttribute("aria-expanded", "false");

  const iconFor = repo => {
    if (repo.private) return "private";
    if (repo.mirror) return "mirror";
    if (repo.fork) return "fork";
    if (repo.template) return "template";
    return "repo";
  };
  const icon = name => {
    const source = icons?.querySelector(`[data-icon="${name}"] > svg`);
    return source ? source.cloneNode(true) : document.createElement("span");
  };
  // Only same-origin paths, as the repository picker and the owner switcher do; "//host" and "/\\host" leave the site.
  const local = link => (/^\/(?![/\\])/.test(String(link || "")) ? String(link) : "#");

  const row = (href, leading, label) => {
    const item = document.createElement("li");
    // The listbox owns options only, so the list items drop their own role.
    item.setAttribute("role", "presentation");
    const link = document.createElement("a");
    link.className = "theme-jump-item";
    link.href = local(href);
    link.id = `theme-jump-option-${state.next++}`;
    link.setAttribute("role", "option");
    link.tabIndex = -1;
    const name = document.createElement("span");
    name.className = "theme-jump-name";
    name.textContent = label;
    name.title = label;
    link.append(leading, name);
    item.append(link);
    return item;
  };
  const avatar = src => {
    if (!src) return icon("repo");
    const image = document.createElement("img");
    image.className = "ui avatar";
    image.width = 16;
    image.height = 16;
    image.alt = "";
    image.src = src;
    return image;
  };

  const limit = Number(panel.dataset.limit) || 5;
  const search = async (q, size, signal) => {
    const params = new URLSearchParams({
      sort: "updated",
      order: "desc",
      uid: panel.dataset.uid ?? "",
      q,
      page: "1",
      limit: String(size),
    });
    const response = await fetch(`${panel.dataset.repos}?${params}`, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Repository search failed");
    const body = await response.json();
    return (body?.data ?? []).map(result => result.repository).filter(Boolean);
  };

  // Forgejo's search matches repository names only; GitHub's jump-to also matches the owner, so the most recently
  // updated repositories, loaded once per opening, are matched on "owner/name" as well.
  const recentRepos = () => {
    state.recent ??= search("", 50).catch(error => {
      state.recent = undefined;
      throw error;
    });
    return state.recent;
  };
  const loadRepos = async (q, signal) => {
    if (!q) return (await recentRepos()).slice(0, limit);
    const [named, recent] = await Promise.all([search(q, limit, signal), recentRepos()]);
    const needle = q.toLowerCase();
    const seen = new Set(named.map(repo => repo.id));
    const owned = recent.filter(
      repo =>
        !seen.has(repo.id) &&
        String(repo.full_name || "")
          .toLowerCase()
          .includes(needle)
    );
    return [...named, ...owned].slice(0, limit);
  };

  // The personal settings' organization list marks each entry with data-theme-organization. Loaded once; a failure
  // leaves the group out and the next opening tries again.
  const loadOrgs = () => {
    state.orgs ??= (async () => {
      const response = await fetch(panel.dataset.orgs, { headers: { Accept: "text/html" } });
      if (!response.ok) throw new Error("Organization list failed");
      const page = new DOMParser().parseFromString(await response.text(), "text/html");
      return [...page.querySelectorAll("[data-theme-organization]")].map(entry => ({
        name: entry.dataset.themeOrganization ?? "",
        link: entry.dataset.themeOrganizationLink ?? "",
        avatar: entry.querySelector("img.ui.avatar")?.getAttribute("src") ?? "",
      }));
    })().catch(() => {
      state.orgs = undefined;
      return [];
    });
    return state.orgs;
  };

  const options = () => [...panel.querySelectorAll('[role="option"]')].filter(option => !option.closest("[hidden]"));
  const setActive = index => {
    const visible = options();
    state.active = visible.length ? Math.max(-1, Math.min(index, visible.length - 1)) : -1;
    for (const option of panel.querySelectorAll(".theme-jump-item.active")) option.classList.remove("active");
    visible[state.active]?.classList.add("active");
    const target = visible[state.active];
    if (target) {
      input.setAttribute("aria-activedescendant", target.id);
      target.scrollIntoView({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  };

  // A line goes between the blocks shown, never above the first.
  const divide = () => {
    let shown = false;
    for (const block of [message, ...listbox.children]) {
      if (block.tagName === "TEMPLATE") continue;
      block.classList.toggle("theme-jump-divided", shown && !block.hidden);
      shown ||= !block.hidden;
    }
  };

  const render = (q, repos, orgs) => {
    lists.repos.replaceChildren(
      ...repos.map(repo => row(repo.link, icon(iconFor(repo)), String(repo.full_name || "")))
    );
    const needle = q.toLowerCase();
    const matches = orgs.filter(org => org.name.toLowerCase().includes(needle));
    lists.orgs.replaceChildren(...matches.map(org => row(org.link, avatar(org.avatar), org.name)));
    groups("repos").hidden = !repos.length;
    groups("orgs").hidden = !matches.length;
    groups("search").hidden = !q;
    query.textContent = q;
    message.textContent = text.empty ?? "";
    message.hidden = Boolean(repos.length || matches.length);
    divide();
    panel.hidden = !state.open;
    // Typing highlights the first match, so Enter opens it.
    setActive(q ? 0 : -1);
  };

  const update = async () => {
    const revision = ++state.revision;
    state.request?.abort();
    state.request = new AbortController();
    const q = input.value.trim();
    try {
      const [repos, orgs] = await Promise.all([loadRepos(q, state.request.signal), loadOrgs()]);
      if (revision === state.revision) render(q, repos, orgs);
    } catch (error) {
      if (error.name === "AbortError" || revision !== state.revision) return;
      for (const name of ["repos", "orgs"]) groups(name).hidden = true;
      groups("search").hidden = !q;
      query.textContent = q;
      message.textContent = text.error ?? "";
      message.hidden = false;
      divide();
      panel.hidden = !state.open;
      setActive(q ? 0 : -1);
    }
  };

  const open = () => {
    if (state.open) return;
    state.open = true;
    state.recent = undefined;
    input.setAttribute("aria-expanded", "true");
    void update();
  };
  const close = () => {
    state.open = false;
    clearTimeout(state.timer);
    panel.hidden = true;
    input.setAttribute("aria-expanded", "false");
    setActive(-1);
  };

  input.addEventListener("focus", open);
  input.addEventListener("blur", close);
  input.addEventListener("input", () => {
    // Escape on a closed list empties a search field; that is not a reason to open it again.
    if (state.cleared) {
      state.cleared = false;
      if (!state.open) return;
    }
    if (!state.open) return open();
    // The rows shown, and any answer still on its way, are for the previous text; Enter searches until the new ones load.
    state.revision++;
    state.request?.abort();
    setActive(-1);
    clearTimeout(state.timer);
    state.timer = setTimeout(() => void update(), 200);
  });
  input.addEventListener("keydown", event => {
    // Keys that pick a character in an input method belong to it.
    if (event.isComposing || event.keyCode === 229) return;
    state.cleared = event.key === "Escape" && !state.open;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!state.open) return open();
      const count = options().length;
      if (!count) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      if (state.active < 0) setActive(step > 0 ? 0 : count - 1);
      else setActive((state.active + step + count) % count);
    } else if (event.key === "Enter" && state.open && state.active >= 0) {
      const target = options()[state.active];
      if (!target || target.tagName === "BUTTON") return;
      event.preventDefault();
      location.href = target.href;
    } else if (event.key === "Escape" && state.open) {
      event.preventDefault();
      close();
    }
  });
  // Keep the focus in the field while a row is clicked.
  panel.addEventListener("mousedown", event => event.preventDefault());
})();

(() => {
  const projectBoard = document.getElementById("project-board");
  const board = projectBoard?.querySelector(".board");
  if (!board) return;

  // Columns fill the viewport below the board's own top, like GitHub's board.
  const fitBoard = () =>
    board.style.setProperty("--project-board-top", `${board.getBoundingClientRect().top + window.scrollY}px`);
  fitBoard();
  window.addEventListener("resize", fitBoard);

  // New issue for organization and user projects: list the owner's repositories that take issues. Each opens
  // Forgejo's new issue form with this project set, and Forgejo returns to the board once the issue is created.
  const newIssue = document.querySelector(".github-project-new-issue");
  if (newIssue) {
    const appSubUrl = window.config?.appSubUrl ?? "";
    const menu = newIssue.querySelector(".theme-menu-popover");
    const status = menu.querySelector(".github-project-repo-status");
    const search = menu.querySelector("#project-repo-filter");
    const icon = newIssue.querySelector(".github-project-repo-icon").content.firstElementChild;
    let request = 0;
    const listRepositories = async () => {
      const current = ++request;
      const query = new URLSearchParams({
        uid: newIssue.dataset.ownerId,
        q: search.value.trim(),
        archived: "false",
        sort: "alpha",
        order: "asc",
        limit: "50",
      });
      try {
        const response = await fetch(`${appSubUrl}/api/v1/repos/search?${query}`, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(response.statusText);
        const repositories = (await response.json()).data.filter(
          repository => repository.has_issues && !repository.archived
        );
        if (current !== request) return;
        for (const link of menu.querySelectorAll(":scope > a")) link.remove();
        for (const repository of repositories) {
          const link = document.createElement("a");
          link.href = `${appSubUrl}/${repository.full_name}/issues/new/choose?project=${newIssue.dataset.projectId}`;
          link.setAttribute("role", "menuitem");
          link.dataset.projectPanelLink = "";
          link.append(icon.cloneNode(true), repository.full_name);
          menu.append(link);
        }
        status.textContent = status.dataset.empty;
        status.hidden = repositories.length > 0;
      } catch {
        if (current !== request) return;
        status.textContent = status.dataset.error;
        status.hidden = false;
      }
    };
    let loaded = false;
    newIssue.addEventListener("toggle", () => {
      if (!newIssue.open) return;
      search.focus();
      if (!loaded) {
        loaded = true;
        listRepositories();
      }
    });
    let searchTimer;
    search.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(listRepositories, 200);
    });
  }

  // Forgejo paints an edited column's colour as its background. Show it as the column's status dot instead.
  const adoptColumnColor = column => {
    const color = column.style.getPropertyValue("background");
    if (!color) return;
    column.style.removeProperty("background");
    column.style.removeProperty("color");
    column.style.setProperty("--project-column-color", color);
  };
  const columnObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) adoptColumnColor(mutation.target);
  });
  for (const column of board.querySelectorAll(".project-column")) {
    columnObserver.observe(column, { attributes: true, attributeFilter: ["style"] });
  }

  // Filter by keyword: every word must appear in the card, matching title, number, repository, labels and milestone.
  const filter = document.getElementById("project-board-filter");
  const applyFilter = () => {
    const words = filter.value.toLowerCase().split(/\s+/).filter(Boolean);
    for (const column of board.querySelectorAll(".project-column")) {
      const cards = column.querySelectorAll(".issue-card");
      let shown = 0;
      for (const card of cards) {
        const text = card.textContent.toLowerCase();
        const hidden = !words.every(word => text.includes(word));
        if (card.hasAttribute("data-project-filtered") !== hidden)
          card.toggleAttribute("data-project-filtered", hidden);
        if (!hidden) shown++;
      }
      const count = column.querySelector(".project-column-issue-count");
      const label = words.length ? `${shown} / ${cards.length}` : String(cards.length);
      if (count && count.textContent !== label) count.textContent = label;
    }
  };
  if (filter) {
    filter.addEventListener("input", applyFilter);
    // Forgejo rewrites the counts when a card moves between columns.
    const cardsObserver = new MutationObserver(() => filter.value && applyFilter());
    for (const cards of board.querySelectorAll(".project-column > .cards"))
      cardsObserver.observe(cards, { childList: true });
  }

  // Card menu: its panel is pinned to the viewport so the scrolling column does not clip it, and the card's own
  // column is not offered as a target.
  const placeCardMenu = menu => {
    const summary = menu.querySelector("summary").getBoundingClientRect();
    const panel = menu.querySelector(".theme-dropdown-panel");
    const width = panel.offsetWidth;
    const right = document.documentElement.clientWidth - 16;
    panel.style.translate = "none";
    panel.style.left = `${Math.max(16, Math.min(summary.left, right - width))}px`;
    panel.style.top = `${summary.bottom + 4}px`;
    panel.style.right = "auto";
  };
  board.addEventListener(
    "toggle",
    event => {
      const menu = event.target;
      if (!menu.matches(".github-project-card-meta > .theme-dropdown[open]")) return;
      const column = menu.closest(".project-column")?.dataset.id;
      for (const button of menu.querySelectorAll("[data-project-card-move]"))
        button.disabled = button.dataset.projectCardMove === column;
      placeCardMenu(menu);
    },
    true
  );
  const closeCardMenus = () => {
    for (const menu of board.querySelectorAll(".github-project-card-meta > .theme-dropdown[open]")) menu.open = false;
  };
  board.addEventListener("scroll", event => event.target.closest?.(".theme-dropdown-panel") || closeCardMenus(), true);
  window.addEventListener("resize", closeCardMenus);

  // Move to top, bottom or another column, then save the target column's order the way Forgejo's drag and drop does.
  board.addEventListener("click", async event => {
    const button = event.target.closest("[data-project-card-move]");
    if (!button || button.disabled) return;
    const card = button.closest(".issue-card");
    const target = button.dataset.projectCardMove;
    const column =
      target === "top" || target === "bottom"
        ? card.closest(".project-column")
        : board.querySelector(`.project-column[data-id="${CSS.escape(target)}"]`);
    const source = card.closest(".project-column");
    const cards = column?.querySelector(":scope > .cards");
    if (!cards) return;
    if (target === "top") cards.prepend(card);
    else cards.append(card);
    for (const changed of new Set([source, column])) {
      const count = changed.querySelector(".project-column-issue-count");
      if (count) count.textContent = String(changed.querySelectorAll(".issue-card[data-issue]").length);
    }
    const issues = [...cards.querySelectorAll(":scope > .issue-card[data-issue]")].map((item, sorting) => ({
      issueID: Number(item.dataset.issue),
      sorting,
    }));
    try {
      const response = await fetch(`${column.dataset.url}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Csrf-Token": window.config?.csrfToken ?? "" },
        body: JSON.stringify({ issues }),
      });
      if (!response.ok) throw new Error(String(response.status));
    } catch {
      window.location.reload();
    }
  });

  // Side panel: a card opens its issue next to the board, as on GitHub. The issue page loads in a frame and drops
  // the site chrome there (see base/head_style).
  const panel = document.querySelector(".github-project-panel");
  if (!panel) return;
  const frame = panel.querySelector("iframe");
  const openLink = panel.querySelector(".github-project-panel-open");
  const closeButton = panel.querySelector("button[data-project-panel-close]");
  let loads = 0;
  let returnFocus = null;

  let closing = false;
  function closePanel() {
    if (panel.hidden) return;
    // Unload the page first, so Forgejo can ask about an unsaved issue or comment. Cancelling keeps the panel open.
    closing = true;
    frame.src = "about:blank";
  }
  function finishClosing() {
    // Loads after the first one come from changes made in the panel, which the board does not show yet.
    const changed = loads > 1;
    closing = false;
    panel.hidden = true;
    loads = 0;
    document.documentElement.style.removeProperty("overflow");
    if (changed) window.location.reload();
    else returnFocus?.focus();
  }
  // GitHub opens the panel below the global header, so the repository or owner tabs stay in view.
  const fitPanel = () => {
    const header = document.querySelectorAll("#navbar, .repository-tab-nav, .secondary-nav, .profile-global-header");
    const top = Math.max(...[...header].map(element => element.getBoundingClientRect().bottom));
    panel.style.setProperty("--project-panel-top", `${Math.max(0, top)}px`);
  };
  window.addEventListener("resize", () => panel.hidden || fitPanel());
  function openPanel(url, from) {
    fitPanel();
    closing = false;
    returnFocus = from;
    loads = 0;
    openLink.href = url;
    // The frame still holds the blank page it was closed on, which paints white over the panel until the issue
    // replaces it. Show the panel's own background and a loader until then.
    panel.toggleAttribute("data-loading", true);
    frame.src = url;
    panel.hidden = false;
    panel.classList.add("is-opening");
    document.documentElement.style.overflow = "hidden";
    closeButton.focus();
  }
  panel.addEventListener("animationend", () => panel.classList.remove("is-opening"));
  panel.addEventListener("click", event => {
    if (event.target.closest("[data-project-panel-close]")) closePanel();
  });
  const closeOnEscape = event => {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    const target = event.target;
    if (target.closest?.("input, textarea, select, [contenteditable], dialog[open], .tippy-box")) return;
    closePanel();
  };
  document.addEventListener("keydown", closeOnEscape);
  frame.addEventListener("load", () => {
    if (frame.getAttribute("src") === "about:blank") {
      if (closing) finishClosing();
      return;
    }
    panel.removeAttribute("data-loading");
    loads++;
    try {
      // Forgejo returns to the project once an issue is created from it: show the new card on the board.
      const trimmed = path => path.replace(/\/+$/, "");
      if (trimmed(frame.contentWindow.location.pathname) === trimmed(window.location.pathname)) {
        window.location.reload();
        return;
      }
      openLink.href = frame.contentWindow.location.href;
      frame.contentDocument.addEventListener("keydown", closeOnEscape);
    } catch {
      /* A page from another origin keeps the link it was opened with. */
    }
  });

  // New issue opens Forgejo's form in the panel too, with the project set.
  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-project-panel-link]");
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openPanel(link.href, link.closest("details")?.querySelector("summary") ?? link);
  });

  board.addEventListener("click", event => {
    const card = event.target.closest(".issue-card");
    if (!card || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.target.closest(".theme-dropdown")) return;
    // Labels, assignees, milestones and pull requests keep their own links.
    const link = event.target.closest("a");
    if (link && !link.matches(".github-project-card-title")) return;
    const title = card.querySelector(".github-project-card-title");
    if (!title) return;
    event.preventDefault();
    openPanel(title.href, title);
  });
})();

(() => {
  const page = document.querySelector(".github-issues, .github-pull-list");
  if (!page) return;
  const mobile = matchMedia("(max-width: 767.98px)");
  const isPullList = page.classList.contains("github-pull-list");
  let collapsed = mobile.matches;
  try {
    if (!mobile.matches) collapsed = localStorage.getItem("issue_sidebar_collapsed") === "true";
  } catch {
    /* Optional preference. */
  }
  function update() {
    if (!isPullList) page.classList.toggle("issue-navigation-collapsed", collapsed);
    for (const button of page.querySelectorAll("[data-issue-sidebar-toggle]"))
      button.setAttribute("aria-expanded", !collapsed);
  }
  for (const button of page.querySelectorAll("[data-issue-sidebar-toggle]"))
    button.addEventListener("click", () => {
      collapsed = !collapsed;
      update();
      if (!mobile.matches)
        try {
          localStorage.setItem("issue_sidebar_collapsed", collapsed);
        } catch {
          /* Optional preference. */
        }
    });
  mobile.addEventListener("change", () => {
    collapsed = mobile.matches;
    update();
  });
  update();
  const form = page.querySelector(".issue-list-search");
  const input = form?.querySelector('input[name="q"]');
  if (!input) return;
  input.setAttribute("aria-label", isPullList ? "Search pull requests" : "Search Issues");
  input.placeholder = isPullList ? "Search all pull requests" : "Search Issues";
  const toolbar = page.querySelector("#issue-filters");
  const filterRow = toolbar?.querySelector(".issue-list-toolbar-right");
  if (filterRow) {
    filterRow.id = "issue-filter-controls";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-icon-button issue-mobile-filter-toggle";
    toggle.setAttribute("aria-label", "Filter options");
    toggle.setAttribute("aria-controls", filterRow.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "…";
    toolbar.append(toggle);
    toggle.addEventListener("click", () => {
      const open = toolbar.classList.toggle("issue-mobile-filters-open");
      toggle.setAttribute("aria-expanded", open);
    });
    const typeFilter = filterRow.querySelector(".list-header-type");
    if (typeFilter) {
      const all = [...typeFilter.querySelectorAll("a")].find(a => a.href.includes("type=all"));
      if (all) {
        const allStates = document.createElement("a");
        allStates.className = "item";
        allStates.textContent = "All states";
        allStates.href = toolbar.querySelector('[data-test-name="all-issue-count"]').href;
        typeFilter.querySelector(".menu").append(allStates);
      }
    }
  }
  const decorateRows = () => {
    for (const row of page.querySelectorAll("#issue-list > .flex-item")) {
      const labels = row.querySelector(".labels-list");
      const main = row.querySelector(".flex-item-main");
      if (!isPullList && labels?.textContent.trim() && labels.parentElement !== main) main.append(labels);
    }
  };
  decorateRows();
  const issues = page.querySelector("#issue-list");
  if (issues) new MutationObserver(decorateRows).observe(issues, { childList: true, subtree: true });
  const empty = page.querySelector("#issue-list > .tw-text-center");
  if (isPullList && empty && !input.value.trim()) {
    const state = new URL(location.href).searchParams.get("state") || "open";
    empty.querySelector("h3").textContent =
      state === "open"
        ? "There aren’t any open pull requests."
        : state === "closed"
          ? "There aren’t any closed pull requests."
          : "There aren’t any pull requests.";
    const icon = page.querySelector('[data-test-name="open-issue-count"] svg')?.cloneNode(true);
    if (icon) {
      icon.setAttribute("width", "24");
      icon.setAttribute("height", "24");
      empty.prepend(icon);
    }
  }
  const filters = page.querySelector("#issue-filters");
  if (filters && !isPullList) {
    for (const anchor of filters.querySelectorAll(".switch > a")) {
      const text = [...anchor.childNodes].find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      const match = text?.textContent.trim().match(/^([\d.,\s]+)\s+(.+)$/);
      if (!match) continue;
      text.textContent = match[2];
      const badge = document.createElement("span");
      badge.className = "issue-state-count";
      badge.textContent = match[1].trim();
      anchor.append(badge);
    }
  }
})();

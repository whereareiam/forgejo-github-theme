(() => {
  const page = document.querySelector(".github-issues");
  if (!page) return;
  const mobile = matchMedia("(max-width: 767.98px)");
  let collapsed = mobile.matches;
  try {
    if (!mobile.matches) collapsed = localStorage.getItem("issue_sidebar_collapsed") === "true";
  } catch {
    /* Optional preference. */
  }
  function update() {
    page.classList.toggle("issue-navigation-collapsed", collapsed);
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
  input.setAttribute("aria-label", "Search Issues");
  input.placeholder = "Search Issues";
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
      if (labels?.textContent.trim() && labels.parentElement !== main) main.append(labels);
    }
  };
  decorateRows();
  const issues = page.querySelector("#issue-list");
  if (issues) new MutationObserver(decorateRows).observe(issues, { childList: true, subtree: true });
  const filters = page.querySelector("#issue-filters");
  if (filters) {
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

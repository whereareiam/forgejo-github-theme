(() => {
  const mount = document.querySelector("#repo-action-view");
  const page = document.querySelector(".github-actions-run");
  if (!mount || !page) return;
  const initial = JSON.parse(mount.dataset.initialPostResponse);
  const run = initial.state.run;
  let fingerprint = "";
  let isSummary = location.hash === "#summary";
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function render() {
    const header = mount.querySelector(".action-view-header");
    const sidebar = mount.querySelector(".action-view-left");
    const right = mount.querySelector(".action-view-right");
    const body = mount.querySelector(".action-view-body");
    if (!header || !sidebar || !right || !body) return;
    page.classList.toggle("actions-summary-mode", isSummary);
    if (!header.querySelector(".actions-run-back")) {
      const back = make("a", "actions-run-back", "← " + mount.dataset.workflowName);
      back.href = mount.dataset.workflowUrl;
      header.prepend(back);
    }
    const title = header.querySelector(".action-info-summary-title-text");
    if (title && !title.querySelector(".actions-run-index"))
      title.append(make("span", "actions-run-index", " #" + mount.dataset.runIndex));
    if (!sidebar.querySelector(".actions-summary-link")) {
      const summary = make("a", "actions-summary-link", "Summary");
      summary.href = run.link + "#summary";
      const homeIcon = document.querySelector("#actions-nav-icons")?.content.querySelector('[data-icon="home"] svg');
      if (homeIcon) summary.prepend(homeIcon.cloneNode(true));
      sidebar.prepend(summary);
      const jobs = make("h3", "actions-jobs-heading", "All jobs");
      summary.after(jobs);
      const source = make("a", "actions-workflow-source", "Workflow file");
      source.href = mount.dataset.workflowSourceUrl;
      const fileIcon = document.querySelector("#actions-nav-icons")?.content.querySelector('[data-icon="file"] svg');
      if (fileIcon) source.prepend(fileIcon.cloneNode(true));
      sidebar.append(make("h3", "actions-details-heading", "Run details"), source);
    }
    sidebar.querySelector(".actions-summary-link").setAttribute("aria-current", isSummary ? "page" : "false");
    const tools = right.querySelector(".job-info-header-right");
    if (tools && !tools.querySelector(".actions-log-search")) {
      const search = make("div", "actions-log-search");
      const input = make("input", "");
      input.type = "search";
      input.placeholder = "Search loaded logs";
      input.setAttribute("aria-label", "Search loaded logs");
      const result = make("span", "");
      result.setAttribute("aria-live", "polite");
      search.append(input, result);
      tools.prepend(search);
    }
    filterLogs();
    const jobs = [...sidebar.querySelectorAll(".job-brief-item")];
    const status = header.querySelector(".action-info-summary-title > span")?.getAttribute("aria-label") || run.status;
    const next = JSON.stringify([
      status,
      jobs.map(job => [job.href, job.textContent, job.querySelector("svg")?.getAttribute("class")]),
    ]);
    if (next === fingerprint && body.querySelector(".actions-run-overview")) return;
    fingerprint = next;
    const overview = make("section", "actions-run-overview");
    overview.setAttribute("aria-label", "Run summary");
    const facts = make("div", "actions-run-facts");
    const triggered = make("div", "actions-run-trigger");
    triggered.append(make("span", "actions-fact-label", "Triggered by"));
    const author = make("a", "", run.commit.pusher.displayName);
    author.href = run.commit.pusher.link;
    triggered.append(author);
    const commit = make("a", "actions-summary-commit", run.commit.shortSHA.slice(0, 7));
    commit.href = run.commit.link;
    triggered.append(commit);
    if (run.commit.branch) {
      const branch = make("a", "actions-summary-branch", run.commit.branch.name);
      branch.href = run.commit.branch.link;
      triggered.append(branch);
    }
    facts.append(triggered);
    for (const [name, value] of [
      ["Status", status],
      ["Jobs", String(jobs.length)],
    ]) {
      const fact = make("div", "actions-run-fact");
      fact.append(make("span", "actions-fact-label", name), make("strong", "", value));
      facts.append(fact);
    }
    overview.append(facts);
    const workflow = make("section", "actions-workflow-card");
    const heading = make("a", "actions-workflow-title", mount.dataset.workflowName);
    heading.href = mount.dataset.workflowSourceUrl;
    workflow.append(heading);
    const cards = make("div", "actions-job-cards");
    for (const job of jobs) {
      const card = make("a", "actions-job-card");
      card.href = job.href;
      const icon = job.querySelector(".job-brief-item-left > span");
      if (icon) card.append(icon.cloneNode(true));
      card.append(make("strong", "", job.querySelector(".job-brief-name")?.textContent.trim()));
      card.append(
        make("span", "actions-job-duration", job.querySelector(".step-summary-duration")?.textContent.trim())
      );
      cards.append(card);
    }
    workflow.append(cards);
    overview.append(workflow);
    body.querySelector(".actions-run-overview")?.remove();
    body.append(overview);
  }
  new MutationObserver(() => {
    filterLogs();
    render();
  }).observe(page.parentElement, { childList: true, subtree: true });
  function filterLogs() {
    const panel = document.querySelector(".action-view-right");
    const input = panel?.querySelector(".actions-log-search input");
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    let matches = 0;
    for (const line of panel.querySelectorAll(".job-log-line")) {
      line.hidden = !!query && !line.textContent.toLowerCase().includes(query);
      if (!line.hidden) matches++;
    }
    const result = input.nextElementSibling;
    const text = query ? `${matches} ${matches === 1 ? "match" : "matches"}` : "";
    if (result.textContent !== text) result.textContent = text;
  }
  document.addEventListener("input", event => {
    if (event.target.matches(".actions-log-search input")) filterLogs();
  });
  mount.addEventListener("click", event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest("a");
    if (link?.matches(".actions-summary-link")) {
      event.preventDefault();
      isSummary = true;
      if (location.hash !== "#summary") history.pushState({}, "", run.link + "#summary");
      render();
    } else if (link?.matches(".job-brief-item") && !event.target.closest(".link-action")) {
      isSummary = false;
      render();
    }
  });
  window.addEventListener("hashchange", () => {
    isSummary = location.hash === "#summary";
    render();
  });
  window.addEventListener("popstate", () => {
    isSummary = location.hash === "#summary";
    render();
  });
  render();
})();

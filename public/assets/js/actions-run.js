(() => {
  const mount = document.querySelector("#repo-action-view");
  const page = document.querySelector(".github-actions-run");
  if (!mount || !page) return;
  const initial = JSON.parse(mount.dataset.initialPostResponse);
  const run = initial.state.run;
  let fingerprint = "";
  let expandedJob = "";
  let isSummary = location.hash === "#summary";
  const artifacts = JSON.parse(mount.dataset.initialArtifactsResponse || "{}").artifacts ?? [];
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  // The graph's stages come from the workflow file this run used; until it loads, or if it cannot be read, the jobs
  // have no links and share one card, which is how GitHub shows a workflow without `needs`.
  let workflowJobs = new Map();
  fetch(mount.dataset.workflowSourceUrl.replace(/\/src\/(commit|branch|tag)\//, "/raw/$1/"))
    .then(response => (response.ok ? response.text() : ""))
    .then(text => {
      workflowJobs = window.themeActionsGraph?.parseNeeds(text) ?? new Map();
      fingerprint = "";
      render();
    })
    .catch(() => {});
  const svgElement = name => document.createElementNS("http://www.w3.org/2000/svg", name);
  const durationOf = job => job.querySelector(".step-summary-duration")?.textContent.trim() ?? "";
  // A live run's durations tick on every poll, so the graph keeps its duration labels by job link and only their text
  // changes; the graph is rebuilt when a job or the run changes state.
  let durations = new Map();
  let graphObserver;
  function jobGraph(jobs) {
    const scroller = make("div", "actions-job-graph");
    const canvas = make("div", "actions-job-canvas");
    const links = svgElement("svg");
    links.classList.add("actions-job-links");
    links.setAttribute("aria-hidden", "true");
    canvas.append(links);
    scroller.append(canvas);
    const runJobs = jobs.map(job => ({ name: job.querySelector(".job-brief-name")?.textContent.trim() ?? "", job }));
    const { stages, edges } = window.themeActionsGraph?.layout(runJobs, workflowJobs) ?? {
      stages: [[runJobs]],
      edges: [],
    };
    const cardOf = new Map();
    durations = new Map();
    for (const stage of stages) {
      const column = make("div", "actions-job-stage");
      for (const group of stage) {
        const card = make("div", "actions-job-node");
        for (const node of group) {
          const row = make("a", "actions-job-card");
          row.href = node.job.href;
          const icon = node.job.querySelector(".job-brief-item-left > span");
          if (icon) row.append(icon.cloneNode(true));
          row.append(make("strong", "", node.name));
          const duration = make("span", "actions-job-duration", durationOf(node.job));
          durations.set(node.job.href, duration);
          row.append(duration);
          card.append(row);
          cardOf.set(node, card);
        }
        column.append(card);
      }
      canvas.append(column);
    }
    const port = (card, side) =>
      card.querySelector(`.actions-job-port.is-${side}`) ??
      card.appendChild(make("span", `actions-job-port is-${side}`));
    const paths = edges.map(([from, to]) => {
      const link = { from: cardOf.get(from), to: cardOf.get(to), path: svgElement("path") };
      link.out = port(link.from, "output");
      link.in = port(link.to, "input");
      links.append(link.path);
      return link;
    });
    const draw = () => {
      const box = canvas.getBoundingClientRect();
      if (!box.width) return;
      for (const { from, to, path } of paths) {
        const a = from.getBoundingClientRect();
        const b = to.getBoundingClientRect();
        path.setAttribute(
          "d",
          window.themeActionsGraph.linkPath(
            Math.round(a.right - box.left),
            Math.round(a.top + a.height / 2 - box.top),
            Math.round(b.left - box.left),
            Math.round(b.top + b.height / 2 - box.top)
          )
        );
      }
    };
    graphObserver?.disconnect();
    graphObserver = new ResizeObserver(draw);
    graphObserver.observe(canvas);
    // GitHub highlights a linked job's own links and dims the jobs it is not linked to.
    const highlight = card => {
      const active = card ? paths.filter(link => link.from === card || link.to === card) : [];
      const related = new Set(active.flatMap(link => [link.from, link.to]));
      canvas.classList.toggle("is-focused", active.length > 0);
      for (const node of canvas.querySelectorAll(".actions-job-node"))
        node.classList.toggle("is-related", related.has(node));
      for (const link of paths) {
        const on = active.includes(link);
        link.path.classList.toggle("is-active", on);
        if (on) links.append(link.path);
      }
      for (const item of canvas.querySelectorAll(".actions-job-port")) item.classList.remove("is-active");
      for (const link of active) {
        link.out.classList.add("is-active");
        link.in.classList.add("is-active");
      }
    };
    canvas.addEventListener("pointerover", event => highlight(event.target.closest(".actions-job-node")));
    canvas.addEventListener("pointerleave", () => highlight(null));
    canvas.addEventListener("focusin", event => highlight(event.target.closest(".actions-job-node")));
    canvas.addEventListener("focusout", () => highlight(null));
    return scroller;
  }
  function render() {
    const header = mount.querySelector(".action-view-header");
    const sidebar = mount.querySelector(".action-view-left");
    const right = mount.querySelector(".action-view-right");
    const body = mount.querySelector(".action-view-body");
    if (!header || !sidebar || !right || !body) return;
    page.classList.toggle("actions-summary-mode", isSummary);
    if (!header.querySelector(".actions-run-back")) {
      const back = make("a", "actions-run-back");
      back.href = mount.dataset.workflowUrl;
      const arrow = document.querySelector("#actions-nav-icons")?.content.querySelector('[data-icon="back"] svg');
      if (arrow) back.append(arrow.cloneNode(true));
      back.append(make("span", "", mount.dataset.workflowName));
      header.prepend(back);
    }
    const title = header.querySelector(".action-info-summary-title-text");
    if (title && !title.querySelector(".actions-run-index"))
      title.append(make("span", "actions-run-index", " #" + mount.dataset.runIndex));
    if (!sidebar.querySelector(".actions-summary-link")) {
      const summary = make("a", "actions-summary-link", mount.dataset.themeSummary);
      summary.href = run.link + "#summary";
      const homeIcon = document.querySelector("#actions-nav-icons")?.content.querySelector('[data-icon="home"] svg');
      if (homeIcon) summary.prepend(homeIcon.cloneNode(true));
      sidebar.prepend(summary);
      // GitHub heads the jobs "All jobs"; Forgejo has no string for it, so a rule sets them apart.
      const jobs = make("div", "actions-jobs-heading");
      jobs.setAttribute("role", "separator");
      summary.after(jobs);
      const source = make("a", "actions-workflow-source", mount.dataset.themeWorkflow);
      source.href = mount.dataset.workflowSourceUrl;
      const fileIcon = document.querySelector("#actions-nav-icons")?.content.querySelector('[data-icon="file"] svg');
      if (fileIcon) source.prepend(fileIcon.cloneNode(true));
      sidebar.append(make("h3", "actions-details-heading", mount.dataset.themeDetails), source);
    }
    sidebar.querySelector(".actions-summary-link").setAttribute("aria-current", isSummary ? "page" : "false");
    // GitHub keeps Delete in the run's "…" menu beside the re-run buttons; the menu drives Forgejo's own button.
    const actions = header.querySelector(".action-info-summary-actions");
    if (actions && !actions.querySelector(".actions-run-menu")) {
      const menu = make("details", "theme-dropdown actions-run-menu");
      menu.dataset.themeDropdown = "actions";
      const summary = make("summary", "theme-control button");
      summary.setAttribute("aria-label", mount.dataset.themeMore);
      const kebab = document.querySelector("#actions-nav-icons")?.content.querySelector('[data-icon="kebab"] svg');
      if (kebab) summary.append(kebab.cloneNode(true));
      const panel = make("div", "theme-dropdown-panel");
      // Forgejo renders Delete only once it knows the permissions, so the items are built when the menu opens.
      menu.addEventListener("toggle", () => {
        if (!menu.open) return;
        const source = make("a", "theme-dropdown-action", mount.dataset.themeWorkflow);
        source.href = mount.dataset.workflowSourceUrl;
        panel.replaceChildren(source);
        const remove = mount.querySelector("#delete-run");
        if (remove) {
          const item = make("button", "theme-dropdown-action theme-dropdown-danger", remove.textContent.trim());
          item.type = "button";
          item.addEventListener("click", () => remove.click());
          panel.append(item);
        }
      });
      menu.append(summary, panel);
      actions.append(menu);
    }
    const tools = right.querySelector(".job-info-header-right");
    if (tools && !tools.querySelector(".actions-log-search")) {
      const search = make("div", "actions-log-search");
      const field = make("div", "theme-search-field");
      const input = make("input", "");
      input.type = "search";
      input.placeholder = mount.dataset.themeSearch;
      input.setAttribute("aria-label", mount.dataset.themeSearch);
      const result = make("span", "");
      result.setAttribute("aria-live", "polite");
      field.append(input);
      search.append(field, result);
      tools.prepend(search);
    }
    filterLogs();
    // GitHub opens a failed job on its failing step.
    const failedStep = right.querySelector(".job-step-summary.step-expandable:has(.octicon-x-circle-fill)");
    if (!isSummary && failedStep && expandedJob !== location.pathname) {
      expandedJob = location.pathname;
      if (!right.querySelector(".job-step-summary.selected")) failedStep.click();
    }
    const jobs = [...sidebar.querySelectorAll(".job-brief-item")];
    const status = header.querySelector(".action-info-summary-title > span")?.getAttribute("aria-label") || run.status;
    const next = JSON.stringify([
      status,
      jobs.map(job => [
        job.href,
        job.querySelector(".job-brief-name")?.textContent.trim(),
        job.querySelector("svg")?.getAttribute("class"),
      ]),
    ]);
    if (next === fingerprint && body.querySelector(".actions-run-overview")) {
      for (const job of jobs) {
        const duration = durations.get(job.href);
        const text = durationOf(job);
        if (duration && duration.textContent !== text) duration.textContent = text;
      }
      return;
    }
    fingerprint = next;
    const overview = make("section", "actions-run-overview");
    overview.setAttribute("aria-label", mount.dataset.themeSummary);
    const facts = make("div", "actions-run-facts");
    const triggered = make("div", "actions-run-trigger");
    triggered.append(make("span", "actions-fact-label", mount.dataset.themeActor));
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
      [mount.dataset.themeStatus, status],
      [mount.dataset.localeArtifactsTitle, artifacts.length ? String(artifacts.length) : "–"],
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
    workflow.append(jobGraph(jobs));
    overview.append(workflow);
    body.querySelector(".actions-run-overview")?.remove();
    body.append(overview);
  }
  // Forgejo re-renders the run on every poll and appends log lines as they stream in; one render a frame is enough.
  let frame = 0;
  new MutationObserver(() => {
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      render();
    });
  }).observe(page.parentElement, { childList: true, subtree: true });
  let filtered = false;
  function filterLogs() {
    const panel = document.querySelector(".action-view-right");
    const input = panel?.querySelector(".actions-log-search input");
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    const result = input.closest(".actions-log-search").querySelector("[aria-live]");
    // Without a query no line is hidden, so long logs are not walked on every poll.
    if (!query && !filtered) {
      if (result.textContent) result.textContent = "";
      return;
    }
    filtered = Boolean(query);
    let matches = 0;
    for (const line of panel.querySelectorAll(".job-log-line")) {
      line.hidden = !!query && !line.textContent.toLowerCase().includes(query);
      if (!line.hidden) matches++;
    }
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

(() => {
  const container = document.getElementById("diff-container");
  if (!container) return;
  const search = document.getElementById("diff-code-search");
  const count = document.getElementById("diff-search-count");
  const navigation = document.querySelector(".diff-search-navigation");
  const compact = document.getElementById("diff-compact-lines");
  let results = [];
  let current = -1;
  let searchTimer;

  function showDeletedDiff(box) {
    box.removeAttribute("data-deleted-diff-hidden");
    const placeholder = box.querySelector(".diff-deleted-placeholder");
    if (placeholder) placeholder.hidden = true;
  }
  container.addEventListener("click", event => {
    if (event.target.closest(".diff-load-deleted")) showDeletedDiff(event.target.closest(".diff-file-box"));
  });
  function highlight(scroll = false) {
    document.querySelector(".diff-search-current-line")?.classList.remove("diff-search-current-line");
    if (window.CSS?.highlights) {
      CSS.highlights.set("diff-search-results", new Highlight(...results.map(result => result.range)));
      CSS.highlights.set("diff-search-current", new Highlight(...(results[current] ? [results[current].range] : [])));
    }
    navigation.hidden = !search.value;
    count.textContent = results.length ? `${current + 1} of ${results.length}` : "No results";
    if (!results[current]) return;
    const result = results[current];
    if (scroll) {
      const box = result.line.closest(".diff-file-box");
      showDeletedDiff(box);
      if (box.dataset.folded === "true") box.querySelector(".fold-file").click();
      result.line.scrollIntoView({ block: "center" });
    }
    result.line.classList.add("diff-search-current-line");
  }
  function find() {
    const query = search.value.toLowerCase();
    results = [];
    current = -1;
    if (query)
      for (const line of container.querySelectorAll(".lines-code .code-inner")) {
        if (line.closest("[data-tree-filtered]")) continue;
        const text = line.textContent.toLowerCase();
        const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
        const nodes = [];
        let node,
          offset = 0;
        while ((node = walker.nextNode())) {
          nodes.push({ node, start: offset, end: offset + node.length });
          offset += node.length;
        }
        for (let index = text.indexOf(query); index !== -1; index = text.indexOf(query, index + query.length)) {
          const start = nodes.find(node => node.end > index);
          const end = nodes.find(node => node.end >= index + query.length);
          if (!start || !end) continue;
          const range = document.createRange();
          range.setStart(start.node, index - start.start);
          range.setEnd(end.node, index + query.length - end.start);
          results.push({ range, line });
        }
      }
    if (results.length) current = 0;
    highlight();
  }
  function next(direction) {
    if (!results.length) return;
    current = (current + direction + results.length) % results.length;
    highlight(true);
  }
  search.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(find, 120);
  });
  search.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      clearTimeout(searchTimer);
      if (!results.length) find();
      next(event.shiftKey ? -1 : 1);
    }
    if (event.key === "Escape") {
      search.value = "";
      find();
    }
  });
  for (const button of document.querySelectorAll("[data-search-direction]"))
    button.addEventListener("click", () => next(Number(button.dataset.searchDirection)));
  try {
    compact.checked = localStorage.getItem("diff_compact_lines") !== "false";
  } catch {
    /* Defaults work without storage. */
  }
  container.classList.toggle("diff-comfortable", !compact.checked);
  compact.addEventListener("change", () => {
    container.classList.toggle("diff-comfortable", !compact.checked);
    try {
      localStorage.setItem("diff_compact_lines", compact.checked);
    } catch {
      /* Optional preference. */
    }
  });
  document
    .getElementById("diff-minimize-comments")
    ?.addEventListener("change", event => container.classList.toggle("diff-minimize-comments", event.target.checked));
  container.addEventListener("click", async event => {
    const button = event.target.closest(".diff-expand-file");
    if (!button) return;
    const box = button.closest(".diff-file-box");
    if (box.dataset.folded === "true") box.querySelector(".fold-file").click();
    button.disabled = true;
    const requested = new Set();
    try {
      while (true) {
        const expander = box.querySelector(".code-expander-button[hx-get]");
        if (!expander || requested.has(expander.getAttribute("hx-get"))) break;
        requested.add(expander.getAttribute("hx-get"));
        const success = await new Promise(resolve => {
          const finish = success => {
            clearTimeout(timeout);
            document.body.removeEventListener("htmx:afterSettle", settled);
            resolve(success);
          };
          const settled = event => {
            const targets = [event.target, event.detail?.elt, event.detail?.target];
            if (targets.some(target => target instanceof Element && box.contains(target))) finish(true);
          };
          const timeout = setTimeout(() => finish(false), 15000);
          document.body.addEventListener("htmx:afterSettle", settled);
          expander.click();
        });
        if (!success) break;
      }
    } finally {
      button.disabled = false;
    }
  });
  const boxes = document.getElementById("diff-file-boxes");
  function updateFoldLabels() {
    // Forgejo's initial hunk labels omit the first @, while loaded excerpts include both.
    for (const code of container.querySelectorAll(".tag-code .code-inner")) {
      if (/^@ [+-]/.test(code.textContent)) code.prepend(document.createTextNode("@"));
    }
    for (const box of boxes?.querySelectorAll(".diff-file-box") || []) {
      const expand = box.querySelector(".diff-expand-file");
      if (expand) expand.hidden = !box.querySelector(".code-expander-button");
      const button = box.querySelector(".fold-file");
      if (!button) continue;
      const expanded = box.dataset.folded !== "true";
      button.setAttribute("aria-expanded", expanded);
      button.setAttribute("aria-label", expanded ? "Collapse file" : "Expand file");
    }
  }
  if (boxes)
    new MutationObserver(mutations => {
      updateFoldLabels();
      if (
        search.value &&
        mutations.some(mutation => mutation.type === "childList" || mutation.attributeName === "data-tree-filtered")
      )
        find();
    }).observe(boxes, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-folded", "data-tree-filtered"],
    });
  updateFoldLabels();
  // Let Forgejo load the actual referencing branches using its existing handler.
  window.addEventListener("load", () => document.querySelector(".commit-card .load-branches-and-tags")?.click(), {
    once: true,
  });
})();

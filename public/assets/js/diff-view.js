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
    count.textContent = results.length ? `${current + 1}/${results.length}` : count.dataset.empty;
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
  function setContextExpanded(box, expanded) {
    const button = box.querySelector(".diff-expand-file");
    box.toggleAttribute("data-context-expanded", expanded);
    if (!button) return;
    // Named by the file it acts on, with its state in aria-pressed, as Forgejo has no strings for the two actions.
    button.setAttribute("aria-pressed", expanded);
    if (expanded) button.hidden = false;
  }
  // GitHub's "Collapse non-diff lines": reload the file's original diff through Forgejo's own "Load diff"
  // handler, which also re-enables htmx on the restored expander buttons.
  function collapseContext(box, button) {
    const source = box.querySelector(".diff-file-body > .file-body");
    if (!source) return;
    const params = new URLSearchParams(window.location.search);
    params.set("file-only", "true");
    params.delete("files");
    params.append("files", box.dataset.newFilename);
    if (box.dataset.oldFilename && box.dataset.oldFilename !== box.dataset.newFilename)
      params.append("files", box.dataset.oldFilename);
    const holder = document.createElement("div");
    holder.className = "diff-file-body binary";
    holder.textContent = container.dataset.loading;
    const link = document.createElement("a");
    link.className = "diff-load-button tw-hidden";
    link.dataset.href = `?${params}`;
    holder.append(link);
    source.replaceChildren(holder);
    setContextExpanded(box, false);
    box.setAttribute("data-context-reloading", "");
    button.disabled = true;
    link.click();
  }
  container.addEventListener("click", async event => {
    const button = event.target.closest(".diff-expand-file");
    if (!button) return;
    const box = button.closest(".diff-file-box");
    if (box.dataset.folded === "true") box.querySelector(".fold-file").click();
    if (box.hasAttribute("data-context-expanded")) {
      collapseContext(box, button);
      return;
    }
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
      if (requested.size) setContextExpanded(box, true);
    } finally {
      button.disabled = false;
    }
  });
  const boxes = document.getElementById("diff-file-boxes");
  function updateFoldLabels() {
    for (const box of boxes?.querySelectorAll(".diff-file-box") || []) {
      const expand = box.querySelector(".diff-expand-file");
      if (expand) {
        const expanders = Boolean(box.querySelector(".code-expander-button"));
        expand.hidden = !expanders && !box.hasAttribute("data-context-expanded");
        // Re-enabled once Forgejo has restored the collapsed diff.
        if (expanders && box.hasAttribute("data-context-reloading")) {
          box.removeAttribute("data-context-reloading");
          expand.disabled = false;
        }
      }
      const button = box.querySelector(".fold-file");
      if (!button) continue;
      const expanded = box.dataset.folded !== "true";
      button.setAttribute("aria-expanded", expanded);
    }
  }
  // Forgejo hides a folded file body at once. Keep it shown while its height slides to or from zero; past the
  // viewport the motion is not visible, so long diffs only animate their first screen.
  function animateFold(box) {
    const body = box.querySelector(":scope > .diff-file-body");
    if (!body || box.hasAttribute("data-deleted-diff-hidden") || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    // Each frame of the slide restyles the loaded diff lines, so it stutters once there are many of them, in one long
    // file or across several. Past that, files fold at once, as on GitHub.
    if (boxes.getElementsByTagName("tr").length > 500) return;
    for (const animation of body.getAnimations()) animation.cancel();
    box.setAttribute("data-folding", "");
    const height = `${Math.min(body.scrollHeight, window.innerHeight)}px`;
    const frames = [
      { height, opacity: 1 },
      { height: "0px", opacity: 0 },
    ];
    const animation = body.animate(box.dataset.folded === "true" ? frames : frames.reverse(), {
      duration: 150,
      easing: "ease-out",
    });
    animation.onfinish = () => box.removeAttribute("data-folding");
  }
  if (boxes)
    new MutationObserver(mutations => {
      for (const mutation of mutations)
        if (
          mutation.attributeName === "data-folded" &&
          mutation.target.matches(".diff-file-box") &&
          mutation.oldValue !== mutation.target.dataset.folded
        )
          animateFold(mutation.target);
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
      attributeOldValue: true,
      attributeFilter: ["data-folded", "data-tree-filtered"],
    });
  updateFoldLabels();
  // GitHub loads the next files while scrolling. Press Forgejo's hidden "Show more" link before the end comes into
  // view; its handler swaps in a new #diff-incomplete for each page. A loader still there after a while failed or is
  // slow, so it is watched again and retried once in view.
  const content = document.getElementById("diff-content-container");
  if (content && "IntersectionObserver" in window) {
    const loader = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          loader.unobserve(entry.target);
          entry.target.querySelector("#diff-show-more-files:not(.disabled)")?.click();
          setTimeout(() => entry.target.isConnected && loader.observe(entry.target), 5000);
        }
      },
      { rootMargin: "0px 0px 2000px 0px" }
    );
    const watchIncomplete = () => {
      const incomplete = document.getElementById("diff-incomplete");
      if (incomplete) loader.observe(incomplete);
    };
    new MutationObserver(watchIncomplete).observe(content, { childList: true });
    watchIncomplete();
  }
  // Forgejo writes the viewed count into a hidden <progress>; draw it as GitHub's progress ring.
  const viewedProgress = document.getElementById("viewed-files-summary");
  const viewedRing = document.querySelector(".diff-viewed-ring");
  if (viewedProgress && viewedRing) {
    const updateRing = () => {
      const max = Number(viewedProgress.getAttribute("max")) || 0;
      const value = Number(viewedProgress.getAttribute("value")) || 0;
      viewedRing.style.setProperty("--viewed-ratio", max ? String(Math.min(value / max, 1)) : "0");
      viewedRing.classList.toggle("is-complete", max > 0 && value >= max);
    };
    new MutationObserver(updateRing).observe(viewedProgress, { attributes: true, attributeFilter: ["value", "max"] });
    updateRing();
  }
  // Let Forgejo load the actual referencing branches using its existing handler.
  window.addEventListener("load", () => document.querySelector(".commit-card .load-branches-and-tags")?.click(), {
    once: true,
  });
})();

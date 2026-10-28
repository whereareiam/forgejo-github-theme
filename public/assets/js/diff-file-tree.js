(() => {
  const tree = document.getElementById("diff-file-tree");
  const input = document.getElementById("diff-tree-filter");
  if (!tree || !input) return;
  const options = document.querySelector(".diff-tree-options .theme-menu-popover");
  const empty = document.querySelector(".diff-tree-empty");
  const container = document.getElementById("diff-container");
  const toggle = document.querySelector(".diff-toggle-file-tree-button");
  const mobile = matchMedia("(max-width: 767.98px)");
  // Forgejo shows and hides the tree with tw-hidden; the template sets the first state before paint and this keeps the
  // layout and the toggle in step. On phones the toggle opens the tree above the files instead.
  const updateToggle = () => {
    const treeHidden = tree.classList.contains("tw-hidden");
    container.classList.toggle("diff-file-tree-hidden", treeHidden);
    const expanded = mobile.matches ? container.classList.contains("diff-mobile-tree-open") : !treeHidden;
    toggle.setAttribute("aria-expanded", expanded);
    toggle.setAttribute("aria-label", toggle.dataset[expanded ? "hideText" : "showText"]);
    toggle.classList.toggle("active", expanded);
  };
  toggle.addEventListener(
    "click",
    event => {
      if (!mobile.matches) return;
      const open = container.classList.toggle("diff-mobile-tree-open");
      if (!open || !tree.classList.contains("tw-hidden")) event.stopImmediatePropagation();
      updateToggle();
    },
    true
  );
  mobile.addEventListener("change", updateToggle);
  new MutationObserver(updateToggle).observe(tree, { attributes: true, attributeFilter: ["class"] });
  tree.addEventListener("click", event => {
    if (mobile.matches && event.target.closest(".item-file")) {
      container.classList.remove("diff-mobile-tree-open");
      updateToggle();
    }
  });
  updateToggle();
  const excludedExtensions = new Set();
  const extension = name =>
    name
      .split("/")
      .pop()
      .match(/\.[^.]+$/)?.[0] || "No extension";
  const files = () => window.config?.pageData?.diffFileInfo?.files || [];
  const matches = file =>
    file.Name.toLowerCase().includes(input.value.trim().toLowerCase()) && !excludedExtensions.has(extension(file.Name));
  const children = directory =>
    directory.nextElementSibling?.matches(".sub-items") ? directory.nextElementSibling : null;
  // Large pull requests have thousands of rows, so only touch attributes that change: every write invalidates styles
  // and wakes Forgejo's document-wide observers.
  const setAttribute = (element, name, value) => {
    if (element.getAttribute(name) !== String(value)) element.setAttribute(name, value);
  };
  const toggleAttribute = (element, name, force) => {
    if (element.hasAttribute(name) !== force) element.toggleAttribute(name, force);
  };
  let scheduled = false;
  let revealMatches = false;
  let extensionKey = "";

  function refresh() {
    scheduled = false;
    const data = files();
    const matching = data.filter(matches);
    const visibleDirectories = new Set();
    for (const file of matching)
      for (let end = file.Name.indexOf("/"); end !== -1; end = file.Name.indexOf("/", end + 1))
        visibleDirectories.add(file.Name.slice(0, end));
    const byHash = new Map(data.map(file => [`#diff-${file.NameHash}`, file]));
    const byName = new Map(data.map(file => [file.Name, file]));
    const counts = new Map();
    for (const file of data) counts.set(extension(file.Name), (counts.get(extension(file.Name)) || 0) + 1);
    const key = JSON.stringify([...counts]);
    if (key !== extensionKey) {
      extensionKey = key;
      options.replaceChildren();
      const title = document.createElement("span");
      title.className = "theme-menu-title";
      title.textContent = "File extensions";
      options.append(title);
      for (const [ext, count] of [...counts].sort(([a], [b]) => a.localeCompare(b))) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = ext;
        checkbox.checked = !excludedExtensions.has(ext);
        const badge = document.createElement("span");
        badge.className = "theme-counter diff-filter-count";
        badge.textContent = count;
        label.append(checkbox, document.createTextNode(ext), badge);
        options.append(label);
      }
    }
    setAttribute(tree, "role", "tree");
    setAttribute(tree, "aria-label", "File tree");
    function visit(container, prefix = "", level = 1) {
      for (const row of container.children) {
        if (row.matches(".item-directory")) {
          const path = prefix + row.title;
          const group = children(row);
          const visible = visibleDirectories.has(path);
          toggleAttribute(row, "data-tree-filtered", !visible);
          setAttribute(row, "role", "treeitem");
          setAttribute(row, "aria-label", row.title);
          setAttribute(row, "aria-level", level);
          setAttribute(row, "aria-expanded", Boolean(group && group.style.display !== "none"));
          setAttribute(row, "tabindex", -1);
          if (group) {
            setAttribute(group, "role", "group");
            setAttribute(group, "aria-label", row.title);
            toggleAttribute(group, "data-tree-filtered", !visible);
            visit(group, `${path}/`, level + 1);
          }
          // Reveal matching descendants when searching, including Vue's lazy subtrees.
          if (revealMatches && visible && row.getAttribute("aria-expanded") === "false") row.click();
        } else if (row.matches(".item-file")) {
          // Forgejo 17 tree items have no href, so remember the path they stand for. Their title is left alone:
          // Forgejo turns every title change into an eagerly created tooltip.
          row.dataset.diffPath ||= prefix + (row.querySelector("span")?.textContent.trim() || row.title);
          const file = byName.get(row.dataset.diffPath);
          toggleAttribute(row, "data-tree-filtered", file ? !matches(file) : false);
          setAttribute(row, "role", "treeitem");
          setAttribute(row, "aria-level", level);
          setAttribute(row, "aria-selected", row.classList.contains("selected"));
          setAttribute(row, "tabindex", -1);
        } else if (row.matches(".diff-file-tree-items")) visit(row, prefix, level);
      }
    }
    visit(tree);
    revealMatches = false;
    // Find the roving tab stop without laying out every row.
    const shown = row => row?.matches('[role="treeitem"]') && tree.contains(row) && row.checkVisibility();
    const focused =
      [document.activeElement, tree.querySelector('.selected[role="treeitem"]')].find(shown) ||
      [...tree.querySelectorAll('[role="treeitem"]')].find(shown);
    if (focused) focused.tabIndex = 0;
    empty.hidden = matching.length !== 0;
    for (const box of document.querySelectorAll("#diff-file-boxes > .diff-file-box[data-new-filename]")) {
      const file = byHash.get(`#${box.id}`);
      toggleAttribute(box, "data-tree-filtered", Boolean(file && !matches(file)));
    }
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(refresh);
  }
  function visibleRows() {
    return [...tree.querySelectorAll('[role="treeitem"]')].filter(row => row.getClientRects().length);
  }
  input.addEventListener("input", () => {
    revealMatches = true;
    schedule();
  });
  input.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      input.value = "";
      schedule();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      visibleRows()[0]?.focus();
    }
  });
  options.addEventListener("change", event => {
    const checkbox = event.target;
    if (checkbox.checked) excludedExtensions.delete(checkbox.value);
    else excludedExtensions.add(checkbox.value);
    revealMatches = true;
    schedule();
  });
  tree.addEventListener("click", schedule);
  new MutationObserver(schedule).observe(tree, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });
  const boxes = document.getElementById("diff-file-boxes");
  if (boxes) new MutationObserver(schedule).observe(boxes, { childList: true });
  refresh();
})();

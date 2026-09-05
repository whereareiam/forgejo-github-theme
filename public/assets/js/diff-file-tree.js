(() => {
  const tree = document.getElementById("diff-file-tree");
  const input = document.getElementById("diff-tree-filter");
  if (!tree || !input) return;
  const options = document.querySelector(".diff-tree-options .theme-menu-popover");
  const empty = document.querySelector(".diff-tree-empty");
  const container = document.getElementById("diff-container");
  const toggle = document.querySelector(".diff-toggle-file-tree-button");
  const mobile = matchMedia("(max-width: 767.98px)");
  const updateToggle = () => {
    const expanded = mobile.matches
      ? container.classList.contains("diff-mobile-tree-open")
      : !tree.classList.contains("tw-hidden");
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
  let scheduled = false;
  let revealMatches = false;
  let extensionKey = "";

  function refresh() {
    scheduled = false;
    const data = files();
    const matching = data.filter(matches);
    const byHash = new Map(data.map(file => [`#diff-${file.NameHash}`, file]));
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
        badge.className = "diff-filter-count";
        badge.textContent = count;
        label.append(checkbox, document.createTextNode(ext), badge);
        options.append(label);
      }
    }
    tree.setAttribute("role", "tree");
    tree.setAttribute("aria-label", "File tree");
    function visit(container, prefix = "", level = 1) {
      for (const row of container.children) {
        if (row.matches(".item-directory")) {
          const path = prefix + row.title;
          const group = children(row);
          const visible = matching.some(file => file.Name.startsWith(`${path}/`));
          row.toggleAttribute("data-tree-filtered", !visible);
          row.setAttribute("role", "treeitem");
          row.setAttribute("aria-label", row.title);
          row.setAttribute("aria-level", level);
          row.setAttribute("aria-expanded", Boolean(group && group.style.display !== "none"));
          row.tabIndex = -1;
          if (group) {
            group.setAttribute("role", "group");
            group.setAttribute("aria-label", row.title);
            group.toggleAttribute("data-tree-filtered", !visible);
            visit(group, `${path}/`, level + 1);
          }
          if (!row.querySelector(".tree-directory-icon")) {
            const icon = document.getElementById("diff-tree-icon-directory").content.firstElementChild.cloneNode(true);
            icon.classList.add("tree-directory-icon");
            row.insertBefore(icon, row.querySelector("span"));
          }
          // Reveal matching descendants when searching, including Vue's lazy subtrees.
          if (revealMatches && visible && row.getAttribute("aria-expanded") === "false") row.click();
        } else if (row.matches(".item-file")) {
          const file = byHash.get(row.getAttribute("href"));
          row.toggleAttribute("data-tree-filtered", file ? !matches(file) : false);
          row.setAttribute("role", "treeitem");
          row.setAttribute("aria-level", level);
          row.setAttribute("aria-selected", row.classList.contains("selected"));
          row.tabIndex = -1;
          if (file) row.title = file.Name;
          if (!row.querySelector(".tree-file-icon")) {
            const kind = row.querySelector(".octicon-diff-added")
              ? "added"
              : row.querySelector(".octicon-diff-removed")
                ? "removed"
                : "diff";
            const icon = document.getElementById(`diff-tree-icon-${kind}`)?.content.firstElementChild.cloneNode(true);
            if (icon) {
              icon.classList.add("tree-file-icon");
              row.prepend(icon);
            }
          }
        } else if (row.matches(".diff-file-tree-items")) visit(row, prefix, level);
      }
    }
    visit(tree);
    revealMatches = false;
    const rows = visibleRows();
    const focused = rows.includes(document.activeElement)
      ? document.activeElement
      : rows.find(row => row.classList.contains("selected")) || rows[0];
    if (focused) focused.tabIndex = 0;
    empty.hidden = matching.length !== 0;
    for (const box of document.querySelectorAll("#diff-file-boxes > .diff-file-box[data-new-filename]")) {
      const file = byHash.get(`#${box.id}`);
      box.toggleAttribute("data-tree-filtered", Boolean(file && !matches(file)));
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

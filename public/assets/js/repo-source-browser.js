(() => {
  // Loaded without defer right after the panel, so the tree is built while the page is parsed and is in place on
  // its first paint; the main content after it is not in the document yet.
  const tree = document.getElementById("repo-source-tree");
  if (!tree) return;
  const container = document.getElementById("repo-source-browser");
  const root = tree.querySelector('[role="tree"]');
  const status = tree.querySelector('[role="status"]');
  let currentPath = tree.dataset.currentPath;
  const media = matchMedia("(max-width: 767.98px)");
  const storageKey = `repo_source_expanded:${tree.dataset.sourceUrl}`;
  const scrollKey = `repo_source_scroll:${tree.dataset.sourceUrl}`;
  const rows = new Map();
  // Folders whose rows are made the first time they open: a large repository has tens of thousands of entries.
  const pending = new Map();
  let expanded = new Set();
  try {
    expanded = new Set(JSON.parse(sessionStorage.getItem(storageKey) || "[]"));
  } catch {
    /* Use current-path ancestors. */
  }
  const parts = currentPath.split("/");
  for (let i = 1; i < parts.length; i++) expanded.add(parts.slice(0, i).join("/"));
  function store(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* Optional preference. */
    }
  }
  function visible(show) {
    container.classList.toggle("repo-source-tree-hidden", !show);
    for (const toggle of container.querySelectorAll("[data-source-tree-toggle]")) {
      toggle.setAttribute("aria-expanded", show);
      toggle.setAttribute("aria-label", show ? toggle.dataset.hideLabel : toggle.dataset.showLabel);
    }
  }
  function preference() {
    try {
      return localStorage.getItem("repo_file_tree_visible") !== "false";
    } catch {
      return true;
    }
  }
  const shown = () => !container.classList.contains("repo-source-tree-hidden");
  visible(!media.matches && preference());
  media.addEventListener("change", () => visible(!media.matches && preference()));
  // The main content's toggle comes later and is replaced when a folder opens in place, so listen on the container.
  container.addEventListener("click", event => {
    if (!event.target.closest("[data-source-tree-toggle]")) return;
    const show = !shown();
    visible(show);
    if (!media.matches)
      try {
        localStorage.setItem("repo_file_tree_visible", show);
      } catch {
        /* Optional preference. */
      }
  });
  document.addEventListener("DOMContentLoaded", () => visible(shown()));
  const icon = name => document.getElementById(`repo-tree-${name}`).content.firstElementChild.cloneNode(true);
  const href = path => `${tree.dataset.sourceUrl}/${path.split("/").map(encodeURIComponent).join("/")}`;
  function disclose(row, open) {
    const group = row.nextElementSibling;
    if (open && pending.has(group)) {
      render(...pending.get(group));
      pending.delete(group);
    }
    row.setAttribute("aria-expanded", open);
    group.hidden = !open;
    const disclosure = icon(open ? "chevron-down" : "chevron-right");
    disclosure.setAttribute("data-tree-disclosure", "");
    row.firstElementChild.replaceWith(disclosure);
    if (open) expanded.add(row.dataset.path);
    else expanded.delete(row.dataset.path);
    store(storageKey, JSON.stringify([...expanded]));
  }
  function render(nodes, parent, level = 1) {
    for (const node of [...nodes.values()].sort(
      (a, b) => Number(b.directory) - Number(a.directory) || a.name.localeCompare(b.name)
    )) {
      const row = document.createElement("a");
      row.className = node.directory ? "item-directory" : "item-file";
      row.title = node.path;
      row.href = href(node.path);
      row.dataset.path = node.path;
      row.tabIndex = -1;
      row.setAttribute("role", "treeitem");
      row.setAttribute("aria-level", level);
      row.setAttribute("aria-label", node.name);
      row.setAttribute("aria-selected", node.path === currentPath);
      row.classList.toggle("selected", node.path === currentPath);
      rows.set(node.path, row);
      const label = document.createElement("span");
      label.className = "gt-ellipsis";
      label.textContent = node.name;
      if (node.directory) {
        const group = document.createElement("div");
        group.className = "sub-items";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", node.name);
        const open = expanded.has(node.path) || node.path === currentPath;
        group.hidden = !open;
        row.setAttribute("aria-expanded", open);
        const disclosure = icon(open ? "chevron-down" : "chevron-right");
        disclosure.setAttribute("data-tree-disclosure", "");
        row.append(disclosure, icon("folder"), icon("folder-open"), label);
        row.addEventListener("click", event => {
          if (!event.target.closest("[data-tree-disclosure]")) return;
          event.preventDefault();
          disclose(row, row.getAttribute("aria-expanded") !== "true");
        });
        parent.append(row, group);
        if (open) render(node.children, group, level + 1);
        else pending.set(group, [node.children, group, level + 1]);
      } else {
        row.append(icon("file"), label);
        parent.append(row);
      }
    }
  }
  // Scroll the tree, not the page, to centre a row outside the part of the tree in the window.
  function reveal(row) {
    const area = tree.getBoundingClientRect();
    const top = Math.max(area.top, 0);
    const bottom = Math.min(area.bottom, innerHeight);
    const box = row.getBoundingClientRect();
    if (box.top < top || box.bottom > bottom) tree.scrollTop += box.top - (top + bottom - box.height) / 2;
  }
  // A folder or file opened without a page load: move the selection and open the folders on its path.
  function select(path) {
    currentPath = path;
    tree.dataset.currentPath = path;
    for (const row of root.querySelectorAll('[aria-selected="true"]')) {
      row.setAttribute("aria-selected", "false");
      row.classList.remove("selected");
    }
    const segments = path.split("/");
    for (let i = 1; i <= segments.length; i++) {
      const row = rows.get(segments.slice(0, i).join("/"));
      if (row?.matches(".item-directory") && row.getAttribute("aria-expanded") !== "true") disclose(row, true);
    }
    const row = rows.get(path);
    if (!row) return;
    row.setAttribute("aria-selected", "true");
    row.classList.add("selected");
    if (!tree.contains(document.activeElement)) {
      for (const focusable of root.querySelectorAll('[tabindex="0"]')) focusable.tabIndex = -1;
      row.tabIndex = 0;
    }
    reveal(row);
  }
  tree.addEventListener("repo-source:navigate", event => {
    select(event.detail.path);
    visible(shown());
  });
  function load() {
    try {
      const nodes = new Map();
      const entries = document.getElementById("repo-source-tree-data").content.children;
      for (const entry of entries) {
        let parent = nodes;
        const segments = entry.dataset.path.split("/");
        segments.forEach((name, index) => {
          const path = segments.slice(0, index + 1).join("/");
          if (!parent.has(name))
            parent.set(name, {
              name,
              path,
              directory: index < segments.length - 1 || entry.dataset.directory === "true",
              children: new Map(),
            });
          parent = parent.get(name).children;
        });
      }
      root.replaceChildren();
      render(nodes, root);
      const selected = root.querySelector(".selected") || root.querySelector('[role="treeitem"]');
      if (selected) selected.tabIndex = 0;
      status.hidden = true;
      restore();
    } catch {
      status.textContent = status.dataset.error;
    }
  }
  // Keep the tree where it was on the previous page of this branch, with the selected row in view.
  function restore() {
    try {
      tree.scrollTop = Number(sessionStorage.getItem(scrollKey)) || 0;
    } catch {
      /* Start at the top. */
    }
    const selected = root.querySelector(".selected");
    if (selected) reveal(selected);
  }
  load();
  // Without the page's styles yet the tree cannot scroll; try again once they apply.
  if (!tree.scrollTop) document.addEventListener("DOMContentLoaded", () => tree.scrollTop || restore());
  addEventListener("pagehide", () => store(scrollKey, tree.scrollTop));
})();

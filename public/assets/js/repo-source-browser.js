(() => {
  const tree = document.getElementById("repo-source-tree");
  if (!tree) return;
  const container = document.getElementById("repo-source-browser");
  const root = tree.querySelector('[role="tree"]');
  const status = tree.querySelector('[role="status"]');
  const currentPath = tree.dataset.currentPath;
  const media = matchMedia("(max-width: 767.98px)");
  const storageKey = `repo_source_expanded:${tree.dataset.sourceUrl}`;
  let expanded = new Set();
  try {
    expanded = new Set(JSON.parse(sessionStorage.getItem(storageKey) || "[]"));
  } catch {
    /* Use current-path ancestors. */
  }
  const parts = currentPath.split("/");
  for (let i = 1; i < parts.length; i++) expanded.add(parts.slice(0, i).join("/"));
  function visible(show) {
    container.classList.toggle("repo-source-tree-hidden", !show);
    for (const toggle of container.querySelectorAll("[data-source-tree-toggle]")) {
      toggle.setAttribute("aria-expanded", show);
      toggle.setAttribute("aria-label", show ? "Hide file tree" : "Show file tree");
    }
  }
  function preference() {
    try {
      return localStorage.getItem("repo_file_tree_visible") !== "false";
    } catch {
      return true;
    }
  }
  visible(!media.matches && preference());
  media.addEventListener("change", () => visible(!media.matches && preference()));
  for (const toggle of container.querySelectorAll("[data-source-tree-toggle]"))
    toggle.addEventListener("click", () => {
      const show = container.classList.contains("repo-source-tree-hidden");
      visible(show);
      if (!media.matches)
        try {
          localStorage.setItem("repo_file_tree_visible", show);
        } catch {
          /* Optional preference. */
        }
    });
  const icon = name => document.getElementById(`repo-tree-${name}`).content.firstElementChild.cloneNode(true);
  const href = path => `${tree.dataset.sourceUrl}/${path.split("/").map(encodeURIComponent).join("/")}`;
  function render(nodes, parent, level = 1) {
    for (const node of [...nodes.values()].sort(
      (a, b) => Number(b.directory) - Number(a.directory) || a.name.localeCompare(b.name)
    )) {
      const row = document.createElement("a");
      row.className = node.directory ? "item-directory" : "item-file";
      row.title = node.path;
      row.href = href(node.path);
      row.tabIndex = -1;
      row.setAttribute("role", "treeitem");
      row.setAttribute("aria-level", level);
      row.setAttribute("aria-label", node.name);
      row.setAttribute("aria-selected", node.path === currentPath);
      row.classList.toggle("selected", node.path === currentPath);
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
          const open = row.getAttribute("aria-expanded") !== "true";
          row.setAttribute("aria-expanded", open);
          group.hidden = !open;
          const disclosure = icon(open ? "chevron-down" : "chevron-right");
          disclosure.setAttribute("data-tree-disclosure", "");
          row.firstElementChild.replaceWith(disclosure);
          if (open) expanded.add(node.path);
          else expanded.delete(node.path);
          try {
            sessionStorage.setItem(storageKey, JSON.stringify([...expanded]));
          } catch {
            /* Optional preference. */
          }
        });
        parent.append(row, group);
        render(node.children, group, level + 1);
      } else {
        row.href = href(node.path);
        row.append(icon("file"), label);
        parent.append(row);
      }
    }
  }
  async function load() {
    try {
      const nodes = new Map();
      let page = 1,
        more = true;
      while (more) {
        const response = await fetch(`${tree.dataset.apiUrl}&page=${page}`);
        if (!response.ok) throw new Error("Unable to load tree");
        const data = await response.json();
        for (const entry of data.tree || []) {
          let parent = nodes;
          const segments = entry.path.split("/");
          segments.forEach((name, index) => {
            const path = segments.slice(0, index + 1).join("/");
            if (!parent.has(name))
              parent.set(name, {
                name,
                path,
                directory: index < segments.length - 1 || entry.type === "tree",
                children: new Map(),
              });
            parent = parent.get(name).children;
          });
        }
        more = data.truncated && data.tree?.length > 0;
        page++;
      }
      root.replaceChildren();
      render(nodes, root);
      const selected = root.querySelector(".selected") || root.querySelector('[role="treeitem"]');
      if (selected) selected.tabIndex = 0;
      status.hidden = true;
    } catch {
      status.textContent = "Could not load the file tree. Reload to try again.";
    }
  }
  load();
})();

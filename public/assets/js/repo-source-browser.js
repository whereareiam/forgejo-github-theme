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
  // The entries known so far: the folders on the page's path at first, every entry once the full list arrives.
  const nodes = new Map();
  let complete = false;
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
          // A folder whose entries are not known yet, because the full list could not be read, opens as a page.
          if (!event.target.closest("[data-tree-disclosure]") || !node.children.size) return;
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
    // Until the full list arrives, add the folders on the new page's path.
    if (!complete && event.detail.entries) {
      add(event.detail.entries);
      build();
    }
    select(event.detail.path);
    visible(shown());
  });
  function insert(path, directory) {
    let parent = nodes;
    const segments = path.split("/");
    segments.forEach((name, index) => {
      if (!parent.has(name))
        parent.set(name, {
          name,
          path: segments.slice(0, index + 1).join("/"),
          directory: index < segments.length - 1 || directory,
          children: new Map(),
        });
      parent = parent.get(name).children;
    });
  }
  function add(data) {
    for (const entry of data.content.children) insert(entry.dataset.path, entry.dataset.directory === "true");
  }
  // Git keeps no empty folders, so a folder without entries is one the page did not list.
  function listed(map = nodes) {
    for (const node of map.values())
      if (node.directory && (!node.children.size || !listed(node.children))) return false;
    return true;
  }
  function build() {
    const focused = tree.contains(document.activeElement) ? document.activeElement.dataset.path : undefined;
    const scroll = tree.scrollTop;
    rows.clear();
    pending.clear();
    root.replaceChildren();
    render(nodes, root);
    const selected = rows.get(focused) || root.querySelector(".selected") || root.querySelector('[role="treeitem"]');
    if (selected) selected.tabIndex = 0;
    if (focused === undefined) restore();
    else {
      rows.get(focused)?.focus({ preventScroll: true });
      tree.scrollTop = scroll;
    }
  }
  // The full list of the page's commit, from this browser's copy or else fetched once; the page lists only its path.
  const listKey = new URL(tree.dataset.commitUrl, location.href).pathname;
  const kept = 10;
  // One database per signed-in user; repo-source-tree-cache.js deletes the others on every page. Each connection closes
  // once its transaction is done, so it never blocks that.
  function database() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(`repo-source-tree:${tree.dataset.viewer}`, 1);
      request.onupgradeneeded = () =>
        request.result.createObjectStore("lists", { keyPath: "key" }).createIndex("time", "time");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async function transaction(mode) {
    const db = await database();
    const store = db.transaction("lists", mode).objectStore("lists");
    db.close();
    return store;
  }
  async function cached() {
    const store = await transaction("readonly");
    return new Promise((resolve, reject) => {
      const request = store.get(listKey);
      request.onsuccess = () => resolve(request.result?.list);
      request.onerror = () => reject(request.error);
    });
  }
  // Keep the lists of the last few commits only.
  async function keep(list) {
    const store = await transaction("readwrite");
    store.put({ key: listKey, list, time: Date.now() });
    const count = store.count();
    count.onsuccess = () => {
      let extra = count.result - kept;
      if (extra <= 0) return;
      store.index("time").openKeyCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (!cursor || extra-- <= 0) return;
        store.delete(cursor.primaryKey);
        cursor.continue();
      };
    };
  }
  // Any folder page of the commit answers with the list alone; the deepest folder on the path is already listed.
  function listUrl() {
    let folder = [...nodes.values()].find(node => node.directory);
    let children = nodes;
    for (const name of currentPath.split("/")) {
      const node = children.get(name);
      if (!node?.directory) break;
      folder = node;
      children = node.children;
    }
    return `${tree.dataset.commitUrl}/${folder.path.split("/").map(encodeURIComponent).join("/")}?source-tree=list`;
  }
  async function fetched() {
    const response = await fetch(listUrl(), { headers: { Accept: "text/html" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const page = new DOMParser().parseFromString(await response.text(), "text/html");
    const list = page.getElementById("repo-source-tree-list");
    if (!list) throw new Error("No file list");
    return list.content.textContent;
  }
  async function loadList() {
    let list;
    try {
      list = await cached();
    } catch {
      /* No copy in this browser. */
    }
    if (list === undefined) {
      list = await fetched();
      keep(list).catch(() => {
        /* Fetch it again next time. */
      });
    }
    for (const path of list.split("\n")) if (path) insert(path, false);
    complete = true;
    build();
  }
  function load() {
    try {
      add(document.getElementById("repo-source-tree-data"));
      root.replaceChildren();
      render(nodes, root);
      const selected = root.querySelector(".selected") || root.querySelector('[role="treeitem"]');
      if (selected) selected.tabIndex = 0;
      status.hidden = true;
      restore();
    } catch {
      status.textContent = status.dataset.error;
      return;
    }
    complete = listed();
    if (!complete)
      loadList().catch(() => {
        /* The folders off the path open as pages. */
      });
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

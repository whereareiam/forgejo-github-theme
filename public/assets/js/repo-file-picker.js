(() => {
  const picker = document.querySelector(".repo-file-picker");
  if (!picker) return;
  const input = picker.querySelector("input");
  const list = picker.querySelector('[role="listbox"]');
  const status = picker.querySelector('[role="status"]');
  let files;
  let loading;
  let selected = -1;
  let results = [];
  let dismissed = false;

  function position() {
    const rect = input.parentElement.getBoundingClientRect();
    list.style.left = `${Math.max(16, Math.min(rect.left, innerWidth - Math.min(640, innerWidth - 32) - 16))}px`;
    list.style.top = `${rect.bottom + 4}px`;
    list.style.maxHeight = `${Math.max(80, Math.min(768, innerHeight - rect.bottom - 20))}px`;
  }
  window.addEventListener("resize", position);
  document.addEventListener(
    "scroll",
    () => {
      if (!list.hidden) position();
    },
    true
  );
  function close() {
    dismissed = true;
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
  }
  function select(index) {
    selected = index;
    for (const [i, option] of [...list.children].entries()) option.setAttribute("aria-selected", i === index);
    if (list.children[index]) {
      input.setAttribute("aria-activedescendant", list.children[index].id);
      list.children[index].scrollIntoView({ block: "nearest" });
    } else input.removeAttribute("aria-activedescendant");
  }
  function score(path, query) {
    const value = path.toLowerCase();
    if (!query) return 0;
    const direct = value.indexOf(query);
    if (direct !== -1) return direct;
    let cursor = 0;
    for (const char of query) {
      cursor = value.indexOf(char, cursor);
      if (cursor === -1) return Infinity;
      cursor++;
    }
    return 1000 + cursor;
  }
  function render() {
    if (dismissed || !files) return;
    const query = input.value.trim().toLowerCase();
    results = files
      .map(path => ({ path, score: score(path, query) }))
      .filter(file => Number.isFinite(file.score))
      .sort((a, b) => a.score - b.score || a.path.localeCompare(b.path))
      .slice(0, 100);
    list.replaceChildren();
    for (const [index, file] of results.entries()) {
      const option = document.createElement("a");
      option.id = `repo-file-result-${index}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      option.tabIndex = -1;
      option.href = `${picker.dataset.sourceUrl}/${file.path.split("/").map(encodeURIComponent).join("/")}`;
      const directory = file.path.endsWith("/");
      const icon = document
        .getElementById(directory ? "repo-picker-directory-icon" : "repo-picker-file-icon")
        .content.firstElementChild.cloneNode(true);
      const label = document.createElement("span");
      label.className = "repo-file-result-path";
      const path = file.path.replace(/\/$/, "");
      let cursor = 0;
      for (const char of query) {
        const index = path.toLowerCase().indexOf(char, cursor);
        if (index < 0) break;
        label.append(document.createTextNode(path.slice(cursor, index)));
        const mark = document.createElement("mark");
        mark.textContent = path[index];
        label.append(mark);
        cursor = index + 1;
      }
      label.append(document.createTextNode(path.slice(cursor)));
      option.append(icon, label);
      list.append(option);
    }
    list.hidden = false;
    position();
    input.setAttribute("aria-expanded", "true");
    status.textContent = results.length ? `${results.length} matching files` : "No files found";
    if (!results.length) {
      const empty = document.createElement("div");
      empty.className = "repo-file-picker-empty";
      empty.textContent = "No files found";
      list.append(empty);
    }
    select(results.length ? 0 : -1);
  }
  async function open() {
    dismissed = false;
    picker.querySelector(".repo-picker-clear").hidden = !input.value;
    if (files) {
      render();
      return;
    }
    status.textContent = "Loading files…";
    loading ??= fetch(picker.dataset.treeUrl)
      .then(response => {
        if (!response.ok) throw new Error("Unable to load files");
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Invalid file list");
        const paths = new Set(data.filter(path => typeof path === "string"));
        for (const path of [...paths]) {
          const parts = path.split("/");
          for (let i = 1; i < parts.length; i++) paths.add(`${parts.slice(0, i).join("/")}/`);
        }
        files = [...paths];
        // Include dotfiles present in Forgejo's visible list even when its finder excludes them.
        for (const link of document.querySelectorAll("#repo-files-table .repo-file-cell.name a")) {
          const prefix = `${picker.dataset.sourceUrl}/`;
          const href = link.getAttribute("href");
          if (
            href?.startsWith(prefix) &&
            !link.closest(".repo-file-cell").querySelector(".octicon-file-directory-fill")
          ) {
            const path = decodeURIComponent(href.slice(prefix.length));
            if (!files.includes(path)) files.push(path);
          }
        }
      })
      .catch(() => {
        status.textContent = "Could not load files. Try again.";
        if (!dismissed) {
          const error = document.createElement("div");
          error.className = "repo-file-picker-empty";
          error.textContent = status.textContent;
          list.replaceChildren(error);
          list.hidden = false;
          input.setAttribute("aria-expanded", "true");
          position();
        }
        loading = undefined;
      });
    await loading;
    render();
  }
  picker.querySelector(".repo-picker-clear").addEventListener("click", event => {
    event.preventDefault();
    input.value = "";
    input.focus();
    open();
  });
  input.addEventListener("focus", open);
  input.addEventListener("input", open);
  input.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (list.hidden) {
        open();
        return;
      }
      if (results.length) select((selected + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    }
    if (event.key === "Enter" && !list.hidden && results.length) {
      event.preventDefault();
      list.children[selected]?.click();
    }
  });
  document.addEventListener("pointerdown", event => {
    if (!picker.contains(event.target)) close();
  });
  document.addEventListener("focusin", event => {
    if (!picker.contains(event.target)) close();
  });
  document.addEventListener("keydown", event => {
    if (
      event.key !== "t" ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.target.closest('input, textarea, select, [contenteditable="true"]')
    )
      return;
    const mobileLink = document.querySelector(".repo-mobile-actions a");
    if (!input.getClientRects().length) {
      mobileLink?.click();
      return;
    }
    event.preventDefault();
    input.focus();
  });
})();

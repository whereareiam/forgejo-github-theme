(() => {
  // GitHub keeps the file tree in place and swaps only the folder it shows. Forgejo starts its own scripts once per
  // page load, so only a folder listing those scripts leave alone opens in place; files, READMEs and anything else
  // they would have set up take a normal page load, as does any page that cannot be fetched.
  const container = document.getElementById("repo-source-browser");
  const tree = document.getElementById("repo-source-tree");
  if (!container || !tree || !window.fetch || !window.DOMParser) return;
  const base = new URL(`${tree.dataset.sourceUrl}/`, location.href).pathname;
  const needsPageLoad = "#readme, .markup, .code-view, [data-tippy]";
  let shown = location.pathname + location.search;
  let controller;

  const isDirectory = link =>
    link.matches(".item-directory, .parent-link, .repo-path a") ||
    Boolean((link.closest(".repo-file-cell.name") ?? link).querySelector(".octicon-file-directory-fill"));

  function inPlace(content) {
    if (!content.querySelector("#repo-files-table") || content.querySelector(needsPageLoad)) return false;
    return !content.querySelector(".ui.dropdown") || typeof window.jQuery?.fn?.dropdown === "function";
  }

  function activate(content) {
    // Scripts parsed by DOMParser never run; recreate them so the folder's own scripts start like on a page load.
    for (const parsed of content.querySelectorAll("script")) {
      const script = document.createElement("script");
      for (const { name, value } of parsed.attributes) script.setAttribute(name, value);
      script.textContent = parsed.textContent;
      parsed.replaceWith(script);
    }
    for (const dropdown of content.querySelectorAll(".ui.dropdown")) window.jQuery(dropdown).dropdown();
  }

  // Forgejo's branch selector keeps the folder to open on another branch; point it at the folder shown now.
  function updateBranchSelector(path) {
    const suffix = path ? `/${path.split("/").map(encodeURIComponent).join("/")}` : "";
    for (const selector of container.querySelectorAll(".js-branch-tag-selector")) {
      // The root component Vue rendered into the element.
      const component = selector._vnode?.component?.proxy;
      if (typeof component?.branchURLSuffix !== "string") continue;
      component.branchURLSuffix = suffix;
      component.tagURLSuffix = suffix;
      component.treePath = path;
    }
  }

  async function navigate(url, push) {
    controller?.abort();
    controller = new AbortController();
    const { signal } = controller;
    container.setAttribute("aria-busy", "true");
    try {
      const response = await fetch(url, { signal, headers: { Accept: "text/html" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const page = new DOMParser().parseFromString(await response.text(), "text/html");
      const next = page.getElementById("repo-source-tree");
      const content = page.querySelector("#repo-source-browser > .repo-source-main");
      if (!content || next?.dataset.sourceUrl !== tree.dataset.sourceUrl || !inPlace(content))
        throw new Error("Needs a page load");
      const target = new URL(response.url || url);
      target.hash = new URL(url).hash;
      if (push) {
        history.replaceState({ ...history.state, scrollY }, "");
        history.pushState({ scrollY: 0 }, "", target);
        // This page puts the scroll position back itself once the folder is shown again.
        history.scrollRestoration = "manual";
      }
      shown = target.pathname + target.search;
      document.title = page.title;
      const label = page.querySelector('[role="main"]')?.getAttribute("aria-label");
      if (label) document.querySelector('[role="main"]')?.setAttribute("aria-label", label);
      const main = container.querySelector(":scope > .repo-source-main");
      const adopted = document.adoptNode(content);
      main.replaceWith(adopted);
      activate(adopted);
      tree.dispatchEvent(
        new CustomEvent("repo-source:navigate", {
          detail: { path: next.dataset.currentPath, entries: next.querySelector("#repo-source-tree-data") },
        })
      );
      updateBranchSelector(next.dataset.currentPath);
      let anchor;
      try {
        anchor = target.hash && document.getElementById(decodeURIComponent(target.hash.slice(1)));
      } catch {
        /* Not an element id. */
      }
      if (anchor) anchor.scrollIntoView();
      else scrollTo(0, push ? 0 : (history.state?.scrollY ?? 0));
    } catch {
      if (signal.aborted) return;
      if (push) location.assign(url);
      else location.reload();
    } finally {
      if (controller.signal === signal) container.removeAttribute("aria-busy");
    }
  }

  document.addEventListener("click", event => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.target.closest("a[href]");
    if (!link || !container.contains(link) || (link.target && link.target !== "_self") || link.hasAttribute("download"))
      return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith(base) || !isDirectory(link)) return;
    if (url.pathname + url.search === shown && url.hash) return;
    event.preventDefault();
    navigate(url.href, true);
  });

  addEventListener("popstate", () => {
    const current = location.pathname + location.search;
    // A hash change inside the page that is shown already.
    if (current === shown) return;
    if (!location.pathname.startsWith(base)) location.reload();
    else navigate(location.href, false);
  });
})();

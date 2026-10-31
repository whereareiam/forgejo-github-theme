(() => {
  // Forgejo's branch/tag selector is a Vue component; add GitHub's title with a close button and the footer that opens
  // all branches or tags around its menu. Vue only patches the nodes it rendered, so these stay. The words are the
  // ones Forgejo hands the component (its tab names and "Compare") and its own Cancel for the close button.
  if (!document.querySelector(".js-branch-tag-selector")) return;
  const closeIcon =
    "M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z";

  function updateFooter(menu, data) {
    const footer = menu.querySelector(":scope > .branch-menu-footer");
    if (!footer) return;
    const tags = menu.querySelector(".branch-tag-item.active")?.matches(":last-child:not(:first-child)");
    footer.textContent = tags ? data.textTags : data.textBranches;
    footer.href = `${data.repoLink}/${tags ? "tags" : "branches"}`;
  }

  function enhance(container, data) {
    const menu = container.querySelector(":scope > .ui.dropdown.custom > .menu");
    if (!menu || menu.querySelector(":scope > .branch-menu-header")) return;
    const header = document.createElement("div");
    header.className = "branch-menu-header";
    const title = document.createElement("span");
    title.textContent = data?.release
      ? data.textReleaseCompare
      : [data?.showBranchesInDropdown !== false && data?.textBranches, data?.textTags].filter(Boolean).join(" / ");
    const close = document.createElement("button");
    close.type = "button";
    close.className = "branch-menu-close";
    close.setAttribute("aria-label", window.config?.i18n?.modal_cancel ?? "");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", closeIcon);
    path.setAttribute("fill", "currentColor");
    svg.append(path);
    close.append(svg);
    // The component toggles its menu from its own button.
    close.addEventListener("click", event => {
      event.stopPropagation();
      container.querySelector(".branch-dropdown-button")?.click();
    });
    header.append(title, close);
    menu.prepend(header);
    if (data?.repoLink && !data.release) {
      const footer = document.createElement("a");
      footer.className = "branch-menu-footer";
      menu.append(footer);
      updateFooter(menu, data);
      menu.addEventListener("click", event => {
        if (event.target.closest(".branch-tag-item")) requestAnimationFrame(() => updateFooter(menu, data));
      });
    }
  }

  // Vue mounts the component after this script runs, so enhance the menu when it is first opened.
  document.addEventListener(
    "click",
    event => {
      const button = event.target.closest(".js-branch-tag-selector .branch-dropdown-button");
      if (!button) return;
      const container = button.closest(".js-branch-tag-selector");
      // The template pushes one data entry per selector, in document order; read both now, as Vue replaces the
      // selector element when it mounts.
      const index = [...document.querySelectorAll(".js-branch-tag-selector")].indexOf(container);
      enhance(container, window.config?.pageData?.branchDropdownDataList?.[index]);
    },
    true
  );
})();

(() => {
  if (document.documentElement.dataset.themeMenusReady) return;
  document.documentElement.dataset.themeMenusReady = "true";
  function position(menu) {
    const panel = menu.querySelector(".theme-menu-popover");
    if (!panel) return;
    const rect = menu.querySelector("summary").getBoundingClientRect();
    const left = menu.classList.contains("diff-tree-options") ? rect.left : rect.right - panel.offsetWidth;
    panel.style.left = `${Math.max(8, Math.min(left, innerWidth - panel.offsetWidth - 8))}px`;
    panel.style.top = `${Math.max(8, Math.min(rect.bottom + 4, innerHeight - panel.offsetHeight - 8))}px`;
  }
  document.addEventListener(
    "toggle",
    event => {
      const menu = event.target;
      if (!menu.matches("details.theme-menu")) return;
      menu.querySelector("summary").setAttribute("aria-expanded", menu.open);
      if (menu.open) position(menu);
    },
    true
  );
  const reposition = () => document.querySelectorAll("details.theme-menu[open]").forEach(position);
  window.addEventListener("resize", reposition);
  document.addEventListener("scroll", reposition, true);
  document.addEventListener("click", event => {
    for (const menu of document.querySelectorAll("details.theme-menu[open]")) {
      if (!menu.contains(event.target)) menu.open = false;
      else if (event.target.closest("a, button")) menu.open = false;
    }
  });
  document.addEventListener("keydown", event => {
    const activeMenu = event.target.closest("details.theme-menu");
    if (activeMenu && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      activeMenu.open = true;
      const items = [
        ...activeMenu.querySelectorAll(
          ".theme-menu-popover > label input, .theme-menu-popover > a, .theme-menu-popover > button"
        ),
      ].filter(item => item.getClientRects().length);
      const index = items.indexOf(document.activeElement);
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? items.length - 1
            : (index + (event.key === "ArrowUp" ? -1 : 1) + items.length) % items.length;
      items[next]?.focus();
      event.preventDefault();
      return;
    }
    if (event.key !== "Escape") return;
    for (const menu of document.querySelectorAll("details.theme-menu[open]")) {
      menu.open = false;
      menu.querySelector("summary").focus();
      event.preventDefault();
    }
  });
})();

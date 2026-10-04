(() => {
  const mobile = matchMedia("(max-width: 767.98px)");
  const init = page => {
    let collapsed = mobile.matches;
    try {
      if (!mobile.matches) collapsed = localStorage.getItem(page.dataset.themeSidebar) === "true";
    } catch {
      /* The sidebar also works when browser storage is unavailable. */
    }
    const update = () => {
      page.classList.toggle("theme-sidebar-collapsed", collapsed);
      for (const button of page.querySelectorAll("[data-theme-sidebar-toggle]"))
        button.setAttribute("aria-expanded", String(!collapsed));
    };
    for (const button of page.querySelectorAll("[data-theme-sidebar-toggle]")) {
      button.addEventListener("click", () => {
        collapsed = !collapsed;
        update();
        const next = page.querySelector(collapsed ? "[data-theme-sidebar-expand]" : ".theme-sidebar-toggle");
        next?.focus();
        if (!mobile.matches)
          try {
            localStorage.setItem(page.dataset.themeSidebar, String(collapsed));
          } catch {
            /* Optional desktop preference. */
          }
      });
    }
    mobile.addEventListener("change", () => {
      collapsed = mobile.matches;
      update();
    });
    update();
  };
  for (const page of document.querySelectorAll("[data-theme-sidebar]")) init(page);
  // Forgejo replaces the whole notifications page element after an action; set the new one up too.
  if (typeof MutationObserver === "undefined" || !document.body) return;
  new MutationObserver(records => {
    for (const record of records)
      for (const node of record.addedNodes)
        if (node instanceof Element && node.matches("[data-theme-sidebar]")) init(node);
  }).observe(document.body, { childList: true, subtree: true });
})();

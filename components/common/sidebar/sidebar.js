(() => {
  const mobile = matchMedia("(max-width: 767.98px)");
  const instances = new Map();
  const init = page => {
    // A page Forgejo replaced would keep its listeners on the document, window and media query; drop them first.
    for (const [previous, instance] of instances)
      if (previous === page || previous.isConnected === false) {
        instance.abort();
        instances.delete(previous);
      }
    const instance = new AbortController();
    instances.set(page, instance);
    const { signal } = instance;
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
    // Delegated, so toggles inside content that Forgejo refreshes in place (the Actions run list) keep working.
    page.addEventListener(
      "click",
      event => {
        if (!event.target.closest?.("[data-theme-sidebar-toggle]")) return;
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
      },
      { signal }
    );
    mobile.addEventListener(
      "change",
      () => {
        collapsed = mobile.matches;
        update();
      },
      { signal }
    );
    update();

    // The sidebar sticks to the top of the window but starts below the navbar, so a full window's height would put its
    // bottom, with the collapse toggle, out of view until the page scrolls. It takes the height left beneath its top.
    const aside = page.querySelector(":scope > .theme-sidebar");
    if (!aside?.style || !aside.getBoundingClientRect) return;
    let frame = 0;
    const fit = () => {
      frame = 0;
      aside.style.setProperty(
        "--theme-sidebar-offset",
        `${Math.max(0, Math.round(aside.getBoundingClientRect().top))}px`
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(fit);
    };
    document.addEventListener("scroll", schedule, { passive: true, signal });
    globalThis.addEventListener?.("resize", schedule, { signal });
    fit();
  };
  for (const page of document.querySelectorAll("[data-theme-sidebar]")) init(page);
  // Forgejo replaces the whole notifications page element after an action; watch only its parent for the new one.
  const replaceable = document.querySelector("#notification_div[data-theme-sidebar]")?.parentElement;
  if (typeof MutationObserver === "undefined" || !replaceable) return;
  new MutationObserver(records => {
    for (const record of records)
      for (const node of record.addedNodes)
        if (node instanceof Element && node.matches("[data-theme-sidebar]")) init(node);
  }).observe(replaceable, { childList: true });
})();

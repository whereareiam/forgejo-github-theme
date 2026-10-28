(() => {
  const mobile = matchMedia("(max-width: 767.98px)");
  const instances = new Map();
  // A section counts as the one being read until less than this much of it is left below the window's top.
  const READING_LINE = 80;
  // "On this page": links to sections of the page, with the one in view marked like the current page above it. An
  // entry just followed stays marked while its section starts in view, even when that section is too short, at the
  // end of the page, to reach the top of the window. Its listeners end with the sidebar's own (signal).
  const outline = (nav, signal) => {
    const entries = [];
    for (const link of nav.querySelectorAll('a[href^="#"]')) {
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (target) entries.push({ link, target });
    }
    if (!entries.length) return;
    const list = nav.closest(".theme-sidebar-content");
    let current;
    let followed = entries.find(entry => entry.link.hash === location.hash);
    const select = entry => {
      if (entry === current) return;
      current = entry;
      for (const { link } of entries) {
        link.classList.toggle("active", link === entry.link);
        if (link === entry.link) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
      // Keep the marked entry inside the sidebar's own scroll area when the list is longer than the window.
      if (!list?.getBoundingClientRect) return;
      const area = list.getBoundingClientRect();
      const item = entry.link.getBoundingClientRect();
      if (item.top < area.top) list.scrollTop -= area.top - item.top;
      else if (item.bottom > area.bottom) list.scrollTop += item.bottom - area.bottom;
    };
    let frame = 0;
    const hidden = target => {
      const box = target.getBoundingClientRect();
      return box.top === box.bottom;
    };
    const track = () => {
      frame = 0;
      // On a phone the open sidebar hides the sections; the mark stays where it was until they are shown again.
      if (entries.every(entry => hidden(entry.target))) return;
      if (followed) {
        const top = followed.target.getBoundingClientRect().top;
        if (top > -1 && top < innerHeight) return select(followed);
        followed = undefined;
      }
      select(entries.find(entry => entry.target.getBoundingClientRect().bottom > READING_LINE) ?? entries.at(-1));
    };
    nav.addEventListener(
      "click",
      event => {
        const link = event.target.closest?.("a");
        followed = entries.find(entry => entry.link === link) ?? followed;
      },
      { signal }
    );
    document.addEventListener(
      "scroll",
      () => {
        if (!frame) frame = requestAnimationFrame(track);
      },
      { passive: true, signal }
    );
    globalThis.addEventListener?.(
      "hashchange",
      () => {
        followed = entries.find(entry => entry.link.hash === location.hash) ?? followed;
        track();
      },
      { signal }
    );
    track();
  };
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
        // On a phone the open sidebar covers the page, so an "On this page" entry closes it to show its section.
        if (mobile.matches && !collapsed && event.target.closest?.("[data-theme-sidebar-outline] a")) {
          collapsed = true;
          update();
          return;
        }
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
    const sections = page.querySelector("[data-theme-sidebar-outline]");
    if (sections) outline(sections, signal);

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

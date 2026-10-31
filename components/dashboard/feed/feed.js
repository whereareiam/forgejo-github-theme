(() => {
  const DAY = 86400000;

  // Today and Yesterday follow the visitor's calendar; this week, last week and older weeks the time elapsed, as the
  // rows' own "3 days ago" and "last week" do. The browser words them in the page's language, as Forgejo has no keys.
  const bucket = (time, now) => {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const calendar = Math.floor((start.getTime() - new Date(time).setHours(0, 0, 0, 0)) / DAY);
    if (calendar <= 0) return [0, "day"];
    if (calendar === 1) return [-1, "day"];
    const elapsed = (now - time) / DAY;
    if (elapsed < 7) return [0, "week"];
    return [-Math.floor(elapsed / 7), "week"];
  };

  const setup = feed => {
    const list = feed.querySelector("[data-theme-feed-list]");
    const text = feed.querySelector("[data-theme-feed-text]")?.dataset ?? {};
    const lang = document.documentElement.lang || undefined;
    const relative = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
    const label = ([value, unit]) => {
      const words = relative.format(value, unit);
      return words.charAt(0).toLocaleUpperCase(lang) + words.slice(1);
    };

    // Rows carry their Unix time; a heading goes before the first row of each day group.
    const group = () => {
      for (const heading of list.querySelectorAll(".theme-feed-day")) heading.remove();
      const now = Date.now();
      let last;
      for (const item of list.querySelectorAll(".theme-feed-item")) {
        const when = bucket(Number(item.dataset.time) * 1000, now);
        const key = when.join(" ");
        if (key === last) continue;
        last = key;
        const heading = document.createElement("li");
        heading.className = "theme-feed-day";
        heading.setAttribute("role", "presentation");
        heading.textContent = label(when);
        item.before(heading);
      }
    };

    // The link to older activity appends the next page's rows instead of leaving Home.
    feed.addEventListener("click", async event => {
      const older = event.target.closest?.("[data-theme-feed-older]");
      if (!older || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      if (older.getAttribute("aria-busy") === "true") return;
      older.setAttribute("aria-busy", "true");
      try {
        const response = await fetch(older.href, { headers: { Accept: "text/html" } });
        if (!response.ok) throw new Error("Feed page failed");
        const page = new DOMParser().parseFromString(await response.text(), "text/html");
        const next = page.querySelector("[data-theme-feed]");
        if (!next) throw new Error("Feed page has no feed");
        list.append(...next.querySelectorAll("[data-theme-feed-list] > .theme-feed-item"));
        const nextOlder = next.querySelector("[data-theme-feed-older]");
        if (nextOlder) older.href = nextOlder.getAttribute("href");
        else older.remove();
        group();
        feed.dispatchEvent(new CustomEvent("theme-feed-loaded", { bubbles: true }));
      } catch {
        older.textContent = text.error ?? older.textContent;
      } finally {
        older.removeAttribute("aria-busy");
      }
    });

    group();
  };

  for (const feed of document.querySelectorAll("[data-theme-feed]")) setup(feed);
})();

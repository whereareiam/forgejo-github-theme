// GitHub's popular repositories on a person's Overview tab. Forgejo renders only the profile README there, so the
// cards come from the Repositories tab sorted by stars, the same server-rendered list a visitor would open next.
(() => {
  const LIMIT = 6;
  const section = document.querySelector("[data-theme-profile-popular]");
  const list = section?.querySelector("[data-theme-profile-popular-list]");
  const icon = section?.querySelector("[data-theme-profile-popular-icon]");
  if (!section || !list || !icon) return;

  const element = (tag, className) => {
    const node = document.createElement(tag);
    node.className = className;
    return node;
  };

  // Stars and forks are shown as on GitHub's cards: only when there are any.
  const counter = anchor => {
    if (!anchor || anchor.textContent.trim() === "0") return null;
    anchor.className = "profile-popular-meta-item";
    return anchor;
  };

  const card = repository => {
    const name = repository.querySelector(".flex-item-title > a.name:last-of-type");
    if (!name) return null;
    const item = element("li", "profile-popular-item");
    const box = element("div", "profile-popular-card");
    const heading = element("div", "profile-popular-heading");
    // A fork or mirror keeps the list's own icon for its kind; any other repository gets GitHub's repository icon.
    const kind = repository.querySelector(".profile-repo-kind");
    const symbol = element("span", "profile-popular-icon");
    if (kind) symbol.append(...kind.childNodes);
    else symbol.append(icon.content.cloneNode(true));
    name.className = "profile-popular-name";
    // The visibility, archived and template labels become the theme's muted pill label, as on GitHub's cards.
    const labels = [...repository.querySelectorAll(".flex-item-title .ui.label")];
    for (const label of labels) label.className = "ui label theme-label theme-label-muted";
    heading.append(symbol, name, ...labels);
    box.append(heading);

    const body = repository.querySelector(".flex-item-body");
    if (body) {
      const description = element("p", "profile-popular-description");
      description.append(...body.childNodes);
      box.append(description);
    }

    const meta = element("p", "profile-popular-meta");
    const trailing = repository.querySelector(".flex-item-trailing");
    const languageLink = trailing?.querySelector("a:has(> .color-icon)");
    if (languageLink) {
      const language = element("span", "profile-popular-meta-item");
      language.append(...languageLink.childNodes);
      meta.append(language);
    }
    for (const anchor of [
      counter(trailing?.querySelector('a[href$="/stars"]')),
      counter(trailing?.querySelector('a[href$="/forks"]')),
    ])
      if (anchor) meta.append(anchor);
    if (meta.childNodes.length) box.append(meta);

    item.append(box);
    return item;
  };

  const load = async () => {
    const url = new URL(section.dataset.themeProfilePopular, location.href);
    if (url.origin !== location.origin) return;
    const response = await fetch(url, { headers: { Accept: "text/html" } });
    if (!response.ok) return;
    const page = new DOMParser().parseFromString(await response.text(), "text/html");
    const repositories = [
      ...page.querySelectorAll("[data-theme-repository-results] .profile-repositories > .flex-item"),
    ];
    const cards = repositories.slice(0, LIMIT).map(card).filter(Boolean);
    if (!cards.length) return;
    list.replaceChildren(...cards);
    section.hidden = false;
    section.classList.add("theme-fade-in");
  };

  load().catch(() => {});
})();

(() => {
  // Outside the dashboard only the personal settings' organization list names the signed-in user's organizations;
  // it marks each entry with data-theme-organization. Loaded once, when the owner menu first opens.
  const load = async switcher => {
    if (switcher.dataset.state) return;
    switcher.dataset.state = "loading";
    const message = switcher.querySelector("[data-theme-owner-switcher-message]");
    const template = switcher.querySelector("template")?.content.firstElementChild;
    message.hidden = true;
    try {
      const response = await fetch(switcher.dataset.url, { headers: { Accept: "text/html" } });
      if (!response.ok) throw new Error("Organization list failed");
      const page = new DOMParser().parseFromString(await response.text(), "text/html");
      const rows = [...page.querySelectorAll("[data-theme-organization]")].map(entry => {
        const link = String(entry.dataset.themeOrganizationLink || "");
        const row = template.cloneNode(true);
        // Only same-origin paths, as the repository switcher does.
        row.href = link.startsWith("/") ? link : "#";
        if (link === switcher.dataset.current) row.setAttribute("aria-current", "true");
        const avatar = entry.querySelector("img.ui.avatar")?.getAttribute("src");
        const image = row.querySelector("img");
        if (avatar) image.src = avatar;
        else image.remove();
        row.querySelector("span").textContent = entry.dataset.themeOrganization ?? "";
        return row;
      });
      // Siblings of the account row, so the dropdown's row styles apply.
      switcher.before(...rows);
      switcher.dataset.state = "loaded";
    } catch {
      message.hidden = false;
      // The next opening tries again.
      delete switcher.dataset.state;
    } finally {
      switcher.removeAttribute("aria-busy");
    }
  };

  document.addEventListener(
    "toggle",
    event => {
      const dropdown = event.target;
      if (!dropdown.open) return;
      const switcher = dropdown.querySelector?.("[data-theme-owner-switcher]");
      if (switcher) void load(switcher);
    },
    true
  );
})();

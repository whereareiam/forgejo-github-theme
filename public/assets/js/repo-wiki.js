(() => {
  // GitHub's "Find a page…" field narrows the wiki sidebar's page list as you type.
  const pages = document.querySelector(".theme-wiki-pages");
  if (!pages) return;
  const rows = [...pages.querySelectorAll(".theme-wiki-pages-list > li")];
  const empty = pages.querySelector(".theme-wiki-pages-empty");
  pages.addEventListener("input", event => {
    if (event.target.id !== "wiki-pages-filter") return;
    const query = event.target.value.trim().toLowerCase();
    let visible = 0;
    for (const row of rows) {
      const name = row.querySelector(":scope > a")?.textContent.toLowerCase() ?? "";
      row.hidden = !name.includes(query);
      if (!row.hidden) visible++;
    }
    if (empty) empty.hidden = visible > 0;
  });
})();

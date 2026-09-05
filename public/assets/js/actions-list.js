(() => {
  const page = document.querySelector(".github-actions-list");
  if (!page) return;
  let query = "";
  function filter() {
    const input = page.querySelector("#actions-run-filter");
    if (input && input.value !== query) input.value = query;
    const rows = [...page.querySelectorAll(".run-list > .flex-item")];
    let visible = 0;
    for (const row of rows) {
      row.hidden = !row.textContent.toLowerCase().includes(query.toLowerCase());
      if (!row.hidden) visible++;
    }
    const empty = page.querySelector(".actions-search-empty");
    if (empty) empty.hidden = !query || visible > 0;
  }
  page.addEventListener("input", event => {
    if (event.target.id !== "actions-run-filter") return;
    query = event.target.value;
    filter();
  });
  // Preserve the filter when Forgejo's native polling morphs the run list.
  new MutationObserver(filter).observe(page, { childList: true, subtree: true });
  filter();
})();

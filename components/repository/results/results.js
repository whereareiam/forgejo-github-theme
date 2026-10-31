(() => {
  const form = document.querySelector("form[data-theme-repository-search]");
  let results = document.querySelector("[data-theme-repository-results]");
  if (!form || !results) return;

  let request;
  let revision = 0;
  const filterInputs = () => [...form.querySelectorAll('[data-theme-dropdown="multiple"] input[type="checkbox"]')];
  const updateClearButton = () => {
    const button = form.querySelector("[data-theme-clear-filters]");
    if (button) button.disabled = !filterInputs().some(input => input.checked);
  };
  const searchUrl = () => {
    const url = new URL(location.href);
    const params = new URLSearchParams(new FormData(form));
    params.delete("page");
    url.search = params.toString();
    url.hash = "";
    return url;
  };

  const update = async url => {
    request?.abort();
    request = new AbortController();
    const current = ++revision;
    results.querySelector(".theme-repository-error")?.remove();
    results.setAttribute("aria-busy", "true");
    const status = results.querySelector("[data-theme-repository-status]");
    // The status line carries Forgejo's words for loading and failing; the count announces the new results.
    const text = status?.dataset ?? {};
    if (status) status.textContent = text.loading ?? "";
    try {
      const response = await fetch(url, { signal: request.signal, headers: { Accept: "text/html" } });
      if (!response.ok) throw new Error("Repository search failed");
      if (response.url && new URL(response.url).origin !== new URL(location.href).origin)
        throw new Error("Unexpected repository search origin");
      const nextPage = new DOMParser().parseFromString(await response.text(), "text/html");
      const nextResults = nextPage.querySelector("[data-theme-repository-results]");
      if (!nextResults) throw new Error("Repository results are unavailable");
      if (current !== revision) return;
      results.replaceWith(nextResults);
      results = nextResults;
      for (const selector of ["[data-theme-repository-count]", "[data-theme-dropdown-label]"]) {
        const target = form.querySelector(selector);
        const source = nextPage.querySelector(selector);
        if (target && source) target.textContent = source.textContent;
      }
      if (url.href !== location.href) history.pushState({ themeRepositorySearch: true }, "", url);
      const announcement = results.querySelector("[data-theme-repository-status]");
      const count = form.querySelector("[data-theme-repository-count]");
      if (announcement && count) announcement.textContent = count.textContent;
    } catch (error) {
      if (error.name === "AbortError" || current !== revision) return;
      const message = document.createElement("p");
      message.className = "theme-repository-error";
      message.setAttribute("role", "alert");
      message.textContent = text.error ?? "";
      results.prepend(message);
      if (status) status.textContent = text.error ?? "";
    } finally {
      if (current === revision) results.removeAttribute("aria-busy");
    }
  };

  // Capture before Forgejo's native change handler, which navigates the entire page.
  form.addEventListener(
    "change",
    event => {
      event.stopImmediatePropagation();
      const input = event.target;
      if (input.type === "checkbox" && input.checked) {
        // Different criteria combine; positive and negative values of one criterion are exclusive.
        for (const other of filterInputs()) if (other !== input && other.name === input.name) other.checked = false;
      }
      updateClearButton();
      void update(searchUrl());
    },
    true
  );

  form.addEventListener("submit", event => {
    event.preventDefault();
    void update(searchUrl());
  });
  form.querySelector("[data-theme-clear-filters]")?.addEventListener("click", () => {
    for (const input of filterInputs()) input.checked = false;
    updateClearButton();
    void update(searchUrl());
  });
  document.addEventListener("click", event => {
    const link = event.target.closest("[data-theme-repository-pagination] a[href]");
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href);
    const current = new URL(location.href);
    if (url.origin !== current.origin || url.pathname !== current.pathname) return;
    event.preventDefault();
    void update(url);
  });
  // Restore server-rendered control state as well as results when traversing filter history.
  window.addEventListener("popstate", () => location.reload());
  updateClearButton();
})();

// Keep the release navigator in sync with its anchor and the visible release.
const releaseLinks = [...document.querySelectorAll(".github-release-toc a, .github-release-mobile-toc a")];
const releaseCards = [...document.querySelectorAll("#release-list.github-release-list > li")];
const releaseMenu = document.querySelector(".github-release-mobile-toc");
releaseMenu?.addEventListener("click", event => {
  if (event.target.closest("a")) releaseMenu.open = false;
});
document.addEventListener("click", event => {
  if (releaseMenu?.open && !releaseMenu.contains(event.target)) releaseMenu.open = false;
});
releaseMenu?.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  releaseMenu.open = false;
  releaseMenu.querySelector("summary").focus();
});
function selectRelease(id) {
  for (const link of releaseLinks) {
    if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}
if (releaseCards.length) {
  let pending = false;
  const update = () => {
    pending = false;
    const active = releaseCards.find(card => card.getBoundingClientRect().bottom > 80);
    if (active) selectRelease(active.id);
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("hashchange", () => selectRelease(location.hash.slice(1)));
  update();
  // Ask Forgejo for the actual latest release, including on filtered/paginated pages.
  const latest = document.querySelector(".github-release-latest");
  if (latest)
    fetch(latest.href, { method: "HEAD" })
      .then(response => {
        if (!response.ok) return;
        const target = new URL(response.url).pathname;
        for (const card of releaseCards) {
          const title = card.querySelector(".github-release-name > a");
          const badge = card.querySelector(".github-release-latest");
          if (badge && new URL(title.href).pathname === target) badge.hidden = false;
        }
      })
      .catch(() => {});
}

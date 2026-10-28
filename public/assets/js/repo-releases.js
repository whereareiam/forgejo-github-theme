// The latest release shows its badge. The shared sidebar controller marks
// the release in view in "On this page".
// Ask Forgejo for the actual latest release, including on filtered/paginated pages.
const latest = document.querySelector(".github-release-latest");
if (latest)
  fetch(latest.href, { method: "HEAD" })
    .then(response => {
      if (!response.ok) return;
      const target = new URL(response.url).pathname;
      for (const card of document.querySelectorAll(".github-release-list > .github-release")) {
        const title = card.querySelector(".github-release-title > a");
        const badge = card.querySelector(".github-release-latest");
        if (badge && new URL(title.href).pathname === target) badge.hidden = false;
      }
    })
    .catch(() => {});

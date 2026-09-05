(() => {
  const button = document.querySelector(".repo-latest-commit-details[aria-controls]");
  const body = button && document.getElementById(button.getAttribute("aria-controls"));
  if (!body) return;
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(expanded));
    body.hidden = !expanded;
  });
})();

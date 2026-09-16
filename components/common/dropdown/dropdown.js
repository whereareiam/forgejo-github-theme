(() => {
  const positionDropdown = dropdown => {
    const panel = dropdown.querySelector(".theme-dropdown-panel");
    panel.style.translate = "none";
    const rect = panel.getBoundingClientRect();
    const right = document.documentElement.clientWidth - 16;
    const offset = rect.left < 16 ? 16 - rect.left : rect.right > right ? right - rect.right : 0;
    panel.style.translate = `${offset}px 0`;
  };
  const closeDropdown = (dropdown, restoreFocus) => {
    dropdown.open = false;
    if (restoreFocus) dropdown.querySelector("summary")?.focus();
  };
  document.addEventListener("click", event => {
    const close = event.target.closest("[data-theme-dropdown-close]");
    if (close) closeDropdown(close.closest(".theme-dropdown"), true);
    const action = event.target.closest('[data-theme-dropdown="actions"] .theme-dropdown-action');
    if (action && !action.disabled) closeDropdown(action.closest(".theme-dropdown"), false);
    for (const dropdown of document.querySelectorAll(".theme-dropdown[open]"))
      if (!dropdown.contains(event.target)) closeDropdown(dropdown, false);
  });
  document.addEventListener(
    "change",
    event => {
      const input = event.target;
      const dropdown = input.closest('[data-theme-dropdown="single"]');
      if (!dropdown || input.type !== "radio" || !input.checked) return;
      const label = dropdown.querySelector("[data-theme-dropdown-label]");
      const selected = input.closest(".theme-dropdown-option")?.querySelector("span");
      if (label && selected) label.textContent = selected.textContent;
      closeDropdown(dropdown, true);
    },
    true
  );
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    for (const dropdown of document.querySelectorAll(".theme-dropdown[open]")) closeDropdown(dropdown, true);
  });
  document.addEventListener(
    "toggle",
    event => {
      const dropdown = event.target;
      if (!dropdown.matches(".theme-dropdown[open]")) return;
      positionDropdown(dropdown);
      for (const other of document.querySelectorAll(".theme-dropdown[open]"))
        if (other !== dropdown) closeDropdown(other, false);
    },
    true
  );
  window.addEventListener("resize", () => {
    for (const dropdown of document.querySelectorAll(".theme-dropdown[open]")) positionDropdown(dropdown);
  });
})();

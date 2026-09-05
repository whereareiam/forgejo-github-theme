(() => {
  if (document.documentElement.dataset.themeTreeNavigation) return;
  document.documentElement.dataset.themeTreeNavigation = "true";
  document.addEventListener("keydown", event => {
    const tree = event.target.closest(".file-tree");
    const row = event.target.closest('[role="treeitem"]');
    if (!tree || !row) return;
    const rows = [...tree.querySelectorAll('[role="treeitem"]')].filter(row => row.getClientRects().length);
    const index = rows.indexOf(row);
    let target;
    const toggle = () => {
      const disclosure = row.querySelector("[data-tree-disclosure]");
      if (disclosure) disclosure.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      else row.click();
    };
    if (event.key === "ArrowDown") target = rows[Math.min(index + 1, rows.length - 1)];
    if (event.key === "ArrowUp") target = rows[Math.max(index - 1, 0)];
    if (event.key === "Home") target = rows[0];
    if (event.key === "End") target = rows.at(-1);
    if (event.key === "ArrowRight" && row.matches(".item-directory")) {
      if (row.getAttribute("aria-expanded") === "false") toggle();
      else target = rows[index + 1];
    }
    if (event.key === "ArrowLeft") {
      if (row.matches(".item-directory") && row.getAttribute("aria-expanded") === "true") toggle();
      else target = row.parentElement.closest(".sub-items")?.previousElementSibling;
    }
    if ((event.key === "Enter" || event.key === " ") && row.matches(".item-directory")) {
      event.preventDefault();
      row.click();
    }
    if (target || ["ArrowLeft", "ArrowRight", " "].includes(event.key)) event.preventDefault();
    if (target) {
      row.tabIndex = -1;
      target.tabIndex = 0;
      target.focus();
    }
  });
})();

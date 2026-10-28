/* The file editor's commit dialog (repo/editor/commit_form). Commit changes… at the top right opens it with
   command="show-modal" and its Cancel and close buttons close it with command="close"; this script adds what those
   attributes cannot do, and opens and closes it in browsers without them. */
(() => {
  const dialog = document.getElementById("theme-commit-dialog");
  if (!dialog) return;
  const form = dialog.closest("form");
  const commit = document.getElementById("commit-button");
  const openers = document.querySelectorAll("[data-theme-commit-open]");

  // Forgejo's editor disables its commit button until the file or its path changes; Commit changes… follows it.
  const follow = () => {
    for (const opener of openers) opener.disabled = Boolean(commit?.disabled);
  };
  if (commit) {
    follow();
    new MutationObserver(follow).observe(commit, { attributes: true, attributeFilter: ["disabled"] });
  }

  // The file name sits outside the dialog. When it is missing or invalid, report it on the page instead of opening a
  // dialog whose submit the browser would refuse on a field behind it.
  const invalidOutside = () =>
    Array.from(form?.elements ?? []).find(
      element => !dialog.contains(element) && element.willValidate && !element.checkValidity()
    );
  const open = () => {
    const invalid = invalidOutside();
    if (invalid) invalid.reportValidity();
    else if (!dialog.open) dialog.showModal();
  };

  dialog.addEventListener("command", event => {
    if (event.command !== "show-modal") return;
    const invalid = invalidOutside();
    if (!invalid) return;
    event.preventDefault();
    invalid.reportValidity();
  });

  // Enter in the file name submits the form through its default button, Forgejo's commit button in the closed dialog.
  // GitHub opens the dialog instead, so the message and the branch are chosen before anything is committed.
  form?.addEventListener("submit", event => {
    if (dialog.open) return;
    event.preventDefault();
    open();
  });

  if (!("commandForElement" in HTMLButtonElement.prototype)) {
    document.addEventListener("click", event => {
      const button = event.target.closest?.('[commandfor="theme-commit-dialog"]');
      if (!button || button.disabled) return;
      if (button.getAttribute("command") === "close") dialog.close();
      else open();
    });
  }

  // Forgejo answers a refused commit (a branch name that is taken, an email that is not the user's) with the page
  // again and the field marked; open the dialog with the refused field focused.
  if (dialog.querySelector(".field.error")) {
    dialog.showModal();
    Array.from(dialog.querySelectorAll(".field.error :is(input, select)"))
      .find(field => field.getClientRects().length > 0)
      ?.focus();
  }
})();

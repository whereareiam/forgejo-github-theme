(() => {
  const actions = document.querySelector(".github-pull-review .merge-section > .pull-merge-actions");
  const form = actions?.querySelector(":scope > #pull-request-merge-form");
  if (!form) return;
  // Forgejo colours the collapsed button red whenever checks are unmet, even when the action
  // only schedules the merge. Forgejo 17 keeps that choice inside its Vue form and renders no
  // attribute for it; the button then appends textAutoMergeButtonWhenSucceed from the page data
  // to the merge style's label, so a label ending in it is a scheduled merge.
  const text = value => value?.replace(/\s+/g, " ").trim() ?? "";
  const sync = () => {
    const label = text(form.querySelector(".merge-button .button-text")?.textContent);
    const scheduled = text(window.config?.pageData?.pullRequestMergeForm?.textAutoMergeButtonWhenSucceed);
    actions.classList.toggle("merge-scheduled", Boolean(scheduled) && label.endsWith(scheduled));
  };
  sync();
  new MutationObserver(sync).observe(form, { childList: true, subtree: true, characterData: true });
})();

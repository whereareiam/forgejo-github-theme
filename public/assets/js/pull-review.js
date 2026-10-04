(() => {
  const decorate = () => {
    const box = document.querySelector(".github-pull-review .timeline-item.merge");
    const section = box?.querySelector(".merge-section");
    const form = section?.querySelector(":scope > #pull-request-merge-form");
    if (!form) return;
    const state = window.config?.pageData?.pullRequestMergeForm;
    const status = section.querySelector(":scope > .item");
    const check = status?.querySelector(":scope > .octicon-check");
    if (check && state?.canMergeNow && state?.allOverridableChecksOk) {
      box.classList.add("merge-ready");
      status.classList.add("pull-merge-status");
      const content = document.createElement("div");
      const title = document.createElement("h3");
      for (const node of [...status.childNodes]) if (node !== check) title.append(node);
      content.append(title);
      const note = status.nextElementSibling;
      if (note?.matches(".item:has(> .octicon-unlock, > .octicon-lock)")) {
        note.classList.add("pull-merge-note");
        content.append(note);
      }
      status.append(content);
    }
    const instructions = section.querySelector(":scope > details.collapsible");
    const actions = document.createElement("div");
    actions.className = "pull-merge-actions";
    actions.append(form);
    if (instructions) actions.append(instructions);
    section.append(actions);
    // Forgejo colours the collapsed button red whenever checks are unmet, even when the action
    // only schedules the merge. A label longer than the plain merge action is a scheduled merge.
    const plain = (state?.mergeStyles ?? []).map(style => style.textDoMerge?.trim());
    const sync = () => {
      const label = form.querySelector(".merge-button .button-text")?.textContent.replace(/\s+/g, " ").trim();
      actions.classList.toggle("merge-scheduled", Boolean(label) && !plain.includes(label));
    };
    sync();
    new MutationObserver(sync).observe(form, { childList: true, subtree: true, characterData: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", decorate, { once: true });
  else decorate();
})();

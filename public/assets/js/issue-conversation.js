(() => {
  const page = document.querySelector(".github-conversation");
  if (!page) return;
  const form = page.querySelector(".comment.form");
  if (form && !form.querySelector(".comment-editor-heading")) {
    const heading = document.createElement("h2");
    heading.className = "comment-editor-heading";
    heading.textContent = "Add a comment";
    form.prepend(heading);
  }
  if (form) {
    const dropzone = form.querySelector(".dropzone");
    const icon = page.parentElement.querySelector("#conversation-upload-icon")?.content.firstElementChild;
    if (dropzone && icon) {
      const decorateUpload = () => {
        const button = dropzone.querySelector(".dz-button");
        if (button && !button.querySelector("svg")) button.prepend(icon.cloneNode(true));
      };
      decorateUpload();
      new MutationObserver(decorateUpload).observe(dropzone, { childList: true, subtree: true });
    }

    const textarea = form.querySelector("textarea.markdown-text-editor");
    const submit = form.querySelector(".button-sequence > .primary.button");
    const files = form.querySelector(".dropzone .files");
    if (textarea && submit) {
      const updateSubmit = () => {
        submit.disabled = !textarea.value.trim() && !files?.children.length;
      };
      textarea.addEventListener("input", updateSubmit);
      if (files) new MutationObserver(updateSubmit).observe(files, { childList: true, subtree: true });
      updateSubmit();
    }
  }
  const first = page.querySelector(".comment.first");
  if (first && page.classList.contains("github-issue-conversation")) {
    const header = first.querySelector(".comment-header-left .text");
    if (header)
      for (const node of header.childNodes)
        if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/commented/, "opened");
  }
  // Place the existing reaction selector beside the body, preserving its native handlers.
  for (const comment of page.querySelectorAll(".timeline-item.comment:not(.form)")) {
    const reaction = comment.querySelector(".comment-header .select-reaction");
    const body = comment.querySelector(".comment-body");
    if (reaction && body) {
      const footer = document.createElement("div");
      footer.className = "conversation-body-actions";
      reaction.classList.remove("right");
      footer.append(reaction);
      body.append(footer);
    }
  }
  const sidebar = page.querySelector(".issue-content-right");
  if (sidebar) {
    // Keep Forgejo's controls and their sibling relationships together.
    const groups = [];
    let group = [];
    for (const child of [...sidebar.children]) {
      if (child.classList.contains("divider")) {
        groups.push({ nodes: group, divider: child });
        group = [];
      } else group.push(child);
    }
    if (group.length) groups.push({ nodes: group });
    const priority = group => {
      if (group.nodes.some(n => n.matches(".select-assignees-modify, .assignees"))) return 0;
      if (group.nodes.some(n => n.matches(".select-label, .labels"))) return 1;
      if (group.nodes.some(n => n.matches(".select-project"))) return 2;
      if (group.nodes.some(n => n.id === "milestone-section")) return 3;
      if (group.nodes.some(n => n.matches(".depending"))) return 4;
      if (group.nodes.some(n => n.matches(".select-branch"))) return 5;
      if (group.nodes.some(n => n.matches(".watching"))) return 6;
      if (group.nodes.some(n => n.matches("span.text") && /participant/i.test(n.textContent))) return 7;
      return 8;
    };
    groups.sort((a, b) => priority(a) - priority(b));
    for (const group of groups) sidebar.append(...group.nodes, ...(group.divider ? [group.divider] : []));
  }
})();

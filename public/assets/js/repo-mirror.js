(() => {
  for (const details of document.querySelectorAll(".repository-mirror")) {
    const summary = details.querySelector("summary");
    const panel = details.querySelector(".repository-mirror-info");
    let hovered = false;
    let dismissed = false;
    let pointerDown = false;

    const position = () => {
      panel.style.translate = "";
      panel.style.maxWidth = `${document.documentElement.clientWidth - 32}px`;
      const bounds = panel.getBoundingClientRect();
      const shift = Math.max(16 - bounds.left, Math.min(0, document.documentElement.clientWidth - 16 - bounds.right));
      panel.style.translate = `${shift}px 0`;
    };
    const open = () => {
      if (dismissed) return;
      details.open = true;
      position();
    };
    const close = () => {
      details.open = false;
    };

    details.addEventListener("pointerenter", event => {
      if (event.pointerType !== "mouse") return;
      hovered = true;
      dismissed = false;
      open();
    });
    details.addEventListener("pointerleave", () => {
      hovered = false;
      dismissed = false;
      if (!details.contains(document.activeElement)) close();
    });
    summary.addEventListener("pointerdown", () => {
      pointerDown = true;
    });
    // Touch browsers focus the summary after pointerup, just before click.
    // Keep that focus from opening it before the native click toggles it.
    document.addEventListener("pointerup", event => {
      if (event.target !== summary) pointerDown = false;
    });
    document.addEventListener("click", () => {
      pointerDown = false;
    });
    document.addEventListener("pointercancel", () => {
      pointerDown = false;
    });
    details.addEventListener("focusin", () => {
      if (!pointerDown) open();
    });
    details.addEventListener("focusout", event => {
      if (details.contains(event.relatedTarget)) return;
      dismissed = false;
      if (!hovered) close();
    });
    details.addEventListener("toggle", () => {
      if (details.open) position();
    });
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape" || !details.open) return;
      dismissed = true;
      if (details.contains(document.activeElement)) summary.focus();
      close();
    });
    document.addEventListener("pointerdown", event => {
      if (!details.contains(event.target)) close();
    });
    window.addEventListener("resize", () => {
      if (details.open) position();
    });
  }
})();

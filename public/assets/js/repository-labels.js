(() => {
  // Forgejo renders label colors inline. Keep their source colors as variables so
  // one component can adapt them to the active light/dark theme, including labels
  // replaced by native metadata controls or timeline updates.
  const selector = ".labels-list .ui.label, .ui.labels .ui.label";
  function decorate(label) {
    const color = label.style.backgroundColor;
    if (!color || color.startsWith("var(")) return;
    const channels = color.match(/[\d.]+/g)?.map(Number);
    if (!channels || channels.length < 3) return;
    const [red, green, blue] = channels;
    const perceived = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
    label.style.setProperty("--repository-label-color", color);
    if (label.style.color && !label.style.color.startsWith("var("))
      label.style.setProperty("--repository-label-foreground", label.style.color);
    label.style.setProperty("--repository-label-lighten", String(Math.max(0, (0.6 - perceived) * 100)));
    label.style.setProperty(
      "--repository-label-light-border",
      String(Math.max(0, Math.min(1, (perceived - 0.96) * 100)))
    );
    label.classList.add("repository-label");
    label.style.setProperty("background-color", "var(--repository-label-background)", "important");
    label.style.setProperty("color", "var(--repository-label-text)", "important");
  }
  function scan(node) {
    if (!(node instanceof Element)) return;
    if (node.matches(selector)) decorate(node);
    for (const label of node.querySelectorAll(selector)) decorate(label);
  }
  scan(document.body);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "attributes") {
        if (record.target.matches(selector)) decorate(record.target);
      } else for (const node of record.addedNodes) scan(node);
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
})();

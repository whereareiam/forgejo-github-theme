(() => {
  const toggle = document.getElementById("navbar-drawer-toggle");
  const drawer = document.getElementById("navbar-drawer");
  if (!toggle || !drawer || drawer.dataset.ready) return;
  drawer.dataset.ready = "true";

  const mobile = matchMedia("(max-width: 767.98px)");
  const extraStart = document.getElementById("navbar-extra-links-start");
  const extraEnd = document.getElementById("navbar-extra-links-end");
  const extraSlot = document.getElementById("navbar-drawer-extra-links");
  const extraNodes = [];
  for (let node = extraStart?.nextSibling; node && node !== extraEnd; node = node.nextSibling) {
    extraNodes.push(node);
  }

  toggle.addEventListener("click", () => {
    if (!mobile.matches || drawer.open) return;
    if (extraSlot && extraEnd) {
      extraSlot.hidden = !extraNodes.some(node => node.nodeType === 1 || node.textContent.trim());
      extraSlot.append(...extraNodes);
    }
    drawer.showModal();
    toggle.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("navbar-drawer-open");
  });

  drawer.querySelector(".navbar-drawer-close").addEventListener("click", () => drawer.close());
  drawer.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;
    const items = [...drawer.querySelectorAll("a[href], button, input, select, textarea, summary, [tabindex]")].filter(
      element => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length
    );
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  drawer.addEventListener("close", () => {
    extraEnd?.before(...extraNodes);
    toggle.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("navbar-drawer-open");
    drawer.querySelectorAll("details[open]").forEach(details => (details.open = false));
    if (mobile.matches) toggle.focus();
  });

  // A modal dialog reports backdrop clicks on the dialog itself. Check both
  // ends of the gesture so dragging from the panel onto the backdrop is safe.
  const outside = event => {
    const rect = drawer.getBoundingClientRect();
    return (
      event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
    );
  };
  let backdropPress = false;
  drawer.addEventListener("pointerdown", event => {
    backdropPress = event.target === drawer && outside(event);
  });
  drawer.addEventListener("click", event => {
    if (backdropPress && event.target === drawer && outside(event)) drawer.close();
    backdropPress = false;
  });
  mobile.addEventListener("change", () => {
    if (!mobile.matches && drawer.open) drawer.close();
  });
  window.addEventListener("pagehide", () => {
    if (drawer.open) drawer.close();
  });
})();

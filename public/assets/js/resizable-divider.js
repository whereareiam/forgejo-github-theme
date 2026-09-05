(() => {
  const CONFIGURATION = {
    activeClass: "resizable-divider-active",
    initializedValue: "true",
    keyboardStep: 16,
  };

  class ResizableDivider {
    constructor(divider) {
      this.divider = divider;
      this.container = document.querySelector(divider.dataset.resizeContainer);
      this.variable = divider.dataset.resizeVariable;
      this.storageKey = divider.dataset.resizeStorageKey;
      this.contentMinimumWidth = this.numberValue("resizeContentMinimumWidth", 0);
      this.defaultWidth = this.numberValue("resizeDefaultWidth", 0);
      this.maximumWidth = this.numberValue("resizeMaximumWidth", Number.POSITIVE_INFINITY);
      this.minimumWidth = this.numberValue("resizeMinimumWidth", 0);
    }

    initialize() {
      if (!this.container || !this.variable || this.divider.dataset.initialized === CONFIGURATION.initializedValue)
        return;

      this.divider.dataset.initialized = CONFIGURATION.initializedValue;
      this.setWidth(this.storedWidth());
      this.divider.addEventListener("pointerdown", event => this.startResize(event));
      this.divider.addEventListener("pointermove", event => this.resize(event));
      this.divider.addEventListener("pointerup", event => this.stopResize(event));
      this.divider.addEventListener("pointercancel", event => this.stopResize(event));
      this.divider.addEventListener("lostpointercapture", () =>
        document.body.classList.remove(CONFIGURATION.activeClass)
      );
      this.divider.addEventListener("keydown", event => this.resizeWithKeyboard(event));
      this.divider.addEventListener("dblclick", () => this.storeWidth(this.setWidth(this.defaultWidth)));
      new ResizeObserver(() => this.setWidth(Number(this.divider.getAttribute("aria-valuenow")))).observe(
        this.container
      );
    }

    numberValue(name, fallback) {
      const value = Number(this.divider.dataset[name]);
      return Number.isFinite(value) ? value : fallback;
    }

    storedWidth() {
      if (!this.storageKey) return this.defaultWidth;

      try {
        const storedWidth = Number.parseInt(window.localStorage.getItem(this.storageKey), 10);
        return Number.isFinite(storedWidth) ? storedWidth : this.defaultWidth;
      } catch {
        return this.defaultWidth;
      }
    }

    widthLimit() {
      return Math.max(
        this.minimumWidth,
        Math.min(this.maximumWidth, this.container.clientWidth - this.contentMinimumWidth)
      );
    }

    setWidth(width) {
      const limitedWidth = Math.min(Math.max(width, this.minimumWidth), this.widthLimit());
      this.container.style.setProperty(this.variable, `${limitedWidth}px`);
      this.divider.setAttribute("aria-valuenow", limitedWidth.toString());
      this.divider.setAttribute("aria-valuemax", this.widthLimit().toString());
      return limitedWidth;
    }

    startResize(event) {
      if (event.button !== 0) return;
      event.preventDefault();
      this.divider.setPointerCapture(event.pointerId);
      document.body.classList.add(CONFIGURATION.activeClass);
    }

    resize(event) {
      if (!this.divider.hasPointerCapture(event.pointerId)) return;
      if (event.buttons !== 1) {
        this.stopResize(event);
        return;
      }

      const width = this.setWidth(event.clientX - this.container.getBoundingClientRect().left);
      this.storeWidth(width);
    }

    stopResize(event) {
      if (!this.divider.hasPointerCapture(event.pointerId)) return;

      this.divider.releasePointerCapture(event.pointerId);
      document.body.classList.remove(CONFIGURATION.activeClass);
    }

    resizeWithKeyboard(event) {
      const currentWidth = Number.parseInt(this.divider.getAttribute("aria-valuenow"), 10);
      const nextWidth = this.keyboardWidth(event.key, currentWidth);
      if (nextWidth === undefined) return;

      event.preventDefault();
      this.storeWidth(this.setWidth(nextWidth));
    }

    keyboardWidth(key, currentWidth) {
      if (key === "ArrowLeft") return currentWidth - CONFIGURATION.keyboardStep;
      if (key === "ArrowRight") return currentWidth + CONFIGURATION.keyboardStep;
      if (key === "Home") return this.minimumWidth;
      if (key === "End") return this.widthLimit();
    }

    storeWidth(width) {
      try {
        if (this.storageKey) window.localStorage.setItem(this.storageKey, width.toString());
      } catch {
        /* Resizing still works without persistence. */
      }
    }
  }

  const initialize = () => {
    document.querySelectorAll(".resizable-divider").forEach(divider => new ResizableDivider(divider).initialize());
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
  else initialize();
})();

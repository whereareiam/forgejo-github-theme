import type { ReactNode } from "react";

export interface OverlayFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** OverlayFooter: part of the overlay component. */
export function OverlayFooter({ children, muted = false }: OverlayFooterProps) {
  return (
    <div
      className="overlay-footer"
      style={{
        color: muted ? "var(--color-fg-muted)" : "var(--color-fg-default)",
        background: muted ? "var(--color-canvas-muted)" : "var(--color-canvas-default)",
        borderColor: muted ? "var(--color-border-muted)" : "var(--color-border-default)",
        padding: "var(--size-spacing-4) var(--size-spacing-8)",
        gap: "var(--size-spacing-2)",
        borderRadius: "var(--size-radius-medium)",
      }}
    >
      {children}
    </div>
  );
}

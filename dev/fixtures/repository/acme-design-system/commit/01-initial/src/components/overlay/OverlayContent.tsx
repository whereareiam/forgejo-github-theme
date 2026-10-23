import type { ReactNode } from "react";

export interface OverlayContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** OverlayContent: part of the overlay component. */
export function OverlayContent({ children, muted = false }: OverlayContentProps) {
  return (
    <div
      className="overlay-content"
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

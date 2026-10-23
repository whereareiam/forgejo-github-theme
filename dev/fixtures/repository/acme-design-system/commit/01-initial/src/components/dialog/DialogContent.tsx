import type { ReactNode } from "react";

export interface DialogContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DialogContent: part of the dialog component. */
export function DialogContent({ children, muted = false }: DialogContentProps) {
  return (
    <div
      className="dialog-content"
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

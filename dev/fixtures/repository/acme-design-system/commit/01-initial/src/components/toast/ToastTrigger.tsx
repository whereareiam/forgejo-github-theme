import type { ReactNode } from "react";

export interface ToastTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ToastTrigger: part of the toast component. */
export function ToastTrigger({ children, muted = false }: ToastTriggerProps) {
  return (
    <div
      className="toast-trigger"
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

import type { ReactNode } from "react";

export interface ToastIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ToastIcon: part of the toast component. */
export function ToastIcon({ children, muted = false }: ToastIconProps) {
  return (
    <div
      className="toast-icon"
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

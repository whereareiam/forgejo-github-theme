import type { ReactNode } from "react";

export interface ProgressIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ProgressIcon: part of the progress component. */
export function ProgressIcon({ children, muted = false }: ProgressIconProps) {
  return (
    <div
      className="progress-icon"
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

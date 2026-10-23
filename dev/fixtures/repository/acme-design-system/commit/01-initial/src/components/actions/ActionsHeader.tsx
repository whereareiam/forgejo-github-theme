import type { ReactNode } from "react";

export interface ActionsHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ActionsHeader: part of the actions component. */
export function ActionsHeader({ children, muted = false }: ActionsHeaderProps) {
  return (
    <div
      className="actions-header"
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

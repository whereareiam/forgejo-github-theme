import type { ReactNode } from "react";

export interface ActionsFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ActionsFooter: part of the actions component. */
export function ActionsFooter({ children, muted = false }: ActionsFooterProps) {
  return (
    <div
      className="actions-footer"
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

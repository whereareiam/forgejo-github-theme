import type { ReactNode } from "react";

export interface MenuLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** MenuLabel: part of the menu component. */
export function MenuLabel({ children, muted = false }: MenuLabelProps) {
  return (
    <div
      className="menu-label"
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

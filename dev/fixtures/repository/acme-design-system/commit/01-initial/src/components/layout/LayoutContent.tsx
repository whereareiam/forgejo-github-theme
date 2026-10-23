import type { ReactNode } from "react";

export interface LayoutContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LayoutContent: part of the layout component. */
export function LayoutContent({ children, muted = false }: LayoutContentProps) {
  return (
    <div
      className="layout-content"
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

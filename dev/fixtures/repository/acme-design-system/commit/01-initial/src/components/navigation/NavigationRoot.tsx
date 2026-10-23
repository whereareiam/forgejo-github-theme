import type { ReactNode } from "react";

export interface NavigationRootProps {
  children?: ReactNode;
  muted?: boolean;
}

/** NavigationRoot: part of the navigation component. */
export function NavigationRoot({ children, muted = false }: NavigationRootProps) {
  return (
    <div
      className="navigation-root"
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

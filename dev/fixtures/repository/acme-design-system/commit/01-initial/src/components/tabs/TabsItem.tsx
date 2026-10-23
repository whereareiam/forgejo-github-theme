import type { ReactNode } from "react";

export interface TabsItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TabsItem: part of the tabs component. */
export function TabsItem({ children, muted = false }: TabsItemProps) {
  return (
    <div
      className="tabs-item"
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

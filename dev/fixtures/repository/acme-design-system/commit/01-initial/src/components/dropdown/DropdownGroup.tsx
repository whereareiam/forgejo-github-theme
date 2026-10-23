import type { ReactNode } from "react";

export interface DropdownGroupProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DropdownGroup: part of the dropdown component. */
export function DropdownGroup({ children, muted = false }: DropdownGroupProps) {
  return (
    <div
      className="dropdown-group"
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

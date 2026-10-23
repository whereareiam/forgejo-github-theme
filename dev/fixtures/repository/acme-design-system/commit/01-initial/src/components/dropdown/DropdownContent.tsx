import type { ReactNode } from "react";

export interface DropdownContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DropdownContent: part of the dropdown component. */
export function DropdownContent({ children, muted = false }: DropdownContentProps) {
  return (
    <div
      className="dropdown-content"
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

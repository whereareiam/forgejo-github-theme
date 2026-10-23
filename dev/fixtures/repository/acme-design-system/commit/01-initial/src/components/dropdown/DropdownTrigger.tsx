import type { ReactNode } from "react";

export interface DropdownTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DropdownTrigger: part of the dropdown component. */
export function DropdownTrigger({ children, muted = false }: DropdownTriggerProps) {
  return (
    <div
      className="dropdown-trigger"
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

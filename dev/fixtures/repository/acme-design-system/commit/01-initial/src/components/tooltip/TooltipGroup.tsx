import type { ReactNode } from "react";

export interface TooltipGroupProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TooltipGroup: part of the tooltip component. */
export function TooltipGroup({ children, muted = false }: TooltipGroupProps) {
  return (
    <div
      className="tooltip-group"
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

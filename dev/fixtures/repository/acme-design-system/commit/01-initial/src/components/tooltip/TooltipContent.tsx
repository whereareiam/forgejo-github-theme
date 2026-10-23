import type { ReactNode } from "react";

export interface TooltipContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TooltipContent: part of the tooltip component. */
export function TooltipContent({ children, muted = false }: TooltipContentProps) {
  return (
    <div
      className="tooltip-content"
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

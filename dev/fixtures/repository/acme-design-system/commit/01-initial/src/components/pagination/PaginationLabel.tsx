import type { ReactNode } from "react";

export interface PaginationLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** PaginationLabel: part of the pagination component. */
export function PaginationLabel({ children, muted = false }: PaginationLabelProps) {
  return (
    <div
      className="pagination-label"
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

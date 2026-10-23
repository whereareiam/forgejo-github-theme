import type { ReactNode } from "react";
import { tokens } from "../../tokens/pagination";

export interface PaginationItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** PaginationItem: part of the pagination component. */
export function PaginationItem({ children, muted = false }: PaginationItemProps) {
  return (
    <div
      className="pagination-item"
      style={{
        color: muted ? "var(--ds-fgColor-muted)" : "var(--ds-fgColor-default)",
        background: muted ? "var(--ds-bgColor-muted)" : "var(--ds-bgColor-default)",
        borderColor: muted ? "var(--ds-borderColor-muted)" : "var(--ds-borderColor-default)",
        padding: "var(--ds-space-4) var(--ds-space-8)",
        gap: "var(--ds-space-2)",
        borderRadius: "var(--ds-radius-medium)",
      }}
    >
      {children}
    </div>
  );
}

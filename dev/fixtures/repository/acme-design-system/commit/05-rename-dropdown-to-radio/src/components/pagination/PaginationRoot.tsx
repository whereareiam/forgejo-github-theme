import type { ReactNode } from "react";
import { tokens } from "../../tokens/pagination";

export interface PaginationRootProps {
  children?: ReactNode;
  muted?: boolean;
}

/** PaginationRoot: part of the pagination component. */
export function PaginationRoot({ children, muted = false }: PaginationRootProps) {
  return (
    <div
      className="pagination-root"
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

import type { ReactNode } from "react";
import { tokens } from "../../tokens/table";

export interface TableHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TableHeader: part of the table component. */
export function TableHeader({ children, muted = false }: TableHeaderProps) {
  return (
    <div
      className="table-header"
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

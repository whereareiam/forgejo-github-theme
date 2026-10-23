import type { ReactNode } from "react";
import { tokens } from "../../tokens/table";

export interface TableLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TableLabel: part of the table component. */
export function TableLabel({ children, muted = false }: TableLabelProps) {
  return (
    <div
      className="table-label"
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

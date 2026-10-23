import type { ReactNode } from "react";
import { tokens } from "../../tokens/table";

export interface TableIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TableIcon: part of the table component. */
export function TableIcon({ children, muted = false }: TableIconProps) {
  return (
    <div
      className="table-icon"
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

import type { ReactNode } from "react";
import { tokens } from "../../tokens/table";

export interface TableContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TableContent: part of the table component. */
export function TableContent({ children, muted = false }: TableContentProps) {
  return (
    <div
      className="table-content"
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

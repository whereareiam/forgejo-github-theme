import type { ReactNode } from "react";
import { tokens } from "../../tokens/select";

export interface SelectFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** SelectFooter: part of the select component. */
export function SelectFooter({ children, muted = false }: SelectFooterProps) {
  return (
    <div
      className="select-footer"
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

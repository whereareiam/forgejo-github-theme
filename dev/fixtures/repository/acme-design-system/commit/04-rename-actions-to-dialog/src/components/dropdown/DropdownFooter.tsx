import type { ReactNode } from "react";
import { tokens } from "../../tokens/dropdown";

export interface DropdownFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DropdownFooter: part of the dropdown component. */
export function DropdownFooter({ children, muted = false }: DropdownFooterProps) {
  return (
    <div
      className="dropdown-footer"
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

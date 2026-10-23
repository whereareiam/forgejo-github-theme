import type { ReactNode } from "react";
import { tokens } from "../../tokens/dropdown";

export interface DropdownLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DropdownLabel: part of the dropdown component. */
export function DropdownLabel({ children, muted = false }: DropdownLabelProps) {
  return (
    <div
      className="dropdown-label"
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

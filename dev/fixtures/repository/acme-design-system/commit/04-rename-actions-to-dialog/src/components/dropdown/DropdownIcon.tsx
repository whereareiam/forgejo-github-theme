import type { ReactNode } from "react";
import { tokens } from "../../tokens/dropdown";

export interface DropdownIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** DropdownIcon: part of the dropdown component. */
export function DropdownIcon({ children, muted = false }: DropdownIconProps) {
  return (
    <div
      className="dropdown-icon"
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

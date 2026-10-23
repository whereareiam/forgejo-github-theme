import type { ReactNode } from "react";
import { tokens } from "../../tokens/popover";

export interface PopoverIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** PopoverIcon: part of the popover component. */
export function PopoverIcon({ children, muted = false }: PopoverIconProps) {
  return (
    <div
      className="popover-icon"
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

import type { ReactNode } from "react";
import { tokens } from "../../tokens/popover";

export interface PopoverItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** PopoverItem: part of the popover component. */
export function PopoverItem({ children, muted = false }: PopoverItemProps) {
  return (
    <div
      className="popover-item"
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

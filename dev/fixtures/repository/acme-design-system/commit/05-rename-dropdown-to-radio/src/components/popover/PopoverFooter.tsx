import type { ReactNode } from "react";
import { tokens } from "../../tokens/popover";

export interface PopoverFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** PopoverFooter: part of the popover component. */
export function PopoverFooter({ children, muted = false }: PopoverFooterProps) {
  return (
    <div
      className="popover-footer"
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

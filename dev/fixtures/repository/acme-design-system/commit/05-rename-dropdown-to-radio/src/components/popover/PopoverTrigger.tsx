import type { ReactNode } from "react";
import { tokens } from "../../tokens/popover";

export interface PopoverTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** PopoverTrigger: part of the popover component. */
export function PopoverTrigger({ children, muted = false }: PopoverTriggerProps) {
  return (
    <div
      className="popover-trigger"
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

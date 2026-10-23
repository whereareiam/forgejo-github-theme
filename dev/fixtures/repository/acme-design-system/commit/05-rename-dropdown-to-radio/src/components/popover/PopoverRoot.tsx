import type { ReactNode } from "react";
import { tokens } from "../../tokens/popover";

export interface PopoverRootProps {
  children?: ReactNode;
  muted?: boolean;
}

/** PopoverRoot: part of the popover component. */
export function PopoverRoot({ children, muted = false }: PopoverRootProps) {
  return (
    <div
      className="popover-root"
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

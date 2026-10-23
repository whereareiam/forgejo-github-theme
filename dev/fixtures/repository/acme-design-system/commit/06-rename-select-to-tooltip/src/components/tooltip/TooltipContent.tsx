import type { ReactNode } from "react";
import { tokens } from "../../tokens/tooltip";

export interface TooltipContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TooltipContent: part of the tooltip component. */
export function TooltipContent({ children, muted = false }: TooltipContentProps) {
  return (
    <div
      className="tooltip-content"
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

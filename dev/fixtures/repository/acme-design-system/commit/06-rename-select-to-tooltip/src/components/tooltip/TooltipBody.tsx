import type { ReactNode } from "react";
import { tokens } from "../../tokens/tooltip";

export interface TooltipBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TooltipBody: part of the tooltip component. */
export function TooltipBody({ children, muted = false }: TooltipBodyProps) {
  return (
    <div
      className="tooltip-body"
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

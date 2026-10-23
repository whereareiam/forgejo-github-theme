import type { ReactNode } from "react";
import { tokens } from "../../tokens/radio";

export interface RadioHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** RadioHeader: part of the radio component. */
export function RadioHeader({ children, muted = false }: RadioHeaderProps) {
  return (
    <div
      className="radio-header"
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

import type { ReactNode } from "react";
import { tokens } from "../../tokens/radio";

export interface RadioGroupProps {
  children?: ReactNode;
  muted?: boolean;
}

/** RadioGroup: part of the radio component. */
export function RadioGroup({ children, muted = false }: RadioGroupProps) {
  return (
    <div
      className="radio-group"
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

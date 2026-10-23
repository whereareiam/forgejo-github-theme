import type { ReactNode } from "react";
import { tokens } from "../../tokens/checkbox";

export interface CheckboxTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** CheckboxTrigger: part of the checkbox component. */
export function CheckboxTrigger({ children, muted = false }: CheckboxTriggerProps) {
  return (
    <div
      className="checkbox-trigger"
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

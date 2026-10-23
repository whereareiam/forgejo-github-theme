import type { ReactNode } from "react";
import { tokens } from "../../tokens/button";

export interface ButtonTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ButtonTrigger: part of the button component. */
export function ButtonTrigger({ children, muted = false }: ButtonTriggerProps) {
  return (
    <div
      className="button-trigger"
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

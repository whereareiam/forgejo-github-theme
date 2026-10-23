import type { ReactNode } from "react";
import { tokens } from "../../tokens/spinner";

export interface SpinnerLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** SpinnerLabel: part of the spinner component. */
export function SpinnerLabel({ children, muted = false }: SpinnerLabelProps) {
  return (
    <div
      className="spinner-label"
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

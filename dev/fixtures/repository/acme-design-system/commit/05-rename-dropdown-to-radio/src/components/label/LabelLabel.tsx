import type { ReactNode } from "react";
import { tokens } from "../../tokens/label";

export interface LabelLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LabelLabel: part of the label component. */
export function LabelLabel({ children, muted = false }: LabelLabelProps) {
  return (
    <div
      className="label-label"
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

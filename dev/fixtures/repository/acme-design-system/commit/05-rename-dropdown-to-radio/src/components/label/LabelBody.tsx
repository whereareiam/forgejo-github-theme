import type { ReactNode } from "react";
import { tokens } from "../../tokens/label";

export interface LabelBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LabelBody: part of the label component. */
export function LabelBody({ children, muted = false }: LabelBodyProps) {
  return (
    <div
      className="label-body"
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

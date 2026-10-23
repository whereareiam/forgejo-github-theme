import type { ReactNode } from "react";
import { tokens } from "../../tokens/label";

export interface LabelHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LabelHeader: part of the label component. */
export function LabelHeader({ children, muted = false }: LabelHeaderProps) {
  return (
    <div
      className="label-header"
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

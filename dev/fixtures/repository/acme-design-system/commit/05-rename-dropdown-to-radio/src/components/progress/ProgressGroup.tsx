import type { ReactNode } from "react";
import { tokens } from "../../tokens/progress";

export interface ProgressGroupProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ProgressGroup: part of the progress component. */
export function ProgressGroup({ children, muted = false }: ProgressGroupProps) {
  return (
    <div
      className="progress-group"
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

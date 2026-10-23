import type { ReactNode } from "react";
import { tokens } from "../../tokens/progress";

export interface ProgressIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ProgressIcon: part of the progress component. */
export function ProgressIcon({ children, muted = false }: ProgressIconProps) {
  return (
    <div
      className="progress-icon"
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

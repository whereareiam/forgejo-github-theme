import type { ReactNode } from "react";
import { tokens } from "../../tokens/progress";

export interface ProgressHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ProgressHeader: part of the progress component. */
export function ProgressHeader({ children, muted = false }: ProgressHeaderProps) {
  return (
    <div
      className="progress-header"
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

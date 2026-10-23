import type { ReactNode } from "react";
import { tokens } from "../../tokens/timeline";

export interface TimelineLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TimelineLabel: part of the timeline component. */
export function TimelineLabel({ children, muted = false }: TimelineLabelProps) {
  return (
    <div
      className="timeline-label"
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

import type { ReactNode } from "react";
import { tokens } from "../../tokens/timeline";

export interface TimelineContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TimelineContent: part of the timeline component. */
export function TimelineContent({ children, muted = false }: TimelineContentProps) {
  return (
    <div
      className="timeline-content"
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

import type { ReactNode } from "react";
import { tokens } from "../../tokens/skeleton";

export interface SkeletonTriggerProps {
  children?: ReactNode;
  muted?: boolean;
}

/** SkeletonTrigger: part of the skeleton component. */
export function SkeletonTrigger({ children, muted = false }: SkeletonTriggerProps) {
  return (
    <div
      className="skeleton-trigger"
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

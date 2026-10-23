import type { ReactNode } from "react";
import { tokens } from "../../tokens/skeleton";

export interface SkeletonItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** SkeletonItem: part of the skeleton component. */
export function SkeletonItem({ children, muted = false }: SkeletonItemProps) {
  return (
    <div
      className="skeleton-item"
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

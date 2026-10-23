import type { ReactNode } from "react";

export interface SkeletonBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** SkeletonBody: part of the skeleton component. */
export function SkeletonBody({ children, muted = false }: SkeletonBodyProps) {
  return (
    <div
      className="skeleton-body"
      style={{
        color: muted ? "var(--color-fg-muted)" : "var(--color-fg-default)",
        background: muted ? "var(--color-canvas-muted)" : "var(--color-canvas-default)",
        borderColor: muted ? "var(--color-border-muted)" : "var(--color-border-default)",
        padding: "var(--size-spacing-4) var(--size-spacing-8)",
        gap: "var(--size-spacing-2)",
        borderRadius: "var(--size-radius-medium)",
      }}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";

export interface BadgeIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** BadgeIcon: part of the badge component. */
export function BadgeIcon({ children, muted = false }: BadgeIconProps) {
  return (
    <div
      className="badge-icon"
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

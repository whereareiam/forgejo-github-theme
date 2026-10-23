import type { ReactNode } from "react";

export interface AvatarLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** AvatarLabel: part of the avatar component. */
export function AvatarLabel({ children, muted = false }: AvatarLabelProps) {
  return (
    <div
      className="avatar-label"
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

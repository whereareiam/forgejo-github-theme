import type { ReactNode } from "react";

export interface LabelGroupProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LabelGroup: part of the label component. */
export function LabelGroup({ children, muted = false }: LabelGroupProps) {
  return (
    <div
      className="label-group"
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

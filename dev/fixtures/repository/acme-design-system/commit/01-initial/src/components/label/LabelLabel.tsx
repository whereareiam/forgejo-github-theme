import type { ReactNode } from "react";

export interface LabelLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LabelLabel: part of the label component. */
export function LabelLabel({ children, muted = false }: LabelLabelProps) {
  return (
    <div
      className="label-label"
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

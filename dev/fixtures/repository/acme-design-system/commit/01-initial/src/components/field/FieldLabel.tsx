import type { ReactNode } from "react";

export interface FieldLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** FieldLabel: part of the field component. */
export function FieldLabel({ children, muted = false }: FieldLabelProps) {
  return (
    <div
      className="field-label"
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

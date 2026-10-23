import type { ReactNode } from "react";

export interface FieldRootProps {
  children?: ReactNode;
  muted?: boolean;
}

/** FieldRoot: part of the field component. */
export function FieldRoot({ children, muted = false }: FieldRootProps) {
  return (
    <div
      className="field-root"
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

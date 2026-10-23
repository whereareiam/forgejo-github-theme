import type { ReactNode } from "react";

export interface RadioGroupProps {
  children?: ReactNode;
  muted?: boolean;
}

/** RadioGroup: part of the radio component. */
export function RadioGroup({ children, muted = false }: RadioGroupProps) {
  return (
    <div
      className="radio-group"
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

import type { ReactNode } from "react";

export interface RadioItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** RadioItem: part of the radio component. */
export function RadioItem({ children, muted = false }: RadioItemProps) {
  return (
    <div
      className="radio-item"
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

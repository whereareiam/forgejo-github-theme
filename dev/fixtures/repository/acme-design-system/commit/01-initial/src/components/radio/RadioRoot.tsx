import type { ReactNode } from "react";

export interface RadioRootProps {
  children?: ReactNode;
  muted?: boolean;
}

/** RadioRoot: part of the radio component. */
export function RadioRoot({ children, muted = false }: RadioRootProps) {
  return (
    <div
      className="radio-root"
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

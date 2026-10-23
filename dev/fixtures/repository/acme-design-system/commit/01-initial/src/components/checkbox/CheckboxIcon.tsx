import type { ReactNode } from "react";

export interface CheckboxIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** CheckboxIcon: part of the checkbox component. */
export function CheckboxIcon({ children, muted = false }: CheckboxIconProps) {
  return (
    <div
      className="checkbox-icon"
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

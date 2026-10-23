import type { ReactNode } from "react";

export interface CheckboxFooterProps {
  children?: ReactNode;
  muted?: boolean;
}

/** CheckboxFooter: part of the checkbox component. */
export function CheckboxFooter({ children, muted = false }: CheckboxFooterProps) {
  return (
    <div
      className="checkbox-footer"
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

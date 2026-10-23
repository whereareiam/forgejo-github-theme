import type { ReactNode } from "react";

export interface ButtonBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** ButtonBody: part of the button component. */
export function ButtonBody({ children, muted = false }: ButtonBodyProps) {
  return (
    <div
      className="button-body"
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

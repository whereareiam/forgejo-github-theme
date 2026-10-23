import type { ReactNode } from "react";

export interface TextHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** TextHeader: part of the text component. */
export function TextHeader({ children, muted = false }: TextHeaderProps) {
  return (
    <div
      className="text-header"
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

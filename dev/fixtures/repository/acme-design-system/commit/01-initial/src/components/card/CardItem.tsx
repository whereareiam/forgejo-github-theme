import type { ReactNode } from "react";

export interface CardItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** CardItem: part of the card component. */
export function CardItem({ children, muted = false }: CardItemProps) {
  return (
    <div
      className="card-item"
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

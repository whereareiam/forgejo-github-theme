import type { ReactNode } from "react";
import { tokens } from "../../tokens/card";

export interface CardContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** CardContent: part of the card component. */
export function CardContent({ children, muted = false }: CardContentProps) {
  return (
    <div
      className="card-content"
      style={{
        color: muted ? "var(--ds-fgColor-muted)" : "var(--ds-fgColor-default)",
        background: muted ? "var(--ds-bgColor-muted)" : "var(--ds-bgColor-default)",
        borderColor: muted ? "var(--ds-borderColor-muted)" : "var(--ds-borderColor-default)",
        padding: "var(--ds-space-4) var(--ds-space-8)",
        gap: "var(--ds-space-2)",
        borderRadius: "var(--ds-radius-medium)",
      }}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from "react";
import { tokens } from "../../tokens/card";

export interface CardLabelProps {
  children?: ReactNode;
  muted?: boolean;
}

/** CardLabel: part of the card component. */
export function CardLabel({ children, muted = false }: CardLabelProps) {
  return (
    <div
      className="card-label"
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

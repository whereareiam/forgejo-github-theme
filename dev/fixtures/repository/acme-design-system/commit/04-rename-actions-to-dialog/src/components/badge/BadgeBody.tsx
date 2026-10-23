import type { ReactNode } from "react";
import { tokens } from "../../tokens/badge";

export interface BadgeBodyProps {
  children?: ReactNode;
  muted?: boolean;
}

/** BadgeBody: part of the badge component. */
export function BadgeBody({ children, muted = false }: BadgeBodyProps) {
  return (
    <div
      className="badge-body"
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

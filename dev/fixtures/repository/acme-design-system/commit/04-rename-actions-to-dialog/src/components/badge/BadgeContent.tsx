import type { ReactNode } from "react";
import { tokens } from "../../tokens/badge";

export interface BadgeContentProps {
  children?: ReactNode;
  muted?: boolean;
}

/** BadgeContent: part of the badge component. */
export function BadgeContent({ children, muted = false }: BadgeContentProps) {
  return (
    <div
      className="badge-content"
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

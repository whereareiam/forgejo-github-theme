import type { ReactNode } from "react";
import { tokens } from "../../tokens/layout";

export interface LayoutIconProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LayoutIcon: part of the layout component. */
export function LayoutIcon({ children, muted = false }: LayoutIconProps) {
  return (
    <div
      className="layout-icon"
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

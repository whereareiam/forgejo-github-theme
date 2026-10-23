import type { ReactNode } from "react";
import { tokens } from "../../tokens/layout";

export interface LayoutHeaderProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LayoutHeader: part of the layout component. */
export function LayoutHeader({ children, muted = false }: LayoutHeaderProps) {
  return (
    <div
      className="layout-header"
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

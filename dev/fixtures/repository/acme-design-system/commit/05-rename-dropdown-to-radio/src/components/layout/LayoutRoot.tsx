import type { ReactNode } from "react";
import { tokens } from "../../tokens/layout";

export interface LayoutRootProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LayoutRoot: part of the layout component. */
export function LayoutRoot({ children, muted = false }: LayoutRootProps) {
  return (
    <div
      className="layout-root"
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

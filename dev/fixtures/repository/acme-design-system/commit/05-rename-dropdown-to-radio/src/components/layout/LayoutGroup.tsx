import type { ReactNode } from "react";
import { tokens } from "../../tokens/layout";

export interface LayoutGroupProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LayoutGroup: part of the layout component. */
export function LayoutGroup({ children, muted = false }: LayoutGroupProps) {
  return (
    <div
      className="layout-group"
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

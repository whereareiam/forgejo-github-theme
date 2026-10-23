import type { ReactNode } from "react";
import { tokens } from "../../tokens/layout";

export interface LayoutItemProps {
  children?: ReactNode;
  muted?: boolean;
}

/** LayoutItem: part of the layout component. */
export function LayoutItem({ children, muted = false }: LayoutItemProps) {
  return (
    <div
      className="layout-item"
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
